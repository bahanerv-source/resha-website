import { site } from '../config/site';

/** https://wa.me/<number>?text=… — the number comes from src/config/site.ts only. */
export function waLink(message?: string) {
  const base = `https://wa.me/${site.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const waGeneral = () => waLink('مرحباً ريشة، أود الاستفسار عن منتجاتكم وعروضكم.');

export const waAbout = (subject: string) => waLink(`مرحباً ريشة، أود الاستفسار عن: ${subject}`);

export interface OrderLine {
  label: string;
  value?: string | number | null;
}

/** Builds the order message: one fact per line, empty fields skipped. */
export function orderMessage(productName: string, productUrl: string, lines: OrderLine[]) {
  const out = ['مرحباً ريشة، أود طلب:', `المنتج: ${productName}`, `الرابط: ${productUrl}`];
  for (const l of lines) {
    const v = typeof l.value === 'string' ? l.value.trim() : l.value;
    if (v !== undefined && v !== null && v !== '') out.push(`${l.label}: ${v}`);
  }
  return out.join('\n');
}
