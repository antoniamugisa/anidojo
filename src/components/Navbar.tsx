'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Search } from "lucide-react";

export default function Navbar() {
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
		<header className={`w-full fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/90 backdrop-blur-sm shadow-lg' : 'bg-transparent'}`}>
			<div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:py-6">
				{/* Logo */}
				<Link href="/" className="text-xl md:text-2xl font-bold text-white drop-shadow-lg z-20">ANIDOJO</Link>
				
				{/* Desktop Navigation */}
				<nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm lg:text-base font-bold text-gray-200">
					<Link href="/browse" className="hover:text-white transition-colors drop-shadow-md uppercase tracking-wide">BROWSE</Link>
					<Link href="/lists" className="hover:text-white transition-colors drop-shadow-md uppercase tracking-wide">LISTS</Link>
					<Link href="/members" className="hover:text-white transition-colors drop-shadow-md uppercase tracking-wide">MEMBERS</Link>
					<Link href="/journal" className="hover:text-white transition-colors drop-shadow-md uppercase tracking-wide">JOURNAL</Link>
				</nav>
				
				{/* Right side - Search Input (Desktop) */}
				<div className="hidden md:flex items-center gap-4">
					<div className="relative">
						<input
							type="text"
							placeholder="Search anime..."
							className="w-48 lg:w-64 px-4 py-2 pl-10 pr-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-200"
						/>
						<div className="absolute left-3 top-1/2 transform -translate-y-1/2">
							<Search className="w-4 h-4 text-gray-300" />
						</div>
					</div>
				</div>
				
				{/* Mobile Search and Menu Toggle */}
				<div className="flex md:hidden items-center gap-2 z-20">
					<button 
						className="p-2 text-white hover:text-red-400 transition-colors"
						aria-label="Search"
					>
						<Search className="w-5 h-5" />
					</button>
					<button 
						className="p-2 text-white hover:text-red-400 transition-colors"
						onClick={() => setIsMenuOpen(!isMenuOpen)}
						aria-label="Toggle menu"
					>
						{isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
					</button>
				</div>
			</div>
			
			{/* Mobile Menu */}
			<div className={`fixed inset-0 bg-black/95 backdrop-blur-md z-10 flex flex-col items-center justify-center transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
				<nav className="flex flex-col items-center gap-6 text-xl font-bold text-gray-200">
					<Link 
						href="/browse" 
						className="hover:text-red-400 transition-colors uppercase tracking-wide py-2"
						onClick={() => setIsMenuOpen(false)}
					>
						BROWSE
					</Link>
					<Link 
						href="/lists" 
						className="hover:text-red-400 transition-colors uppercase tracking-wide py-2"
						onClick={() => setIsMenuOpen(false)}
					>
						LISTS
					</Link>
					<Link 
						href="/members" 
						className="hover:text-red-400 transition-colors uppercase tracking-wide py-2"
						onClick={() => setIsMenuOpen(false)}
					>
						MEMBERS
					</Link>
					<Link 
						href="/journal" 
						className="hover:text-red-400 transition-colors uppercase tracking-wide py-2"
						onClick={() => setIsMenuOpen(false)}
					>
						JOURNAL
					</Link>
				</nav>
				
				{/* Mobile Search */}
				<div className="mt-8 w-4/5 max-w-sm">
					<div className="relative">
						<input
							type="text"
							placeholder="Search anime..."
							className="w-full px-4 py-3 pl-10 pr-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-200"
						/>
						<div className="absolute left-3 top-1/2 transform -translate-y-1/2">
							<Search className="w-5 h-5 text-gray-400" />
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}
