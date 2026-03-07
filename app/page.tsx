import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HowItWorks } from "@/components/landing/how-it-works";

export default function Home() {
	return (
		<div className="min-h-screen bg-background text-foreground">
			{/* Nav */}
			<header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md">
				<nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 text-sm uppercase">
					<Link
						href="/"
						className="flex items-center gap-2 text-xl font-bold uppercase"
					>
						<img
							src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Claude_AI_symbol.svg"
							alt="GlowSafe"
							className="size-8"
						/>
					</Link>
					<div className="hidden items-center gap-8 md:flex">
						<Link
							href="#how-it-works"
							className="text-foreground transition-colors hover:text-muted-foreground"
						>
							About us
						</Link>
						<Link
							href="#why"
							className="text-foreground transition-colors hover:text-muted-foreground"
						>
							Services
						</Link>
						<Link
							href="#why"
							className="text-foreground transition-colors hover:text-muted-foreground"
						>
							What's new
						</Link>
						<Link
							href="#early-access"
							className="text-foreground transition-colors hover:text-muted-foreground"
						>
							Contact
						</Link>
					</div>
					<span className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
						AUS · Melbourne
					</span>
				</nav>
			</header>

			<main>
				{/* Hero */}
				<section className="flex min-h-[calc(100vh-6rem)] flex-col justify-center px-6">
					<div className="mx-auto max-w-6xl">
						<div className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:gap-16">
							<div>
								<h1 className="text-[2.75rem] font-normal leading-[1.08] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
									Glow smart.
									<br />
									<span className="text-warm">
										Stay safe.
									</span>
								</h1>
								<p className="mt-4 text-xs tracking-wide text-muted-foreground">
									UV data from the Bureau of Meteorology
								</p>
							</div>
							<div>
								<p className="text-xl leading-snug text-foreground sm:text-2xl">
									<span className="mr-3 align-middle text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
										(We provide)
									</span>
									The personalised UV awareness & guidance for
									young Australians.
								</p>
								<Link
									href="#early-access"
									className="group mt-10 inline-flex items-center gap-4 text-sm uppercase text-foreground transition-colors hover:text-muted-foreground"
								>
									Get your sun brief
									<ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
								</Link>
							</div>
						</div>
					</div>
				</section>

				{/* How it works */}
				<section id="how-it-works" className="px-6 py-24 md:py-32">
					<div className="mx-auto max-w-6xl">
						<p className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
							(How it works)
						</p>
						<h2 className="mt-4 text-3xl font-medium tracking-tight md:text-4xl">
							Three steps to smarter
							<br className="hidden sm:inline" /> sun safety
						</h2>
						<div className="mt-16">
							<HowItWorks />
						</div>
					</div>
				</section>

				{/* Why GlowSafe */}
				<section id="why" className="px-6 py-24 md:py-32">
					<div className="mx-auto grid max-w-6xl items-start gap-16 md:grid-cols-2 md:gap-20">
						<div>
							<p className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
								(Why GlowSafe)
							</p>
							<h2 className="mt-4 text-3xl font-medium tracking-tight md:text-4xl">
								Sun safety that actually fits your life
							</h2>
							<p className="mt-6 leading-relaxed text-muted-foreground">
								Australia has one of the highest rates of skin
								cancer in the world — yet existing campaigns
								don&apos;t speak to how young people actually
								live. GlowSafe bridges that gap with
								plain-language guidance tailored to you.
							</p>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<StatCard
								value="2 in 3"
								label="Australians diagnosed with skin cancer by 70"
							/>
							<StatCard
								value="UV 6+"
								label="Common on overcast Melbourne days — most don't know"
							/>
							<StatCard
								value="80%"
								label="Of lifetime UV damage happens before age 21"
							/>
							<StatCard
								value="5 min"
								label="To set up your profile and get personalised guidance"
							/>
						</div>
					</div>
				</section>

				{/* CTA */}
				<section id="early-access" className="px-6 py-24 md:py-32">
					<div className="mx-auto max-w-xl text-center">
						<p className="text-xs font-medium uppercase text-muted-foreground">
							(Join us)
						</p>
						<h2 className="mt-4 text-3xl font-medium tracking-tight md:text-4xl">
							Be the first to try GlowSafe
						</h2>
						<p className="mt-6 leading-relaxed text-muted-foreground">
							We&apos;re launching soon. Drop your email and
							we&apos;ll send you your first personalised sun
							brief the moment it&apos;s live.
						</p>
						<Link
							href="#"
							className="group mt-8 inline-flex items-center gap-4 text-sm uppercase text-foreground transition-colors hover:text-muted-foreground"
						>
							Notify me
							<ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
						</Link>
					</div>
				</section>
			</main>
			{/* Footer */}
			<footer>
				<div className="mx-auto max-w-6xl px-6 pb-8 pt-12">
					{/* Top: breadcrumb */}
					<p className="text-xs uppercase tracking-wide text-muted-foreground">
						Home
					</p>

					{/* Heading */}
					<h2 className="mt-6 max-w-md text-3xl font-medium tracking-tight md:text-4xl">
						Stay sun-smart with GlowSafe
					</h2>

					{/* Columns */}
					<div className="mt-12 grid gap-10 text-xs uppercase tracking-wide sm:grid-cols-2 md:grid-cols-4">
						{/* Email */}
						<div>
							<p className="font-medium text-foreground">
								Get updates
							</p>
							<p className="mt-4 text-muted-foreground">
								hello@glowsafe.com
							</p>
						</div>

						{/* Location */}
						<div>
							<p className="font-medium text-foreground">
								Built in
							</p>
							<p className="mt-4 normal-case text-muted-foreground">
								Melbourne, VIC
								<br />
								Australia
							</p>
						</div>

						{/* Links */}
						<div>
							<p className="font-medium text-foreground">
								GlowSafe
							</p>
							<div className="mt-4 flex flex-col gap-2 text-muted-foreground">
								<Link
									href="#how-it-works"
									className="transition-colors hover:text-foreground"
								>
									About
								</Link>
								<Link
									href="#why"
									className="transition-colors hover:text-foreground"
								>
									Why
								</Link>
								<Link
									href="#early-access"
									className="transition-colors hover:text-foreground"
								>
									Access
								</Link>
							</div>
						</div>

						{/* Social */}
						<div>
							<p className="font-medium text-foreground">
								Follow us
							</p>
							<div className="mt-4 flex flex-col gap-2 text-muted-foreground">
								<Link
									href="#"
									className="transition-colors hover:text-foreground"
								>
									Instagram
								</Link>
								<Link
									href="#"
									className="transition-colors hover:text-foreground"
								>
									TikTok
								</Link>
							</div>
						</div>
					</div>

					{/* Bottom bar */}
					<div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
						<span>© {new Date().getFullYear()} GlowSafe</span>
						<div className="flex gap-6 uppercase tracking-wide">
							<Link
								href="#"
								className="transition-colors hover:text-foreground"
							>
								Privacy Policy
							</Link>
							<Link
								href="#"
								className="transition-colors hover:text-foreground"
							>
								Terms
							</Link>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}

function StatCard({ value, label }: { value: string; label: string }) {
	return (
		<div className="rounded-xl border border-border bg-background p-6">
			<p className="text-xl font-bold text-warm md:text-3xl">{value}</p>
			<p className="mt-2 text-sm leading-snug text-muted-foreground">
				{label}
			</p>
		</div>
	);
}
