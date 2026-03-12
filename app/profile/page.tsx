"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Pencil } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import {
	type SkinProfile,
	SKIN_TYPES,
	AUSTRALIAN_LOCATIONS,
	OUTDOOR_ACTIVITIES,
	UV_RISK_LABELS,
	UV_RISK_STYLES,
	PROFILE_STORAGE_KEY,
} from "@/lib/skin-profile-data";

export default function ProfileOverviewPage() {
	const { data: session } = authClient.useSession();
	const [profile, setProfile] = useState<SkinProfile | null>(null);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		try {
			const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
			if (raw) {
				const parsed = JSON.parse(raw) as SkinProfile;
				if (parsed?.skinTypeId && parsed?.locationId) {
					setProfile(parsed);
				}
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
								"gap-2",
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
						"gap-2",
					)}
				>
					Check today&apos;s UV
					<ArrowRight className="size-4" />
				</Link>
				<Link href="/profile/skin">
					<Button variant="outline" size="lg" className="gap-2">
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
