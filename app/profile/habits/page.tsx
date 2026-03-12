"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
	type SkinProfile,
	type BurnHistory,
	type WorkPattern,
	type PeakSunExposure,
	type SunscreenFrequency,
	type ProtectionHabit,
	BURN_HISTORY_OPTIONS,
	WORK_PATTERN_OPTIONS,
	PEAK_SUN_OPTIONS,
	SUNSCREEN_FREQ_OPTIONS,
	PROTECTION_HABIT_OPTIONS,
	PROFILE_STORAGE_KEY,
} from "@/lib/skin-profile-data";

export default function SunHabitsPage() {
	const router = useRouter();
	const [burnHistory, setBurnHistory] = useState<BurnHistory | null>(null);
	const [workPattern, setWorkPattern] = useState<WorkPattern | null>(null);
	const [peakSun, setPeakSun] = useState<PeakSunExposure | null>(null);
	const [sunscreenFreq, setSunscreenFreq] = useState<SunscreenFrequency | null>(null);
	const [protectionHabits, setProtectionHabits] = useState<ProtectionHabit[]>([]);
	const [saved, setSaved] = useState(false);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		try {
			const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
			if (raw) {
				const p = JSON.parse(raw) as SkinProfile;
				if (p.burnHistory) setBurnHistory(p.burnHistory);
				if (p.workPattern) setWorkPattern(p.workPattern);
				if (p.peakSunExposure) setPeakSun(p.peakSunExposure);
				if (p.sunscreenFrequency) setSunscreenFreq(p.sunscreenFrequency);
				if (p.protectionHabits?.length) setProtectionHabits(p.protectionHabits);
			}
		} catch {
			// ignore
		}
		setMounted(true);
	}, []);

	const toggleHabit = useCallback((id: ProtectionHabit) => {
		setProtectionHabits((prev) =>
			prev.includes(id) ? prev.filter((h) => h !== id) : [...prev, id],
		);
		setSaved(false);
	}, []);

	function handleSave() {
		const existing = (() => {
			try {
				const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
				return raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
			} catch {
				return {};
			}
		})();

		const updated = {
			...existing,
			...(burnHistory && { burnHistory }),
			...(workPattern && { workPattern }),
			...(peakSun && { peakSunExposure: peakSun }),
			...(sunscreenFreq && { sunscreenFrequency: sunscreenFreq }),
			protectionHabits,
		};

		localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updated));
		setSaved(true);
		setTimeout(() => router.push("/profile"), 600);
	}

	if (!mounted) {
		return (
			<div className="flex items-center justify-center py-20">
				<p className="text-muted-foreground">Loading...</p>
			</div>
		);
	}

	return (
		<>
			<h1 className="text-2xl font-medium tracking-tight text-foreground">
				Sun Habits
			</h1>
			<p className="mt-1 text-sm text-muted-foreground">
				Help us understand your current sun exposure and protection habits so we
				can tailor advice to your routine.
			</p>

			{/* Burn history */}
			<section className="mt-8">
				<h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
					Burn history
				</h2>
				<p className="mt-1 text-xs text-muted-foreground">
					When you&apos;re out in summer without much protection, what usually happens?
				</p>
				<div className="mt-4 grid gap-2 sm:grid-cols-3">
					{BURN_HISTORY_OPTIONS.map((opt) => (
						<OptionButton
							key={opt.id}
							selected={burnHistory === opt.id}
							onClick={() => {
								setBurnHistory(opt.id);
								setSaved(false);
							}}
						>
							<span className="text-lg" aria-hidden>{opt.icon}</span>
							<span className="text-sm font-medium">{opt.label}</span>
						</OptionButton>
					))}
				</div>
			</section>

			{/* Work pattern */}
			<section className="mt-10">
				<h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
					Weekday pattern
				</h2>
				<p className="mt-1 text-xs text-muted-foreground">
					Most weekdays you&apos;re...
				</p>
				<div className="mt-4 grid gap-2 sm:grid-cols-3">
					{WORK_PATTERN_OPTIONS.map((opt) => (
						<OptionButton
							key={opt.id}
							selected={workPattern === opt.id}
							onClick={() => {
								setWorkPattern(opt.id);
								setSaved(false);
							}}
						>
							<span className="text-lg" aria-hidden>{opt.icon}</span>
							<span className="text-sm font-medium">{opt.label}</span>
						</OptionButton>
					))}
				</div>
			</section>

			{/* Peak sun exposure */}
			<section className="mt-10">
				<h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
					Peak sun time
				</h2>
				<p className="mt-1 text-xs text-muted-foreground">
					When are you usually outside the most?
				</p>
				<div className="mt-4 grid gap-2 sm:grid-cols-2">
					{PEAK_SUN_OPTIONS.map((opt) => (
						<OptionButton
							key={opt.id}
							selected={peakSun === opt.id}
							onClick={() => {
								setPeakSun(opt.id);
								setSaved(false);
							}}
						>
							<span className="text-lg" aria-hidden>{opt.icon}</span>
							<span className="text-sm font-medium">{opt.label}</span>
						</OptionButton>
					))}
				</div>
			</section>

			{/* Sunscreen frequency */}
			<section className="mt-10">
				<h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
					Sunscreen use
				</h2>
				<p className="mt-1 text-xs text-muted-foreground">
					How often do you apply sunscreen?
				</p>
				<div className="mt-4 grid gap-2 sm:grid-cols-2">
					{SUNSCREEN_FREQ_OPTIONS.map((opt) => (
						<OptionButton
							key={opt.id}
							selected={sunscreenFreq === opt.id}
							onClick={() => {
								setSunscreenFreq(opt.id);
								setSaved(false);
							}}
						>
							<span className="text-sm font-medium">{opt.label}</span>
						</OptionButton>
					))}
				</div>
			</section>

			{/* Protection habits */}
			<section className="mt-10">
				<h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
					Protection gear
				</h2>
				<p className="mt-1 text-xs text-muted-foreground">
					What do you usually use when you&apos;re outdoors? Select all that apply.
				</p>
				<div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
					{PROTECTION_HABIT_OPTIONS.map((opt) => (
						<OptionButton
							key={opt.id}
							selected={protectionHabits.includes(opt.id)}
							onClick={() => toggleHabit(opt.id)}
						>
							<span className="text-lg" aria-hidden>{opt.icon}</span>
							<span className="text-sm font-medium">{opt.label}</span>
						</OptionButton>
					))}
				</div>
			</section>

			{/* Save */}
			<div className="mt-10 flex items-center gap-4">
				<Button size="lg" onClick={handleSave} disabled={saved} className="gap-2">
					{saved ? (
						<>
							<Check className="size-4" />
							Saved
						</>
					) : (
						"Save habits"
					)}
				</Button>
				{saved && (
					<span className="text-sm text-safe">
						Redirecting to overview...
					</span>
				)}
			</div>
		</>
	);
}

function OptionButton({
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
				"flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all",
				selected
					? "border-accent bg-accent/10"
					: "border-border bg-card hover:border-muted-foreground/40",
			)}
		>
			{children}
		</button>
	);
}
