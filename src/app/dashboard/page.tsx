'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
  episodes?: number;
  type?: string;
  year?: number;
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

// Mock user data for continue watching
const mockContinueWatching = [
  { anime_id: 1, title: 'Attack on Titan', episode: 5, total_episodes: 12, progress: 42 },
  { anime_id: 2, title: 'Demon Slayer', episode: 8, total_episodes: 26, progress: 31 },
  { anime_id: 3, title: 'One Piece', episode: 1050, total_episodes: 1100, progress: 95 },
  { anime_id: 4, title: 'Jujutsu Kaisen', episode: 2, total_episodes: 24, progress: 8 },
];

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [recommendedAnime, setRecommendedAnime] = useState<Anime[]>([]);
  const [trendingAnime, setTrendingAnime] = useState<Anime[]>([]);
  const [upcomingAnime, setUpcomingAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  // Mock authentication check
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      router.push('/signin');
    }
  }, [router]);

  // Fetch anime data
  useEffect(() => {
    const fetchAnimeData = async () => {
      try {
        setLoading(true);

        // Fetch recommended anime (top rated)
        const recommendedResponse = await fetch('https://api.jikan.moe/v4/top/anime?limit=8');
        const recommendedData: JikanResponse = await recommendedResponse.json();
        setRecommendedAnime(recommendedData.data);

        // Fetch trending anime (most popular)
        const trendingResponse = await fetch('https://api.jikan.moe/v4/top/anime?filter=bypopularity&limit=10');
        const trendingData: JikanResponse = await trendingResponse.json();
        setTrendingAnime(trendingData.data);

        // Fetch upcoming anime (currently airing)
        const upcomingResponse = await fetch('https://api.jikan.moe/v4/seasons/now?limit=8');
        const upcomingData: JikanResponse = await upcomingResponse.json();
        setUpcomingAnime(upcomingData.data);

      } catch (error) {
        console.error('Error fetching anime data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimeData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    router.push('/signin');
  };

  const sidebarItems = [
    { name: 'Home', icon: '🏠', href: '/dashboard', active: true },
    { name: 'Discover', icon: '🧭', href: '/discover' },
    { name: 'My Lists', icon: '📋', href: '/lists' },
    { name: 'Upcoming', icon: '📅', href: '/upcoming' },
    { name: 'Reviews', icon: '⭐', href: '/reviews' },
    { name: 'Profile', icon: '👤', href: '/profile' },
    { name: 'Settings', icon: '⚙️', href: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-2">
            <img src="/images/anidojo-logo.png" alt="AniDojo" className="h-8 w-auto" />
            <span className="text-xl font-bold text-white">AniDojo</span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search anime..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 pr-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-200"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 0 0-15 0v5h5l-5 5-5-5h5V7a7.5 7.5 0 0 1 15 0v10z" />
              </svg>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/10 transition-colors">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold">U</span>
                </div>
                <span className="text-sm">User</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-16 bottom-0 w-64 bg-black/95 backdrop-blur-sm border-r border-white/10 transform transition-transform duration-300 z-40 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}>
        <nav className="p-6 space-y-2">
          {sidebarItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                item.active
                  ? 'bg-red-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <span className="text-xl">🚪</span>
            <span className="font-medium">Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 pt-16">
        <div className="p-6 space-y-8">
          {/* Continue Watching Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Continue Watching</h2>
              <button className="text-green-400 hover:text-green-300 transition-colors">
                View All
              </button>
            </div>
            
            <div className="flex space-x-4 overflow-x-auto pb-4">
              {mockContinueWatching.map((item) => (
                <div key={item.anime_id} className="flex-shrink-0 w-64 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:border-red-500/50 transition-all duration-300 cursor-pointer group">
                  <div className="aspect-[3/4] mb-3 rounded-lg overflow-hidden bg-gray-800">
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl">🎌</span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-white mb-2 line-clamp-2">{item.title}</h3>
                  <p className="text-sm text-gray-400 mb-3">Ep {item.episode}/{item.total_episodes}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Progress</span>
                      <span>{item.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${item.progress >= 80 ? 'bg-green-500' : 'bg-red-500'}`}
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recommended For You Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Recommended For You</h2>
              <button className="text-green-400 hover:text-green-300 transition-colors">
                View All
              </button>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 animate-pulse">
                    <div className="aspect-[3/4] mb-3 rounded-lg bg-gray-700"></div>
                    <div className="h-4 bg-gray-700 rounded mb-2"></div>
                    <div className="h-3 bg-gray-700 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
              {recommendedAnime && recommendedAnime.length > 0 ? recommendedAnime.map((anime) => (
                  <div key={anime.mal_id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:border-red-500/50 transition-all duration-300 cursor-pointer group">
                    <div className="aspect-[3/4] mb-3 rounded-lg overflow-hidden">
                      <img
                        src={anime.images.jpg.large_image_url}
                        alt={anime.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-red-400 transition-colors">
                      {anime.title_english || anime.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">{anime.genres[0]?.name || 'Anime'}</span>
                      {anime.score && (
                        <span className="text-green-400 font-semibold">★ {anime.score}</span>
                      )}
                    </div>
                    <button className="w-full mt-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors">
                      Add to List
                    </button>
                  </div>
                )) : (
                  <div className="col-span-full text-center py-20">
                    <p className="text-gray-400 text-lg">No anime data available</p>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Trending This Week Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Trending This Week</h2>
              <button className="text-green-400 hover:text-green-300 transition-colors">
                View All
              </button>
            </div>
            
            <div className="flex space-x-4 overflow-x-auto pb-4">
              {trendingAnime && trendingAnime.length > 0 ? trendingAnime.slice(0, 10).map((anime, index) => (
                <div key={anime.mal_id} className="flex-shrink-0 w-48 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:border-red-500/50 transition-all duration-300 cursor-pointer group relative">
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="aspect-[3/4] mb-3 rounded-lg overflow-hidden">
                    <img
                      src={anime.images.jpg.large_image_url}
                      alt={anime.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-red-400 transition-colors">
                    {anime.title_english || anime.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">{anime.genres[0]?.name || 'Anime'}</span>
                    {anime.score && (
                      <span className="text-green-400 font-semibold">★ {anime.score}</span>
                    )}
                  </div>
                </div>
              )) : (
                <div className="flex-shrink-0 w-full text-center py-20">
                  <p className="text-gray-400 text-lg">No trending anime data available</p>
                </div>
              )}
            </div>
          </section>

          {/* Upcoming Releases Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Upcoming Releases</h2>
              <button className="text-green-400 hover:text-green-300 transition-colors">
                View All
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {upcomingAnime && upcomingAnime.length > 0 ? upcomingAnime.slice(0, 8).map((anime) => (
                <div key={anime.mal_id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:border-green-500/50 transition-all duration-300 cursor-pointer group">
                  <div className="aspect-[3/4] mb-3 rounded-lg overflow-hidden">
                    <img
                      src={anime.images.jpg.large_image_url}
                      alt={anime.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-green-400 transition-colors">
                    {anime.title_english || anime.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-3">
                    {anime.aired.from ? new Date(anime.aired.from).toLocaleDateString() : 'TBA'}
                  </p>
                  <button className="w-full py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors">
                    Notify Me
                  </button>
                </div>
              )) : (
                <div className="col-span-full text-center py-20">
                  <p className="text-gray-400 text-lg">No upcoming anime data available</p>
                </div>
              )}
            </div>
          </section>

          {/* Recent Reviews Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Recent Reviews from Community</h2>
              <button className="text-green-400 hover:text-green-300 transition-colors">
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {[
                {
                  user: 'AnimeFan92',
                  avatar: 'A',
                  anime: 'Attack on Titan',
                  rating: 5,
                  review: 'This anime completely changed my perspective on storytelling. The character development is phenomenal and the plot twists are mind-blowing.',
                  likes: 247,
                  comments: 12,
                  time: '2 hours ago'
                },
                {
                  user: 'MangaReader',
                  avatar: 'M',
                  anime: 'Demon Slayer',
                  rating: 4,
                  review: 'The animation quality is absolutely stunning! While the story follows some typical shonen tropes, the execution is flawless.',
                  likes: 189,
                  comments: 8,
                  time: '5 hours ago'
                },
                {
                  user: 'SliceOfLifeLover',
                  avatar: 'S',
                  anime: 'Your Name',
                  rating: 5,
                  review: 'A beautiful blend of romance, fantasy, and time travel. The emotional depth and visual storytelling are incredible.',
                  likes: 312,
                  comments: 15,
                  time: '1 day ago'
                }
              ].map((review, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-green-500/50 transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-green-400 font-bold text-lg">{review.avatar}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-white">{review.user}</h4>
                        <span className="text-gray-400">•</span>
                        <span className="text-green-400 font-medium">{review.anime}</span>
                        <span className="text-gray-400 text-sm">•</span>
                        <span className="text-gray-400 text-sm">{review.time}</span>
                      </div>
                      <div className="flex items-center space-x-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-600'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-gray-300 mb-4 leading-relaxed">{review.review}</p>
                      <div className="flex items-center space-x-6">
                        <button className="flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          <span className="text-sm">{review.likes}</span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          <span className="text-sm">{review.comments} comments</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
