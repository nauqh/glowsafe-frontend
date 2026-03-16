export type SunNewsArticle = {
	title: string;
	description: string | null;
	url: string;
	source: string;
	publishedAt: string;
	imageUrl: string | null;
};

// Server-side API key pulled from env
const NEWS_API_KEY = "2479ac6c88e147bb9b81070076524fec";

export async function fetchSunNews(): Promise<SunNewsArticle[]> {
	if (!NEWS_API_KEY) return [];

	const params = new URLSearchParams({
		category: "health",
		pageSize: "12",
	});

	const res = await fetch(
		`https://newsapi.org/v2/top-headlines?${params.toString()}`,
		{
			headers: {
				"X-Api-Key": NEWS_API_KEY,
			},
			cache: "no-store",
		},
	);

	if (!res.ok) {
		console.error("Sun news fetch failed", res.status, await res.text());
		return [];
	}

	const json = (await res.json()) as {
		articles?: {
			title?: string;
			description?: string | null;
			url?: string;
			source?: { name?: string | null };
			publishedAt?: string;
			urlToImage?: string | null;
		}[];
	};

	if (!json.articles) return [];

	return json.articles
		.filter((a) => a.title && a.url)
		.map((a) => ({
			title: a.title ?? "Untitled article",
			description: a.description ?? null,
			url: a.url!,
			source: a.source?.name ?? "Unknown source",
			publishedAt: a.publishedAt ?? "",
			imageUrl: a.urlToImage ?? null,
		}));
}

