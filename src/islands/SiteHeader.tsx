import { useEffect, useRef, useState } from 'react';
import { site } from '../config/site';
import { categories } from '../data/categories';
import { getCampaign } from '../data/campaigns';
import type { SearchIndex } from '../lib/catalog';
import { cx, price } from '../lib/format';
import { loadIndex, runSearch, SUGGESTIONS } from '../lib/search';
import { waGeneral } from '../lib/whatsapp';
import { Icon } from '../components/Icon';

type Props = { active?: string };

export function SiteHeader({ active }: Props) {
  const campaign = getCampaign(site.currentCampaign);
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [announce, setAnnounce] = useState(true);
  const lastTrigger = useRef<HTMLElement | null>(null);

  const open = (which: 'menu' | 'search', e: React.MouseEvent<HTMLElement>) => {
    lastTrigger.current = e.currentTarget;
    which === 'menu' ? setMenu(true) : setSearch(true);
  };
  const close = () => {
    setMenu(false);
    setSearch(false);
    lastTrigger.current?.focus();
  };

  useEffect(() => {
    const lock = menu || search;
    document.documentElement.classList.toggle('rs-lock', lock);
    if (!lock) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menu, search]);

  const navCats = categories.filter((c) => c.inNav);
  const a = site.announcement;

  return (
    <>
      <a className="rs-skip" href="#main">
        انتقل إلى المحتوى
      </a>
      {a.enabled && announce && (
        <div className="rs-announce">
          <span className="rs-announce__item">
            <Icon name="truck" size="sm" /> {a.text}
          </span>
          <i className="rs-announce__sep" />
          <span>
            <strong>{a.highlight}</strong> — <a href={a.href}>{a.linkLabel}</a>
          </span>
          <button type="button" className="rs-announce__close" aria-label="إغلاق الشريط" onClick={() => setAnnounce(false)}>
            <Icon name="x" size="sm" />
          </button>
        </div>
      )}

      <header className="rs-header rs-site-header">
        <div className="rs-header__row">
          <div className="rs-header__start">
            <button type="button" className="rs-iconbtn rs-only-mobile" aria-label="القائمة" aria-expanded={menu} aria-controls="rs-drawer" onClick={(e) => open('menu', e)}>
              <Icon name="menu" size="lg" />
            </button>
            <button type="button" className="rs-hlink rs-only-desktop" onClick={(e) => open('search', e)} aria-haspopup="dialog">
              <Icon name="search" /> بحث
            </button>
          </div>
          <a href="/" className="rs-header__logo" aria-label={`${site.name} — الصفحة الرئيسية`}>
            <img src="/images/brand/risha-logo-brand.webp" width={426} height={288} alt={site.fullName} />
          </a>
          <div className="rs-header__end">
            <button type="button" className="rs-iconbtn rs-only-mobile" aria-label="بحث" onClick={(e) => open('search', e)} aria-haspopup="dialog">
              <Icon name="search" size="lg" />
            </button>
            <a href={waGeneral()} className="rs-hlink rs-hlink--wa rs-only-desktop" target="_blank" rel="noopener">
              <Icon name="whatsapp" /> اطلب عبر واتساب
            </a>
          </div>
        </div>
        <nav className="rs-header__nav rs-nav rs-only-desktop" aria-label="الأقسام">
          <a href={campaign.navHref} className={cx('rs-nav__link rs-nav__link--campaign', active === 'offers' && 'is-active')}>
            {campaign.navLabel}
          </a>
          {navCats.map((c) => (
            <a key={c.id} href={`/category/${c.slug}/`} className={cx('rs-nav__link', active === c.id && 'is-active')} aria-current={active === c.id ? 'page' : undefined}>
              {c.name}
            </a>
          ))}
        </nav>
      </header>

      {menu && (
        <div className="rs-overlay" onClick={close}>
          <aside className="rs-drawer" id="rs-drawer" role="dialog" aria-modal="true" aria-label="القائمة" onClick={(e) => e.stopPropagation()}>
            <div className="rs-drawer__head">
              <img src="/images/brand/risha-logo-brand.webp" alt={site.name} width={426} height={288} style={{ height: 40, width: 'auto' }} />
              <button type="button" className="rs-iconbtn" aria-label="إغلاق القائمة" onClick={close} autoFocus>
                <Icon name="x" size="lg" />
              </button>
            </div>
            <div className="rs-drawer__group">
              <p className="rs-drawer__title">المناسبة الحالية</p>
              <a href={campaign.navHref} className="rs-drawer__link rs-drawer__link--campaign">
                {campaign.navLabel} <Icon name="chevFwd" />
              </a>
            </div>
            <div className="rs-drawer__group">
              <p className="rs-drawer__title">الأقسام</p>
              <a href="/" className="rs-drawer__link">
                الرئيسية <Icon name="chevFwd" />
              </a>
              {categories.map((c) => (
                <a key={c.id} href={`/category/${c.slug}/`} className={cx('rs-drawer__link', active === c.id && 'is-active')}>
                  {c.name} <Icon name="chevFwd" />
                </a>
              ))}
              <a href="/offers/" className="rs-drawer__link">
                كل العروض <Icon name="chevFwd" />
              </a>
            </div>
            <div className="rs-drawer__foot">
              <a href={waGeneral()} className="rs-btn rs-btn--whatsapp rs-btn--block" target="_blank" rel="noopener">
                <Icon name="whatsapp" /> اطلب عبر واتساب
              </a>
              <p className="rs-caption" style={{ textAlign: 'center' }}>
                {site.whatsappHours}
              </p>
              <div className="rs-social">
                <a href={site.social.instagram} className="rs-iconbtn" aria-label="إنستغرام" target="_blank" rel="noopener">
                  <Icon name="instagram" />
                </a>
                <a href={site.social.facebook} className="rs-iconbtn" aria-label="فيسبوك" target="_blank" rel="noopener">
                  <Icon name="facebook" />
                </a>
              </div>
            </div>
          </aside>
        </div>
      )}

      {search && <SearchSheet onClose={close} />}
    </>
  );
}

function SearchSheet({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState('');
  const [index, setIndex] = useState<SearchIndex | null>(null);
  useEffect(() => {
    loadIndex().then(setIndex);
  }, []);
  const res = index && q.trim() ? runSearch(index, q) : null;
  const total = res ? res.products.length + res.categories.length : 0;

  return (
    <div className="rs-overlay rs-overlay--top" onClick={onClose}>
      <div className="rs-searchsheet" role="dialog" aria-modal="true" aria-label="البحث في المنتجات" onClick={(e) => e.stopPropagation()}>
        <form action="/search/" method="get" className="rs-searchsheet__form" role="search">
          <Icon name="search" />
          <label htmlFor="rs-q" className="rs-visually-hidden">
            ابحث في منتجات ريشة
          </label>
          <input
            id="rs-q"
            name="q"
            type="search"
            className="rs-searchsheet__input"
            placeholder="ابحث عن درع، ميدالية، هدية…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            autoFocus
            autoComplete="off"
            enterKeyHint="search"
          />
          <button type="button" className="rs-iconbtn" aria-label="إغلاق البحث" onClick={onClose}>
            <Icon name="x" />
          </button>
        </form>
        <div className="rs-searchsheet__body" aria-live="polite">
          {!q.trim() && (
            <div className="rs-searchsheet__suggest">
              <p className="rs-drawer__title">عمليات بحث شائعة</p>
              <div className="rs-presets">
                {SUGGESTIONS.map((s) => (
                  <button type="button" className="rs-preset" key={s} onClick={() => setQ(s)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {res && total === 0 && (
            <p className="rs-searchsheet__empty">
              لم نجد نتائج لـ «{q}». جرّب كلمة أخرى، أو <a href={waGeneral()}>اسألنا على واتساب</a> — نصنع حسب الطلب.
            </p>
          )}
          {res && res.categories.length > 0 && (
            <div className="rs-searchsheet__cats">
              {res.categories.map((c) => (
                <a key={c.href} href={c.href} className="rs-chip">
                  {c.name}
                </a>
              ))}
            </div>
          )}
          {res && res.products.length > 0 && (
            <ul className="rs-results">
              {res.products.slice(0, 6).map((p) => (
                <li key={p.href}>
                  <a href={p.href} className="rs-result">
                    <span className="rs-result__thumb">
                      <img src={p.image} alt="" loading="lazy" />
                    </span>
                    <span className="rs-result__text">
                      <span className="rs-result__name">{p.name}</span>
                      <span className="rs-result__meta">
                        {p.category}
                        {p.offer ? ` · ${p.offer}` : ''}
                      </span>
                    </span>
                    <span className={cx('rs-result__price', p.compareAt && 'is-offer')}>{price(p.price)}</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
          {res && res.products.length > 6 && (
            <a className="rs-btn rs-btn--text" href={`/search/?q=${encodeURIComponent(q)}`}>
              عرض كل النتائج ({res.products.length}) <Icon name="arrowFwd" size="sm" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
