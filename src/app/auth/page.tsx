'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import AuthNavbar from '@/components/AuthNavbar';

interface Anime {
  mal_id: number;
  title: string;
  title_english?: string;
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
  };
  genres: Array<{
    mal_id: number;
    type: string;
    name: string;
  }>;
  aired: {
    from: string;
    to?: string;
    prop: {
      from: { day: number; month: number; year: number };
      to: { day: number; month: number; year: number };
    };
  };
  status: string;
  score?: number;
  synopsis?: string;
}

interface JikanResponse {
  data: Anime[];
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

export default function AuthPage() {
  const [moodAnime, setMoodAnime] = useState<Anime[]>([]);
  const [upcomingAnime, setUpcomingAnime] = useState<Anime[]>([]);
  const [reviewAnime, setReviewAnime] = useState<Anime[]>([]);
  const [apiLoading, setApiLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAnimeData = async () => {
      try {
        setApiLoading(true);
        setApiError(null);

        const moodResponse = await fetch('https://api.jikan.moe/v4/top/anime?limit=6');
        const moodData: JikanResponse = await moodResponse.json();
        setMoodAnime(moodData.data);

        const upcomingResponse = await fetch('https://api.jikan.moe/v4/seasons/now?limit=6');
        const upcomingData: JikanResponse = await upcomingResponse.json();
        setUpcomingAnime(upcomingData.data);

        const reviewResponse = await fetch('https://api.jikan.moe/v4/top/anime?filter=bypopularity&limit=3');
        const reviewData: JikanResponse = await reviewResponse.json();
        setReviewAnime(reviewData.data);

      } catch (error) {
        console.error('Error fetching anime data:', error);
        setApiError('Failed to load anime data');
      } finally {
        setApiLoading(false);
      }
    };

    fetchAnimeData();
  }, []);


  return (
    <div className="min-h-screen bg-ink">
      <AuthNavbar />
      
      {/* Hero Section - Manga Style */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-halftone bg-halftone opacity-[0.02]" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink to-ink-light" />
        
        {/* Speed Lines Effect */}
        <div className="absolute inset-0 speed-lines opacity-50" />
        
        {/* Content */}
        <div className="relative z-10 w-full max-w-lg text-center">
          {/* Logo */}
          <div className="mb-8 animate-fade-in">
            <Image 
              src="/images/anidojo-logo.png" 
              alt="AniDojo" 
              width={280}
              height={280}
              className="h-56 w-auto mx-auto"
              priority
            />
          </div>

          {/* Headline */}
          <div className="mb-10 animate-slide-up">
            <h1 className="font-display text-display-lg md:text-display-xl text-cream mb-4">
              WHAT ANIME
            </h1>
            <h2 className="font-display text-display-md md:text-display-lg text-crimson-bright">
              DO YOU WANT TO WATCH?
            </h2>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center animate-slide-up stagger-2">
            <button
              onClick={() => router.push('/signin')}
              className="btn-secondary px-8 py-3"
            >
              Sign In
            </button>
            <button
              onClick={() => router.push('/signup')}
              className="btn-primary px-8 py-3"
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-cream-muted rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-cream-muted rounded-full" />
          </div>
        </div>
      </section>

      {/* Section 2 - Discover Anime */}
      <section className="min-h-screen bg-ink-light py-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="tag tag-crimson mb-4 inline-block">DISCOVER</span>
            <h2 className="font-display text-display-lg text-cream mb-4">
              AMAZING ANIME
            </h2>
            <p className="text-cream-muted text-lg max-w-xl mx-auto">
              Explore top-rated anime and find your next favorite series
            </p>
          </div>
          
          {apiLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-12 h-12 border-2 border-crimson border-t-transparent rounded-full animate-spin" />
            </div>
          ) : apiError ? (
            <div className="text-center py-20">
              <p className="text-crimson-bright text-lg">{apiError}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {moodAnime && moodAnime.length > 0 ? moodAnime.map((anime, index) => (
                <div
                  key={anime.mal_id}
                  className={`manga-panel rounded-md overflow-hidden cursor-pointer group animate-slide-up stagger-${Math.min(index + 1, 6)}`}
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={anime.images.jpg.large_image_url}
                      alt={anime.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Rank Badge */}
                    <div className="absolute top-3 left-3 rank-badge">
                      {index + 1}
                    </div>
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-lg text-cream mb-2 line-clamp-2 group-hover:text-crimson-bright transition-colors">
                      {anime.title_english || anime.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-cream-muted">{anime.genres[0]?.name || 'Anime'}</span>
                      {anime.score && (
                        <span className="text-jade-bright font-medium">★ {anime.score}</span>
                      )}
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-span-full text-center py-20">
                  <p className="text-cream-muted text-lg">No anime data available</p>
                </div>
              )}
            </div>
          )}
          
          <div className="text-center mt-12">
            <button className="btn-primary px-10 py-4">
              Browse All Anime
            </button>
          </div>
        </div>
      </section>

      {/* Section 3 - Anime Lists */}
      <section className="min-h-screen bg-ink py-20 px-6 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-halftone bg-halftone opacity-[0.02]" />
        
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="tag tag-jade mb-4 inline-block">ORGANIZE</span>
            <h2 className="font-display text-display-lg text-cream mb-4">
              YOUR PERFECT LISTS
            </h2>
            <p className="text-cream-muted text-lg max-w-xl mx-auto">
              Organize, track, and share your anime journey with powerful list management tools
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Features */}
            <div className="space-y-8">
              {[
                {
                  title: 'Track Progress',
                  description: 'Monitor your watching progress with episode tracking and completion status',
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  ),
                  color: 'crimson'
                },
                {
                  title: 'Favorites & Ratings',
                  description: 'Rate and mark your favorite anime for easy reference and recommendations',
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  ),
                  color: 'jade'
                },
                {
                  title: 'Share Lists',
                  description: 'Share your curated lists with friends and discover new anime through the community',
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                  ),
                  color: 'crimson'
                }
              ].map((feature, index) => (
                <div key={feature.title} className={`card-editorial py-4 animate-slide-up stagger-${index + 1}`}>
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-sm ${feature.color === 'crimson' ? 'bg-crimson/20 text-crimson-bright' : 'bg-jade/20 text-jade-bright'}`}>
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-display text-xl text-cream mb-2">{feature.title}</h3>
                      <p className="text-cream-muted">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* List Stats Preview */}
            <div className="space-y-4">
              {[
                { name: 'Currently Watching', count: 12, color: 'jade' },
                { name: 'Plan to Watch', count: 47, color: 'crimson' },
                { name: 'Completed', count: 156, color: 'jade' },
                { name: 'Dropped', count: 8, color: 'crimson' }
              ].map((list, index) => (
                <div
                  key={list.name}
                  className={`card p-6 flex items-center justify-between cursor-pointer group animate-slide-up stagger-${index + 1}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-1 h-10 rounded-full ${list.color === 'jade' ? 'bg-jade' : 'bg-crimson'}`} />
                    <h4 className="font-display text-lg text-cream group-hover:text-cream transition-colors">{list.name}</h4>
                  </div>
                  <span className="font-display text-3xl text-cream">{list.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 4 - Currently Airing */}
      <section className="min-h-screen bg-ink-light py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="tag tag-crimson mb-4 inline-block">NOW AIRING</span>
            <h2 className="font-display text-display-lg text-cream mb-4">
              CURRENT SEASON
            </h2>
            <p className="text-cream-muted text-lg max-w-xl mx-auto">
              Stay updated with the latest anime releases
            </p>
          </div>
          
          {apiLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-12 h-12 border-2 border-crimson border-t-transparent rounded-full animate-spin" />
            </div>
          ) : apiError ? (
            <div className="text-center py-20">
              <p className="text-crimson-bright text-lg">{apiError}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingAnime && upcomingAnime.length > 0 ? upcomingAnime.map((anime, index) => (
                <div
                  key={anime.mal_id}
                  className={`card p-5 group cursor-pointer animate-slide-up stagger-${Math.min(index + 1, 6)}`}
                >
                  <div className="relative h-48 mb-4 rounded-sm overflow-hidden">
                    <Image
                      src={anime.images.jpg.large_image_url}
                      alt={anime.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <h3 className="font-display text-lg text-cream mb-2 line-clamp-2 group-hover:text-crimson-bright transition-colors">
                    {anime.title_english || anime.title}
                  </h3>
                  <p className="text-cream-dark text-sm mb-3">
                    {anime.aired.from ? new Date(anime.aired.from).toLocaleDateString() : 'TBA'}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className={`tag ${
                      anime.status === 'Currently Airing' ? 'tag-jade' : 
                      anime.status === 'Finished Airing' ? 'tag-crimson' : 
                      ''
                    }`}>
                      {anime.status}
                    </span>
                    {anime.score && (
                      <span className="text-jade-bright font-medium">★ {anime.score}</span>
                    )}
                  </div>
                </div>
              )) : (
                <div className="col-span-full text-center py-20">
                  <p className="text-cream-muted text-lg">No anime data available</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Section 5 - Community Reviews */}
      <section className="min-h-screen bg-ink py-20 px-6 relative">
        <div className="absolute inset-0 bg-halftone bg-halftone opacity-[0.02]" />
        
        <div className="relative max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="tag tag-jade mb-4 inline-block">COMMUNITY</span>
            <h2 className="font-display text-display-lg text-cream mb-4">
              REVIEWS
            </h2>
            <p className="text-cream-muted text-lg max-w-xl mx-auto">
              Connect with fellow anime fans and share your thoughts
            </p>
          </div>
          
          {apiLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-12 h-12 border-2 border-jade border-t-transparent rounded-full animate-spin" />
            </div>
          ) : apiError ? (
            <div className="text-center py-20">
              <p className="text-crimson-bright text-lg">{apiError}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviewAnime && reviewAnime.length > 0 ? reviewAnime.map((anime, index) => (
                <div
                  key={anime.mal_id}
                  className={`card-feature rounded-md p-6 animate-slide-up stagger-${index + 1}`}
                >
                  <div className="flex items-start gap-6">
                    <div className="w-20 h-28 rounded-sm overflow-hidden flex-shrink-0 relative">
                      <Image
                        src={anime.images.jpg.large_image_url}
                        alt={anime.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-display text-cream">ANIMEFAN{Math.floor(Math.random() * 100)}</span>
                        <span className="text-cream-dark">•</span>
                        <span className="text-jade-bright">{anime.title_english || anime.title}</span>
                      </div>
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor((anime.score || 8) / 2) ? 'text-gold-bright fill-current' : 'text-cream-dark'}`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="text-cream-dark text-sm ml-2">({anime.score || 'N/A'})</span>
                      </div>
                      <p className="text-cream-muted leading-relaxed">
                        {anime.synopsis ? anime.synopsis.substring(0, 180) + '...' : 'This anime is absolutely amazing! The story, characters, and animation are all top-notch.'}
                      </p>
                      <div className="flex items-center gap-6 mt-4">
                        <button className="flex items-center gap-2 text-cream-dark hover:text-jade-bright transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          <span className="text-sm">{Math.floor(Math.random() * 500) + 100}</span>
                        </button>
                        <button className="flex items-center gap-2 text-cream-dark hover:text-jade-bright transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          <span className="text-sm">{Math.floor(Math.random() * 50) + 5} replies</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-20">
                  <p className="text-cream-muted text-lg">No anime data available</p>
                </div>
              )}
            </div>
          )}
          
          <div className="text-center mt-12">
            <button className="btn-secondary px-10 py-4">
              Start Your Journey
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ink border-t border-border-subtle py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-cream-dark text-sm">
            © 2024 AniDojo. All rights reserved. Discover your next favorite anime.
          </p>
        </div>
      </footer>
    </div>
  );
}
