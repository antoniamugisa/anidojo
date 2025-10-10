'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthNavbar from '@/components/AuthNavbar';

// Types for Jikan API responses
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
  const [loading, setLoading] = useState(false);
  const [moodAnime, setMoodAnime] = useState<Anime[]>([]);
  const [upcomingAnime, setUpcomingAnime] = useState<Anime[]>([]);
  const [reviewAnime, setReviewAnime] = useState<Anime[]>([]);
  const [apiLoading, setApiLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch anime data from Jikan API
  useEffect(() => {
    const fetchAnimeData = async () => {
      try {
        setApiLoading(true);
        setApiError(null);

        // Fetch anime for mood categories (popular anime)
        const moodResponse = await fetch('https://api.jikan.moe/v4/top/anime?limit=6');
        const moodData: JikanResponse = await moodResponse.json();
        setMoodAnime(moodData.data);

        // Fetch upcoming/airing anime
        const upcomingResponse = await fetch('https://api.jikan.moe/v4/seasons/now?limit=6');
        const upcomingData: JikanResponse = await upcomingResponse.json();
        setUpcomingAnime(upcomingData.data);

        // Fetch anime for reviews (highly rated)
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
    <div className="min-h-screen relative bg-black">
      {/* Navigation Bar */}
      <AuthNavbar />
      
      {/* Main Content - Centered */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          {/* Logo */}
          <div className="mb-8">
            <img 
              src="/images/anidojo-logo.png" 
              alt="AniDojo" 
              className="h-64 w-auto mx-auto"
            />
          </div>

          {/* Main Slogan */}
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">
              What Anime do You Want to Watch?
            </h2>
          </div>

          {/* Call to Action Buttons */}
          <div className="flex gap-3 justify-center">
            <button
              onClick={async (e) => {
                e.preventDefault();
                setLoading(true);
                // Simulate sign in
                await new Promise(resolve => setTimeout(resolve, 1000));
                router.push('/');
              }}
              disabled={loading}
              className="bg-transparent border border-red-500/50 hover:bg-red-500/10 text-white font-bold py-3 px-6 rounded-lg text-base transition-colors duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            <button
              onClick={async (e) => {
                e.preventDefault();
                setLoading(true);
                // Simulate account creation
                await new Promise(resolve => setTimeout(resolve, 1000));
                router.push('/');
              }}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg text-base transition-colors duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </div>
        </div>
      </div>

      {/* Section 2 - Anime Recommendations */}
      <section className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900/20 to-slate-800 flex items-center justify-center px-6 py-20">
        <div className="max-w-6xl w-full">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              Discover Amazing Anime
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Explore top-rated anime and find your next favorite series
            </p>
          </div>
          
          {apiLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
            </div>
          ) : apiError ? (
            <div className="text-center py-20">
              <p className="text-red-400 text-lg">{apiError}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {moodAnime.map((anime, index) => (
                <div
                  key={anime.mal_id}
                  className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-red-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-green-500/20 opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
                  <div className="relative p-6">
                    <div className="aspect-[3/4] mb-4 rounded-lg overflow-hidden">
                      <img
                        src={anime.images.jpg.large_image_url}
                        alt={anime.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-red-400 transition-colors">
                      {anime.title_english || anime.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>{anime.genres[0]?.name || 'Anime'}</span>
                      {anime.score && (
                        <span className="text-green-400 font-semibold">★ {anime.score}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-8">
            <button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
              Browse All Anime
            </button>
          </div>
        </div>
      </section>

      {/* Section 3 - Anime Lists */}
      <section className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900/20 to-slate-800 flex items-center justify-center px-6 py-20">
        <div className="max-w-6xl w-full">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              Create Your Perfect Anime Lists
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Organize, track, and share your anime journey with powerful list management tools
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Features */}
            <div className="space-y-10">
              <div className="flex items-start space-x-6">
                <div className="w-14 h-14 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">Track Progress</h3>
                  <p className="text-gray-300 text-lg leading-relaxed">Monitor your watching progress with episode tracking and completion status</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-6">
                <div className="w-14 h-14 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">Favorites & Ratings</h3>
                  <p className="text-gray-300 text-lg leading-relaxed">Rate and mark your favorite anime for easy reference and recommendations</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-6">
                <div className="w-14 h-14 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">Share Lists</h3>
                  <p className="text-gray-300 text-lg leading-relaxed">Share your curated lists with friends and discover new anime through the community</p>
                </div>
              </div>
            </div>
            
            {/* Right side - Example Lists */}
            <div className="space-y-6">
              {[
                { name: 'Currently Watching', count: 12, color: 'green', bgColor: 'bg-green-500/20', borderColor: 'border-green-500/30' },
                { name: 'Plan to Watch', count: 47, color: 'red', bgColor: 'bg-red-500/20', borderColor: 'border-red-500/30' },
                { name: 'Completed', count: 156, color: 'green', bgColor: 'bg-green-600/20', borderColor: 'border-green-600/30' },
                { name: 'Dropped', count: 8, color: 'red', bgColor: 'bg-red-600/20', borderColor: 'border-red-600/30' }
              ].map((list, index) => (
                <div
                  key={index}
                  className={`${list.bgColor} ${list.borderColor} border backdrop-blur-sm rounded-xl p-8 hover:scale-105 transition-all duration-300 cursor-pointer`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xl font-semibold text-white">{list.name}</h4>
                    <span className="text-3xl font-bold text-white">{list.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 4 - Upcoming Releases */}
      <section className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900/20 to-slate-800 flex items-center justify-center px-6 py-20">
        <div className="max-w-6xl w-full">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              Currently Airing Anime
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Stay updated with the latest anime releases and never miss your most anticipated shows
            </p>
          </div>
          
          {apiLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
            </div>
          ) : apiError ? (
            <div className="text-center py-20">
              <p className="text-red-400 text-lg">{apiError}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingAnime.map((anime, index) => (
                <div
                  key={anime.mal_id}
                  className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 hover:border-red-500/50 hover:scale-105 transition-all duration-300 cursor-pointer"
                >
                  <div className="w-full h-48 rounded-lg mb-6 overflow-hidden">
                    <img
                      src={anime.images.jpg.large_image_url}
                      alt={anime.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors leading-tight line-clamp-2">
                    {anime.title_english || anime.title}
                  </h3>
                  <p className="text-gray-400 text-base mb-4">
                    {anime.aired.from ? new Date(anime.aired.from).toLocaleDateString() : 'TBA'}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold text-white ${
                      anime.status === 'Currently Airing' ? 'bg-green-500' : 
                      anime.status === 'Finished Airing' ? 'bg-red-500' : 
                      'bg-gray-500'
                    }`}>
                      {anime.status}
                    </span>
                    {anime.score && (
                      <span className="text-green-400 font-semibold">★ {anime.score}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Section 5 - Community Reviews */}
      <section className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900/20 to-slate-800 flex items-center justify-center px-6 py-20">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              Community Reviews
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Connect with fellow anime fans and share your thoughts on the shows you love
            </p>
          </div>
          
          {apiLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
          ) : apiError ? (
            <div className="text-center py-20">
              <p className="text-red-400 text-lg">{apiError}</p>
            </div>
          ) : (
            <div className="space-y-10 mb-16">
              {reviewAnime.map((anime, index) => (
                <div
                  key={anime.mal_id}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 hover:border-green-500/50 transition-all duration-300"
                >
                  <div className="flex items-start space-x-6">
                    <div className="w-24 h-32 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={anime.images.jpg.large_image_url}
                        alt={anime.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h4 className="text-lg font-semibold text-white">AnimeFan{Math.floor(Math.random() * 100)}</h4>
                        <span className="text-gray-400">•</span>
                        <span className="text-green-400 font-medium text-lg">{anime.title_english || anime.title}</span>
                      </div>
                      <div className="flex items-center space-x-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-5 h-5 ${i < Math.floor((anime.score || 8) / 2) ? 'text-yellow-400' : 'text-gray-600'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="text-gray-400 ml-2">({anime.score || 'N/A'})</span>
                      </div>
                      <p className="text-gray-300 mb-6 leading-relaxed text-lg">
                        {anime.synopsis ? anime.synopsis.substring(0, 200) + '...' : 'This anime is absolutely amazing! The story, characters, and animation are all top-notch. Highly recommended for any anime fan.'}
                      </p>
                      <div className="flex items-center space-x-8">
                        <button className="flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          <span className="text-base">{Math.floor(Math.random() * 500) + 100}</span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          <span className="text-base">{Math.floor(Math.random() * 50) + 5} replies</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-8">
            <button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
              Start Your Anime Journey
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-white/10 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-gray-400">
            © 2024 AniDojo. All rights reserved. Discover your next favorite anime.
          </p>
        </div>
      </footer>
    </div>
  );
}
