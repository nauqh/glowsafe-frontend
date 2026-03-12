"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, MapPin, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import {
	type SkinProfile,
	type SkinTypeId,
	type LocationId,
	type ActivityId,
	SKIN_TYPES,
	AUSTRALIAN_LOCATIONS,
	OUTDOOR_ACTIVITIES,
	getUvRiskLevel,
	UV_RISK_LABELS,
	UV_RISK_STYLES,
	PROFILE_STORAGE_KEY,
} from "@/lib/skin-profile-data";

const TOTAL_STEPS = 3;

export default function SkinBuilderPage() {
	const [step, setStep] = useState(0);
	const [skinTypeId, setSkinTypeId] = useState<SkinTypeId | null>(null);
	const [locationId, setLocationId] = useState<LocationId | null>(null);
	const [activityIds, setActivityIds] = useState<ActivityId[]>([]);
	const [completed, setCompleted] = useState(false);
	const router = useRouter();
	const { data: session } = authClient.useSession();

	const progress = ((step + 1) / TOTAL_STEPS) * 100;

	const toggleActivity = useCallback((id: ActivityId) => {
		setActivityIds((prev) =>
			prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id],
		);
	}, []);

	const handleNext = useCallback(() => {
		if (step < TOTAL_STEPS - 1) {
			setStep((s) => s + 1);
			return;
		}

		if (!skinTypeId || !locationId || activityIds.length === 0) return;

		const profile: SkinProfile = {
			skinTypeId,
			locationId,
			activityIds,
			uvRiskLevel: getUvRiskLevel(skinTypeId, locationId, activityIds),
		};
		try {
			localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
		} catch {
			// ignore
		}

		if (session?.user) {
			router.push("/profile");
		} else {
			setCompleted(true);
		}
	}, [step, skinTypeId, locationId, activityIds, router, session]);

	const handleBack = useCallback(() => {
		if (step > 0) setStep((s) => s - 1);
	}, [step]);

	const canNext =
		(step === 0 && skinTypeId) ||
		(step === 1 && locationId) ||
		(step === 2 && activityIds.length > 0);

	// Quiz complete — prompt sign up
	if (completed && skinTypeId && locationId) {
		const riskLevel = getUvRiskLevel(skinTypeId, locationId, activityIds);
		const riskStyle = UV_RISK_STYLES[riskLevel];
		const skinLabel = SKIN_TYPES.find((s) => s.id === skinTypeId)?.label ?? "";
		const locationLabel = AUSTRALIAN_LOCATIONS.find((l) => l.id === locationId)?.label ?? "";

		return (
			<div className="flex h-screen flex-col overflow-hidden bg-background">
				<header className="shrink-0 border-b border-border bg-card">
					<nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-10 lg:px-12">
						<Link
							href="/"
							className="text-xl font-medium tracking-tight text-foreground"
						>
							GlowSafe
						</Link>
					</nav>
				</header>
				<main className="min-h-0 flex-1 overflow-y-auto">
					<div className="mx-auto max-w-lg px-5 py-12 md:px-10 md:py-20">
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<Check className="size-4 text-safe" />
							<span>Quiz complete</span>
						</div>
						<h1 className="mt-3 text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
							Your profile is ready
						</h1>
						<p className="mt-2 text-sm text-muted-foreground">
							Here&apos;s a quick summary. Sign up to save it and get
							personalised UV advice.
						</p>

						{/* Mini profile summary */}
						<div className="mt-8 rounded-2xl border border-border bg-card p-5 shadow-sm">
							<div className="grid gap-4 sm:grid-cols-2">
								<div>
									<p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
										Skin type
									</p>
									<p className="mt-1 text-sm font-medium text-foreground">
										{skinLabel}
									</p>
								</div>
								<div>
									<p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
										Location
									</p>
									<p className="mt-1 text-sm font-medium text-foreground">
										{locationLabel}
									</p>
								</div>
								<div>
									<p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
										Activities
									</p>
									<p className="mt-1 text-sm font-medium text-foreground">
										{activityIds
											.map((id) => OUTDOOR_ACTIVITIES.find((a) => a.id === id)?.label ?? id)
											.join(", ")}
									</p>
								</div>
								<div>
									<p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
										UV risk
									</p>
									<span
										className={cn(
											"mt-1 inline-block rounded-full px-3 py-0.5 text-sm font-semibold",
											riskStyle.bg,
											riskStyle.text,
										)}
									>
										{UV_RISK_LABELS[riskLevel]}
									</span>
								</div>
							</div>
						</div>

						{/* CTAs */}
						<div className="mt-8 flex flex-col gap-3">
							<Link href="/signup?callbackUrl=%2Fprofile">
								<Button size="lg" className="w-full gap-2">
									<Sparkles className="size-4" />
									Sign up to save my profile
								</Button>
							</Link>
							<Link href="/login?callbackUrl=%2Fprofile">
								<Button
									variant="outline"
									size="lg"
									className="w-full gap-2"
								>
									I already have an account
								</Button>
							</Link>
						</div>

						<div className="mt-6 text-center">
							<Link
								href="/"
								className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
							>
								Skip for now and go home
							</Link>
						</div>
					</div>
				</main>
			</div>
		);
	}

	// Quiz steps
	return (
		<div className="flex h-screen flex-col overflow-hidden bg-background">
			<header className="shrink-0 border-b border-border bg-card">
				<nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 md:px-10 lg:px-12">
					<Link
						href="/"
						className="text-lg font-medium tracking-tight text-foreground"
					>
						GlowSafe
					</Link>
					<span className="text-sm text-muted-foreground">
						Step {step + 1} of {TOTAL_STEPS}
					</span>
				</nav>
				<div className="h-1 w-full bg-muted">
					<div
						className="h-full bg-accent transition-all duration-300 ease-out"
						style={{ width: `${progress}%` }}
						role="progressbar"
						aria-valuenow={Math.round(progress)}
						aria-valuemin={0}
						aria-valuemax={100}
						aria-label="Quiz progress"
					/>
				</div>
			</header>

			<main className="flex min-h-0 flex-1 flex-col">
				<div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-5 py-6 md:px-10 md:py-8 lg:px-12">
					{/* Question + options — fills available space */}
					<div className="flex-1">
						{step === 0 && (
							<>
								<h1 className="text-xl font-medium tracking-tight text-foreground sm:text-2xl lg:text-3xl">
									How does your skin usually react to sun?
								</h1>
								<p className="mt-1.5 max-w-2xl text-sm text-muted-foreground md:text-base">
									Pick the option closest to your un-tanned skin (e.g. inside of your arm).{" "}
									<a
										href="https://www.cancer.nsw.gov.au/prevention-and-screening/preventing-cancer/preventing-skin-cancer/reduce-your-skin-cancer-risk/identify-your-skin-type"
										target="_blank"
										rel="noopener noreferrer"
										className="underline decoration-muted-foreground/50 underline-offset-2 hover:text-foreground"
									>
										Fitzpatrick scale
									</a>
								</p>
								<div className="mt-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
									{SKIN_TYPES.map((skin) => (
										<button
											key={skin.id}
											type="button"
											onClick={() => setSkinTypeId(skin.id)}
											className={cn(
												"flex items-center gap-3 rounded-xl border-2 px-3 py-2.5 text-left transition-all",
												skinTypeId === skin.id
													? "border-accent bg-accent/10"
													: "border-border bg-card hover:border-muted-foreground/40",
											)}
										>
											<div
												className="size-9 shrink-0 rounded-full border border-border shadow-inner"
												style={{ backgroundColor: skin.color }}
												aria-hidden
											/>
											<div className="min-w-0">
												<p className="text-sm font-medium text-foreground">
													{skin.label}
												</p>
												<p className="truncate text-xs text-muted-foreground">
													{skin.description}
												</p>
											</div>
										</button>
									))}
								</div>
							</>
						)}

						{step === 1 && (
							<>
								<h1 className="text-xl font-medium tracking-tight text-foreground sm:text-2xl lg:text-3xl">
									Where do you spend most of your time?
								</h1>
								<p className="mt-1.5 text-sm text-muted-foreground md:text-base">
									We&apos;ll use this to pull the right UV for your area.
								</p>
								<div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
									{AUSTRALIAN_LOCATIONS.map((loc) => (
										<button
											key={loc.id}
											type="button"
											onClick={() => setLocationId(loc.id)}
											className={cn(
												"flex items-center gap-2.5 rounded-xl border-2 px-3.5 py-2.5 text-left transition-all",
												locationId === loc.id
													? "border-accent bg-accent/10"
													: "border-border bg-card hover:border-muted-foreground/40",
											)}
										>
											<MapPin className="size-4 shrink-0 text-muted-foreground" />
											<span className="text-sm font-medium text-foreground">
												{loc.label}
											</span>
											<span className="text-xs text-muted-foreground">
												{loc.region}
											</span>
										</button>
									))}
								</div>
							</>
						)}

						{step === 2 && (
							<>
								<h1 className="text-xl font-medium tracking-tight text-foreground sm:text-2xl lg:text-3xl">
									What does &quot;outside&quot; look like for you?
								</h1>
								<p className="mt-1.5 text-sm text-muted-foreground md:text-base">
									Select all that feel like a typical week.
								</p>
								<div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
									{OUTDOOR_ACTIVITIES.map((act) => (
										<button
											key={act.id}
											type="button"
											onClick={() => toggleActivity(act.id)}
											className={cn(
												"flex items-center gap-2.5 rounded-xl border-2 px-3.5 py-2.5 text-left transition-all",
												activityIds.includes(act.id)
													? "border-accent bg-accent/10"
													: "border-border bg-card hover:border-muted-foreground/40",
											)}
											aria-pressed={activityIds.includes(act.id)}
										>
											<span className="text-lg" aria-hidden>
												{act.icon}
											</span>
											<span className="text-sm font-medium text-foreground">
												{act.label}
											</span>
										</button>
									))}
								</div>
							</>
						)}
					</div>

					{/* Back / Next — pinned to bottom */}
					<div className="flex shrink-0 items-center justify-between gap-4 pt-4">
						<Button
							variant="ghost"
							size="lg"
							onClick={handleBack}
							disabled={step === 0}
							className="gap-2"
						>
							<ArrowLeft className="size-4" />
							Back
						</Button>
						<Button
							size="lg"
							onClick={handleNext}
							disabled={!canNext}
							className="ml-auto gap-2"
						>
							{step === TOTAL_STEPS - 1
								? "See my profile"
								: "Next"}
							<ArrowRight className="size-4" />
						</Button>
					</div>
				</div>
			</main>
		</div>
	);
}
