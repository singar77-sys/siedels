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
}

export const team: TeamMember[] = [
  { name: 'Jim LaMarca', title: 'Master Barber', image: '/images/jim-lamarca.webp', booking: sq('wx9txuouu9ti8w') },
  { name: 'Pierre Wright', title: 'Master Barber', image: '/images/pierre-wright.webp', booking: sq('mbwa7epvxqp3ya') },
  { name: 'Matt Hayes', title: 'Master Barber', image: '/images/matt-hayes.webp', booking: sq('ub0ju8v1q1926j') },
  { name: 'Ticia Husak', title: 'Master Stylist', image: '/images/ticia-husak.webp', booking: sq('xa1g2bceso9izn') },
  { name: 'Krista Foecking', title: 'Stylist', image: '/images/krista-foecking.webp', booking: sq('h3ib29fkvqykvx') },
  { name: 'Patrick Muranko', title: 'Barber', image: '/images/patrick-muranko.webp', booking: sq('x9bbe05slxw75e') },
  { name: 'Will Dillon', title: 'Barber', image: '/images/will-dillon.webp', booking: sq('licxdz52l4jryx') },
  { name: 'Shannon Hadick', title: 'Master Barber', image: '', booking: sq('0lh9o00vt6or3u') },
  { name: 'Chris Hodge', title: 'Barber', image: '/images/chris-hodge.webp', booking: sq('taz4mvu6g9k73n') },
  { name: 'Billy Rodriguez', title: 'Barber', image: '/images/billy-rodriguez.webp', booking: sq('e957m1qmqqdevp') },
  { name: 'Sam Sickle', title: 'Barber', image: '', booking: sq('qj4tfubyvaebvj') },
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
