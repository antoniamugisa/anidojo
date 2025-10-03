import Link from "next/link";
import HeroBackground, { animeBackgrounds } from "@/components/HeroBackground";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Background */}
      <HeroBackground 
        imageUrl="/images/hero-img.jpeg"
        overlayOpacity={0.4}
      >
        <main className="flex flex-col items-center justify-center px-4 py-8 text-center min-h-screen pt-20">
        {/* Logo/Title */}
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-7xl font-bold mb-4 text-white drop-shadow-lg">
            AniDojo
          </h1>
        </div>

        {/* Main Slogan */}
        <div className="text-center mb-12 max-w-4xl">
          <p className="text-xl md:text-2xl text-white mb-4 font-medium drop-shadow-md">
            Discover, track, and explore anime like never before
          </p>
          <p className="text-lg text-gray-200 max-w-3xl mx-auto drop-shadow-md">
            Find your next favorite anime with personalized recommendations, detailed reviews, and comprehensive tracking tools
          </p>
        </div>

        {/* Call-to-Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <Link
            href="/search"
            className="px-8 py-4 bg-red-600 text-white font-semibold text-lg rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Search Anime
          </Link>
          
          <Link
            href="/browse"
            className="px-8 py-4 bg-white text-gray-900 font-semibold text-lg rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Browse Library
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide">Smart Search</h3>
            <p className="text-gray-600 text-sm">Find anime by title, genre, studio, or any criteria with our advanced search system</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide">Track Progress</h3>
            <p className="text-gray-600 text-sm">Keep track of what you're watching, completed shows, and your personal watchlist</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide">Rate & Review</h3>
            <p className="text-gray-600 text-sm">Rate anime, write reviews, and share your thoughts with the community</p>
          </div>
        </div>
        </main>
      </HeroBackground>

      {/* Community Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
              Join the Community
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Connect with fellow anime enthusiasts, share recommendations, and discover new favorites together
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 text-sm font-bold">A</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">Alex rated <span className="font-semibold">Attack on Titan</span> 5 stars</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm font-bold">M</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">Maria added <span className="font-semibold">Demon Slayer</span> to watchlist</p>
                    <p className="text-xs text-gray-500">4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-yellow-600 text-sm font-bold">J</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">Jordan reviewed <span className="font-semibold">One Piece</span></p>
                    <p className="text-xs text-gray-500">6 hours ago</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href="/search"
                  className="block w-full bg-red-600 text-white text-center py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold uppercase tracking-wide"
                >
                  Search Anime
                </Link>
                <Link
                  href="/browse"
                  className="block w-full bg-white text-gray-900 text-center py-3 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors font-semibold uppercase tracking-wide"
                >
                  Browse Top Rated
                </Link>
                <Link
                  href="/lists"
                  className="block w-full bg-white text-gray-900 text-center py-3 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors font-semibold uppercase tracking-wide"
                >
                  Create List
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Anime Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
              Featured Anime
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover highly-rated anime with detailed information, reviews, and ratings from multiple sources
            </p>
          </div>

          {/* CTA Button */}
          <div className="text-center mb-12">
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 text-white font-bold text-lg rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-md hover:shadow-lg uppercase tracking-wide"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              View All Recommendations
            </Link>
          </div>

          {/* Recommendation Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Monster Card */}
            <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200 hover:border-red-300 transition-colors duration-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">Monster</h3>
                  <p className="text-gray-500">2004</p>
                </div>
                <div className="bg-gray-100 px-3 py-1 rounded-lg flex items-center gap-1">
                  <span className="text-yellow-500">★</span>
                  <span className="text-gray-900 font-semibold">9.1</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">Psychological</span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Thriller</span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">Drama</span>
              </div>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                A brilliant neurosurgeon's life is turned upside down when he saves a young boy who grows up to become a dangerous psychopath.
              </p>
              
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-600 font-semibold">IMDb:</span>
                  <span className="text-gray-900 font-bold">9/10</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600 font-semibold">AniList:</span>
                  <span className="text-gray-900 font-bold">90%</span>
                </div>
              </div>
            </div>

            {/* Steins;Gate Card */}
            <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200 hover:border-green-300 transition-colors duration-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">Steins;Gate</h3>
                  <p className="text-gray-500">2011</p>
                </div>
                <div className="bg-gray-100 px-3 py-1 rounded-lg flex items-center gap-1">
                  <span className="text-yellow-500">★</span>
                  <span className="text-gray-900 font-semibold">8.8</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">Sci-Fi</span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Thriller</span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">Drama</span>
              </div>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                A group of friends discover they can send messages to the past, but changing history comes with dangerous consequences.
              </p>
              
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-600 font-semibold">IMDb:</span>
                  <span className="text-gray-900 font-bold">8.7/10</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600 font-semibold">AniList:</span>
                  <span className="text-gray-900 font-bold">89%</span>
                </div>
              </div>
            </div>
          </div>

          {/* More Coming Soon */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-gray-600 text-sm font-bold">+</span>
              </div>
              <span className="text-gray-600 font-medium">More recommendations coming soon</span>
            </div>
          </div>
          </div>
        </section>
    </div>
  );
}
