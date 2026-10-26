const MIN_RADIUS = 4;
const MAX_RADIUS = 36;

export function markerRadius(value: number, max: number): number {
  if (value <= 0 || max <= 0) return MIN_RADIUS;
  const ratio = Math.sqrt(value / max);
  return MIN_RADIUS + ratio * (MAX_RADIUS - MIN_RADIUS);
}
