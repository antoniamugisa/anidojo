'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthNavbar from '@/components/AuthNavbar';

export default function AuthPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();


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
              className="bg-transparent border border-white/30 hover:bg-white/10 text-white font-bold py-3 px-6 rounded-lg text-base transition-colors duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-base transition-colors duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </div>
        </div>
      </div>

      {/* Section 2 - AI Mood Recommender */}
      <section className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-800 flex items-center justify-center px-6">
        <div className="max-w-6xl w-full">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Anime That Matches Your Mood
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Discover your next favorite anime with AI-powered recommendations tailored to how you're feeling
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
              { emoji: '🔥', mood: 'Excited', desc: 'Action-packed shonen adventures', gradient: 'from-red-500 to-orange-500' },
              { emoji: '😌', mood: 'Relaxed', desc: 'Gentle slice-of-life stories', gradient: 'from-green-400 to-blue-500' },
              { emoji: '🤔', mood: 'Curious', desc: 'Mind-bending mysteries & thrillers', gradient: 'from-purple-500 to-pink-500' },
              { emoji: '💭', mood: 'Nostalgic', desc: 'Timeless classics & old favorites', gradient: 'from-yellow-500 to-orange-500' },
              { emoji: '💕', mood: 'Romantic', desc: 'Heartwarming love stories', gradient: 'from-pink-500 to-red-500' },
              { emoji: '⚔️', mood: 'Adventurous', desc: 'Epic fantasy & isekai worlds', gradient: 'from-blue-500 to-purple-500' }
            ].map((category, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-300`} />
                <div className="relative p-8 text-center">
                  <div className="text-4xl mb-4">{category.emoji}</div>
                  <h3 className="text-2xl font-bold text-white mb-3">{category.mood}</h3>
                  <p className="text-gray-300">{category.desc}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
              Try AI Recommender
            </button>
          </div>
        </div>
      </section>

      {/* Section 3 - Anime Lists */}
      <section className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-800 flex items-center justify-center px-6">
        <div className="max-w-6xl w-full">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Create Your Perfect Anime Lists
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Organize, track, and share your anime journey with powerful list management tools
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Features */}
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Track Progress</h3>
                  <p className="text-gray-300">Monitor your watching progress with episode tracking and completion status</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Favorites & Ratings</h3>
                  <p className="text-gray-300">Rate and mark your favorite anime for easy reference and recommendations</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Share Lists</h3>
                  <p className="text-gray-300">Share your curated lists with friends and discover new anime through the community</p>
                </div>
              </div>
            </div>
            
            {/* Right side - Example Lists */}
            <div className="space-y-4">
              {[
                { name: 'Currently Watching', count: 12, color: 'green', bgColor: 'bg-green-500/20', borderColor: 'border-green-500/30' },
                { name: 'Plan to Watch', count: 47, color: 'blue', bgColor: 'bg-blue-500/20', borderColor: 'border-blue-500/30' },
                { name: 'Completed', count: 156, color: 'purple', bgColor: 'bg-purple-500/20', borderColor: 'border-purple-500/30' },
                { name: 'Dropped', count: 8, color: 'red', bgColor: 'bg-red-500/20', borderColor: 'border-red-500/30' }
              ].map((list, index) => (
                <div
                  key={index}
                  className={`${list.bgColor} ${list.borderColor} border backdrop-blur-sm rounded-xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-white">{list.name}</h4>
                    <span className="text-2xl font-bold text-white">{list.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 4 - Upcoming Releases */}
      <section className="min-h-screen bg-gradient-to-br from-slate-900 via-pink-900/20 to-slate-800 flex items-center justify-center px-6">
        <div className="max-w-6xl w-full">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Never Miss a Release
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Stay updated with the latest anime releases and never miss your most anticipated shows
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Attack on Titan: Final Season Part 3', date: 'March 4, 2024', status: 'Airing Soon', statusColor: 'bg-green-500' },
              { title: 'Demon Slayer: Hashira Training Arc', date: 'April 2024', status: 'Coming Soon', statusColor: 'bg-blue-500' },
              { title: 'One Piece: Wano Country Finale', date: 'May 2024', status: 'Confirmed', statusColor: 'bg-purple-500' },
              { title: 'My Hero Academia Season 7', date: 'Summer 2024', status: 'In Production', statusColor: 'bg-yellow-500' },
              { title: 'Jujutsu Kaisen Season 3', date: 'Fall 2024', status: 'Announced', statusColor: 'bg-pink-500' },
              { title: 'Chainsaw Man Part 2', date: 'TBA 2024', status: 'Announced', statusColor: 'bg-pink-500' }
            ].map((anime, index) => (
              <div
                key={index}
                className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-white/20 hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className="w-full h-32 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-4xl">🎌</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-pink-400 transition-colors">
                  {anime.title}
                </h3>
                <p className="text-gray-400 text-sm mb-3">{anime.date}</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white ${anime.statusColor}`}>
                  {anime.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5 - Community Reviews */}
      <section className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900/20 to-slate-800 flex items-center justify-center px-6">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Share Your Anime Journey
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Connect with fellow anime fans and share your thoughts on the shows you love
            </p>
          </div>
          
          <div className="space-y-8 mb-12">
            {[
              {
                user: 'AnimeFan92',
                avatar: 'A',
                anime: 'Attack on Titan',
                rating: 5,
                review: 'This anime completely changed my perspective on storytelling. The character development is phenomenal and the plot twists are mind-blowing. A masterpiece that will be remembered for generations.',
                likes: 247,
                replies: 12
              },
              {
                user: 'MangaReader',
                avatar: 'M',
                anime: 'Demon Slayer',
                rating: 4,
                review: 'The animation quality is absolutely stunning! While the story follows some typical shonen tropes, the execution is flawless. Tanjiro\'s journey is both heartbreaking and inspiring.',
                likes: 189,
                replies: 8
              },
              {
                user: 'SliceOfLifeLover',
                avatar: 'S',
                anime: 'Your Name',
                rating: 5,
                review: 'A beautiful blend of romance, fantasy, and time travel. The emotional depth and visual storytelling are incredible. This movie made me cry and smile at the same time.',
                likes: 312,
                replies: 15
              }
            ].map((review, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center">
                    <span className="text-cyan-400 font-bold text-lg">{review.avatar}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-white">{review.user}</h4>
                      <span className="text-gray-400">•</span>
                      <span className="text-cyan-400 font-medium">{review.anime}</span>
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
                      <button className="flex items-center space-x-2 text-gray-400 hover:text-cyan-400 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span>{review.likes}</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-400 hover:text-cyan-400 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span>{review.replies} replies</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
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
