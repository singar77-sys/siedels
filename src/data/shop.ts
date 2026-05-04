const LOCATION = 'LFC0T5CC7MY0S';
const sq = (id: string) => `https://book.squareup.com/appointments/${id}/location/${LOCATION}/services`;

export const SQUARE_BOOKING_URL = sq('2mimwacjkgqdyj');
export const PHONE = '(330) 952-0777';
export const PHONE_HREF = 'tel:+13309520777';
export const ADDRESS = '982 N Court Street';
export const CITY_STATE_ZIP = 'Medina, Ohio 44256';
export const MAPS_URL = 'https://maps.google.com/?q=982+N+Court+Street+Medina+OH+44256';
export const GOOGLE_BUSINESS_URL = 'https://share.google/n7DB5686mE05Db6tK';
export const EMAIL = 'siedelsbarbershop@gmail.com';
export const EMAIL_HREF = `mailto:${EMAIL}`;
export const FACEBOOK_URL = 'https://www.facebook.com/siedelsbarbershop';
export const INSTAGRAM_URL = 'https://www.instagram.com/siedelsbarber';

// Canonical social-proof + staff-count constants — used in metadata, JSON-LD, and UI.
// Update here, not inline.
export const TEAM_COUNT = 11;
/** Word form of TEAM_COUNT — used in prose where "11 barbers" reads worse
 *  than "Eleven barbers". Keep in sync with TEAM_COUNT by hand (small
 *  numbers change rarely). */
export const TEAM_COUNT_WORD = 'Eleven';
export const RATING = '4.9';
export const REVIEW_COUNT = '249';

// Alt-text strings for images reused across multiple components. Keeps
// alts consistent when the same file appears in several places.
export const IMAGE_ALTS = {
  storefront:
    "Siedel's Barbershop storefront at 982 N Court Street, Medina Ohio",
  heroGoldenHour:
    "Barber pole at golden hour outside Siedel's Barbershop, Medina Ohio",
  heroGrayscale: "Barber pole at Siedel's Barbershop, Medina Ohio",

  // Badge logos — circle (01) and diamond (02) shapes, dark/light palette variants.
  // "dark" = vivid red badge background; "light" = charcoal badge background.
  // Team variants match each sport-mode palette (day = light, night = dark).
  logos: {
    // Siedel's brand
    darkCircle:   "Siedel's Barbershop logo — red circle badge with crossed scissors and straight razor, Stay Sharp",
    darkDiamond:  "Siedel's Barbershop logo — red diamond badge with crossed scissors and straight razor, Stay Sharp",
    lightCircle:  "Siedel's Barbershop logo — dark circle badge with red crossed scissors and straight razor, Stay Sharp",
    lightDiamond: "Siedel's Barbershop logo — dark diamond badge with red crossed scissors and straight razor, Stay Sharp",
    // Cleveland Browns edition
    brownsDarkCircle:   "Siedel's Barbershop Cleveland Browns edition logo — dark brown circle badge with orange scissors",
    brownsDarkDiamond:  "Siedel's Barbershop Cleveland Browns edition logo — dark brown diamond badge with orange scissors",
    brownsLightCircle:  "Siedel's Barbershop Cleveland Browns edition logo — brown circle badge with orange scissors",
    brownsLightDiamond: "Siedel's Barbershop Cleveland Browns edition logo — brown diamond badge with orange scissors",
    // Cleveland Cavaliers edition
    cavsDarkCircle:   "Siedel's Barbershop Cleveland Cavaliers edition logo — navy circle badge with gold scissors",
    cavsDarkDiamond:  "Siedel's Barbershop Cleveland Cavaliers edition logo — navy diamond badge with gold scissors",
    cavsLightCircle:  "Siedel's Barbershop Cleveland Cavaliers edition logo — wine circle badge with gold scissors",
    cavsLightDiamond: "Siedel's Barbershop Cleveland Cavaliers edition logo — wine diamond badge with gold scissors",
    // Price-era Cavaliers (retro) edition
    priceDarkCircle:   "Siedel's Barbershop retro Cavaliers edition logo — navy circle badge with orange scissors, 1989 throwback",
    priceDarkDiamond:  "Siedel's Barbershop retro Cavaliers edition logo — navy diamond badge with orange scissors, 1989 throwback",
    priceLightCircle:  "Siedel's Barbershop retro Cavaliers edition logo — powder blue circle badge with orange scissors, 1989 throwback",
    priceLightDiamond: "Siedel's Barbershop retro Cavaliers edition logo — powder blue diamond badge with orange scissors, 1989 throwback",
    // Cleveland Guardians edition
    tribeDarkCircle:   "Siedel's Barbershop Cleveland Guardians edition logo — deep navy circle badge with red scissors",
    tribeDarkDiamond:  "Siedel's Barbershop Cleveland Guardians edition logo — deep navy diamond badge with red scissors",
    tribeLightCircle:  "Siedel's Barbershop Cleveland Guardians edition logo — navy circle badge with red scissors",
    tribeLightDiamond: "Siedel's Barbershop Cleveland Guardians edition logo — navy diamond badge with red scissors",
  },
} as const;

// Canonical shop coordinates — used in Schema.org JSON-LD and in the
// ContactPanel HUD readout. Keep these in sync with the postal address.
export const COORDS = { lat: 41.1445, lng: -81.8637 } as const;
export const COORDS_DISPLAY = `${COORDS.lat.toFixed(4)}° N  ${Math.abs(COORDS.lng).toFixed(4)}° W`;

export interface TeamMember {
  name: string;
  role: string;
  /** Year they started cutting. `title` and `years` are computed from this
   *  so the "X Years" stat stays accurate as time passes. */
  startedYear: number;
  image: string;
  booking: string;
  bio?: string;
}

/** Years of experience, computed from the current year. */
export function getYears(m: TeamMember): number {
  return new Date().getFullYear() - m.startedYear;
}

/** "Master Barber · 31 Years" — derived, not stored. */
export function getTitle(m: TeamMember): string {
  return `${m.role} · ${getYears(m)} Years`;
}

export const team: TeamMember[] = [
  {
    name: 'Jim LaMarca',
    role: 'Master Barber',
    startedYear: 1995,
    image: '/images/jim-lamarca-master-barber-siedels-medina.webp',
    booking: sq('wx9txuouu91i8w'),
    bio: "Behind the chair since 1995. Cappo of Siedel's and the face you'll see when you walk in. Bass player of Chimaira. Yes, that Chimaira. Specializes in bald fades and kids' cuts. Cleveland sports diehard and family man. Probably cracking jokes before the cape's even on.",
  },
  {
    name: 'Billy Rodriguez',
    role: 'Master Barber',
    startedYear: 2010,
    image: '/images/billy-rodriguez-barber-siedels-medina.webp',
    booking: sq('e957m1qmqqdevp'),
    bio: "Sixteen years of experience specializing in clean, sharp cuts — from classic short styles to modern fades, flattops, and tapers. Coaches his kids' sports teams. Die-hard Cleveland sports fan.",
  },
  {
    name: 'Patrick Muranko',
    role: 'Master Barber',
    startedYear: 2022,
    image: '/images/patrick-muranko-barber-siedels-medina.webp',
    booking: sq('x9bbe05slxw75e'),
    bio: "Akron Barber College graduate. Originally from Parma, now in Medina. Veteran, husband, father of two daughters. When he's not here, he's at gymnastics meets, playing retro video games, or arguing about 90s wrestling.",
  },
  {
    name: 'Matt Hayes',
    role: 'Master Barber',
    startedYear: 2019,
    image: '/images/matt-hayes-barber-siedels-medina.webp',
    booking: sq('ub0ju8v1q1926j'),
    bio: "Trained at LaBarberia in Mayfield. Specializes in clean fades, simple cuts, and hot towel face shaves. Big fan of horror and comedy movies, loves dropping '80s and '90s references, and passionate about music. Here to keep you looking sharp.",
  },
  {
    name: 'Sam Sickle',
    role: 'Stylist',
    startedYear: 2021,
    image: '/images/sam-sickle-barber-siedels-medina.webp',
    booking: sq('qj4tfubyvaebvj'),
    bio: "Grew up in Litchfield, Ohio. Three of her cutting years are at Siedel's. Strongest with men's clipper cuts and longer styles that need real shear work. Proud owner of two dogs (Preston and Scout), two cats, and nine hens. Yeah, nine.",
  },
  {
    name: 'Krista Foecking',
    role: 'Master Stylist',
    startedYear: 2000,
    image: '/images/krista-foecking-stylist-siedels-medina.webp',
    booking: sq('h3ib29fkvqykvx'),
    bio: "Polaris Career Center graduate. Specializes in men's fades and kids' cuts — keeping both still and happy is its own skill. Wife and mother of two. Cheer coach for her daughter. When the weather's right, she's in the garden or checking on the bees.",
  },
  {
    name: 'Pierre Wright',
    role: 'Master Barber',
    startedYear: 2003,
    image: '/images/pierre-wright-master-barber-siedels-medina.webp',
    booking: sq('mbwa7epvxqp3ya'),
    bio: "Barber school graduate, class of 2003. Man of faith. Specializes in fades, designs, and classic cuts.",
  },
  {
    name: 'Will Dillon',
    role: 'Master Barber',
    startedYear: 2016,
    image: '/images/will-dillon-barber-siedels-medina.webp',
    booking: sq('licxdz52l4jryx'),
    bio: "Originally from Wheeling, WV. Moved to Medina at 7, came up through Medina City Schools. Hope Valley Barber College graduate. Clipper cuts, designs, tight fades, tapers, beard shaping, razor lineups, hot towel shaves — that's the wheelhouse. Father of three boys. Pittsburgh sports diehard, especially the Steelers. Off the clock: fishing, coaching basketball, and keeping up with three kids.",
  },
  {
    name: 'Chris Hodge',
    role: 'Master Barber',
    startedYear: 2022,
    image: '/images/chris-hodge-barber-siedels-medina.webp',
    booking: sq('taz4mvu6g9k73n'),
    bio: "Strongest with taper fades — that's the wheelhouse. Off the clock: fishing, riding his motorcycle, hiking, and driving semi-trucks.",
  },
  {
    name: 'Ticia Husak',
    role: 'Master Stylist',
    startedYear: 2010,
    image: '/images/ticia-husak-stylist-siedels-medina.webp',
    booking: sq('xa1g2bceso9izn'),
    bio: "Specializes in clipper, scissor, and foil cuts — keeping everything clean, sharp, and on point. Takes pride in her work and making sure every client leaves smiling. Wife, mom of two boys, and a registered nurse. When she's not at work, she's in the gym or spending time with her family.",
  },
  {
    name: 'Shannon Hadick',
    role: 'Master Stylist',
    startedYear: 2017,
    image: '/images/shannon-hadick-barber-siedels-medina.webp',
    booking: sq('0lh9o00vt6or3u'),
    bio: "Specializes in men's and women's cuts. Three years in the area, almost two at Siedel's. Managed a shop before coming here. Looks forward to helping you look your very best.",
  },
];

export interface Service {
  name: string;
  /** Square / online booking price */
  price: string;
  /** Walk-in (cash) price — leave undefined until confirmed */
  walkInPrice?: string;
  tagline: string;
  description: string;
  includes: string[];
  duration: string;
  image?: string;
}

export const services: Service[] = [
  {
    name: 'Haircut',
    price: '$34',
    tagline: 'The Siedel\'s signature cut',
    description:
      "A precision men's haircut from a master barber. Consultation and a tailored cut using clippers, shears, or a combination — scissor-over-comb, tapers, fades, classic side parts, or whatever shape you need. Finished with a neck shave.",
    includes: ['Consultation', 'Precision cut', 'Neck clean-up'],
    duration: '30 min',
    image: '/images/mens-haircut-scissors-siedels-medina.webp',
  },
  {
    name: 'Razor / Foil Fade',
    price: '$40',
    tagline: 'Zero-gap precision',
    description:
      "Our sharpest fade work. Built with foil shavers and a straight razor for a crisp, skin-tight blend and a razor-defined lineup. Ideal for bald fades, skin fades, and anyone who wants the cleanest edge in Medina.",
    includes: ['Detailed fade', 'Foil shaver blend', 'Straight razor lineup'],
    duration: '30 min',
    image: '/images/fade-haircut-razor-lineup-siedels-medina.webp',
  },
  {
    name: 'Haircut + Beard Trim',
    price: '$44',
    tagline: 'Full overhaul',
    description:
      "Our most popular combo. A complete haircut paired with a full beard shape-up — cheek and neck lines defined, length balanced, and the whole thing finished with beard oil. Walk out looking like a different man.",
    includes: ['Full haircut', 'Beard shape + trim', 'Line work', 'Beard oil'],
    duration: '50 min',
    image: '/images/beard-trim-clippers-siedels-medina.webp',
  },
  {
    name: 'Haircut + Face Shave',
    price: '$65',
    tagline: 'The full treatment, head to jaw',
    description:
      "A complete haircut paired with a full straight razor face shave. Hot towels, lather, two passes, cold towel finish — the works. Walk out with a fresh cut and the smoothest shave in Medina.",
    includes: ['Full haircut', 'Hot towel prep', 'Straight razor face shave', 'Cold towel finish', 'Aftershave balm'],
    duration: '55 min',
    image: '/images/straight-razor-shave-hot-towel-siedels-medina.webp',
  },
  {
    name: 'Full Service Shave',
    price: '$46',
    tagline: 'The classic straight razor shave',
    description:
      "The full old-school treatment. Warm lather, hot towels, and a straight razor shave done the way barbers have done it for a century. Pre-shave oil, two passes, cold towel finish, and aftershave balm. Worth booking just for the ritual.",
    includes: ['Pre-shave oil', 'Hot towel prep', 'Straight razor — two passes', 'Cold towel finish', 'Aftershave balm'],
    duration: '30 min',
    image: '/images/full-service-straight-razor-shave-siedels-medina.webp',
  },
  {
    name: 'Head Shave',
    price: '$42',
    tagline: 'Skin-smooth, start to finish',
    description:
      "A full head shave with hot towels and a straight razor. Whether you're maintaining a bald look or going for it for the first time, you'll walk out smooth, conditioned, and comfortable. Includes scalp treatment.",
    includes: ['Hot towel prep', 'Straight razor head shave', 'Scalp treatment', 'Aftershave balm'],
    duration: '35 min',
    image: '/images/straight-razor-shave-hot-towel-siedels-medina.webp',
  },
  {
    name: 'Beard Trim',
    price: '$31',
    tagline: 'Shape, define, finish',
    description:
      "Beard shape-up with clean cheek and neck lines, length balancing, and detailing. Finished with beard oil. Book this on its own or add it to any haircut.",
    includes: ['Beard shape', 'Cheek + neck lines', 'Length balance', 'Beard oil'],
    duration: '20 min',
    image: '/images/beard-trim-scissors-siedels-medina.webp',
  },
  {
    name: 'Shoulder Length Cut + Rough Dry',
    price: '$40',
    tagline: 'Longer styles, dialed in',
    description:
      "Longer men's styles need real shear work. Precision cut with scissors and a rough dry so you can see the shape before you walk out. Ideal for shoulder-length and flow cuts.",
    includes: ['Shear cut', 'Rough dry'],
    duration: '30 min',
    image: '/images/shoulder-length-haircut-siedels-medina.webp',
  },
  {
    name: 'Duo Haircut',
    price: '$64',
    tagline: 'Father + son, or two buddies',
    description:
      "Two haircuts booked together, back-to-back in the same chair or in adjacent chairs. Popular for dads with kids, brothers, or anyone who wants to make a trip of it.",
    includes: ['Two full haircuts', 'Back-to-back timing'],
    duration: '60 min',
    image: '/images/kids-haircut-siedels-medina-ohio.webp',
  },
  {
    name: 'Trio Haircut',
    price: '$90',
    tagline: 'Three at once',
    description:
      "Three haircuts booked together. Great for families with multiple kids, groomsmen before a wedding, or any group that wants to come in together.",
    includes: ['Three full haircuts', 'Coordinated timing'],
    duration: '90 min',
    image: '/images/kids-fade-haircut-siedels-medina.webp',
  },
];

export interface Testimonial {
  name: string;
  text: string;
  barber?: string;
  rating: number;
}

export const testimonials: Testimonial[] = [
  {
    name: 'Joshua P.',
    text: "The entire crew at Siedel's are amazing, especially Matt! Matt knows me through and through at this point. I am a retired Marine who always shaved my face. Matt and my old lady recommended an attempt at a beard. 3, maybe 4 months later now, and I am loving the full beard. I leave it to Matt's professional hands. Semper Fidelis!",
    barber: 'Matt Hayes',
    rating: 5,
  },
  {
    name: 'Colton S.',
    text: "Billy is the most technically qualified & gifted barber in all of Northeast OH. His incredible attention to detail and ability to bring your vision to life is 10/10. The shop is in a great location, great owners, they support veterans, all around an excellent shop.",
    barber: 'Billy Rodriguez',
    rating: 5,
  },
  {
    name: 'Gregory B.',
    text: "Since the first haircut a year or two ago, I haven't gotten it done anywhere else. Professional staff and amazing haircuts every time.",
    rating: 5,
  },
  {
    name: 'Renier G.',
    text: "Have been going here for years, service is always good, have never been disappointed. Staff is always friendly.",
    barber: 'Jim LaMarca',
    rating: 5,
  },
];

export interface GalleryItem {
  src: string;
  alt: string;
  barber?: string;
  tag?: string;
  /** CSS object-position value — controls focal point when image is cropped.
   *  Omit to use the default (center). Use '50% 20%' to anchor toward the top
   *  for portrait shots where the subject's head is in the upper portion. */
  focalPoint?: string;
}

export const gallery: GalleryItem[] = [
  // 94 photos — gallery rotates 18 at a time every 9 seconds.
  // Interleaved by category: each 18-tile page mixes fades, kids, interior,
  // exterior, shave/beard, designs, and heritage — no two similar shots adjacent.
  // focalPoint shifts the crop anchor so heads stay in frame on portrait crops.

  // ── Page 1 (0–17) ─────────────────────────────────────────
  { src: '/images/siedels-fade-beard-profile-medina.webp', alt: 'Clean fade and shaped beard profile at Siedel\'s Barbershop, Medina Ohio', tag: 'FADE', focalPoint: '50% 22%' },
  { src: '/images/siedels-interior-lobby-wide-medina.webp', alt: 'Wide shot of the lobby and interior at Siedel\'s Barbershop in Medina, Ohio', tag: 'SHOP' },
  { src: '/images/siedels-storefront-summer-medina-ohio.webp', alt: 'Siedel\'s Barbershop storefront on a summer day in Medina, Ohio', tag: 'SHOP' },
  { src: '/images/cleveland-skyline-hair-design-siedels-medina.webp', alt: 'Cleveland skyline shaved into a hair design at Siedel\'s Barbershop', tag: 'DESIGN', focalPoint: '50% 15%' },
  { src: '/images/siedels-kid-happy-fresh-cut-medina.webp', alt: 'Happy kid with fresh cut and barber at Siedel\'s, Medina Ohio', tag: 'KIDS', focalPoint: '50% 28%' },
  { src: '/images/barber-client-laughing-bw-siedels-medina.webp', alt: 'Barber and client sharing a laugh at Siedel\'s Barbershop in Medina, Ohio', tag: 'CANDID', focalPoint: '50% 25%' },
  { src: '/images/straight-razor-shave-hot-towel-siedels-medina.webp', alt: 'Straight razor shave with hot towel at Siedel\'s Barbershop', tag: 'SHAVE', focalPoint: '50% 25%' },
  { src: '/images/siedels-shop-interior-wide-1-medina.webp', alt: 'Wide view of Siedel\'s Barbershop floor with rows of leather barber chairs, Medina Ohio', tag: 'SHOP' },
  { src: '/images/mens-haircut-scissors-siedels-medina.webp', alt: 'Precision men\'s haircut with scissors at Siedel\'s Barbershop', tag: 'CUT', focalPoint: '50% 20%' },
  { src: '/images/barber-tools-siedels-barbershop-medina.webp', alt: 'Barber tools laid out at Siedel\'s Barbershop in Medina, Ohio', tag: 'TOOLS' },
  { src: '/images/barber-pole-classic-exterior-siedels-medina.webp', alt: 'Classic red and white barber pole outside Siedel\'s Barbershop in Medina, Ohio', tag: 'SHOP' },
  { src: '/images/beard-conditioning-brush-siedels-medina.webp', alt: 'Beard conditioning with brush at Siedel\'s Barbershop in Medina, Ohio', tag: 'BEARD', focalPoint: '50% 25%' },
  { src: '/images/siedels-kids-design-fade-barber-pole-medina.webp', alt: 'Kid\'s fade with razor lines and barber pole visible through front window, Siedel\'s Medina Ohio', tag: 'KIDS', focalPoint: '50% 28%' },
  { src: '/images/mohawk-fade-wave-design-siedels-medina.webp', alt: 'Mohawk fade with wave design at Siedel\'s Barbershop', tag: 'DESIGN', focalPoint: '50% 20%' },
  { src: '/images/siedels-lounge-seating-medina.webp', alt: 'Lounge seating area at Siedel\'s Barbershop in Medina, Ohio', tag: 'LOUNGE' },
  { src: '/images/mens-fade-with-beard-siedels-medina.webp', alt: 'Men\'s fade with beard at Siedel\'s Barbershop in Medina, Ohio', tag: 'FADE', focalPoint: '50% 20%' },
  { src: '/images/siedels-family-archive-portrait.webp', alt: 'Archive portrait of the Siedel family — the shop\'s namesake', tag: 'HERITAGE', focalPoint: '50% 15%' },
  { src: '/images/bald-head-straight-razor-shave-siedels-medina.webp', alt: 'Straight razor shave on a bald head at Siedel\'s Barbershop', tag: 'SHAVE', focalPoint: '50% 15%' },

  // ── Page 2 (18–35) ────────────────────────────────────────
  { src: '/images/siedels-taper-fade-side-profile-medina.webp', alt: 'Taper fade side profile haircut at Siedel\'s Barbershop, Medina Ohio', tag: 'FADE', focalPoint: '50% 22%' },
  { src: '/images/siedels-shop-interior-wide-2-medina.webp', alt: 'Siedel\'s Barbershop main floor with mirrored stations and wood floor, Medina Ohio', tag: 'SHOP' },
  { src: '/images/barber-pole-warm-light-siedels-medina.webp', alt: 'Barber pole in warm golden light outside Siedel\'s Barbershop', tag: 'SHOP' },
  { src: '/images/siedels-womens-star-undercut-design-medina.webp', alt: 'Intricate star pattern undercut design on women\'s hair at Siedel\'s, Medina Ohio', tag: 'DESIGN', focalPoint: '50% 35%' },
  { src: '/images/kids-fade-clippers-siedels-medina.webp', alt: 'Kids fade with clippers at Siedel\'s Barbershop in Medina, Ohio', tag: 'KIDS', focalPoint: '50% 20%' },
  { src: '/images/barbers-candid-laugh-siedels-medina.webp', alt: 'Barbers sharing a candid laugh at Siedel\'s Barbershop', tag: 'CANDID', focalPoint: '50% 25%' },
  { src: '/images/straight-razor-beard-shave-siedels-medina.webp', alt: 'Straight razor beard shave at Siedel\'s Barbershop in Medina, Ohio', tag: 'SHAVE', focalPoint: '50% 25%' },
  { src: '/images/siedels-lounge-waiting-area-1-medina.webp', alt: 'Siedel\'s Barbershop client lounge with leather seating, Medina Ohio', tag: 'LOUNGE' },
  { src: '/images/mens-haircut-styling-siedels-medina.webp', alt: 'Men\'s haircut and styling at Siedel\'s Barbershop in Medina, Ohio', tag: 'CUT', focalPoint: '50% 20%' },
  { src: '/images/vintage-barber-tools-wood-siedels-medina.webp', alt: 'Vintage barber tools on wood at Siedel\'s Barbershop', tag: 'TOOLS' },
  { src: '/images/siedels-storefront-summer-angle-medina-ohio.webp', alt: 'Angled summer shot of Siedel\'s Barbershop storefront in Medina, Ohio', tag: 'SHOP' },
  { src: '/images/beard-trim-clippers-siedels-medina.webp', alt: 'Beard trim with clippers at Siedel\'s Barbershop in Medina, Ohio', tag: 'BEARD', focalPoint: '50% 25%' },
  { src: '/images/kids-haircut-happy-siedels-medina.webp', alt: 'Happy kid getting a haircut at Siedel\'s Barbershop in Medina, Ohio', tag: 'KIDS', focalPoint: '50% 20%' },
  { src: '/images/womens-undercut-hair-design-siedels-medina.webp', alt: 'Women\'s undercut hair design at Siedel\'s Barbershop in Medina, Ohio', tag: 'DESIGN', focalPoint: '50% 15%' },
  { src: '/images/siedels-stations-clean-modern-medina.webp', alt: 'Clean modern barber stations at Siedel\'s, Medina Ohio', tag: 'SHOP' },
  { src: '/images/fade-haircut-razor-lineup-siedels-medina.webp', alt: 'Fade haircut with razor lineup at Siedel\'s Barbershop in Medina, Ohio', tag: 'FADE', focalPoint: '50% 15%' },
  { src: '/images/siedels-grand-opening-ribbon-cutting.webp', alt: 'Grand opening ribbon cutting at Siedel\'s Barbershop in Medina, Ohio', tag: 'HERITAGE' },
  { src: '/images/shampoo-scalp-massage-siedels-medina.webp', alt: 'Shampoo and scalp massage at Siedel\'s Barbershop in Medina, Ohio', tag: 'SHAMPOO', focalPoint: '50% 20%' },

  // ── Page 3 (36–53) ────────────────────────────────────────
  { src: '/images/mens-scissor-over-comb-siedels-medina.webp', alt: 'Scissor-over-comb technique at Siedel\'s Barbershop in Medina, Ohio', tag: 'CUT', focalPoint: '50% 20%' },
  { src: '/images/siedels-shop-interior-wide-3-medina.webp', alt: 'Siedel\'s Barbershop interior showing client lounge and stations, Medina Ohio', tag: 'SHOP' },
  { src: '/images/siedels-storefront-summer-clouds-medina-ohio.webp', alt: 'Siedel\'s Barbershop storefront with summer clouds in Medina, Ohio', tag: 'SHOP' },
  { src: '/images/siedels-womens-lotus-undercut-design-medina.webp', alt: 'Lotus flower undercut hair design on women\'s nape at Siedel\'s, Medina Ohio', tag: 'DESIGN', focalPoint: '50% 35%' },
  { src: '/images/kids-scissor-cut-mask-bw-siedels-medina.webp', alt: 'Black and white scissor cut on a young client at Siedel\'s Barbershop', tag: 'CANDID', focalPoint: '50% 20%' },
  { src: '/images/jim-lamarca-thumbs-up-shop-siedels-medina.webp', alt: 'Jim LaMarca giving a thumbs up inside Siedel\'s Barbershop', tag: 'VIBE', focalPoint: '50% 20%' },
  { src: '/images/straight-razor-shave-lather-siedels-medina.webp', alt: 'Straight razor shave with lather at Siedel\'s Barbershop in Medina, Ohio', tag: 'SHAVE', focalPoint: '50% 25%' },
  { src: '/images/siedels-empty-floor-natural-light-medina.webp', alt: 'Empty Siedel\'s barbershop floor in natural daylight, Medina Ohio', tag: 'SHOP' },
  { src: '/images/siedels-curly-top-fade-shop-vibe-medina.webp', alt: 'Curly top fade haircut with live barbershop in background, Siedel\'s Medina Ohio', tag: 'FADE', focalPoint: '50% 22%' },
  { src: '/images/vintage-red-clipper-siedels-medina.webp', alt: 'Vintage red hair clipper at Siedel\'s Barbershop in Medina, Ohio', tag: 'TOOLS' },
  { src: '/images/siedels-storefront-exterior-archive-medina.webp', alt: 'Siedel\'s Barbershop storefront with awning, Medina Ohio', tag: 'SHOP' },
  { src: '/images/beard-combing-profile-bw-siedels-medina.webp', alt: 'Beard combing in profile, black and white, at Siedel\'s Barbershop', tag: 'BEARD', focalPoint: '50% 25%' },
  { src: '/images/kids-first-haircut-scissors-siedels-medina.webp', alt: 'A child\'s first haircut with scissors at Siedel\'s Barbershop', tag: 'KIDS', focalPoint: '50% 20%' },
  { src: '/images/kids-hair-design-detail-siedels-medina.webp', alt: 'Hair design detail on a kid at Siedel\'s Barbershop in Medina, Ohio', tag: 'DESIGN', focalPoint: '50% 15%' },
  { src: '/images/siedels-waiting-lounge-art-wall-medina.webp', alt: 'Waiting lounge with art wall at Siedel\'s Barbershop in Medina, Ohio', tag: 'LOUNGE' },
  { src: '/images/mens-neck-clipper-trim-siedels-medina.webp', alt: 'Neck clipper trim at Siedel\'s Barbershop in Medina, Ohio', tag: 'DETAIL', focalPoint: '50% 20%' },
  { src: '/images/siedels-grand-opening-family-community.webp', alt: 'Siedel family at the grand opening of Siedel\'s Barbershop, Medina Ohio', tag: 'HERITAGE', focalPoint: '50% 30%' },
  { src: '/images/hot-towel-shampoo-siedels-medina.webp', alt: 'Hot towel and shampoo service at Siedel\'s Barbershop', tag: 'SHAMPOO', focalPoint: '50% 25%' },

  // ── Page 4 (54–71) ────────────────────────────────────────
  { src: '/images/mens-fade-clipper-over-comb-siedels-medina.webp', alt: 'Clipper-over-comb fade technique at Siedel\'s Barbershop in Medina, Ohio', tag: 'FADE', focalPoint: '50% 20%' },
  { src: '/images/siedels-barber-stations-empty-medina.webp', alt: 'Empty barber stations at Siedel\'s Barbershop in Medina, Ohio', tag: 'SHOP' },
  { src: '/images/siedels-storefront-winter-medina-ohio.webp', alt: 'Siedel\'s Barbershop storefront in winter in Medina, Ohio', tag: 'SHOP' },
  { src: '/images/kids-tmt-hair-design-siedels-medina.webp', alt: 'TMT hair design on a kid at Siedel\'s Barbershop', tag: 'DESIGN', focalPoint: '50% 15%' },
  { src: '/images/kids-fade-haircut-siedels-medina.webp', alt: 'Kids fade haircut at Siedel\'s Barbershop in Medina, Ohio', tag: 'KIDS', focalPoint: '50% 20%' },
  { src: '/images/jim-lamarca-kids-cut-bw-siedels-medina.webp', alt: 'Jim LaMarca giving a kids haircut at Siedel\'s Barbershop in black and white', tag: 'CANDID', focalPoint: '50% 20%' },
  { src: '/images/hot-towel-face-shave-siedels-medina.webp', alt: 'Hot towel face shave at Siedel\'s Barbershop in Medina, Ohio', tag: 'SHAVE', focalPoint: '50% 25%' },
  { src: '/images/siedels-full-shop-barber-at-work-medina.webp', alt: 'Wide angle of full Siedel\'s Barbershop floor with barber at work and lounge in background', tag: 'SHOP', focalPoint: '50% 40%' },
  { src: '/images/fade-clipper-comb-technique-siedels-medina.webp', alt: 'Clipper and comb fade technique at Siedel\'s Barbershop', tag: 'FADE', focalPoint: '50% 20%' },
  { src: '/images/siedels-old-shop-bw-archive.webp', alt: 'Black-and-white archival photo of the original Siedel\'s shop floor', tag: 'HERITAGE' },
  { src: '/images/siedels-barbershop-storefront-medina-ohio.webp', alt: 'Siedel\'s Barbershop storefront with sign at 982 N Court Street in Medina, Ohio', tag: 'SHOP' },
  { src: '/images/beard-trim-scissors-siedels-medina.webp', alt: 'Beard trim with scissors at Siedel\'s Barbershop in Medina, Ohio', tag: 'BEARD', focalPoint: '50% 25%' },
  { src: '/images/kids-scissor-cut-hair-clip-siedels-medina.webp', alt: 'Scissor cut with hair clip on a kid at Siedel\'s Barbershop', tag: 'KIDS', focalPoint: '50% 20%' },
  { src: '/images/womens-long-hair-trim-siedels-medina.webp', alt: 'Women\'s long hair trim at Siedel\'s Barbershop in Medina, Ohio', tag: 'LONG', focalPoint: '50% 20%' },
  { src: '/images/siedels-empty-stations-wide-medina.webp', alt: 'Wide angle of Siedel\'s empty barber stations at opening, Medina Ohio', tag: 'SHOP' },
  { src: '/images/senior-haircut-jim-lamarca-siedels-medina.webp', alt: 'Senior haircut by Jim LaMarca at Siedel\'s Barbershop in Medina, Ohio', tag: 'CUT', focalPoint: '50% 20%' },
  { src: '/images/siedels-community-dinner-1.webp', alt: 'Siedel\'s team and community at private dinner event', tag: 'COMMUNITY' },
  { src: '/images/full-service-straight-razor-shave-siedels-medina.webp', alt: 'Full-service straight razor shave at Siedel\'s Barbershop in Medina, Ohio', tag: 'SHAVE', focalPoint: '50% 20%' },

  // ── Page 5 (72–89) ────────────────────────────────────────
  { src: '/images/fade-clipper-work-pink-comb-siedels-medina.webp', alt: 'Fade clipper work with a pink comb at Siedel\'s Barbershop', tag: 'FADE', focalPoint: '50% 20%' },
  { src: '/images/siedels-lounge-waiting-area-2-medina.webp', alt: 'Wide view of Siedel\'s waiting area and gallery wall, Medina Ohio', tag: 'LOUNGE' },
  { src: '/images/siedels-barber-pole-brick-exterior-classic.webp', alt: 'Classic barber pole on brick exterior at old Siedel\'s Barbershop location', tag: 'HERITAGE', focalPoint: '75% 45%' },
  { src: '/images/manicure-nail-polish-siedels-medina.webp', alt: 'Manicure and nail polish service at Siedel\'s Barbershop', tag: 'NAILS' },
  { src: '/images/kids-haircut-siedels-medina-ohio.webp', alt: 'Kids haircut at Siedel\'s Barbershop in Medina, Ohio', tag: 'KIDS', focalPoint: '50% 20%' },
  { src: '/images/siedels-barber-portrait-staff-shirt-medina.webp', alt: 'Siedel\'s barber smiling at station wearing staff shirt, Medina Ohio', tag: 'TEAM', focalPoint: '50% 22%' },
  { src: '/images/straight-razor-fade-lineup-siedels-medina.webp', alt: 'Straight razor fade lineup at Siedel\'s Barbershop', tag: 'FADE', focalPoint: '50% 15%' },
  { src: '/images/siedels-station-row-we-the-people-medina.webp', alt: 'Siedel\'s barber stations with We the People flag art on the wall, Medina Ohio', tag: 'SHOP' },
  { src: '/images/shoulder-length-haircut-siedels-medina.webp', alt: 'Shoulder-length haircut at Siedel\'s Barbershop in Medina, Ohio', tag: 'LONG', focalPoint: '50% 15%' },
  { src: '/images/siedels-original-shop-detail-archive.webp', alt: 'Detail of original Siedel\'s shop fittings', tag: 'HERITAGE' },
  { src: '/images/siedels-old-location-barber-pole-exterior.webp', alt: 'Barber pole and glass storefront at the original Siedel\'s Barbershop location', tag: 'HERITAGE', focalPoint: '75% 45%' },
  { src: '/images/eyebrow-detail-shaping-siedels-medina.webp', alt: 'Eyebrow detail shaping at Siedel\'s Barbershop in Medina, Ohio', tag: 'DETAIL', focalPoint: '50% 20%' },
  { src: '/images/boys-fade-top-view-siedels-medina.webp', alt: 'Top-view of a boy\'s fade finish at Siedel\'s Barbershop in Medina, Ohio', tag: 'KIDS', focalPoint: '50% 10%' },
  { src: '/images/siedels-early-days-lounge-crew.webp', alt: 'Group of friends in the Siedel\'s waiting lounge in the early days', tag: 'COMMUNITY', focalPoint: '50% 38%' },
  { src: '/images/siedels-styling-chair-products-medina.webp', alt: 'Barber chair and styling products at Siedel\'s Barbershop in Medina, Ohio', tag: 'SHOP' },
  { src: '/images/neck-lineup-straight-razor-siedels-medina.webp', alt: 'Neck lineup with straight razor at Siedel\'s Barbershop', tag: 'DETAIL', focalPoint: '50% 15%' },
  { src: '/images/siedels-community-dinner-2.webp', alt: 'Siedel\'s barbers and guests at community dinner', tag: 'COMMUNITY' },
  { src: '/images/beard-dusting-brush-siedels-medina.webp', alt: 'Beard dusting with brush at Siedel\'s Barbershop in Medina, Ohio', tag: 'BEARD', focalPoint: '50% 25%' },

  // ── Overflow (90–93, appear with page-1 items on wrap) ────
  { src: '/images/siedels-window-stay-sharp-medina.webp', alt: '"Stay Sharp" window decal at Siedel\'s Barbershop in Medina, Ohio', tag: 'SHOP' },
  { src: '/images/barber-stations-siedels-barbershop-medina.webp', alt: 'Barber stations at Siedel\'s Barbershop in Medina, Ohio', tag: 'SHOP' },
  { src: '/images/siedels-front-desk-reception-medina.webp', alt: 'Siedel\'s Barbershop stone front desk and reception area, Medina Ohio', tag: 'SHOP' },
  { src: '/images/siedels-product-bobblehead-display-medina.webp', alt: 'Bobblehead and product display at Siedel\'s, Medina Ohio', tag: 'SHOP' },
];

export const hours = [
  { day: 'Monday', time: '8 AM – 8 PM' },
  { day: 'Tuesday', time: '8 AM – 6 PM' },
  { day: 'Wednesday', time: '8 AM – 6 PM' },
  { day: 'Thursday', time: '8 AM – 8 PM' },
  { day: 'Friday', time: '8 AM – 6 PM' },
  { day: 'Saturday', time: '8 AM – 3 PM' },
  { day: 'Sunday', time: 'Closed' },
];