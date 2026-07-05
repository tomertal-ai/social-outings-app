import { useState, useMemo } from 'react';
import { Club } from '../types';

function normalizeText(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, ' ');
}

export function searchClubs(clubList: Club[], query: string): Club[] {
  if (!query || query.trim() === '') return clubList;

  const normalized = normalizeText(query);

  return clubList.filter(club => {
    const searchable = [
      club.name,
      club.city,
      club.address,
      ...club.music,
      ...club.tags,
    ]
      .join(' ')
      .toLowerCase();
    return searchable.includes(normalized);
  });
}

export function useClubSearch(clubList: Club[]) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(
    () => searchClubs(clubList, query),
    [clubList, query]
  );

  const clear = () => setQuery('');

  return {
    query,
    setQuery,
    clear,
    filtered,
  };
}
