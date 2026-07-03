export interface Venue {
  id: number;
  name: string;
  city: string;
  address: string;
  latitude: number;
  longitude: number;
  logo: any;
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
    city: 'תל אביב',
    address: 'רחוב האלוף דוד 157, תל אביב',
    latitude: 32.0538,
    longitude: 34.7620,
    logo: require('../../assets/venues/logos/the-block.png'),
    description: 'מועדון טכנו והאוס מוביל בתל אביב עם סאונד מקצועי ואווירה אינדוסטריאלית.',
    rating: 4.7,
    priceRange: '₪60-120',
    instagram: 'https://www.instagram.com/theblocktlv/',
    website: 'https://theblock.club',
    ticketLink: '',
    music: ['טכנו', 'האוס'],
    minAge: 21,
    entryPrice: '₪60-120',
    capacity: 800,
    openDays: 'ה׳-ש׳',
    hours: '23:00 - 06:00',
    color: '#7c3aed',
    tags: ['LGBTQ+ Friendly', 'DJ בינלאומי', 'תאורה מתקדמת'],
  },
  {
    id: 2,
    name: 'Haoman 17',
    city: 'ירושלים',
    address: 'רחוב האומן 17, ירושלים',
    latitude: 31.7857,
    longitude: 35.2007,
    logo: require('../../assets/venues/logos/haoman-17.png'),
    description: 'אחד ממועדוני הטכנו הגדולים והמוכרים בישראל, ממוקם במתחם תעשייתי בירושלים.',
    rating: 4.5,
    priceRange: '₪80-150',
    instagram: 'https://www.instagram.com/haoman17/',
    website: 'https://haoman17.com',
    ticketLink: '',
    music: ['טכנו', 'פסיכדלי', 'ד"ב'],
    minAge: 18,
    entryPrice: '₪80-150',
    capacity: 3000,
    openDays: 'ש׳',
    hours: '23:30 - 07:00',
    color: '#dc2626',
    tags: ['הגדול בישראל', 'DJ עולמי', 'גן חיצוני'],
  },
  {
    id: 3,
    name: 'Alphabet',
    city: 'תל אביב',
    address: 'רחוב ליליענבלום 40, תל אביב',
    latitude: 32.0637,
    longitude: 34.7710,
    logo: require('../../assets/venues/logos/alphabet.png'),
    description: 'בר ומועדון אינטימי עם מוזיקת האוס, דיסקו ופופ, וקוקטיילים מיוחדים.',
    rating: 4.3,
    priceRange: '₪50-100',
    instagram: 'https://www.instagram.com/alphabet_tlv/',
    website: '',
    ticketLink: '',
    music: ['האוס', 'דיסקו', 'פופ'],
    minAge: 23,
    entryPrice: '₪50-100',
    capacity: 400,
    openDays: 'ד׳-ש׳',
    hours: '22:00 - 05:00',
    color: '#f59e0b',
    tags: ['בר + קלאב', 'קוקטיילים', 'וי"פ'],
  },
  {
    id: 4,
    name: 'Roxanne',
    city: 'באר שבע',
    address: 'רחוב הנשיא 12, באר שבע',
    latitude: 31.2518,
    longitude: 34.7913,
    logo: require('../../assets/venues/logos/roxanne.png'),
    description: 'מועדון פופ, רוק ואלקטרו בבאר שבע עם אווירה צעירה ואנרגטית.',
    rating: 3.9,
    priceRange: '₪30-60',
    instagram: 'https://www.instagram.com/roxanne_bs/',
    website: '',
    ticketLink: '',
    music: ['פופ', 'רוק', 'אלקטרו'],
    minAge: 18,
    entryPrice: '₪30-60',
    capacity: 350,
    openDays: 'ה׳-ש׳',
    hours: '21:00 - 04:00',
    color: '#ec4899',
    tags: ['דרום ישראל', 'סטודנטים', 'אווירה כיפית'],
  },
  {
    id: 5,
    name: 'Atlanta',
    city: 'תל אביב',
    address: 'כתובת לעדכון — תל אביב',
    latitude: 32.0853,
    longitude: 34.7818,
    logo: require('../../assets/venues/logos/atlanta.png'),
    description: 'מועדון ומקום בילוי בתל אביב — פרטים מלאים יתווספו בהמשך.',
    rating: 4.0,
    priceRange: '₪50-100',
    instagram: '',
    website: '',
    ticketLink: '',
    music: ['פופ', 'אלקטרו'],
    minAge: 21,
    entryPrice: '₪50-100',
    capacity: 500,
    openDays: 'ד׳-ש׳',
    hours: '22:00 - 05:00',
    color: '#0ea5e9',
    tags: ['מועדון תל אביבי', 'מוזיקה מסחרית'],
  },
];

export const placeholderLogo = require('../../assets/venues/logos/placeholder.png');

export function getVenueLogo(venue: Venue): any {
  return venue.logo || placeholderLogo;
}
