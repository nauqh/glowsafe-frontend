"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	type SkinProfile,
	BURN_HISTORY_OPTIONS,
	WORK_PATTERN_OPTIONS,
	PEAK_SUN_OPTIONS,
	SUNSCREEN_FREQ_OPTIONS,
	PROTECTION_HABIT_OPTIONS,
	PROFILE_STORAGE_KEY,
} from "@/lib/skin-profile-data";

function labelFor<T extends { id: string; label: string }>(options: readonly T[], id: string | undefined) {
	if (!id) return null;
	return options.find((o) => o.id === id)?.label ?? id;
}

export default function SunHabitsPage() {
	const [profile, setProfile] = useState<SkinProfile | null>(null);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		try {
			const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
			if (raw) {
				const p = JSON.parse(raw) as SkinProfile;
				if (p.skinTypeId && p.locationId) setProfile(p);
			}
		} catch {
			// ignore
		}
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<div className="flex min-h-[40vh] items-center justify-center">
				<p className="text-muted-foreground">Loading...</p>
			</div>
		);
	}

	return (
		<>
			<h1 className="text-2xl font-medium tracking-tight text-foreground">
				Sun habits
			</h1>
			<p className="mt-1 text-sm text-muted-foreground">
				Your answers from the Skin Builder quiz. We use these to tailor your sun-safety report and recommendations.
			</p>

			{!profile ? (
				<div className="mt-8 rounded-xl border border-border bg-card p-6 text-center">
					<p className="text-sm text-muted-foreground">
						You haven&apos;t completed the quiz yet.
					</p>
					<Link href="/skin-builder" className="mt-4 inline-block">
						<Button size="lg" className="gap-2">
							<RefreshCw className="size-4" />
							Take the quiz
						</Button>
					</Link>
				</div>
			) : (
				<>
					<div className="mt-8 space-y-6">
						<Section
							title="Burn history"
							value={labelFor(BURN_HISTORY_OPTIONS, profile.burnHistory)}
						/>
						<Section
							title="Weekday time outdoors"
							value={labelFor(WORK_PATTERN_OPTIONS, profile.workPattern)}
						/>
						<Section
							title="Peak sun exposure"
							value={labelFor(PEAK_SUN_OPTIONS, profile.peakSunExposure)}
						/>
						<Section
							title="Sunscreen frequency"
							value={labelFor(SUNSCREEN_FREQ_OPTIONS, profile.sunscreenFrequency)}
						/>
						<Section
							title="Protection habits"
							value={
								profile.protectionHabits?.length
									? profile.protectionHabits
											.map((id) => PROTECTION_HABIT_OPTIONS.find((o) => o.id === id)?.label ?? id)
											.join(", ")
									: undefined
							}
						/>
					</div>

					<div className="mt-10">
						<Link href="/skin-builder">
							<Button variant="outline" size="lg" className="gap-2">
								<RefreshCw className="size-4" />
								Retake full quiz
							</Button>
						</Link>
					</div>
				</>
			)}
		</>
	);
}

function Section({ title, value }: { title: string; value: string | null | undefined }) {
	return (
		<div>
			<p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
				{title}
			</p>
			<p className="mt-1 text-sm font-medium text-foreground">
				{value ?? "—"}
			</p>
		</div>
	);
}
