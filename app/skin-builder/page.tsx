"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, MapPin, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typewriter } from "@/components/ui/typewriter";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import {
	type SkinProfile,
	type SkinTypeId,
	type LocationId,
	type ActivityId,
	type BurnHistory,
	type WorkPattern,
	type PeakSunExposure,
	type SunscreenFrequency,
	type ProtectionHabit,
	SKIN_TYPES,
	AUSTRALIAN_LOCATIONS,
	OUTDOOR_ACTIVITIES,
	BURN_HISTORY_OPTIONS,
	WORK_PATTERN_OPTIONS,
	PEAK_SUN_OPTIONS,
	SUNSCREEN_FREQ_OPTIONS,
	PROTECTION_HABIT_OPTIONS,
	getUvRiskLevel,
	UV_RISK_LABELS,
	UV_RISK_STYLES,
	PROFILE_STORAGE_KEY,
} from "@/lib/skin-profile-data";

const TOTAL_STEPS = 8;

const LOADING_PHRASES = [
	"Crafting the most personalised questions for you...",
	"Almost there...",
];

export default function SkinBuilderPage() {
	const router = useRouter();
	const { data: session } = authClient.useSession();

	const [loading, setLoading] = useState(true);
	const loadingDoneRef = useRef(false);

	const [step, setStep] = useState(0);
	const [skinTypeId, setSkinTypeId] = useState<SkinTypeId | null>(null);
	const [locationId, setLocationId] = useState<LocationId | null>(null);
	const [activityIds, setActivityIds] = useState<ActivityId[]>([]);
	const [burnHistory, setBurnHistory] = useState<BurnHistory | null>(null);
	const [workPattern, setWorkPattern] = useState<WorkPattern | null>(null);
	const [peakSun, setPeakSun] = useState<PeakSunExposure | null>(null);
	const [sunscreenFreq, setSunscreenFreq] =
		useState<SunscreenFrequency | null>(null);
	const [protectionHabits, setProtectionHabits] = useState<ProtectionHabit[]>(
		[],
	);
	const [completed, setCompleted] = useState(false);
	const [showOptions, setShowOptions] = useState(false);

	// When step changes: show question first, then options after delay
	useEffect(() => {
		setShowOptions(false);
		const t = setTimeout(() => setShowOptions(true), 1000);
		return () => clearTimeout(t);
	}, [step]);

	const handleTypewriterComplete = useCallback(() => {
		if (loadingDoneRef.current) return;
		loadingDoneRef.current = true;
		setTimeout(() => setLoading(false), 1000);
	}, []);

	const progress = ((step + 1) / TOTAL_STEPS) * 100;

	const toggleActivity = useCallback((id: ActivityId) => {
		setActivityIds((prev) =>
			prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id],
		);
	}, []);

	const toggleHabit = useCallback((id: ProtectionHabit) => {
		setProtectionHabits((prev) =>
			prev.includes(id) ? prev.filter((h) => h !== id) : [...prev, id],
		);
	}, []);

	const canNext =
		(step === 0 && skinTypeId !== null) ||
		(step === 1 && locationId !== null) ||
		(step === 2 && activityIds.length > 0) ||
		(step === 3 && burnHistory !== null) ||
		(step === 4 && workPattern !== null) ||
		(step === 5 && peakSun !== null) ||
		(step === 6 && sunscreenFreq !== null) ||
		step === 7; // protection habits optional

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
			...(burnHistory && { burnHistory }),
			...(workPattern && { workPattern }),
			...(peakSun && { peakSunExposure: peakSun }),
			...(sunscreenFreq && { sunscreenFrequency: sunscreenFreq }),
			...(protectionHabits.length > 0 && { protectionHabits }),
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
	}, [
		step,
		skinTypeId,
		locationId,
		activityIds,
		burnHistory,
		workPattern,
		peakSun,
		sunscreenFreq,
		protectionHabits,
		router,
		session,
	]);

	const handleBack = useCallback(() => {
		if (step > 0) setStep((s) => s - 1);
	}, [step]);

	// —— Loading screen (typewriter then reveal quiz) ——
	if (loading) {
		return (
			<div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 transition-opacity duration-500">
				<div className="flex min-h-[80px] flex-col items-center justify-center sm:min-h-[100px]">
					<Typewriter
						phrases={LOADING_PHRASES}
						onComplete={handleTypewriterComplete}
						cursor
						cursorChar="|"
						paragraphClassName="text-foreground/90 text-xl leading-tight my-2"
					/>
				</div>
			</div>
		);
	}

	// —— Completion screen ——
	if (completed && skinTypeId && locationId) {
		const riskLevel = getUvRiskLevel(skinTypeId, locationId, activityIds);
		const riskStyle = UV_RISK_STYLES[riskLevel];
		const skinLabel =
			SKIN_TYPES.find((s) => s.id === skinTypeId)?.label ?? "";
		const locationLabel =
			AUSTRALIAN_LOCATIONS.find((l) => l.id === locationId)?.label ?? "";

		return (
			<div className="flex min-h-screen flex-col overflow-hidden bg-background sm:h-screen">
				<main className="min-h-0 flex-1 overflow-y-auto">
					<div className="mx-auto max-w-md px-4 py-10 sm:max-w-lg sm:px-6 sm:py-14 md:py-20">
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<Check className="size-4 shrink-0 text-safe" />
							<span>Quiz complete</span>
						</div>
						<h1 className="mt-3 text-xl font-medium tracking-tight text-foreground sm:text-2xl md:text-3xl">
							Your profile is ready
						</h1>
						<p className="mt-2 text-sm text-muted-foreground">
							Sign up to save it and get personalised UV advice
							and sun-safety recommendations.
						</p>

						<div className="mt-8 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
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
								<div className="sm:col-span-2">
									<p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
										Activities
									</p>
									<p className="mt-1 text-sm font-medium text-foreground">
										{activityIds
											.map(
												(id) =>
													OUTDOOR_ACTIVITIES.find(
														(a) => a.id === id,
													)?.label ?? id,
											)
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

						<div className="mt-8 flex flex-col gap-3">
							<Link
								href="/signup?callbackUrl=%2Fprofile"
								className="block"
							>
								<Button size="lg" className="w-full gap-2">
									<Sparkles className="size-4 shrink-0" />
									Sign up to save my profile
								</Button>
							</Link>
							<Link
								href="/login?callbackUrl=%2Fprofile"
								className="block"
							>
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

	// —— Quiz steps ——
	return (
		<div className="flex min-h-screen flex-col overflow-hidden bg-background sm:h-screen">
			{/* Progress bar only */}
			<div className="h-1 w-full shrink-0 bg-muted">
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

			<main className="flex min-h-0 flex-1 flex-col overflow-y-auto">
				<div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8 md:py-10">
					<div className="flex flex-1 flex-col">
						{/* Step 0 — Skin type */}
						{step === 0 && (
							<>
								<div className="animate-quiz-question">
									<h1 className="text-lg font-medium tracking-tight text-foreground sm:text-xl md:text-2xl lg:text-3xl">
										How does your skin usually react to sun
										exposure?
									</h1>
									<p className="mt-2 max-w-xl text-sm text-muted-foreground sm:mt-2.5 md:text-base">
										Pick the option closest to your
										un-tanned skin (e.g. inside of your
										arm).{" "}
										<a
											href="https://www.cancer.nsw.gov.au/prevention-and-screening/preventing-cancer/preventing-skin-cancer/reduce-your-skin-cancer-risk/identify-your-skin-type"
											target="_blank"
											rel="noopener noreferrer"
											className="text-muted-foreground/80 underline underline-offset-2 hover:text-foreground"
											aria-label="Learn more about skin types"
										>
											Learn more
										</a>
									</p>
								</div>
								{showOptions && (
									<div className="mt-6 grid animate-quiz-options gap-3 sm:grid-cols-2 sm:gap-3 md:mt-8 lg:grid-cols-3 lg:gap-4">
										{SKIN_TYPES.map((skin) => (
											<button
												key={skin.id}
												type="button"
												onClick={() =>
													setSkinTypeId(skin.id)
												}
												className={cn(
													"flex min-h-[72px] items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all sm:min-h-0 sm:py-3",
													skinTypeId === skin.id
														? "border-accent bg-accent/10"
														: "border-border bg-card hover:border-muted-foreground/40",
												)}
											>
												<div
													className="size-10 shrink-0 rounded-full border border-border shadow-inner sm:size-9"
													style={{
														backgroundColor:
															skin.color,
													}}
													aria-hidden
												/>
												<div className="min-w-0 flex-1">
													<p className="text-sm font-medium text-foreground">
														{skin.label}
													</p>
													<p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground sm:truncate">
														{skin.description}
													</p>
												</div>
											</button>
										))}
									</div>
								)}
							</>
						)}

						{/* Step 1 — Location */}
						{step === 1 && (
							<>
								<div className="animate-quiz-question">
									<h1 className="text-lg font-medium tracking-tight text-foreground sm:text-xl md:text-2xl lg:text-3xl">
										Which area of Victoria do you spend most
										time in?
									</h1>
									<p className="mt-2 text-sm text-muted-foreground sm:mt-2.5 md:text-base">
										We&apos;ll use this to show UV for your
										area.
									</p>
								</div>
								{showOptions && (
									<div className="mt-6 grid animate-quiz-options gap-3 sm:grid-cols-2 sm:gap-3 md:mt-8 lg:grid-cols-3 lg:gap-4">
										{AUSTRALIAN_LOCATIONS.map((loc) => (
											<button
												key={loc.id}
												type="button"
												onClick={() =>
													setLocationId(loc.id)
												}
												className={cn(
													"flex min-h-[56px] items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all sm:min-h-0",
													locationId === loc.id
														? "border-accent bg-accent/10"
														: "border-border bg-card hover:border-muted-foreground/40",
												)}
											>
												<MapPin className="size-5 shrink-0 text-muted-foreground sm:size-4" />
												<div className="min-w-0">
													<span className="block text-sm font-medium text-foreground">
														{loc.label}
													</span>
													<span className="text-xs text-muted-foreground">
														{loc.region}
													</span>
												</div>
											</button>
										))}
									</div>
								)}
							</>
						)}

						{/* Step 2 — Activities */}
						{step === 2 && (
							<>
								<div className="animate-quiz-question">
									<h1 className="text-lg font-medium tracking-tight text-foreground sm:text-xl md:text-2xl lg:text-3xl">
										What brings you outside most often?
									</h1>
									<p className="mt-2 text-sm text-muted-foreground sm:mt-2.5 md:text-base">
										Pick all that apply.
									</p>
								</div>
								{showOptions && (
									<div className="mt-6 grid animate-quiz-options gap-3 sm:grid-cols-2 sm:gap-3 md:mt-8 lg:grid-cols-3 lg:gap-4">
										{OUTDOOR_ACTIVITIES.map((act) => (
											<button
												key={act.id}
												type="button"
												onClick={() =>
													toggleActivity(act.id)
												}
												className={cn(
													"flex min-h-[56px] items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all sm:min-h-0",
													activityIds.includes(act.id)
														? "border-accent bg-accent/10"
														: "border-border bg-card hover:border-muted-foreground/40",
												)}
												aria-pressed={activityIds.includes(
													act.id,
												)}
											>
												<span
													className="text-xl sm:text-lg"
													aria-hidden
												>
													{act.icon}
												</span>
												<span className="text-sm font-medium text-foreground">
													{act.label}
												</span>
											</button>
										))}
									</div>
								)}
							</>
						)}

						{/* Step 3 — Burn history */}
						{step === 3 && (
							<>
								<div className="animate-quiz-question">
									<h1 className="text-lg font-medium tracking-tight text-foreground sm:text-xl md:text-2xl lg:text-3xl">
										Have you ever had a bad sunburn — red,
										peeling, or blistered?
									</h1>
								</div>
								{showOptions && (
									<div className="mt-6 grid animate-quiz-options gap-3 sm:grid-cols-2 sm:gap-3 md:mt-8 lg:grid-cols-4 lg:gap-4">
										{BURN_HISTORY_OPTIONS.map((opt) => (
											<OptionBtn
												key={opt.id}
												selected={
													burnHistory === opt.id
												}
												onClick={() =>
													setBurnHistory(opt.id)
												}
											>
												<span
													className="text-xl sm:text-lg"
													aria-hidden
												>
													{opt.icon}
												</span>
												<span className="text-sm font-medium">
													{opt.label}
												</span>
											</OptionBtn>
										))}
									</div>
								)}
							</>
						)}

						{/* Step 4 — Work pattern */}
						{step === 4 && (
							<>
								<div className="animate-quiz-question">
									<h1 className="text-lg font-medium tracking-tight text-foreground sm:text-xl md:text-2xl lg:text-3xl">
										How much of your typical weekday is
										spent outdoors?
									</h1>
								</div>
								{showOptions && (
									<div className="mt-6 grid animate-quiz-options gap-3 sm:grid-cols-2 sm:gap-3 md:mt-8 lg:grid-cols-4 lg:gap-4">
										{WORK_PATTERN_OPTIONS.map((opt) => (
											<OptionBtn
												key={opt.id}
												selected={
													workPattern === opt.id
												}
												onClick={() =>
													setWorkPattern(opt.id)
												}
											>
												<span
													className="text-xl sm:text-lg"
													aria-hidden
												>
													{opt.icon}
												</span>
												<span className="text-sm font-medium">
													{opt.label}
												</span>
											</OptionBtn>
										))}
									</div>
								)}
							</>
						)}

						{/* Step 5 — Peak sun */}
						{step === 5 && (
							<>
								<div className="animate-quiz-question">
									<h1 className="text-lg font-medium tracking-tight text-foreground sm:text-xl md:text-2xl lg:text-3xl">
										When are you usually outside during the
										day?
									</h1>
									<p className="mt-2 text-sm text-muted-foreground">
										Midday (10am–2pm) is the high-risk
										window — we&apos;ll flag it in your
										report.
									</p>
								</div>
								{showOptions && (
									<div className="mt-6 grid animate-quiz-options gap-3 sm:grid-cols-2 sm:gap-3 md:mt-8 lg:grid-cols-3 lg:gap-4">
										{PEAK_SUN_OPTIONS.map((opt) => (
											<OptionBtn
												key={opt.id}
												selected={peakSun === opt.id}
												onClick={() =>
													setPeakSun(opt.id)
												}
											>
												<span
													className="text-xl sm:text-lg"
													aria-hidden
												>
													{opt.icon}
												</span>
												<span className="text-sm font-medium">
													{opt.label}
												</span>
											</OptionBtn>
										))}
									</div>
								)}
							</>
						)}

						{/* Step 6 — Sunscreen frequency */}
						{step === 6 && (
							<>
								<div className="animate-quiz-question">
									<h1 className="text-lg font-medium tracking-tight text-foreground sm:text-xl md:text-2xl lg:text-3xl">
										How often do you apply sunscreen before
										going outside?
									</h1>
								</div>
								{showOptions && (
									<div className="mt-6 grid animate-quiz-options gap-3 sm:grid-cols-1 sm:gap-3 md:grid-cols-2 md:mt-8 md:gap-4">
										{SUNSCREEN_FREQ_OPTIONS.map((opt) => (
											<OptionBtn
												key={opt.id}
												selected={
													sunscreenFreq === opt.id
												}
												onClick={() =>
													setSunscreenFreq(opt.id)
												}
											>
												<span className="text-sm font-medium">
													{opt.label}
												</span>
											</OptionBtn>
										))}
									</div>
								)}
							</>
						)}

						{/* Step 7 — Protection habits */}
						{step === 7 && (
							<>
								<div className="animate-quiz-question">
									<h1 className="text-lg font-medium tracking-tight text-foreground sm:text-xl md:text-2xl lg:text-3xl">
										What do you usually do when you&apos;re
										out in the sun?
									</h1>
									<p className="mt-2 text-sm text-muted-foreground">
										Pick all that apply.
									</p>
								</div>
								{showOptions && (
									<div className="mt-6 grid animate-quiz-options gap-3 sm:grid-cols-2 sm:gap-3 md:mt-8 lg:grid-cols-3 lg:gap-4">
										{PROTECTION_HABIT_OPTIONS.map((opt) => (
											<OptionBtn
												key={opt.id}
												selected={protectionHabits.includes(
													opt.id,
												)}
												onClick={() =>
													toggleHabit(opt.id)
												}
											>
												<span
													className="text-xl sm:text-lg"
													aria-hidden
												>
													{opt.icon}
												</span>
												<span className="text-sm font-medium">
													{opt.label}
												</span>
											</OptionBtn>
										))}
									</div>
								)}
							</>
						)}
					</div>

					<div className="mt-8 flex shrink-0 items-center justify-between gap-4 border-t border-border pt-6 sm:mt-10 sm:pt-8">
						<Button
							variant="ghost"
							size="lg"
							onClick={handleBack}
							disabled={step === 0}
							className="gap-2 min-w-0"
						>
							<ArrowLeft className="size-4 shrink-0" />
							<span className="hidden sm:inline">Back</span>
						</Button>
						<Button
							size="lg"
							onClick={handleNext}
							disabled={!canNext}
							className="ml-auto gap-2 min-w-0 sm:min-w-[120px]"
						>
							{step === TOTAL_STEPS - 1
								? "See my profile"
								: "Next"}
							<ArrowRight className="size-4 shrink-0" />
						</Button>
					</div>
				</div>
			</main>
		</div>
	);
}

function OptionBtn({
	selected,
	onClick,
	children,
}: {
	selected: boolean;
	onClick: () => void;
	children: React.ReactNode;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"flex min-h-[52px] items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all sm:min-h-0",
				selected
					? "border-accent bg-accent/10"
					: "border-border bg-card hover:border-muted-foreground/40",
			)}
		>
			{children}
		</button>
	);
}
