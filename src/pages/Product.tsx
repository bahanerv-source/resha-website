import type { Product } from '../data/types';
import { categoryUrl, productCategory, related } from '../lib/catalog';
import { Crumbs } from '../components/banners';
import { ProductCard } from '../components/cards';
import { Island } from '../components/Island';
import { Section, SectionHeader, ViewAll } from '../components/ui';

export function ProductPage({ p }: { p: Product }) {
  const c = productCategory(p);
  return (
    <>
      <div className="rs-container rs-pdp-page">
        <Crumbs items={[{ label: 'الرئيسية', href: '/' }, { label: c.name, href: categoryUrl(c) }, { label: p.name }]} />
        <div className="rs-pdp-grid">
          <div className="rs-pdp-grid__media">
            <Island name="ProductGallery" props={{ images: p.images, name: p.name, badges: [] }} />
          </div>
          <div className="rs-pdp-grid__info">
            <Island name="ProductCustomizer" props={{ slug: p.slug }} />
          </div>
        </div>
      </div>
      <Section labelledBy="h-related">
        <SectionHeader title="قد يعجبك أيضاً" id="h-related" />
        <div className="rs-grid">
          {related(p, 4).map((r) => (
            <ProductCard p={r} key={r.slug} />
          ))}
        </div>
        <ViewAll label={`كل ${c.name}`} href={categoryUrl(c)} />
      </Section>
    </>
  );
}
