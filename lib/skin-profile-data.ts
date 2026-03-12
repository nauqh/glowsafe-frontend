// Shared skin profile types and lookup data (skin-builder + profile page)

export const SKIN_TYPES = [
	{
		id: "1",
		label: "Type 1",
		description:
			"Very fair, always burns and never tans (easily pink after a short time outside).",
		color: "#ffe4d4",
	},
	{
		id: "2",
		label: "Type 2",
		description: "Fair, usually burns and may tan a little after several days.",
		color: "#f5d0c4",
	},
	{
		id: "3",
		label: "Type 3",
		description: "Light–medium, sometimes burns but can build a light tan.",
		color: "#e8b89a",
	},
	{
		id: "4",
		label: "Type 4",
		description: "Medium–olive, rarely burns and tans more easily than it burns.",
		color: "#c99a6e",
	},
	{
		id: "5",
		label: "Type 5",
		description: "Brown, very rarely burns and usually tans deeply.",
		color: "#a67c52",
	},
	{
		id: "6",
		label: "Type 6",
		description: "Deep brown/black, almost never burns but still needs UV protection.",
		color: "#6b4423",
	},
] as const;

export const AUSTRALIAN_LOCATIONS = [
	{ id: "sydney", label: "Sydney", region: "NSW" },
	{ id: "melbourne", label: "Melbourne", region: "VIC" },
	{ id: "brisbane", label: "Brisbane", region: "QLD" },
	{ id: "perth", label: "Perth", region: "WA" },
	{ id: "adelaide", label: "Adelaide", region: "SA" },
	{ id: "darwin", label: "Darwin", region: "NT" },
	{ id: "hobart", label: "Hobart", region: "TAS" },
	{ id: "canberra", label: "Canberra", region: "ACT" },
	{ id: "gold-coast", label: "Gold Coast", region: "QLD" },
	{ id: "newcastle", label: "Newcastle", region: "NSW" },
] as const;

export const OUTDOOR_ACTIVITIES = [
	{ id: "beach", label: "Beach days & swimming", icon: "🏖️" },
	{ id: "sport", label: "Sport, training & games", icon: "⚽" },
	{ id: "walking", label: "Walking, running or hiking", icon: "🥾" },
	{ id: "cycling", label: "Cycling or skating", icon: "🚴" },
	{ id: "gardening", label: "Gardening & backyard time", icon: "🌿" },
	{ id: "work", label: "Work or study mostly outdoors", icon: "👷" },
	{ id: "casual", label: "Casual out & about (campus, cafés, errands)", icon: "☕" },
] as const;

export const BURN_HISTORY_OPTIONS = [
	{ id: "often-burned", label: "I burn easily and often", icon: "🔥" },
	{ id: "sometimes-burned", label: "I sometimes get caught out", icon: "☀️" },
	{ id: "rarely-burned", label: "I rarely burn", icon: "🛡️" },
] as const;

export const WORK_PATTERN_OPTIONS = [
	{ id: "mostly-indoors", label: "Mostly indoors", icon: "🏢" },
	{ id: "mixed", label: "Mix of indoor and outdoor", icon: "🔄" },
	{ id: "mostly-outdoors", label: "Mostly outdoors", icon: "🌞" },
] as const;

export const PEAK_SUN_OPTIONS = [
	{ id: "morning", label: "Morning (before 10am)", icon: "🌅" },
	{ id: "midday", label: "Midday (10am – 2pm)", icon: "☀️" },
	{ id: "afternoon", label: "Afternoon (2pm – 5pm)", icon: "🌇" },
	{ id: "all-day", label: "All day", icon: "📅" },
] as const;

export const SUNSCREEN_FREQ_OPTIONS = [
	{ id: "rarely", label: "Rarely or never" },
	{ id: "sometimes", label: "When I remember" },
	{ id: "most-days", label: "Most days I'm outside" },
	{ id: "every-outdoor-day", label: "Every time I'm outside" },
] as const;

export const PROTECTION_HABIT_OPTIONS = [
	{ id: "hat", label: "Hat", icon: "🧢" },
	{ id: "sunglasses", label: "Sunglasses", icon: "🕶️" },
	{ id: "long-sleeve", label: "Long sleeves / layers", icon: "👕" },
	{ id: "shade-seeker", label: "Seek shade", icon: "⛱️" },
	{ id: "sunscreen-face", label: "Sunscreen on face", icon: "🧴" },
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
	return activityId === "beach" || activityId === "sport" || activityId === "work"
		? 2
		: activityId === "walking" || activityId === "cycling"
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
