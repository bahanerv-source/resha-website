import { useEffect, useMemo, useState } from 'react';
import { getProduct, searchIndex } from '../lib/catalog';
import { productsCount } from '../lib/format';
import { runSearch, SUGGESTIONS } from '../lib/search';
import { waGeneral } from '../lib/whatsapp';
import { ProductCard } from '../components/cards';
import { Icon } from '../components/Icon';

/** The /search/ page: reads ?q=, filters the catalogue in the browser. */
export function SearchResults() {
  const index = useMemo(() => searchIndex(), []);
  const [q, setQ] = useState('');
  useEffect(() => {
    setQ(new URLSearchParams(location.search).get('q') ?? '');
  }, []);
  useEffect(() => {
    const url = new URL(location.href);
    q ? url.searchParams.set('q', q) : url.searchParams.delete('q');
    history.replaceState(null, '', url);
  }, [q]);
  const res = q.trim() ? runSearch(index, q) : null;
  const products = (res?.products ?? []).map((r) => getProduct(r.href.split('/')[2])!).filter(Boolean);

  return (
    <div className="rs-searchpage">
      <form className="rs-searchsheet__form rs-searchpage__form" role="search" onSubmit={(e) => e.preventDefault()}>
        <Icon name="search" />
        <label htmlFor="rs-search-page" className="rs-visually-hidden">
          ابحث في منتجات ريشة
        </label>
        <input id="rs-search-page" type="search" className="rs-searchsheet__input" placeholder="ابحث عن درع، ميدالية، هدية…" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" />
      </form>
      {!res && (
        <div className="rs-presets rs-searchpage__suggest">
          {SUGGESTIONS.map((s) => (
            <button type="button" className="rs-preset" key={s} onClick={() => setQ(s)}>
              {s}
            </button>
          ))}
        </div>
      )}
      {res && (
        <>
          {res.categories.length > 0 && (
            <div className="rs-searchsheet__cats">
              {res.categories.map((c) => (
                <a key={c.href} href={c.href} className="rs-chip">
                  {c.name}
                </a>
              ))}
            </div>
          )}
          <p className="rs-toolbar__count" aria-live="polite">
            {products.length ? `${productsCount(products.length)} لـ «${q}»` : `لا توجد نتائج لـ «${q}»`}
          </p>
          {products.length > 0 ? (
            <div className="rs-grid">
              {products.map((p) => (
                <ProductCard p={p} key={p.slug} />
              ))}
            </div>
          ) : (
            <div className="rs-empty">
              <p>لم نجد منتجاً بهذا الاسم — لكننا نصنع الكثير حسب الطلب.</p>
              <a className="rs-btn rs-btn--whatsapp" href={waGeneral()} target="_blank" rel="noopener">
                <Icon name="whatsapp" /> اسألنا على واتساب
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
}
