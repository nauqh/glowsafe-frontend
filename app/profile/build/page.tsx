"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sunsafeIcons } from "@/lib/sunsafe-icons";

export default function ProfileBuildPage() {
	return (
		<div className="py-6">
			<div className="flex items-center gap-2 text-sm text-muted-foreground">
				<Sparkles className="size-4 text-yellow" />
				<span>Get started</span>
			</div>
			<h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
				Build your sun profile
			</h1>
			<p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-foreground/90 sm:text-base">
				Your profile powers personalised UV advice and sun-safety tips.
				We’ll ask a few short questions so we can tailor everything to
				you—no lectures, just what you need.
			</p>

			<div className="mt-8 rounded-2xl border border-border bg-muted/20 px-5 py-6 sm:px-6 sm:py-7">
				<h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
					What you’ll set up
				</h2>
				<ul className="mt-4 space-y-4">
					<li className="flex items-start gap-3">
						<span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-background">
							<Image
								src={sunsafeIcons.handUvProtection}
								alt=""
								width={28}
								height={28}
								className="object-contain"
							/>
						</span>
						<div>
							<p className="font-medium text-foreground">
								Skin type
							</p>
							<p className="mt-0.5 text-sm text-muted-foreground">
								How your skin reacts to the sun (Fitzpatrick
								scale). We use this to gauge your UV risk.
							</p>
						</div>
					</li>
					<li className="flex items-start gap-3">
						<span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-background text-muted-foreground">
							<MapPin className="size-4" />
						</span>
						<div>
							<p className="font-medium text-foreground">
								Location
							</p>
							<p className="mt-0.5 text-sm text-muted-foreground">
								Where you spend most of your time in Victoria.
								We’ll show UV and advice for your area.
							</p>
						</div>
					</li>
					<li className="flex items-start gap-3">
						<span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-background">
							<Image
								src={sunsafeIcons.peopleSun}
								alt=""
								width={28}
								height={28}
								className="object-contain"
							/>
						</span>
						<div>
							<p className="font-medium text-foreground">
								Activities & habits
							</p>
							<p className="mt-0.5 text-sm text-muted-foreground">
								What brings you outside and how you protect your
								skin. This shapes your recommendations.
							</p>
						</div>
					</li>
					<li className="flex items-start gap-3">
						<span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-background">
							<Image
								src={sunsafeIcons.uvShieldCheck}
								alt=""
								width={28}
								height={28}
								className="object-contain"
							/>
						</span>
						<div>
							<p className="font-medium text-foreground">
								Your sun-smart plan
							</p>
							<p className="mt-0.5 text-sm text-muted-foreground">
								At the end you’ll get a short, personalised
								summary and tips. You can always update this
								later.
							</p>
						</div>
					</li>
				</ul>
				<div className="mt-8">
					<Link href="/skin-builder" className="inline-block">
						<Button size="lg" className="gap-2 cursor-pointer">
							Start the quiz
							<ArrowRight className="size-4" />
						</Button>
					</Link>
					<p className="mt-3 text-xs text-muted-foreground">
						About 2 minutes · Your answers are private
					</p>
				</div>
			</div>
		</div>
	);
}
