import { site } from '../config/site';
import { categories, getCategory } from '../data/categories';
import { getOffer } from '../data/offers';
import { products } from '../data/products';
import type { BadgeKey, Category, FieldConfig, FieldKey, Product } from '../data/types';

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export const productsBySlugs = (slugs: string[]) =>
  slugs.map((s) => {
    const p = getProduct(s);
    if (!p) throw new Error(`Unknown product slug "${s}" — check src/data/home.ts or campaigns.ts`);
    return p;
  });

export const productsInCategory = (id: Category['id']) =>
  products.filter((p) => p.category === id || p.alsoIn?.includes(id));

export const productsInOffer = (offerId: string) => products.filter((p) => p.offerId === offerId);

export const productUrl = (p: Product) => `/product/${p.slug}/`;
export const categoryUrl = (c: Category) => `/category/${c.slug}/`;
export const absUrl = (path: string) => site.url.replace(/\/$/, '') + path;

export const productCategory = (p: Product) => getCategory(p.category)!;
export const productOffer = (p: Product) => getOffer(p.offerId);

/** Products from the same category (then any), excluding the product itself. */
export function related(p: Product, n = 4) {
  const same = productsInCategory(p.category).filter((x) => x.slug !== p.slug && x.kind !== 'bundle');
  const rest = products.filter((x) => x.slug !== p.slug && !same.includes(x) && x.kind !== 'bundle');
  return [...same, ...rest].slice(0, n);
}

const BADGE_ORDER: BadgeKey[] = ['offer', 'limited', 'school', 'best', 'new'];

/** Up to two badges, in the design system's priority order. */
export function cardBadges(p: Product, force?: BadgeKey) {
  const set = new Set<BadgeKey>(p.badges ?? []);
  if (force) set.add(force);
  // A "buy X get Y" product shows the stamp instead of the generic "عرض" badge.
  if (productOffer(p)?.type === 'bxgy') set.delete('offer');
  const sorted = BADGE_ORDER.filter((b) => set.has(b));
  if (force && !sorted.slice(0, 2).includes(force)) return [sorted[0], force].filter(Boolean) as BadgeKey[];
  return sorted.slice(0, 2);
}

export const DEFAULT_OCCASIONS = ['يوم المعلم', 'تكريم المتفوقين', 'التخرّج', 'نهاية العام الدراسي', 'تقاعد', 'مناسبة أخرى'];

const FIELD_DEFAULTS: Record<FieldKey, Omit<FieldConfig, 'key'>> = {
  occasion: { label: 'المناسبة' },
  schoolName: { label: 'اسم المدرسة', placeholder: 'مثال: مدرسة الرواد النموذجية' },
  recipient: { label: 'اسم المكرَّم', placeholder: 'مثال: أ. سلمى الخطيب' },
  from: { label: 'الإهداء من' },
  text: { label: 'النص المطلوب', maxLength: 120 },
  year: { label: 'السنة / الدفعة', placeholder: 'مثال: 2026' },
  names: {
    label: 'الأسماء',
    placeholder: 'اسم في كل سطر',
    help: 'يمكنك كتابة الأسماء هنا أو إرسالها في محادثة واتساب.',
  },
  logo: { label: 'شعار المدرسة' },
  photo: { label: 'الصورة' },
};

export const resolveField = (f: FieldConfig): FieldConfig & { label: string } =>
  ({ ...FIELD_DEFAULTS[f.key], ...f, label: f.label ?? FIELD_DEFAULTS[f.key].label! }) as FieldConfig & { label: string };

/** Lightweight index for the search box (written to /search-index.json at build time). */
export function searchIndex() {
  return {
    categories: categories.map((c) => ({ name: c.name, href: categoryUrl(c), image: c.image, words: [c.name, ...(c.keywords ?? [])].join(' ') })),
    products: products.map((p) => {
      const c = productCategory(p);
      const o = productOffer(p);
      return {
        name: p.name,
        href: productUrl(p),
        image: p.images[0],
        price: p.price,
        compareAt: p.compareAt,
        unit: p.unit,
        category: c.name,
        offer: o?.title,
        words: [p.name, c.name, ...(p.alsoIn ?? []).map((id) => getCategory(id)?.name ?? ''), p.note, ...(p.keywords ?? []), ...(c.keywords ?? []), o?.title ?? ''].join(' '),
      };
    }),
  };
}
export type SearchIndex = ReturnType<typeof searchIndex>;
