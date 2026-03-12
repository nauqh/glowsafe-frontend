## Feature 1 — Skin Profile Builder

---

**Epic 1.0 — Profile Creation***As a new user, I want to set up a personal skin profile so that the app can deliver UV advice specific to my skin type and lifestyle rather than generic health warnings.*

---

**US 1.1** As a new user opening GlowSafe for the first time, I want to complete a short onboarding quiz so that the app can build a personalised UV risk profile for me.

**Description:** Must Have. A single-question-per-screen onboarding quiz where the user selects their skin type using plain visual imagery, their Australian location, and their typical outdoor activity. Output is a personalised UV risk profile stored in the database. Progress bar displayed throughout so the user always knows how close they are to finishing.

**Benefit:** Transforms GlowSafe from a generic health tool into a personal one. When advice is anchored to the user's own skin type and suburb, it becomes impossible to dismiss as something meant for someone else.

---

**US 1.2** As a new user who has completed the quiz, I want to see my personalised UV risk profile card immediately after finishing so that I understand what my risk level means for my skin.

**Description:** Must Have. On quiz completion, a profile card is generated and displayed within 3 seconds showing the user's skin type, location, typical activity, and assigned UV risk level. Profile data is saved to the skin_profiles table in the database and used to drive all recommendations across the app.

**Benefit:** Gives the user an immediate, tangible result from completing the quiz. The profile card makes the personalisation visible and creates a moment of personal recognition that motivates continued engagement with the app.

---

**Epic 2.0 — Profile Management***As a returning user, I want to manage and update my skin profile so that my recommendations stay accurate as my location or lifestyle changes.*

---

**US 2.1** As a returning user, I want to edit my skin profile details so that my UV advice stays relevant if my situation changes.

**Description:** Must Have. An edit profile screen accessible from settings. Any updated field — skin type, location, or outdoor activity — immediately refreshes the Daily Sun Brief and all associated recommendations. Changes are saved to the skin_profiles table and reflected across the app within 3 seconds. Database.

**Benefit:** Keeps the app useful beyond the first session. A user who moves suburb or changes their routine can continue receiving relevant advice without needing to create a new account or start over.

---

**US 2.2** As a returning user, I want my previously saved profile to load automatically when I open the app so that I do not have to re-enter my details every session.

**Description:** Must Have. On login, the app reads the user's existing profile from the skin_profiles table and pre-populates all personalised content without prompting the user to repeat the quiz. If no profile exists, the user is directed to the onboarding quiz. Database.

**Benefit:** Removes friction from repeat usage. A user who has to re-enter their details every time they open the app will stop opening it. Persistent profile loading is the baseline expectation for any personalised app experience.