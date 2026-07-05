import { useState, useMemo } from 'react';
import { Venue } from '../data/venues';

function normalizeText(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, ' ');
}

export function searchVenues(venues: Venue[], query: string): Venue[] {
  if (!query || query.trim() === '') return venues;

  const normalized = normalizeText(query);

  return venues.filter(venue => {
    const searchable = [
      venue.name,
      venue.city,
      venue.address,
      ...venue.music,
      ...venue.tags,
    ]
      .join(' ')
      .toLowerCase();
    return searchable.includes(normalized);
  });
}

export function useVenueSearch(venues: Venue[]) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(
    () => searchVenues(venues, query),
    [venues, query]
  );

  const clear = () => setQuery('');

  return {
    query,
    setQuery,
    clear,
    filtered,
  };
}
