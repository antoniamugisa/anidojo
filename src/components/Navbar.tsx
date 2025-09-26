"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { signIn, signOut } from "next-auth/react";

function AuthNavbar() {
	const { data: session, status } = useSession();
	return (
		<header className="w-full border-b border-neutral-800 bg-black/40 backdrop-blur">
			<div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
				<div className="flex items-center gap-4">
					<Link href="/" className="text-lg font-semibold">AnimeTracker</Link>
					<nav className="flex items-center gap-4 text-sm text-neutral-300">
						<Link href="/browse">Browse</Link>
					</nav>
				</div>
				<div className="flex items-center gap-3">
					{status === "loading" ? null : session ? (
						<button
							className="rounded bg-neutral-800 px-3 py-1.5 text-sm hover:bg-neutral-700"
							onClick={() => signOut()}
						>
							Sign out
						</button>
					) : (
						<button
							className="rounded bg-white px-3 py-1.5 text-sm text-black hover:opacity-90"
							onClick={() => signIn()}
						>
							Sign in
						</button>
					)}
				</div>
			</div>
		</header>
	);
}

function DemoNavbar() {
	return (
		<header className="w-full border-b border-neutral-800 bg-black/40 backdrop-blur">
			<div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
				<div className="flex items-center gap-4">
					<Link href="/" className="text-lg font-semibold">AnimeTracker</Link>
					<nav className="flex items-center gap-4 text-sm text-neutral-300">
						<Link href="/browse">Browse</Link>
					</nav>
				</div>
				<div className="flex items-center gap-3">
					<span className="rounded bg-neutral-800 px-3 py-1.5 text-sm text-neutral-200">Demo User</span>
				</div>
			</div>
		</header>
	);
}

export default function Navbar() {
	const demo = process.env.NEXT_PUBLIC_DEMO === "1";
	return demo ? <DemoNavbar /> : <AuthNavbar />;
}
