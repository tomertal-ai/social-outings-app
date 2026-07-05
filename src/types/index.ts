export type VerificationStatus =
  | 'verified'
  | 'needsVerification'
  | 'needs_partner_input';

export interface TicketProvider {
  name: string;
  url: string;
}

export interface Club {
  id: number;
  name: string;
  city: string;
  address: string;
  latitude: number;
  longitude: number;
  initials: string;
  logo?: any;
  description: string;
  rating: number;
  priceRange: string;
  instagram: string;
  website: string;
  ticketLink: string;
  music: string[];
  minAge: number;
  entryPrice: string;
  capacity: number;
  openDays: string;
  hours: string;
  color: string;
  tags: string[];
  requiresTicket: boolean;
  ticketingEvidenceUrl?: string;
  ticketProviderName?: string;
  verificationStatus: VerificationStatus;
}

export interface ClubEvent {
  id: number;
  clubId: number;
  title: string;
  date: string;
  ticketUrl?: string;
  ticketProvider?: TicketProvider;
  description?: string;
  minAge?: number;
  price?: string;
}
