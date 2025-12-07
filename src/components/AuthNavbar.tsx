'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import GlobalSearch from './GlobalSearch';
import { Menu, X } from "lucide-react";

export default function AuthNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
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
    <header className={`w-full fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-ink' : ''}`}>
      {/* Ink background */}
      <div className={`absolute inset-0 transition-all duration-300 ${scrolled ? 'bg-ink/95 backdrop-blur-sm' : 'bg-gradient-to-b from-ink to-transparent'}`} />
      
      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-4">
        {/* Logo */}
        <Link href="/" className="md:hidden font-display text-2xl tracking-widest text-cream z-20">
          ANIDOJO
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-10">
          <Link href="/signin" className="nav-link text-sm">
            SIGN IN
          </Link>
          <Link href="/signup" className="nav-link text-sm">
            CREATE ACCOUNT
          </Link>
          <Link href="/browse" className="nav-link text-sm">
            BROWSE
          </Link>
        </nav>
        
        {/* Search (Desktop) */}
        <div className="hidden md:flex items-center space-x-4">
          <GlobalSearch className="w-48 lg:w-64" />
        </div>
        
        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-cream hover:text-crimson-bright transition-colors z-20"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      <div 
        className={`fixed inset-0 bg-ink z-10 flex flex-col items-center justify-center transform transition-transform duration-300 ease-out ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}
      >
        {/* Halftone pattern overlay */}
        <div className="absolute inset-0 bg-halftone bg-halftone opacity-[0.02]" />
        
        <nav className="relative flex flex-col items-center gap-8">
          {[
            { href: '/signin', label: 'SIGN IN' },
            { href: '/signup', label: 'CREATE ACCOUNT' },
            { href: '/browse', label: 'BROWSE' },
          ].map((item, index) => (
            <Link 
              key={item.href}
              href={item.href}
              className={`font-display text-2xl tracking-widest text-cream hover:text-crimson-bright transition-colors animate-slide-up stagger-${index + 1}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        
        {/* Mobile Search */}
        <div className="relative mt-12 w-4/5 max-w-sm animate-slide-up stagger-4">
          <GlobalSearch className="w-full" />
        </div>
      </div>
    </header>
  );
}
