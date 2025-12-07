'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import GlobalSearch from '@/components/GlobalSearch';
import { useAuth } from '@/contexts/AuthContext';
import { getTopAnime, getCurrentSeasonAnime } from '@/lib/animeApi';
import { 
  Bell, 
  ChevronDown, 
  Menu, 
  Sparkles,
  Star, 
  User, 
  LogOut,
  Home,
  Search,
  List,
  Calendar,
  Settings,
  X
} from 'lucide-react';

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

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [recommendedAnime, setRecommendedAnime] = useState<Anime[]>([]);
  const [trendingAnime, setTrendingAnime] = useState<Anime[]>([]);
  const [upcomingAnime, setUpcomingAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { signOut } = useAuth();

  useEffect(() => {
    const fetchAnimeData = async () => {
      try {
        setLoading(true);

        try {
          const recommendedData = await getTopAnime(1, 8);
          setRecommendedAnime(recommendedData.data);
        } catch (error) {
          console.error('Error fetching recommended anime:', error);
        }

        try {
          const trendingData = await getTopAnime(1, 10, 'bypopularity');
          setTrendingAnime(trendingData.data);
        } catch (error) {
          console.error('Error fetching trending anime:', error);
        }

        try {
          const upcomingData = await getCurrentSeasonAnime(8);
          setUpcomingAnime(upcomingData.data);
        } catch (error) {
          console.error('Error fetching upcoming anime:', error);
          setUpcomingAnime([]);
        }

      } catch (error) {
        console.error('Error fetching anime data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimeData();
  }, []);

  const handleLogout = async () => {
    await signOut();
    router.push('/signin');
  };

  const sidebarItems = [
    { name: 'Home', icon: Home, href: '/dashboard', active: true },
    { name: 'Search', icon: Search, href: '/search' },
    { name: 'AI Recommender', icon: Sparkles, href: '/discover' },
    { name: 'My Lists', icon: List, href: '/my-lists' },
    { name: 'My Reviews', icon: Star, href: '/my-reviews' },
    { name: 'Upcoming', icon: Calendar, href: '/upcoming' },
    { name: 'Profile', icon: User, href: '/profile' },
    { name: 'Settings', icon: Settings, href: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-ink text-cream w-full overflow-x-hidden">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-ink/95 backdrop-blur-sm border-b border-border-subtle">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-3">
            <Image src="/images/anidojo-logo.png" alt="AniDojo" width={32} height={32} className="h-8 w-auto" />
            <span className="font-display text-xl tracking-wider text-cream">ANIDOJO</span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <GlobalSearch />
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-cream-muted hover:text-cream transition-colors">
              <Bell className="w-5 h-5" />
            </button>

            <div className="hidden md:flex items-center space-x-2 p-2 rounded-sm hover:bg-surface transition-colors cursor-pointer">
              <div className="w-8 h-8 bg-crimson rounded-full flex items-center justify-center">
                <span className="font-display text-sm">U</span>
              </div>
              <span className="text-sm text-cream">User</span>
              <ChevronDown className="w-4 h-4 text-cream-muted" />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 text-cream-muted hover:text-cream transition-colors"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-16 bottom-0 w-64 bg-ink-light border-r border-border-subtle transform transition-transform duration-300 z-40 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}>
        {/* Halftone Pattern */}
        <div className="absolute inset-0 bg-halftone bg-halftone opacity-[0.02] pointer-events-none" />
        
        <nav className="relative p-4 space-y-1">
          {sidebarItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-sm transition-all duration-200 ${
                  item.active
                    ? 'bg-crimson text-cream'
                    : 'text-cream-muted hover:text-cream hover:bg-surface'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            );
          })}
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-sm text-cream-muted hover:text-crimson-bright hover:bg-crimson/10 transition-colors mt-4"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 pt-16 overflow-x-hidden">
        <div className="px-4 sm:px-6 py-6 space-y-10">
          {/* CTA Section */}
          <section className="card-feature rounded-md p-8 text-center">
            <h2 className="font-display text-display-sm text-cream mb-3">START YOUR ANIME JOURNEY</h2>
            <p className="text-cream-muted mb-8 max-w-2xl mx-auto">
              Begin reviewing anime and discover new favorites based on your preferences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/discover"
                className="btn-primary flex items-center space-x-2"
              >
                <Sparkles className="w-5 h-5" />
                <span>DISCOVER ANIME</span>
              </Link>
              <Link 
                href="/profile"
                className="btn-secondary flex items-center space-x-2"
              >
                <User className="w-5 h-5" />
                <span>SET UP PROFILE</span>
              </Link>
            </div>
          </section>

          {/* Recommended Section */}
          <section>
            <div className="section-header">
              <h2 className="font-display text-display-sm">RECOMMENDED FOR YOU</h2>
              <span className="tag tag-jade flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                AI POWERED
              </span>
            </div>
            <p className="text-cream-muted mb-6">Based on your reviews and lists</p>
            
            {loading ? (
              <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-48 card p-4">
                    <div className="aspect-[3/4] mb-3 rounded-sm skeleton"></div>
                    <div className="h-4 skeleton rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
                {recommendedAnime && recommendedAnime.length > 0 ? recommendedAnime.map((anime, index) => (
                  <Link 
                    key={anime.mal_id} 
                    href={`/anime/${anime.mal_id}`} 
                    className={`flex-shrink-0 w-48 manga-panel rounded-sm p-4 cursor-pointer group block animate-slide-up stagger-${Math.min(index + 1, 6)}`}
                  >
                    <div className="aspect-[3/4] mb-3 rounded-sm overflow-hidden relative">
                      <Image
                        src={anime.images.jpg.large_image_url}
                        alt={anime.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="font-medium text-cream line-clamp-2 group-hover:text-crimson-bright transition-colors">
                      {anime.title_english || anime.title}
                    </h3>
                  </Link>
                )) : (
                  <div className="w-full text-center py-20">
                    <p className="text-cream-muted">No anime data available</p>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Trending Section */}
          <section>
            <div className="section-header">
              <h2 className="font-display text-display-sm">TRENDING THIS WEEK</h2>
            </div>
            
            <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
              {trendingAnime && trendingAnime.length > 0 ? trendingAnime.slice(0, 10).map((anime, index) => (
                <Link 
                  key={anime.mal_id} 
                  href={`/anime/${anime.mal_id}`} 
                  className={`flex-shrink-0 w-48 manga-panel rounded-sm p-4 cursor-pointer group relative block animate-slide-up stagger-${Math.min(index + 1, 6)}`}
                >
                  {/* Rank Badge */}
                  <div className="absolute top-2 left-2 z-10 rank-badge text-base">
                    {index + 1}
                  </div>
                  <div className="aspect-[3/4] mb-3 rounded-sm overflow-hidden relative">
                    <Image
                      src={anime.images.jpg.large_image_url}
                      alt={anime.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-medium text-cream line-clamp-2 group-hover:text-crimson-bright transition-colors">
                    {anime.title_english || anime.title}
                  </h3>
                </Link>
              )) : (
                <div className="w-full text-center py-20">
                  <p className="text-cream-muted">No trending anime data available</p>
                </div>
              )}
            </div>
          </section>

          {/* Upcoming Section */}
          <section>
            <div className="section-header">
              <h2 className="font-display text-display-sm">CURRENT SEASON</h2>
            </div>
            
            <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
              {upcomingAnime && upcomingAnime.length > 0 ? upcomingAnime.slice(0, 8).map((anime, index) => (
                <Link 
                  key={anime.mal_id} 
                  href={`/anime/${anime.mal_id}`} 
                  className={`flex-shrink-0 w-48 card rounded-sm p-4 cursor-pointer group block animate-slide-up stagger-${Math.min(index + 1, 6)}`}
                >
                  <div className="aspect-[3/4] mb-3 rounded-sm overflow-hidden relative">
                    <Image
                      src={anime.images.jpg.large_image_url}
                      alt={anime.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-medium text-cream line-clamp-2 group-hover:text-jade-bright transition-colors">
                    {anime.title_english || anime.title}
                  </h3>
                </Link>
              )) : (
                <div className="w-full text-center py-20">
                  <p className="text-cream-muted">No upcoming anime data available</p>
                </div>
              )}
            </div>
          </section>

          {/* Community Reviews Section */}
          <section>
            <div className="section-header">
              <h2 className="font-display text-display-sm">COMMUNITY REVIEWS</h2>
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
                <div key={index} className={`card-feature rounded-md p-6 animate-slide-up stagger-${index + 1}`}>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-jade/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-jade-bright font-display text-lg">{review.avatar}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-display text-cream">{review.user}</h4>
                        <span className="text-cream-dark">•</span>
                        <span className="text-jade-bright font-medium">{review.anime}</span>
                        <span className="text-cream-dark text-sm">•</span>
                        <span className="text-cream-dark text-sm">{review.time}</span>
                      </div>
                      <div className="flex items-center space-x-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? 'text-gold-bright fill-current' : 'text-cream-dark'}`}
                          />
                        ))}
                      </div>
                      <p className="text-cream-muted mb-4 leading-relaxed">{review.review}</p>
                      <div className="flex items-center space-x-6">
                        <button className="flex items-center space-x-2 text-cream-dark hover:text-jade-bright transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          <span className="text-sm">{review.likes}</span>
                        </button>
                        <button className="flex items-center space-x-2 text-cream-dark hover:text-jade-bright transition-colors">
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
          className="fixed inset-0 bg-ink/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
