import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Weather & UV | GlowSafe",
	description:
		"Current weather and UV index for your area. Track temperature and sun safety hour by hour.",
};

export default function WeatherLayout({
	children,
}: { children: React.ReactNode }) {
	return <>{children}</>;
}
