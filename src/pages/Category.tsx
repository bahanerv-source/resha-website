import type { Category } from '../data/types';
import { categories } from '../data/categories';
import { getOffer } from '../data/offers';
import { categoryUrl, productsInCategory } from '../lib/catalog';
import { dayMonth } from '../lib/format';
import { waAbout } from '../lib/whatsapp';
import { PageHero } from '../components/banners';
import { BundleCard } from '../components/cards';
import { Icon } from '../components/Icon';
import { Island } from '../components/Island';
import { Section, SectionHeader, WhatsAppButton } from '../components/ui';

export function CategoryPage({ c }: { c: Category }) {
  const offer = getOffer(c.offerId);
  const bundles = productsInCategory(c.id).filter((p) => p.kind === 'bundle');
  const others = categories.filter((x) => x.id !== c.id);

  return (
    <>
      <PageHero
          eyebrow={c.eyebrow}
          title={c.headline}
          intro={c.intro}
          image={c.banner}
          crumbs={[{ label: 'الرئيسية', href: '/' }, { label: c.name }]}
        />

      {offer && (
        <aside className="rs-offerline" aria-label="العرض الحالي">
          <div className="rs-container rs-offerline__inner">
            <span className="rs-offerline__fig" aria-hidden="true">
              {offer.figure}
            </span>
            <span className="rs-offerline__text">
              <span className="rs-offerline__title">{offer.title}</span>
              <span className="rs-offerline__meta">{offer.endsAt ? `ينتهي في ${dayMonth(offer.endsAt)}` : offer.endsLabel ?? 'لفترة محدودة'}</span>
            </span>
            <a href={offer.href} className="rs-btn rs-btn--text">
              تسوّق العرض <Icon name="arrowFwd" size="sm" />
            </a>
          </div>
        </aside>
      )}

      {bundles.length > 0 && (
        <Section id="bundles" labelledBy="h-bundles">
          <SectionHeader title="باقات جاهزة" sub="بشعار المدرسة والأسماء، بسعر أقل من شراء كل قطعة وحدها." id="h-bundles" />
          <div className="rs-packs">
            {bundles.map((b) => (
              <BundleCard p={b} key={b.slug} />
            ))}
          </div>
        </Section>
      )}

      <Section labelledBy="h-products" className="rs-section--tight">
        <h2 className="rs-visually-hidden" id="h-products">
          منتجات {c.name}
        </h2>
        <Island name="CategoryBrowser" props={{ categoryId: c.id }} />
      </Section>

      <Section className="rs-section--tight">
        <div className="rs-custom-cta">
          <div>
            <h2 className="rs-h2">لم تجد ما تبحث عنه؟</h2>
            <p className="rs-body rs-muted">نصمّم حسب الطلب — أرسل لنا الفكرة والكمية ونقترح عليك الأنسب.</p>
          </div>
          <WhatsAppButton href={waAbout(`طلب خاص في قسم ${c.name}`)} label="اسألنا على واتساب" />
        </div>
        <nav className="rs-morecats" aria-label="أقسام أخرى">
          <p className="rs-label">تصفّح أقساماً أخرى</p>
          <div className="rs-chips rs-chips--wrap">
            {others.map((x) => (
              <a key={x.id} className="rs-chip" href={categoryUrl(x)}>
                {x.name}
              </a>
            ))}
          </div>
        </nav>
      </Section>
    </>
  );
}
