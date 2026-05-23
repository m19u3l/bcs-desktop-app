/**
 * Pure geometry helpers. All dimensions in feet.
 */
export function calculateRoom(room) {
  const area      = room.w * room.h;
  const perimeter = 2 * (room.w + room.h);
  const ceilH     = room.ceilH || 8;
  const volume    = area * ceilH;
  const wallArea  = perimeter * ceilH;
  return { area, perimeter, volume, wallArea, ceilH };
}

export function totalStats(rooms) {
  return rooms.reduce((acc, r) => {
    const c = calculateRoom(r);
    return {
      area:     acc.area     + c.area,
      volume:   acc.volume   + c.volume,
      wallArea: acc.wallArea + c.wallArea,
    };
  }, { area: 0, volume: 0, wallArea: 0 });
}
