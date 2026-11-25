import type { FigureSet, Mark, Pic } from '../../lib/types';
import { maker } from './make';

/*
 * Abstract-reasoning items: pyramids, 3 × 3 grids and hidden shapes, drawn as vector
 * marks on a 100 × 100 grid so they stay sharp on every screen.
 */

const ASK = 'Choose the figure that replaces the question mark.';
const PYRAMID = 'Each figure in the pyramid is made from the two figures joined below it. Choose the figure that replaces the question mark.';
const HIDDEN = 'Which figure contains the shape shown? The shape may be bigger or smaller, but it is not turned or flipped.';

const q = maker('analytical', 'f', { figures: ASK });

/* ---------- Drawing helpers ---------- */

const line = (...p: number[]): Mark => ({ k: 'line', p });
const poly = (...p: number[]): Mark => ({ k: 'poly', p });
const solid = (...p: number[]): Mark => ({ k: 'poly', p, fill: true });
const circle = (x: number, y: number, r: number, fill = false): Mark => (fill ? { k: 'circle', x, y, r, fill } : { k: 'circle', x, y, r });
const arc = (x: number, y: number, r: number, from: number, to: number): Mark => ({ k: 'arc', x, y, r, from, to });
const dot = (x: number, y: number): Mark => ({ k: 'dot', x, y });

/** Turn a drawing clockwise around the center of its grid. */
function turn(pic: Pic, deg: number): Pic {
  const t = (deg * Math.PI) / 180;
  const c = Math.cos(t);
  const s = Math.sin(t);
  const r2 = (v: number) => Math.round(v * 100) / 100;
  const pt = (x: number, y: number) => [r2(50 + (x - 50) * c - (y - 50) * s), r2(50 + (x - 50) * s + (y - 50) * c)];
  const pts = (p: number[]) => p.flatMap((_, i) => (i % 2 ? [] : pt(p[i], p[i + 1])));
  return pic.map((m): Mark => {
    switch (m.k) {
      case 'line':
      case 'poly':
        return { ...m, p: pts(m.p) };
      case 'circle':
      case 'dot': {
        const [x, y] = pt(m.x, m.y);
        return { ...m, x, y };
      }
      case 'arc': {
        const [x, y] = pt(m.x, m.y);
        return { ...m, x, y, from: m.from + deg, to: m.to + deg };
      }
    }
  });
}

/** A regular polygon with n sides, point up. */
function regular(n: number, r = 36): Mark {
  const p: number[] = [];
  for (let i = 0; i < n; i++) {
    const a = ((-90 + (360 / n) * i) * Math.PI) / 180;
    p.push(Math.round((50 + r * Math.cos(a)) * 100) / 100, Math.round((50 + r * Math.sin(a)) * 100) / 100);
  }
  return { k: 'poly', p };
}

const pyramid = (a: Pic, b: Pic, c: Pic): FigureSet => ({ layout: 'pyramid', frame: 'circle', cells: [null, [...a, ...b], [...b, ...c], a, b, c] });
const grid = (cells: Pic[]): FigureSet => ({ layout: 'matrix', cells: [...cells.slice(0, 8), null] });
const single = (pic: Pic): FigureSet => ({ layout: 'single', cells: [pic] });

/* Marks inside a circle frame (radius 46 around the center). */
const RAD = {
  up: line(50, 50, 50, 4),
  right: line(50, 50, 96, 50),
  down: line(50, 50, 50, 96),
  left: line(50, 50, 4, 50),
};
const ACROSS = line(4, 50, 96, 50);
const UPDOWN = line(50, 4, 50, 96);
const SLASH_DOWN = line(17.5, 17.5, 82.5, 82.5);
const SLASH_UP = line(82.5, 17.5, 17.5, 82.5);

/* Marks for grid cells. */
const H = line(12, 50, 88, 50);
const V = line(50, 12, 50, 88);
const D1 = line(20, 20, 80, 80);
const D2 = line(80, 20, 20, 80);
const SQUARE = poly(16, 16, 84, 16, 84, 84, 16, 84);
const TRI = poly(50, 14, 86, 82, 14, 82);
const BIG = circle(50, 50, 36);
const PLUS = [line(50, 22, 50, 78), line(22, 50, 78, 50)];
const CROSS_X = [line(24, 24, 76, 76), line(76, 24, 24, 76)];

/* Dot spots like a die. */
const S = { tl: dot(25, 25), tr: dot(75, 25), ml: dot(25, 50), mr: dot(75, 50), c: dot(50, 50), bl: dot(25, 75), br: dot(75, 75) };
const DIE: Record<number, Pic> = {
  1: [S.c],
  2: [S.tl, S.br],
  3: [S.tl, S.c, S.br],
  4: [S.tl, S.tr, S.bl, S.br],
  5: [S.tl, S.tr, S.c, S.bl, S.br],
  6: [S.tl, S.tr, S.ml, S.mr, S.bl, S.br],
};

/* Quarter arcs of a circle: top right, bottom right, bottom left, top left. */
const Q = { tr: arc(50, 50, 34, 270, 360), br: arc(50, 50, 34, 0, 90), bl: arc(50, 50, 34, 90, 180), tl: arc(50, 50, 34, 180, 270) };

/* Shapes for the row-and-column puzzle. */
const SHAPE = {
  circle: (style: Style): Pic => [circle(50, 50, 30, style === 'filled'), ...(style === 'dot' ? [dot(50, 50)] : [])],
  square: (style: Style): Pic => [style === 'filled' ? solid(22, 22, 78, 22, 78, 78, 22, 78) : poly(22, 22, 78, 22, 78, 78, 22, 78), ...(style === 'dot' ? [dot(50, 50)] : [])],
  triangle: (style: Style): Pic => [style === 'filled' ? solid(50, 18, 82, 78, 18, 78) : poly(50, 18, 82, 78, 18, 78), ...(style === 'dot' ? [dot(50, 58)] : [])],
};
type Style = 'filled' | 'empty' | 'dot';

const ARROW: Pic = [line(50, 82, 50, 18), line(33, 35, 50, 18, 67, 35)];
const FRAME = poly(6, 6, 94, 6, 94, 94, 6, 94);

export const FIGURES = [
  /* ---------- Pyramids: each figure is the two below it, put together ---------- */
  q('figures', 'Which figure belongs at the top of the pyramid?', ['Small center circle with lines to the top and to the right', 'Lines to the top and to the right, with no small circle', 'Small center circle with lines to the top, right and bottom', 'Small center circle with lines to the top and to the left'], 0, 'Each figure combines the two below it, so the top figure has everything in the bottom row: the line up, the small circle and the line to the right.', {
    directions: PYRAMID,
    figure: pyramid([RAD.up], [circle(50, 50, 12)], [RAD.right]),
    figChoices: [[RAD.up, circle(50, 50, 12), RAD.right], [RAD.up, RAD.right], [RAD.up, circle(50, 50, 12), RAD.right, RAD.down], [RAD.up, circle(50, 50, 12), RAD.left]],
  }),
  q('figures', 'Which figure belongs at the top of the pyramid?', ['Line across, dot at upper left, curve at the bottom', 'Line across, dot at upper right, curve at the bottom', 'Line across, dot at upper left, curve at the top', 'Dot at upper left and curve at the bottom, with no line'], 0, 'The top must hold all three bottom pieces in the same places: the line across, the dot at the upper left and the curve at the bottom.', {
    directions: PYRAMID,
    figure: pyramid([ACROSS], [dot(28, 28)], [arc(50, 50, 30, 20, 160)]),
    figChoices: [[ACROSS, dot(28, 28), arc(50, 50, 30, 20, 160)], [ACROSS, dot(72, 28), arc(50, 50, 30, 20, 160)], [ACROSS, dot(28, 28), arc(50, 50, 30, 200, 340)], [dot(28, 28), arc(50, 50, 30, 20, 160)]],
  }),
  q('figures', 'Which figure belongs at the top of the pyramid?', ['Small square, line from upper left to lower right, dot at upper right', 'Small square, line from upper right to lower left, dot at upper right', 'Line from upper left to lower right and dot at upper right, with no square', 'Small square, line from upper left to lower right, dot at lower left'], 0, 'Put the square, the slanted line and the dot together without moving any of them. The line runs from upper left to lower right, and the dot stays at the upper right.', {
    directions: PYRAMID,
    figure: pyramid([poly(35, 35, 65, 35, 65, 65, 35, 65)], [SLASH_DOWN], [dot(70, 30)]),
    figChoices: [
      [poly(35, 35, 65, 35, 65, 65, 35, 65), SLASH_DOWN, dot(70, 30)],
      [poly(35, 35, 65, 35, 65, 65, 35, 65), SLASH_UP, dot(70, 30)],
      [SLASH_DOWN, dot(70, 30)],
      [poly(35, 35, 65, 35, 65, 65, 35, 65), SLASH_DOWN, dot(30, 70)],
    ],
  }),
  q('figures', 'Which figure belongs at the top of the pyramid?', ['Triangle pointing up, line top to bottom, small circle at upper right', 'Triangle pointing down, line top to bottom, small circle at upper right', 'Triangle pointing up and small circle at upper right, with no line', 'Triangle pointing up, line top to bottom, small circle at upper left'], 0, 'The top combines the upward triangle, the line from top to bottom and the small circle at the upper right.', {
    directions: PYRAMID,
    figure: pyramid([poly(50, 24, 74, 66, 26, 66)], [UPDOWN], [circle(78, 30, 7)]),
    figChoices: [
      [poly(50, 24, 74, 66, 26, 66), UPDOWN, circle(78, 30, 7)],
      [poly(50, 76, 74, 34, 26, 34), UPDOWN, circle(78, 30, 7)],
      [poly(50, 24, 74, 66, 26, 66), circle(78, 30, 7)],
      [poly(50, 24, 74, 66, 26, 66), UPDOWN, circle(22, 30, 7)],
    ],
  }),
  q('figures', 'Which figure belongs at the top of the pyramid?', ['Two dots, curve at the top, short line at the bottom', 'One dot, curve at the top, short line at the bottom', 'Two dots and a short line at the bottom, with no curve', 'Two dots, curve at the top, short line at the bottom, line top to bottom'], 0, 'Combine the two dots, the curve at the top and the short line at the bottom, and add nothing else.', {
    directions: PYRAMID,
    figure: pyramid([dot(30, 50), dot(70, 50)], [arc(50, 50, 30, 200, 340)], [line(35, 76, 65, 76)]),
    figChoices: [
      [dot(30, 50), dot(70, 50), arc(50, 50, 30, 200, 340), line(35, 76, 65, 76)],
      [dot(30, 50), arc(50, 50, 30, 200, 340), line(35, 76, 65, 76)],
      [dot(30, 50), dot(70, 50), line(35, 76, 65, 76)],
      [dot(30, 50), dot(70, 50), arc(50, 50, 30, 200, 340), line(35, 76, 65, 76), UPDOWN],
    ],
  }),
  q('figures', 'Which figure belongs at the top of the pyramid?', ['Small full circle with a line from upper right to lower left', 'Left half of a small circle with a line from upper right to lower left', 'Small full circle with a line from upper left to lower right', 'Small full circle with no line'], 0, 'The two half circles join into a full circle, and the slanted line from the upper right to the lower left is added.', {
    directions: PYRAMID,
    figure: pyramid([arc(50, 50, 20, 90, 270)], [arc(50, 50, 20, 270, 90)], [SLASH_UP]),
    figChoices: [
      [circle(50, 50, 20), SLASH_UP],
      [arc(50, 50, 20, 90, 270), SLASH_UP],
      [circle(50, 50, 20), SLASH_DOWN],
      [circle(50, 50, 20)],
    ],
  }),

  /* ---------- Grids: the third figure is the first two put together ---------- */
  q('figures', 'Which figure completes the grid?', ['Square with an X inside', 'Square with a plus sign inside', 'An X alone', 'Square with an X and a small circle'], 0, 'In each row, the third figure is the first two drawn on top of each other: circle + plus, triangle + dot, so square + X.', {
    figure: grid([[BIG], PLUS, [BIG, ...PLUS], [TRI], [dot(50, 58)], [TRI, dot(50, 58)], [SQUARE], CROSS_X]),
    figChoices: [[SQUARE, ...CROSS_X], [SQUARE, ...PLUS], CROSS_X, [SQUARE, ...CROSS_X, circle(50, 50, 12)]],
  }),
  q('figures', 'Which figure completes the grid?', ['Plus sign and X together, like a star with 8 points', 'A plus sign alone', 'An X alone', 'An 8-point star inside a circle'], 0, 'Each row puts the first two figures together. In the last row, the plus sign and the X combine into an 8-point star.', {
    figure: grid([[H], [V], [H, V], [D1], [D2], [D1, D2], [H, V], [D1, D2]]),
    figChoices: [[H, V, D1, D2], [H, V], [D1, D2], [H, V, D1, D2, BIG]],
  }),
  q('figures', 'Which figure completes the grid?', ['Bottom half of a circle with a line top to bottom', 'Bottom half of a circle with a line across', 'Top half of a circle with a line top to bottom', 'Full circle with a line top to bottom'], 0, 'Each row adds the first two figures. The bottom half circle plus the vertical line gives a bottom half circle with a vertical line.', {
    figure: grid([
      [arc(50, 50, 34, 90, 270)],
      [arc(50, 50, 34, 270, 90)],
      [circle(50, 50, 34)],
      [arc(50, 50, 34, 180, 360)],
      [line(16, 50, 84, 50)],
      [arc(50, 50, 34, 180, 360), line(16, 50, 84, 50)],
      [arc(50, 50, 34, 0, 180)],
      [line(50, 16, 50, 84)],
    ]),
    figChoices: [
      [arc(50, 50, 34, 0, 180), line(50, 16, 50, 84)],
      [arc(50, 50, 34, 0, 180), line(16, 50, 84, 50)],
      [arc(50, 50, 34, 180, 360), line(50, 16, 50, 84)],
      [circle(50, 50, 34), line(50, 16, 50, 84)],
    ],
  }),
  q('figures', 'Which figure completes the grid?', ['Dots at upper left, upper right and center', 'Dots at upper left and upper right', 'Dots at upper left, upper right, center and lower left', 'Dots at the center, lower left and lower right'], 0, 'Each row puts the dots of the first two figures together: upper left and upper right from the first, center from the second.', {
    figure: grid([[S.tl], [S.br], [S.tl, S.br], [S.tr], [S.bl], [S.tr, S.bl], [S.tl, S.tr], [S.c]]),
    figChoices: [[S.tl, S.tr, S.c], [S.tl, S.tr], [S.tl, S.tr, S.c, S.bl], [S.c, S.bl, S.br]],
  }),

  /* ---------- Grids: lines found in both figures cancel out ---------- */
  q('figures', 'Which figure completes the grid?', ['A plus sign: a line across and a line top to bottom', 'Line across, line top to bottom and a slanted line', 'One slanted line from upper left to lower right', 'Line top to bottom and a line from upper right to lower left'], 0, 'In each row, a line that appears in both the first and second figures disappears; the rest are kept. In the last row the shared slanted line cancels, leaving the line across and the line top to bottom.', {
    figure: grid([[H, V], [V, D2], [H, D2], [D1, D2], [D2, H], [D1, H], [H, D1], [D1, V]]),
    figChoices: [[H, V], [H, D1, V], [D1], [V, D2]],
    why: { 1: 'Simply adding the figures does not fit the first row: there, the shared vertical line is gone. Shared lines cancel.' },
  }),
  q('figures', 'Which figure completes the grid?', ['Top half of a circle', 'Three quarters of a circle, open at the lower right', 'A quarter circle at the lower left', 'Bottom half of a circle'], 0, 'A quarter that shows in both of the first two figures cancels out. In the last row, the lower-left quarter cancels, leaving the two top quarters: the top half.', {
    figure: grid([[Q.tl, Q.tr], [Q.tr, Q.br], [Q.tl, Q.br], [Q.br, Q.bl], [Q.tr, Q.br], [Q.bl, Q.tr], [Q.tr, Q.bl], [Q.bl, Q.tl]]),
    figChoices: [[Q.tl, Q.tr], [Q.tr, Q.bl, Q.tl], [Q.bl], [Q.br, Q.bl]],
  }),
  q('figures', 'Which figure completes the grid?', ['Dots at upper right, lower left and lower right', 'Dots at upper right, center, lower left and lower right', 'One dot at the center', 'Dots at upper right and lower right'], 0, 'A dot in the same spot in both of the first two figures cancels out; the other dots stay. In the last row the center dot cancels.', {
    figure: grid([[S.tl, S.tr, S.c], [S.tr, S.bl], [S.tl, S.c, S.bl], [S.tl, S.br], [S.tl, S.bl, S.c], [S.br, S.bl, S.c], [S.tr, S.c, S.br], [S.c, S.bl]]),
    figChoices: [[S.tr, S.bl, S.br], [S.tr, S.c, S.bl, S.br], [S.c], [S.tr, S.br]],
  }),

  /* ---------- Grids: counting, rows and columns, turning ---------- */
  q('figures', 'Which figure completes the grid?', ['Five dots', 'Four dots', 'Six dots', 'Three dots'], 0, 'Across each row, one dot is added. Each row also starts one dot higher than the row above: 1-2-3, 2-3-4, 3-4-5.', {
    figure: grid([DIE[1], DIE[2], DIE[3], DIE[2], DIE[3], DIE[4], DIE[3], DIE[4]]),
    figChoices: [DIE[5], DIE[4], DIE[6], DIE[3]],
  }),
  q('figures', 'Which figure completes the grid?', ['Filled square', 'Empty square', 'Square with a dot', 'Filled triangle'], 0, 'Every row and every column has one circle, one square and one triangle, and one each that is filled, empty and dotted. The last row is missing a square, and the last column is missing a filled figure.', {
    figure: grid([
      SHAPE.circle('filled'),
      SHAPE.square('empty'),
      SHAPE.triangle('dot'),
      SHAPE.square('dot'),
      SHAPE.triangle('filled'),
      SHAPE.circle('empty'),
      SHAPE.triangle('empty'),
      SHAPE.circle('dot'),
    ]),
    figChoices: [SHAPE.square('filled'), SHAPE.square('empty'), SHAPE.square('dot'), SHAPE.triangle('filled')],
  }),
  q('figures', 'Which figure completes the grid?', ['Arrow pointing left', 'Arrow pointing up', 'Arrow pointing down and to the left', 'Arrow pointing right'], 0, 'In each row the arrow turns 45° clockwise at every step, and each row starts facing where the row above ended: up → right, then right → down, then down → left.', {
    figure: grid([turn(ARROW, 0), turn(ARROW, 45), turn(ARROW, 90), turn(ARROW, 90), turn(ARROW, 135), turn(ARROW, 180), turn(ARROW, 180), turn(ARROW, 225)]),
    figChoices: [turn(ARROW, 270), turn(ARROW, 0), turn(ARROW, 225), turn(ARROW, 90)],
  }),
  q('figures', 'Which figure completes the grid?', ['A 7-sided figure', 'A 6-sided figure', 'An 8-sided figure', 'A 5-sided figure'], 0, 'Across each row, the figures gain one side: 3-4-5, 4-5-6, then 5-6-7.', {
    figure: grid([[regular(3)], [regular(4)], [regular(5)], [regular(4)], [regular(5)], [regular(6)], [regular(5)], [regular(6)]]),
    figChoices: [[regular(7)], [regular(6)], [regular(8)], [regular(5)]],
  }),

  /* ---------- Hidden shapes ---------- */
  q('figures', 'Which figure contains this shape?', ['Square with a line from upper left to lower right and a line top to bottom', 'Square with a line from upper right to lower left and a line top to bottom', 'Square with a line across and a line top to bottom', 'Square with a line across and a line from upper right to lower left'], 0, 'The shape is a right triangle with its square corner at the lower left. Only the figure whose slanted line runs from upper left to lower right has it: that line cuts off exactly this triangle along the left and bottom sides.', {
    directions: HIDDEN,
    figure: single([poly(20, 20, 20, 80, 80, 80)]),
    figChoices: [
      [FRAME, line(6, 6, 94, 94), line(50, 6, 50, 94)],
      [FRAME, line(94, 6, 6, 94), line(50, 6, 50, 94)],
      [FRAME, line(6, 50, 94, 50), line(50, 6, 50, 94)],
      [FRAME, line(94, 6, 6, 94), line(6, 50, 94, 50)],
    ],
  }),
  q('figures', 'Which figure contains this shape?', ['Square with a Z shape and a line top to bottom', 'Square with a backward Z shape and a line top to bottom', 'Square with an N shape and a line across', 'Square with two bars and a cross, but no slanted line'], 0, 'The shape is a Z: a top bar, a slant down to the left, then a bottom bar. Only the figure with a true Z has the slant going from upper right to lower left between the two bars.', {
    directions: HIDDEN,
    figure: single([line(20, 25, 80, 25, 20, 75, 80, 75)]),
    figChoices: [
      [FRAME, line(20, 25, 80, 25, 20, 75, 80, 75), line(50, 6, 50, 94)],
      [FRAME, line(80, 25, 20, 25, 80, 75, 20, 75), line(50, 6, 50, 94)],
      [FRAME, line(25, 80, 25, 20, 75, 80, 75, 20), line(6, 50, 94, 50)],
      [FRAME, line(20, 25, 80, 25), line(20, 75, 80, 75), line(50, 6, 50, 94), line(6, 50, 94, 50)],
    ],
  }),
  q('figures', 'Which figure contains this shape?', ['Square with a > shape and a cross', 'Square with a < shape and a cross', 'Square with an upside-down V and a cross', 'Square with a V shape and a cross'], 0, 'The shape is a ">" that points to the right. The other figures hold the same corner facing left, up or down, which counts as turned.', {
    directions: HIDDEN,
    figure: single([line(30, 20, 70, 50, 30, 80)]),
    figChoices: [
      [FRAME, line(30, 20, 70, 50, 30, 80), line(50, 6, 50, 94), line(6, 50, 94, 50)],
      [FRAME, line(70, 20, 30, 50, 70, 80), line(50, 6, 50, 94), line(6, 50, 94, 50)],
      [FRAME, line(20, 70, 50, 30, 80, 70), line(50, 6, 50, 94), line(6, 50, 94, 50)],
      [FRAME, line(20, 30, 50, 70, 80, 30), line(50, 6, 50, 94), line(6, 50, 94, 50)],
    ],
  }),
  q('figures', 'Which figure contains this shape?', ['Square with a shape leaning right and a slanted line', 'Square with a shape leaning left and a slanted line', 'Square with a rectangle and a slanted line', 'Square with a shape wider at the bottom and a slanted line'], 0, 'The shape is a parallelogram whose top edge sits farther to the right than its bottom edge. Only the shape leaning right matches it.', {
    directions: HIDDEN,
    figure: single([poly(35, 25, 85, 25, 65, 75, 15, 75)]),
    figChoices: [
      [FRAME, poly(35, 25, 85, 25, 65, 75, 15, 75), line(6, 94, 94, 6)],
      [FRAME, poly(15, 25, 65, 25, 85, 75, 35, 75), line(6, 94, 94, 6)],
      [FRAME, poly(25, 25, 75, 25, 75, 75, 25, 75), line(6, 94, 94, 6)],
      [FRAME, poly(30, 25, 70, 25, 85, 75, 15, 75), line(6, 94, 94, 6)],
    ],
  }),
];
