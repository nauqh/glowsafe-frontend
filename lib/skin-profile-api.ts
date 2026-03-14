import type { SkinProfile, QuizInsight } from "@/lib/skin-profile-data";

const API_BASE_URL =
	process.env.NEXT_PUBLIC_BACKEND_URL ??
	"https://glowsafe-production.up.railway.app";

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

type Cached = { data: { quiz: SkinProfile; analysis: QuizInsight }; timestamp: number };
const cache = new Map<string, Cached>();

export type SkinProfileByEmailResult = {
	quiz: SkinProfile;
	analysis: QuizInsight;
};

/**
 * Fetch skin profile + analysis by user email. Uses in-memory cache (5 min TTL).
 * Returns null if not found (404); throws on other errors.
 */
export async function fetchSkinProfileByEmail(
	email: string,
): Promise<SkinProfileByEmailResult | null> {
	const key = email.trim().toLowerCase();
	const now = Date.now();
	const entry = cache.get(key);
	if (entry && now - entry.timestamp < CACHE_TTL_MS) {
		return entry.data;
	}

	const res = await fetch(`${API_BASE_URL}/quiz/skin-profile-by-email`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email }),
	});

	if (res.status === 404) {
		return null;
	}

	if (!res.ok) {
		throw new Error(`Skin profile API error: ${res.status}`);
	}

	const data = (await res.json()) as SkinProfileByEmailResult;
	cache.set(key, { data, timestamp: now });
	return data;
}

/**
 * Invalidate cached skin profile for this email (e.g. after saving/updating).
 */
export function invalidateSkinProfileCache(email: string): void {
	cache.delete(email.trim().toLowerCase());
}
