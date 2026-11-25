import type { Chart, FigureSet, Mark, Pic } from '../lib/types';

/* ---------- Figures (abstract reasoning) ---------- */

const STROKE = 3.2;

function arcPath(x: number, y: number, r: number, from: number, to: number) {
  const rad = (d: number) => (d * Math.PI) / 180;
  const sweep = (((to - from) % 360) + 360) % 360;
  const x0 = x + r * Math.cos(rad(from));
  const y0 = y + r * Math.sin(rad(from));
  const x1 = x + r * Math.cos(rad(to));
  const y1 = y + r * Math.sin(rad(to));
  return `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 ${sweep > 180 ? 1 : 0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
}

function pts(p: number[]) {
  const out: string[] = [];
  for (let i = 0; i + 1 < p.length; i += 2) out.push(`${p[i]},${p[i + 1]}`);
  return out.join(' ');
}

function MarkView({ m }: { m: Mark }) {
  switch (m.k) {
    case 'circle':
      return <circle cx={m.x} cy={m.y} r={m.r} fill={m.fill ? 'currentColor' : 'none'} />;
    case 'line':
      return <polyline points={pts(m.p)} fill="none" />;
    case 'poly':
      return <polygon points={pts(m.p)} fill={m.fill ? 'currentColor' : 'none'} />;
    case 'arc':
      return <path d={arcPath(m.x, m.y, m.r, m.from, m.to)} fill="none" />;
    case 'dot':
      return <circle cx={m.x} cy={m.y} r={4.6} fill="currentColor" stroke="none" />;
  }
}

/** A drawing on its own 100 × 100 grid, placed at (x, y) and scaled. */
function PicAt({ pic, x = 0, y = 0, scale = 1, frame }: { pic: Pic; x?: number; y?: number; scale?: number; frame?: 'circle' }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} strokeWidth={STROKE / scale}>
      {frame === 'circle' && <circle cx={50} cy={50} r={46} fill="#fff" />}
      {pic.map((m, i) => (
        <MarkView key={i} m={m} />
      ))}
    </g>
  );
}

function Ask({ x, y, size = 44 }: { x: number; y: number; size?: number }) {
  return (
    <text x={x} y={y} textAnchor="middle" dominantBaseline="central" className="fig-ask" fontSize={size}>
      ?
    </text>
  );
}

/** One drawing, used for figure choices. */
export function PicView({ pic, frame }: { pic: Pic; frame?: 'circle' }) {
  return (
    <svg className="fig-pic" viewBox="-2 -2 104 104" aria-hidden="true">
      <PicAt pic={pic} frame={frame} />
    </svg>
  );
}

/** The problem figure: a pyramid, a 3 × 3 grid or a single shape. */
export function FigureView({ fig }: { fig: FigureSet }) {
  if (fig.layout === 'matrix') {
    return (
      <svg className="fig fig-matrix" viewBox="-2 -2 304 304" role="img" aria-label="A 3 by 3 grid of figures with the last one missing">
        <rect x={0} y={0} width={300} height={300} rx={10} className="fig-grid" />
        {[100, 200].map((v) => (
          <g key={v} className="fig-grid">
            <line x1={v} y1={0} x2={v} y2={300} />
            <line x1={0} y1={v} x2={300} y2={v} />
          </g>
        ))}
        {fig.cells.map((c, i) => {
          const x = (i % 3) * 100;
          const y = Math.floor(i / 3) * 100;
          return c ? <PicAt key={i} pic={c} x={x + 12} y={y + 12} scale={0.76} /> : <Ask key={i} x={x + 50} y={y + 52} />;
        })}
      </svg>
    );
  }
  if (fig.layout === 'pyramid') {
    // Top, middle left, middle right, bottom left, bottom middle, bottom right.
    const pos = [
      [165, 55],
      [107, 158],
      [223, 158],
      [49, 261],
      [165, 261],
      [281, 261],
    ];
    const links = [
      [0, 1],
      [0, 2],
      [1, 3],
      [1, 4],
      [2, 4],
      [2, 5],
    ];
    const R = 41;
    const S = R / 46;
    return (
      <svg className="fig fig-pyramid" viewBox="0 0 330 316" role="img" aria-label="A pyramid of figures; each figure sits above the two figures it is joined to, and the top one is missing">
        <defs>
          <marker id="fig-head" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" className="fig-head" />
          </marker>
        </defs>
        {links.map(([a, b]) => {
          const [x0, y0] = pos[a];
          const [x1, y1] = pos[b];
          const d = Math.hypot(x1 - x0, y1 - y0);
          const ux = (x1 - x0) / d;
          const uy = (y1 - y0) / d;
          return <line key={`${a}${b}`} className="fig-link" x1={x0 + ux * (R + 4)} y1={y0 + uy * (R + 4)} x2={x1 - ux * (R + 6)} y2={y1 - uy * (R + 6)} markerEnd="url(#fig-head)" />;
        })}
        {fig.cells.map((c, i) => {
          const [cx, cy] = pos[i];
          return c ? (
            <PicAt key={i} pic={c} x={cx - 50 * S} y={cy - 50 * S} scale={S} frame={fig.frame} />
          ) : (
            <g key={i}>
              <circle cx={cx} cy={cy} r={R} className="fig-empty" />
              <Ask x={cx} y={cy + 2} size={40} />
            </g>
          );
        })}
      </svg>
    );
  }
  const only = fig.cells[0];
  return (
    <svg className="fig fig-single" viewBox="-6 -6 112 112" role="img" aria-label="The shape to look for">
      {only && <PicAt pic={only} frame={fig.frame} />}
    </svg>
  );
}

/* ---------- Charts (data interpretation) ---------- */

const SERIES_COLORS = ['var(--rose)', 'var(--violet)'];
const PIE_COLORS = ['#d6224f', '#6b3fd4', '#0b7a8a', '#ffc23d', '#3d1640', '#f49ab1', '#0b7a5e'];
const PIE_TEXT = ['#fff', '#fff', '#fff', '#2a1225', '#fff', '#2a1225', '#fff'];

const fmt = (v: number, suffix = '') => `${v.toLocaleString('en-US', { maximumFractionDigits: 2 })}${suffix}`;

function describe(c: Chart) {
  if (c.kind === 'pie') return `${c.title}. ${c.labels.map((l, i) => `${l}: ${fmt(c.series[0].values[i], c.suffix)}`).join('; ')}.`;
  return `${c.title}${c.unit ? ` (${c.unit})` : ''}. ${c.series
    .map((s) => `${c.series.length > 1 ? `${s.name}: ` : ''}${c.labels.map((l, i) => `${l} ${fmt(s.values[i], c.suffix)}`).join(', ')}`)
    .join('. ')}.`;
}

function Legend({ items }: { items: { name: string; color: string; value?: string }[] }) {
  return (
    <ul className="dchart-legend">
      {items.map((it) => (
        <li key={it.name}>
          <span className="sw" style={{ background: it.color }} />
          <span>{it.name}</span>
          {it.value && <b>{it.value}</b>}
        </li>
      ))}
    </ul>
  );
}

function Pie({ c }: { c: Chart }) {
  const values = c.series[0].values;
  const total = values.reduce((a, b) => a + b, 0);
  let angle = -90;
  const cx = 110;
  const cy = 110;
  const r = 100;
  const slices = values.map((v, i) => {
    const sweep = (v / total) * 360;
    const a0 = angle;
    const a1 = angle + sweep;
    angle = a1;
    const rad = (d: number) => (d * Math.PI) / 180;
    const p0 = [cx + r * Math.cos(rad(a0)), cy + r * Math.sin(rad(a0))];
    const p1 = [cx + r * Math.cos(rad(a1)), cy + r * Math.sin(rad(a1))];
    const mid = rad((a0 + a1) / 2);
    return {
      d: `M ${cx} ${cy} L ${p0[0].toFixed(2)} ${p0[1].toFixed(2)} A ${r} ${r} 0 ${sweep > 180 ? 1 : 0} 1 ${p1[0].toFixed(2)} ${p1[1].toFixed(2)} Z`,
      lx: cx + r * 0.64 * Math.cos(mid),
      ly: cy + r * 0.64 * Math.sin(mid),
      show: v / total >= 0.07,
      i,
      v,
    };
  });
  return (
    <div className="dchart-pie">
      <svg viewBox="0 0 220 220" aria-hidden="true">
        {slices.map((s) => (
          <path key={s.i} d={s.d} fill={PIE_COLORS[s.i % PIE_COLORS.length]} stroke="#fff" strokeWidth={2} />
        ))}
        {slices.map((s) =>
          s.show ? (
            <text key={s.i} x={s.lx} y={s.ly} textAnchor="middle" dominantBaseline="central" fill={PIE_TEXT[s.i % PIE_TEXT.length]} className="dchart-slice">
              {fmt(s.v, c.suffix)}
            </text>
          ) : null,
        )}
      </svg>
      <Legend items={c.labels.map((l, i) => ({ name: l, color: PIE_COLORS[i % PIE_COLORS.length], value: fmt(values[i], c.suffix) }))} />
    </div>
  );
}

function Axes({ c }: { c: Chart }) {
  const W = 360;
  const H = 230;
  const L = 44;
  const R = 10;
  const T = 22;
  const B = 34;
  const pw = W - L - R;
  const ph = H - T - B;
  const all = c.series.flatMap((s) => s.values);
  const min = c.min ?? 0;
  const max = c.max ?? Math.max(...all);
  const step = c.step ?? (max - min) / 5;
  const y = (v: number) => T + ph - ((v - min) / (max - min)) * ph;
  const n = c.labels.length;
  const band = pw / n;
  const ticks: number[] = [];
  for (let v = min; v <= max + 1e-9; v += step) ticks.push(Math.round(v * 1000) / 1000);
  const two = c.series.length > 1;
  const labelSize = n > 6 ? 10.5 : 12;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="dchart-svg" aria-hidden="true">
      {ticks.map((t) => (
        <g key={t}>
          <line x1={L} x2={W - R} y1={y(t)} y2={y(t)} className="dchart-grid" />
          <text x={L - 6} y={y(t)} textAnchor="end" dominantBaseline="central" className="dchart-tick">
            {t.toLocaleString('en-US')}
          </text>
        </g>
      ))}
      <line x1={L} x2={W - R} y1={T + ph} y2={T + ph} className="dchart-base" />
      {c.labels.map((l, i) => (
        <text key={l} x={L + band * (i + 0.5)} y={H - B + 18} textAnchor="middle" className="dchart-cat" fontSize={labelSize}>
          {l}
        </text>
      ))}
      {c.kind === 'bar' &&
        c.series.map((s, si) => {
          const bw = two ? band * 0.34 : band * 0.56;
          return s.values.map((v, i) => {
            const x = L + band * i + (two ? band / 2 - bw - 1.5 + si * (bw + 3) : (band - bw) / 2);
            return (
              <g key={`${si}-${i}`}>
                <rect x={x} y={y(v)} width={bw} height={T + ph - y(v)} rx={3} fill={SERIES_COLORS[si]} />
                <text x={x + bw / 2} y={y(v) - 5} textAnchor="middle" className="dchart-val" fontSize={two ? 10 : 11.5}>
                  {fmt(v, c.suffix)}
                </text>
              </g>
            );
          });
        })}
      {c.kind === 'line' &&
        c.series.map((s, si) => {
          const xs = s.values.map((_, i) => L + band * (i + 0.5));
          return (
            <g key={si}>
              <polyline points={s.values.map((v, i) => `${xs[i]},${y(v)}`).join(' ')} fill="none" stroke={SERIES_COLORS[si]} strokeWidth={3} strokeLinejoin="round" />
              {s.values.map((v, i) => (
                <g key={i}>
                  <circle cx={xs[i]} cy={y(v)} r={4.5} fill="#fff" stroke={SERIES_COLORS[si]} strokeWidth={2.5} />
                  <text x={xs[i]} y={y(v) - 10} textAnchor="middle" className="dchart-val" fontSize={11}>
                    {fmt(v, c.suffix)}
                  </text>
                </g>
              ))}
            </g>
          );
        })}
    </svg>
  );
}

/** A data chart with every value printed on it, plus a spoken summary for screen readers. */
export function ChartView({ chart }: { chart: Chart }) {
  return (
    <figure className="dchart" role="img" aria-label={describe(chart)}>
      <figcaption className="dchart-title">
        {chart.title}
        {chart.unit && <span className="dchart-unit">{chart.unit}</span>}
      </figcaption>
      {chart.kind === 'pie' ? <Pie c={chart} /> : <Axes c={chart} />}
      {chart.kind !== 'pie' && chart.series.length > 1 && <Legend items={chart.series.map((s, i) => ({ name: s.name, color: SERIES_COLORS[i] }))} />}
    </figure>
  );
}
