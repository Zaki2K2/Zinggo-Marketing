import type { CSSProperties } from 'react';
import type { Product } from '@/lib/demo/types';

/** Square food photo for a demo product. Decorative: the product name is always shown next to it. */
export function ProductPhoto({ p, className = '', style }: { p: Pick<Product, 'image'>; className?: string; style?: CSSProperties }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={p.image} alt="" width={480} height={480} decoding="async" draggable={false} className={`object-cover ${className}`} style={style} />;
}
