"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
	User,
	Droplets,
	ShieldCheck,
	Settings,
	Home,
	LogOut,
	PanelLeft,
	X,
	Sun,
	Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

import { fetchSkinProfileByEmail } from "@/lib/skin-profile-api";
import type { SkinProfileByEmailResult } from "@/lib/skin-profile-api";

const NAV_ITEMS_FULL = [
	{ href: "/profile", label: "Overview", icon: User, exact: true },
	{
		href: "/profile/skin",
		label: "Skin Profile",
		icon: Droplets,
		exact: false,
	},
	{
		href: "/profile/weather",
		label: "Weather & UV",
		icon: Sun,
		exact: false,
	},
	{
		href: "/profile/habits",
		label: "Sun Habits",
		icon: ShieldCheck,
		exact: false,
	},
	{
		href: "/profile/account",
		label: "Account",
		icon: Settings,
		exact: false,
	},
] as const;

/** Shown when user has not completed the quiz yet */
const NAV_ITEMS_NO_PROFILE = [
	{
		href: "/profile/build",
		label: "Build your profile",
		icon: Sparkles,
		exact: false,
	},
	{
		href: "/profile/weather",
		label: "Weather & UV",
		icon: Sun,
		exact: false,
	},
	{
		href: "/profile/account",
		label: "Account",
		icon: Settings,
		exact: false,
	},
] as const;

function useSidebarState() {
	const [isOpen, setIsOpen] = useState(true);

	useEffect(() => {
		const stored = sessionStorage.getItem("glowsafe_sidebar");
		if (stored !== null) setIsOpen(stored === "true");
	}, []);

	useEffect(() => {
		sessionStorage.setItem("glowsafe_sidebar", String(isOpen));
	}, [isOpen]);

	return { isOpen, toggle: () => setIsOpen((p) => !p) };
}

export default function ProfileLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const router = useRouter();
	const { data: session, isPending } = authClient.useSession();
	const { isOpen, toggle } = useSidebarState();
	const [mobileOpen, setMobileOpen] = useState(false);
	const [isSigningOut, setIsSigningOut] = useState(false);
	const [hasSkinProfile, setHasSkinProfile] = useState<boolean | null>(null);

	useEffect(() => {
		if (!isPending && !session?.user) {
			router.replace("/");
		}
	}, [isPending, session, router]);

	// Determine if user has completed the quiz (has skin profile)
	useEffect(() => {
		const email = session?.user?.email;
		if (!email) {
			setHasSkinProfile(false);
			return;
		}
		let cancelled = false;
		fetchSkinProfileByEmail(email)
			.then((data: SkinProfileByEmailResult | null) => {
				if (!cancelled) setHasSkinProfile(!!data);
			})
			.catch(() => {
				if (!cancelled) setHasSkinProfile(false);
			});
		return () => {
			cancelled = true;
		};
	}, [session?.user?.email]);

	const navItems =
		hasSkinProfile === true ? NAV_ITEMS_FULL : NAV_ITEMS_NO_PROFILE;

	useEffect(() => {
		setMobileOpen(false);
	}, [pathname]);

	async function handleSignOut() {
		setIsSigningOut(true);
		await authClient.signOut();
		router.push("/");
	}

	if (isPending || !session?.user) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-background">
				<p className="text-muted-foreground">Loading...</p>
			</div>
		);
	}

	const userName = session.user.name ?? "Your profile";
	const userEmail = session.user.email ?? "";

	return (
		<div className="flex h-screen flex-col overflow-hidden bg-background">
			{/* Top header */}
			<header className="shrink-0 bg-background">
				<div className="flex h-14 items-center justify-between px-4 md:px-6">
					<div className="flex items-center gap-3">
						{/* Desktop sidebar toggle */}
						<button
							type="button"
							onClick={toggle}
							className="hidden rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:flex"
							aria-label="Toggle sidebar"
						>
							<PanelLeft className="size-5" />
						</button>
						{/* Mobile menu toggle */}
						<button
							type="button"
							onClick={() => setMobileOpen(!mobileOpen)}
							className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
							aria-label="Toggle menu"
						>
							{mobileOpen ? (
								<X className="size-5" />
							) : (
								<PanelLeft className="size-5" />
							)}
						</button>

						<Link
							href="/"
							className="cursor-pointer text-lg font-semibold tracking-tight text-foreground"
						>
							GlowSafe
						</Link>
						<span className="hidden text-sm font-medium text-muted-foreground md:block">
							Profile
						</span>
					</div>

					<Link
						href="/"
						className="flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
					>
						<Home className="size-3.5" />
						Home
					</Link>
				</div>
			</header>

			<div className="flex min-h-0 flex-1">
				{/* Sidebar - desktop, collapsible */}
				<aside
					className={cn(
						"hidden shrink-0 flex-col transition-[width] duration-300 ease-out md:flex",
						isOpen ? "w-56" : "w-[60px]",
					)}
				>
					<div className="flex flex-1 flex-col justify-between overflow-y-auto overflow-x-hidden">
						<div>
							{/* User identity - only when expanded */}
							<div
								className={cn(
									"overflow-hidden transition-all duration-300",
									isOpen ? "px-5 py-4" : "px-2 py-3",
								)}
							>
								{isPending ? (
									<div className="h-8 animate-pulse rounded-lg bg-muted" />
								) : isOpen ? (
									<>
										<p className="truncate text-sm font-semibold text-foreground">
											{userName}
										</p>
										{userEmail && (
											<p className="mt-0.5 truncate text-xs text-muted-foreground">
												{userEmail}
											</p>
										)}
									</>
								) : (
									<div className="flex justify-center">
										<div className="flex size-8 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
											{userName.charAt(0).toUpperCase()}
										</div>
									</div>
								)}
							</div>

							{/* Nav links */}
							<nav className="flex flex-col gap-0.5 py-3 pl-0 pr-3">
								{navItems.map((item) => {
									const isActive = item.exact
										? pathname === item.href
										: pathname.startsWith(item.href);
									return (
										<Link
											key={item.href}
											href={item.href}
											className="group flex cursor-pointer items-center py-1 text-foreground"
											title={
												!isOpen ? item.label : undefined
											}
										>
											{/* Left indicator */}
											<div className="mr-1.5 flex w-[6px] shrink-0 items-center justify-center">
												<div
													className={cn(
														"h-6 w-[6px] rounded-full transition-colors duration-150",
														isActive
															? "bg-accent"
															: "bg-transparent group-hover:bg-accent/20",
													)}
												/>
											</div>

											{/* Icon */}
											<div
												className={cn(
													"flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors",
													isActive
														? "text-accent"
														: "text-muted-foreground group-hover:text-accent",
												)}
											>
												<item.icon className="size-[18px]" />
											</div>

											{/* Label - collapses with sidebar */}
											<div
												className={cn(
													"overflow-hidden whitespace-nowrap transition-all duration-300 ease-out",
													isOpen
														? "ml-1 max-w-48 opacity-100"
														: "max-w-0 opacity-0",
												)}
											>
												<span
													className={cn(
														"text-[15px]",
														isActive
															? "font-medium text-accent"
															: "text-muted-foreground group-hover:text-accent",
													)}
												>
													{item.label}
												</span>
											</div>
										</Link>
									);
								})}
							</nav>
						</div>

						{/* Sign out */}
						<div className="py-3 pl-0 pr-3">
							<button
								type="button"
								onClick={handleSignOut}
								disabled={isSigningOut || isPending}
								className="group flex w-full items-center py-1 text-foreground disabled:opacity-50"
								title={!isOpen ? "Sign out" : undefined}
							>
								<div className="mr-1.5 w-[6px] shrink-0" />
								<div className="flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors group-hover:text-foreground">
									<LogOut className="size-[18px]" />
								</div>
								<div
									className={cn(
										"overflow-hidden whitespace-nowrap transition-all duration-300 ease-out",
										isOpen
											? "ml-1 max-w-48 opacity-100"
											: "max-w-0 opacity-0",
									)}
								>
									<span className="text-[15px] text-muted-foreground group-hover:text-foreground">
										{isSigningOut
											? "Signing out..."
											: "Sign out"}
									</span>
								</div>
							</button>
						</div>
					</div>
				</aside>

				{/* Sidebar - mobile overlay */}
				{mobileOpen && (
					<div className="fixed inset-0 top-14 z-40 md:hidden">
						<div
							className="absolute inset-0 bg-black/25"
							onClick={() => setMobileOpen(false)}
						/>
						<aside className="absolute inset-y-0 left-0 w-64 bg-background shadow-xl">
							<div className="flex h-full flex-col justify-between overflow-y-auto">
								<div>
									<div className="px-5 py-4">
										{!isPending && (
											<>
												<p className="truncate text-sm font-semibold text-foreground">
													{userName}
												</p>
												{userEmail && (
													<p className="mt-0.5 truncate text-xs text-muted-foreground">
														{userEmail}
													</p>
												)}
											</>
										)}
									</div>
									<nav className="flex flex-col gap-0.5 py-3 pl-0 pr-3">
										{navItems.map((item) => {
											const isActive = item.exact
												? pathname === item.href
												: pathname.startsWith(
														item.href,
													);
											return (
												<Link
													key={item.href}
													href={item.href}
													className="group flex cursor-pointer items-center py-1 text-foreground"
												>
													<div className="mr-1.5 flex w-[6px] shrink-0 items-center justify-center">
														<div
															className={cn(
																"h-6 w-[6px] rounded-full transition-colors duration-150",
																isActive
																	? "bg-accent"
																	: "bg-transparent group-hover:bg-accent/20",
															)}
														/>
													</div>
													<div
														className={cn(
															"flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors",
															isActive
																? "text-accent"
																: "text-muted-foreground group-hover:text-accent",
														)}
													>
														<item.icon className="size-[18px]" />
													</div>
													<span
														className={cn(
															"ml-1 text-[15px]",
															isActive
																? "font-medium text-accent"
																: "text-muted-foreground group-hover:text-accent",
														)}
													>
														{item.label}
													</span>
												</Link>
											);
										})}
									</nav>
								</div>
								<div className="py-3 pl-0 pr-3">
									<button
										type="button"
										onClick={handleSignOut}
										disabled={isSigningOut}
										className="group flex w-full items-center py-1 text-foreground disabled:opacity-50"
									>
										<div className="mr-1.5 w-[6px] shrink-0" />
										<div className="flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors group-hover:text-foreground">
											<LogOut className="size-[18px]" />
										</div>
										<span className="ml-1 text-[15px] text-muted-foreground group-hover:text-foreground">
											{isSigningOut
												? "Signing out..."
												: "Sign out"}
										</span>
									</button>
								</div>
							</div>
						</aside>
					</div>
				)}

				{/* Main content */}
				<main className="flex-1 overflow-y-auto overflow-x-hidden">
					<div className="mx-auto max-w-5xl px-5 py-8 md:px-10 md:py-12">
						{children}
					</div>
				</main>
			</div>
		</div>
	);
}
