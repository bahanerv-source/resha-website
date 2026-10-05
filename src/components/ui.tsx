import type { ReactNode } from 'react';
import imageManifest from '../generated/images.json';
import type { BadgeKey } from '../data/types';
import { accentParts, cx, num, savingPct } from '../lib/format';
import { site } from '../config/site';
import { Icon, type IconName } from './Icon';

/* ---------------- Photo: responsive <img> ---------------- */
type ImageEntry = { w: number; h: number; variants?: { w: number; src: string }[] };
const manifest = imageManifest as Record<string, ImageEntry>;

export function Photo({
  src,
  alt,
  sizes = '(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw',
  priority,
  className,
  focus,
}: {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  /** CSS object-position */
  focus?: string;
}) {
  const m = manifest[src];
  const v = m?.variants;
  return (
    <img
      src={v?.length ? v[v.length - 1].src : src}
      srcSet={v?.length ? v.map((x) => `${x.src} ${x.w}w`).join(', ') : undefined}
      sizes={v?.length ? sizes : undefined}
      width={m?.w}
      height={m?.h}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : undefined}
      className={className}
      style={focus ? { objectPosition: focus } : undefined}
    />
  );
}

/* ---------------- Accented headline: one [word] in gold/burgundy ---------------- */
export function Accent({ text, onDark }: { text: string; onDark?: boolean }) {
  return (
    <>
      {accentParts(text).map((p, i) =>
        p.accent ? (
          <span key={i} className={onDark ? 'rs-accent-gold' : 'rs-accent'}>
            {p.text}
          </span>
        ) : (
          <span key={i}>{p.text}</span>
        ),
      )}
    </>
  );
}

/* ---------------- Badges ---------------- */
const BADGE: Record<BadgeKey, { label: string; icon: IconName }> = {
  offer: { label: 'عرض', icon: 'tag' },
  limited: { label: 'لفترة محدودة', icon: 'clock' },
  school: { label: 'مفضل للمدارس', icon: 'school' },
  best: { label: 'الأكثر طلباً', icon: 'star' },
  new: { label: 'جديد', icon: 'sparkle' },
};

export function Badge({ kind }: { kind: BadgeKey }) {
  return <span className={`rs-badge rs-badge--${kind}`}>{BADGE[kind].label}</span>;
}

/* ---------------- Offer stamp ---------------- */
export function Stamp({
  figure,
  caption,
  size,
  tone,
  corner,
  style,
}: {
  figure: string;
  caption?: string;
  size?: 'lg' | 'xl';
  tone?: 'offer' | 'light';
  corner?: boolean;
  style?: React.CSSProperties;
}) {
  const len = figure.replace(/\s/g, '').length;
  return (
    <div
      className={cx('rs-stamp', size && `rs-stamp--${size}`, tone && `rs-stamp--${tone}`, corner && 'rs-stamp--corner')}
      style={style}
    >
      <span className={cx('rs-stamp__fig', len > 5 ? 'rs-stamp__fig--xlong' : len > 3 && 'rs-stamp__fig--long')}>{figure}</span>
      {caption && <span className="rs-stamp__cap">{caption}</span>}
    </div>
  );
}

/* ---------------- Price block ---------------- */
export function Price({
  now,
  was,
  unit,
  from,
  center,
  large,
  save = true,
}: {
  now: number;
  was?: number;
  unit?: string;
  from?: boolean;
  center?: boolean;
  large?: boolean;
  save?: boolean;
}) {
  const offer = was !== undefined && was > now;
  const diff = offer ? was! - now : 0;
  const pct = offer ? savingPct(was!, now) : 0;
  return (
    <div className={cx('rs-price', center && 'rs-price--center', large && 'rs-price--lg')}>
      {from && <span className="rs-price__from">يبدأ من</span>}
      <span className={cx('rs-price__now', offer && 'rs-price__now--offer')}>
        {num(now)} <span className="rs-price__cur">{site.currency}</span>
      </span>
      {offer && (
        <span className="rs-price__was">
          <span className="rs-visually-hidden">بدلاً من </span>
          {num(was!)} {site.currency}
        </span>
      )}
      {offer && save && (
        <span className="rs-price__save">{pct >= 20 ? `وفّر ${pct}%` : `وفّر ${num(diff)} ${site.currency}`}</span>
      )}
      {unit && <span className="rs-price__unit">{unit}</span>}
    </div>
  );
}

/* ---------------- Section header ---------------- */
export function SectionHeader({
  eyebrow,
  title,
  sub,
  action,
  start,
  as: As = 'h2',
  id,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  action?: { label: string; href: string };
  start?: boolean;
  as?: 'h1' | 'h2';
  id?: string;
}) {
  return (
    <header className={cx('rs-section-head', start && 'rs-section-head--start')}>
      {eyebrow && <p className="rs-eyebrow">{eyebrow}</p>}
      <As className="rs-display-section" id={id}>
        <Accent text={title} />
      </As>
      {sub && <p className="rs-section-head__sub">{sub}</p>}
      {start && action ? (
        <a href={action.href} className="rs-btn rs-btn--text rs-section-head__action">
          {action.label} <Icon name="arrowFwd" size="sm" />
        </a>
      ) : (
        !start && <span className="rs-rule" aria-hidden="true" />
      )}
    </header>
  );
}

/* ---------------- Section wrapper ---------------- */
export function Section({
  tone,
  children,
  id,
  labelledBy,
  className,
}: {
  tone?: 'ivory' | 'sand' | 'cream';
  children: ReactNode;
  id?: string;
  labelledBy?: string;
  className?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cx('rs-section', tone && tone !== 'cream' && `rs-section--${tone}`, className)}
    >
      <div className="rs-container">{children}</div>
    </section>
  );
}

/* ---------------- WhatsApp button ---------------- */
export function WhatsAppButton({
  href,
  label = 'اطلب عبر واتساب',
  size,
  block,
  className,
}: {
  href: string;
  label?: string;
  size?: 'lg' | 'sm';
  block?: boolean;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={cx('rs-btn rs-btn--whatsapp', size && `rs-btn--${size}`, block && 'rs-btn--block', className)}
      target="_blank"
      rel="noopener"
    >
      <Icon name="whatsapp" /> {label}
    </a>
  );
}
