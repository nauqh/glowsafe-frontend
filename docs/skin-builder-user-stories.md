# Skin Builder — User Stories

**Kanban:** Epic 1, Epic 2 · US 1.1–2.2 · Acceptance criteria listed under each US. Copy-friendly for board cards.

**Naming:** Epic/US = professional, feature/task-style. AC = Given/When/Then.

---

## Epic 1 — Sun profile creation and submission

**As a** user (logged in or not), **I want to** see what the skin profile builder will ask and complete the quiz with clear progress, **So that** I can get a personalised UV profile without confusion and know when I’m done.

*User stories:* US 1.1, US 1.2, US 1.3

---

## Epic 2 — Profile analysis and persistence

**As a** user who has finished the quiz, **I want to** see my personalised summary and risk level and have my profile saved (in the browser and, when logged in, on my account), **So that** I understand what my profile means, don’t lose my answers, and can see personalised content when I return or sign up.

*User stories:* US 2.1, US 2.2

---

## US 1.1: Profile builder intro and quiz entry

**As a** user, **I want to** see what the skin profile builder will ask and start the quiz from one place **so that** I know what to expect and can begin quickly.

- Given I am on the profile build page (`/profile/build` or `/build`), when I view the page, then I see the heading “Build your sun profile” and a short description that my answers power personalised UV advice and sun-safety tips.
- Given I am on the profile build page, when I scroll the “What you’ll set up” section, then I see four items: Skin type (Fitzpatrick), Location (Victoria), Activities & habits, and Your sun-smart plan, each with a short explanation.
- Given I am on the profile build page, when I click “Start the quiz”, then I am taken to `/skin-builder` and the quiz starts (after the initial loading experience).

---

## US 1.2: Profile quiz completion (required and optional questions)

**As a** user, **I want to** answer skin type, location, activities, and optional habit questions **so that** the app can build a personalised UV profile and recommendations.

- Given I am on the skin builder quiz (`/skin-builder`) and the loading screen has finished, when I view the quiz, then I see 8 numbered questions: skin type, location, outdoor activities, burn history, weekday time outdoors, when I’m usually outside, sunscreen frequency, and what I do in the sun (multi-select where indicated).
- Given I am on the skin builder quiz, when I select a skin type (Fitzpatrick option), then that option is visually selected and the view scrolls to the next question (location).
- Given I am on the skin builder quiz, when I select at least one location and at least one outdoor activity (and optionally answer any of questions 4–8), then I can submit the quiz via “See my profile”.
- Given I have not selected skin type, location, or any activity, when I look at the submit button, then “See my profile” is disabled until I have selected skin type, location, and at least one activity.

---

## US 1.3: Quiz progress and submit state

**As a** user, **I want to** see how much of the quiz I’ve done and when I can finish **so that** I’m not surprised by a disabled submit button.

- Given I am on the skin builder quiz, when the quiz is visible, then a progress bar at the top shows the percentage of the 8 questions that have at least one answer (e.g. 3/8 ≈ 37.5%).
- Given I have answered only skin type and location (no activities), when I scroll to the bottom, then “See my profile” is disabled because at least one activity is required.
- Given I have selected skin type, one location, and at least one activity, when I scroll to the bottom, then “See my profile” is enabled and I can submit.

---

## US 2.1: Display personalised analysis after quiz

**As a** user, **I want to** see a personalised sun-smart summary and risk level right after the quiz **so that** I understand what my profile means.

- Given I have completed the required quiz fields (skin type, location, at least one activity) and clicked “See my profile”, when the backend analysis request succeeds, then I see an analysis loading experience (e.g. typewriter phrases) and then a completion screen.
- Given the completion screen is shown, when I view it, then I see a “We can tell you’re:” line, a personalised “vibe” label, my UV risk level (Low / Moderate / High / Very high), and narrative sections from the analysis.
- Given the completion screen is shown and the narrative has finished (e.g. typewriter complete), when I view the CTAs, then I see options to “Sign up to save this”, “I already have an account”, and “Skip for now and go home”.
- Given I submitted the quiz and the analysis request fails (e.g. network or server error), when the error is handled, then I see a clear message that the personalised analysis could not be loaded and I can try again later.

---

## US 2.2: Persist profile locally and to account

**As a** user, **I want** my quiz answers and analysis saved **so that** I don’t lose them and, if I’m logged in, they’re stored on my account.

- Given I have submitted the quiz and the analysis has been returned, when the app finishes saving, then my skin profile (skin type, location, activities, optional habit fields, UV risk level) is stored in localStorage under the app’s profile key.
- Given I have submitted the quiz and I am logged in (valid session), when the analysis has been returned, then the app also sends my quiz payload and analysis to the backend (e.g. quiz/add-skin-profile) so my profile is persisted to my account.
- Given I am not logged in and I have submitted the quiz, when the analysis is shown, then my profile is still saved in localStorage only, and I can use “Sign up to save this” or “I already have an account” to persist it later.
- Given I have completed the quiz and my profile is saved (localStorage and/or backend), when I go to my profile or skin profile later, then my saved skin type, location, activities, and risk level are used to show personalised content (and no need to re-enter if I had an account and profile was persisted).
