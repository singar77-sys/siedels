const SQUARE_BASE = 'https://app.squareup.com/appointments/buyer/widget';
const LOCATION = 'LFCOT5CC7MY0S';
const sq = (id: string) => `${SQUARE_BASE}/${id}/${LOCATION}`;

export const SQUARE_BOOKING_URL = `${SQUARE_BASE}/xcru7izyf4zhv6/${LOCATION}`;
export const PHONE = '(330) 952-0777';
export const PHONE_HREF = 'tel:3309520777';
export const ADDRESS = '982 N Court Street';
export const CITY_STATE_ZIP = 'Medina, Ohio 44256';
export const MAPS_URL = 'https://maps.google.com/?q=982+N+Court+Street+Medina+OH+44256';
export const GOOGLE_BUSINESS_URL = 'https://share.google/n7DB5686mE05Db6tK';

export interface TeamMember {
  name: string;
  title: string;
  image: string;
  booking: string;
  bio?: string;
}

export const team: TeamMember[] = [
  { name: 'Jim LaMarca', title: 'Master Barber', image: '/images/jim-lamarca.webp', booking: sq('wx9txuouu9ti8w') },
  {
    name: 'Pierre Wright',
    title: 'Master Barber',
    image: '/images/pierre-wright.webp',
    booking: sq('mbwa7epvxqp3ya'),
    bio: "26 years behind the chair. Barber school graduate, class of 2003. Man of faith. Specializes in fades, designs, and classic cuts with precision — keeping every customer clean with a feeling of greatness.",
  },
  {
    name: 'Matt Hayes',
    title: 'Master Barber · 7 Years',
    image: '/images/matt-hayes.webp',
    booking: sq('ub0ju8v1q1926j'),
    bio: "Licensed barber for 7 years. Trained at LaBarberia in Mayfield. Specializes in clean fades, simple cuts, and hot towel face shaves. Big fan of horror and comedy movies, loves dropping '80s and '90s references, and passionate about music. Here to keep you looking sharp.",
  },
  { name: 'Ticia Husak', title: 'Master Stylist', image: '/images/ticia-husak.webp', booking: sq('xa1g2bceso9izn') },
  {
    name: 'Krista Foecking',
    title: 'Stylist · 26 Years',
    image: '/images/krista-foecking.webp',
    booking: sq('h3ib29fkvqykvx'),
    bio: "26 years cutting hair. Polaris Career Center graduate. Specializes in men's fades and kids' cuts — keeping both still and happy is its own skill. Wife and mother of two. Cheer coach for her daughter. When the weather's right, she's in the garden or checking on the bees.",
  },
  {
    name: 'Patrick Muranko',
    title: 'Barber · 4 Years',
    image: '/images/patrick-muranko.webp',
    booking: sq('x9bbe05slxw75e'),
    bio: "Akron Barber College graduate. Four years in the chair. Originally from Parma, now in Medina. Veteran, husband, father of two daughters. When he's not here, he's at gymnastics meets, playing retro video games, or arguing about 90s wrestling.",
  },
  {
    name: 'Will Dillon',
    title: 'Barber · 10 Years',
    image: '/images/will-dillon.webp',
    booking: sq('licxdz52l4jryx'),
    bio: "Originally from Wheeling, WV. Moved to Medina at 7, came up through Medina City Schools. Hope Valley Barber College graduate with 10 years behind the chair. Clipper cuts, designs, tight fades, tapers, beard shaping, razor lineups, hot towel shaves — that's the wheelhouse. Father of three boys. Pittsburgh sports diehard, especially the Steelers. Off the clock: fishing, coaching basketball, and keeping up with three kids.",
  },
  {
    name: 'Shannon Hadick',
    title: 'Master Barber · 9 Years',
    image: '/images/shannon-hadick.webp',
    booking: sq('0lh9o00vt6or3u'),
    bio: "Over 9 years of experience. Specializes in men's and women's cuts. Three years in the area, almost two at Siedel's. Managed a shop before coming here. Looks forward to helping you look your very best.",
  },
  {
    name: 'Chris Hodge',
    title: 'Barber · 4 Years',
    image: '/images/chris-hodge.webp',
    booking: sq('taz4mvu6g9k73n'),
    bio: "Four years behind the chair. Strongest with taper fades — that's the wheelhouse. Off the clock: fishing, riding his motorcycle, hiking, and driving semi-trucks.",
  },
  {
    name: 'Billy Rodriguez',
    title: 'Barber',
    image: '/images/billy-rodriguez.webp',
    booking: sq('e957m1qmqqdevp'),
    bio: "Over 15 years of experience specializing in clean, sharp cuts — from classic short styles to modern fades, flattops, and tapers. Coaches his kids' sports teams. Die-hard Cleveland sports fan.",
  },
  {
    name: 'Sam Sickle',
    title: 'Barber · 5 Years',
    image: '/images/sam-sickle.webp',
    booking: sq('qj4tfubyvaebvj'),
    bio: "Grew up in Litchfield, Ohio. Five years cutting, three of them at Siedel's. Strongest with men's clipper cuts and longer styles that need real shear work. Proud owner of two dogs (Preston and Scout), two cats, and nine hens. Yeah, nine.",
  },
];

export interface Service {
  name: string;
  price: string;
  tagline: string;
  description: string;
  includes: string[];
  duration: string;
  image?: string;
}

export const services: Service[] = [
  {
    name: 'Haircut',
    price: '$32',
    tagline: 'The Siedel\'s signature cut',
    description:
      "A precision men's haircut from a master barber. Consultation, shampoo, and a tailored cut using clippers, shears, or a combination — scissor-over-comb, tapers, fades, classic side parts, or whatever shape you need. Finished with a hot towel, styling, and a neck shave.",
    includes: ['Consultation', 'Shampoo', 'Precision cut', 'Hot towel finish', 'Neck clean-up', 'Styling'],
    duration: '30 min',
    image: '/images/mens-cut-scissors-01.webp',
  },
  {
    name: 'Razor / Foil Fade',
    price: '$38',
    tagline: 'Zero-gap precision',
    description:
      "Our sharpest fade work. Built with foil shavers and a straight razor for a crisp, skin-tight blend and a razor-defined lineup. Ideal for bald fades, skin fades, and anyone who wants the cleanest edge in Medina.",
    includes: ['Detailed fade', 'Foil shaver blend', 'Straight razor lineup', 'Shampoo', 'Styling'],
    duration: '45 min',
    image: '/images/fade-lineup-01.webp',
  },
  {
    name: 'Haircut + Beard Trim',
    price: '$42',
    tagline: 'Full overhaul',
    description:
      "Our most popular combo. A complete haircut paired with a full beard shape-up — cheek and neck lines defined, length balanced, and the whole thing finished with hot towel and beard oil. Walk out looking like a different man.",
    includes: ['Full haircut', 'Beard shape + trim', 'Line work', 'Hot towel', 'Beard oil'],
    duration: '45 min',
    image: '/images/beard-trim-clippers-01.webp',
  },
  {
    name: 'Full Service Shave',
    price: '$44',
    tagline: 'The classic straight razor shave',
    description:
      "The full old-school treatment. Warm lather, hot towels, and a straight razor shave done the way barbers have done it for a century. Pre-shave oil, two passes, cold towel finish, and aftershave balm. Worth booking just for the ritual.",
    includes: ['Pre-shave oil', 'Hot towel prep', 'Straight razor — two passes', 'Cold towel finish', 'Aftershave balm'],
    duration: '45 min',
    image: '/images/straight-razor-shave-01.webp',
  },
  {
    name: 'Head Shave',
    price: '$40',
    tagline: 'Skin-smooth, start to finish',
    description:
      "A full head shave with hot towels and a straight razor. Whether you're maintaining a bald look or going for it for the first time, you'll walk out smooth, conditioned, and comfortable. Includes scalp treatment.",
    includes: ['Hot towel prep', 'Straight razor head shave', 'Scalp treatment', 'Aftershave balm'],
    duration: '40 min',
    image: '/images/shave-lather-01.webp',
  },
  {
    name: 'Beard Trim',
    price: '$29',
    tagline: 'Shape, define, finish',
    description:
      "Beard shape-up with clean cheek and neck lines, length balancing, and detailing. Finished with hot towel and beard oil. Book this on its own or add it to any haircut.",
    includes: ['Beard shape', 'Cheek + neck lines', 'Length balance', 'Hot towel', 'Beard oil'],
    duration: '20 min',
    image: '/images/beard-trim-scissors-01.webp',
  },
  {
    name: 'Shoulder Length Cut + Rough Dry',
    price: '$38',
    tagline: 'Longer styles, dialed in',
    description:
      "Longer men's styles need real shear work. Shampoo, precision cut with scissors, and a rough dry so you can see the shape before you walk out. Ideal for shoulder-length and flow cuts.",
    includes: ['Shampoo', 'Shear cut', 'Rough dry', 'Styling'],
    duration: '40 min',
    image: '/images/womens-style-01.webp',
  },
  {
    name: 'Duo Haircut',
    price: '$64',
    tagline: 'Father + son, or two buddies',
    description:
      "Two haircuts booked together, back-to-back in the same chair or in adjacent chairs. Popular for dads with kids, brothers, or anyone who wants to make a trip of it.",
    includes: ['Two full haircuts', 'Back-to-back timing'],
    duration: '60 min',
    image: '/images/kids-cut-01.webp',
  },
  {
    name: 'Trio Haircut',
    price: '$96',
    tagline: 'Three at once',
    description:
      "Three haircuts booked together. Great for families with multiple kids, groomsmen before a wedding, or any group that wants to come in together.",
    includes: ['Three full haircuts', 'Coordinated timing'],
    duration: '90 min',
    image: '/images/kids-fade-01.webp',
  },
  {
    name: 'Eyebrow / Lip / Chin',
    price: '$23',
    tagline: 'Detail work',
    description:
      "Precision trimming and shape-up on the eyebrows, upper lip, or chin. Clean, quick, and a huge difference in how your grooming reads. Add it to any other service.",
    includes: ['Detailed shaping', 'Precision trim'],
    duration: '15 min',
    image: '/images/detail-tools-01.webp',
  },
  {
    name: 'Shampoo',
    price: '$5',
    tagline: 'Add-on',
    description:
      "A proper shampoo and scalp massage. Add it to any haircut or service for a few extra dollars and walk out feeling twice as clean.",
    includes: ['Shampoo', 'Scalp massage', 'Conditioner'],
    duration: '10 min',
    image: '/images/hot-towel-01.webp',
  },
  {
    name: 'Shampoo + Style',
    price: '$25+',
    tagline: 'Wash, dry, style',
    description:
      "Full shampoo, blow dry, and style — no cut. Perfect for a special event, a date night, or anytime you want to look your best without a full trim.",
    includes: ['Shampoo', 'Blow dry', 'Style', 'Product finish'],
    duration: '25 min',
    image: '/images/mens-cut-pov-01.webp',
  },
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