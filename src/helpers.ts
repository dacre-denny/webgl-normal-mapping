export function clamp(value: number, min: number, max: number): number {
  if (min > max) return clamp(value, max, min);
  if (value < min) return min;
  if (value < max) return max;

  return value;
}

export function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180.0;
}
export function toDegrees(radians: number): number {
  return (radians * 180.0) / Math.PI;
}
