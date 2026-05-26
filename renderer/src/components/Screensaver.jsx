import { useEffect, useState, useRef } from 'react';

const TIPS = [
  // App features
  'Use the Sketch Engine to draw floor plans and auto-generate estimates from room dimensions.',
  'The Insurance Estimator has 2,000+ Xactimate line items — search by code or trade.',
  'Bulk Messaging lets you send SMS or email to multiple clients at once.',
  'Press Ctrl+Space anywhere to activate the Voice AI assistant.',
  'Competitor Pricing shows BCS rates vs SERVPRO, Paul Davis, and ServiceMaster.',
  'Assemblies let you save grouped line items — add a full Water Damage package in one click.',
  'The Dashboard shows past-due invoices, recent payments, and quick notes in real time.',
  'Create a Sketch, then convert it directly into an Insurance Estimate with one click.',
  'Moisture Logs track daily drying readings — generate reports for insurance adjuster review.',
  'Remediation Dryout tracks equipment placement, daily readings, and job completion.',
  'Use Document Templates to save and reuse estimate and invoice layouts.',
  'The Job Tracker gives you a live view of every active job, status, and assigned crew.',
  'Quick SMS sends a text to any client without opening the full messaging panel.',
  'RSMeans database provides 200+ San Diego–adjusted material and labor costs.',
  'Homeowner Estimates can be converted into work orders and then invoices.',
  // BCS services
  'Building Care Solutions provides 24/7 emergency water damage response in San Diego County.',
  'BCS is IICRC certified for water damage restoration and mold remediation.',
  'Serving all of San Diego County — from Chula Vista to Oceanside.',
  'BCS carries $2 million in general liability and workers’ compensation insurance.',
  'We work directly with insurance adjusters and handle the full claims process.',
  'Services include water extraction, structural drying, mold remediation, and full reconstruction.',
  'BCS offers category 1, 2, and 3 water damage restoration — clean, gray, and black water.',
  'Emergency board-up, pack-out, and contents cleaning available 24/7.',
  'Licensed California contractor specializing in insurance restoration projects.',
  'Call (866) 982-4796 for 24/7 emergency response anywhere in San Diego County.',
];

const IDLE_TIMEOUT_MS = 3 * 60 * 1000; // 3 minutes
const TIP_INTERVAL_MS = 5000;
const BOUNCE_SPEED = 1.2; // px per frame

function BouncingTip({ text, containerRef }) {
  const tipRef = useRef(null);
  const posRef = useRef({ x: Math.random() * 60 + 10, y: Math.random() * 60 + 10 });
  const velRef = useRef({
    x: (Math.random() > 0.5 ? 1 : -1) * BOUNCE_SPEED,
    y: (Math.random() > 0.5 ? 1 : -1) * BOUNCE_SPEED,
  });
  const rafRef = useRef(null);

  useEffect(() => {
    const animate = () => {
      if (!tipRef.current || !containerRef.current) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }
      const cw = containerRef.current.clientWidth;
      const ch = containerRef.current.clientHeight;
      const tw = tipRef.current.offsetWidth;
      const th = tipRef.current.offsetHeight;

      posRef.current.x += velRef.current.x;
      posRef.current.y += velRef.current.y;

      if (posRef.current.x <= 0) { posRef.current.x = 0; velRef.current.x = Math.abs(velRef.current.x); }
      if (posRef.current.x + tw >= cw) { posRef.current.x = cw - tw; velRef.current.x = -Math.abs(velRef.current.x); }
      if (posRef.current.y <= 0) { posRef.current.y = 0; velRef.current.y = Math.abs(velRef.current.y); }
      if (posRef.current.y + th >= ch) { posRef.current.y = ch - th; velRef.current.y = -Math.abs(velRef.current.y); }

      tipRef.current.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px)`;
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [containerRef]);

  return (
    <div
      ref={tipRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        maxWidth: 380,
        padding: '12px 18px',
        background: 'rgba(30, 120, 220, 0.18)',
        border: '1px solid rgba(100, 160, 255, 0.35)',
        borderRadius: 10,
        color: 'rgba(180, 215, 255, 0.9)',
        fontSize: 14,
        lineHeight: 1.5,
        backdropFilter: 'blur(4px)',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      💡 {text}
    </div>
  );
}

export default function Screensaver({ onDismiss }) {
  const containerRef = useRef(null);
  const [time, setTime] = useState(new Date());
  const [activeTips, setActiveTips] = useState(() => {
    const shuffled = [...TIPS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  });
  const usedRef = useRef(new Set(activeTips));

  // Clock tick
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Rotate tips
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTips(prev => {
        const remaining = TIPS.filter(t => !usedRef.current.has(t));
        if (remaining.length === 0) {
          usedRef.current = new Set();
        }
        const pool = remaining.length > 0 ? remaining : TIPS;
        const next = pool[Math.floor(Math.random() * pool.length)];
        usedRef.current.add(next);
        const updated = [...prev.slice(1), next];
        return updated;
      });
    }, TIP_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  const hours = time.getHours() % 12 || 12;
  const minutes = String(time.getMinutes()).padStart(2, '0');
  const seconds = String(time.getSeconds()).padStart(2, '0');
  const ampm = time.getHours() >= 12 ? 'PM' : 'AM';
  const dateStr = time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div
      ref={containerRef}
      onClick={onDismiss}
      onMouseMove={onDismiss}
      onKeyDown={onDismiss}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'radial-gradient(ellipse at 30% 40%, #0a1628 0%, #050d1a 60%, #000 100%)',
        cursor: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Stars */}
      <Stars />

      {/* Bouncing tips */}
      {activeTips.map((tip, i) => (
        <BouncingTip key={tip + i} text={tip} containerRef={containerRef} />
      ))}

      {/* Fixed center: logo + clock */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 24,
        pointerEvents: 'none',
        userSelect: 'none',
      }}>
        <img
          src="/images/logo.png"
          alt="Building Care Solutions"
          style={{ height: 80, opacity: 0.92, filter: 'drop-shadow(0 0 24px rgba(59,130,246,0.5))' }}
          onError={e => { e.target.style.display = 'none'; }}
        />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 72, fontWeight: 200, color: '#fff', letterSpacing: 4, lineHeight: 1, fontFamily: 'DM Sans, sans-serif' }}>
            {hours}:{minutes}
            <span style={{ fontSize: 36, color: 'rgba(255,255,255,0.6)', marginLeft: 8 }}>{seconds}</span>
            <span style={{ fontSize: 24, color: 'rgba(255,255,255,0.5)', marginLeft: 10 }}>{ampm}</span>
          </div>
          <div style={{ marginTop: 8, fontSize: 16, color: 'rgba(180,200,255,0.6)', letterSpacing: 2, textTransform: 'uppercase' }}>
            {dateStr}
          </div>
        </div>
        <div style={{ fontSize: 13, color: 'rgba(100,140,200,0.5)', letterSpacing: 3, textTransform: 'uppercase', marginTop: 8 }}>
          Building Care Solutions
        </div>
        <div style={{ fontSize: 11, color: 'rgba(100,140,200,0.3)', marginTop: -16 }}>
          Click or move to continue
        </div>
      </div>
    </div>
  );
}

// Simple procedural starfield
function Stars() {
  const stars = useRef(
    Array.from({ length: 120 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      r: Math.random() * 1.5 + 0.3,
      o: Math.random() * 0.6 + 0.2,
    }))
  );
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      {stars.current.map((s, i) => (
        <circle key={i} cx={`${s.x}%`} cy={`${s.y}%`} r={s.r} fill={`rgba(255,255,255,${s.o})`} />
      ))}
    </svg>
  );
}

export { IDLE_TIMEOUT_MS };
