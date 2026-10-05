/** Shapes of the catalogue data. The data itself lives in the sibling files. */

export type CategoryId =
  | 'plaques'
  | 'medals'
  | 'teacher-gifts'
  | 'graduation'
  | 'school'
  | 'custom'
  | 'keychains'
  | 'prints';

export interface Category {
  id: CategoryId;
  /** URL part: /category/<slug>/ */
  slug: string;
  /** Name used in navigation, cards and headings. */
  name: string;
  /** Short label for the round category rail on phones. */
  short: string;
  /** Square image for category cards (4:5 placeholders are cropped to 1:1). */
  image: string;
  /** Wide 16:7 image for the category page header. */
  banner: string;
  /** Optional designed banner (text drawn in) shown instead of `banner`; its button scrolls to the products. */
  artwork?: Artwork;
  /** Eyebrow + headline + one sentence for the category page header. */
  eyebrow: string;
  headline: string;
  intro: string;
  /** <title> and meta description. Write them for people, not keywords. */
  seoTitle: string;
  seoDescription: string;
  /** Optional offer (id from offers.ts) highlighted at the top of the category page. */
  offerId?: string;
  /** Optional in-between banner (id from banners.ts → strips) placed after the 2nd row of products. */
  stripId?: string;
  /** Show in the desktop navigation bar (the mobile drawer always lists every category). */
  inNav: boolean;
  /** Extra words people may search with ("ميدالية مفاتيح"). */
  keywords?: string[];
}

export type BadgeKey = 'offer' | 'limited' | 'school' | 'best' | 'new';

export interface PriceTier {
  /** From this quantity upwards… */
  min: number;
  /** …each piece costs this. */
  price: number;
}

/** The personalisation fields a product can ask for. Each product lists only the ones it needs. */
export type FieldKey =
  | 'occasion'
  | 'schoolName'
  | 'recipient'
  | 'from'
  | 'text'
  | 'year'
  | 'names'
  | 'logo'
  | 'photo';

export interface FieldConfig {
  key: FieldKey;
  /** Override the default label, e.g. "اسم المعلم / المعلمة" instead of "اسم المكرَّم". */
  label?: string;
  required?: boolean;
  placeholder?: string;
  help?: string;
  /** Characters allowed for `text`. */
  maxLength?: number;
}

export interface OptionChoice {
  label: string;
  /** CSS colour for a round swatch (finishes, ribbon colours). */
  swatch?: string;
  /** Extra cost per piece in JOD for this choice (0 or omitted = no change). */
  extra?: number;
}

export interface OptionGroup {
  id: string;
  label: string;
  choices: OptionChoice[];
}

export interface BundleItem {
  qty: number;
  label: string;
}

export interface Product {
  /** Also the URL part: /product/<slug>/ */
  slug: string;
  /** Real descriptive name: object first, then finish/feature. */
  name: string;
  category: CategoryId;
  /** Also list the product in these categories. */
  alsoIn?: CategoryId[];
  /** First image is the card photo. Add as many as you like for the product gallery. */
  images: string[];
  /** Current price per piece (or per bundle) in JOD. */
  price: number;
  /** Previous price — only when there is a real previous price. Shown struck through. */
  compareAt?: number;
  /** "للقطعة" (default), "للباقة", "للورقة"… */
  unit?: string;
  /** Show "يبدأ من" before the price when options change it. */
  priceFrom?: boolean;
  /** Quantity pricing for schools. The first tier should start at the minimum quantity. */
  tiers?: PriceTier[];
  minQty?: number;
  /** Quick quantity buttons on the product page. */
  presets?: number[];
  /** Offer id (offers.ts) this product belongs to. Drives the stamp, ribbon and free-quantity maths. */
  offerId?: string;
  /** Up to two are shown on cards, in the order offer → limited → school → best → new. */
  badges?: BadgeKey[];
  /** One short customisation fact for cards: "بالاسم والشعار", "حد أدنى 10 قطع". */
  note: string;
  /** 2–3 lines for the product page. */
  description: string;
  /** Short facts: size, material, production time. */
  details?: string[];
  /** Personalisation form for this product. */
  fields: FieldConfig[];
  options?: OptionGroup[];
  /** Occasions offered in the "المناسبة" select (defaults to the general list). */
  occasions?: string[];
  /** Bundles only: what is inside. */
  includes?: BundleItem[];
  kind?: 'product' | 'bundle';
  /** Extra search words. */
  keywords?: string[];
}

export type OfferType = 'bxgy' | 'percent' | 'bundle';

export interface Offer {
  id: string;
  type: OfferType;
  /** bxgy: buy this many… */
  buy?: number;
  /** …get this many free. */
  get?: number;
  /** The stamp figure, Western digits: "1+1", "10+10", "25%". */
  figure: string;
  /** Stamp caption, ≤ 4 words: "الثانية مجاناً". */
  caption: string;
  /** The rule in plain words — the headline of the offer. */
  title: string;
  /** Conditions, one sentence. */
  condition: string;
  image: string;
  /** Where "تسوّق العرض" goes. */
  href: string;
  /** ISO date-time. Only for real deadlines; leave empty for open-ended offers. */
  endsAt?: string;
  /** Short line under the offer when there is no date: "حتى نفاد الكمية". */
  endsLabel?: string;
  /** Stamp colour: burgundy (default) or crimson for percentage discounts. */
  tone?: 'burgundy' | 'offer';
}

export interface Cta {
  label: string;
  href: string;
}

export interface Campaign {
  id: string;
  /** Label of the campaign link at the start of the navigation. */
  navLabel: string;
  navHref: string;
  eyebrow: string;
  /** Headline. Wrap ONE word in [brackets] to set it in soft gold. */
  headline: string;
  sub: string;
  image: string;
  /** CSS object-position for the photo; keep products visible on phones. */
  imageFocus?: string;
  imageAlt: string;
  /** 'light' photo → dark text (default); 'dark' photo → light text. */
  tone?: 'light' | 'dark';
  primary: Cta;
  secondary?: Cta;
  /** Three short promises under the buttons. */
  promises: string[];
  /** Real deadline → a countdown appears in the hero. */
  endsAt?: string;
  /**
   * Optional finished banner design with the headline and button drawn into the picture.
   * When set, the homepage hero (and the offers page header) show it as-is instead of
   * placing text over `image`, and the whole banner links to `primary.href`.
   */
  artwork?: Artwork;
}

/** A designed banner (about 3:1, e.g. 2000×667) whose text is part of the picture. */
export interface Artwork {
  src: string;
  /** Which side holds the text — phones crop the banner toward it. */
  textSide: 'left' | 'right';
}

/** An extra designed banner in the homepage slider, shown after the current campaign. */
export interface HeroSlide {
  id: string;
  artwork: Artwork;
  /** What the banner says, for screen readers and search engines. */
  alt: string;
  href: string;
}

export interface Banner {
  id: string;
  tone: 'dark' | 'light';
  eyebrow: string;
  /** Wrap ONE word in [brackets] to accent it. */
  title: string;
  text: string;
  image: string;
  imageAlt?: string;
  /** Large price figure: "5" + "د.أ فقط". */
  figure?: string;
  figureUnit?: string;
  /** Or an offer stamp. */
  stamp?: { figure: string; caption: string };
  cta: Cta;
}

export interface Strip {
  id: string;
  tone: 'burgundy' | 'sand';
  stamp: { figure: string; caption: string; long?: boolean };
  title: string;
  sub: string;
  image: string;
  cta: Cta;
}
