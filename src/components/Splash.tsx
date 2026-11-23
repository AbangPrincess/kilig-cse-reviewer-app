import { useEffect, useRef, useState } from 'react';
import { SOFT_HEART } from './Icons';

/** The logo stays up, then fades quickly: 2 seconds in all. */
const SHOW_MS = 1600;
const FADE_MS = 400;

type RGB = [number, number, number];
/** Same pairs as the app's tiles: a flat face plus a solid darker edge underneath. */
const PINK: RGB = [214, 34, 79]; // --rose
const PINK_EDGE: RGB = [168, 24, 61]; // --rose-dark
const SUN: RGB = [255, 194, 61]; // --sun
const SUN_EDGE: RGB = [201, 143, 18]; // --sun-dark

/** Opening screen: chubby pink "KiLIG" letters, shot from above with a 0.5x ultra-wide lens. */
export function Splash({ onDone }: { onDone: () => void }) {
  const [leaving, setLeaving] = useState(false);
  const [drawn, setDrawn] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const done = useRef(onDone);
  done.current = onDone;

  // White behind everything while the splash is up, including the reserved scrollbar strip.
  useEffect(() => {
    const root = document.documentElement;
    root.style.backgroundColor = '#fff';
    return () => {
      root.style.backgroundColor = '';
    };
  }, []);

  useEffect(() => {
    document.getElementById('boot')?.remove();
    let fade = 0;
    let end = 0;
    const frame = requestAnimationFrame(() => {
      if (canvasRef.current) {
        try {
          drawWordmark(canvasRef.current);
        } catch {
          // Without canvas support the caption still shows on the white screen.
        }
      }
      setDrawn(true);
      fade = window.setTimeout(() => setLeaving(true), SHOW_MS);
      end = window.setTimeout(() => done.current(), SHOW_MS + FADE_MS);
    });
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(fade);
      clearTimeout(end);
    };
  }, []);

  return (
    <div className={leaving ? 'splash leaving' : 'splash'} role="img" aria-label="Kilig CSE Reviewer">
      <div className="splash-lockup" aria-hidden="true">
        <canvas ref={canvasRef} className={drawn ? 'splash-mark on' : 'splash-mark'} />
        <span className="splash-sub">CSE Reviewer</span>
      </div>
    </div>
  );
}

/* ---------- Drawing ----------
 * Letters are built from thick round-capped strokes (units: cap height = 1), so no
 * letter has a corner or point; a blur-and-threshold pass rounds the inside corners
 * too. Each shape gets a flat face and a solid darker edge below it, like the app's
 * cards. Then the flat logo is projected through a wide-angle camera held above it
 * and looking down, the way a 0.5x photo from above looks.
 */

const STROKE = 0.34;
/** How far the darker edge shows below each shape, in letter units. */
const EDGE = 0.09;
/** Visible logo box in letter units (edge included), used to size and center everything. */
const BOX = { left: -0.17, right: 3.97, top: -0.38, bottom: 1.17 + EDGE };
const PAD = 0.2;

function strokeLetters(g: CanvasRenderingContext2D) {
  g.beginPath();
  // K
  g.moveTo(0, 0);
  g.lineTo(0, 1);
  g.moveTo(0.46, 0.02);
  g.lineTo(0.04, 0.54);
  g.lineTo(0.54, 1);
  // ı (its dot is the heart)
  g.moveTo(1.02, 0.38);
  g.lineTo(1.02, 1);
  // L
  g.moveTo(1.5, 0);
  g.lineTo(1.5, 1);
  g.lineTo(1.96, 1);
  // I
  g.moveTo(2.42, 0);
  g.lineTo(2.42, 1);
  g.stroke();
  // G
  g.beginPath();
  g.ellipse(3.34, 0.5, 0.46, 0.5, 0, -Math.PI / 4, Math.PI * 0.1, true);
  g.lineTo(3.4, 0.58);
  g.stroke();
}

function fillHeart(g: CanvasRenderingContext2D) {
  const box = 0.54;
  g.save();
  g.translate(1.02, -0.13);
  g.rotate(-0.12);
  g.scale(box / 24, (box * 1.08) / 24);
  g.translate(-12, -12.6);
  g.fill(new Path2D(SOFT_HEART));
  g.restore();
}

/** Separable box blur, repeated so it behaves like a soft Gaussian. Outside the image counts as empty. */
function blur(src: Float32Array, w: number, h: number, r: number, passes = 3): Float32Array {
  const out = Float32Array.from(src);
  const tmp = new Float32Array(w * h);
  const inv = 1 / (2 * r + 1);
  for (let p = 0; p < passes; p++) {
    for (let y = 0; y < h; y++) {
      const row = y * w;
      let sum = 0;
      for (let i = 0; i <= r && i < w; i++) sum += out[row + i];
      for (let x = 0; x < w; x++) {
        tmp[row + x] = sum * inv;
        if (x + r + 1 < w) sum += out[row + x + r + 1];
        if (x - r >= 0) sum -= out[row + x - r];
      }
    }
    for (let x = 0; x < w; x++) {
      let sum = 0;
      for (let i = 0; i <= r && i < h; i++) sum += tmp[i * w + x];
      for (let y = 0; y < h; y++) {
        out[y * w + x] = sum * inv;
        if (y + r + 1 < h) sum += tmp[(y + r + 1) * w + x];
        if (y - r >= 0) sum -= tmp[(y - r) * w + x];
      }
    }
  }
  return out;
}

/** Round off every corner of a mask: blur it, then cut it back to a crisp edge. */
function rounded(mask: Float32Array, w: number, h: number, radius: number): Float32Array {
  const shape = blur(mask, w, h, Math.max(1, Math.round(radius)));
  for (let i = 0; i < shape.length; i++) {
    const t = Math.min(1, Math.max(0, (shape[i] - 0.45) / 0.1));
    shape[i] = t * t * (3 - 2 * t);
  }
  return shape;
}

/** Paint a shape in one flat color "over" the premultiplied RGBA buffer, moved down by `drop` pixels. */
function paint(shape: Float32Array, w: number, h: number, rgb: RGB, rgba: Float32Array, drop = 0) {
  for (let y = drop; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const a = shape[(y - drop) * w + x];
      if (a < 0.003) continue;
      const o = (y * w + x) * 4;
      const keep = 1 - a;
      rgba[o] = rgb[0] * a + rgba[o] * keep;
      rgba[o + 1] = rgb[1] * a + rgba[o + 1] * keep;
      rgba[o + 2] = rgb[2] * a + rgba[o + 2] * keep;
      rgba[o + 3] = a + rgba[o + 3] * keep;
    }
  }
}

function drawWordmark(canvas: HTMLCanvasElement) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const W = Math.max(1, Math.round(canvas.clientWidth * dpr));
  const H = Math.max(1, Math.round(canvas.clientHeight * dpr));
  canvas.width = W;
  canvas.height = H;
  const out = canvas.getContext('2d');
  if (!out) return;

  // 1. Flat logo, in its own texture.
  const unit = Math.max(8, Math.round(W * 0.23));
  const left = BOX.left - PAD;
  const top = BOX.top - PAD;
  const TW = Math.round((BOX.right - BOX.left + 2 * PAD) * unit);
  const TH = Math.round((BOX.bottom - BOX.top + 2 * PAD) * unit);
  const flat = document.createElement('canvas');
  flat.width = TW;
  flat.height = TH;
  const g = flat.getContext('2d');
  if (!g) return;
  const toUnits = () => g.setTransform(unit, 0, 0, unit, -left * unit, -top * unit);
  const maskOf = () => {
    const d = g.getImageData(0, 0, TW, TH).data;
    const m = new Float32Array(TW * TH);
    for (let i = 0; i < m.length; i++) m[i] = d[i * 4 + 3] / 255;
    return m;
  };

  toUnits();
  g.lineWidth = STROKE;
  g.lineCap = 'round';
  g.lineJoin = 'round';
  strokeLetters(g);
  const letters = rounded(maskOf(), TW, TH, unit * 0.06);

  g.setTransform(1, 0, 0, 1, 0, 0);
  g.clearRect(0, 0, TW, TH);
  toUnits();
  fillHeart(g);
  // Light rounding only, so the dip between the heart's lobes survives.
  const heart = rounded(maskOf(), TW, TH, unit * 0.015);

  const drop = Math.round(EDGE * unit);
  const tex = new Float32Array(TW * TH * 4);
  paint(letters, TW, TH, PINK_EDGE, tex, drop);
  paint(heart, TW, TH, SUN_EDGE, tex, drop);
  paint(letters, TW, TH, PINK, tex);
  paint(heart, TW, TH, SUN, tex);

  // 2. Wide-angle camera held close above the logo, looking down at it: straight
  //    lines stay straight, the top looms large and the letters taper toward the
  //    bottom, the way a 0.5x photo from above looks.
  const tilt = (-24 * Math.PI) / 180;
  const ca = Math.cos(tilt);
  const sa = Math.sin(tilt);
  const dist = 1.6 * unit;
  const cxu = ((BOX.left + BOX.right) / 2 - left) * unit;
  const cyu = ((BOX.top + BOX.bottom) / 2 - top) * unit;
  const project = (u: number, v: number) => {
    const z = dist - v * sa;
    return [u / z, (v * ca) / z];
  };
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  const halfU = ((BOX.right - BOX.left) / 2) * unit;
  const halfV = ((BOX.bottom - BOX.top) / 2) * unit;
  for (const [u, v] of [[-halfU, -halfV], [halfU, -halfV], [-halfU, halfV], [halfU, halfV]]) {
    const [px, py] = project(u, v);
    minX = Math.min(minX, px);
    maxX = Math.max(maxX, px);
    minY = Math.min(minY, py);
    maxY = Math.max(maxY, py);
  }
  const f = Math.min((0.94 * W) / (maxX - minX), (0.9 * H) / (maxY - minY));
  const ox = W / 2 - (f * (minX + maxX)) / 2;
  const oy = H / 2 - (f * (minY + maxY)) / 2;

  const img = out.createImageData(W, H);
  const dst = img.data;
  for (let Y = 0; Y < H; Y++) {
    const dy = (Y + 0.5 - oy) / f;
    const denom = dy * sa + ca;
    if (denom <= 1e-6) continue;
    const t = (dist * ca) / denom;
    const v = t * dy * ca - (t - dist) * sa;
    const ty = v + cyu - 0.5;
    const fy = Math.floor(ty);
    const wy = ty - fy;
    if (fy < -1 || fy >= TH) continue;
    for (let X = 0; X < W; X++) {
      const tx = t * ((X + 0.5 - ox) / f) + cxu - 0.5;
      const fx = Math.floor(tx);
      if (fx < -1 || fx >= TW) continue;
      const wx = tx - fx;
      let r = 0;
      let gr = 0;
      let b = 0;
      let a = 0;
      for (let j = 0; j < 4; j++) {
        const sx = fx + (j & 1);
        const sy = fy + (j >> 1);
        if (sx < 0 || sy < 0 || sx >= TW || sy >= TH) continue;
        const wgt = (j & 1 ? wx : 1 - wx) * (j >> 1 ? wy : 1 - wy);
        const k = (sy * TW + sx) * 4;
        r += tex[k] * wgt;
        gr += tex[k + 1] * wgt;
        b += tex[k + 2] * wgt;
        a += tex[k + 3] * wgt;
      }
      if (a <= 0.002) continue;
      const o = (Y * W + X) * 4;
      dst[o] = r / a;
      dst[o + 1] = gr / a;
      dst[o + 2] = b / a;
      dst[o + 3] = a * 255;
    }
  }
  out.putImageData(img, 0, 0);
}
