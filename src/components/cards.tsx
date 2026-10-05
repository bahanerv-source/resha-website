import type { BadgeKey, Category, Offer, Product } from '../data/types';
import { categoryUrl, productOffer, productUrl } from '../lib/catalog';
import { cx, dayMonth, num } from '../lib/format';
import { effectivePiece } from '../lib/pricing';
import { site } from '../config/site';
import { Icon } from './Icon';
import { Badge, Photo, Price } from './ui';

/* ---------------- Product card ----------------
   Editorial and quiet: large photograph → name → one offer line → price → simple CTA.
   At most ONE badge; offers are written as words, never as stickers. */
export function ProductCard({ p, force, priority, sizes }: { p: Product; force?: BadgeKey; priority?: boolean; sizes?: string }) {
  const offer = productOffer(p);
  const promo = !!offer && offer.type !== 'bundle';
  // One quiet label at most, and only for new arrivals — offers speak through the price line instead.
  const badge = (p.badges ?? []).includes('new') || force === 'new' ? ('new' as const) : undefined;
  const href = productUrl(p);
  const piece = effectivePiece(p, offer);
  return (
    <article className="rs-card">
      <a href={href} className="rs-card__media" tabIndex={-1} aria-hidden="true">
        {badge && <Badge kind={badge} />}
        <Photo src={p.images[0]} alt={p.name} priority={priority} sizes={sizes ?? '(min-width: 1024px) 33vw, 50vw'} />
      </a>
      <div className="rs-card__body">
        <h3 className="rs-card__name">
          <a href={href}>{p.name}</a>
        </h3>
        {promo && (
          <p className="rs-card__offer">
            {offer!.title}
            {piece !== undefined && <span className="rs-card__piece"> · أي {num(piece)} {site.currency} للقطعة</span>}
          </p>
        )}
        <Price now={p.price} was={p.compareAt} unit={p.unit && p.unit !== 'للقطعة' ? p.unit : undefined} from={p.priceFrom || !!p.tiers} center save={false} />
      </div>
      <a href={href} className="rs-card__cta">
        {promo ? 'اختر العرض' : 'خصّص واطلب'}
      </a>
    </article>
  );
}

/* ---------------- Offer tile (current offers) ----------------
   Framed photograph + the offer written as a campaign line (no stamp). */
export function OfferTile({ o }: { o: Offer }) {
  return (
    <a href={o.href} className="rs-otile">
      <span className="rs-otile__media">
        <Photo src={o.image} alt="" sizes="(min-width: 1024px) 25vw, 70vw" />
      </span>
      <span className="rs-otile__title">{o.title}</span>
      <span className="rs-otile__meta">{o.endsAt ? `حتى ${dayMonth(o.endsAt)}` : o.endsLabel ?? 'لفترة محدودة'}</span>
    </a>
  );
}

/* ---------------- Bundle / package (editorial split) ---------------- */
export function BundleCard({ p, reverse }: { p: Product; reverse?: boolean }) {
  const href = productUrl(p);
  return (
    <article className={cx('rs-pack', reverse && 'rs-pack--reverse')}>
      <a href={href} className="rs-pack__media" tabIndex={-1} aria-hidden="true">
        <Photo src={p.images[0]} alt={p.name} sizes="(min-width: 1024px) 50vw, 100vw" />
      </a>
      <div className="rs-pack__body">
        <p className="rs-eyebrow">باقات المدارس</p>
        <h3 className="rs-pack__title">
          <a href={href}>{p.name}</a>
        </h3>
        <p className="rs-pack__desc">{p.description}</p>
        {p.includes && (
          <ul className="rs-pack__list">
            {p.includes.map((i) => (
              <li key={i.label}>
                <b>{i.qty}</b> {i.label}
              </li>
            ))}
          </ul>
        )}
        <Price now={p.price} was={p.compareAt} unit={p.unit} large save />
        <p className="rs-pack__note">
          <Icon name="check" size="sm" /> {p.note}
        </p>
        <a href={href} className="rs-btn rs-btn--primary rs-btn--lg">
          اختر الباقة
        </a>
      </div>
    </article>
  );
}

/* ---------------- Category tile ---------------- */
export function CategoryCard({ c }: { c: Category }) {
  return (
    <a href={categoryUrl(c)} className="rs-ctile">
      <span className="rs-ctile__media">
        <Photo src={c.image} alt="" sizes="(min-width: 1024px) 25vw, 45vw" />
      </span>
      <span className="rs-ctile__name">{c.name}</span>
    </a>
  );
}
