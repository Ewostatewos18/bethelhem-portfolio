export const CONTACT_EMAIL = "bethelhemabrham385@gmail.com";
export const CONTACT_PHONE = "+251 902 098 702";
export const CONTACT_PHONE_HREF = "tel:+251902098702";

/**
 * Full portrait (about section). Cutout used in the hero.
 * Profile photo: public/images/profile.png; cutout: profile-cut.png.
 */
export const PROFILE_PHOTO = "/images/profile.png";
export const PROFILE_CUT = "/images/profile-cut.png";

export const categories = [
  { id: "all", label: "All" },
  { id: "logo", label: "Logo" },
  { id: "branding", label: "Branding" },
  { id: "social", label: "Social Media" },
] as const;

export type Category = (typeof categories)[number]["id"];

export type Study = {
  id: string;
  cat: Exclude<Category, "all">;
  index: string;
  label: string;
  title: string;
  summary: string;
  lede: string;
  format: string;
  deliverables: string;
  note: string;
  /**
   * Finished artwork. Set to a file in /public, for example "/work/logo/abri.webp".
   * When this is set, the sample preview is not drawn.
   */
  artwork?: string;
  /** Extra slides (carousel / multi-page sets). First slide is also artwork. */
  gallery?: string[];
};

export const studies: Study[] = [
  {
    id: "abri",
    cat: "logo",
    index: "01",
    label: "Logo",
    title: "ABRI Technologies",
    summary: "Logo for a digital solutions company — lime mark, white wordmark, clear tagline.",
    lede: "I designed an angular lime “A” mark with a bold wordmark for decks, screens, and signage.",
    format: "Logo design",
    deliverables: "Primary mark, wordmark, tagline lockup",
    note: "Tagline: Digital Solutions. Built for Real Business.",
    artwork: "/work/logo/abri.webp",
  },
  {
    id: "finot-logo",
    cat: "logo",
    index: "02",
    label: "Logo",
    title: "Finot Technologies",
    summary: "Logo and wordmark with a silver-and-orange “way ahead” motif.",
    lede: "I built a circular path mark in silver and orange, with the same orange stroke running through the N in FINOT.",
    format: "Logo design",
    deliverables: "Symbol, wordmark, tagline lockup",
    note: "Tagline: The Way Ahead.",
    artwork: "/work/logo/finot.webp",
  },
  {
    id: "grace-logo",
    cat: "logo",
    index: "03",
    label: "Logo",
    title: "Grace Fabric Bags",
    summary: "Logo for a fabric bag brand — a G shaped like a shopping bag.",
    lede: "I shaped the G like a shopping bag so the mark and the product stay connected.",
    format: "Logo design",
    deliverables: "Primary mark, wordmark",
    note: "Logo for Grace Fabric Bags.",
    artwork: "/work/logo/grace.webp",
  },
  {
    id: "finot-brand",
    cat: "branding",
    index: "04",
    label: "Branding",
    title: "Finot brand board",
    summary: "Brand board with logo, colors, and mockups for apparel, cards, and signage.",
    lede: "I carried navy, white, and orange across stationery, tees, badges, mugs, and outdoor signs.",
    format: "Brand identity board",
    deliverables: "Logo system, color palette, application mockups",
    note: "Brand presentation for Finot Technologies.",
    artwork: "/work/branding/finot.webp",
  },
  {
    id: "grace-brand",
    cat: "branding",
    index: "05",
    label: "Branding",
    title: "Grace Fabric Bags branding",
    summary: "Brand kit with logo variants, fonts, colors, and product mockups.",
    lede: "I built an orange and deep purple system for tote bags, tags, shirts, and shopping bags — with type and color specs.",
    format: "Brand identity board",
    deliverables: "Logo variants, fonts, palette, mockups",
    note: "Branding for Grace Fabric Bags.",
    artwork: "/work/branding/grace.webp",
  },
  {
    id: "kesil",
    cat: "social",
    index: "06",
    label: "Social Media",
    title: "BELLA product poster",
    summary: "Product poster for BELLA natural green powder — Hawassa, Ethiopia.",
    lede: "I designed a vertical social poster with Amharic headline, product shot, and contact for local delivery.",
    format: "Social media poster",
    deliverables: "Poster / feed graphic",
    note: "Product visual for BELLA.",
    artwork: "/work/poster/kesil.webp",
  },
  {
    id: "negere",
    cat: "social",
    index: "07",
    label: "Social Media",
    title: "Negere Krstos — Part 1",
    summary: "Teaching announcement for AASTU Gibi Gubae on Christology.",
    lede: "I made this event graphic with speaker photo, date, discussion prompts, and Telegram live details.",
    format: "Event / social post",
    deliverables: "Square social poster",
    note: "Designed for @aastugibigubae.",
    artwork: "/work/poster/negere-krstos.webp",
  },
  {
    id: "gibi",
    cat: "social",
    index: "08",
    label: "Social Media",
    title: "Gibi Gubae countdown",
    summary: "“4 days left” countdown for the መዓዛ ቅዱሳን program.",
    lede: "I designed this Instagram countdown with a day grid, church logo, and social handles.",
    format: "Instagram post",
    deliverables: "Feed graphic",
    note: "Countdown for the መስከረም 2018 ዓ.ም series.",
    artwork: "/work/social/gibi-countdown.webp",
  },
  {
    id: "carousel",
    cat: "social",
    index: "09",
    label: "Social Media",
    title: "Business carousel",
    summary: "Six-slide Instagram set on what happens if a business owner disappears for 30 days.",
    lede: "I designed six frames — hook, empty desk, order chaos, and follow-through — around one clear question.",
    format: "Instagram carousel",
    deliverables: "6 slides",
    note: "Theme: “A question every business should answer.”",
    artwork: "/work/social/carousel-01.webp",
    gallery: [
      "/work/social/carousel-01.webp",
      "/work/social/carousel-02.webp",
      "/work/social/carousel-03.webp",
      "/work/social/carousel-04.webp",
      "/work/social/carousel-05.webp",
      "/work/social/carousel-06.webp",
    ],
  },
  {
    id: "magazine",
    cat: "social",
    index: "10",
    label: "Social Media",
    title: "ተስፋ ነቢያት magazine",
    summary: "Two-page Ge’ez magazine spread for a church publication.",
    lede: "I laid out these pages with scripture text, gold framing, and portrait photography for print or share.",
    format: "Magazine spread",
    deliverables: "2 pages",
    note: "Title: ተስፋ ነቢያት — መድሃኔ ዓለም.",
    artwork: "/work/social/magazine-01.webp",
    gallery: ["/work/social/magazine-01.webp", "/work/social/magazine-02.webp"],
  },
];

export const services = [
  {
    index: "01",
    title: "Branding",
    text: "Identity systems that stay consistent",
    detail: "Colors, type, and applications so your brand feels the same everywhere.",
    icon: "brand" as const,
  },
  {
    index: "02",
    title: "Poster Designs",
    text: "Print and event visuals that hold from a distance",
    detail: "Clear hierarchy for events, products, and announcements.",
    icon: "poster" as const,
  },
  {
    index: "03",
    title: "Logo Design",
    text: "Marks you can redraw from memory",
    detail: "Simple, memorable logos for packs, screens, and signage.",
    icon: "logo" as const,
  },
  {
    index: "04",
    title: "Social Media Graphics",
    text: "Posts and carousels ready for the feed",
    detail: "Feed posts, carousels, and stories sized for Instagram and more.",
    icon: "social" as const,
  },
];

export const nav = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#contact", label: "Contact" },
];
