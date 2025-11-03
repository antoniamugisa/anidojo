'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import GlobalSearch from './GlobalSearch';
import ThemeToggle from './ThemeToggle';
import { Menu, X } from "lucide-react";

export default function AuthNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Handle scroll effect for navbar background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuOpen]);
  
  return (
    <header className={`w-full fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-lg' : ''}`}>
      {/* Dark textured background with pure black gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-gray-900/90 backdrop-blur-sm">
        {/* Textured overlay effect */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
      
      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-4">
        {/* Logo/Brand for mobile */}
        <Link href="/" className="md:hidden text-xl font-bold text-white z-20">ANIDOJO</Link>
        
        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-8">
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
        
        {/* Right side - Search Input (Desktop) */}
        <div className="hidden md:flex items-center space-x-4">
          <GlobalSearch className="w-48 lg:w-64" />
          <ThemeToggle className="bg-white/10 hover:bg-white/20" />
        </div>
        
        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-white hover:text-red-400 transition-colors z-20"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      <div 
        className={`fixed inset-0 bg-black/95 backdrop-blur-md z-10 flex flex-col items-center justify-center transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}
      >
        <nav className="flex flex-col items-center gap-6 text-lg font-semibold text-gray-200">
          <Link 
            href="/auth" 
            className="text-white hover:text-red-400 transition-colors uppercase tracking-wider py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            SIGN IN
          </Link>
          <Link 
            href="/auth" 
            className="text-white hover:text-red-400 transition-colors uppercase tracking-wider py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            CREATE ACCOUNT
          </Link>
          <Link 
            href="/browse" 
            className="text-gray-300 hover:text-red-400 transition-colors uppercase tracking-wider py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            BROWSE
          </Link>
          <Link 
            href="/lists" 
            className="text-gray-300 hover:text-green-400 transition-colors uppercase tracking-wider py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            LISTS
          </Link>
          <Link 
            href="/members" 
            className="text-gray-300 hover:text-red-400 transition-colors uppercase tracking-wider py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            MEMBERS
          </Link>
          <Link 
            href="/journal" 
            className="text-gray-300 hover:text-green-400 transition-colors uppercase tracking-wider py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            JOURNAL
          </Link>
        </nav>
        
        {/* Mobile Search */}
        <div className="mt-8 w-4/5 max-w-sm">
          <GlobalSearch className="w-full" />
        </div>
      </div>
    </header>
  );
}
