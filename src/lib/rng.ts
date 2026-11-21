export type Rng = () => number;

/** Small seeded random generator so a question can be rebuilt from its seed. */
export function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const newSeed = () => Math.floor(Math.random() * 2 ** 31);

export const ri = (r: Rng, min: number, max: number) => Math.floor(r() * (max - min + 1)) + min;

export function pick<T>(r: Rng, arr: readonly T[]): T {
  return arr[Math.floor(r() * arr.length)];
}

export function shuffle<T>(r: Rng, arr: readonly T[]): T[] {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function sample<T>(r: Rng, arr: readonly T[], n: number): T[] {
  return shuffle(r, arr).slice(0, Math.min(n, arr.length));
}
