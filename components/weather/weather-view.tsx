"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
	Compass,
	Droplets,
	Gauge,
	Sun,
	Thermometer,
	Wind,
	ArrowLeft,
} from "lucide-react";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Legend,
	ReferenceLine,
} from "recharts";
import {
	type WeatherCurrentResponse,
	fetchWeatherCurrent,
	weatherIconUrl,
} from "@/lib/weather-types";

const UV_LEVELS = [
	{ max: 2, label: "Low", color: "var(--safe)" },
	{ max: 5, label: "Moderate", color: "var(--warning)" },
	{ max: 7, label: "High", color: "var(--warm)" },
	{ max: 11, label: "Very high", color: "var(--alert)" },
	{ max: Infinity, label: "Extreme", color: "var(--destructive)" },
];

function getUvLabel(uvi: number): { label: string; color: string } {
	const level = UV_LEVELS.find((l) => uvi <= l.max);
	return {
		label: level?.label ?? "Extreme",
		color: level?.color ?? "var(--destructive)",
	};
}

type UvCategory = "low" | "moderate" | "high";

function getUvCategory(uvi: number): UvCategory {
	if (uvi <= 2) return "low";
	if (uvi <= 5) return "moderate";
	return "high";
}

function formatTime(ts: number, timezone: string): string {
	return new Date(ts * 1000).toLocaleTimeString("en-AU", {
		timeZone: timezone,
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
	});
}

function formatHour(ts: number, timezone: string): string {
	return new Date(ts * 1000).toLocaleTimeString("en-AU", {
		timeZone: timezone,
		hour: "numeric",
		hour12: true,
	});
}

function formatDate(ts: number, timezone: string): string {
	return new Date(ts * 1000).toLocaleDateString("en-AU", {
		timeZone: timezone,
		weekday: "long",
		day: "numeric",
		month: "long",
		year: "numeric",
	});
}

function Stat({
	icon: Icon,
	label,
	value,
}: {
	icon: React.ComponentType<{ className?: string }>;
	label: string;
	value: string;
}) {
	return (
		<div className="flex items-center gap-3 rounded-xl border border-border bg-background/50 px-4 py-3">
			<Icon className="size-5 shrink-0 text-muted-foreground" />
			<div className="min-w-0">
				<p className="text-xs text-muted-foreground">{label}</p>
				<p className="truncate text-sm font-medium text-foreground">
					{value}
				</p>
			</div>
		</div>
	);
}

export function WeatherView({
	showBackLink = false,
	city = "Melbourne",
	locationControl,
}: {
	showBackLink?: boolean;
	city?: string;
	locationControl?: React.ReactNode;
}) {
	const [data, setData] = useState<WeatherCurrentResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;
		setLoading(true);
		setError(null);
		fetchWeatherCurrent(city)
			.then((res) => {
				if (!cancelled) setData(res);
			})
			.catch((e) => {
				if (!cancelled)
					setError(
						e instanceof Error
							? e.message
							: "Failed to load weather",
					);
			})
			.finally(() => {
				if (!cancelled) setLoading(false);
			});
		return () => {
			cancelled = true;
		};
	}, [city]);

	const backLink = showBackLink ? (
		<Link
			href="/"
			className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
		>
			<ArrowLeft className="size-4" />
			Back
		</Link>
	) : null;

	if (loading) {
		return (
			<>
				{backLink}
				<div className="mt-12 flex flex-col items-center justify-center gap-4 py-20">
					<p className="text-sm text-muted-foreground">
						Loading weather for {city}
					</p>
					<div className="loading-dots flex gap-1"></div>
				</div>
			</>
		);
	}

	if (error || !data) {
		return (
			<>
				{backLink}
				<div className="mt-12 rounded-xl border border-border bg-card p-8 text-center">
					<p className="text-destructive">
						{error ?? "No weather data available."}
					</p>
					<button
						type="button"
						onClick={() => window.location.reload()}
						className="mt-4 text-sm text-accent underline-offset-4 hover:underline"
					>
						Try again
					</button>
				</div>
			</>
		);
	}

	const { current, hourly, timezone } = data;
	const weather = current.weather[0];
	const uvInfo = getUvLabel(current.uvi);

	const chartData = hourly.slice(0, 24).map((h) => ({
		time: formatHour(h.dt, timezone),
		fullTime: formatTime(h.dt, timezone),
		temp: Math.round(h.temp * 10) / 10,
		uvi: Math.round(h.uvi * 10) / 10,
	}));

	return (
		<>
			{backLink}
			<div className="mt-6 flex flex-wrap items-center justify-between gap-4">
				<div>
					<h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
						Weather & UV
					</h1>
					<p className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-sm text-muted-foreground">
						<Compass className="size-4" />
						<span>
							{city} · {timezone.replace("_", " ")}
						</span>
						<span aria-hidden>·</span>
						<span>{formatDate(current.dt, timezone)}</span>
					</p>
				</div>
				{locationControl ? (
					<div className="w-full max-w-xs md:max-w-sm md:w-auto">
						{locationControl}
					</div>
				) : null}
			</div>

			<section className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
				<div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
					<div className="flex items-start gap-4">
						<img
							src={weatherIconUrl(weather.icon, "4x")}
							alt={weather.description}
							className="size-20 shrink-0 md:size-24"
						/>
						<div>
							<p className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
								{Math.round(current.temp)}°
							</p>
							<p className="mt-1 capitalize text-muted-foreground">
								{weather.description}
							</p>
							<p className="mt-0.5 text-sm text-muted-foreground">
								Feels like {Math.round(current.feels_like)}°
							</p>
						</div>
					</div>
					<div
						className="rounded-xl border px-4 py-3 text-center md:min-w-[140px]"
						style={{
							borderColor: uvInfo.color,
							backgroundColor: `${uvInfo.color}15`,
						}}
					>
						<div className="flex items-center justify-center gap-1.5">
							<Sun
								className="size-5"
								style={{ color: uvInfo.color }}
							/>
							<span className="text-sm font-medium text-muted-foreground">
								UV Index
							</span>
						</div>
						<p
							className="mt-1 text-2xl font-bold"
							style={{ color: uvInfo.color }}
						>
							{current.uvi.toFixed(1)}
						</p>
						<p
							className="text-xs font-medium"
							style={{ color: uvInfo.color }}
						>
							{uvInfo.label}
						</p>
					</div>
				</div>
				<div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
					<Stat
						icon={Droplets}
						label="Humidity"
						value={`${current.humidity}%`}
					/>
					<Stat
						icon={Gauge}
						label="Pressure"
						value={`${current.pressure} hPa`}
					/>
					<Stat
						icon={Wind}
						label="Wind"
						value={`${current.wind_speed} m/s`}
					/>
					<Stat
						icon={Thermometer}
						label="Dew point"
						value={`${Math.round(current.dew_point)}°`}
					/>
				</div>
			</section>
			<section className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
				<h2 className="text-lg font-semibold tracking-tight">
					What this UV means for you
				</h2>
				<p className="mt-1 text-sm text-muted-foreground">
					Actions change with the UV level. Here&apos;s what to do
					today.
				</p>
				<UvGuide uvi={current.uvi} />
			</section>

			<section className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
				<h2 className="text-lg font-semibold tracking-tight">
					Hourly forecast
				</h2>
				<p className="mt-1 text-sm text-muted-foreground">
					Temperature and UV index for the next 24 hours
				</p>
				<div className="mt-6 h-[320px] w-full">
					<ResponsiveContainer width="100%" height="100%">
						<LineChart
							data={chartData}
							margin={{ top: 8, right: 8, left: 0, bottom: 8 }}
						>
							<CartesianGrid
								strokeDasharray="3 3"
								className="stroke-border"
							/>
							<XAxis
								dataKey="time"
								tick={{
									fontSize: 11,
									fill: "var(--muted-foreground)",
								}}
								tickLine={false}
								axisLine={{ stroke: "var(--border)" }}
							/>
							<YAxis
								yAxisId="temp"
								orientation="left"
								tick={{
									fontSize: 11,
									fill: "var(--muted-foreground)",
								}}
								tickLine={false}
								axisLine={false}
								tickFormatter={(v) => `${v}°`}
								domain={["dataMin - 2", "dataMax + 2"]}
							/>
							<YAxis
								yAxisId="uvi"
								orientation="right"
								tick={{
									fontSize: 11,
									fill: "var(--muted-foreground)",
								}}
								tickLine={false}
								axisLine={false}
								domain={[0, "dataMax + 1"]}
							/>
							<Tooltip
								contentStyle={{
									backgroundColor: "var(--card)",
									border: "1px solid var(--border)",
									borderRadius: "var(--radius-lg)",
								}}
								labelFormatter={(_, payload) =>
									payload[0]?.payload?.fullTime ?? ""
								}
								formatter={(value, name) => {
									const v =
										value != null ? Number(value) : null;
									return [
										name === "temp"
											? v != null
												? `${v}°C`
												: "—"
											: v != null
												? v.toFixed(1)
												: "—",
										name === "temp" ? "Temp" : "UV Index",
									];
								}}
							/>
							<Legend
								formatter={(value) =>
									value === "temp"
										? "Temperature (°C)"
										: "UV Index"
								}
							/>
							<ReferenceLine
								yAxisId="uvi"
								y={3}
								stroke="var(--warning)"
								strokeDasharray="3 3"
								strokeOpacity={0.7}
							/>
							<Line
								yAxisId="temp"
								type="monotone"
								dataKey="temp"
								stroke="var(--chart-1)"
								strokeWidth={2}
								dot={false}
								activeDot={{ r: 4, fill: "var(--chart-1)" }}
								name="temp"
							/>
							<Line
								yAxisId="uvi"
								type="monotone"
								dataKey="uvi"
								stroke="var(--yellow)"
								strokeWidth={2}
								dot={false}
								activeDot={{ r: 4, fill: "var(--yellow)" }}
								name="uvi"
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>
			</section>
		</>
	);
}

function UvGuide({ uvi }: { uvi: number }) {
	const category = getUvCategory(uvi);

	if (category === "low") {
		return (
			<div className="mt-4 grid gap-6 md:grid-cols-[3fr_2fr] md:items-start">
				<div className="space-y-2">
					<p className="text-sm font-semibold text-safe">
						Low UV (0–2): you&apos;re mostly in the clear
					</p>
					<ul className="list-disc space-y-1.5 pl-5 text-[13px] text-foreground/80">
						<li>
							It&apos;s generally safe to be outside without
							sunscreen for most skin types.
						</li>
						<li>
							Still wear sunglasses to protect your eyes and
							consider a hat if you&apos;re out for a long time.
						</li>
						<li>
							Perfect time for a coffee run, shady walks along
							Southbank, or a lap around the Tan before the UV
							climbs later in the day.
						</li>
						<li>
							If your skin usually burns easily, this is the best
							window to be outdoors without your full sun-safety
							kit.
						</li>
					</ul>
				</div>
				<div className="space-y-2 rounded-xl border border-dashed border-safe/50 bg-safe/5 p-3 text-[12px] text-foreground/80">
					<p className="font-semibold text-safe">
						Want the science (Melbourne edition)?
					</p>
					<p className="mt-1">
						UV below 3 is usually too low to cause sunburn for most
						people. Guidelines from{" "}
						<a
							href="https://www.cancer.org.au/cancer-information/causes-and-prevention/sun-safety/uv-index"
							target="_blank"
							rel="noreferrer"
							className="underline underline-offset-2"
						>
							Cancer Council Australia
						</a>{" "}
						say sun protection isn&apos;t needed unless you&apos;re
						in snow or at altitude. Around Melbourne, that means
						it&apos;s a good time for covered spots like Queen Vic
						Market, ACMI, or the NGV forecourt without worrying
						about intense UV.
					</p>
					<div className="mt-3 aspect-video overflow-hidden rounded-lg border border-safe/40 bg-background md:mt-4">
						<iframe
							title="Low UV and when protection matters"
							src="https://www.youtube.com/embed/-cd9wSM0EEk?rel=0"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; web-share"
							allowFullScreen
							className="h-full w-full"
						/>
					</div>
				</div>
			</div>
		);
	}

	if (category === "moderate") {
		return (
			<div className="mt-4 grid gap-6 md:grid-cols-[3fr_2fr] md:items-start">
				<div className="space-y-2">
					<p className="text-sm font-semibold text-warning">
						Moderate UV (3–5): time to switch protection on
					</p>
					<ul className="list-disc space-y-1.5 pl-5 text-[13px] text-foreground/80">
						<li>
							Apply SPF 50+ to exposed skin 20 minutes before you
							go outside.
						</li>
						<li>
							Add a hat, sunglasses and clothing that covers your
							shoulders if you&apos;ll be out for more than 15–20
							minutes.
						</li>
						<li>
							Choose shady routes and hangouts — think trees in
							Fitzroy Gardens, under the sails at Fed Square, or
							covered laneway cafés.
						</li>
					</ul>
				</div>
				<div className="rounded-xl border border-dashed border-warning/60 bg-warning/5 p-3 text-[12px] text-foreground/80">
					<p className="font-semibold text-warning">
						Quick video explainer
					</p>
					<div className="mt-3 aspect-video overflow-hidden rounded-lg border border-border bg-muted md:mt-4">
						<iframe
							title="Understanding the UV Index"
							src="https://www.youtube.com/embed/-cd9wSM0EEk?rel=0"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; web-share"
							allowFullScreen
							className="h-full w-full"
						/>
					</div>
				</div>
			</div>
		);
	}

	// High and above
	return (
		<div className="mt-4 grid gap-6 md:grid-cols-[3fr_2fr] md:items-start">
			<div className="space-y-2">
				<p className="text-sm font-semibold text-alert">
					High UV (6+): full sun-safety kit needed
				</p>
				<ul className="list-disc space-y-1.5 pl-5 text-[13px] text-foreground/80">
					<li>
						Use SPF 50+ on all exposed skin and reapply every 2
						hours, or after swimming/sweating.
					</li>
					<li>
						Wear a broad-brim hat, close-fitting sunglasses and
						long, lightweight clothing.
					</li>
					<li>
						Try to move outdoor plans to early morning or late
						afternoon; seek shade between 10am–3pm. Aim for spots
						like the NGV courtyard, colonnades along Collins St, or
						shade structures at Southbank instead of open parks at
						midday.
					</li>
				</ul>
			</div>
			<div className="space-y-2 rounded-xl border border-dashed border-alert/70 bg-alert/5 p-3 text-[12px] text-foreground/80">
				<p className="font-semibold text-alert">Why it matters today</p>
				<p className="mt-1">
					At UV 6+, unprotected fair skin can start to burn in under
					15 minutes. Learn more from{" "}
					<a
						href="https://www.sunsmart.com.au/"
						target="_blank"
						rel="noreferrer"
						className="underline underline-offset-2"
					>
						SunSmart Australia
					</a>{" "}
					and keep your protection on whenever the UV Index is 3 or
					above.
				</p>
				<div className="mt-3 aspect-video overflow-hidden rounded-lg border border-border bg-muted md:mt-4">
					<iframe
						title="High UV protection tips"
						src="https://www.youtube.com/embed/-cd9wSM0EEk?rel=0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; web-share"
						allowFullScreen
						className="h-full w-full"
					/>
				</div>
			</div>
		</div>
	);
}
