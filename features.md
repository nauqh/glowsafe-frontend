## GlowSafe – Core Features for Onboarding Sprint

This document captures the three scoped features to be built for the onboarding sprint: **Raising Awareness**, **Skin Profile Builder**, and **Daily Sun Brief**. Each feature is framed as an epic with supporting user stories.

---

## Feature 1 — Raising Awareness (Epic 2.0)

**Epic 2.0 – Raising awareness**  
As a young adult, I want to access tools that translate complex Australian UV data into something relatable so that I can empower myself and my social circle to act as sun-safety influencers.

### Problem it solves
- Generic health messaging does not feel personally relevant or socially shareable.
- UV and climate data are abstract numbers that do not translate into day-to-day behavior.
- Young adults are more motivated by visually compelling, sharable stories than by instructions.

### Core experience
- A dedicated **“Australia UV Reality Check” / Awareness Hub** section containing:
  - **Two data visualisations** driven by Australian datasets:
    - **Skin cancer impact** – e.g. incidence or mortality trends over time or relative to other cancers in young people.
    - **Heat / UV trend in Australia** – e.g. number of high/very high/extreme UV days per year or average summer UV index over time.
  - **Plain-language captions** under each chart that summarise the key “so what?” in 1–2 sentences.
  - **Myth-busting cards** linked to what the charts show (e.g. “It’s cloudy so I’m safe”, “Skin cancer only affects older people”), each ending with a positive, practical alternative.
  - **Share actions** (copy link, share image/text) so users can easily send a visual or myth card to friends and become a “hub” for their group.

### What to build

- **Page / route**
  - New page or section, e.g. `app/awareness/page.tsx`, linked from the main nav or landing “How it works”.
- **Visualisation components**
  - `SkinCancerImpactChart` – chart component wired to a static or API-backed dataset of Australian skin cancer stats (by year or by cancer type).  
  - `UvTrendChart` – chart component wired to a dataset of UV/heat trends (e.g. number of high-UV days per year, or average summer UV index).  
  - Both charts should:
    - Accept data via props.
    - Render responsive charts (e.g. using a chart library like Recharts or similar).
    - Show a short caption component under the chart with the key takeaway.
- **Myth-busting UI**
  - `MythCard` + `MythCardList` components that render a list of myths sourced from content/config.  
  - Each card contains:
    - Myth in user language.
    - Fact backed by Australian data (linked conceptually to one of the charts).
    - A positive recommended action.
- **Sharing hooks**
  - Simple share actions on each chart/card:
    - “Copy insight” button that copies a pre-written snippet to clipboard.
    - Optionally use the Web Share API on supported devices.
- **Skin colour & UV explorer (US2.2)**
  - `SkinToneSelector` component with 4–6 tone swatches or simplified Fitzpatrick types.
  - `UvExposurePanel` that, given skin tone and UV level, displays:
    - Relative burn/tan tendency.
    - Approximate time-to-damage ranges (can be based on a static mapping table).
  - Optional “Compare with a friend” mode to quickly switch between two tones.

### User stories

**US2.1 – UV impacts & myths**  
As a young adult, I want to understand Australian UV impacts and skin myths so that I can raise awareness with my friends.

- **Description (Must Have)**:  
  - Show **at least two visualisations** using Australian data: one on the **impacts of skin cancer** and one on the **trend of heat/UV in Australia**.  
  - Pair each visual with short, myth-busting explanations and “send to friends” actions.
- **Benefit**:  
  - Instead of simply telling young adults what to do, we **show the “why” visually**. Understanding the story behind the numbers turns passive instruction into **self-driven, social action**, where UV awareness becomes something they share with their group.

**US2.2 – Skin colour & UV absorption**  
As a young adult, I want to understand the relationship between my skin color and UV absorption so that I can confidently educate my friends and shift our group’s attitude toward sun protection.

- **Description (Should Have)**:  
  - A **customisation tool** that links **skin colour / skin type** with **UV absorption and risk**, rather than generic warnings.  
  - The user selects a skin tone (e.g. simplified Fitzpatrick types), sees how their skin interacts with different UV levels, and can compare with friends’ tones.
- **Benefit**:  
  - Tailored, skin-tone–aware guidance replaces one-size-fits-all messages, supporting **long-term preventative health** over short-term aesthetic trends. It reframes sun protection as something relevant to every shade, not just fair skin.

---

## Feature 2 — Skin Profile Builder

**Epic – Personal UV profile foundation**  
As a young adult, I want to create a quick skin and lifestyle profile so that all UV guidance feels personally relevant rather than generic.

### Problem it solves
- Without a personal profile, all UV messages feel like generic public health campaigns.
- Users do not see how their **own** skin type, location, and habits change their risk.

### Core experience
- A **short, single-question-per-screen onboarding quiz** where the user:
  - Selects their **skin type / tone** using approachable visual imagery.
  - Chooses their **Australian location** and typical outdoor patterns (e.g. “beach days”, “commute & campus”, “festivals & events”).
  - Optionally indicates **past burn history** or sensitivity.
- Outputs a **personal UV Risk Profile card** that is:
  - Simple and visual (risk meter, tone-friendly language).
  - Stored in the database and reused by other features (Daily Sun Brief, Raising Awareness, and future tools).

### Relationship to other features
- The Skin Profile Builder is the **data foundation**:
  - **Daily Sun Brief** uses it to tailor dosage, timing, and clothing advice.
  - **Raising Awareness** and skin-tone visualisations use it to contextualise data to “people like you”.

### What to build

- **Onboarding flow**
  - A multi-step onboarding route, e.g. `app/onboarding/page.tsx`, shown on first visit or via a “Edit profile” entry.
  - Screens:
    - Skin tone / skin type selection (using `SkinToneSelector`-style UI with copy that matches the target audience).
    - Location selection (suburb/region search, or a “Use my location” button if you support geolocation).
    - Typical outdoor behaviour (chips/buttons for “Mostly commuting”, “Beach days”, “Festivals & events”, “Sport”, etc.).
    - Optional sensitivity history (“I usually burn / I tan easily / I rarely burn”).
  - Progress indicator (stepper or progress bar).
- **Profile summary**
  - `ProfileSummaryCard` component that:
    - Shows a friendly name for their skin profile.
    - Explains their sensitivity in one or two lines.
    - Highlights how this profile will be used in the app (Daily Sun Brief, Raising Awareness).
- **Data model & storage**
  - Type/interface for `SkinProfile` (skinType/skinTone, location, behaviour, sensitivity).  
  - API or client-side persistence:
    - POST/PUT endpoint to save profile to your backend (if available), or local storage as a fallback.
  - Hook or context, e.g. `useSkinProfile()`, to read/update the current profile from anywhere in the app.
- **Integration**
  - On completion of onboarding, redirect user to **Daily Sun Brief** with their profile loaded.
  - Awareness and Daily Sun Brief pages read from `useSkinProfile()` instead of hard-coded assumptions.

---

## Feature 3 — Daily Sun Brief (Epic 3.0: Prevention)

**Epic 3.0 – Prevention**  
As a young adult, I want to be able to manage my sunscreen usage and clothing so that I can plan my day outdoors accordingly.

### Problem it solves
- UV Index numbers are hard to translate into concrete actions (how much sunscreen, what to wear, when to reapply).
- Users tend to under-apply sunscreen, forget to reapply, and misjudge cloudy conditions.
- Clothing choices are often driven by comfort or style alone, not by UV protection.

### Core experience
- The **home screen “Daily Sun Brief”** that:
  - Pulls real-time UV data for the user’s location.
  - Breaks the day into **time blocks** (morning, midday, afternoon, evening) with traffic-light colours.
  - For each time block, translates UV level into:
    - **Sunscreen dosage guidance** (quantity, SPF, and coverage zones).
    - **Reapplication timing / reminders**.
    - **Clothing recommendations** for sun-smart fashion.
  - Surfaces **overcast but high-UV conditions** as a specific callout.

### What to build

- **Home screen layout**
  - Use `app/page.tsx` (or similar) as the main **Daily Sun Brief** screen.  
  - Pull in:
    - User profile from `useSkinProfile()`.
    - UV forecast for the current day (from BOM API or mocked data) split into time blocks.
- **Time-block view**
  - `UvTimeBlock` component(s) for morning, midday, afternoon, evening:
    - Displays UV index and a colour-coded severity chip.
    - Shows weather/overcast indication if available.
- **US3.1 – Sunscreen dosage**
  - `SunscreenDosagePanel` per time block that:
    - Reads UV index + skin profile + activity type.
    - Uses a mapping table to compute suggested **teaspoons or pumps** for:
      - Face/neck
      - Arms/shoulders
      - Legs
      - Other exposed areas as needed
    - Renders:
      - Icons or illustrations for body zones.
      - Numeric dosage labels (e.g. “2 pumps”, “1 tsp”).
- **US3.2 – Reminders & tracking**
  - `SunscreenReminderControls`:
    - Toggle to enable/disable reminders.
    - Simple settings (e.g. “Every 2 hours while UV is High+”, “Only between 10am–3pm”).
  - Reminder implementation:
    - In-app timer logic that triggers prompts within the session.
    - Optionally, browser notifications if permissions are granted.
  - `ReapplicationTracker`:
    - Button “I just applied” to log events.
    - Shows last applied time and a simple “covered / needs reapply soon” status, plus optional streak or encouragement.
- **US3.3 – Clothing recommendations**
  - `ClothingAdvicePanel` per time block that:
    - Reads UV + temperature (from weather API or mocked).
    - Looks up a recommendation preset (e.g. “Light long-sleeve shirt + UPF hat + sunnies”).
    - Displays suggestion as:
      - Title (e.g. “Sun-smart outfit for now”).
      - 2–3 bullet points for materials/coverage.
      - Icons or simple outfit illustration styling matching GlowSafe’s visual language.
- **Overcast high-UV callout**
  - A reusable `CloudyButHighUvBanner` that:
    - Appears if UV is moderate+ and conditions are cloudy/cool.
    - Contains a short message and CTA (e.g. “See why cloudy days can still burn you” linking to Awareness).
- **Data & error states**
  - Loading skeletons for UV data.
  - Fallback copy if the API fails (e.g. “We couldn’t fetch live UV, here’s general guidance based on your profile”).

### User stories

**US3.1 – UV to sunscreen dosage**  
As a young adult, I want to translate UV Index numbers into “sunscreen dosage” so that I can confidently protect myself against Australian UV levels without the guesswork.

- **Description (Should Have)**:  
  - For each time block, calculate an **estimated amount of sunscreen** needed, expressed in **teaspoons or pumps**, based on:  
    - UV index band,  
    - user’s stored skin profile,  
    - exposed body areas (e.g. “beach day” vs “commute”).  
  - Present this as clear, visual guidance (e.g. icons of pumps/teaspoons per body area).
- **Benefit**:  
  - Converts abstract UV numbers into **tangible, easy-to-follow actions**. Knowing that “UV 11 = X pumps for you” removes guesswork and bridges the gap between awareness and behaviour.

**US3.2 – Sunscreen reminders & sharing**  
As a young adult, I would like to track my sunscreen reminders so that I can raise awareness with my friends.

- **Description (Should Have)**:  
  - Allow the user to **set and manage reminders** to apply and reapply sunscreen at critical intervals (e.g. every 2 hours or based on UV/time-of-day).  
  - Show a simple **“reapplied today” streak or log**, with the option to share a reapplication moment or challenge with friends.
- **Benefit**:  
  - Timely prompts close the **“vulnerability window”** that leads to late-day sun damage. Turning reminders into something they can share with friends makes reapplication a **collective social habit** rather than a solitary chore.

**US3.3 – Clothing recommendations by UV**  
As a young adult, I want to select the appropriate clothing to wear depending on the UV index so that I can protect my skin from the sun.

- **Description (Must Have)**:  
  - Based on UV index and temperature, suggest **specific clothing options** for each time block, such as:  
    - sleeve length, fabric weight, UPF fabrics, hats, and sunglasses.  
  - Emphasise **“sun-smart fashion”**: options that are protective but still comfortable and aesthetically aligned with young adults’ preferences.
- **Benefit**:  
  - Helps users choose outfits that balance **thermal comfort, style, and UV protection**. It teaches them how to build a personal “sun-smart wardrobe” that feels empowering instead of restrictive.

---

## Summary

- **Raising Awareness** turns complex Australian UV and climate data into compelling, shareable visuals and myth-busting tools.  
- **Skin Profile Builder** creates the personalised foundation that makes every recommendation feel relevant.  
- **Daily Sun Brief** is the prevention engine that translates UV data into concrete daily actions: sunscreen dosage, reminders, and clothing choices.

