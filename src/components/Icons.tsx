import type { CSSProperties } from 'react';

/** A soft, chubby heart: rounded bottom and a gently curved top dip, no sharp points. */
export const SOFT_HEART =
  'M12 20.8C11.3 20.8 10.7 20.5 10.1 20.1C5.6 16.9 2.4 13.9 2.4 9.6C2.4 6.6 4.7 4.3 7.5 4.3C9.2 4.3 10.6 5.1 11.5 6.3Q12 6.9 12.5 6.3C13.4 5.1 14.8 4.3 16.5 4.3C19.3 4.3 21.6 6.6 21.6 9.6C21.6 13.9 18.4 16.9 13.9 20.1C13.3 20.5 12.7 20.8 12 20.8Z';
const HEART = SOFT_HEART;
const CRACK = 'M12 7.2l-1.7 3.4 2.7 1.8-1.5 3.6';

const PATHS = {
  home: 'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z',
  book: 'M4 19V5a2 2 0 0 1 2-2h14v14H6a2 2 0 0 0-2 2zm0 0a2 2 0 0 0 2 2h14M9 7h7',
  exam: 'M9 3h6v3H9zM7 4.5H5V21h14V4.5h-2M8 11h8M8 15h5',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
  check: 'M5 12l4 4 10-10',
  x: 'M6 6l12 12M18 6L6 18',
  back: 'M15 6l-6 6 6 6',
  chevron: 'M9 6l6 6-6 6',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  bulb: 'M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z',
  bolt: 'M13 3L5 14h6l-1 7 8-11h-6z',
  clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2',
  flag: 'M5 21V4M5 4h11l-2 4 2 4H5',
  grid: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
  users: 'M16 20v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM22 20v-1a4 4 0 0 0-3-3.9M16 5.1a3 3 0 0 1 0 5.8',
  pause: 'M8 5v14M16 5v14',
  play: 'M7 4l13 8-13 8z',
  download: 'M12 3v12M7 10l5 5 5-5M4 20h16',
  upload: 'M12 21V9M7 14l5-5 5 5M4 4h16',
  calendar: 'M4 6h16v15H4zM4 10h16M8 3v5M16 3v5',
  lock: 'M6 11h12v10H6zM8 11V7a4 4 0 0 1 8 0v4',
  chat: 'M5 4h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-7l-5 4v-4H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM8 9h8M8 12.5h5',
  heart: HEART,
  broken: `${HEART}${CRACK}`,
} as const;

export type IconName = keyof typeof PATHS;

interface Props {
  name: IconName;
  size?: number;
  stroke?: number;
  filled?: boolean;
  color?: string;
  style?: CSSProperties;
  className?: string;
}

export function Icon({ name, size = 22, stroke = 2, filled = false, color = 'currentColor', style, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? color : 'none'}
      stroke={filled ? 'none' : color}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={style}
      className={className}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}

/**
 * Decorative soft heart for card backgrounds. Place it partly outside a card with
 * `overflow: hidden` so it peeks in from the edge, like a half-cut heart.
 */
export function DecoHeart({
  size,
  color,
  opacity = 1,
  rotate = 0,
  style,
}: {
  size: number;
  color: string;
  opacity?: number;
  rotate?: number;
  style?: CSSProperties;
}) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className="deco-heart"
      style={{ opacity, transform: rotate ? `rotate(${rotate}deg)` : undefined, ...style }}
    >
      <path d={SOFT_HEART} fill={color} />
    </svg>
  );
}

/** Three small hearts showing a topic's love level (0–3). */
export function LoveHearts({ level, size = 13 }: { level: number; size?: number }) {
  return (
    <span className="love-hearts" aria-hidden="true">
      {[1, 2, 3].map((i) =>
        i <= level ? <Icon key={i} name="heart" filled size={size} color="var(--rose)" /> : <Icon key={i} name="heart" size={size} stroke={2.4} color="var(--heart-empty)" />
      )}
    </span>
  );
}
