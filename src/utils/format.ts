/** 12500 -> "12,500" */
export function formatCoins(value: number): string {
  const n = Math.max(0, Math.round(value));
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/** 420 -> "+420", -25 -> "-25", 0 -> "0" */
export function formatDelta(value: number): string {
  const n = Math.round(value);
  if (n > 0) {
    return '+' + formatCoins(n);
  }
  if (n < 0) {
    return '-' + formatCoins(-n);
  }
  return '0';
}
