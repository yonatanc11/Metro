export function parseNum(value: string | null | undefined): number | undefined {
  if (!value) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function percentage(part: number, whole: number): number {
  if (whole === 0) return 0;
  return (part / whole) * 100;
}
