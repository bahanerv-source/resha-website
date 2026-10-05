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
};

document.querySelectorAll<HTMLElement>('[data-island]').forEach(async (el) => {
  const name = el.dataset.island!;
  const mod = await loaders[name]?.();
  const Comp = mod?.[name] as ((p: object) => React.ReactNode) | undefined;
  if (!Comp) return;
  hydrateRoot(el, <Comp {...JSON.parse(el.dataset.props || '{}')} />);
});

/* Sliders (components/ui.tsx → Scroller): arrow buttons on desktop, native swipe everywhere. */
document.querySelectorAll<HTMLElement>('[data-scroller]').forEach((el) => {
  const track = el.querySelector<HTMLElement>('.rs-scroller__track');
  const buttons = el.querySelectorAll<HTMLButtonElement>('.rs-scroller__btn');
  if (!track) return;
  const update = () => {
    const max = track.scrollWidth - track.clientWidth;
    // RTL: scrollLeft runs from 0 down to -max.
    const pos = Math.abs(track.scrollLeft);
    buttons.forEach((b) => {
      b.hidden = max < 4;
      b.disabled = b.dataset.dir === '1' ? pos >= max - 4 : pos <= 4;
    });
  };
  // "Next" (dir 1) moves toward the left in RTL.
  buttons.forEach((b) => b.addEventListener('click', () => track.scrollBy({ left: -Number(b.dataset.dir) * track.clientWidth * 0.9, behavior: 'smooth' })));
  track.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
});
