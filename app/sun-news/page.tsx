import Link from "next/link";
import { ArrowRight, ExternalLink, PlayCircle, ArrowLeft } from "lucide-react";
import { fetchSunNews } from "@/lib/sun-news";

export const dynamic = "force-dynamic";

const CURATED_RESOURCES = [
	{
		title: "How to protect your skin from the sun",
		label: "Guide · Cancer Council Australia",
		url: "https://www.cancer.org.au/cancer-information/causes-and-prevention/sun-safety",
	},
	{
		title: "UV Index explained — when you actually need sun protection",
		label: "Guide · SunSmart",
		url: "https://www.sunsmart.com.au/sun-smart-program/uv-index",
	},
	{
		title: "What sunscreen SPF really means",
		label: "Article · WHO",
		url: "https://www.who.int/news-room/questions-and-answers/item/radiation-ultraviolet-(uv)",
	},
] as const;

const CURATED_VIDEOS = [
	{
		title: "Understanding the UV Index",
		label: "Video · 3 min watch",
		url: "https://www.youtube.com/watch?v=4LhsWbZq3K0",
	},
	{
		title: "How to apply sunscreen properly",
		label: "Video · 4 min watch",
		url: "https://www.youtube.com/watch?v=mu8QthlZgWc",
	},
	{
		title: "Sun safety for outdoor sport days",
		label: "Video · 5 min watch",
		url: "https://www.youtube.com/watch?v=2G8nUhFzVgM",
	},
];

export default async function SunNewsPage() {
	const liveArticles = await fetchSunNews();

	return (
		<div className="min-h-screen bg-background">
			<div className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-14 lg:px-10">
				<header className="space-y-4">
					<Link
						href="/"
						className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm transition-colors hover:border-accent hover:bg-accent/5 hover:text-foreground sm:text-sm"
					>
						<ArrowLeft className="size-3.5" />
						<span>Back home</span>
					</Link>
					<div>
						<p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
							Sun-safety stories
						</p>
						<h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl md:text-4xl">
							Sun safety, decoded — news, guides, and videos
						</h1>
						<p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
							A curated feed of trustworthy articles, explainers
							and short videos about UV, sunscreen, and skin
							cancer prevention. Stay on top of what actually
							matters — no scare tactics, no spam.
						</p>
					</div>
				</header>

				<main className="mt-8 space-y-10 md:mt-12 md:space-y-14">
					<section className="border-b border-border/60 pb-8 md:pb-10">
						<div className="flex items-center justify-between gap-3">
							<h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
								Featured guides
							</h2>
						</div>
						<div className="mt-4 grid gap-4 md:grid-cols-3">
							{CURATED_RESOURCES.map((item) => (
								<Link
									key={item.url}
									href={item.url}
									target="_blank"
									rel="noopener noreferrer"
									className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-4 text-left shadow-sm transition-colors hover:border-accent"
								>
									<div>
										<p className="text-sm font-medium text-foreground group-hover:text-accent-foreground">
											{item.title}
										</p>
										<p className="mt-2 text-xs text-muted-foreground">
											{item.label}
										</p>
									</div>
									<span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-accent group-hover:underline">
										Read guide
										<ExternalLink className="size-3" />
									</span>
								</Link>
							))}
						</div>
					</section>

					<section className="space-y-4">
						<div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
							<div>
								<h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
									Latest sun-safety headlines
								</h2>
								<p className="mt-1 text-xs text-muted-foreground md:text-[13px]">
									Hand-picked health and sun articles from
									trusted publishers. Updated live.
								</p>
							</div>
							{liveArticles.length > 0 && (
								<span className="text-xs text-muted-foreground">
									Pulled live from NewsAPI
								</span>
							)}
						</div>
						{liveArticles.length === 0 ? (
							<p className="mt-3 text-sm text-muted-foreground">
								Live news isn&apos;t available right now. You
								can add a `NEWS_API_KEY` environment variable to
								enable real-time headlines from{" "}
								<Link
									href="https://newsapi.org/"
									target="_blank"
									rel="noopener noreferrer"
									className="underline underline-offset-2"
								>
									NewsAPI.org
								</Link>
								, or keep using the curated guides and videos
								below.
							</p>
						) : (
							<div className="mt-4 grid gap-4 md:grid-cols-2">
								{liveArticles.map((article) => (
									<Link
										key={article.url}
										href={article.url}
										target="_blank"
										rel="noopener noreferrer"
										className="group flex flex-col justify-between rounded-2xl border border-border bg-card/95 p-4 text-left shadow-sm transition-colors hover:border-accent"
									>
										<div className="flex gap-3">
											{article.imageUrl && (
												<div className="relative hidden h-24 w-32 shrink-0 overflow-hidden rounded-md bg-muted sm:block">
													<img
														src={article.imageUrl}
														alt={article.title}
														className="h-full w-full object-cover"
													/>
												</div>
											)}
											<div className="min-w-0">
												<p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
													{article.source}
												</p>
												<h3 className="mt-1.5 text-sm font-semibold leading-snug text-foreground group-hover:text-accent-foreground">
													{article.title}
												</h3>
												{article.description && (
													<p className="mt-1.5 line-clamp-3 text-xs text-muted-foreground">
														{article.description}
													</p>
												)}
											</div>
										</div>
										<span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-accent group-hover:underline">
											Read article
											<ExternalLink className="size-3" />
										</span>
									</Link>
								))}
							</div>
						)}
					</section>

					<section>
						<div className="flex items-center justify-between gap-3">
							<h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
								Short videos
							</h2>
							<span className="text-xs text-muted-foreground">
								External links · Opens YouTube
							</span>
						</div>
						<div className="mt-4 grid gap-4 md:grid-cols-3">
							{CURATED_VIDEOS.map((video) => (
								<Link
									key={video.url}
									href={video.url}
									target="_blank"
									rel="noopener noreferrer"
									className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-4 text-left shadow-sm transition-colors hover:border-accent"
								>
									<div>
										<p className="text-sm font-medium text-foreground group-hover:text-accent-foreground">
											{video.title}
										</p>
										<p className="mt-2 text-xs text-muted-foreground">
											{video.label}
										</p>
									</div>
									<span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-accent group-hover:underline">
										Watch video
										<PlayCircle className="size-3" />
									</span>
								</Link>
							))}
						</div>
					</section>

					<section className="rounded-2xl border border-border bg-muted/40 px-4 py-4 sm:px-5 sm:py-5">
						<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
							<div>
								<p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
									Next up
								</p>
								<p className="mt-1 text-sm text-foreground md:text-base">
									Want to see UV for your day right now?
								</p>
							</div>
							<Link
								href="/weather"
								className="mt-1 inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:border-accent hover:bg-accent/5 sm:mt-0"
							>
								Check today&apos;s UV
								<ArrowRight className="size-4" />
							</Link>
						</div>
					</section>
				</main>
			</div>
		</div>
	);
}
