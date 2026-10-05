import { useEffect, useMemo, useRef, useState } from 'react';
import { site } from '../config/site';
import type { FieldConfig } from '../data/types';
import { absUrl, cardBadges, DEFAULT_OCCASIONS, getProduct, productCategory, productOffer, productUrl, resolveField } from '../lib/catalog';
import { cx, dayMonth, num, price } from '../lib/format';
import { activeTier, effectivePiece, freeQty, tierLabel, unitPrice } from '../lib/pricing';
import { orderMessage, waLink } from '../lib/whatsapp';
import { Icon } from '../components/Icon';
import { Badge, Price } from '../components/ui';

type FileInfo = { name: string; size: number; url?: string };

/**
 * The product page's order column: price, offer, personalisation form, quantity,
 * live estimated total and the pre-filled WhatsApp order.
 */
export function ProductCustomizer({ slug }: { slug: string }) {
  const p = getProduct(slug)!;
  const offer = productOffer(p);
  const cat = productCategory(p);
  const fields = p.fields.map(resolveField);
  const min = p.minQty ?? 1;
  const bxgy = offer?.type === 'bxgy' ? offer : undefined;

  const [qty, setQty] = useState(p.presets?.[0] && p.presets[0] >= min ? p.presets[0] : min);
  const [vals, setVals] = useState<Record<string, string>>({ occasion: '' });
  const [opts, setOpts] = useState<Record<string, number>>(() => Object.fromEntries((p.options ?? []).map((o) => [o.id, 0])));
  const [files, setFiles] = useState<Record<string, FileInfo | undefined>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [ctaVisible, setCtaVisible] = useState(true);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const extra = (p.options ?? []).reduce((s, o) => s + (o.choices[opts[o.id]]?.extra ?? 0), 0);
  const unit = unitPrice(p, qty, extra);
  const total = unit * qty;
  const free = freeQty(offer, qty);
  const tierIdx = activeTier(p, qty);
  const unitLabel = p.unit ?? 'للقطعة';
  const pieceWord = p.kind === 'bundle' ? 'باقة' : 'قطعة';

  // Show the mobile sticky bar only while the main WhatsApp button is off-screen.
  useEffect(() => {
    if (!ctaRef.current || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setCtaVisible(e.isIntersecting), { rootMargin: '0px 0px -40px 0px' });
    io.observe(ctaRef.current);
    return () => io.disconnect();
  }, []);

  const set = (k: string, v: string) => {
    setVals((s) => ({ ...s, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: '' }));
  };
  const setQ = (n: number) => setQty(Math.max(min, Math.min(9999, Math.round(n) || min)));

  const message = useMemo(() => {
    const lines: { label: string; value?: string | number }[] = [];
    lines.push({
      label: 'الكمية',
      value: free ? `${qty} + ${free} مجاناً (تستلم ${qty + free} ${pieceWord})` : `${qty} ${p.kind === 'bundle' ? 'باقة' : ''}`.trim(),
    });
    if (offer) lines.push({ label: 'العرض', value: offer.title });
    for (const o of p.options ?? []) lines.push({ label: o.label, value: o.choices[opts[o.id]]?.label });
    for (const f of fields) {
      if (f.key === 'logo' || f.key === 'photo') {
        const fi = files[f.key];
        if (fi) lines.push({ label: f.label, value: `سأرسله في المحادثة (${fi.name})` });
      } else if (f.key === 'names' && vals.names?.trim()) {
        lines.push({ label: f.label, value: '\n' + vals.names.trim() });
      } else lines.push({ label: f.label, value: vals[f.key] });
    }
    lines.push({ label: 'ملاحظات', value: vals.notes });
    lines.push({ label: `السعر ${unitLabel}`, value: price(unit) });
    lines.push({ label: 'المجموع التقديري', value: price(total) });
    return orderMessage(p.name, absUrl(productUrl(p)), lines);
  }, [qty, vals, opts, files]);

  const href = waLink(message);

  const validate = (e: React.MouseEvent) => {
    const errs: Record<string, string> = {};
    for (const f of fields) {
      if (!f.required) continue;
      const ok = f.key === 'logo' || f.key === 'photo' ? !!files[f.key] : !!vals[f.key]?.trim();
      if (!ok) errs[f.key] = f.key === 'photo' || f.key === 'logo' ? 'اختر الملف أولاً' : `أدخل ${f.label}`;
    }
    if (Object.keys(errs).length) {
      e.preventDefault();
      setErrors(errs);
      const first = fields.find((f) => errs[f.key]);
      const el = formRef.current?.querySelector<HTMLElement>(`[data-field="${first?.key}"]`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el?.querySelector<HTMLElement>('input,textarea,select')?.focus({ preventScroll: true });
    }
  };

  const onFile = (key: string, list: FileList | null) => {
    const f = list?.[0];
    if (!f) return;
    setFiles((s) => ({ ...s, [key]: { name: f.name, size: f.size, url: f.type.startsWith('image/') ? URL.createObjectURL(f) : undefined } }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: '' }));
  };

  const renderField = (f: FieldConfig & { label: string }) => {
    const id = `f-${f.key}`;
    const err = errors[f.key];
    const label = (
      <>
        {f.label} {f.required ? <span className="rs-field__req" aria-hidden="true">*</span> : <span className="rs-field__opt">(اختياري)</span>}
      </>
    );
    const errNode = err ? (
      <p className="rs-field__error" id={`${id}-err`}>
        <Icon name="alert" size="sm" /> {err}
      </p>
    ) : null;
    const common = {
      id,
      'aria-invalid': err ? true : undefined,
      'aria-describedby': err ? `${id}-err` : f.help ? `${id}-help` : undefined,
      required: f.required,
    };

    if (f.key === 'occasion') {
      const list = p.occasions ?? DEFAULT_OCCASIONS;
      return (
        <div className="rs-field" data-field={f.key} key={f.key}>
          <label className="rs-field__label" htmlFor={id}>
            {label}
          </label>
          <select className="rs-select" {...common} value={vals.occasion ?? ''} onChange={(e) => set('occasion', e.target.value)}>
            <option value="">اختر المناسبة</option>
            {list.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          {errNode}
        </div>
      );
    }
    if (f.key === 'logo' || f.key === 'photo') {
      const fi = files[f.key];
      return (
        <div className="rs-field" data-field={f.key} key={f.key}>
          <span className="rs-field__label" id={`${id}-label`}>
            {label}
          </span>
          {fi ? (
            <div className="rs-file">
              <span className="rs-file__thumb">{fi.url ? <img src={fi.url} alt="" /> : <Icon name="image" />}</span>
              <span className="rs-file__meta">
                <span className="rs-file__name">{fi.name}</span>
                <span className="rs-file__ok">
                  <Icon name="check" size="sm" /> جاهز · {Math.max(1, Math.round(fi.size / 1024))} ك.ب
                </span>
              </span>
              <button type="button" className="rs-iconbtn" aria-label="حذف الملف" onClick={() => setFiles((s) => ({ ...s, [f.key]: undefined }))}>
                <Icon name="trash" />
              </button>
            </div>
          ) : (
            <label className="rs-upload rs-upload--row" aria-labelledby={`${id}-label`}>
              <input type="file" accept="image/*,.pdf" {...common} onChange={(e) => onFile(f.key, e.target.files)} />
              <span className="rs-upload__icon">
                <Icon name="upload" />
              </span>
              <span>
                <span className="rs-upload__title">{f.key === 'logo' ? 'ارفع الشعار' : 'اختر الصورة'}</span>
                <span className="rs-upload__hint">PNG أو JPG أو PDF</span>
              </span>
            </label>
          )}
          <p className="rs-field__help" id={`${id}-help`}>
            واتساب لا يستقبل الملفات عبر الرابط — بعد فتح المحادثة أرفق الملف فيها مباشرة.
          </p>
          {errNode}
        </div>
      );
    }
    const long = f.key === 'text' || f.key === 'names';
    const max = f.key === 'text' ? f.maxLength : undefined;
    return (
      <div className="rs-field" data-field={f.key} key={f.key}>
        <label className="rs-field__label" htmlFor={id}>
          {label}
        </label>
        {long ? (
          <textarea
            className="rs-textarea"
            {...common}
            maxLength={max}
            rows={f.key === 'names' ? 4 : 3}
            placeholder={f.placeholder}
            value={vals[f.key] ?? ''}
            onChange={(e) => set(f.key, e.target.value)}
            style={{ minHeight: f.key === 'names' ? 120 : 96 }}
          />
        ) : (
          <input
            className={cx('rs-input', f.key === 'year' && 'rs-input--num')}
            {...common}
            inputMode={f.key === 'year' ? 'numeric' : undefined}
            placeholder={f.placeholder}
            value={vals[f.key] ?? ''}
            onChange={(e) => set(f.key, e.target.value)}
          />
        )}
        {(f.help || max) && (
          <p className="rs-field__help" id={`${id}-help`}>
            <span>{f.help ?? (f.key === 'text' ? 'نكتب النص كما تكتبه تماماً.' : '')}</span>
            {max && (
              <span className="rs-field__count">
                {(vals[f.key] ?? '').length} / {max}
              </span>
            )}
          </p>
        )}
        {errNode}
      </div>
    );
  };

  const badges = cardBadges(p);
  const piece = effectivePiece(p, offer);

  return (
    <div className="rs-pdp">
      <div className="rs-pdp__head">
        {badges.length > 0 && (
          <div className="rs-pdp__badges">
            {badges.map((b) => (
              <Badge key={b} kind={b} />
            ))}
          </div>
        )}
        <h1 className="rs-h1">{p.name}</h1>
        <Price now={p.price} was={p.compareAt} unit={unitLabel} from={!!p.tiers} large />
      </div>

      {offer && (
        <div className="rs-offer">
          <div className="rs-offer__icon">
            <Icon name={offer.type === 'bxgy' ? 'gift' : offer.type === 'percent' ? 'percent' : 'package'} />
          </div>
          <p className="rs-offer__title">{offer.title}</p>
          <p className="rs-offer__meta">
            <Icon name="clock" size="sm" />
            {offer.endsAt ? `ينتهي في ${dayMonth(offer.endsAt)}` : offer.endsLabel ?? 'لفترة محدودة'}
            {piece !== undefined && ` · أي ${num(piece)} ${site.currency} للقطعة`}
          </p>
        </div>
      )}

      {p.tiers && (
        <div>
          <p className="rs-label rs-tiers__title">سعر القطعة حسب الكمية</p>
          <div className="rs-tiers" style={{ ['--tiers' as string]: p.tiers.length }}>
            {p.tiers.map((t, i) => (
              <div className={cx('rs-tier', i === tierIdx && 'is-active')} key={t.min}>
                <span className="rs-tier__qty">{tierLabel(p, i)}</span>
                <span className="rs-tier__price">{price(t.price)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="rs-body rs-muted" style={{ margin: 0 }}>
        {p.description}
      </p>

      {p.includes && (
        <div className="rs-includes">
          <p className="rs-label">محتوى الباقة</p>
          <ul className="rs-bundle__list">
            {p.includes.map((i) => (
              <li key={i.label}>
                <span className="rs-bundle__qty">{i.qty}</span> {i.label}
              </li>
            ))}
          </ul>
        </div>
      )}

      {p.details && (
        <ul className="rs-details">
          {p.details.map((d) => (
            <li key={d}>
              <Icon name="check" size="sm" /> {d}
            </li>
          ))}
        </ul>
      )}

      <hr className="rs-pdp__divider" />

      <div ref={formRef} className="rs-form" id="customize">
        <h2 className="rs-h3 rs-step-title">
          <b>1</b> خصّص طلبك
        </h2>
        {(p.options ?? []).map((o) => (
          <fieldset className="rs-fieldset" key={o.id}>
            <legend className="rs-field__label">{o.label}</legend>
            <div className="rs-choices">
              {o.choices.map((c, k) => (
                <label className={cx('rs-choice', opts[o.id] === k && 'is-checked')} key={c.label}>
                  <input type="radio" name={o.id} checked={opts[o.id] === k} onChange={() => setOpts((s) => ({ ...s, [o.id]: k }))} />
                  {c.swatch ? <span className="rs-choice__swatch" style={{ background: c.swatch }} /> : <span className="rs-choice__dot" />}
                  {c.label}
                  {c.extra ? <span className="rs-choice__extra">+{price(c.extra)}</span> : null}
                </label>
              ))}
            </div>
          </fieldset>
        ))}
        {fields.map(renderField)}

        <h2 className="rs-h3 rs-step-title">
          <b>2</b> الكمية
        </h2>
        <div className="rs-field">
          <div className="rs-qtyrow">
            <div className="rs-qty">
              <button type="button" className="rs-qty__btn" aria-label="إنقاص" onClick={() => setQ(qty - 1)} disabled={qty <= min}>
                <Icon name="minus" />
              </button>
              <input
                className="rs-qty__val"
                type="number"
                inputMode="numeric"
                min={min}
                value={qty}
                aria-label="الكمية"
                onChange={(e) => setQty(Number(e.target.value) || 0)}
                onBlur={(e) => setQ(Number(e.target.value))}
              />
              <button type="button" className="rs-qty__btn" aria-label="زيادة" onClick={() => setQ(qty + 1)}>
                <Icon name="plus" />
              </button>
            </div>
            {p.presets && (
              <div className="rs-presets" aria-label="كميات سريعة">
                {p.presets.filter((n) => n >= min).map((n) => (
                  <button type="button" key={n} className={cx('rs-preset', qty === n && 'is-active')} onClick={() => setQ(n)} aria-pressed={qty === n}>
                    {n}
                  </button>
                ))}
              </div>
            )}
          </div>
          {min > 1 && <p className="rs-field__help">الحد الأدنى للطلب {min} {p.unit === 'للشهادة' ? 'شهادة' : 'قطعة'}.</p>}
          {bxgy && (
            <p className={cx('rs-freebie', free > 0 && 'is-on')} aria-live="polite">
              <Icon name="gift" size="sm" />
              {free > 0 ? (
                <span>
                  مع العرض تستلم <b>{qty + free}</b> {pieceWord} — منها <b>{free}</b> مجاناً
                </span>
              ) : (
                <span>
                  أضف {bxgy.buy! - (qty % bxgy.buy!)} لتحصل على {bxgy.get} مجاناً
                </span>
              )}
            </p>
          )}
        </div>
        <div className="rs-field" data-field="notes">
          <label className="rs-field__label" htmlFor="f-notes">
            ملاحظات إضافية <span className="rs-field__opt">(اختياري)</span>
          </label>
          <input className="rs-input" id="f-notes" placeholder="موعد الحفل، لون مفضّل، أي تفاصيل تساعدنا…" value={vals.notes ?? ''} onChange={(e) => set('notes', e.target.value)} />
        </div>

        <h2 className="rs-h3 rs-step-title">
          <b>3</b> أرسل الطلب
        </h2>
        <dl className="rs-summary">
          <div className="rs-summary__row">
            <dt>المنتج</dt>
            <dd>{p.name}</dd>
          </div>
          <div className="rs-summary__row">
            <dt>الكمية × السعر</dt>
            <dd>
              {qty} × {price(unit)}
            </dd>
          </div>
          {free > 0 && (
            <div className="rs-summary__row rs-summary__row--free">
              <dt>مجاناً مع العرض</dt>
              <dd>+{free} {pieceWord}</dd>
            </div>
          )}
          <div className="rs-summary__row rs-summary__total">
            <dt>المجموع التقديري</dt>
            <dd>{price(total)}</dd>
          </div>
        </dl>
        <a ref={ctaRef} href={href} onClick={validate} className="rs-btn rs-btn--whatsapp rs-btn--lg rs-btn--block" target="_blank" rel="noopener">
          <Icon name="whatsapp" /> أرسل الطلب عبر واتساب
        </a>
        <p className="rs-caption" style={{ textAlign: 'center' }}>
          نؤكد التفاصيل والسعر النهائي معك في المحادثة. لا دفع عبر الموقع.
        </p>
        <div className="rs-pdp__perks">
          <span className="rs-pdp__perk">
            <Icon name="eye" /> نراجع التصميم معك قبل التنفيذ
          </span>
          <span className="rs-pdp__perk">
            <Icon name="truck" /> توصيل داخل الأردن
          </span>
          <span className="rs-pdp__perk">
            <Icon name="pen" /> تخصيص {cat.name === 'مطبوعات' ? 'بالاسم والشعار' : 'بالاسم والعبارة'}
          </span>
        </div>
      </div>

      <div className={cx('rs-orderbar rs-orderbar--fixed rs-orderbar--mobile-only', ctaVisible && 'is-hidden')} aria-hidden={ctaVisible}>
        <div className="rs-orderbar__price">
          <span className="rs-orderbar__label">المجموع التقديري{free > 0 ? ` · +${free} مجاناً` : ''}</span>
          <span className="rs-price__now">
            {num(total)} <span className="rs-price__cur">{site.currency}</span>
          </span>
        </div>
        <a href={href} onClick={validate} className="rs-btn rs-btn--whatsapp" target="_blank" rel="noopener" tabIndex={ctaVisible ? -1 : undefined}>
          <Icon name="whatsapp" /> اطلب عبر واتساب
        </a>
      </div>
    </div>
  );
}
