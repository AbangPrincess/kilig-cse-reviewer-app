export function num(n: number, maxDecimals = 2): string {
  const rounded = Math.round(n * 10 ** maxDecimals) / 10 ** maxDecimals;
  return rounded.toLocaleString('en-US', { maximumFractionDigits: maxDecimals });
}

export const peso = (n: number, maxDecimals = 2) => '₱' + num(n, maxDecimals);

export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

/** Simplified fraction text; improper fractions become mixed numbers ("1 1/4"). */
export function frac(n: number, d: number): string {
  const g = gcd(n, d);
  n /= g;
  d /= g;
  if (d === 1) return String(n);
  if (Math.abs(n) > d) {
    const whole = Math.trunc(n / d);
    const rest = Math.abs(n % d);
    return `${whole} ${rest}/${d}`;
  }
  return `${n}/${d}`;
}

export function todayKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function addDays(key: string, days: number): string {
  const [y, m, d] = key.split('-').map(Number);
  return todayKey(new Date(y, m - 1, d + days));
}

export function daysBetween(fromKey: string, toKey: string): number {
  const [y1, m1, d1] = fromKey.split('-').map(Number);
  const [y2, m2, d2] = toKey.split('-').map(Number);
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86400000);
}

export function clock(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const mm = String(m).padStart(h ? 2 : 1, '0');
  const ss = String(s).padStart(2, '0');
  return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

export function duration(ms: number): string {
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s} s`;
  const m = Math.floor(s / 60);
  const rest = s % 60;
  if (m < 60) return rest ? `${m} min ${rest} s` : `${m} min`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m`;
}
