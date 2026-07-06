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
  nature_parties: 'מסיבות טבע',
  festivals:      'פסטיבלים',
  concerts:       'הופעות',
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
export type LocationStatus = 'fixed' | 'announced' | 'secret' | 'tba';
export type VerificationStatus = 'verified' | 'needs_verification' | 'unverified';

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
  region?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  locationStatus?: LocationStatus;

  // Content
  description: string;
  tags: string[];
  images?: string[];

  // Discovery info
  rating?: number;
  entryPrice?: string;

  // Music / vibe
  musicGenres?: string[];
  amenities?: string[];

  // Schedule (recurring venues)
  openDays?: string;
  hours?: string;

  // Date-based (festivals, concerts, one-off events)
  startDate?: string;
  endDate?: string;

  // Restrictions
  minAge?: number;
  dressCode?: string;

  // Links
  ticketUrl?: string;
  website?: string;
  instagram?: string;

  // Data quality
  verificationStatus: VerificationStatus;
  verificationNotes?: string;
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
