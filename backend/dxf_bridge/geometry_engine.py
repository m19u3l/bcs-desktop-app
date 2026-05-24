"""
DXF Geometry Engine
Parses DXF files → extracts rooms (closed polylines) and walls (lines)
→ returns pixel-coordinate JSON compatible with the BCS Sketch Engine canvas.

Coordinate pipeline:
  DXF units (variable) → feet → canvas pixels (1 ft = 24 px)
"""
import io
import math
from typing import Any

import ezdxf

PX_PER_FT = 24  # must match frontend constant

# DXF $INSUNITS header values → multiplier to convert to feet
UNIT_TO_FT: dict[int, float] = {
    0:  1.0,       # unitless — assume feet
    1:  1 / 12,    # inches
    2:  1.0,       # feet
    4:  1 / 304.8, # millimetres
    5:  1 / 30.48, # centimetres
    6:  3.28084,   # metres
}

# Common architect layer names that contain room boundary polylines
ROOM_LAYERS = {
    'A-ROOM', 'ROOMS', 'ROOM', 'A-AREA', 'FLOOR-AREA',
    'A-FLOR-AREA', 'A-FLOOR', 'FLOOR', 'A-SPAC', 'SPACE',
}
# Layer names that contain wall lines
WALL_LAYERS = {
    'A-WALL', 'WALLS', 'WALL', 'A-WALL-FULL', 'A-WALL-PRTT',
    'A-GLAZ', 'A-DOOR',
}
# Text/label layers
LABEL_LAYERS = {
    'A-ANNO', 'A-ROOM-IDEN', 'A-ROOM-NAME', 'TEXT', 'LABELS',
    'A-ANNO-DIMS', 'ROOM-LABELS',
}


# ── Pure-math geometry ───────────────────────────────────────────────────────

def polygon_area(pts: list[tuple]) -> float:
    """Shoelace formula — signed area, returns absolute value."""
    n = len(pts)
    area = 0.0
    for i in range(n):
        j = (i + 1) % n
        area += pts[i][0] * pts[j][1]
        area -= pts[j][0] * pts[i][1]
    return abs(area) / 2.0


def polygon_perimeter(pts: list[tuple]) -> float:
    n = len(pts)
    peri = 0.0
    for i in range(n):
        j = (i + 1) % n
        dx = pts[j][0] - pts[i][0]
        dy = pts[j][1] - pts[i][1]
        peri += math.sqrt(dx * dx + dy * dy)
    return peri


def point_in_bbox(px, py, xmin, ymin, xmax, ymax) -> bool:
    return xmin <= px <= xmax and ymin <= py <= ymax


def bbox(pts: list[tuple]) -> tuple:
    xs = [p[0] for p in pts]
    ys = [p[1] for p in pts]
    return min(xs), min(ys), max(xs), max(ys)


# ── Main parser ──────────────────────────────────────────────────────────────

def parse_dxf(content: bytes) -> dict[str, Any]:
    """
    Parse raw DXF bytes.

    Strategy (in priority order):
    1. Closed LWPOLYLINE / POLYLINE on room-specific layers
    2. Closed LWPOLYLINE on any layer with area > 4 SF (fallback)
    3. LINE entities for walls
    4. TEXT / MTEXT matched to rooms by bounding-box containment

    Returns dict with 'rooms', 'walls', 'meta'.
    """
    try:
        doc = ezdxf.read(io.BytesIO(content))
    except Exception:
        # Some DXF files are ASCII — try decoding
        doc = ezdxf.read(io.StringIO(content.decode('utf-8', errors='replace')))

    msp = doc.modelspace()

    # Unit conversion factor
    insunits = doc.header.get('$INSUNITS', 0)
    to_ft = UNIT_TO_FT.get(insunits, 1.0)

    raw_polys: list[dict] = []  # candidate room polygons
    raw_walls: list[dict] = []
    raw_text:  list[dict] = []

    for entity in msp:
        layer = (entity.dxf.layer or '').upper()
        etype = entity.dxftype()

        # ── Closed polylines → room candidates ──────────────────────────
        if etype in ('LWPOLYLINE', 'POLYLINE'):
            try:
                if etype == 'LWPOLYLINE':
                    pts_raw = [(float(p[0]), float(p[1])) for p in entity.get_points()]
                    is_closed = bool(entity.closed)
                else:
                    pts_raw = [(float(v.dxf.location[0]), float(v.dxf.location[1]))
                               for v in entity.vertices]
                    is_closed = bool(entity.is_closed)

                pts = [(x * to_ft, y * to_ft) for x, y in pts_raw]

                # Treat as closed if first/last point match
                if not is_closed and len(pts) > 2:
                    dx = abs(pts[0][0] - pts[-1][0])
                    dy = abs(pts[0][1] - pts[-1][1])
                    if dx < 0.1 and dy < 0.1:
                        is_closed = True
                        pts = pts[:-1]

                if is_closed and len(pts) >= 3:
                    area = polygon_area(pts)
                    if area >= 1.0:  # at least 1 sq ft
                        priority = 1 if layer in ROOM_LAYERS else (
                                   2 if layer in WALL_LAYERS else 3)
                        raw_polys.append({
                            'pts':      pts,
                            'area':     area,
                            'layer':    layer,
                            'priority': priority,
                        })

            except Exception:
                pass

        # ── Lines → wall candidates ──────────────────────────────────────
        elif etype == 'LINE':
            try:
                x1 = entity.dxf.start[0] * to_ft
                y1 = entity.dxf.start[1] * to_ft
                x2 = entity.dxf.end[0]   * to_ft
                y2 = entity.dxf.end[1]   * to_ft
                length = math.sqrt((x2-x1)**2 + (y2-y1)**2)
                if length > 0.25:  # ignore tiny lines
                    raw_walls.append({'x1': x1, 'y1': y1, 'x2': x2, 'y2': y2, 'layer': layer})
            except Exception:
                pass

        # ── Text → label candidates ──────────────────────────────────────
        elif etype == 'TEXT':
            try:
                raw_text.append({
                    'x':    entity.dxf.insert[0] * to_ft,
                    'y':    entity.dxf.insert[1] * to_ft,
                    'text': (entity.dxf.text or '').strip(),
                })
            except Exception:
                pass

        elif etype == 'MTEXT':
            try:
                raw_text.append({
                    'x':    entity.dxf.insert[0] * to_ft,
                    'y':    entity.dxf.insert[1] * to_ft,
                    'text': (entity.plain_text() or '').strip(),
                })
            except Exception:
                pass

    if not raw_polys:
        return {
            'rooms': [], 'walls': [],
            'meta': {'units': 'ft', 'source': 'dxf', 'insunits': insunits,
                     'warning': 'No closed polylines found — check layer names or file format'},
        }

    # Sort by priority (explicit room layers first), then by area desc
    raw_polys.sort(key=lambda p: (p['priority'], -p['area']))

    # Coordinate offset — shift so min corner is at (0, 0)
    all_x = [px for p in raw_polys for px, _ in p['pts']]
    all_y = [py for p in raw_polys for _, py in p['pts']]
    min_x, min_y = min(all_x), min(all_y)
    margin = 2.0  # 2-foot canvas margin

    def norm_x(v): return v - min_x + margin
    def norm_y(v): return v - min_y + margin

    # ── Build rooms ──────────────────────────────────────────────────────
    rooms: list[dict] = []
    uid = 1000

    for poly in raw_polys:
        pts_n = [(norm_x(x), norm_y(y)) for x, y in poly['pts']]
        x0, y0, x1, y1 = bbox(pts_n)
        w_ft = x1 - x0
        h_ft = y1 - y0
        if w_ft < 0.5 or h_ft < 0.5:
            continue

        # Label: find a text entity inside the bounding box
        name = f'Room {uid - 999}'
        for txt in raw_text:
            tx = norm_x(txt['x'])
            ty = norm_y(txt['y'])
            if point_in_bbox(tx, ty, x0, y0, x1, y1) and txt['text']:
                # Skip text that looks like a dimension number
                if not txt['text'].replace('.', '').replace("'", '').isdigit():
                    name = txt['text'][:40]
                    break

        rooms.append({
            'id':       str(uid),
            'name':     name,
            'x':        round(x0 * PX_PER_FT),
            'y':        round(y0 * PX_PER_FT),
            'width':    round(w_ft * PX_PER_FT),
            'height':   round(h_ft * PX_PER_FT),
            'damages':  [],
            'source':   'dxf',
            'area_sf':  round(float(poly['area']), 1),
            'layer':    poly['layer'],
        })
        uid += 1

    # ── Build walls ──────────────────────────────────────────────────────
    walls: list[dict] = []
    wid = 2000
    for w in raw_walls[:300]:  # cap at 300 wall segments
        walls.append({
            'id':        str(wid),
            'x1':        round(norm_x(w['x1']) * PX_PER_FT),
            'y1':        round(norm_y(w['y1']) * PX_PER_FT),
            'x2':        round(norm_x(w['x2']) * PX_PER_FT),
            'y2':        round(norm_y(w['y2']) * PX_PER_FT),
            'thickness': 4,
            'source':    'dxf',
        })
        wid += 1

    return {
        'rooms': rooms,
        'walls': walls,
        'meta': {
            'units':       'ft',
            'source':      'dxf',
            'insunits':    insunits,
            'total_rooms': len(rooms),
            'total_walls': len(walls),
        },
    }
