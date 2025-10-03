'use client';

import { useState, useEffect } from 'react';
import { searchAnime, getTopAnime, getSeasonalAnime, convertJikanToAnime, JikanSearchResponse } from '@/lib/animeApi';
import { Anime } from '@/lib/mockData';

export function useAnimeSearch(query: string, page: number = 1) {
  const [data, setData] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setData([]);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response: JikanSearchResponse = await searchAnime(query, page);
        const animeData = response.data.map(convertJikanToAnime);
        
        setData(animeData);
        setHasNextPage(response.pagination.has_next_page);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch anime data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query, page]);

  return { data, loading, error, hasNextPage };
}

export function useTopAnime(page: number = 1) {
  const [data, setData] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response: JikanSearchResponse = await getTopAnime(page);
        const animeData = response.data.map(convertJikanToAnime);
        
        setData(animeData);
        setHasNextPage(response.pagination.has_next_page);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch anime data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  return { data, loading, error, hasNextPage };
}

export function useSeasonalAnime(year: number, season: 'winter' | 'spring' | 'summer' | 'fall') {
  const [data, setData] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response: JikanSearchResponse = await getSeasonalAnime(year, season);
        const animeData = response.data.map(convertJikanToAnime);
        
        setData(animeData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch seasonal anime data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year, season]);

  return { data, loading, error };
}
