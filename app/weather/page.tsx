"use client";

import { WeatherView } from "@/components/weather/weather-view";

export default function WeatherPage() {
	return (
		<div className="min-h-screen bg-background">
			<div className="mx-auto max-w-4xl px-5 py-8 md:py-12">
				<WeatherView showBackLink city="Melbourne" />
			</div>
		</div>
	);
}
