"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Pencil } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import {
	type SkinProfile,
	type QuizInsight,
	SKIN_TYPES,
	AUSTRALIAN_LOCATIONS,
	OUTDOOR_ACTIVITIES,
	UV_RISK_LABELS,
	UV_RISK_STYLES,
	PROFILE_STORAGE_KEY,
	PROFILE_INSIGHT_STORAGE_KEY,
	PROFILE_PERSISTED_STORAGE_KEY,
} from "@/lib/skin-profile-data";

const API_BASE_URL =
	process.env.NEXT_PUBLIC_BACKEND_URL ??
	"https://glowsafe-production.up.railway.app";

export default function ProfileOverviewPage() {
	const { data: session } = authClient.useSession();
	const [profile, setProfile] = useState<SkinProfile | null>(null);
	const [insight, setInsight] = useState<QuizInsight | null>(null);
	const [persisted, setPersisted] = useState(false);
	const [mounted, setMounted] = useState(false);

	// Load profile + analysis, preferring the backend and only falling back to localStorage
	useEffect(() => {
		let cancelled = false;

		const load = async () => {
			const email = session?.user?.email;

			// 1) Try to load from backend if we have an email
			if (email) {
				try {
					const res = await fetch(
						`${API_BASE_URL}/quiz/skin-profile-by-email`,
						{
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({ email }),
						},
					);

					if (res.ok) {
						const data = (await res.json()) as {
							quiz: SkinProfile;
							analysis: QuizInsight;
						};

						if (!cancelled) {
							setProfile(data.quiz);
							setInsight(data.analysis);
							setPersisted(true);
							setMounted(true);
						}
						return;
					}

					// If it's anything other than "not found", log it and fall back
					if (res.status !== 404) {
						console.error(
							"Failed to load skin profile from backend",
							res.status,
							await res.text().catch(() => ""),
						);
					}
				} catch (error) {
					console.error("Error calling skin-profile-by-email", error);
				}
			}

			// 2) Fallback: use localStorage (e.g. immediately after quiz, before persistence)
			try {
				const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
				if (raw) {
					const parsed = JSON.parse(raw) as SkinProfile;
					if (parsed?.skinTypeId && parsed?.locationId) {
						setProfile(parsed);
					}
				}

				const rawInsight = localStorage.getItem(
					PROFILE_INSIGHT_STORAGE_KEY,
				);
				if (rawInsight) {
					const parsedInsight = JSON.parse(
						rawInsight,
					) as QuizInsight;
					if (parsedInsight?.vibe && parsedInsight?.sections) {
						setInsight(parsedInsight);
					}
				}

				const persistedFlag = localStorage.getItem(
					PROFILE_PERSISTED_STORAGE_KEY,
				);
				if (persistedFlag) {
					setPersisted(true);
				}
			} catch {
				// ignore localStorage issues
			}

			if (!cancelled) {
				setMounted(true);
			}
		};

		void load();

		return () => {
			cancelled = true;
		};
	}, [session?.user?.email]);

	// When a user has just logged in / signed up and we have both
	// quiz answers + analysis in localStorage, persist them once.
	useEffect(() => {
		const email = session?.user?.email;
		if (!profile || !insight || !email || persisted) return;

		let cancelled = false;

		const persist = async () => {
			try {
				const res = await fetch(`${API_BASE_URL}/quiz/add-skin-profile`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						email,
						quiz: profile,
						analysis: insight,
					}),
				});

				if (!res.ok) {
					console.error(
						"Failed to persist skin profile",
						res.status,
						await res.text().catch(() => ""),
					);
					return;
				}

				if (cancelled) return;

				const data = await res.json().catch(() => null);
				const value =
					(data && typeof data.id === "string" && data.id) || "true";

				try {
					localStorage.setItem(PROFILE_PERSISTED_STORAGE_KEY, value);
				} catch {
					// ignore storage issues
				}
				setPersisted(true);
			} catch (error) {
				console.error("Error calling add-skin-profile", error);
			}
		};

		void persist();

		return () => {
			cancelled = true;
		};
	}, [session?.user?.email, profile, insight, persisted]);

	if (!mounted) {
		return (
			<div className="flex items-center justify-center py-20">
				<p className="text-muted-foreground">Loading...</p>
			</div>
		);
	}

	if (!profile) {
		return (
			<div className="py-10">
				<div className="rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-center">
					<Sparkles className="mx-auto size-8 text-yellow" />
					<h2 className="mt-4 text-xl font-medium tracking-tight text-foreground">
						No profile yet
					</h2>
					<p className="mt-2 text-sm text-muted-foreground">
						Take the quick quiz to build your personalised UV risk profile.
					</p>
					<div className="mt-6">
						<Link
							href="/skin-builder"
							className={cn(
								buttonVariants({ size: "lg" }),
								"gap-2 cursor-pointer",
							)}
						>
							Build your profile
							<ArrowRight className="size-4" />
						</Link>
					</div>
				</div>
			</div>
		);
	}

	const firstName = session?.user?.name?.split(" ")[0] ?? "";
	const skinType = SKIN_TYPES.find((s) => s.id === profile.skinTypeId);
	const location = AUSTRALIAN_LOCATIONS.find((l) => l.id === profile.locationId);
	const activityLabels = profile.activityIds
		.map((id) => OUTDOOR_ACTIVITIES.find((a) => a.id === id)?.label ?? id)
		.join(", ");
	const riskStyle = UV_RISK_STYLES[profile.uvRiskLevel];

	return (
		<>
			<div className="flex items-center gap-2 text-sm text-muted-foreground">
				<Sparkles className="size-4 text-yellow" />
				<span>Your UV risk profile</span>
			</div>
			<h1 className="mt-3 text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
				{firstName
					? `Hey ${firstName}, here's your profile`
					: "Here's your personalised profile"}
			</h1>
			<p className="mt-2 text-sm text-muted-foreground">
				We use this to tailor your daily sun brief and tips.
			</p>

			{/* Profile summary card */}
			<div
				className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8"
				role="article"
				aria-label="Your skin profile summary"
			>
				<div className="grid gap-6 sm:grid-cols-2 md:gap-8">
					<ProfileField label="Skin type">
						<div className="flex items-center gap-3">
							{skinType && (
								<div
									className="size-6 shrink-0 rounded-full border border-border"
									style={{ backgroundColor: skinType.color }}
								/>
							)}
							<span>{skinType?.label ?? ""}</span>
						</div>
					</ProfileField>

					<ProfileField label="Location">
						{location
							? `${location.label}, ${location.region}`
							: ""}
					</ProfileField>

					<ProfileField label="Typical activities">
						{activityLabels || "None selected"}
					</ProfileField>

					<ProfileField label="UV risk level">
						<span
							className={cn(
								"inline-block rounded-full px-3 py-1 text-sm font-semibold",
								riskStyle.bg,
								riskStyle.text,
							)}
						>
							{UV_RISK_LABELS[profile.uvRiskLevel]}
						</span>
					</ProfileField>
				</div>
			</div>

			{/* Actions */}
			<div className="mt-8 flex flex-col gap-3 sm:flex-row">
				<Link
					href="/"
					className={cn(
						buttonVariants({ size: "lg" }),
						"gap-2 cursor-pointer",
					)}
				>
					Check today&apos;s UV
					<ArrowRight className="size-4" />
				</Link>
				<Link href="/profile/skin" className="cursor-pointer">
					<Button variant="outline" size="lg" className="gap-2 cursor-pointer">
						<Pencil className="size-3.5" />
						Edit profile
					</Button>
				</Link>
			</div>
		</>
	);
}

function ProfileField({
	label,
	children,
}: {
	label: string;
	children: React.ReactNode;
}) {
	return (
		<div>
			<p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
				{label}
			</p>
			<div className="mt-1.5 font-medium text-foreground">{children}</div>
		</div>
	);
}
