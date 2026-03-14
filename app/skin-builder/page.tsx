"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";
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
	type QuizInsight,
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
	PROFILE_INSIGHT_STORAGE_KEY,
} from "@/lib/skin-profile-data";

const API_BASE_URL =
	process.env.NEXT_PUBLIC_BACKEND_URL ??
	"https://glowsafe-production.up.railway.app";

const LOADING_PHRASES = ["Crafting the most personalised questions for you..."];
const ANALYSIS_LOADING_PHRASES = [
	"Translating your quiz into real-world UV advice",
	"Checking UV levels and sun safety for your location",
	"Personalising tips based on your skin type and habits",
	"Analysing your answers — almost there",
	"Putting together your custom sun-smart plan",
];

export default function SkinBuilderPage() {
	const [loading, setLoading] = useState(true);
	const loadingDoneRef = useRef(false);
	const questionRefs = useRef<(HTMLElement | null)[]>([]);

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
	const [insight, setInsight] = useState<QuizInsight | null>(null);
	const [insightLoading, setInsightLoading] = useState(false);
	const [insightError, setInsightError] = useState<string | null>(null);
	const [analysisDone, setAnalysisDone] = useState(false);
	const [headerDone, setHeaderDone] = useState(false);
	const [taglineDone, setTaglineDone] = useState(false);
	const [titleDone, setTitleDone] = useState(false);
	const { data: session } = authClient.useSession();

	// Progress: count how many of the 8 questions have been answered
	const answeredCount =
		(skinTypeId ? 1 : 0) +
		(locationId ? 1 : 0) +
		(activityIds.length > 0 ? 1 : 0) +
		(burnHistory ? 1 : 0) +
		(workPattern ? 1 : 0) +
		(peakSun ? 1 : 0) +
		(sunscreenFreq ? 1 : 0) +
		(protectionHabits.length > 0 ? 1 : 0);
	const progress = (answeredCount / 8) * 100;

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

	const scrollToQuestion = useCallback((index: number) => {
		const el = questionRefs.current[index];
		if (!el) return;
		el.scrollIntoView({ behavior: "smooth", block: "start" });
	}, []);

	const handleSkinTypeSelect = useCallback(
		(id: SkinTypeId) => {
			setSkinTypeId(id);
			scrollToQuestion(1);
		},
		[scrollToQuestion],
	);

	const handleLocationSelect = useCallback(
		(id: LocationId) => {
			setLocationId(id);
			scrollToQuestion(2);
		},
		[scrollToQuestion],
	);

	const handleBurnHistorySelect = useCallback(
		(id: BurnHistory) => {
			setBurnHistory(id);
			scrollToQuestion(4);
		},
		[scrollToQuestion],
	);

	const handleWorkPatternSelect = useCallback(
		(id: WorkPattern) => {
			setWorkPattern(id);
			scrollToQuestion(5);
		},
		[scrollToQuestion],
	);

	const handlePeakSunSelect = useCallback(
		(id: PeakSunExposure) => {
			setPeakSun(id);
			scrollToQuestion(6);
		},
		[scrollToQuestion],
	);

	const handleSunscreenFreqSelect = useCallback(
		(id: SunscreenFrequency) => {
			setSunscreenFreq(id);
			scrollToQuestion(7);
		},
		[scrollToQuestion],
	);

	const canSubmit =
		skinTypeId !== null && locationId !== null && activityIds.length > 0;

	const handleSubmit = useCallback(async () => {
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
		setHeaderDone(false);
		setTaglineDone(false);
		setTitleDone(false);
		setInsightLoading(true);
		setInsight(null);
		setInsightError(null);

		try {
			const res = await fetch(`${API_BASE_URL}/quiz/skin-profile`, {
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
			try {
				localStorage.setItem(
					PROFILE_INSIGHT_STORAGE_KEY,
					JSON.stringify(data),
				);
			} catch {
				// ignore
			}

			// If the user is logged in, persist this quiz + analysis
			const email = session?.user?.email;
			if (email) {
				try {
					await fetch(`${API_BASE_URL}/quiz/add-skin-profile`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							email,
							quiz: profile,
							analysis: data,
						}),
					});
				} catch (error) {
					console.error(
						"Failed to persist skin profile from quiz",
						error,
					);
				}
			}
		} catch (error) {
			console.error("Failed to fetch quiz insight", error);
			setInsightError(
				"Couldn\u2019t fetch your analysis just now. Please try again later.",
			);
		} finally {
			setInsightLoading(false);
		}
	}, [
		skinTypeId,
		locationId,
		activityIds,
		burnHistory,
		workPattern,
		peakSun,
		sunscreenFreq,
		protectionHabits,
		session?.user?.email,
	]);

	const handleTypewriterComplete = useCallback(() => {
		if (loadingDoneRef.current) return;
		loadingDoneRef.current = true;
		setTimeout(() => setLoading(false), 1000);
	}, []);

	// —— Initial loading screen ——
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
					<div className="text-[15px] text-foreground/85 sm:text-base">
						<Typewriter
							phrases={ANALYSIS_LOADING_PHRASES}
							charDelay={26}
							phraseDelay={10000}
							startDelay={200}
							endDelay={300}
							cursor={false}
							className="text-left"
							paragraphClassName=""
							trailing={
								<span className="loading-dots" aria-hidden />
							}
						/>
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
					<div className="mx-auto flex w-full max-w-3xl flex-col px-4 py-10 sm:px-6 sm:py-14 md:py-20">
						{/* Simple top heading + vibe */}
						<section className="mx-auto w-full max-w-2xl text-left animate-analysis-header">
							{/* Part 1: intro line */}
							<Typewriter
								phrases={["We can tell you're:"]}
								charDelay={28}
								startDelay={250}
								endDelay={200}
								cursor
								onComplete={() => setTaglineDone(true)}
								className=""
								paragraphClassName="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground"
							/>

							{/* Part 2: vibe label */}
							{taglineDone && (
								<div className="mt-3">
									<Typewriter
										phrases={[analysis.vibe.label]}
										charDelay={32}
										startDelay={150}
										endDelay={200}
										cursor
										onComplete={() => {
											setTitleDone(true);
											setHeaderDone(true);
										}}
										className=""
										paragraphClassName="text-center text-2xl font-semibold tracking-tight text-foreground sm:text-3xl md:text-4xl"
									/>
								</div>
							)}

							{/* Part 3: descriptive line + risk line */}
							{titleDone && (
								<div className="mt-4 space-y-3">
									<p className="text-xs font-semibold uppercase tracking-[0.26em] text-muted-foreground">
										Your risk level is{" "}
										<span
											style={{ color: analysis.vibe.hex }}
										>
											{UV_RISK_LABELS[riskLevel]}
										</span>
										.
									</p>
								</div>
							)}
						</section>

						{/* Main body: narrative + simple CTAs */}
						{headerDone && (
							<section className="mt-10 mx-auto w-full max-w-2xl animate-analysis-header">
								{/* Narrative analysis as flowing paragraphs (heading + body, sequential within one typewriter) */}
								<div className="w-full text-left">
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
											className="block cursor-pointer"
										>
											<Button
												size="sm"
												className="w-full gap-2 sm:w-auto cursor-pointer"
											>
												<Sparkles className="size-4 shrink-0" />
												Sign up to save this
											</Button>
										</Link>
										<Link
											href="/login?callbackUrl=%2Fprofile"
											className="block cursor-pointer"
										>
											<Button
												variant="outline"
												size="sm"
												className="w-full gap-2 sm:w-auto cursor-pointer"
											>
												I already have an account
											</Button>
										</Link>
									</div>
								)}
							</section>
						)}

						{analysisDone && (
							<div className="mt-8 text-center">
								<Link
									href="/"
									className="cursor-pointer text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
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

	// —— Quiz: all questions on one page ——
	return (
		<div className="flex min-h-screen flex-col overflow-hidden bg-background sm:h-screen">
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
				<div className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 sm:px-6 sm:py-8 md:py-10">
					<div className="space-y-6 sm:space-y-8">
						{/* 1 — Skin type */}
						<section
							ref={(el) => {
								questionRefs.current[0] = el;
							}}
							className="rounded-3xl border border-border/60 bg-muted/10 px-4 py-5 sm:px-5 sm:py-6"
						>
							<div className="flex items-baseline gap-2">
								<span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-border/60 bg-background text-xs font-medium text-muted-foreground">
									1
								</span>
								<h2 className="text-lg font-medium tracking-tight text-foreground sm:text-xl md:text-2xl">
									How does your skin usually react to sun
									exposure?
								</h2>
							</div>
							<p className="mt-2 text-sm text-muted-foreground md:text-base">
								Pick the option closest to your un-tanned skin
								(e.g. inside of your arm).{" "}
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
							<div className="mt-4 grid gap-3 sm:grid-cols-2 sm:gap-3 md:mt-6 lg:grid-cols-3 lg:gap-4">
								{SKIN_TYPES.map((skin) => (
									<button
										key={skin.id}
										type="button"
										onClick={() =>
											handleSkinTypeSelect(skin.id)
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
												backgroundColor: skin.color,
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
						</section>

						{/* 2 — Location */}
						<section
							ref={(el) => {
								questionRefs.current[1] = el;
							}}
							className="rounded-3xl border border-border/60 bg-muted/10 px-4 py-5 sm:px-5 sm:py-6"
						>
							<div className="flex items-baseline gap-2">
								<span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-border/60 bg-background text-xs font-medium text-muted-foreground">
									2
								</span>
								<h2 className="text-lg font-medium tracking-tight text-foreground sm:text-xl md:text-2xl">
									Which area of Victoria do you spend most
									time in?
								</h2>
							</div>
							<p className="mt-2 text-sm text-muted-foreground md:text-base">
								We&apos;ll use this to show UV for your area.
							</p>
							<div className="mt-4 grid gap-3 sm:grid-cols-2 sm:gap-3 md:mt-6 lg:grid-cols-3 lg:gap-4">
								{AUSTRALIAN_LOCATIONS.map((loc) => (
									<button
										key={loc.id}
										type="button"
										onClick={() =>
											handleLocationSelect(loc.id)
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
						</section>

						{/* 3 — Activities */}
						<section
							ref={(el) => {
								questionRefs.current[2] = el;
							}}
							className="rounded-3xl border border-border/60 bg-muted/10 px-4 py-5 sm:px-5 sm:py-6"
						>
							<div className="flex items-baseline gap-2">
								<span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-border/60 bg-background text-xs font-medium text-muted-foreground">
									3
								</span>
								<h2 className="text-lg font-medium tracking-tight text-foreground sm:text-xl md:text-2xl">
									What brings you outside most often?
								</h2>
							</div>
							<p className="mt-2 text-sm text-muted-foreground md:text-base">
								Pick all that apply.
							</p>
							<div className="mt-4 grid gap-3 sm:grid-cols-2 sm:gap-3 md:mt-6 lg:grid-cols-3 lg:gap-4">
								{OUTDOOR_ACTIVITIES.map((act) => (
									<OptionBtn
										key={act.id}
										selected={activityIds.includes(act.id)}
										onClick={() => toggleActivity(act.id)}
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
									</OptionBtn>
								))}
							</div>
						</section>

						{/* 4 — Burn history */}
						<section
							ref={(el) => {
								questionRefs.current[3] = el;
							}}
							className="rounded-3xl border border-border/60 bg-muted/10 px-4 py-5 sm:px-5 sm:py-6"
						>
							<div className="flex items-baseline gap-2">
								<span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-border/60 bg-background text-xs font-medium text-muted-foreground">
									4
								</span>
								<h2 className="text-lg font-medium tracking-tight text-foreground sm:text-xl md:text-2xl">
									Have you ever had a bad sunburn — red,
									peeling, or blistered?
								</h2>
							</div>
							<div className="mt-4 grid gap-3 sm:grid-cols-2 sm:gap-3 md:mt-6 lg:grid-cols-4 lg:gap-4">
								{BURN_HISTORY_OPTIONS.map((opt) => (
									<OptionBtn
										key={opt.id}
										selected={burnHistory === opt.id}
										onClick={() =>
											handleBurnHistorySelect(opt.id)
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
						</section>

						{/* 5 — Work pattern */}
						<section
							ref={(el) => {
								questionRefs.current[4] = el;
							}}
							className="rounded-3xl border border-border/60 bg-muted/10 px-4 py-5 sm:px-5 sm:py-6"
						>
							<div className="flex items-baseline gap-2">
								<span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-border/60 bg-background text-xs font-medium text-muted-foreground">
									5
								</span>
								<h2 className="text-lg font-medium tracking-tight text-foreground sm:text-xl md:text-2xl">
									How much of your typical weekday is spent
									outdoors?
								</h2>
							</div>
							<div className="mt-4 grid gap-3 sm:grid-cols-2 sm:gap-3 md:mt-6 lg:grid-cols-4 lg:gap-4">
								{WORK_PATTERN_OPTIONS.map((opt) => (
									<OptionBtn
										key={opt.id}
										selected={workPattern === opt.id}
										onClick={() =>
											handleWorkPatternSelect(opt.id)
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
						</section>

						{/* 6 — Peak sun */}
						<section
							ref={(el) => {
								questionRefs.current[5] = el;
							}}
							className="rounded-3xl border border-border/60 bg-muted/10 px-4 py-5 sm:px-5 sm:py-6"
						>
							<div className="flex items-baseline gap-2">
								<span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-border/60 bg-background text-xs font-medium text-muted-foreground">
									6
								</span>
								<h2 className="text-lg font-medium tracking-tight text-foreground sm:text-xl md:text-2xl">
									When are you usually outside during the day?
								</h2>
							</div>
							<p className="mt-2 text-sm text-muted-foreground">
								Midday (10am–2pm) is the high-risk window —
								we&apos;ll flag it in your report.
							</p>
							<div className="mt-4 grid gap-3 sm:grid-cols-2 sm:gap-3 md:mt-6 lg:grid-cols-3 lg:gap-4">
								{PEAK_SUN_OPTIONS.map((opt) => (
									<OptionBtn
										key={opt.id}
										selected={peakSun === opt.id}
										onClick={() =>
											handlePeakSunSelect(opt.id)
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
						</section>

						{/* 7 — Sunscreen frequency */}
						<section
							ref={(el) => {
								questionRefs.current[6] = el;
							}}
							className="rounded-3xl border border-border/60 bg-muted/10 px-4 py-5 sm:px-5 sm:py-6"
						>
							<div className="flex items-baseline gap-2">
								<span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-border/60 bg-background text-xs font-medium text-muted-foreground">
									7
								</span>
								<h2 className="text-lg font-medium tracking-tight text-foreground sm:text-xl md:text-2xl">
									How often do you apply sunscreen before
									going outside?
								</h2>
							</div>
							<div className="mt-4 grid gap-3 sm:grid-cols-1 md:grid-cols-2 md:gap-4">
								{SUNSCREEN_FREQ_OPTIONS.map((opt) => (
									<OptionBtn
										key={opt.id}
										selected={sunscreenFreq === opt.id}
										onClick={() =>
											handleSunscreenFreqSelect(opt.id)
										}
									>
										<span className="text-sm font-medium">
											{opt.label}
										</span>
									</OptionBtn>
								))}
							</div>
						</section>

						{/* 8 — Protection habits */}
						<section
							ref={(el) => {
								questionRefs.current[7] = el;
							}}
							className="rounded-3xl border border-border/60 bg-muted/10 px-4 py-5 sm:px-5 sm:py-6"
						>
							<div className="flex items-baseline gap-2">
								<span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-border/60 bg-background text-xs font-medium text-muted-foreground">
									8
								</span>
								<h2 className="text-lg font-medium tracking-tight text-foreground sm:text-xl md:text-2xl">
									What do you usually do when you&apos;re out
									in the sun?
								</h2>
							</div>
							<p className="mt-2 text-sm text-muted-foreground">
								Pick all that apply.
							</p>
							<div className="mt-4 grid gap-3 sm:grid-cols-2 sm:gap-3 md:mt-6 lg:grid-cols-3 lg:gap-4">
								{PROTECTION_HABIT_OPTIONS.map((opt) => (
									<OptionBtn
										key={opt.id}
										selected={protectionHabits.includes(
											opt.id,
										)}
										onClick={() => toggleHabit(opt.id)}
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
						</section>
					</div>

					<div className="mt-10 border-t border-border pt-8 sm:mt-12 sm:pt-10">
						<Button
							size="lg"
							onClick={handleSubmit}
							disabled={!canSubmit}
							className="w-full gap-2 sm:w-auto sm:min-w-[180px]"
						>
							See my profile
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
				"group relative flex min-h-[56px] items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm transition-all sm:min-h-0 sm:py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
				selected
					? "border-accent bg-accent/10 shadow-sm"
					: "border-border/70 bg-card hover:border-accent/60 hover:bg-accent/5",
			)}
		>
			{children}
		</button>
	);
}
