import type { SVGProps } from 'react';

const PATHS = {
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  chevL: 'M15 6l-6 6 6 6',
  chevR: 'M9 6l6 6-6 6',
  play: 'M8 5v14l11-7z',
  pause: 'M8 5v14M16 5v14',
  replay: 'M4 12a8 8 0 1 0 2.6-5.9M4 4v5h5',
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6L6 18',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4.2-4.2',
  bell: 'M6 16v-5a6 6 0 1 1 12 0v5l1.5 2h-15zM10 21h4',
  pos: 'M7 3h10v6H7zM4 9h16l1 9H3zM8 13h2M12 13h2M16 13h1M7 21h10',
  box: 'M3 7.5L12 3l9 4.5v9L12 21l-9-4.5zM3 7.5l9 4.5 9-4.5M12 12v9',
  orders: 'M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6',
  chart: 'M3 20h18M6 17v-6M11 17V6M16 17v-9',
  users: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 6.5M18 14a6.5 6.5 0 0 1 3.5 6',
  wallet: 'M3 7a2 2 0 0 1 2-2h13v4M3 7v11a2 2 0 0 0 2 2h15V9H5a2 2 0 0 1-2-2zM16 14.5h2',
  trend: 'M3 17l6-6 4 4 8-8M15 7h6v6',
  store: 'M4 9l1.5-5h13L20 9M4 9v11h16V9M4 9a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0A2.7 2.7 0 0 0 20 9M10 20v-5h4v5',
  qr: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 14h2v6h-4M14 18h2',
  truck: 'M2 6h11v10H2zM13 9h4l4 4v3h-8zM8 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM19 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0z',
  star: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z',
  gift: 'M4 10h16v10H4zM3 7h18v3H3zM12 7v13M12 7c-2-3-5-3-5-1s3 1 5 1zM12 7c2-3 5-3 5-1s-3 1-5 1z',
  scan: 'M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M4 12h16',
  mail: 'M3 6h18v12H3zM3 7l9 6 9-6',
  chat: 'M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.2A8 8 0 1 1 20 12z',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2.2 2.2L15.5 10',
  layers: 'M12 3l9 5-9 5-9-5zM3 13l9 5 9-5',
  building: 'M5 21V4h9v17M14 9h5v12M8 8h2M8 12h2M8 16h2M3 21h18',
  cash: 'M3 6h18v12H3zM12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z',
  clock: 'M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM12 8v4l3 2',
  back: 'M15 5l-7 7 7 7',
  home: 'M4 11l8-7 8 7v9H4zM10 20v-6h4v6',
  more: 'M6 12h.01M12 12h.01M18 12h.01',
  utensils: 'M7 3v8M4 3v5a3 3 0 0 0 6 0V3M7 11v10M17 3c-2 2-3 5-3 8h3v10',
  receipt: 'M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h4',
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({ name, size = 20, strokeWidth = 1.8, ...rest }: { name: IconName; size?: number; strokeWidth?: number } & Omit<SVGProps<SVGSVGElement>, 'name'>) {
  const filled = name === 'play';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}

/** Dimensional icon: layered tile with depth, highlight and offset shadow plate. */
export function IconTile({ name, tone = 'teal', size = 56 }: { name: IconName; tone?: 'teal' | 'dark' | 'light' | 'amber'; size?: number }) {
  const tones = {
    teal: 'bg-gradient-to-br from-[#3ff0e6] to-[#00a89f] text-deep shadow-[0_10px_18px_-8px_rgb(0_150_143/0.7),inset_0_1.5px_0_rgb(255_255_255/0.55)]',
    dark: 'bg-gradient-to-br from-[#2a2f45] to-[#0a081b] text-brand shadow-[0_10px_18px_-8px_rgb(10_8_27/0.7),inset_0_1.5px_0_rgb(255_255_255/0.2)]',
    light: 'bg-gradient-to-br from-white to-[#dff7f5] text-brand-ink shadow-[0_10px_18px_-10px_rgb(7_27_27/0.35),inset_0_1.5px_0_#fff]',
    amber: 'bg-gradient-to-br from-[#ffe98a] to-[#f5be1f] text-deep shadow-[0_10px_18px_-8px_rgb(190_140_0/0.6),inset_0_1.5px_0_rgb(255_255_255/0.6)]',
  } as const;
  return (
    <span className="relative inline-block" style={{ width: size, height: size }} aria-hidden="true">
      <span className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-[18px] bg-deep/10" />
      <span className={`relative grid h-full w-full place-items-center rounded-[18px] ${tones[tone]}`}>
        <Icon name={name} size={Math.round(size * 0.46)} strokeWidth={2} />
      </span>
    </span>
  );
}
