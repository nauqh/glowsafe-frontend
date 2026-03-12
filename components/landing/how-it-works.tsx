import Link from "next/link";
import { cn } from "@/lib/utils";

const steps = [
	{
		number: "01",
		title: "Quick quiz, done",
		description:
			"Two minutes to tell us your skin type, where you hang out, and what you get up to outdoors. That's it.",
		href: "/skin-builder",
	},
	{
		number: "02",
		title: "Your daily UV rundown",
		description:
			"Real-time UV for your suburb, colour-coded by time of day so you can plan your arvo in about three seconds.",
		href: undefined,
	},
	{
		number: "03",
		title: "Sun smart, not sun scared",
		description:
			"Practical tips that actually fit your life — no guilt trips, no 50-page pamphlets. Just the good stuff.",
		href: undefined,
	},
];

export function HowItWorks() {
	return (
		<div className="grid gap-0 border-t border-border md:grid-cols-3">
			{steps.map((step, i) => (
				<div
					key={step.number}
					className={cn(
						"border-b border-border pb-10 pt-8 md:border-b-0 md:pb-0",
						i < steps.length - 1 && "md:border-r md:pr-10",
						i > 0 && "md:pl-10",
					)}
				>
					{step.href ? (
						<Link
							href={step.href}
							className="block transition-opacity hover:opacity-80 focus:opacity-80"
						>
							<span className="font-mono text-xs text-muted-foreground">
								{step.number}
							</span>
							<h3 className="mt-4 text-xl font-medium tracking-tight">
								{step.title}
							</h3>
							<p className="mt-3 text-sm leading-relaxed text-muted-foreground">
								{step.description}
							</p>
						</Link>
					) : (
						<>
							<span className="font-mono text-xs text-muted-foreground">
								{step.number}
							</span>
							<h3 className="mt-4 text-xl font-medium tracking-tight">
								{step.title}
							</h3>
							<p className="mt-3 text-sm leading-relaxed text-muted-foreground">
								{step.description}
							</p>
						</>
					)}
				</div>
			))}
		</div>
	);
}
