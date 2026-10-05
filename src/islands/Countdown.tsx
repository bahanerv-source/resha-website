import { useEffect, useState } from 'react';
import { cx } from '../lib/format';

const pad = (n: number) => String(Math.max(0, n)).padStart(2, '0');

/** Time left on a real, dated offer. Renders nothing once the date has passed. */
export function Countdown({ endsAt, variant, label }: { endsAt: string; variant?: 'light' | 'inline'; label?: string }) {
  const end = new Date(endsAt).getTime();
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const left = now === null ? null : end - now;
  if (left !== null && left <= 0) return null;
  const s = left === null ? null : Math.floor(left / 1000);
  const units: [string, number | null][] = [
    ['يوم', s === null ? null : Math.floor(s / 86400)],
    ['ساعة', s === null ? null : Math.floor((s % 86400) / 3600)],
    ['دقيقة', s === null ? null : Math.floor((s % 3600) / 60)],
  ];
  if (variant !== 'inline') units.push(['ثانية', s === null ? null : s % 60]);
  return (
    <div className="rs-countdown-wrap">
      {label && <p className="rs-countdown-label">{label}</p>}
      <div className={cx('rs-countdown', variant && `rs-countdown--${variant}`)} role="timer" aria-live="off">
        {units.map(([l, v]) => (
          <div className="rs-countdown__unit" key={l}>
            <span className="rs-countdown__num">{v === null ? '--' : pad(v)}</span>
            <span className="rs-countdown__lbl">{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
