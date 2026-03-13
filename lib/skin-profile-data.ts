// Shared skin profile types and lookup data (skin-builder + profile page)
// Skin type ids "1"-"6" map to Fitzpatrick scale for risk logic; labels are plain-language only.

export const SKIN_TYPES = [
	{
		id: "1",
		label: "Burns easily, rarely tans",
		description: "Very fair skin that goes pink quickly in the sun.",
		color: "#ffe4d4",
	},
	{
		id: "2",
		label: "Burns first, then tans a little",
		description: "Fair skin that usually burns before any tan appears.",
		color: "#f5d0c4",
	},
	{
		id: "3",
		label: "Sometimes burns, tans gradually",
		description: "Light to medium skin that can burn but builds a light tan.",
		color: "#e8b89a",
	},
	{
		id: "4",
		label: "Rarely burns, tans easily",
		description: "Medium or olive skin that tans more easily than it burns.",
		color: "#c99a6e",
	},
	{
		id: "5",
		label: "Almost never burns, tans deeply",
		description: "Brown skin that rarely burns and tans deeply.",
		color: "#a67c52",
	},
	{
		id: "6",
		label: "Never burns (very dark skin)",
		description: "Very dark skin; still needs UV protection.",
		color: "#6b4423",
	},
] as const;

// Victoria regions — feeds into BOM API for UV data.
export const AUSTRALIAN_LOCATIONS = [
	{ id: "melbourne-metro", label: "Melbourne Metro", region: "Victoria" },
	{ id: "mornington-peninsula", label: "Mornington Peninsula", region: "Victoria" },
	{ id: "geelong", label: "Geelong", region: "Victoria" },
	{ id: "ballarat", label: "Ballarat", region: "Victoria" },
	{ id: "bendigo", label: "Bendigo", region: "Victoria" },
	{ id: "gippsland", label: "Gippsland", region: "Victoria" },
	{ id: "hume", label: "Hume (Albury–Wodonga, etc.)", region: "Victoria" },
	{ id: "barwon-south-west", label: "Barwon & South West", region: "Victoria" },
	{ id: "loddon-mallee", label: "Loddon Mallee", region: "Victoria" },
] as const;

export const OUTDOOR_ACTIVITIES = [
	{ id: "beach-pool", label: "Beach or pool days", icon: "🏖️" },
	{ id: "festivals-events", label: "Festivals and outdoor events", icon: "🎪" },
	{ id: "walking-commuting", label: "Walking or commuting", icon: "🥾" },
	{ id: "exercise-sport", label: "Exercise / sport", icon: "⚽" },
	{ id: "working-outdoors", label: "Working outdoors", icon: "👷" },
	{ id: "outdoor-dining", label: "Sitting in outdoor dining / social settings", icon: "☕" },
] as const;

// Extended profile (saved to /profile/habits)
export const BURN_HISTORY_OPTIONS = [
	{ id: "never", label: "Never", icon: "✨" },
	{ id: "once-twice", label: "Once or twice", icon: "🌤️" },
	{ id: "a-few-times", label: "A few times", icon: "☀️" },
	{ id: "regularly", label: "Regularly", icon: "🔥" },
] as const;

export const WORK_PATTERN_OPTIONS = [
	{ id: "almost-none", label: "Almost none — mostly indoors", icon: "🏢" },
	{ id: "under-hour", label: "Under an hour", icon: "⏱️" },
	{ id: "1-3-hours", label: "1–3 hours", icon: "🔄" },
	{ id: "more-than-3", label: "More than 3 hours", icon: "🌞" },
] as const;

export const PEAK_SUN_OPTIONS = [
	{ id: "morning", label: "Morning (before 10am)", icon: "🌅" },
	{ id: "midday", label: "Midday (10am–2pm)", icon: "☀️" },
	{ id: "afternoon", label: "Afternoon (2pm–5pm)", icon: "🌇" },
	{ id: "evening", label: "Evening (after 5pm)", icon: "🌆" },
	{ id: "varies", label: "It varies a lot", icon: "📅" },
] as const;

export const SUNSCREEN_FREQ_OPTIONS = [
	{ id: "rarely", label: "Rarely or never" },
	{ id: "sometimes", label: "Only at the beach or on obviously hot days" },
	{ id: "most-days", label: "Most sunny days" },
	{ id: "every-outdoor-day", label: "Every day, regardless of weather" },
] as const;

export const PROTECTION_HABIT_OPTIONS = [
	{ id: "hat", label: "Wear a hat", icon: "🧢" },
	{ id: "sunglasses", label: "Wear sunglasses", icon: "🕶️" },
	{ id: "shade-seeker", label: "Seek shade when possible", icon: "⛱️" },
	{ id: "long-sleeve", label: "Wear long sleeves or sun-protective clothing", icon: "👕" },
	{ id: "reapply-sunscreen", label: "Reapply sunscreen during the day", icon: "🧴" },
	{ id: "not-much", label: "Honestly, not much", icon: "😅" },
] as const;

export type SkinTypeId = (typeof SKIN_TYPES)[number]["id"];
export type LocationId = (typeof AUSTRALIAN_LOCATIONS)[number]["id"];
export type ActivityId = (typeof OUTDOOR_ACTIVITIES)[number]["id"];
export type BurnHistory = (typeof BURN_HISTORY_OPTIONS)[number]["id"];
export type WorkPattern = (typeof WORK_PATTERN_OPTIONS)[number]["id"];
export type PeakSunExposure = (typeof PEAK_SUN_OPTIONS)[number]["id"];
export type SunscreenFrequency = (typeof SUNSCREEN_FREQ_OPTIONS)[number]["id"];
export type ProtectionHabit = (typeof PROTECTION_HABIT_OPTIONS)[number]["id"];

export type SkinProfile = {
	skinTypeId: SkinTypeId;
	locationId: LocationId;
	activityIds: ActivityId[];
	uvRiskLevel: "low" | "moderate" | "high" | "very-high";
	burnHistory?: BurnHistory;
	workPattern?: WorkPattern;
	peakSunExposure?: PeakSunExposure;
	sunscreenFrequency?: SunscreenFrequency;
	protectionHabits?: ProtectionHabit[];
};

function getActivityRisk(activityId: ActivityId): number {
	return activityId === "beach-pool" || activityId === "exercise-sport" || activityId === "working-outdoors"
		? 2
		: activityId === "walking-commuting" || activityId === "festivals-events"
			? 1
			: 0;
}

export function getUvRiskLevel(
	skinTypeId: SkinTypeId,
	_locationId: LocationId,
	activityIds: ActivityId[],
): SkinProfile["uvRiskLevel"] {
	const skinRisk = Number(skinTypeId) <= 3 ? 2 : 1;
	const activityRisk =
		activityIds.length === 0 ? 0 : Math.max(...activityIds.map(getActivityRisk));
	const score = skinRisk + activityRisk;
	if (score >= 4) return "very-high";
	if (score >= 3) return "high";
	if (score >= 2) return "moderate";
	return "low";
}

export const UV_RISK_LABELS: Record<SkinProfile["uvRiskLevel"], string> = {
	low: "Low",
	moderate: "Moderate",
	high: "High",
	"very-high": "Very high",
};

export const UV_RISK_STYLES: Record<
	SkinProfile["uvRiskLevel"],
	{ bg: string; text: string }
> = {
	low: { bg: "bg-safe/20", text: "text-safe" },
	moderate: { bg: "bg-warning/20", text: "text-warning" },
	high: { bg: "bg-warm/20", text: "text-warm" },
	"very-high": { bg: "bg-alert/20", text: "text-alert" },
};

export const PROFILE_STORAGE_KEY = "glowsafe_skin_profile";
export const USER_EMAIL_STORAGE_KEY = "glowsafe_user_email";

export type QuizInsightSection = {
	heading: string;
	body: string;
};

export type QuizInsight = {
	vibe: { hex: string; label: string };
	sections: QuizInsightSection[];
};

export const PROFILE_INSIGHT_STORAGE_KEY = "glowsafe_skin_profile_insight";
export const PROFILE_PERSISTED_STORAGE_KEY = "glowsafe_skin_profile_persisted";
