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

type QuizInsightSection = {
	heading: string;
	body: string;
};

type QuizInsight = {
	vibe: { hex: string; label: string };
	sections: QuizInsightSection[];
};

const LOADING_PHRASES = ["Crafting the most personalised questions for you..."];
const ANALYSIS_LOADING_PHRASES = [
	"Translating your quiz into real-world UV advice",
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
	const [insight, setInsight] = useState<QuizInsight | null>(null);
	const [insightLoading, setInsightLoading] = useState(false);
	const [insightError, setInsightError] = useState<string | null>(null);
	const [analysisDone, setAnalysisDone] = useState(false);

	// When step changes: show question first, then options after delay
	useEffect(() => {
		setShowOptions(false);
		const t = setTimeout(() => setShowOptions(true), 500);
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

	const handleNext = useCallback(async () => {
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

		// Call server to get personalised analysis
		setCompleted(true);
		setAnalysisDone(false);
		setInsightLoading(true);
		setInsight(null);
		setInsightError(null);

		try {
			const res = await fetch("http://localhost:8000/quiz/skin-profile", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(profile),
			});

			if (!res.ok) {
				throw new Error(`HTTP ${res.status}`);
			}

			const data = (await res.json()) as QuizInsight;
			setInsight(data);
		} catch (error) {
			console.error("Failed to fetch quiz insight", error);
			setInsightError(
				"Couldn\u2019t fetch your analysis just now. Please try again later.",
			);
		} finally {
			setInsightLoading(false);
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

	// —— Analysis loading screen ——
	if (completed && insightLoading) {
		return (
			<div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
				<div className="flex min-h-[80px] flex-col items-center justify-center sm:min-h-[100px]">
					<div className="flex items-baseline gap-1 text-[15px] text-foreground/85 sm:text-base">
						<Typewriter
							phrases={ANALYSIS_LOADING_PHRASES}
							charDelay={26}
							phraseDelay={800}
							startDelay={200}
							endDelay={300}
							cursor={false}
							className="text-left"
							paragraphClassName=""
						/>
						<span className="loading-dots" aria-hidden>
							<span />
							<span />
							<span />
						</span>
					</div>
				</div>
			</div>
		);
	}

	// —— Completion screen ——
	if (completed && skinTypeId && locationId) {
		if (!insight) {
			return (
				<div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
					<div className="max-w-md text-center">
						<p className="text-sm font-medium text-foreground">
							We couldn&apos;t load your personalised analysis.
						</p>
						<p className="mt-2 text-sm text-muted-foreground">
							{insightError ??
								"Please check that the analysis service is running on localhost:8000 and try again."}
						</p>
					</div>
				</div>
			);
		}

		const riskLevel = getUvRiskLevel(skinTypeId, locationId, activityIds);
		const riskStyle = UV_RISK_STYLES[riskLevel];
		const skinLabel =
			SKIN_TYPES.find((s) => s.id === skinTypeId)?.label ?? "";
		const locationLabel =
			AUSTRALIAN_LOCATIONS.find((l) => l.id === locationId)?.label ?? "";

		const analysis = insight;

		return (
			<div className="flex min-h-screen flex-col overflow-hidden bg-background sm:h-screen">
				<main className="min-h-0 flex-1 overflow-y-auto">
					<div className="mx-auto flex max-w-5xl flex-col px-4 py-10 sm:px-6 sm:py-14 md:py-20">
						{/* Simple top heading + vibe */}
						<section className="max-w-3xl text-left animate-analysis-header">
							<p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
								GlowSafe • UV story
							</p>
							<h1 className="mt-3 text-2xl font-medium tracking-tight text-foreground sm:text-3xl md:text-4xl">
								{analysis.vibe.label}
							</h1>
							<p className="mt-3 max-w-xl text-sm text-muted-foreground md:text-[15px]">
								For {skinLabel.toLowerCase()} in {locationLabel},{" "}
								plus your usual plans outdoors, here&apos;s how
								the sun really shows up for you.
							</p>
							<p className="mt-2 text-xs font-semibold uppercase tracking-[0.26em]" style={{ color: analysis.vibe.hex }}>
								{UV_RISK_LABELS[riskLevel]} UV
							</p>
						</section>

						{/* Main body: narrative + simple CTAs */}
						<section className="mt-10 max-w-3xl">
							{/* Narrative analysis as flowing paragraphs (heading + body, sequential within one typewriter) */}
							<div className="max-w-2xl text-left">
								<Typewriter
									phrases={analysis.sections.flatMap(
										(section) => [
											`${section.heading}.`,
											section.body,
										],
									)}
									charDelay={22}
									phraseDelay={700}
									startDelay={400}
									endDelay={300}
									cursor
									onComplete={() => setAnalysisDone(true)}
									className=""
									paragraphClassName="mb-4 text-[15px] leading-relaxed text-foreground/85 sm:text-base"
								/>
							</div>
							{/* Simple CTAs under analysis */}
							{analysisDone && (
								<div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4 animate-analysis-cta">
									<Link
										href="/signup?callbackUrl=%2Fprofile"
										className="block"
									>
										<Button
											size="sm"
											className="w-full gap-2 sm:w-auto"
										>
											<Sparkles className="size-4 shrink-0" />
											Sign up to save this
										</Button>
									</Link>
									<Link
										href="/login?callbackUrl=%2Fprofile"
										className="block"
									>
										<Button
											variant="outline"
											size="sm"
											className="w-full gap-2 sm:w-auto"
										>
											I already have an account
										</Button>
									</Link>
								</div>
							)}
						</section>

						{analysisDone && (
							<div className="mt-8 text-center">
								<Link
									href="/"
									className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
								>
									Skip for now and go home
								</Link>
							</div>
						)}
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
													className="size-10 shrink-0 rounded-lg border border-border shadow-inner sm:size-9"
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
