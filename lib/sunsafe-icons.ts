/**
 * Sun-safe icon assets (public/sunsafe).
 * Use with Next.js Image: src={sunsafeIcons.handUvProtection} or as img src.
 */
const base = "/sunsafe";

export const sunsafeIcons = {
	// Protection & sunscreen
	sunscreenUvShield: `${base}/sunscreen-uv-shield.png`,
	sunscreenTube: `${base}/sunscreen-tube.png`,
	sunscreenSpf50: `${base}/sunscreen-spf50.png`,
	uvShield: `${base}/uv-shield.png`,
	uvShieldDeflect: `${base}/uv-shield-deflect.png`,
	uvShieldCheck: `${base}/uv-shield-check.png`,
	handSpf: `${base}/hand-spf.png`,
	handUvProtection: `${base}/hand-uv-protection.png`,
	uvIndex: `${base}/uv-index.png`,
	uvReflection: `${base}/uv-reflection.png`,
	uvRaysAbstract: `${base}/uv-rays-abstract.png`,
	uvWarningArrows: `${base}/uv-warning-arrows.png`,
	// Sun & weather
	sunBright: `${base}/sun-bright.png`,
	sunHorizon: `${base}/sun-horizon.png`,
	sunHearts: `${base}/sun-hearts.png`,
	sunSettingHills: `${base}/sun-setting-hills.png`,
	sunClouds: `${base}/sun-clouds.png`,
	sunCloudsAlt: `${base}/sun-clouds-alt.png`,
	sunAbstract: `${base}/sun-abstract.png`,
	sunDanger: `${base}/sun-danger.png`,
	sunWarningTriangle: `${base}/sun-warning-triangle.png`,
	sunUvWarning: `${base}/sun-uv-warning.png`,
	sunWaterWaves: `${base}/sun-water-waves.png`,
	sunPyramid: `${base}/sun-pyramid.png`,
	// People & activity
	personSunscreen: `${base}/person-sunscreen.png`,
	personHatMale: `${base}/person-hat-male.png`,
	personHatFemale: `${base}/person-hat-female.png`,
	peopleSun: `${base}/people-sun.png`,
	personTanning: `${base}/person-tanning.png`,
	personHeatstroke: `${base}/person-heatstroke.png`,
	beachUmbrellaChair: `${base}/beach-umbrella-chair.png`,
	avoidSun: `${base}/avoid-sun.png`,
	// Time & calendar
	clockSun: `${base}/clock-sun.png`,
	clockSunAlt: `${base}/clock-sun-alt.png`,
	calendarSun: `${base}/calendar-sun.png`,
	calendarSunAlt: `${base}/calendar-sun-alt.png`,
	// Misc
	umbrellaWeather: `${base}/umbrella-weather.png`,
	umbrellaRain: `${base}/umbrella-rain.png`,
	heartSun: `${base}/heart-sun.png`,
	smileySunglasses: `${base}/smiley-sunglasses.png`,
	handSunburn: `${base}/hand-sunburn.png`,
} as const;

export type SunsafeIconKey = keyof typeof sunsafeIcons;
