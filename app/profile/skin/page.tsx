"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink, Sparkles } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
	type SkinProfile,
	SKIN_TYPES,
	AUSTRALIAN_LOCATIONS,
	OUTDOOR_ACTIVITIES,
	UV_RISK_LABELS,
	UV_RISK_STYLES,
	PROFILE_STORAGE_KEY,
} from "@/lib/skin-profile-data";

export default function SkinProfilePage() {
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
			<div className="flex items-center justify-center py-20">
				<p className="text-muted-foreground">Loading...</p>
			</div>
		);
	}

	if (!profile) {
		return (
			<div className="py-10">
				<div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
					<Sparkles className="mx-auto size-8 text-yellow" />
					<h2 className="mt-4 text-xl font-medium tracking-tight text-foreground">
						No skin profile yet
					</h2>
					<p className="mt-2 text-sm text-muted-foreground">
						Take the quick quiz to build your personalised UV risk profile.
					</p>
					<div className="mt-6">
						<Link
							href="/skin-builder"
							className={cn(buttonVariants({ size: "lg" }), "gap-2")}
						>
							Start the quiz
							<ArrowRight className="size-4" />
						</Link>
					</div>
				</div>
			</div>
		);
	}

	const skinType = SKIN_TYPES.find((s) => s.id === profile.skinTypeId);
	const location = AUSTRALIAN_LOCATIONS.find((l) => l.id === profile.locationId);
	const activities = profile.activityIds
		.map((id) => OUTDOOR_ACTIVITIES.find((a) => a.id === id))
		.filter(Boolean);
	const riskStyle = UV_RISK_STYLES[profile.uvRiskLevel];

	return (
		<>
			<h1 className="text-2xl font-medium tracking-tight text-foreground">
				Skin Profile
			</h1>
			<p className="mt-1 text-sm text-muted-foreground">
				Your skin type, location, and outdoor activities from the quiz.
			</p>

			{/* Profile card */}
			<div className="mt-8 space-y-5">
				{/* Skin type */}
				<div className="rounded-xl border border-border bg-card p-5">
					<p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
						Skin type
					</p>
					{skinType && (
						<div className="mt-3 flex items-center gap-3">
							<div
								className="size-10 shrink-0 rounded-full border border-border shadow-inner"
								style={{ backgroundColor: skinType.color }}
							/>
							<div>
								<p className="font-medium text-foreground">
									{skinType.label}
								</p>
								<p className="text-sm text-muted-foreground">
									{skinType.description}
								</p>
							</div>
						</div>
					)}
				</div>

				{/* Location */}
				<div className="rounded-xl border border-border bg-card p-5">
					<p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
						Location
					</p>
					{location && (
						<p className="mt-2 font-medium text-foreground">
							{location.label}, {location.region}
						</p>
					)}
				</div>

				{/* Activities */}
				<div className="rounded-xl border border-border bg-card p-5">
					<p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
						Outdoor activities
					</p>
					<div className="mt-3 flex flex-wrap gap-2">
						{activities.map(
							(act) =>
								act && (
									<span
										key={act.id}
										className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1 text-sm text-foreground"
									>
										<span aria-hidden>{act.icon}</span>
										{act.label}
									</span>
								),
						)}
					</div>
				</div>

				{/* UV risk */}
				<div className="rounded-xl border border-border bg-card p-5">
					<p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
						UV risk level
					</p>
					<span
						className={cn(
							"mt-2 inline-block rounded-full px-3 py-1 text-sm font-semibold",
							riskStyle.bg,
							riskStyle.text,
						)}
					>
						{UV_RISK_LABELS[profile.uvRiskLevel]}
					</span>
				</div>
			</div>

			{/* Retake quiz CTA */}
			<div className="mt-8 rounded-xl border border-dashed border-border bg-muted/30 p-5">
				<p className="text-sm font-medium text-foreground">
					Need to update your profile?
				</p>
				<p className="mt-1 text-sm text-muted-foreground">
					Retake the 3-step quiz to refresh your skin type, location, or
					activities. Your existing data will be replaced.
				</p>
				<div className="mt-4">
					<Link href="/skin-builder">
						<Button variant="outline" size="sm" className="gap-2">
							<ExternalLink className="size-3.5" />
							Retake the quiz
						</Button>
					</Link>
				</div>
			</div>
		</>
	);
}
