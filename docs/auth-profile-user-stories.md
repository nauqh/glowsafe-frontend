# User Authentication and Profile — User Stories

**Kanban:** Epic 4 · US 4.1–4.3 · Acceptance criteria listed under each US. Copy-friendly for board cards. (Skin builder = Epic 1, 2; Weather = Epic 3.)

**Naming:** Epic/US = professional, feature/task-style. AC = Given/When/Then.

---

## Epic 4 — User authentication and profile

**As a** user, **I want to** register, log in, and access a protected profile area with account and sign-out options, **So that** I can save my data to an account and return to it later.

*User stories:* US 4.1, US 4.2, US 4.3

---

## US 4.1: Register and log in

**As a** user, **I want to** create an account and log in with email and password **so that** I can access my profile and have my skin profile persisted to my account.

- Given I am on the landing page or any public page, when I am not logged in, then I see a way to open Log in and Sign up (e.g. in the nav or header).
- Given I open the signup flow, when I submit name, email, and password successfully, then an account is created and I am redirected to the callback URL (e.g. `/profile` or a URL passed as `callbackUrl`).
- Given I open the login flow, when I submit valid email and password, then I am authenticated and redirected to the callback URL (e.g. `/profile` or `callbackUrl`).
- Given I am already logged in and I visit the login or signup page, when the app checks my session, then I am redirected to the callback URL (e.g. `/profile`) so I do not see the form again.
- Given I submit invalid credentials (wrong password or unknown email) on login, when the request fails, then I see a clear error message and can try again without leaving the page.

---

## US 4.2: Access protected profile area

**As a** user who is logged in, **I want to** open the profile area and move between overview, skin profile, habits, and account **so that** I can view and manage my data in one place.

- Given I am logged in, when I navigate to `/profile` (e.g. via “Profile” in the nav or “View profile” CTA), then I see the profile layout with sidebar and overview content (e.g. profile summary card, UV risk, actions).
- Given I am on the profile area, when I use the sidebar, then I can open Overview, Skin Profile, Sun Habits, and Account without being asked to log in again.
- Given I am not logged in, when I try to open any profile route (e.g. `/profile`, `/profile/skin`, `/profile/account`), then I am redirected to a suitable entry point (e.g. `/skin-builder` or login) so I cannot see protected content.
- Given I am on the profile area, when I view the sidebar, then I see my name and email (or a clear identity) so I know which account I am using.

---

## US 4.3: Sign out and account management

**As a** logged-in user, **I want to** sign out and manage my account (view details, clear profile, retake quiz) **so that** I can leave the app securely and control my data.

- Given I am logged in, when I choose to sign out (e.g. from the profile sidebar or Account page), then my session is ended and I am taken to the landing page (or a defined post-logout page).
- Given I am on the Account page (`/profile/account`), when I view it, then I see my account details (e.g. name, email, joined date) and options to sign out, clear profile data, and retake quiz.
- Given I choose to clear my skin profile data from the Account page, when I confirm, then local profile data (e.g. localStorage) is cleared and I remain on the profile area (or am redirected as designed) so I can start fresh or retake the quiz.
- Given I am on the Account page, when I choose to retake the quiz, then I am taken to the skin builder (or profile build intro) so I can update my profile.
