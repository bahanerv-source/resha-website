import { useRef, useState } from 'react';
import type { BadgeKey } from '../data/types';
import { cx } from '../lib/format';
import { Badge, Photo } from '../components/ui';

/** Large product photography with thumbnails; swipe on phones. */
export function ProductGallery({ images, name, badges }: { images: string[]; name: string; badges: BadgeKey[] }) {
  const [i, setI] = useState(0);
  const touch = useRef<number | null>(null);
  const n = images.length;
  const go = (d: number) => setI((x) => (x + d + n) % n);

  return (
    <div className="rs-gallery" aria-roledescription="معرض صور" aria-label={`صور ${name}`}>
      <div
        className="rs-gallery__main"
        onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touch.current === null) return;
          const dx = e.changedTouches[0].clientX - touch.current;
          // RTL: swiping left moves forward
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
          touch.current = null;
        }}
      >
        <div className="rs-media">
          {badges.length > 0 && (
            <div className="rs-badges">
              {badges.map((b) => (
                <Badge key={b} kind={b} />
              ))}
            </div>
          )}
          <Photo src={images[i]} alt={`${name} — صورة ${i + 1} من ${n}`} priority={i === 0} sizes="(min-width: 1024px) 50vw, 100vw" />
        </div>
        {n > 1 && (
          <span className="rs-gallery__count" aria-hidden="true">
            {i + 1} / {n}
          </span>
        )}
      </div>
      {n > 1 && (
        <div className="rs-gallery__thumbs" style={{ gridTemplateColumns: `repeat(${Math.max(n, 4)}, minmax(0, 1fr))` }}>
          {images.map((src, k) => (
            <button
              type="button"
              key={src + k}
              className={cx('rs-gallery__thumb', k === i && 'is-active')}
              aria-label={`عرض الصورة ${k + 1}`}
              aria-pressed={k === i}
              onClick={() => setI(k)}
            >
              <Photo src={src} alt="" sizes="120px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
