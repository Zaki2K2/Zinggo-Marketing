/**
 * Reads the real duration of a GIF (sum of its frame delays) from the file bytes, so the intro length
 * follows the animation instead of an arbitrary timeout. Browsers treat a delay below 2cs as 10cs.
 * Returns null if the buffer is not a parseable GIF.
 */
export function gifDurationMs(buf: ArrayBuffer): number | null {
  const b = new Uint8Array(buf);
  if (b.length < 14 || String.fromCharCode(b[0], b[1], b[2]) !== 'GIF') return null;
  const dv = new DataView(buf);
  const flags = b[10];
  let p = 13 + (flags & 0x80 ? 3 * (1 << ((flags & 7) + 1)) : 0);
  let cs = 0;
  let frames = 0;

  const skipSubBlocks = (q: number) => {
    while (q < b.length && b[q] !== 0) q += b[q] + 1;
    return q + 1;
  };

  while (p < b.length) {
    const t = b[p];
    if (t === 0x21) {
      if (b[p + 1] === 0xf9) {
        const d = dv.getUint16(p + 4, true);
        cs += d < 2 ? 10 : d;
        p += 8;
      } else {
        p = skipSubBlocks(p + 2);
      }
    } else if (t === 0x2c) {
      frames++;
      const f = b[p + 9];
      p += 10 + (f & 0x80 ? 3 * (1 << ((f & 7) + 1)) : 0) + 1;
      p = skipSubBlocks(p);
    } else if (t === 0x3b) {
      break;
    } else {
      p++;
    }
  }
  return frames > 0 && cs > 0 ? cs * 10 : null;
}
