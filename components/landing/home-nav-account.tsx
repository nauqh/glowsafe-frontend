"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";

const linkClass =
	"text-sm text-white underline-offset-4 transition-all duration-200 hover:underline hover:decoration-white hover:text-white hover:[text-shadow:0_0_0.5px_currentColor] group-hover:text-foreground/70 group-hover:hover:text-foreground group-hover:hover:underline group-hover:hover:decoration-foreground group-hover:hover:[text-shadow:0_0_0.5px_currentColor]";

export function HomeNavAccountLinks() {
	const { data: session, isPending } = authClient.useSession();

	if (isPending) {
		return (
			<div className="flex items-center justify-end gap-6">
				<span className="h-4 w-20 animate-pulse rounded bg-white/20" aria-hidden />
				<span className="h-4 w-16 animate-pulse rounded bg-white/20" aria-hidden />
			</div>
		);
	}

	return (
		<div className="flex items-center justify-end gap-6">
			{!session && (
				<Link href="/signup" className={linkClass}>
					Email sign up
				</Link>
			)}
			<Link href={session ? "/profile" : "/login"} className={linkClass}>
				My Account
			</Link>
		</div>
	);
}
