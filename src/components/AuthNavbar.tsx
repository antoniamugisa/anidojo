'use client';

import Link from "next/link";
import GlobalSearch from './GlobalSearch';

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
          <GlobalSearch className="w-48" />
        </div>
      </div>
    </header>
  );
}
