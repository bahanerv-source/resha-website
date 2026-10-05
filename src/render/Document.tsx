import type { ReactNode } from 'react';
import { site } from '../config/site';
import { absUrl } from '../lib/catalog';
import { waGeneral } from '../lib/whatsapp';
import { Footer } from '../components/Footer';
import { Icon } from '../components/Icon';
import { Island } from '../components/Island';

export interface PageMeta {
  /** Page title without the brand; the brand is appended. Omit on the homepage. */
  title?: string;
  description: string;
  path: string;
  image?: string;
  /** Structured data objects (schema.org). */
  jsonLd?: object[];
  noindex?: boolean;
}

export interface Assets {
  css: string;
  js: string;
}

export function Document({
  meta,
  assets,
  active,
  fab = true,
  children,
}: {
  meta: PageMeta;
  assets: Assets;
  active?: string;
  fab?: boolean;
  children: ReactNode;
}) {
  const title = meta.title ? `${meta.title} | ${site.name}` : `${site.name} — ${site.tagline}`;
  const url = absUrl(meta.path);
  const image = absUrl(meta.image && !meta.image.endsWith('.svg') ? meta.image : '/images/brand/icon-512.png');
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <title>{title}</title>
        <meta name="description" content={meta.description} />
        <link rel="canonical" href={url} />
        {meta.noindex && <meta name="robots" content="noindex" />}
        <meta name="theme-color" content="#FFFFFF" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="ar_JO" />
        <meta property="og:site_name" content={site.name} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={image} />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" type="image/png" sizes="48x48" href="/images/brand/favicon-48.png" />
        <link rel="apple-touch-icon" href="/images/brand/apple-touch-icon.png" />
        <link rel="stylesheet" href={assets.css} />
        <script type="module" src={assets.js} async />
        {meta.jsonLd?.map((d, i) => (
          <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d).replace(/</g, '\\u003c') }} />
        ))}
      </head>
      <body className="rs">
        <Island name="SiteHeader" props={{ active }} />
        <main id="main">{children}</main>
        <Footer />
        {fab && (
          <a href={waGeneral()} className="rs-wa-fab" aria-label="تواصل معنا عبر واتساب" target="_blank" rel="noopener">
            <Icon name="whatsapp" />
          </a>
        )}
      </body>
    </html>
  );
}
