// Anime API service using Jikan (MyAnimeList) API
// Documentation: https://jikan.moe/

// API Rate Limiting Manager
class APIRateLimiter {
  private queue: Array<{
    url: string;
    resolve: (value: any) => void;
    reject: (reason?: any) => void;
  }> = [];
  private processing = false;
  private lastCallTime = 0;
  private minInterval = 350; // 350ms between calls = ~3 per second
  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheExpiry = 5 * 60 * 1000; // 5 minutes

  async call<T>(url: string, useCache = true): Promise<T> {
    // Check cache first
    if (useCache && this.cache.has(url)) {
      const cached = this.cache.get(url)!;
      const age = Date.now() - cached.timestamp;
      if (age < this.cacheExpiry) {
        console.log(`[API Cache] Using cached data for: ${url}`);
        return cached.data as T;
      } else {
        this.cache.delete(url);
      }
    }

    return new Promise((resolve, reject) => {
      this.queue.push({ url, resolve, reject });
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;

    while (this.queue.length > 0) {
      const now = Date.now();
      const timeSinceLastCall = now - this.lastCallTime;

      // Wait if we need to respect rate limit
      if (timeSinceLastCall < this.minInterval) {
        await new Promise(resolve =>
          setTimeout(resolve, this.minInterval - timeSinceLastCall)
        );
      }

      const { url, resolve, reject } = this.queue.shift()!;
      this.lastCallTime = Date.now();

      try {
        const response = await this.fetchWithRetry(url);
        const data = await response.json();
        
        // Cache the result
        this.cache.set(url, { data, timestamp: Date.now() });
        
        resolve(data);
      } catch (error) {
        reject(error);
      }
    }

    this.processing = false;
  }

  private async fetchWithRetry(
    url: string,
    retries = 3,
    backoff = 1000
  ): Promise<Response> {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url);

        // Handle rate limiting
        if (response.status === 429) {
          const waitTime = backoff * Math.pow(2, i);
          console.warn(
            `[API Rate Limited] Waiting ${waitTime}ms before retry ${i + 1}/${retries}`
          );
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`);
        }

        return response;
      } catch (error) {
        if (i === retries - 1) throw error;
        const waitTime = backoff * Math.pow(2, i);
        console.warn(`[API Error] Retrying in ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }

    throw new Error('Max retries exceeded');
  }

  clearCache() {
    this.cache.clear();
  }
}

// Global rate limiter instance
const rateLimiter = new APIRateLimiter();

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

// API functions with rate limiting
export async function searchAnime(query: string, page: number = 1, limit: number = 20): Promise<JikanSearchResponse> {
  const url = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`;
  return rateLimiter.call<JikanSearchResponse>(url);
}

export async function getTopAnime(page: number = 1, limit: number = 20, filter?: string): Promise<JikanSearchResponse> {
  const filterParam = filter ? `&filter=${filter}` : '';
  const url = `https://api.jikan.moe/v4/top/anime?page=${page}&limit=${limit}${filterParam}`;
  return rateLimiter.call<JikanSearchResponse>(url);
}

export async function getAnimeById(id: number): Promise<{ data: JikanAnime }> {
  const url = `https://api.jikan.moe/v4/anime/${id}`;
  return rateLimiter.call<{ data: JikanAnime }>(url);
}

export async function getSeasonalAnime(year: number, season: 'winter' | 'spring' | 'summer' | 'fall', limit?: number): Promise<JikanSearchResponse> {
  const limitParam = limit ? `?limit=${limit}` : '';
  const url = `https://api.jikan.moe/v4/seasons/${year}/${season}${limitParam}`;
  return rateLimiter.call<JikanSearchResponse>(url);
}

export async function getCurrentSeasonAnime(limit?: number): Promise<JikanSearchResponse> {
  const limitParam = limit ? `?limit=${limit}` : '';
  const url = `https://api.jikan.moe/v4/seasons/now${limitParam}`;
  return rateLimiter.call<JikanSearchResponse>(url);
}

// Clear API cache (useful for testing or forcing refresh)
export function clearAPICache() {
  rateLimiter.clearCache();
}
