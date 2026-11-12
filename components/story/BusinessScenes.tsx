import type { CSSProperties, ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon';

const dl = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;

function Win({ title, dark = false, className = '', children }: { title: string; dark?: boolean; className?: string; children: ReactNode }) {
  return (
    <div className={`overflow-hidden rounded-[20px] border text-[12px] ${dark ? 'border-white/10 bg-white/[0.06] text-white' : 'border-line bg-white text-ink shadow-soft'} ${className}`}>
      <div className={`flex items-center justify-between border-b px-4 py-2.5 ${dark ? 'border-white/10' : 'border-line bg-mist'}`}>
        <span className="text-[12px] font-extrabold">{title}</span>
        <span className="h-2 w-2 rounded-full bg-brand" aria-hidden="true" />
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

/** Retail: barcode scan -> basket builds -> low stock triggers a supplier reorder. */
export function RetailScene() {
  const lines = [['Basmati Rice 5kg', '1,650'], ['Cooking Oil 1L', '540'], ['Tea Leaves 950g', '1,260']];
  return (
    <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]" role="img" aria-label="Retail demo: scanning products into a sale and a low-stock reorder from a supplier">
      <Win title="Scan at the counter">
        <div className="relative mb-4 h-20 overflow-hidden rounded-xl bg-night" aria-hidden="true">
          <div className="absolute inset-x-6 inset-y-3 flex gap-[3px]">{[3, 1, 2, 1, 3, 2, 1, 2, 3, 1, 2, 1, 3, 1, 2, 3, 1].map((w, i) => <span key={i} className="bg-white" style={{ width: w * 2 }} />)}</div>
          <span className="absolute inset-x-3 top-3 h-0.5 rounded bg-brand shadow-[0_0_14px_#00C7BE] [animation:scan-line_2.6s_ease-in-out_infinite]" />
        </div>
        <ul className="min-h-[104px] space-y-1.5">
          {lines.map(([n, p], i) => (
            <li key={n} className="loop-row flex justify-between rounded-lg bg-mist px-3 py-2" style={dl(900 + i * 1500)}>
              <span className="font-semibold">{n}</span><span className="font-extrabold">Rs {p}</span>
            </li>
          ))}
        </ul>
        <div className="loop-row mt-2 flex justify-between border-t border-dashed border-line pt-2 text-[14px] font-extrabold" style={dl(5600)}><span>Total</span><span>Rs 3,450</span></div>
      </Win>

      <Win title="Stock and suppliers">
        {[['Basmati Rice 5kg', 41, 82, false], ['Cooking Oil 1L', 4, 8, true], ['Sugar 1kg', 3, 6, true]].map(([n, q, w, low], i) => (
          <div key={n as string} className="mb-3">
            <div className="mb-1 flex justify-between font-semibold"><span>{n}</span><span className={low ? 'text-danger' : ''}>{q} left</span></div>
            <div className="h-2 overflow-hidden rounded-full bg-line"><div className={`grow-x h-full rounded-full ${low ? 'bg-danger' : 'bg-brand'}`} style={{ width: `${w}%`, ...dl(i * 150) }} /></div>
          </div>
        ))}
        <div className="loop-row flex items-center gap-2 rounded-xl bg-brand-soft px-3 py-2.5 font-bold text-brand-ink" style={dl(4200)}>
          <Icon name="truck" size={16} /> Reorder from supplier · Cooking Oil
        </div>
      </Win>
    </div>
  );
}

/** Restaurant: QR order at the table -> kitchen ticket -> rider delivery. */
export function RestaurantScene() {
  return (
    <div className="grid gap-4 md:grid-cols-3" role="img" aria-label="Restaurant demo: a QR table order becomes a kitchen ticket and then a delivery with a rider">
      <Win title="QR order · Table 4" dark>
        <div className="grid grid-cols-[84px_1fr] items-center gap-4">
          <div className="grid grid-cols-5 gap-[3px] rounded-xl bg-white p-2" aria-hidden="true">{Array.from({ length: 25 }).map((_, i) => <span key={i} className={`aspect-square rounded-[2px] ${[0, 1, 2, 4, 5, 6, 10, 12, 14, 18, 20, 22, 23, 24, 8, 16].includes(i) ? 'bg-night' : 'bg-white'}`} />)}</div>
          <div>
            <p className="font-extrabold">Scan to order</p>
            <p className="loop-row mt-2 rounded-lg bg-brand px-2.5 py-1.5 font-bold text-deep" style={dl(1200)}>Order sent ✓</p>
          </div>
        </div>
      </Win>
      <Win title="Kitchen" dark>
        {[['2 × Chicken Biryani'], ['1 × Zinger Burger'], ['2 × Mint Lemonade']].map(([n], i) => (
          <p key={n} className="loop-row mb-1.5 rounded-lg bg-white/10 px-3 py-2 font-semibold" style={dl(2000 + i * 700)}>{n}</p>
        ))}
        <p className="loop-row mt-2 font-extrabold text-brand" style={dl(4600)}>● Cooking</p>
      </Win>
      <Win title="Delivery · Rider Imran" dark>
        <div className="relative mt-2 h-2 overflow-hidden rounded-full bg-white/15"><div className="h-full origin-left rounded-full bg-brand [animation:loop-bar_9s_var(--ease-panel)_infinite]" /></div>
        <div className="mt-3 grid grid-cols-4 gap-1 text-center text-[10px] font-semibold text-white/70">{['Preparing', 'Picked up', 'On the way', 'Delivered'].map((s) => <span key={s}>{s}</span>)}</div>
        <p className="mt-4 flex items-center gap-2 font-bold text-white"><Icon name="truck" size={16} className="text-brand" /> Gulshan · 12 min</p>
      </Win>
    </div>
  );
}

/** Distributor: merchant orders arrive -> stock reserved -> delivery areas dispatch. */
export function DistributorScene() {
  return (
    <div className="grid gap-4 md:grid-cols-[1.2fr_1fr]" role="img" aria-label="Distributor demo: orders from merchants, carton stock and delivery areas">
      <Win title="Orders from merchants">
        {[['Noor General Store', '12 cartons', 'Confirmed'], ['City Mart', '8 cartons', 'Packing'], ['Bilal Traders', '20 cartons', 'Dispatched']].map(([a, b, c], i) => (
          <div key={a} className="loop-row mb-1.5 flex items-center justify-between rounded-lg bg-mist px-3 py-2.5" style={dl(500 + i * 1400)}>
            <span><b>{a}</b><span className="ml-2 text-muted">{b}</span></span>
            <span className="rounded-full bg-brand-soft px-2.5 py-1 text-[10.5px] font-bold text-brand-ink">{c}</span>
          </div>
        ))}
        <div className="mt-3 flex flex-wrap gap-1.5">{['Saddar', 'Gulshan', 'Clifton', 'DHA'].map((a, i) => <span key={a} className="loop-row rounded-full border border-line px-3 py-1 font-semibold" style={dl(5200 + i * 300)}>{a}</span>)}</div>
      </Win>
      <Win title="Stock · cartons">
        {[['Cooking oil', 140], ['Rice 5kg', 96], ['Tea', 64], ['Sugar', 28]].map(([n, v], i) => (
          <div key={n as string} className="mb-3">
            <div className="mb-1 flex justify-between font-semibold"><span>{n}</span><span>{v}</span></div>
            <div className="h-2.5 overflow-hidden rounded-full bg-line"><div className="grow-x h-full rounded-full bg-brand" style={{ width: `${(v as number) / 1.5}%`, ...dl(i * 140) }} /></div>
          </div>
        ))}
      </Win>
    </div>
  );
}
