import type { Offer } from './types';

const PH = '/images/placeholders';

/**
 * Running offers. A product joins an offer with `offerId` in products.ts.
 * - bxgy  : "اشترِ X واحصل على Y مجاناً" — the product page adds the free pieces automatically.
 * - percent: a discount — give the product a `compareAt` (old price) and the new `price`.
 * - bundle : packages; the saving comes from each bundle's `compareAt`.
 *
 * endsAt: ONLY for real deadlines (ISO date with +03:00 for Jordan). The dates below are sample values —
 * change or remove them before launch.
 */
export const offers: Offer[] = [
  {
    id: 'buy1get1',
    type: 'bxgy',
    buy: 1,
    get: 1,
    figure: '1+1',
    caption: 'الثانية مجاناً',
    title: 'اشترِ قطعة واحصل على الثانية مجاناً',
    condition: 'على صناديق هدايا المعلمين والأقلام وعلّاقات المفاتيح المختارة، كل قطعة بالاسم الذي تريده.',
    image: `${PH}/gift-box.svg`,
    href: '/offers/#offer-buy1get1',
    endsAt: '2026-10-12T23:59:00+03:00',
  },
  {
    id: 'buy10get10',
    type: 'bxgy',
    buy: 10,
    get: 10,
    figure: '10+10',
    caption: '10 مجاناً',
    title: 'اشترِ 10 واحصل على 10 مجاناً',
    condition: 'على ميداليات التفوق المحفورة — مثالية لتكريم صف كامل.',
    image: `${PH}/medal-gold.svg`,
    href: '/offers/#offer-buy10get10',
    endsLabel: 'لفترة محدودة',
  },
  {
    id: 'buy100get100',
    type: 'bxgy',
    buy: 100,
    get: 100,
    figure: '100+100',
    caption: '100 مجاناً',
    title: 'اشترِ 100 واحصل على 100 مجاناً',
    condition: 'للمدارس ورياض الأطفال: الميداليات الخشبية وملصقات الأسماء وشهادات التقدير.',
    image: `${PH}/wooden-medal.svg`,
    href: '/offers/#offer-buy100get100',
    endsLabel: 'للطلبات المدرسية',
  },
  {
    id: 'teachers-25',
    type: 'percent',
    figure: '25%',
    caption: 'خصم يوم المعلم',
    title: 'خصم 25% على دروع الشكر للمعلمين',
    condition: 'على دروع الخشب والأكريليك المختارة بمناسبة يوم المعلم.',
    image: `${PH}/plaque-walnut.svg`,
    href: '/offers/#offer-teachers-25',
    endsAt: '2026-10-12T23:59:00+03:00',
    tone: 'offer',
  },
  {
    id: 'school-packages',
    type: 'bundle',
    figure: '25%',
    caption: 'توفير الباقات',
    title: 'باقات المدارس: وفّر حتى 25%',
    condition: 'باقات تكريم جاهزة بشعار المدرسة والأسماء، بسعر أقل من شراء كل قطعة وحدها.',
    image: `${PH}/school-bundle.svg`,
    href: '/category/school/#bundles',
    endsLabel: 'طوال العام الدراسي',
    tone: 'offer',
  },
  {
    id: 'graduation-20-5',
    type: 'bxgy',
    buy: 20,
    get: 5,
    figure: '20+5',
    caption: '5 أوشحة إضافية',
    title: 'اطلب 20 وشاحاً واحصل على 5 إضافية',
    condition: 'على أوشحة التخرّج المطرّزة بالاسم لحفلات المدارس ورياض الأطفال.',
    image: `${PH}/graduation-sash.svg`,
    href: '/offers/#offer-graduation-20-5',
    endsLabel: 'موسم التخرّج',
  },
];

export const getOffer = (id?: string) => (id ? offers.find((o) => o.id === id) : undefined);
