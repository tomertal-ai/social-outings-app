export interface Venue {
  id: number;
  name: string;
  city: string;
  address: string;
  latitude: number;
  longitude: number;
  initials?: string;
  logo?: any;
  description: string;
  rating: number;
  priceRange: string;
  instagram?: string;
  website?: string;
  ticketLink?: string;
  music: string[];
  minAge: number;
  entryPrice: string;
  capacity: number;
  openDays: string;
  hours: string;
  color: string;
  tags: string[];
}

export const venues: Venue[] = [
  {
    id: 1,
    name: 'The Block',
    city: 'Tel Aviv',
    address: '157 HaAluf David St, Tel Aviv',
    latitude: 32.0538,
    longitude: 34.7620,
    initials: 'TB',
    logo: undefined,
    description: 'Leading techno and house club in Tel Aviv with professional sound and an industrial atmosphere.',
    rating: 4.7,
    priceRange: '₪60-120',
    instagram: 'https://www.instagram.com/theblocktlv/',
    website: 'https://theblock.club',
    ticketLink: '',
    music: ['Techno', 'House'],
    minAge: 21,
    entryPrice: '₪60-120',
    capacity: 800,
    openDays: 'Thu-Sat',
    hours: '23:00 - 06:00',
    color: '#7c3aed',
    tags: ['LGBTQ+ Friendly', 'International DJs', 'Advanced Lighting'],
  },
  {
    id: 2,
    name: 'Haoman 17',
    city: 'Jerusalem',
    address: 'HaOman 17, Jerusalem',
    latitude: 31.7857,
    longitude: 35.2007,
    initials: 'H17',
    logo: undefined,
    description: 'One of the largest and most famous techno clubs in Israel, located in an industrial compound in Jerusalem.',
    rating: 4.5,
    priceRange: '₪80-150',
    instagram: 'https://www.instagram.com/haoman17/',
    website: 'https://haoman17.com',
    ticketLink: '',
    music: ['Techno', 'Psytrance', 'D&B'],
    minAge: 18,
    entryPrice: '₪80-150',
    capacity: 3000,
    openDays: 'Sat',
    hours: '23:30 - 07:00',
    color: '#dc2626',
    tags: ['Biggest in Israel', 'World DJs', 'Outdoor Garden'],
  },
  {
    id: 3,
    name: 'Alphabet',
    city: 'Tel Aviv',
    address: '40 Lilienblum St, Tel Aviv',
    latitude: 32.0637,
    longitude: 34.7710,
    initials: 'A',
    logo: undefined,
    description: 'Intimate bar and club with house, disco, and pop music, plus signature cocktails.',
    rating: 4.3,
    priceRange: '₪50-100',
    instagram: 'https://www.instagram.com/alphabet_tlv/',
    website: '',
    ticketLink: '',
    music: ['House', 'Disco', 'Pop'],
    minAge: 23,
    entryPrice: '₪50-100',
    capacity: 400,
    openDays: 'Wed-Sat',
    hours: '22:00 - 05:00',
    color: '#f59e0b',
    tags: ['Bar + Club', 'Cocktails', 'VIP'],
  },
  {
    id: 4,
    name: 'Roxanne',
    city: "Be'er Sheva",
    address: '12 HaNasi St, Be\'er Sheva',
    latitude: 31.2518,
    longitude: 34.7913,
    initials: 'R',
    logo: undefined,
    description: 'Pop, rock, and electro club in Be\'er Sheva with a young and energetic atmosphere.',
    rating: 3.9,
    priceRange: '₪30-60',
    instagram: 'https://www.instagram.com/roxanne_bs/',
    website: '',
    ticketLink: '',
    music: ['Pop', 'Rock', 'Electro'],
    minAge: 18,
    entryPrice: '₪30-60',
    capacity: 350,
    openDays: 'Thu-Sat',
    hours: '21:00 - 04:00',
    color: '#ec4899',
    tags: ['South Israel', 'Students', 'Fun Vibe'],
  },
  {
    id: 5,
    name: 'Atlanta',
    city: 'Tel Aviv',
    address: 'Address to update — Tel Aviv',
    latitude: 32.0853,
    longitude: 34.7818,
    initials: 'AT',
    logo: undefined,
    description: 'Tel Aviv nightlife venue — full details to be added later.',
    rating: 4.0,
    priceRange: '₪50-100',
    instagram: '',
    website: '',
    ticketLink: '',
    music: ['Pop', 'Electro'],
    minAge: 21,
    entryPrice: '₪50-100',
    capacity: 500,
    openDays: 'Wed-Sat',
    hours: '22:00 - 05:00',
    color: '#0ea5e9',
    tags: ['Tel Aviv Club', 'Mainstream Music'],
  },
];

export function getVenueLogo(venue: Venue): any | undefined {
  return venue.logo;
}

export function getVenueInitials(venue: Venue): string {
  if (venue.initials) return venue.initials;
  return venue.name.slice(0, 2).toUpperCase();
}
