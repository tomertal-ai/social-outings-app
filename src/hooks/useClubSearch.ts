import { useState, useMemo } from 'react';
import { Experience } from '../types';

function normalizeText(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, ' ');
}

export function searchExperiences(list: Experience[], query: string): Experience[] {
  if (!query || query.trim() === '') return list;
  const normalized = normalizeText(query);
  return list.filter(e => {
    const searchable = [
      e.name,
      e.city,
      e.address,
      ...(e.musicGenres ?? []),
      ...(e.tags ?? []),
    ]
      .join(' ')
      .toLowerCase();
    return searchable.includes(normalized);
  });
}

export function useExperienceSearch(list: Experience[]) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => searchExperiences(list, query), [list, query]);
  const clear = () => setQuery('');
  return { query, setQuery, clear, filtered };
}

/** @deprecated use useExperienceSearch */
export const useClubSearch = useExperienceSearch;
/** @deprecated use searchExperiences */
export const searchClubs = searchExperiences;
