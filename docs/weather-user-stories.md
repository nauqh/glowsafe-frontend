# Weather Data Track — User Stories

**Kanban:** Epic 3 · US 3.1–3.3 · Acceptance criteria listed under each US. Copy-friendly for board cards. (Skin builder = Epic 1, 2.)

**Naming:** Epic/US = professional, feature/task-style. AC = Given/When/Then.

---

## Epic 3 — Weather and UV data by location

**As a** user (logged in or not), **I want to** see current weather and UV for my area and an hourly forecast, **So that** I can plan my day and know when sun protection is needed.

*User stories:* US 3.1, US 3.2, US 3.3

---

## US 3.1: Display current weather and UV conditions

**As a** user, **I want to** see current temperature, conditions, and UV index for a location **so that** I know what it’s like outside and what the UV risk is right now.

- Given I am on the Weather & UV page (`/weather` or `/profile/weather`) and data has loaded, when I view the page, then I see the location name (e.g. Melbourne), date, and a current-conditions card with temperature, “feels like”, and weather description (e.g. clear sky, overcast).
- Given I am on the Weather & UV page and data has loaded, when I view the current conditions, then I see the current UV index value and a colour-coded level (e.g. Low, Moderate, High, Very high, Extreme) so I can gauge sun risk at a glance.
- Given I am on the Weather & UV page and data has loaded, when I view the stats section, then I see humidity, pressure, wind, and dew point so I have a full snapshot of current conditions.
- Given the weather API request fails or returns an error, when I view the page, then I see a clear error message and a way to try again (e.g. “Try again” button or retry action).

---

## US 3.2: Display hourly temperature and UV forecast

**As a** user, **I want to** see temperature and UV index for the next 24 hours in a chart **so that** I can plan when to be outside and when UV is highest.

- Given I am on the Weather & UV page and data has loaded, when I scroll to the hourly section, then I see a “Hourly forecast” heading and a chart showing temperature and UV index for the next 24 hours (e.g. two lines or series with a legend).
- Given I am viewing the hourly chart, when I hover or focus a point (or use a tooltip), then I can see the time, temperature, and UV value for that hour so I can read exact values.
- Given the chart is displayed, when I view it, then UV is clearly distinguishable (e.g. colour or legend) and I can see when UV peaks (e.g. around midday) so I can plan sun protection.

---

## US 3.3: Expose weather from public and profile routes

**As a** user, **I want to** open Weather & UV from the main nav without logging in, and from my profile when I’m logged in, **so that** I can check UV whenever I need to, from the right place in the app.

- Given I am not logged in and I am on the landing page or any public page, when I use the navigation (e.g. “Weather & UV” link), then I am taken to the Weather & UV page (`/weather`) and I can see current weather and hourly forecast without being asked to log in.
- Given I am logged in and I am on my profile, when I use the profile sidebar (e.g. “Weather & UV”), then I am taken to the Weather & UV view within profile (`/profile/weather`) with the same current and hourly data, so my experience is consistent.
- Given I am on the public Weather page (`/weather`), when I view the page, then I see a way to go back (e.g. “Back” or “Home” link) so I can return to the main site or profile without using the browser back button only.
- Given weather data is still loading, when I view the Weather & UV page, then I see a loading state (e.g. “Loading weather for [city]” or skeleton) so I know data is being fetched and the page is not broken.

