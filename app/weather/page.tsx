"use client";

import { useState } from "react";
import { WeatherView } from "@/components/weather/weather-view";
import { SuburbSelect } from "@/components/weather/suburb-select";

export default function WeatherPage() {
	const [city, setCity] = useState<string>("Melbourne");

	return (
		<div className="min-h-screen bg-background">
			<div className="mx-auto flex max-w-4xl flex-col gap-4 px-5 py-8 md:py-12">
				<WeatherView
					showBackLink
					city={city}
					locationControl={
						<div className="flex items-center gap-2">
							<span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
								Suburb
							</span>
							<SuburbSelect
								value={city}
								onChange={setCity}
								id="weather-suburb"
							/>
						</div>
					}
				/>
			</div>
		</div>
	);
}
