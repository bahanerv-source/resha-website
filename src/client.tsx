import { hydrateRoot } from 'react-dom/client';

/* Hydrates each server-rendered island. The rest of the page is static HTML.
   Each island's code is loaded only on pages that use it. */
const loaders: Record<string, () => Promise<Record<string, unknown>>> = {
  SiteHeader: () => import('./islands/SiteHeader'),
  Countdown: () => import('./islands/Countdown'),
  ProductGallery: () => import('./islands/ProductGallery'),
  ProductCustomizer: () => import('./islands/ProductCustomizer'),
  CategoryBrowser: () => import('./islands/CategoryBrowser'),
  SearchResults: () => import('./islands/SearchResults'),
  ProductRail: () => import('./islands/ProductRail'),
};

document.querySelectorAll<HTMLElement>('[data-island]').forEach(async (el) => {
  const name = el.dataset.island!;
  const mod = await loaders[name]?.();
  const Comp = mod?.[name] as ((p: object) => React.ReactNode) | undefined;
  if (!Comp) return;
  hydrateRoot(el, <Comp {...JSON.parse(el.dataset.props || '{}')} />);
});
