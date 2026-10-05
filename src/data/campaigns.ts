import type { Banner, Campaign, HeroSlide, Strip } from './types';

const PH = '/images/placeholders';

/**
 * Seasonal campaigns. The homepage hero shows the one named in `site.currentCampaign` (src/config/site.ts).
 * Prepare the next occasion here in advance, then switch `currentCampaign` on the day.
 */
export const campaigns: Campaign[] = [
  {
    id: 'teachers-day',
    navLabel: 'عروض يوم المعلم',
    navHref: '/offers/',
    eyebrow: 'يوم المعلم · 5 تشرين الأول',
    headline: 'شكراً لمن [علّمنا]',
    sub: 'دروع وهدايا مخصّصة بالاسم لكل معلم ومعلمة، مع عروض خاصة للمدارس طوال أسبوع المعلم.',
    image: `${PH}/hero-teachers.svg`,
    imageFocus: '16% 50%',
    artwork: { src: '/images/banners/teachers-day.webp', textSide: 'right' },
    imageAlt: 'درع خشبي وميدالية ذهبية وصندوق هدية على طاولة خشبية',
    tone: 'light',
    primary: { label: 'تسوّق عروض المعلم', href: '/offers/' },
    secondary: { label: 'باقات المدارس', href: '/category/school/#bundles' },
    promises: ['تخصيص بالاسم والشعار', 'الطلب عبر واتساب', 'توصيل داخل الأردن'],
    endsAt: '2026-10-12T23:59:00+03:00', // sample deadline — change before launch
  },
  {
    id: 'graduation',
    navLabel: 'عروض التخرّج',
    navHref: '/category/graduation/',
    eyebrow: 'موسم التخرّج',
    headline: 'لحظة تستحق [التخليد]',
    sub: 'أوشحة ودروع وميداليات بالاسم والسنة لكل خرّيج، مع عروض الكميات لحفلات المدارس.',
    image: `${PH}/campaign-graduation-wide.svg`,
    imageFocus: '25% 50%',
    imageAlt: 'وشاح تخرّج عنابي ودرع وقبعة تخرّج على خلفية داكنة',
    tone: 'dark',
    primary: { label: 'تسوّق هدايا التخرّج', href: '/category/graduation/' },
    secondary: { label: 'باقات التخرّج', href: '/category/school/#bundles' },
    promises: ['بالاسم والسنة', 'أسعار كميات للمدارس', 'الطلب عبر واتساب'],
  },
  {
    id: 'back-to-school',
    navLabel: 'العودة للمدارس',
    navHref: '/category/school/',
    eyebrow: 'العودة للمدارس',
    headline: 'بداية عام [مميّزة]',
    sub: 'ملصقات أسماء ودفاتر بغلاف مخصّص وأختام للمعلمين — كل ما يحتاجه الصف من اليوم الأول.',
    image: `${PH}/campaign-schools-wide.svg`,
    imageFocus: '25% 50%',
    imageAlt: 'درع وميداليات ولوحة أكريليك على رف خشبي',
    primary: { label: 'تسوّق منتجات المدارس', href: '/category/school/' },
    secondary: { label: 'المطبوعات', href: '/category/prints/' },
    promises: ['بشعار المدرسة', 'أسعار كميات واضحة', 'توصيل داخل الأردن'],
  },
];

/**
 * Extra designed banners for the homepage slider (after the current campaign's banner).
 * Pick which ones show, and their order, in src/data/home.ts → hero → slides.
 */
export const heroSlides: HeroSlide[] = [
  {
    id: 'collection',
    artwork: { src: '/images/banners/collection.webp', textSide: 'left' },
    alt: 'تشكيلة مميزة من منتجات ريشة: دروع، هدايا مخصصة، ميداليات ومفاتيح بتصاميم أنيقة ولمسات خاصة لكل مناسبة',
    href: '/#categories',
  },
];

/** Large campaign banners placed between homepage sections. */
export const banners: Banner[] = [
  {
    id: 'banner-medals',
    tone: 'light',
    eyebrow: 'تكريم المتفوقين',
    title: 'صف كامل [بسعر] نصف صف',
    text: 'اشترِ 10 ميداليات تفوق محفورة بالاسم واحصل على 10 مثلها مجاناً — لكل طالب ميداليته.',
    image: `${PH}/banner-medals-wide.svg`,
    imageAlt: 'ثلاث ميداليات ذهبية وفضية وبرونزية معلّقة',
    stamp: { figure: '10+10', caption: '10 مجاناً' },
    cta: { label: 'اختر الميداليات', href: '/product/excellence-medal-gold/' },
  },
  {
    id: 'banner-graduation',
    tone: 'dark',
    eyebrow: 'موسم التخرّج',
    title: 'هدية تقول [مبروك] بالاسم',
    text: 'أوشحة مطرّزة ودروع الخرّيج وعلّاقات بالسنة — جهّز حفل التخرّج من مكان واحد.',
    image: `${PH}/campaign-graduation-wide.svg`,
    imageAlt: 'وشاح ودرع وقبعة تخرّج',
    figure: '6',
    figureUnit: 'د.أ للوشاح',
    cta: { label: 'تسوّق التخرّج', href: '/category/graduation/' },
  },
  {
    id: 'banner-custom',
    tone: 'dark',
    eyebrow: 'هدايا مخصّصة',
    title: 'هدية تحمل [اسمك]',
    text: 'لوحات أكريليك بالصورة، صناديق خشبية محفورة وهدايا لكل مناسبة — نصمّمها لك كما تريد.',
    image: `${PH}/campaign-gifts-wide.svg`,
    imageAlt: 'صناديق هدايا مغلّفة بشرائط عنابية وذهبية',
    stamp: { figure: '1+1', caption: 'الثانية هدية' },
    cta: { label: 'تسوّق الهدايا', href: '/category/custom/' },
  },
];

/** Slim in-between banners placed inside product grids. */
export const strips: Strip[] = [
  {
    id: 'strip-teachers',
    tone: 'burgundy',
    stamp: { figure: '1+1', caption: 'الثانية مجاناً' },
    title: 'هديتان لمعلمَين بسعر هدية واحدة',
    sub: 'على صناديق هدايا المعلمين والأقلام المحفورة — كل قطعة باسم مختلف.',
    image: `${PH}/gift-box.svg`,
    cta: { label: 'اختر العرض', href: '/offers/#offer-buy1get1' },
  },
  {
    id: 'strip-100',
    tone: 'sand',
    stamp: { figure: '100+100', caption: '100 مجاناً', long: true },
    title: 'للمدارس: اشترِ 100 واحصل على 100',
    sub: 'ميداليات خشبية وملصقات أسماء وشهادات تقدير لكل طلاب المدرسة.',
    image: `${PH}/wooden-medal.svg`,
    cta: { label: 'تسوّق العرض', href: '/offers/#offer-buy100get100' },
  },
  {
    id: 'strip-graduation',
    tone: 'burgundy',
    stamp: { figure: '20+5', caption: 'أوشحة إضافية' },
    title: 'اطلب 20 وشاحاً واحصل على 5 إضافية',
    sub: 'أوشحة تخرّج مطرّزة بالاسم والسنة لحفلات المدارس ورياض الأطفال.',
    image: `${PH}/graduation-sash.svg`,
    cta: { label: 'اختر العرض', href: '/product/graduation-sash-embroidered/' },
  },
  {
    id: 'strip-schools-quote',
    tone: 'sand',
    stamp: { figure: '30', caption: 'قطعة فأكثر' },
    title: 'طلب للمدرسة كاملة؟',
    sub: 'كلما زادت الكمية انخفض سعر القطعة — أرسل لنا العدد ونرسل لك السعر النهائي.',
    image: `${PH}/plaque-walnut.svg`,
    cta: { label: 'تسوّق باقات المدارس', href: '/category/school/#bundles' },
  },
];

export const getCampaign = (id: string) => campaigns.find((c) => c.id === id) ?? campaigns[0];
export const getBanner = (id: string) => banners.find((b) => b.id === id);
export const getStrip = (id?: string) => (id ? strips.find((s) => s.id === id) : undefined);
export const getHeroSlide = (id: string) => heroSlides.find((s) => s.id === id);
