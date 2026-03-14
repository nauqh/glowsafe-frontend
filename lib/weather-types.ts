/** Weather condition from OpenWeather-style API */
export interface WeatherCondition {
	id: number;
	main: string;
	description: string;
	icon: string;
}

/** Current weather snapshot */
export interface CurrentWeather {
	dt: number;
	sunrise: number;
	sunset: number;
	temp: number;
	feels_like: number;
	pressure: number;
	humidity: number;
	dew_point: number;
	uvi: number;
	clouds: number;
	visibility: number;
	wind_speed: number;
	wind_deg: number;
	weather: WeatherCondition[];
}

/** Single hourly forecast entry */
export interface HourlyForecast {
	dt: number;
	temp: number;
	feels_like: number;
	pressure: number;
	humidity: number;
	dew_point: number;
	uvi: number;
	clouds: number;
	visibility: number;
	wind_speed: number;
	wind_deg: number;
	wind_gust?: number;
	weather: WeatherCondition[];
	pop: number;
}

/** Full response from /weather/current?city=... */
export interface WeatherCurrentResponse {
	lat: number;
	lon: number;
	timezone: string;
	timezone_offset: number;
	current: CurrentWeather;
	hourly: HourlyForecast[];
}

const WEATHER_BASE =
	process.env.NEXT_PUBLIC_BACKEND_URL ??
	"https://glowsafe-production.up.railway.app";

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const cache = new Map<
	string,
	{ data: WeatherCurrentResponse; timestamp: number }
>();

export async function fetchWeatherCurrent(
	city: string = "Melbourne",
): Promise<WeatherCurrentResponse> {
	const key = city.trim().toLowerCase();
	const now = Date.now();
	const entry = cache.get(key);
	if (entry && now - entry.timestamp < CACHE_TTL_MS) {
		return entry.data;
	}
	const url = `${WEATHER_BASE}/weather/current?city=${encodeURIComponent(city)}`;
	const res = await fetch(url);
	if (!res.ok) throw new Error(`Weather API error: ${res.status}`);
	const data = (await res.json()) as WeatherCurrentResponse;
	cache.set(key, { data, timestamp: now });
	return data;
}

/** OpenWeatherMap icon URL (e.g. 04d → overcast day) */
export function weatherIconUrl(icon: string, size: "2x" | "4x" = "2x"): string {
	return `https://openweathermap.org/img/wn/${icon}@${size}.png`;
}
