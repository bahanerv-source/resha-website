import { site } from '../config/site';

/** 12 → "12", 2.5 → "2.5", 1.25 → "1.25" (Western digits, no ".00"). */
export const num = (n: number) => String(Number(n.toFixed(2)));

/** "12 د.أ" */
export const price = (n: number) => `${num(n)} ${site.currency}`;

/** Percentage saved between an old and a new price, rounded. */
export const savingPct = (was: number, now: number) => Math.round(((was - now) / was) * 100);

const MONTHS = ['كانون الثاني', 'شباط', 'آذار', 'نيسان', 'أيار', 'حزيران', 'تموز', 'آب', 'أيلول', 'تشرين الأول', 'تشرين الثاني', 'كانون الأول'];

/** "12 تشرين الأول" — Levantine month names, Jordan time. */
export function dayMonth(iso: string) {
  const d = new Date(new Date(iso).getTime() + 3 * 3600 * 1000); // Asia/Amman (UTC+3)
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
}

/** Joins class names, skipping falsy ones. */
export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');

/** Splits "شكراً لمن [علّمنا]" into parts so the bracketed word can be accented. */
export function accentParts(text: string): { text: string; accent: boolean }[] {
  return text
    .split(/(\[[^\]]+\])/)
    .filter(Boolean)
    .map((t) => (t.startsWith('[') ? { text: t.slice(1, -1), accent: true } : { text: t, accent: false }));
}

/** Arabic counted noun for products: 1 → "منتج واحد", 2 → "منتجان", 3–10 → "5 منتجات", 11+ → "12 منتجاً". */
export function productsCount(n: number) {
  if (n === 1) return 'منتج واحد';
  if (n === 2) return 'منتجان';
  if (n >= 3 && n <= 10) return `${n} منتجات`;
  return `${n} منتجاً`;
}
