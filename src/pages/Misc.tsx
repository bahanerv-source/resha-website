import { site } from '../config/site';
import { categories } from '../data/categories';
import { categoryUrl } from '../lib/catalog';
import { waGeneral } from '../lib/whatsapp';
import { Crumbs } from '../components/banners';
import { Island } from '../components/Island';
import { Section, WhatsAppButton } from '../components/ui';

export function SearchPage() {
  return (
    <Section className="rs-section--tight">
      <Crumbs items={[{ label: 'الرئيسية', href: '/' }, { label: 'البحث' }]} />
      <h1 className="rs-h1 rs-pagetitle">البحث في منتجات ريشة</h1>
      <Island name="SearchResults" props={{}} />
    </Section>
  );
}

/** Placeholder policies — replace the bracketed text with your real terms before launch. */
export function PoliciesPage() {
  const blocks = [
    {
      id: 'delivery',
      title: 'التوصيل',
      body: `نوصل الطلبات داخل ${site.country} فقط. [اكتب هنا مناطق التوصيل وتكلفته والمدة المتوقعة لكل منطقة].`,
    },
    {
      id: 'orders',
      title: 'الطلب والتأكيد',
      body: 'يتم الطلب عبر واتساب. نراجع معك التفاصيل والتصميم والسعر النهائي قبل التنفيذ، ولا يتم أي دفع عبر الموقع. [اكتب هنا طرق الدفع المتاحة وموعد الدفع].',
    },
    {
      id: 'returns',
      title: 'الاستبدال والإرجاع',
      body: 'المنتجات المخصّصة بالاسم تُصنع خصيصاً لك. [اكتب هنا سياسة الاستبدال في حال وجود خطأ في التنفيذ أو تلف عند الاستلام].',
    },
    {
      id: 'privacy',
      title: 'الخصوصية',
      body: 'لا يجمع الموقع بياناتك ولا يخزّنها؛ المعلومات التي تكتبها في نموذج التخصيص تُرسل في رسالة واتساب التي تفتحها أنت. [أضف هنا أي تفاصيل أخرى عن استخدام البيانات].',
    },
  ];
  return (
    <Section className="rs-section--tight">
      <div className="rs-narrow rs-prose">
        <Crumbs items={[{ label: 'الرئيسية', href: '/' }, { label: 'السياسات' }]} />
        <h1 className="rs-h1 rs-pagetitle">التوصيل والاستبدال والخصوصية</h1>
        <p className="rs-note rs-note--warning">نص مؤقت — استبدل ما بين الأقواس بسياساتك الفعلية قبل الإطلاق.</p>
        {blocks.map((b) => (
          <section key={b.id} id={b.id} aria-labelledby={`p-${b.id}`}>
            <h2 className="rs-h3" id={`p-${b.id}`}>
              {b.title}
            </h2>
            <p className="rs-body">{b.body}</p>
          </section>
        ))}
        <WhatsAppButton href={waGeneral()} label="عندك سؤال؟ اسألنا على واتساب" />
      </div>
    </Section>
  );
}

export function NotFoundPage() {
  return (
    <Section className="rs-section--tight">
      <div className="rs-narrow rs-notfound">
        <p className="rs-eyebrow">الصفحة غير موجودة</p>
        <h1 className="rs-display-section">لم نجد هذه الصفحة</h1>
        <p className="rs-body rs-muted">ربما تغيّر الرابط أو انتهى العرض. تصفّح الأقسام أو تواصل معنا مباشرة.</p>
        <div className="rs-chips rs-chips--wrap">
          {categories.map((c) => (
            <a key={c.id} className="rs-chip" href={categoryUrl(c)}>
              {c.name}
            </a>
          ))}
        </div>
        <div className="rs-hero__actions">
          <a className="rs-btn rs-btn--primary" href="/">
            العودة للرئيسية
          </a>
          <WhatsAppButton href={waGeneral()} label="اسألنا على واتساب" />
        </div>
      </div>
    </Section>
  );
}
