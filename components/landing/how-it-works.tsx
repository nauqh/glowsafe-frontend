import { cn } from "@/lib/utils";

const steps = [
	{
		number: "01",
		title: "Build your profile",
		description:
			"A 2-minute quiz that personalises everything — your skin type, location, and typical outdoor activities.",
	},
	{
		number: "02",
		title: "Get your daily brief",
		description:
			"Real-time UV data for your suburb, colour-coded and broken into time blocks so your day is scannable at a glance.",
	},
	{
		number: "03",
		title: "Stay protected",
		description:
			"Clear, practical guidance that fits your lifestyle — look good and stay safe without the lecture.",
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
						i > 0 && "md:pl-10"
					)}
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
				</div>
			))}
		</div>
	);
}
