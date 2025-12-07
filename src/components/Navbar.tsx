'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Search } from "lucide-react";

export default function Navbar() {
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
    <header className={`w-full fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-ink/95 backdrop-blur-sm shadow-ink' : 'bg-transparent'}`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-4 md:py-5">
        {/* Logo */}
        <Link href="/" className="font-display text-xl md:text-2xl tracking-widest text-cream z-20">
          ANIDOJO
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-10">
          {['BROWSE', 'LISTS', 'MEMBERS', 'JOURNAL'].map((item) => (
            <Link 
              key={item}
              href={`/${item.toLowerCase()}`} 
              className="nav-link text-sm"
            >
              {item}
            </Link>
          ))}
        </nav>
        
        {/* Search (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search anime..."
              className="input w-48 lg:w-64 pl-10 pr-4 py-2 text-sm"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-dark" />
          </div>
        </div>
        
        {/* Mobile Controls */}
        <div className="flex md:hidden items-center gap-2 z-20">
          <button 
            className="p-2 text-cream hover:text-crimson-bright transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>
          <button 
            className="p-2 text-cream hover:text-crimson-bright transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-ink z-10 flex flex-col items-center justify-center transform transition-transform duration-300 ease-out ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="absolute inset-0 bg-halftone bg-halftone opacity-[0.02]" />
        
        <nav className="relative flex flex-col items-center gap-8">
          {['BROWSE', 'LISTS', 'MEMBERS', 'JOURNAL'].map((item, index) => (
            <Link 
              key={item}
              href={`/${item.toLowerCase()}`}
              className={`font-display text-2xl tracking-widest text-cream hover:text-crimson-bright transition-colors animate-slide-up stagger-${index + 1}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {item}
            </Link>
          ))}
        </nav>
        
        {/* Mobile Search */}
        <div className="relative mt-12 w-4/5 max-w-sm animate-slide-up stagger-5">
          <input
            type="text"
            placeholder="Search anime..."
            className="input w-full pl-10 pr-4 py-3"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cream-dark" />
        </div>
      </div>
    </header>
  );
}
