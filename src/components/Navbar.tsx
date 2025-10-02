import Link from "next/link";

export default function Navbar() {
	return (
		<header className="w-full border-b-2 border-red-200 bg-white shadow-lg">
			<div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
				<div className="flex items-center gap-4">
					<Link href="/" className="text-lg font-semibold text-red-600">AniDojo</Link>
					<nav className="flex items-center gap-4 text-sm text-gray-600">
						<Link href="/browse" className="hover:text-red-600 transition-colors">Browse</Link>
						<Link href="/lists" className="hover:text-red-600 transition-colors">Lists</Link>
						<Link href="/members" className="hover:text-red-600 transition-colors">Members</Link>
						<Link href="/journal" className="hover:text-red-600 transition-colors">Journal</Link>
					</nav>
				</div>
				<div className="flex items-center gap-3">
					<span className="rounded bg-green-100 border border-green-300 px-3 py-1.5 text-sm text-green-800">Demo User</span>
				</div>
			</div>
		</header>
	);
}
