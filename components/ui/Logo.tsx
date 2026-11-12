import Image from 'next/image';

/**
 * Official Zinggo wordmark (white, transparent), cropped to its artwork from brand-src/Logo-Zinggo.png.
 * 983x294 source; shown at a fixed height so the ratio is never distorted and it stays sharp on retina screens.
 * It is white, so use it on dark or brand-coloured surfaces.
 */
export function Logo({ className = '' }: { className?: string }) {
  return (
    <Image
      src="/brand/logo-zinggo.png"
      alt="Zinggo"
      width={983}
      height={294}
      quality={92}
      sizes="120px"
      priority
      className={`h-[26px] w-auto select-none sm:h-[30px] ${className}`}
    />
  );
}
