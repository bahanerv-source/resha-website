import { useRef } from 'react';
import type { BadgeKey } from '../data/types';
import { productsBySlugs } from '../lib/catalog';
import { ProductCard } from '../components/cards';
import { Icon } from '../components/Icon';

/** One swipeable row of products; arrow buttons on desktop. */
export function ProductRail({ slugs, force, label }: { slugs: string[]; force?: BadgeKey; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const items = productsBySlugs(slugs);
  // In RTL, "next" scrolls toward the left (negative scrollLeft).
  const move = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: -dir * el.clientWidth * 0.9, behavior: 'smooth' });
  };
  return (
    <div className="rs-railwrap">
      <div className="rs-rail" ref={ref} role="list" aria-label={label}>
        {items.map((p) => (
          <div role="listitem" key={p.slug}>
            <ProductCard p={p} force={force} />
          </div>
        ))}
      </div>
      {items.length > 4 && (
        <div className="rs-railwrap__arrows">
          <button type="button" className="rs-arrow" aria-label="السابق" onClick={() => move(-1)}>
            <Icon name="chevBack" />
          </button>
          <button type="button" className="rs-arrow" aria-label="التالي" onClick={() => move(1)}>
            <Icon name="chevFwd" />
          </button>
        </div>
      )}
    </div>
  );
}
