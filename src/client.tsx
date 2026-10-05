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

/* Sliders (components/ui.tsx → Scroller): arrow buttons on desktop, native swipe everywhere,
   plus dots and autoplay where the slider asks for them (the homepage hero). */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.querySelectorAll<HTMLElement>('[data-scroller]').forEach((el) => {
  const track = el.querySelector<HTMLElement>('.rs-scroller__track');
  const items = el.querySelectorAll<HTMLElement>('.rs-scroller__item');
  const buttons = el.querySelectorAll<HTMLButtonElement>('.rs-scroller__btn');
  const dots = el.querySelectorAll<HTMLButtonElement>('.rs-scroller__dot');
  if (!track || !items.length) return;
  // RTL: scrollLeft runs from 0 down to -max.
  const pos = () => Math.abs(track.scrollLeft);
  const current = () => Math.round(pos() / items[0].offsetWidth);
  const goTo = (i: number) => track.scrollTo({ left: -i * items[0].offsetWidth, behavior: reduceMotion ? 'auto' : 'smooth' });
  const update = () => {
    const max = track.scrollWidth - track.clientWidth;
    buttons.forEach((b) => {
      b.hidden = max < 4;
      b.disabled = b.dataset.dir === '1' ? pos() >= max - 4 : pos() <= 4;
    });
    const i = current();
    dots.forEach((d, k) => d.classList.toggle('is-active', k === i));
  };
  // "Next" (dir 1) moves toward the left in RTL.
  buttons.forEach((b) => b.addEventListener('click', () => track.scrollBy({ left: -Number(b.dataset.dir) * track.clientWidth * 0.9, behavior: 'smooth' })));
  dots.forEach((d) => d.addEventListener('click', () => goTo(Number(d.dataset.index))));
  track.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();

  if (el.hasAttribute('data-autoplay') && items.length > 1 && !reduceMotion) {
    let paused = false;
    const pause = () => (paused = true);
    const resume = () => (paused = false);
    el.addEventListener('pointerenter', pause);
    el.addEventListener('pointerleave', resume);
    el.addEventListener('focusin', pause);
    el.addEventListener('focusout', resume);
    window.setInterval(() => {
      if (!paused && !document.hidden) goTo((current() + 1) % items.length);
    }, 6000);
  }
});
