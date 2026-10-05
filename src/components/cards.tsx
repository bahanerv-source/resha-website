import type { BadgeKey, Category, Offer, Product } from '../data/types';
import { categoryUrl, productOffer, productUrl } from '../lib/catalog';
import { cx } from '../lib/format';
import { Icon } from './Icon';
import { Photo, Price } from './ui';

/* ---------------- Product card ----------------
   Photograph on white → name → price → one black button.
   At most one small black label on the photo: the running offer, or "جديد". */
export function ProductCard({ p, force, priority, sizes }: { p: Product; force?: BadgeKey; priority?: boolean; sizes?: string }) {
  const offer = productOffer(p);
  const promo = !!offer && offer.type !== 'bundle';
  const isNew = (p.badges ?? []).includes('new') || force === 'new';
  const tag = promo ? offerLabel(offer!) : isNew ? 'جديد' : undefined;
  const href = productUrl(p);
  return (
    <article className="rs-card">
      <a href={href} className="rs-card__media" tabIndex={-1} aria-hidden="true">
        <Photo src={p.images[0]} alt={p.name} priority={priority} sizes={sizes ?? '(min-width: 1024px) 25vw, 50vw'} />
      </a>
      {tag && <span className="rs-card__tag">{tag}</span>}
      <div className="rs-card__body">
        <h3 className="rs-card__name">
          <a href={href}>{p.name}</a>
        </h3>
        <Price now={p.price} was={p.compareAt} unit={p.unit && p.unit !== 'للقطعة' ? p.unit : undefined} from={p.priceFrom || !!p.tiers} center save={false} />
      </div>
      <a href={href} className="rs-card__cta">
        <Icon name="bag" size="sm" /> خصّص واطلب
      </a>
    </article>
  );
}

/** Short offer label for the photo corner: "1+1 مجاناً", "خصم 25%". */
function offerLabel(o: Offer) {
  return o.type === 'percent' ? `خصم ${o.figure}` : `${o.figure} مجاناً`;
}

/* ---------------- Offer tile (current offers) ----------------
   Rounded photograph with the offer written underneath. */
export function OfferTile({ o }: { o: Offer }) {
  return (
    <a href={o.href} className="rs-otile">
      <span className="rs-otile__media">
        <Photo src={o.image} alt="" sizes="(min-width: 1024px) 25vw, 70vw" />
      </span>
      <span className="rs-otile__title">{o.title}</span>
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
