// ---------------------------------------------------------------------------
// Category
// ---------------------------------------------------------------------------
export type ExperienceCategory =
  | 'clubs'
  | 'nature_parties'
  | 'festivals'
  | 'concerts';

export const CATEGORY_LABELS: Record<ExperienceCategory, string> = {
  clubs:          'מועדונים',
  nature_parties: 'פסטי טבע',
  festivals:      'פסטיבלים',
  concerts:       'קונצרטים',
};

export const CATEGORY_ICONS: Record<ExperienceCategory, string> = {
  clubs:          'musical-notes',
  nature_parties: 'leaf',
  festivals:      'bonfire',
  concerts:       'mic',
};

// ---------------------------------------------------------------------------
// Base Experience — all categories share this
// ---------------------------------------------------------------------------
export interface Experience {
  id: number;
  category: ExperienceCategory;

  // Identity
  name: string;
  initials: string;
  logo?: any;
  color: string;

  // Location
  city: string;
  address: string;
  latitude: number;
  longitude: number;

  // Content
  description: string;
  tags: string[];
  images?: string[];

  // Discovery info
  rating: number;
  entryPrice: string;

  // Music / vibe (optional — not all categories use these)
  musicGenres?: string[];
  amenities?: string[];

  // Schedule (optional)
  openDays?: string;
  hours?: string;

  // Date-based (festivals, concerts)
  startDate?: string;
  endDate?: string;

  // Restrictions
  minAge?: number;
  dressCode?: string;

  // Links
  ticketUrl?: string;
  website?: string;
  instagram?: string;
}

// ---------------------------------------------------------------------------
// Legacy alias — keep for any remaining references during migration
// ---------------------------------------------------------------------------
/** @deprecated Use Experience instead */
export type Club = Experience;

// ---------------------------------------------------------------------------
// Map bounds
// ---------------------------------------------------------------------------
export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}
