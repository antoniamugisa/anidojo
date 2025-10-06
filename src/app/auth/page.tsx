'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthPage() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignIn) {
        const success = await signIn(formData.email, formData.password);
        if (success) {
          router.push('/');
        } else {
          setError('Invalid email or password');
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        const success = await signUp(formData.username, formData.email, formData.password);
        if (success) {
          router.push('/');
        } else {
          setError('Failed to create account');
        }
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleGoogleSignIn = () => {
    // TODO: Implement Google OAuth
    console.log('Google sign in clicked');
  };

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
      
      {/* Header */}
      <div className="relative z-20 px-6 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src="/images/anidojo-logo.png" 
              alt="AniDojo" 
              className="h-48 w-auto"
            />
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsSignIn(true)}
              className={`text-sm font-medium transition-colors ${
                isSignIn ? 'text-white' : 'text-white/70 hover:text-white'
              }`}
            >
              SIGN IN
            </button>
            <button
              onClick={() => setIsSignIn(false)}
              className={`text-sm font-medium transition-colors ${
                !isSignIn ? 'text-white' : 'text-white/70 hover:text-white'
              }`}
            >
              CREATE ACCOUNT
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-screen flex flex-col items-center justify-start px-6 pt-2">
        <div className="w-full max-w-md text-center">
          {/* Main Slogan */}
          <div className="mb-4">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">
              What Anime do You Want to Watch?
            </h2>
          </div>

          {/* Call to Action Button */}
          <div className="mb-4">
            <button
              onClick={isSignIn ? handleSubmit : handleSubmit}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-base transition-colors duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading 
                ? (isSignIn ? 'Signing in...' : 'Creating account...') 
                : (isSignIn ? 'Sign in — it\'s free!' : 'Get started — it\'s free!')
              }
            </button>
          </div>

          {/* Form Section (Hidden by default, shown when needed) */}
          {(isSignIn || !isSignIn) && (
            <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3 border border-white/20">
              {/* Error Message */}
              {error && (
                <div className="mb-2 p-2 bg-red-900/50 border border-red-700 rounded text-red-300 text-xs">
                  {error}
                </div>
              )}

              {/* Email Input */}
              <div className="mb-2">
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 backdrop-blur-sm text-sm"
                  placeholder="Enter your email"
                />
              </div>

              {/* Password Input (for sign in) */}
              {isSignIn && (
                <div className="mb-2">
                  <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 backdrop-blur-sm text-sm"
                    placeholder="Enter your password"
                  />
                </div>
              )}

              {/* Username Input (for create account) */}
              {!isSignIn && (
                <div className="mb-2">
                  <input
                    type="text"
                    id="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 backdrop-blur-sm text-sm"
                    placeholder="Choose a username"
                  />
                </div>
              )}

              {/* Password Input (for create account) */}
              {!isSignIn && (
                <div className="mb-2">
                  <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 backdrop-blur-sm text-sm"
                    placeholder="Create a password"
                  />
                </div>
              )}

              {/* Confirm Password Input (for create account) */}
              {!isSignIn && (
                <div className="mb-2">
                  <input
                    type="password"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 backdrop-blur-sm text-sm"
                    placeholder="Confirm your password"
                  />
                </div>
              )}

              {/* Google Sign In */}
              <div className="mb-2">
                <button
                  onClick={handleGoogleSignIn}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white/10 border border-white/30 rounded text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>
              </div>

              {/* Terms and Privacy */}
              <p className="text-xs text-white/60 text-center">
                By clicking continue, you agree to our{' '}
                <Link href="/terms" className="text-white hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-white hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
