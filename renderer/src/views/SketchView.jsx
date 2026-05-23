/**
 * BCS Sketch Engine — 2D floorplan canvas with auto-estimate generation.
 *
 * Architecture:
 *   Canvas coords (px) = feet * BASE_PX * zoom + pan offset
 *   All room data stored in feet (integers, snapped to grid)
 *   Geometry → Rule Engine → Line Items → Estimate API
 */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  MousePointer2, PenTool, Trash2, FileText, ZoomIn, ZoomOut,
  RotateCcw, Save, Plus, X, ChevronDown, ChevronRight,
  Droplets, Flame, Wind, AlertTriangle, LayoutGrid, Download,
} from 'lucide-react';
import { clientsAPI, estimatesAPI } from '../api-client';
import { calculateRoom, totalStats } from '../lib/geometry';
import { generateLineItems, DAMAGE_META } from '../engine/scopeRules';

// ── Constants ────────────────────────────────────────────────────────────────
const BASE_PX  = 24;   // pixels per foot at zoom 1.0
const HANDLE_R = 6;    // resize handle half-size in px
const MIN_FT   = 2;    // minimum room dimension in feet

const ROOM_STYLE = {
  none:  { fill: 'rgba(148,163,184,0.15)', stroke: '#94a3b8' },
  water: { fill: 'rgba(59,130,246,0.15)',  stroke: '#3b82f6' },
  mold:  { fill: 'rgba(34,197,94,0.15)',   stroke: '#22c55e' },
  fire:  { fill: 'rgba(249,115,22,0.15)',  stroke: '#f97316' },
  smoke: { fill: 'rgba(245,158,11,0.15)',  stroke: '#f59e0b' },
};

const DAMAGE_ICONS = { water: Droplets, mold: Wind, fire: Flame, smoke: AlertTriangle };

// ── Helpers ──────────────────────────────────────────────────────────────────
let _uid = Date.now();
const mkId   = () => ++_uid;
const mkRoom = (x, y, w, h) => ({ id: mkId(), name: `Room ${_uid % 1000}`, x, y, w, h, ceilH: 8, damages: [] });

const ftToPx = (ft, origin, zoom) => origin + ft * BASE_PX * zoom;
const pxToFt = (px, origin, zoom) => Math.round((px - origin) / (BASE_PX * zoom));

function getHandles(room, pan, zoom) {
  const rx = ftToPx(room.x, pan.x, zoom), ry = ftToPx(room.y, pan.y, zoom);
  const rw = room.w * BASE_PX * zoom,      rh = room.h * BASE_PX * zoom;
  return [
    { t: 'nw', x: rx,        y: ry        }, { t: 'n',  x: rx+rw/2, y: ry        },
    { t: 'ne', x: rx+rw,     y: ry        }, { t: 'e',  x: rx+rw,   y: ry+rh/2  },
    { t: 'se', x: rx+rw,     y: ry+rh    }, { t: 's',  x: rx+rw/2, y: ry+rh    },
    { t: 'sw', x: rx,        y: ry+rh    }, { t: 'w',  x: rx,      y: ry+rh/2  },
  ];
}

function hitHandle(handles, cx, cy) {
  return handles.find(h => Math.abs(cx - h.x) <= HANDLE_R + 2 && Math.abs(cy - h.y) <= HANDLE_R + 2) || null;
}

function hitRoom(room, cx, cy, pan, zoom) {
  const rx = ftToPx(room.x, pan.x, zoom), ry = ftToPx(room.y, pan.y, zoom);
  const rw = room.w * BASE_PX * zoom,      rh = room.h * BASE_PX * zoom;
  return cx >= rx && cx <= rx + rw && cy >= ry && cy <= ry + rh;
}

// ── Canvas draw function ─────────────────────────────────────────────────────
function drawCanvas(canvas, rooms, selectedId, drawing, zoom, pan) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  // Background
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, W, H);

  // Grid
  const pxPerFt = BASE_PX * zoom;
  ctx.lineWidth = 0.5;
  for (let x = pan.x % pxPerFt; x < W; x += pxPerFt) {
    const ft = Math.round((x - pan.x) / pxPerFt);
    ctx.strokeStyle = ft % 10 === 0 ? '#cbd5e1' : ft % 5 === 0 ? '#e2e8f0' : '#f1f5f9';
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = pan.y % pxPerFt; y < H; y += pxPerFt) {
    const ft = Math.round((y - pan.y) / pxPerFt);
    ctx.strokeStyle = ft % 10 === 0 ? '#cbd5e1' : ft % 5 === 0 ? '#e2e8f0' : '#f1f5f9';
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  // Scale ruler (bottom-left)
  const rulerFt = 10;
  const rulerPx = rulerFt * pxPerFt;
  const ry = H - 32, rx = 20;
  ctx.strokeStyle = '#475569'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx + rulerPx, ry); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(rx, ry - 5); ctx.lineTo(rx, ry + 5); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(rx + rulerPx, ry - 5); ctx.lineTo(rx + rulerPx, ry + 5); ctx.stroke();
  ctx.fillStyle = '#475569'; ctx.font = '11px Inter, system-ui';
  ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
  ctx.fillText(`${rulerFt} ft`, rx + rulerPx / 2, ry - 6);

  // Rooms
  for (const room of rooms) {
    const rrx = ftToPx(room.x, pan.x, zoom), rry = ftToPx(room.y, pan.y, zoom);
    const rrw = room.w * pxPerFt,             rrh = room.h * pxPerFt;
    const primary = room.damages[0] || 'none';
    const style   = ROOM_STYLE[primary] || ROOM_STYLE.none;
    const isSel   = room.id === selectedId;

    // Shadow for selected
    if (isSel) {
      ctx.shadowColor = 'rgba(59,130,246,0.3)';
      ctx.shadowBlur  = 10;
    }

    ctx.fillStyle = style.fill;
    ctx.fillRect(rrx, rry, rrw, rrh);

    ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0;

    ctx.strokeStyle = isSel ? '#1d4ed8' : style.stroke;
    ctx.lineWidth   = isSel ? 2.5 : 1.5;
    ctx.strokeRect(rrx, rry, rrw, rrh);

    // Labels
    if (rrw > 40 && rrh > 28) {
      const fontSize = Math.min(13, pxPerFt * 0.65);
      ctx.fillStyle = '#1e293b';
      ctx.font      = `600 ${fontSize}px Inter, system-ui, sans-serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(room.name, rrx + rrw / 2, rry + rrh / 2 - (rrh > 50 ? 9 : 0));

      if (rrh > 50) {
        ctx.fillStyle = '#64748b';
        ctx.font      = `${Math.min(11, pxPerFt * 0.5)}px Inter, system-ui`;
        ctx.fillText(`${room.w}' × ${room.h}'  •  ${room.w * room.h} SF`, rrx + rrw / 2, rry + rrh / 2 + 9);
      }
    }

    // Damage dots (bottom-left corner)
    room.damages.forEach((d, i) => {
      const meta = DAMAGE_META.find(m => m.key === d);
      if (!meta) return;
      ctx.fillStyle = meta.color;
      ctx.beginPath();
      ctx.arc(rrx + 9 + i * 14, rry + rrh - 9, 5, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // Resize handles for selected room
  if (selectedId) {
    const room = rooms.find(r => r.id === selectedId);
    if (room) {
      getHandles(room, pan, zoom).forEach(h => {
        ctx.fillStyle   = 'white';
        ctx.strokeStyle = '#1d4ed8';
        ctx.lineWidth   = 2;
        ctx.fillRect(h.x - HANDLE_R, h.y - HANDLE_R, HANDLE_R * 2, HANDLE_R * 2);
        ctx.strokeRect(h.x - HANDLE_R, h.y - HANDLE_R, HANDLE_R * 2, HANDLE_R * 2);
      });
    }
  }

  // In-progress draw rectangle
  if (drawing) {
    const dx0 = ftToPx(Math.min(drawing.x0, drawing.x1), pan.x, zoom);
    const dy0 = ftToPx(Math.min(drawing.y0, drawing.y1), pan.y, zoom);
    const dx1 = ftToPx(Math.max(drawing.x0, drawing.x1), pan.x, zoom);
    const dy1 = ftToPx(Math.max(drawing.y0, drawing.y1), pan.y, zoom);
    ctx.fillStyle = 'rgba(59,130,246,0.1)';
    ctx.fillRect(dx0, dy0, dx1 - dx0, dy1 - dy0);
    ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 2;
    ctx.setLineDash([6, 3]);
    ctx.strokeRect(dx0, dy0, dx1 - dx0, dy1 - dy0);
    ctx.setLineDash([]);

    // Live dimension label
    const w = Math.abs(drawing.x1 - drawing.x0), h = Math.abs(drawing.y1 - drawing.y0);
    if (w > 0 && h > 0) {
      const midX = (dx0 + dx1) / 2, midY = (dy0 + dy1) / 2;
      ctx.fillStyle = 'rgba(29,78,216,0.92)';
      const label = `${w}' × ${h}'  (${w * h} SF)`;
      ctx.font = 'bold 12px Inter, system-ui';
      const tw = ctx.measureText(label).width;
      ctx.fillRect(midX - tw / 2 - 8, midY - 12, tw + 16, 24);
      ctx.fillStyle = 'white'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(label, midX, midY);
    }
  }
}

// ── Component ────────────────────────────────────────────────────────────────
export const SketchView = () => {
  const canvasRef = useRef(null);

  // Canvas state
  const [rooms,      setRooms]      = useState([]);
  const [tool,       setTool]       = useState('select');
  const [zoom,       setZoom]       = useState(1);
  const [pan,        setPan]        = useState({ x: 60, y: 60 });
  const [selectedId, setSelectedId] = useState(null);
  const [drawing,    setDrawing]    = useState(null);

  // Sketch persistence
  const [sketchName, setSketchName] = useState('New Sketch');
  const [savedId,    setSavedId]    = useState(null);
  const [savedList,  setSavedList]  = useState([]);
  const [showSaved,  setShowSaved]  = useState(false);

  // Estimate generation
  const [clients,       setClients]       = useState([]);
  const [clientId,      setClientId]      = useState('');
  const [estimateTitle, setEstimateTitle] = useState('Sketch Estimate');
  const [lineItems,     setLineItems]     = useState([]);
  const [showEstimate,  setShowEstimate]  = useState(false);
  const [generating,    setGenerating]    = useState(false);
  const [savedEstimate, setSavedEstimate] = useState(null);

  // Mouse drag bookkeeping (ref so no re-render)
  const drag = useRef({ active: false, handle: null, startCx: 0, startCy: 0, roomSnap: null });

  const selectedRoom = rooms.find(r => r.id === selectedId) || null;
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

  // ── Canvas resize observer ───────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver(() => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    });
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  // ── Redraw ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.width) return;
    drawCanvas(canvas, rooms, selectedId, drawing, zoom, pan);
  }, [rooms, selectedId, drawing, zoom, pan]);

  // ── Load clients ─────────────────────────────────────────────────────────
  useEffect(() => {
    clientsAPI.getAll().then(setClients).catch(() => {});
    fetch(`${API_BASE}/sketches`).then(r => r.json()).then(setSavedList).catch(() => {});
  }, []);

  // ── Mouse events ─────────────────────────────────────────────────────────
  const getCursor = (cx, cy) => {
    if (tool === 'draw') return 'crosshair';
    if (selectedRoom) {
      const h = hitHandle(getHandles(selectedRoom, pan, zoom), cx, cy);
      if (h) {
        const map = { nw: 'nw-resize', n: 'n-resize', ne: 'ne-resize', e: 'e-resize',
                      se: 'se-resize', s: 's-resize', sw: 'sw-resize', w: 'w-resize' };
        return map[h.t] || 'pointer';
      }
      if (hitRoom(selectedRoom, cx, cy, pan, zoom)) return 'grab';
    }
    for (let i = rooms.length - 1; i >= 0; i--) {
      if (hitRoom(rooms[i], cx, cy, pan, zoom)) return 'pointer';
    }
    return 'default';
  };

  const onMouseMove = useCallback((e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const cx = e.clientX - rect.left, cy = e.clientY - rect.top;
    canvasRef.current.style.cursor = getCursor(cx, cy);

    if (!drag.current.active) return;

    if (tool === 'draw') {
      setDrawing(d => d ? { ...d, x1: pxToFt(cx, pan.x, zoom), y1: pxToFt(cy, pan.y, zoom) } : d);
      return;
    }

    const dxPx = cx - drag.current.startCx, dyPx = cy - drag.current.startCy;
    const dxFt = Math.round(dxPx / (BASE_PX * zoom));
    const dyFt = Math.round(dyPx / (BASE_PX * zoom));
    const orig = drag.current.roomSnap;
    if (!orig) return;
    const handle = drag.current.handle;

    setRooms(rs => rs.map(r => {
      if (r.id !== selectedId) return r;
      if (handle === 'move') {
        return { ...r, x: orig.x + dxFt, y: orig.y + dyFt };
      }
      let { x, y, w, h } = orig;
      if (handle.includes('e')) w = Math.max(MIN_FT, orig.w + dxFt);
      if (handle.includes('w')) { x = orig.x + dxFt; w = Math.max(MIN_FT, orig.w - dxFt); }
      if (handle.includes('s')) h = Math.max(MIN_FT, orig.h + dyFt);
      if (handle.includes('n')) { y = orig.y + dyFt; h = Math.max(MIN_FT, orig.h - dyFt); }
      return { ...r, x, y, w, h };
    }));
  }, [tool, selectedId, pan, zoom, rooms]);

  const onMouseDown = useCallback((e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const cx = e.clientX - rect.left, cy = e.clientY - rect.top;
    drag.current.active  = true;
    drag.current.startCx = cx;
    drag.current.startCy = cy;

    if (tool === 'draw') {
      const fx = pxToFt(cx, pan.x, zoom), fy = pxToFt(cy, pan.y, zoom);
      setDrawing({ x0: fx, y0: fy, x1: fx, y1: fy });
      return;
    }

    // Check handles on selected room first
    if (selectedRoom) {
      const h = hitHandle(getHandles(selectedRoom, pan, zoom), cx, cy);
      if (h) {
        drag.current.handle   = h.t;
        drag.current.roomSnap = { ...selectedRoom };
        return;
      }
    }

    // Check all rooms (top-to-bottom)
    for (let i = rooms.length - 1; i >= 0; i--) {
      if (hitRoom(rooms[i], cx, cy, pan, zoom)) {
        setSelectedId(rooms[i].id);
        drag.current.handle   = 'move';
        drag.current.roomSnap = { ...rooms[i] };
        return;
      }
    }

    // Click empty space = deselect
    setSelectedId(null);
  }, [tool, selectedRoom, rooms, pan, zoom]);

  const onMouseUp = useCallback((e) => {
    if (!drag.current.active) return;
    drag.current.active = false;

    if (tool === 'draw' && drawing) {
      const x = Math.min(drawing.x0, drawing.x1), y = Math.min(drawing.y0, drawing.y1);
      const w = Math.abs(drawing.x1 - drawing.x0), h = Math.abs(drawing.y1 - drawing.y0);
      if (w >= MIN_FT && h >= MIN_FT) {
        const room = mkRoom(x, y, w, h);
        setRooms(rs => [...rs, room]);
        setSelectedId(room.id);
      }
      setDrawing(null);
    }

    drag.current.handle   = null;
    drag.current.roomSnap = null;
  }, [tool, drawing]);

  // Wheel zoom
  const onWheel = useCallback((e) => {
    e.preventDefault();
    setZoom(z => Math.min(4, Math.max(0.25, z - e.deltaY * 0.001)));
  }, []);

  // ── Room property helpers ────────────────────────────────────────────────
  const updateRoom = (id, patch) => setRooms(rs => rs.map(r => r.id === id ? { ...r, ...patch } : r));

  const toggleDamage = (id, key) => {
    setRooms(rs => rs.map(r => {
      if (r.id !== id) return r;
      const has = r.damages.includes(key);
      return { ...r, damages: has ? r.damages.filter(d => d !== key) : [...r.damages, key] };
    }));
  };

  const deleteRoom = (id) => {
    setRooms(rs => rs.filter(r => r.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  // ── Estimate generation ──────────────────────────────────────────────────
  const buildLineItems = () => {
    const items = generateLineItems(rooms);
    setLineItems(items);
    setShowEstimate(true);
  };

  const saveEstimate = async () => {
    if (!lineItems.length) return;
    setGenerating(true);
    try {
      const subtotal = lineItems.reduce((s, i) => s + i.subtotal, 0);
      const overhead = subtotal * 0.10;
      const profit   = subtotal * 0.12;
      const tax      = (subtotal + overhead + profit) * 0.0875;
      const total    = subtotal + overhead + profit + tax;

      const estimate = await estimatesAPI.create({
        title:        estimateTitle,
        client_id:    clientId || null,
        status:       'draft',
        description:  `Generated from sketch: ${sketchName}\n\n` +
                      lineItems.map(i => `[${i.room_name}] ${i.description}: ${i.qty} ${i.unit} @ $${i.unit_price}`).join('\n'),
        subtotal:     Math.round(subtotal * 100) / 100,
        tax_rate:     8.75,
        tax_amount:   Math.round(tax * 100) / 100,
        total_amount: Math.round(total * 100) / 100,
      });
      setSavedEstimate(estimate);
    } catch (err) {
      console.error('Failed to save estimate:', err);
    }
    setGenerating(false);
  };

  // ── Save / load sketch ───────────────────────────────────────────────────
  const saveSketch = async () => {
    try {
      const payload = { name: sketchName, client_id: clientId || null, rooms };
      if (savedId) {
        await fetch(`${API_BASE}/sketches/${savedId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      } else {
        const r = await fetch(`${API_BASE}/sketches`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const d = await r.json();
        setSavedId(d.id);
      }
      const list = await fetch(`${API_BASE}/sketches`).then(r => r.json());
      setSavedList(list);
    } catch (err) {
      console.error('Save sketch failed:', err);
    }
  };

  const loadSketch = async (id) => {
    try {
      const d = await fetch(`${API_BASE}/sketches/${id}`).then(r => r.json());
      setRooms(d.rooms || []);
      setSketchName(d.name);
      setSavedId(d.id);
      setClientId(d.client_id || '');
      setSelectedId(null);
      setShowSaved(false);
    } catch (err) {
      console.error('Load sketch failed:', err);
    }
  };

  const newSketch = () => {
    setRooms([]); setSketchName('New Sketch'); setSavedId(null);
    setSelectedId(null); setShowEstimate(false); setLineItems([]);
  };

  // ── Stats ────────────────────────────────────────────────────────────────
  const stats = totalStats(rooms);
  const estimateTotal = lineItems.reduce((s, i) => s + i.subtotal, 0);

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="flex h-full bg-gray-100 overflow-hidden">

      {/* ── Left Panel ──────────────────────────────────────────────────── */}
      <div className="w-60 flex-shrink-0 bg-slate-900 text-gray-100 flex flex-col overflow-hidden">

        {/* Header */}
        <div className="px-4 py-4 border-b border-slate-700">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-1">Sketch Engine</h2>
          <input
            value={sketchName}
            onChange={e => setSketchName(e.target.value)}
            className="w-full bg-slate-800 text-white text-sm px-3 py-1.5 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Tools */}
        <div className="px-4 py-3 border-b border-slate-700">
          <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider">Tools</p>
          <div className="flex gap-2">
            {[
              { id: 'select', Icon: MousePointer2, label: 'Select' },
              { id: 'draw',   Icon: PenTool,       label: 'Draw Room' },
            ].map(({ id, Icon, label }) => (
              <button
                key={id}
                onClick={() => setTool(id)}
                title={label}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  tool === id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>
        </div>

        {/* Zoom */}
        <div className="px-4 py-3 border-b border-slate-700 flex items-center gap-2">
          <button onClick={() => setZoom(z => Math.max(0.25, z - 0.25))} className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg"><ZoomOut size={14} /></button>
          <span className="flex-1 text-center text-xs font-mono text-slate-300">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(z => Math.min(4, z + 0.25))} className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg"><ZoomIn size={14} /></button>
          <button onClick={() => { setZoom(1); setPan({ x: 60, y: 60 }); }} className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg" title="Reset view"><RotateCcw size={14} /></button>
        </div>

        {/* Room List */}
        <div className="flex-1 overflow-y-auto py-2">
          <p className="px-4 py-1 text-xs text-slate-500 uppercase tracking-wider">Rooms ({rooms.length})</p>
          {rooms.length === 0 && (
            <p className="px-4 py-6 text-xs text-slate-500 text-center">Use the Draw tool to add rooms to the canvas</p>
          )}
          {rooms.map(room => {
            const c = calculateRoom(room);
            return (
              <button
                key={room.id}
                onClick={() => setSelectedId(room.id)}
                className={`w-full text-left px-4 py-2.5 border-l-2 transition-colors ${
                  selectedId === room.id
                    ? 'border-blue-500 bg-slate-700'
                    : 'border-transparent hover:bg-slate-800'
                }`}
              >
                <p className="text-sm font-medium text-white truncate">{room.name}</p>
                <p className="text-xs text-slate-400">{room.w}' × {room.h}'  •  {c.area} SF</p>
                {room.damages.length > 0 && (
                  <div className="flex gap-1 mt-1">
                    {room.damages.map(d => {
                      const meta = DAMAGE_META.find(m => m.key === d);
                      return meta ? (
                        <span key={d} className="px-1.5 py-0.5 rounded text-[10px] font-bold" style={{ backgroundColor: meta.color + '33', color: meta.color }}>
                          {meta.label}
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Summary stats */}
        <div className="px-4 py-3 border-t border-slate-700 bg-slate-800 text-xs text-slate-400 space-y-0.5">
          <div className="flex justify-between"><span>Total Area</span><span className="text-white font-semibold">{stats.area.toLocaleString()} SF</span></div>
          <div className="flex justify-between"><span>Total Volume</span><span className="text-white font-semibold">{stats.volume.toLocaleString()} CF</span></div>
        </div>

        {/* Actions */}
        <div className="px-4 py-3 border-t border-slate-700 space-y-2">
          <button
            onClick={buildLineItems}
            disabled={rooms.filter(r => r.damages.length > 0).length === 0}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <FileText size={14} /> Generate Estimate
          </button>
          <div className="flex gap-2">
            <button onClick={saveSketch} className="flex-1 py-1.5 bg-slate-700 hover:bg-slate-600 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors">
              <Save size={12} /> Save
            </button>
            <button onClick={() => { setShowSaved(!showSaved); }} className="flex-1 py-1.5 bg-slate-700 hover:bg-slate-600 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors">
              <LayoutGrid size={12} /> Open
            </button>
            <button onClick={newSketch} className="py-1.5 px-3 bg-slate-700 hover:bg-slate-600 text-xs font-semibold rounded-lg transition-colors" title="New sketch">
              <Plus size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Canvas ──────────────────────────────────────────────────────── */}
      <div className="flex-1 relative overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
          style={{ cursor: tool === 'draw' ? 'crosshair' : 'default' }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onWheel={onWheel}
        />

        {/* Hint bar */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-slate-800 bg-opacity-80 text-white text-xs px-4 py-1.5 rounded-full pointer-events-none">
          {tool === 'draw'
            ? 'Click & drag to draw a room • Scroll to zoom'
            : 'Click room to select • Drag to move • Drag corner to resize • Scroll to zoom'}
        </div>

        {/* Saved sketches overlay */}
        {showSaved && (
          <div className="absolute top-12 left-4 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-30">
            <div className="flex justify-between items-center px-4 py-3 border-b">
              <h3 className="font-semibold text-gray-800 text-sm">Saved Sketches</h3>
              <button onClick={() => setShowSaved(false)}><X size={16} className="text-gray-500" /></button>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {savedList.length === 0 && <p className="text-center py-6 text-gray-400 text-sm">No saved sketches</p>}
              {savedList.map(s => (
                <button key={s.id} onClick={() => loadSketch(s.id)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0">
                  <p className="text-sm font-medium text-gray-800">{s.name}</p>
                  <p className="text-xs text-gray-400">{s.rooms?.length || 0} rooms • {new Date(s.updated_at).toLocaleDateString()}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Right Panel ─────────────────────────────────────────────────── */}
      <div className="w-72 flex-shrink-0 bg-white border-l border-gray-200 flex flex-col overflow-hidden">

        {selectedRoom ? (
          <>
            {/* Room properties */}
            <div className="px-4 py-4 border-b bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-gray-800 text-sm">Room Properties</h3>
                <button onClick={() => deleteRoom(selectedRoom.id)} className="p-1 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
              </div>

              {/* Name */}
              <label className="block text-xs font-semibold text-gray-500 mb-1">Room Name</label>
              <input
                value={selectedRoom.name}
                onChange={e => updateRoom(selectedRoom.id, { name: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
              />

              {/* Dimensions */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                {[
                  { label: "Width (ft)", key: 'w' },
                  { label: "Depth (ft)", key: 'h' },
                  { label: "Ceil. (ft)",  key: 'ceilH' },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
                    <input
                      type="number" min="1"
                      value={selectedRoom[key]}
                      onChange={e => updateRoom(selectedRoom.id, { [key]: Math.max(1, parseInt(e.target.value) || 1) })}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                    />
                  </div>
                ))}
              </div>

              {/* Damage flags */}
              <label className="block text-xs font-semibold text-gray-500 mb-2">Damage Types</label>
              <div className="space-y-1.5">
                {DAMAGE_META.map(({ key, label, color }) => {
                  const Icon = DAMAGE_ICONS[key];
                  const active = selectedRoom.damages.includes(key);
                  return (
                    <button
                      key={key}
                      onClick={() => toggleDamage(selectedRoom.id, key)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                        active
                          ? 'border-transparent text-white'
                          : 'border-gray-200 text-gray-600 bg-white hover:bg-gray-50'
                      }`}
                      style={active ? { backgroundColor: color } : {}}
                    >
                      {Icon && <Icon size={14} />} {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Calculated stats */}
            <div className="px-4 py-4 text-sm space-y-2">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Calculated Quantities</h4>
              {(() => {
                const c = calculateRoom(selectedRoom);
                return [
                  { label: 'Floor Area',  value: `${c.area} SF` },
                  { label: 'Perimeter',   value: `${c.perimeter} LF` },
                  { label: 'Wall Area',   value: `${c.wallArea} SF` },
                  { label: 'Volume',      value: `${c.volume} CF` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-semibold text-gray-800">{value}</span>
                  </div>
                ));
              })()}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 px-6 text-center">
            <PenTool size={36} className="mb-3 opacity-30" />
            <p className="text-sm font-medium">No room selected</p>
            <p className="text-xs mt-1">Click a room on the canvas or use the Draw tool to add rooms</p>
          </div>
        )}

        {/* Estimate panel */}
        {showEstimate && (
          <div className="border-t bg-gray-50 flex flex-col" style={{ maxHeight: '55%' }}>
            <div className="flex justify-between items-center px-4 py-3 border-b bg-white">
              <h3 className="font-bold text-gray-800 text-sm">
                Generated Line Items
                <span className="ml-2 text-xs font-normal text-gray-400">{lineItems.length} items</span>
              </h3>
              <button onClick={() => setShowEstimate(false)}><X size={16} className="text-gray-400" /></button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {lineItems.length === 0 ? (
                <p className="text-center py-6 text-sm text-gray-400">No damaged rooms to generate items from.</p>
              ) : (
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-gray-100">
                    <tr>
                      <th className="text-left px-3 py-2 text-gray-500 font-semibold">Item</th>
                      <th className="text-right px-3 py-2 text-gray-500 font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lineItems.map((item, i) => (
                      <tr key={i} className="border-t border-gray-100">
                        <td className="px-3 py-2">
                          <p className="font-medium text-gray-800 leading-snug">{item.description}</p>
                          <p className="text-gray-400">{item.room_name} • {item.qty} {item.unit}</p>
                        </td>
                        <td className="px-3 py-2 text-right font-semibold text-gray-700 whitespace-nowrap">
                          ${item.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {lineItems.length > 0 && (
              <div className="px-4 py-3 border-t bg-white space-y-3">
                <div className="flex justify-between text-sm font-bold text-gray-800">
                  <span>Subtotal</span>
                  <span>${estimateTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="text-xs text-gray-400 leading-relaxed">
                  + 10% Overhead + 12% Profit + 8.75% Tax applied at save
                </div>

                {/* Client + title */}
                <input
                  value={estimateTitle}
                  onChange={e => setEstimateTitle(e.target.value)}
                  placeholder="Estimate title…"
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={clientId}
                  onChange={e => setClientId(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">— Select client (optional) —</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>

                {savedEstimate ? (
                  <div className="text-center text-sm text-green-600 font-semibold py-1">
                    ✓ Estimate #{savedEstimate.estimate_number || savedEstimate.id} saved
                  </div>
                ) : (
                  <button
                    onClick={saveEstimate}
                    disabled={generating}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-bold rounded-lg transition-colors"
                  >
                    {generating ? 'Saving…' : 'Save as Estimate'}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SketchView;
