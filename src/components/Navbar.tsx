'use client';

import Link from "next/link";
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, signOut } = useAuth();
	return (
		<header className="w-full absolute top-0 left-0 right-0 z-50 bg-transparent">
			<div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6">
				{/* Left side - Logo and Navigation */}
				<div className="flex items-center gap-8">
					<Link href="/" className="text-2xl font-bold text-white drop-shadow-lg">ANIDOJO</Link>
					<nav className="flex items-center gap-8 text-base font-bold text-gray-200">
						<Link href="/browse" className="hover:text-white transition-colors drop-shadow-md uppercase tracking-wide">BROWSE</Link>
						<Link href="/lists" className="hover:text-white transition-colors drop-shadow-md uppercase tracking-wide">LISTS</Link>
						<Link href="/members" className="hover:text-white transition-colors drop-shadow-md uppercase tracking-wide">MEMBERS</Link>
						<Link href="/journal" className="hover:text-white transition-colors drop-shadow-md uppercase tracking-wide">JOURNAL</Link>
					</nav>
				</div>
				
				{/* Right side - Search Input and Auth */}
				<div className="flex items-center gap-4">
					<div className="relative">
						<input
							type="text"
							placeholder="Search anime..."
							className="w-64 px-4 py-2 pl-10 pr-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-200"
						/>
						<div className="absolute left-3 top-1/2 transform -translate-y-1/2">
							<svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
							</svg>
						</div>
					</div>
					{isAuthenticated && (
						<div className="flex items-center gap-4">
							<span className="text-white font-semibold drop-shadow-md">
								Welcome, {user?.username}
							</span>
							<button
								onClick={signOut}
								className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white font-semibold hover:bg-white/30 transition-all duration-200"
							>
								SIGN OUT
							</button>
						</div>
					)}
				</div>
			</div>
		</header>
	);
}
