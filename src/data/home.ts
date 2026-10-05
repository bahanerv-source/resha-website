/**
 * The homepage, top to bottom. Reorder, remove or add sections here — the page follows this list.
 * Products are referenced by slug (products.ts), offers by id (offers.ts), banners/strips by id (campaigns.ts).
 * The hero always shows the campaign selected in src/config/site.ts → currentCampaign.
 */
export type HomeSection =
  /** The current campaign; `slides` adds designed banners (ids from campaigns.ts → heroSlides) after it. */
  | { type: 'hero'; slides?: string[] }
  | { type: 'offers'; title: string; sub?: string; offers: string[] }
  | { type: 'categories'; title: string; sub?: string }
  | {
      type: 'products';
      id: string;
      title: string;
      sub?: string;
      products: string[];
      /** Badge forced on every card of this row (e.g. 'school' on the schools row). */
      rowBadge?: 'school' | 'new';
      /** 'grid' (default) or 'rail' (one swipeable row). */
      layout?: 'grid' | 'rail';
      /** In-between banner placed after the first row of the grid. */
      strip?: string;
      /** "View all" button shown under the products. */
      viewAll?: { label: string; href: string };
      tone?: 'cream' | 'ivory';
    }
  | { type: 'banner'; banner: string }
  | { type: 'bundles'; title: string; sub?: string; bundles: string[] }
  | { type: 'trust' }
  | { type: 'about' }
  | { type: 'whatsapp' };

export const home: HomeSection[] = [
  { type: 'hero', slides: ['collection'] },
  {
    type: 'offers',
    title: 'العروض الحالية',
    sub: 'عروض مختارة على الهدايا والتكريمات — اختر العرض وخصّص طلبك.',
    offers: ['buy1get1', 'teachers-25', 'buy10get10', 'buy100get100', 'school-packages', 'graduation-20-5'],
  },
  { type: 'categories', title: 'تسوّق حسب القسم', sub: 'من درع التكريم إلى علّاقة المفاتيح — كل قطعة بالاسم الذي تريده.' },
  {
    type: 'products',
    id: 'teachers',
    title: 'هدايا تقول شكراً',
    sub: 'اختيارات هذا الأسبوع لكل معلم ومعلمة — بالاسم وعبارة الشكر.',
    products: ['teacher-gift-box', 'teacher-thanks-plaque', 'engraved-pen-box', 'acrylic-plaque-wood-base', 'thank-you-mug', 'thank-you-frame', 'desk-nameplate-acrylic', 'teacher-stamp'],
    strip: 'strip-teachers',
    viewAll: { label: 'كل هدايا المعلمين', href: '/category/teacher-gifts/' },
  },
  { type: 'banner', banner: 'banner-medals' },
  {
    type: 'products',
    id: 'schools',
    title: 'الأكثر طلباً من المدارس',
    sub: 'القطع التي تعود إليها إدارات المدارس في كل حفل تكريم.',
    products: ['wooden-plaque-gold', 'excellence-medal-gold', 'wooden-medal-engraved', 'appreciation-certificate'],
    viewAll: { label: 'منتجات المدارس', href: '/category/school/' },
  },
  {
    type: 'bundles',
    title: 'باقات المدارس',
    sub: 'باقات جاهزة بشعار المدرسة والأسماء، بسعر أقل من شراء كل قطعة وحدها.',
    bundles: ['school-honor-bundle', 'teachers-day-bundle', 'kindergarten-graduation-bundle'],
  },
  { type: 'banner', banner: 'banner-graduation' },
  {
    type: 'products',
    id: 'new',
    title: 'جديد في ريشة',
    sub: 'قطع جديدة صمّمناها لهذا الموسم.',
    products: ['calligraphy-led-lamp', 'flame-excellence-award', 'acrylic-plaque-wood-base', 'desk-nameplate-acrylic', 'thank-you-mug', 'kindergarten-graduation-medal', 'graduate-plaque', 'student-name-labels'],
    rowBadge: 'new',
    layout: 'rail',
  },
  { type: 'trust' },
  { type: 'about' },
  { type: 'whatsapp' },
];
