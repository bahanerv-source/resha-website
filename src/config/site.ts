/**
 * ريشة — global site settings.
 * Everything a non-developer may need to change about the business lives here.
 * Change a value, run `npm run build` (or push to Vercel), and every page updates.
 */
export const site = {
  name: 'ريشة',
  fullName: 'ريشة للأعمال الفنية والهدايا والتكريمات',
  tagline: 'هدايا وتكريمات مخصّصة بالاسم والشعار',
  description:
    'ريشة متجر أردني للهدايا والتكريمات المخصّصة: دروع تكريم، ميداليات، هدايا معلمين، هدايا تخرّج ومنتجات مدرسية بالاسم والشعار، مع عروض خاصة للمدارس. الطلب عبر واتساب والتوصيل داخل الأردن.',

  /** The production address, used for canonical links, sitemap and social previews. */
  url: 'https://example.com', // >>> replace with the real domain before launch <<<

  /**
   * WhatsApp number in international format, digits only, no "+" or leading zeros.
   * Jordanian mobile 07X XXX XXXX → 9627XXXXXXXX.
   * >>> Replace with the real number. Every WhatsApp button on the site reads this one value. <<<
   */
  whatsappNumber: '962700000000',

  /** Shown next to WhatsApp buttons. Keep it true to your real availability. */
  whatsappHours: 'نرد على رسائلكم خلال ساعات العمل', // e.g. 'نرد يومياً من 9 صباحاً حتى 9 مساءً'

  /** Social links (placeholders until the real accounts are added). */
  social: {
    instagram: 'https://www.instagram.com/', // >>> replace with the real profile URL <<<
    instagramHandle: 'ريشة على إنستغرام', // e.g. '@risha.gifts'
    facebook: 'https://www.facebook.com/', // >>> replace with the real page URL <<<
  },

  /** Where you serve. */
  country: 'الأردن',
  serviceArea: 'نخدم عملاءنا في جميع محافظات الأردن',

  /** Currency label shown after every price. */
  currency: 'د.أ',
  currencyCode: 'JOD',

  /** Thin bar at the very top of every page. Set `enabled: false` to hide it. */
  announcement: {
    enabled: true,
    text: 'توصيل لجميع محافظات المملكة',
    highlight: 'عروض يوم المعلم',
    linkLabel: 'تسوّق الآن',
    href: '/offers/',
  },

  /** The id of the campaign (in src/data/campaigns.ts) that drives the homepage hero and the header link. */
  currentCampaign: 'teachers-day',
} as const;

export type Site = typeof site;
