import { site } from '../config/site';
import { getBanner, getCampaign, getStrip } from '../data/campaigns';
import { categories } from '../data/categories';
import { home } from '../data/home';
import { getOffer } from '../data/offers';
import { productsBySlugs } from '../lib/catalog';
import { cx } from '../lib/format';
import { AboutBlock, CampaignBanner, CountdownBand, Hero, InlineStrip, TrustStrip, WhatsAppSection } from '../components/banners';
import { BundleCard, CategoryCard, OfferTile, ProductCard } from '../components/cards';
import { Scroller, Section, SectionHeader, ViewAll } from '../components/ui';

/** Builds the homepage from src/data/home.ts. */
export function HomePage() {
  // White is the page; ivory only for the category and package bands (plus the trust strip).
  const nextTone = (): 'cream' | 'ivory' => 'cream';

  return (
    <>
      {home.map((s, idx) => {
        switch (s.type) {
          case 'hero': {
            const c = getCampaign(site.currentCampaign);
            return (
              <div key={idx}>
                <Hero c={c} />
                {c.endsAt && <CountdownBand title={`${c.navLabel} تنتهي خلال`} endsAt={c.endsAt} />}
              </div>
            );
          }

          case 'offers': {
            const list = s.offers.map((id) => getOffer(id)!).filter(Boolean);
            return (
              <Section key={idx} tone={nextTone()} labelledBy="h-offers">
                <SectionHeader title={s.title} sub={s.sub} id="h-offers" />
                <Scroller label={s.title} className="rs-scroller--offers">
                  {list.map((o) => (
                    <OfferTile o={o} key={o.id} />
                  ))}
                </Scroller>
              </Section>
            );
          }

          case 'categories':
            return (
              <Section key={idx} labelledBy="h-cats">
                <SectionHeader title={s.title} sub={s.sub} id="h-cats" />
                <div className="rs-ctiles">
                  {categories.map((c) => (
                    <CategoryCard c={c} key={c.id} />
                  ))}
                </div>
              </Section>
            );

          case 'products': {
            const ps = productsBySlugs(s.products);
            const strip = getStrip(s.strip);
            const t = s.tone ?? nextTone();
            const hid = `h-${s.id}`;
            return (
              <Section key={idx} tone={t} labelledBy={hid}>
                <SectionHeader title={s.title} sub={s.sub} id={hid} />
                {s.layout === 'rail' ? (
                  <Scroller label={s.title} className="rs-scroller--products">
                    {ps.map((p) => (
                      <ProductCard p={p} force={s.rowBadge} key={p.slug} />
                    ))}
                  </Scroller>
                ) : (
                  <div className="rs-grid">
                    {ps.map((p, i) => (
                      <div className="rs-grid__item" style={{ order: i * 2 }} key={p.slug}>
                        <ProductCard p={p} force={s.rowBadge} />
                      </div>
                    ))}
                    {strip && (
                      <div className="rs-grid__full">
                        <InlineStrip s={strip} />
                      </div>
                    )}
                  </div>
                )}
                {s.viewAll && <ViewAll {...s.viewAll} />}
              </Section>
            );
          }

          case 'banner': {
            const b = getBanner(s.banner);
            if (!b) return null;
            return (
              <div className="rs-container rs-bannerband" key={idx}>
                <CampaignBanner b={b} />
              </div>
            );
          }

          case 'bundles': {
            const bs = productsBySlugs(s.bundles);
            return (
              <Section key={idx} labelledBy="h-bundles" id="bundles">
                <SectionHeader title={s.title} sub={s.sub} id="h-bundles" />
                <div className="rs-packs">
                  {bs.map((b) => (
                    <BundleCard p={b} key={b.slug} />
                  ))}
                </div>
              </Section>
            );
          }

          case 'trust':
            return (
              <section className="rs-section rs-section--tight" key={idx}>
                <div className="rs-container">
                  <TrustStrip />
                </div>
              </section>
            );

          case 'about':
            return (
              <Section key={idx} tone={nextTone()}>
                <AboutBlock />
              </Section>
            );

          case 'whatsapp':
            return (
              <WhatsAppSection key={idx} />
            );
        }
      })}
    </>
  );
}
