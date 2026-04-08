const SQUARE_BASE = 'https://app.squareup.com/appointments/buyer/widget';
const LOCATION = 'LFCOT5CC7MY0S';
const sq = (id: string) => `${SQUARE_BASE}/${id}/${LOCATION}`;

export const SQUARE_BOOKING_URL = `${SQUARE_BASE}/xcru7izyf4zhv6/${LOCATION}`;
export const PHONE = '(330) 952-0777';
export const PHONE_HREF = 'tel:3309520777';
export const ADDRESS = '982 N Court Street';
export const CITY_STATE_ZIP = 'Medina, Ohio 44256';
export const MAPS_URL = 'https://maps.google.com/?q=982+N+Court+Street+Medina+OH+44256';

export interface TeamMember {
  name: string;
  title: string;
  image: string;
  booking: string;
  bio?: string;
}

export const team: TeamMember[] = [
  { name: 'Jim LaMarca', title: 'Master Barber', image: '/images/jim-lamarca.webp', booking: sq('wx9txuouu9ti8w') },
  { name: 'Pierre Wright', title: 'Master Barber', image: '/images/pierre-wright.webp', booking: sq('mbwa7epvxqp3ya') },
  { name: 'Matt Hayes', title: 'Master Barber', image: '/images/matt-hayes.webp', booking: sq('ub0ju8v1q1926j') },
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
  { name: 'Shannon Hadick', title: 'Master Barber', image: '', booking: sq('0lh9o00vt6or3u') },
  { name: 'Chris Hodge', title: 'Barber', image: '/images/chris-hodge.webp', booking: sq('taz4mvu6g9k73n') },
  { name: 'Billy Rodriguez', title: 'Barber', image: '/images/billy-rodriguez.webp', booking: sq('e957m1qmqqdevp') },
  {
    name: 'Sam Sickle',
    title: 'Barber · 5 Years',
    image: '',
    booking: sq('qj4tfubyvaebvj'),
    bio: "Grew up in Litchfield, Ohio. Five years cutting, three of them at Siedel's. Strongest with men's clipper cuts and longer styles that need real shear work. Proud owner of two dogs (Preston and Scout), two cats, and nine hens. Yeah, nine.",
  },
];

export const services = [
  { name: 'Haircut', price: '$32' },
  { name: 'Razor / Foil Fade', price: '$38' },
  { name: 'Haircut + Beard Trim', price: '$42' },
  { name: 'Full Service Shave', price: '$44' },
  { name: 'Head Shave', price: '$40' },
  { name: 'Beard Trim', price: '$29' },
  { name: 'Shoulder Length Cut + Rough Dry', price: '$38' },
  { name: 'Duo Haircut', price: '$64' },
  { name: 'Trio Haircut', price: '$96' },
  { name: 'Eyebrow / Lip / Chin', price: '$23' },
  { name: 'Shampoo', price: '$5' },
  { name: 'Shampoo + Style', price: '$25+' },
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

export const CLOSING_HOURS: Record<number, number | null> = {
  1: 20, 2: 18, 3: 18, 4: 20, 5: 18, 6: 15, 0: null,
};
