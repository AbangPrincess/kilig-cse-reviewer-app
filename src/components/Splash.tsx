import { useEffect, useRef, useState } from 'react';
import { SOFT_HEART } from './Icons';

/** The logo stays up for 2 seconds; then the screen is tugged down a bit and springs up out of view, like a projector screen. */
const SHOW_MS = 2000;
/** Keep in step with the splash-reel animation in styles.css. */
const EXIT_MS = 850;

type RGB = [number, number, number];
/** Same pairs as the app's tiles: a flat face plus a solid darker edge underneath. */
const PINK: RGB = [214, 34, 79]; // --rose
const PINK_EDGE: RGB = [168, 24, 61]; // --rose-dark
const SUN: RGB = [255, 194, 61]; // --sun
const SUN_EDGE: RGB = [201, 143, 18]; // --sun-dark

/** Space between the bottom of the letters and the caption, in CSS pixels. */
const CAPTION_GAP = 10;

/** Opening screen: chubby pink "KiLIG" letters, shot from above with a slightly bulging wide lens. */
export function Splash({ onDone }: { onDone: () => void }) {
  const [leaving, setLeaving] = useState(false);
  const [drawn, setDrawn] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lockRef = useRef<HTMLDivElement>(null);
  const done = useRef(onDone);
  done.current = onDone;

  // White behind everything while the splash is up. The page underneath stops scrolling, so no
  // scrollbar shows; its reserved strip stays white like the splash.
  useEffect(() => {
    const root = document.documentElement;
    root.style.backgroundColor = '#fff';
    root.style.overflow = 'hidden';
    return () => {
      root.style.backgroundColor = '';
      root.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    document.getElementById('boot')?.remove();
    let exit = 0;
    let end = 0;
    const frame = requestAnimationFrame(() => {
      const canvas = canvasRef.current;
      const lock = lockRef.current;
      let ink: Ink | null = null;
      if (canvas) {
        try {
          ink = drawWordmark(canvas);
        } catch {
          // Without canvas support the caption still shows on the white screen.
        }
      }
      if (lock) {
        // On desktop the page keeps a white strip for its scrollbar on the right. Move the logo
        // half that width so it sits in the middle of the whole window, not just the page.
        const strip = Math.max(0, window.innerWidth - (lock.parentElement?.clientWidth ?? window.innerWidth));
        let rise = 0;
        if (ink && canvas) {
          // Tuck the caption just under the letters, then center letters and caption together.
          lock.style.setProperty('--sub-pull', `${canvas.clientHeight - ink.bottom - CAPTION_GAP}px`);
          rise = ink.top / 2;
        }
        lock.style.translate = `${strip / 2}px ${-rise}px`;
      }
      setDrawn(true);
      exit = window.setTimeout(() => setLeaving(true), SHOW_MS);
      end = window.setTimeout(() => done.current(), SHOW_MS + EXIT_MS);
    });
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(exit);
      clearTimeout(end);
    };
  }, []);

  return (
    <div className={leaving ? 'splash leaving' : 'splash'} role="img" aria-label="Kilig CSE Reviewer">
      <div ref={lockRef} className={drawn ? 'splash-lockup on' : 'splash-lockup'} aria-hidden="true">
        <canvas ref={canvasRef} className="splash-mark" />
        <span className="splash-sub">CSE Reviewer</span>
      </div>
      <div className="splash-rail" aria-hidden="true">
        <span className="splash-cord">
          <span className="splash-ring" />
        </span>
      </div>
    </div>
  );
}

/* ---------- Drawing ----------
 * Letters are built from thick round-capped strokes (units: cap height = 1), so no
 * letter has a corner or point; a blur-and-threshold pass rounds the inside corners
 * too. Each shape gets a flat face and a solid darker edge below it, like the app's
 * cards. Then the flat logo is projected through a wide-angle camera held above it
 * and looking down, the way a 0.5x photo from above looks, with a gentle lens bulge.
 * Finally it is sized and centered by its visible letters, not by its outer box.
 */

const STROKE = 0.34;
/** How far the darker edge shows below each shape, in letter units. */
const EDGE = 0.09;
/** Visible logo box in letter units (edge included), used for the first sizing guess. */
const BOX = { left: -0.17, right: 3.97, top: -0.38, bottom: 1.17 + EDGE };
const PAD = 0.2;
/** Lens bulge: the middle of the logo swells and the ends curve away, about a fifth at the edges. */
const BULGE = 0.25;
/** How much of the canvas the visible letters fill. */
const FILL = { w: 0.9, h: 0.8 };

/** Where the visible letters ended up, in CSS pixels from the canvas's top-left corner. */
interface Ink {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

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

function drawWordmark(canvas: HTMLCanvasElement): Ink | null {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const W = Math.max(1, Math.round(canvas.clientWidth * dpr));
  const H = Math.max(1, Math.round(canvas.clientHeight * dpr));
  canvas.width = W;
  canvas.height = H;
  const out = canvas.getContext('2d');
  if (!out) return null;

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
  if (!g) return null;
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

  // 2. Wide-angle camera held close above the logo, looking down at it: the top looms
  //    large and the letters taper toward the bottom, the way a 0.5x photo from above looks.
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

  // 3. A gentle lens bulge around the canvas center. A point that would land r pixels from
  //    the center without the lens is drawn where r' = r (1 + BULGE r² / R²) holds.
  const cx = W / 2;
  const cy = H / 2;
  const R2 = cx * cx;
  const throughLens = (x: number, y: number) => {
    const ex = x - cx;
    const ey = y - cy;
    const far = Math.hypot(ex, ey);
    if (far < 1e-6) return [x, y];
    let r = far;
    for (let i = 0; i < 6; i++) r -= (r * (1 + (BULGE * r * r) / R2) - far) / (1 + (3 * BULGE * r * r) / R2);
    return [cx + (ex * r) / far, cy + (ey * r) / far];
  };

  // 4. Size and center by the visible letters. Sample the logo's solid pixels, follow them
  //    through camera and lens, and nudge the scale and position until they fill the frame
  //    and sit exactly in the middle.
  const solid: number[] = [];
  for (let y = 0; y < TH; y += 2) {
    for (let x = 0; x < TW; x += 2) {
      if (tex[(y * TW + x) * 4 + 3] > 0.5) solid.push(...project(x + 0.5 - cxu, y + 0.5 - cyu));
    }
  }
  const halfU = ((BOX.right - BOX.left) / 2) * unit;
  const halfV = ((BOX.bottom - BOX.top) / 2) * unit;
  let f = Math.min((FILL.w * W) / (2 * project(halfU, -halfV)[0]), (FILL.h * H) / (project(0, halfV)[1] - project(0, -halfV)[1]));
  let ox = cx;
  let oy = cy;
  const bounds = () => {
    let x0 = Infinity;
    let x1 = -Infinity;
    let y0 = Infinity;
    let y1 = -Infinity;
    for (let i = 0; i < solid.length; i += 2) {
      const [x, y] = throughLens(ox + f * solid[i], oy + f * solid[i + 1]);
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
    return { x0, x1, y0, y1 };
  };
  if (solid.length) {
    for (let pass = 0; pass < 8; pass++) {
      const b = bounds();
      f *= Math.min((FILL.w * W) / (b.x1 - b.x0), (FILL.h * H) / (b.y1 - b.y0));
      ox += cx - (b.x0 + b.x1) / 2;
      oy += cy - (b.y0 + b.y1) / 2;
    }
  }

  // 5. Draw: for every canvas pixel, undo the lens and the camera to find its spot on the flat logo.
  const img = out.createImageData(W, H);
  const dst = img.data;
  for (let Y = 0; Y < H; Y++) {
    for (let X = 0; X < W; X++) {
      const ex = X + 0.5 - cx;
      const ey = Y + 0.5 - cy;
      const m = 1 + (BULGE * (ex * ex + ey * ey)) / R2;
      const dx = (cx + ex * m - ox) / f;
      const dy = (cy + ey * m - oy) / f;
      const denom = dy * sa + ca;
      if (denom <= 1e-6) continue;
      const ty = (dist * dy) / denom + cyu - 0.5;
      const fy = Math.floor(ty);
      if (fy < -1 || fy >= TH) continue;
      const tx = ((dist * ca) / denom) * dx + cxu - 0.5;
      const fx = Math.floor(tx);
      if (fx < -1 || fx >= TW) continue;
      const wx = tx - fx;
      const wy = ty - fy;
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

  if (!solid.length) return null;
  const b = bounds();
  const css = canvas.clientWidth / W;
  return { top: b.y0 * css, bottom: b.y1 * css, left: b.x0 * css, right: b.x1 * css };
}
