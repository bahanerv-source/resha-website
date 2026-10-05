import type { ReactNode } from 'react';
import type { Artwork, Banner, Campaign, Strip } from '../data/types';
import { site } from '../config/site';
import { cx } from '../lib/format';
import { waGeneral } from '../lib/whatsapp';
import { Icon } from './Icon';
import { Island } from './Island';
import { Accent, Photo, Scroller, WhatsAppButton } from './ui';

/* ---------------- Seasonal hero ----------------
   A full-bleed campaign: one big photograph, one headline, one sentence, one action. */
export function Hero({ c, h1 = true }: { c: Campaign; h1?: boolean }) {
  const H = h1 ? 'h1' : 'h2';
  const dark = c.tone === 'dark';
  return (
    <section className={cx('rs-cover', dark ? 'rs-cover--dark rs-on-dark' : 'rs-cover--light')} aria-label={c.eyebrow}>
      <div className="rs-cover__media">
        <Photo src={c.image} alt={c.imageAlt} priority focus={c.imageFocus} sizes="100vw" />
      </div>
      <div className="rs-cover__inner">
        <div className="rs-cover__copy">
          <p className="rs-cover__eyebrow">{c.eyebrow}</p>
          <H className="rs-cover__title">
            <Accent text={c.headline} onDark={dark} />
          </H>
          <p className="rs-cover__sub">{c.sub}</p>
          <a href={c.primary.href} className={cx('rs-btn rs-btn--lg', dark ? 'rs-btn--light' : 'rs-btn--primary')}>
            {c.primary.label}
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Homepage hero: designed banners ----------------
   Each banner already carries its headline and button, so the whole picture is the link.
   Phones show a taller crop toward the side that holds the text. */
export function HeroBanners({ title, slides }: { title: string; slides: { artwork: Artwork; alt: string; href: string }[] }) {
  const items = slides.map((s, i) => (
    <a href={s.href} className="rs-heroart" key={s.artwork.src}>
      <Photo src={s.artwork.src} alt={s.alt} priority={i === 0} eager sizes="100vw" focus={artFocus(s.artwork)} />
    </a>
  ));
  return (
    <section className="rs-herobanners" aria-label={title}>
      <h1 className="rs-visually-hidden">{title}</h1>
      {items.length > 1 ? (
        <Scroller label={title} className="rs-scroller--hero" dots autoplay>
          {items}
        </Scroller>
      ) : (
        items
      )}
    </section>
  );
}

/** object-position that keeps a banner's text in view when it is cropped. */
export const artFocus = (a: Artwork) => (a.textSide === 'right' ? '100% 50%' : '0% 50%');

/* ---------------- Countdown band (real deadlines only) ---------------- */
export function CountdownBand({ title, endsAt }: { title: string; endsAt: string }) {
  return (
    <section className="rs-timeband rs-on-dark" aria-label={title}>
      <h2 className="rs-timeband__title">{title}</h2>
      <Island name="Countdown" props={{ endsAt, variant: 'light' }} />
    </section>
  );
}

/* ---------------- Page header (category & offers pages) ---------------- */
export function PageHero({
  eyebrow,
  title,
  intro,
  image,
  imageAlt = '',
  focus = '22% 50%',
  href,
  crumbs,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  image: string;
  imageAlt?: string;
  /** CSS object-position for the header picture. */
  focus?: string;
  /** Makes the picture a link (for designed banners that show a button). */
  href?: string;
  crumbs?: { label: string; href?: string }[];
  children?: ReactNode;
}) {
  return (
    <header className="rs-phead">
      {href ? (
        <a href={href} className="rs-phead__media">
          <Photo src={image} alt={imageAlt} priority focus={focus} sizes="100vw" />
        </a>
      ) : (
        <div className="rs-phead__media">
          <Photo src={image} alt={imageAlt} priority focus={focus} sizes="100vw" />
        </div>
      )}
      <div className="rs-container rs-phead__text">
        {crumbs && <Crumbs items={crumbs} />}
        <p className="rs-eyebrow">{eyebrow}</p>
        <h1 className="rs-phead__title">
          <Accent text={title} />
        </h1>
        <p className="rs-phead__intro">{intro}</p>
        {children}
      </div>
    </header>
  );
}

export function Crumbs({ items }: { items: { label: string; href?: string }[]; onDark?: boolean }) {
  return (
    <nav aria-label="مسار التنقل">
      <ol className="rs-crumbs">
        {items.map((i) => (
          <li key={i.label}>{i.href ? <a href={i.href}>{i.label}</a> : <span aria-current="page">{i.label}</span>}</li>
        ))}
      </ol>
    </nav>
  );
}

/* ---------------- Large campaign banner (between sections) ----------------
   Large-format photograph with Arabic typography set into it. */
export function CampaignBanner({ b }: { b: Banner }) {
  const dark = b.tone === 'dark';
  const figure = b.stamp?.figure ?? b.figure;
  const unit = b.stamp?.caption ?? b.figureUnit;
  return (
    <section className={cx('rs-promo', dark ? 'rs-promo--dark rs-on-dark' : 'rs-promo--light')} aria-label={b.eyebrow}>
      <div className="rs-promo__media">
        <Photo src={b.image} alt={b.imageAlt ?? ''} focus="20% 50%" sizes="100vw" />
      </div>
      <div className="rs-promo__copy">
        <p className="rs-cover__eyebrow">{b.eyebrow}</p>
        <h2 className="rs-promo__title">
          <Accent text={b.title} onDark={dark} />
        </h2>
        {figure && (
          <p className="rs-promo__figure">
            <span className="rs-promo__num">{figure}</span>
            {unit && <span className="rs-promo__unit">{unit}</span>}
          </p>
        )}
        <p className="rs-promo__text">{b.text}</p>
        <a href={b.cta.href} className={cx('rs-btn rs-btn--lg', dark ? 'rs-btn--light' : 'rs-btn--primary')}>
          {b.cta.label}
        </a>
      </div>
    </section>
  );
}

/* ---------------- Offer banner inside product grids ----------------
   Split composition: photograph + the offer set as typography. */
export function InlineStrip({ s }: { s: Strip }) {
  const dark = s.tone === 'burgundy';
  return (
    <aside className={cx('rs-split', dark ? 'rs-split--dark rs-on-dark' : 'rs-split--light')}>
      <div className="rs-split__media">
        <Photo src={s.image} alt="" sizes="(min-width: 1024px) 50vw, 100vw" />
      </div>
      <div className="rs-split__copy">
        <p className="rs-split__fig" aria-hidden="true">
          <span className="rs-split__num">{s.stamp.figure}</span>
          <span className="rs-split__cap">{s.stamp.caption}</span>
        </p>
        <p className="rs-split__title">{s.title}</p>
        <p className="rs-split__sub">{s.sub}</p>
        <a href={s.cta.href} className={cx('rs-btn', dark ? 'rs-btn--light' : 'rs-btn--primary')}>
          {s.cta.label}
        </a>
      </div>
    </aside>
  );
}

/* ---------------- Service promises (+ school logos once approved) ----------------
   Pass `logos` to show the "schools that trust Resha" row above the promises. */
export function TrustStrip({ logos = [] }: { logos?: { src: string; name: string }[] }) {
  return (
    <div className="rs-trust">
      {logos.length > 0 && (
        <>
          <header className="rs-section-head">
            <h2 className="rs-display-section">مدارس تثق بريشة</h2>
            <span className="rs-rule" aria-hidden="true" />
          </header>
          <div className="rs-trust__logos">
            {logos.map((l) => (
              <div className="rs-trust__logo" key={l.name}>
                <img src={l.src} alt={l.name} loading="lazy" />
              </div>
            ))}
          </div>
        </>
      )}
      <ul className="rs-promises">
        <li>
          <Icon name="pen" size="lg" />
          <b>تخصيص بالاسم والشعار</b>
          <span>كل قطعة تُنفَّذ بالاسم أو العبارة التي تختارها</span>
        </li>
        <li>
          <Icon name="eye" size="lg" />
          <b>مراجعة قبل التنفيذ</b>
          <span>نرسل لك التفاصيل لتأكيدها قبل البدء</span>
        </li>
        <li>
          <Icon name="school" size="lg" />
          <b>أسعار خاصة للمدارس</b>
          <span>باقات جاهزة وأسعار كميات واضحة</span>
        </li>
        <li>
          <Icon name="truck" size="lg" />
          <b>توصيل داخل {site.country}</b>
          <span>{site.serviceArea}</span>
        </li>
      </ul>
    </div>
  );
}

/* ---------------- About (short and personal) ---------------- */
export function AboutBlock() {
  return (
    <section className="rs-about" id="about" aria-labelledby="about-title">
      <div className="rs-about__media">
        <Photo src="/images/lifestyle/thanks-plaque.webp" alt="درع شكر وتقدير محفور بالاسم مع ميدالية ذهبية وصندوق هدية" sizes="(min-width: 1024px) 50vw, 100vw" />
      </div>
      <div className="rs-about__body">
        <p className="rs-eyebrow">عن ريشة</p>
        <h2 className="rs-about__title" id="about-title">
          نصنع الهدية التي تحمل <span className="rs-accent">اسمك</span>
        </h2>
        <p className="rs-body-lg">
          ريشة مشروع أردني صغير للأعمال الفنية والهدايا والتكريمات. نصمّم وننفّذ الدروع والميداليات والهدايا المخصّصة محلياً،
          ونوصلها لعملائنا في مختلف محافظات الأردن — ونتابع كل طلب معك بنفسنا عبر واتساب.
        </p>
        <ul className="rs-about__points">
          <li>
            <Icon name="pen" /> تخصيص كامل بالاسم والشعار والعبارة
          </li>
          <li>
            <Icon name="eye" /> نراجع التفاصيل معك قبل التنفيذ
          </li>
          <li>
            <Icon name="school" /> باقات وأسعار كميات للمدارس
          </li>
        </ul>
      </div>
    </section>
  );
}

/* ---------------- Final WhatsApp call to action (full-bleed band) ---------------- */
export function WhatsAppSection() {
  return (
    <section className="rs-waband" aria-labelledby="wa-title">
      <div className="rs-container rs-waband__inner">
        <p className="rs-cover__eyebrow">كيف تطلب؟</p>
        <h2 className="rs-waband__title" id="wa-title">
          جاهز تطلب؟ نحن على واتساب
        </h2>
        <ol className="rs-waband__steps">
          <li>اختر المنتج أو العرض</li>
          <li>اكتب الاسم والنص والكمية</li>
          <li>أرسل الطلب ونؤكده معك</li>
        </ol>
        <WhatsAppButton href={waGeneral()} label="ابدأ المحادثة على واتساب" size="lg" />
        <p className="rs-waband__meta">
          {site.whatsappHours} · لا دفع عبر الموقع · توصيل داخل الأردن
        </p>
      </div>
    </section>
  );
}
