import { useMemo, useState } from 'react';
import type { BadgeKey, CategoryId } from '../data/types';
import { getStrip } from '../data/campaigns';
import { getCategory } from '../data/categories';
import { productOffer, productsInCategory } from '../lib/catalog';
import { cx, productsCount } from '../lib/format';
import { ProductCard } from '../components/cards';
import { InlineStrip } from '../components/banners';
import { Icon } from '../components/Icon';

type Filter = 'all' | 'offer' | BadgeKey;
const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'الكل' },
  { id: 'offer', label: 'العروض' },
  { id: 'school', label: 'مفضل للمدارس' },
  { id: 'best', label: 'الأكثر طلباً' },
  { id: 'new', label: 'جديد' },
];
type Sort = 'featured' | 'price-asc' | 'price-desc';

/** Category grid with two simple controls: a filter row and a price sort. */
export function CategoryBrowser({ categoryId }: { categoryId: CategoryId }) {
  const c = getCategory(categoryId)!;
  const all = useMemo(() => productsInCategory(categoryId).filter((p) => p.kind !== 'bundle'), [categoryId]);
  const [filter, setFilter] = useState<Filter>('all');
  const [sort, setSort] = useState<Sort>('featured');

  const test = (f: Filter) => (p: (typeof all)[number]) =>
    f === 'all' ? true : f === 'offer' ? !!productOffer(p) : (p.badges ?? []).includes(f as BadgeKey);
  const available = FILTERS.filter((f) => f.id === 'all' || all.some(test(f.id)));
  let list = all.filter(test(filter));
  if (sort !== 'featured') list = [...list].sort((a, b) => (sort === 'price-asc' ? a.price - b.price : b.price - a.price));
  const strip = getStrip(c.stripId);

  return (
    <div className="rs-browser">
      <div className="rs-toolbar">
        {available.length > 2 && (
          <div className="rs-toolbar__filters" role="group" aria-label="تصفية المنتجات">
            {available.map((f) => (
              <button type="button" key={f.id} className={cx('rs-chip', filter === f.id && 'is-active')} aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
                {f.label}
              </button>
            ))}
          </div>
        )}
        <div className="rs-toolbar__end">
          <p className="rs-toolbar__count" aria-live="polite">
            {productsCount(list.length)}
          </p>
          <label className="rs-toolbar__sort">
            <Icon name="sort" size="sm" />
            <span className="rs-visually-hidden">ترتيب حسب</span>
            <select className="rs-select rs-select--sm" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
              <option value="featured">المقترح</option>
              <option value="price-asc">السعر: من الأقل</option>
              <option value="price-desc">السعر: من الأعلى</option>
            </select>
          </label>
        </div>
      </div>
      <div className="rs-grid">
        {list.map((p, i) => (
          <div className="rs-grid__item" style={{ order: i * 2 }} key={p.slug}>
            <ProductCard p={p} priority={i < 2} />
          </div>
        ))}
        {strip && list.length > 4 && (
          <div className="rs-grid__full">
            <InlineStrip s={strip} />
          </div>
        )}
      </div>
    </div>
  );
}
