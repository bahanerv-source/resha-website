import type { Offer, Product } from '../data/types';

/** Price of one piece at a given quantity (quantity tiers + option extras). */
export function unitPrice(p: Product, qty: number, extra = 0) {
  let u = p.price;
  for (const t of [...(p.tiers ?? [])].sort((a, b) => a.min - b.min)) if (qty >= t.min) u = t.price;
  return u + extra;
}

/** Free pieces earned for a paid quantity under a "buy X get Y" offer. */
export function freeQty(offer: Offer | undefined, qty: number) {
  if (!offer || offer.type !== 'bxgy' || !offer.buy || !offer.get) return 0;
  return Math.floor(qty / offer.buy) * offer.get;
}

/** What one piece really costs when the offer is used in full: 2.5 with 10+10 → 1.25. */
export function effectivePiece(p: Product, offer?: Offer) {
  if (!offer || offer.type !== 'bxgy' || !offer.buy || !offer.get) return undefined;
  return (p.price * offer.buy) / (offer.buy + offer.get);
}

/** Index of the active quantity tier. */
export function activeTier(p: Product, qty: number) {
  if (!p.tiers) return -1;
  let idx = 0;
  p.tiers.forEach((t, i) => {
    if (qty >= t.min) idx = i;
  });
  return idx;
}

/** Label for a tier column: "1–9", "10–29", "30+" */
export function tierLabel(p: Product, i: number) {
  const t = p.tiers![i];
  const next = p.tiers![i + 1];
  return next ? `${t.min}–${next.min - 1}` : `${t.min}+`;
}
