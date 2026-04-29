export function toMinorUnits(price: number | string): number {
  const value = typeof price === 'string' ? Number(price) : price;
  return Math.round(value * 100);
}
