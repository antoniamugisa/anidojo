'use client';

import Link from "next/link";

export default function AuthNavbar() {
  return (
    <header className="w-full absolute top-0 left-0 right-0 z-50">
      {/* Dark textured background with pure black gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-gray-900/90 backdrop-blur-sm">
        {/* Textured overlay effect */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
      
      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Left side - Navigation Links */}
        <nav className="flex items-center gap-8">
          <Link 
            href="/auth" 
            className="text-sm font-semibold text-gray-300 hover:text-red-400 transition-colors duration-200 uppercase tracking-wider"
          >
            SIGN IN
          </Link>
          <Link 
            href="/auth" 
            className="text-sm font-semibold text-gray-300 hover:text-red-400 transition-colors duration-200 uppercase tracking-wider"
          >
            CREATE ACCOUNT
          </Link>
          <Link 
            href="/browse" 
            className="text-sm font-semibold text-gray-300 hover:text-red-400 transition-colors duration-200 uppercase tracking-wider"
          >
            BROWSE
          </Link>
          <Link 
            href="/lists" 
            className="text-sm font-semibold text-gray-300 hover:text-green-400 transition-colors duration-200 uppercase tracking-wider"
          >
            LISTS
          </Link>
          <Link 
            href="/members" 
            className="text-sm font-semibold text-gray-300 hover:text-red-400 transition-colors duration-200 uppercase tracking-wider"
          >
            MEMBERS
          </Link>
          <Link 
            href="/journal" 
            className="text-sm font-semibold text-gray-300 hover:text-green-400 transition-colors duration-200 uppercase tracking-wider"
          >
            JOURNAL
          </Link>
        </nav>
        
        {/* Right side - Search Input */}
        <div className="flex items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search anime..."
              className="w-48 px-4 py-2 pr-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-200 text-sm"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
