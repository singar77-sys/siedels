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
export const EMAIL = 'siedelsbarbershop@gmail.com';
export const EMAIL_HREF = 'mailto:siedelsbarbershop@gmail.com';
export const FACEBOOK_URL = 'https://www.facebook.com/siedelsbarbershop';
export const INSTAGRAM_URL = 'https://www.instagram.com/siedels';

export interface TeamMember {
  name: string;
  title: string;
  image: string;
  booking: string;
  bio?: string;
}

export const team: TeamMember[] = [
  {
    name: 'Jim LaMarca',
    title: 'Master Barber · 31 Years',
    image: '/images/jim-lamarca-master-barber-siedels-medina.webp',
    booking: sq('wx9txuouu9ti8w'),
    bio: "Behind the chair since 1995. Cappo of Siedel's and the face you'll see when you walk in. Bass player of Chimaira. Yes, that Chimaira. Specializes in bald fades and kids' cuts. Cleveland sports diehard and family man. Probably cracking jokes before the cape's even on.",
  },
  {
    name: 'Pierre Wright',
    title: 'Master Barber',
    image: '/images/pierre-wright-master-barber-siedels-medina.webp',
    booking: sq('mbwa7epvxqp3ya'),
    bio: "26 years behind the chair. Barber school graduate, class of 2003. Man of faith. Specializes in fades, designs, and classic cuts with precision — keeping every customer clean with a feeling of greatness.",
  },
  {
    name: 'Matt Hayes',
    title: 'Master Barber · 7 Years',
    image: '/images/matt-hayes-barber-siedels-medina.webp',
    booking: sq('ub0ju8v1q1926j'),
    bio: "Licensed barber for 7 years. Trained at LaBarberia in Mayfield. Specializes in clean fades, simple cuts, and hot towel face shaves. Big fan of horror and comedy movies, loves dropping '80s and '90s references, and passionate about music. Here to keep you looking sharp.",
  },
  {
    name: 'Ticia Husak',
    title: 'Master Stylist · 16 Years',
    image: '/images/ticia-husak-stylist-siedels-medina.webp',
    booking: sq('xa1g2bceso9izn'),
    bio: "16+ years behind the chair. Specializes in clipper, scissor, and foil cuts — keeping everything clean, sharp, and on point. Takes pride in her work and making sure every client leaves smiling. Wife, mom of two boys, and a registered nurse. When she's not at work, she's in the gym or spending time with her family.",
  },
  {
    name: 'Krista Foecking',
    title: 'Stylist · 26 Years',
    image: '/images/krista-foecking-stylist-siedels-medina.webp',
    booking: sq('h3ib29fkvqykvx'),
    bio: "26 years cutting hair. Polaris Career Center graduate. Specializes in men's fades and kids' cuts — keeping both still and happy is its own skill. Wife and mother of two. Cheer coach for her daughter. When the weather's right, she's in the garden or checking on the bees.",
  },
  {
    name: 'Patrick Muranko',
    title: 'Barber · 4 Years',
    image: '/images/patrick-muranko-barber-siedels-medina.webp',
    booking: sq('x9bbe05slxw75e'),
    bio: "Akron Barber College graduate. Four years in the chair. Originally from Parma, now in Medina. Veteran, husband, father of two daughters. When he's not here, he's at gymnastics meets, playing retro video games, or arguing about 90s wrestling.",
  },
  {
    name: 'Will Dillon',
    title: 'Barber · 10 Years',
    image: '/images/will-dillon-barber-siedels-medina.webp',
    booking: sq('licxdz52l4jryx'),
    bio: "Originally from Wheeling, WV. Moved to Medina at 7, came up through Medina City Schools. Hope Valley Barber College graduate with 10 years behind the chair. Clipper cuts, designs, tight fades, tapers, beard shaping, razor lineups, hot towel shaves — that's the wheelhouse. Father of three boys. Pittsburgh sports diehard, especially the Steelers. Off the clock: fishing, coaching basketball, and keeping up with three kids.",
  },
  {
    name: 'Shannon Hadick',
    title: 'Master Barber · 9 Years',
    image: '/images/shannon-hadick-barber-siedels-medina.webp',
    booking: sq('0lh9o00vt6or3u'),
    bio: "Over 9 years of experience. Specializes in men's and women's cuts. Three years in the area, almost two at Siedel's. Managed a shop before coming here. Looks forward to helping you look your very best.",
  },
  {
    name: 'Chris Hodge',
    title: 'Barber · 4 Years',
    image: '/images/chris-hodge-barber-siedels-medina.webp',
    booking: sq('taz4mvu6g9k73n'),
    bio: "Four years behind the chair. Strongest with taper fades — that's the wheelhouse. Off the clock: fishing, riding his motorcycle, hiking, and driving semi-trucks.",
  },
  {
    name: 'Billy Rodriguez',
    title: 'Barber',
    image: '/images/billy-rodriguez-barber-siedels-medina.webp',
    booking: sq('e957m1qmqqdevp'),
    bio: "Over 15 years of experience specializing in clean, sharp cuts — from classic short styles to modern fades, flattops, and tapers. Coaches his kids' sports teams. Die-hard Cleveland sports fan.",
  },
  {
    name: 'Sam Sickle',
    title: 'Barber · 5 Years',
    image: '/images/sam-sickle-barber-siedels-medina.webp',
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
    image: '/images/mens-haircut-scissors-siedels-medina.webp',
  },
  {
    name: 'Razor / Foil Fade',
    price: '$38',
    tagline: 'Zero-gap precision',
    description:
      "Our sharpest fade work. Built with foil shavers and a straight razor for a crisp, skin-tight blend and a razor-defined lineup. Ideal for bald fades, skin fades, and anyone who wants the cleanest edge in Medina.",
    includes: ['Detailed fade', 'Foil shaver blend', 'Straight razor lineup', 'Shampoo', 'Styling'],
    duration: '45 min',
    image: '/images/fade-haircut-razor-lineup-siedels-medina.webp',
  },
  {
    name: 'Haircut + Beard Trim',
    price: '$42',
    tagline: 'Full overhaul',
    description:
      "Our most popular combo. A complete haircut paired with a full beard shape-up — cheek and neck lines defined, length balanced, and the whole thing finished with hot towel and beard oil. Walk out looking like a different man.",
    includes: ['Full haircut', 'Beard shape + trim', 'Line work', 'Hot towel', 'Beard oil'],
    duration: '45 min',
    image: '/images/beard-trim-clippers-siedels-medina.webp',
  },
  {
    name: 'Haircut + Face Shave',
    price: '$63',
    tagline: 'The full treatment, head to jaw',
    description:
      "A complete haircut paired with a full straight razor face shave. Hot towels, lather, two passes, cold towel finish — the works. Walk out with a fresh cut and the smoothest shave in Medina.",
    includes: ['Full haircut', 'Hot towel prep', 'Straight razor face shave', 'Cold towel finish', 'Aftershave balm'],
    duration: '60 min',
    image: '/images/straight-razor-shave-hot-towel-siedels-medina.webp',
  },
  {
    name: 'Full Service Shave',
    price: '$44',
    tagline: 'The classic straight razor shave',
    description:
      "The full old-school treatment. Warm lather, hot towels, and a straight razor shave done the way barbers have done it for a century. Pre-shave oil, two passes, cold towel finish, and aftershave balm. Worth booking just for the ritual.",
    includes: ['Pre-shave oil', 'Hot towel prep', 'Straight razor — two passes', 'Cold towel finish', 'Aftershave balm'],
    duration: '45 min',
    image: '/images/full-service-straight-razor-shave-siedels-medina.webp',
  },
  {
    name: 'Head Shave',
    price: '$40',
    tagline: 'Skin-smooth, start to finish',
    description:
      "A full head shave with hot towels and a straight razor. Whether you're maintaining a bald look or going for it for the first time, you'll walk out smooth, conditioned, and comfortable. Includes scalp treatment.",
    includes: ['Hot towel prep', 'Straight razor head shave', 'Scalp treatment', 'Aftershave balm'],
    duration: '40 min',
    image: '/images/straight-razor-shave-hot-towel-siedels-medina.webp',
  },
  {
    name: 'Beard Trim',
    price: '$29',
    tagline: 'Shape, define, finish',
    description:
      "Beard shape-up with clean cheek and neck lines, length balancing, and detailing. Finished with hot towel and beard oil. Book this on its own or add it to any haircut.",
    includes: ['Beard shape', 'Cheek + neck lines', 'Length balance', 'Hot towel', 'Beard oil'],
    duration: '20 min',
    image: '/images/beard-trim-scissors-siedels-medina.webp',
  },
  {
    name: 'Shoulder Length Cut + Rough Dry',
    price: '$38',
    tagline: 'Longer styles, dialed in',
    description:
      "Longer men's styles need real shear work. Shampoo, precision cut with scissors, and a rough dry so you can see the shape before you walk out. Ideal for shoulder-length and flow cuts.",
    includes: ['Shampoo', 'Shear cut', 'Rough dry', 'Styling'],
    duration: '40 min',
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
    price: '$96',
    tagline: 'Three at once',
    description:
      "Three haircuts booked together. Great for families with multiple kids, groomsmen before a wedding, or any group that wants to come in together.",
    includes: ['Three full haircuts', 'Coordinated timing'],
    duration: '90 min',
    image: '/images/kids-fade-haircut-siedels-medina.webp',
  },
  {
    name: 'Eyebrow / Lip / Chin',
    price: '$23',
    tagline: 'Detail work',
    description:
      "Precision trimming and shape-up on the eyebrows, upper lip, or chin. Clean, quick, and a huge difference in how your grooming reads. Add it to any other service.",
    includes: ['Detailed shaping', 'Precision trim'],
    duration: '15 min',
    image: '/images/barber-tools-siedels-barbershop-medina.webp',
  },
  {
    name: 'Shampoo',
    price: '$5',
    tagline: 'Add-on',
    description:
      "A proper shampoo and scalp massage. Add it to any haircut or service for a few extra dollars and walk out feeling twice as clean.",
    includes: ['Shampoo', 'Scalp massage', 'Conditioner'],
    duration: '10 min',
    image: '/images/hot-towel-shampoo-siedels-medina.webp',
  },
  {
    name: 'Shampoo + Style',
    price: '$25+',
    tagline: 'Wash, dry, style',
    description:
      "Full shampoo, blow dry, and style — no cut. Perfect for a special event, a date night, or anytime you want to look your best without a full trim.",
    includes: ['Shampoo', 'Blow dry', 'Style', 'Product finish'],
    duration: '25 min',
    image: '/images/mens-haircut-styling-siedels-medina.webp',
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
  {
    name: 'George B.',
    text: "The booking went smoothly. My barber Will did a great job and he was very cordial and professional.",
    barber: 'Will Dillon',
    rating: 5,
  },
  {
    name: 'Arthur D.',
    text: "Sam was really wonderful! Took her time and made my grandson feel comfortable!",
    barber: 'Sam Sickle',
    rating: 5,
  },
  {
    name: 'Scott K.',
    text: "Easy to schedule, Billy always does a great job and very professional.",
    barber: 'Billy Rodriguez',
    rating: 5,
  },
  {
    name: 'Frank K.',
    text: "Great shop, all barbers there are great.",
    rating: 5,
  },
  {
    name: 'Madison M.',
    text: "Great barber and the shop is a good environment also!",
    rating: 5,
  },
  {
    name: 'Jim M.',
    text: "Very nice staff. Quality haircut.",
    rating: 5,
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