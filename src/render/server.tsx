import { renderToString } from 'react-dom/server';
import type { ReactNode } from 'react';
import { site } from '../config/site';
import { categories } from '../data/categories';
import { products } from '../data/products';
import { absUrl, categoryUrl, productCategory, productsInCategory, productUrl, searchIndex } from '../lib/catalog';
import { CategoryPage } from '../pages/Category';
import { HomePage } from '../pages/Home';
import { NotFoundPage, PoliciesPage, SearchPage } from '../pages/Misc';
import { OffersPage } from '../pages/Offers';
import { ProductPage } from '../pages/Product';
import { Document, type Assets, type PageMeta } from './Document';

export interface OutFile {
  path: string;
  body: string;
}

const crumbsLd = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: absUrl(it.path) })),
});

/** Renders every page of the site to static HTML, plus sitemap, robots and the search index. */
export function renderSite(assets: Assets): OutFile[] {
  const out: OutFile[] = [];
  const page = (path: string, meta: Omit<PageMeta, 'path'>, body: ReactNode, opts: { active?: string; fab?: boolean } = {}) => {
    const html = renderToString(
      <Document meta={{ ...meta, path }} assets={assets} active={opts.active} fab={opts.fab}>
        {body}
      </Document>,
    );
    out.push({ path: path === '/404/' ? '/404.html' : `${path}index.html`, body: '<!doctype html>' + html });
  };

  page(
    '/',
    {
      description: site.description,
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'Store',
          name: site.fullName,
          alternateName: site.name,
          url: absUrl('/'),
          logo: absUrl('/images/brand/icon-512.png'),
          description: site.description,
          areaServed: { '@type': 'Country', name: 'Jordan' },
          sameAs: [site.social.instagram, site.social.facebook],
        },
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: site.name,
          url: absUrl('/'),
          inLanguage: 'ar',
          potentialAction: { '@type': 'SearchAction', target: absUrl('/search/?q={q}'), 'query-input': 'required name=q' },
        },
      ],
    },
    <HomePage />,
    { active: 'home' },
  );

  for (const c of categories) {
    page(
      categoryUrl(c),
      {
        title: c.seoTitle,
        description: c.seoDescription,
        image: c.image,
        jsonLd: [
          crumbsLd([
            { name: 'الرئيسية', path: '/' },
            { name: c.name, path: categoryUrl(c) },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: c.name,
            itemListElement: productsInCategory(c.id).map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: absUrl(productUrl(p)), name: p.name })),
          },
        ],
      },
      <CategoryPage c={c} />,
      { active: c.id },
    );
  }

  for (const p of products) {
    const c = productCategory(p);
    page(
      productUrl(p),
      {
        title: `${p.name} — ${c.name}`,
        description: `${p.description} السعر ${p.price} د.أ. الطلب عبر واتساب والتوصيل داخل الأردن.`.slice(0, 300),
        image: p.images[0],
        jsonLd: [
          crumbsLd([
            { name: 'الرئيسية', path: '/' },
            { name: c.name, path: categoryUrl(c) },
            { name: p.name, path: productUrl(p) },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: p.name,
            description: p.description,
            image: p.images.map((i) => absUrl(i)),
            category: c.name,
            brand: { '@type': 'Brand', name: site.name },
            offers: {
              '@type': 'Offer',
              price: p.price,
              priceCurrency: site.currencyCode,
              url: absUrl(productUrl(p)),
              eligibleRegion: { '@type': 'Country', name: 'Jordan' },
            },
          },
        ],
      },
      <ProductPage p={p} />,
      { active: p.category, fab: false },
    );
  }

  page(
    '/offers/',
    {
      title: 'العروض الحالية على الهدايا والتكريمات',
      description: 'عروض ريشة الحالية: اشترِ قطعة واحصل على الثانية مجاناً، اشترِ 10 واحصل على 10، باقات المدارس وعروض التخرّج — هدايا وتكريمات مخصّصة في الأردن.',
    },
    <OffersPage />,
    { active: 'offers' },
  );
  page('/search/', { title: 'البحث', description: 'ابحث في منتجات ريشة: دروع، ميداليات، هدايا معلمين وتخرّج.', noindex: true }, <SearchPage />);
  page('/policies/', { title: 'التوصيل والاستبدال والخصوصية', description: 'سياسات التوصيل والطلب والاستبدال والخصوصية في ريشة.' }, <PoliciesPage />);
  page('/404/', { title: 'الصفحة غير موجودة', description: 'الصفحة غير موجودة.', noindex: true }, <NotFoundPage />);

  const urls = out.filter((f) => f.path.endsWith('index.html') && !f.path.startsWith('/search/')).map((f) => absUrl(f.path.replace(/index\.html$/, '')));
  out.push({
    path: '/sitemap.xml',
    body:
      '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
      urls.map((u) => `  <url><loc>${u}</loc></url>`).join('\n') +
      '\n</urlset>\n',
  });
  out.push({ path: '/robots.txt', body: `User-agent: *\nAllow: /\n\nSitemap: ${absUrl('/sitemap.xml')}\n` });
  out.push({ path: '/search-index.json', body: JSON.stringify(searchIndex()) });
  return out;
}
