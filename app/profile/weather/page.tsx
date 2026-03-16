"use client";

import { useState } from "react";
import { WeatherView } from "@/components/weather/weather-view";
import { SuburbSelect } from "@/components/weather/suburb-select";

export default function ProfileWeatherPage() {
	const [city, setCity] = useState<string>("Melbourne");

	return (
		<WeatherView
			city={city}
			locationControl={
				<div className="flex items-center gap-2">
					<span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
						Suburb
					</span>
					<SuburbSelect
						value={city}
						onChange={setCity}
						id="profile-weather-suburb"
					/>
				</div>
			}
		/>
	);
}
