// Anime API service using Jikan (MyAnimeList) API
// Documentation: https://jikan.moe/

export interface JikanAnime {
  mal_id: number;
  title: string;
  title_english?: string;
  title_japanese?: string;
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
    webp: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
  };
  type: string;
  source: string;
  episodes: number;
  status: string;
  airing: boolean;
  aired: {
    from: string;
    to: string;
    prop: {
      from: { day: number; month: number; year: number };
      to: { day: number; month: number; year: number };
    };
    string: string;
  };
  duration: string;
  rating: string;
  score: number;
  scored_by: number;
  rank: number;
  popularity: number;
  members: number;
  favorites: number;
  synopsis: string;
  background: string;
  season: string;
  year: number;
  broadcast: {
    day: string;
    time: string;
    timezone: string;
    string: string;
  };
  producers: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
  licensors: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
  studios: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
  genres: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
  explicit_genres: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
  themes: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
  demographics: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
}

export interface JikanSearchResponse {
  data: JikanAnime[];
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
    items: {
      count: number;
      total: number;
      per_page: number;
    };
  };
}

// Convert Jikan API data to our internal Anime interface
export function convertJikanToAnime(jikanAnime: JikanAnime): import('./mockData').Anime {
  return {
    id: `mal-${jikanAnime.mal_id}`,
    title: jikanAnime.title_english || jikanAnime.title,
    synopsis: jikanAnime.synopsis,
    genres: jikanAnime.genres.map(g => g.name),
    studio: jikanAnime.studios[0]?.name,
    year: jikanAnime.year,
    episodes: jikanAnime.episodes,
    status: jikanAnime.status === 'Currently Airing' ? 'ONGOING' : 
            jikanAnime.status === 'Finished Airing' ? 'COMPLETED' : 'ANNOUNCED',
    coverArt: jikanAnime.images.jpg.large_image_url,
    staff: {
      director: undefined, // Not available in basic search
      writer: undefined,
      voiceActors: []
    }
  };
}

// API functions
export async function searchAnime(query: string, page: number = 1, limit: number = 20): Promise<JikanSearchResponse> {
  const response = await fetch(
    `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
  );
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }
  
  return response.json();
}

export async function getTopAnime(page: number = 1, limit: number = 20): Promise<JikanSearchResponse> {
  const response = await fetch(
    `https://api.jikan.moe/v4/top/anime?page=${page}&limit=${limit}`
  );
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }
  
  return response.json();
}

export async function getAnimeById(id: number): Promise<{ data: JikanAnime }> {
  const response = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }
  
  return response.json();
}

export async function getSeasonalAnime(year: number, season: 'winter' | 'spring' | 'summer' | 'fall'): Promise<JikanSearchResponse> {
  const response = await fetch(
    `https://api.jikan.moe/v4/seasons/${year}/${season}`
  );
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }
  
  return response.json();
}
