'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();


  return (
    <div className="min-h-screen relative">
      {/* Background Image with Dark Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/hero-img.jpeg')"
        }}
      />
      
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/70"></div>
      
      {/* Main Content - Centered */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          {/* Logo */}
          <div className="mb-8">
            <img 
              src="/images/anidojo-logo.png" 
              alt="AniDojo" 
              className="h-32 w-auto mx-auto"
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
    </div>
  );
}
