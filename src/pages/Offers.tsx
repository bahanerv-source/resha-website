import { site } from '../config/site';
import { getCampaign } from '../data/campaigns';
import { offers } from '../data/offers';
import { productsInOffer } from '../lib/catalog';
import { dayMonth } from '../lib/format';
import { artFocus, PageHero, WhatsAppSection } from '../components/banners';
import { BundleCard, OfferTile, ProductCard } from '../components/cards';
import { Island } from '../components/Island';
import { Section, SectionHeader } from '../components/ui';

/** /offers/ — every running offer, each followed by the products it applies to. */
export function OffersPage() {
  const c = getCampaign(site.currentCampaign);
  return (
    <>
      <PageHero
          eyebrow={c.eyebrow}
          title="العروض [الحالية]"
          intro="كل العروض في مكان واحد: اختر العرض، خصّص القطعة بالاسم، وأرسل طلبك عبر واتساب."
          image={c.artwork?.src ?? c.image}
          imageAlt={c.imageAlt}
          focus={c.artwork ? artFocus(c.artwork) : undefined}
          href={c.artwork ? '#h-all' : undefined}
          crumbs={[{ label: 'الرئيسية', href: '/' }, { label: 'العروض' }]}
        >
          {c.endsAt && <Island name="Countdown" props={{ endsAt: c.endsAt, label: 'عروض المناسبة تنتهي خلال' }} />}
      </PageHero>

      <Section labelledBy="h-all">
        <SectionHeader title="اختر العرض" id="h-all" sub="كل عرض يُطبَّق تلقائياً على صفحة المنتج — تظهر لك القطع المجانية والمجموع قبل الإرسال." />
        <div className="rs-otiles">
          {offers.map((o) => (
            <OfferTile o={{ ...o, href: `#offer-${o.id}` }} key={o.id} />
          ))}
        </div>
      </Section>

      {offers.map((o, i) => {
        const ps = productsInOffer(o.id);
        if (!ps.length) return null;
        const bundles = ps.filter((p) => p.kind === 'bundle');
        const items = ps.filter((p) => p.kind !== 'bundle');
        return (
          <Section key={o.id} id={`offer-${o.id}`} labelledBy={`h-${o.id}`}>
            <header className="rs-offerhead">
              <p className="rs-offerhead__fig" aria-hidden="true">
                {o.figure}
              </p>
              <h2 className="rs-display-section" id={`h-${o.id}`}>
                {o.title}
              </h2>
              <p className="rs-section-head__sub">
                {o.condition} {o.endsAt ? `ينتهي في ${dayMonth(o.endsAt)}.` : o.endsLabel ? `${o.endsLabel}.` : ''}
              </p>
              <span className="rs-rule" aria-hidden="true" />
            </header>
            {items.length > 0 && (
              <div className="rs-grid">
                {items.map((p) => (
                  <ProductCard p={p} key={p.slug} />
                ))}
              </div>
            )}
            {bundles.length > 0 && (
              <div className="rs-packs">
                {bundles.map((b) => (
                  <BundleCard p={b} key={b.slug} />
                ))}
              </div>
            )}
          </Section>
        );
      })}

      <WhatsAppSection />
    </>
  );
}
