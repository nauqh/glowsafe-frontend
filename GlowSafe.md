### I. Problem statement

Despite Australia having one of the highest rates of skin cancer in the world, a significant proportion of young Australians aged 18-24 are actively seeking sun exposure for aesthetic reasons, underestimating UV risk, and ignoring or misapplying sun protection. This is happening in everyday outdoor settings — beaches, festivals, and social gatherings — where tanning feels normal and even desirable. The health consequences are invisible and years away, while the social rewards of a bronzed appearance are immediate, and existing health campaigns fail to compete with the cultural influence of social media beauty trends. 

How might we help young Australians understand their real UV risk in everyday social settings — so they can make informed choices that protect their skin without disrupting the lifestyle and confidence they are seeking?

### II. Who / What / Where / Why

**Who**
Young Australians aged 18–24 who spend a lot of time outdoors at beaches, festivals, and social gatherings. They grew up with Slip-Slop-Slap but no longer see it as relevant to their lives. They are strongly influenced by TikTok and Instagram beauty trends, see a bronzed appearance as a sign of confidence and social belonging, and genuinely want to feel both good-looking and healthy — they just do not have the right information to do both.

**What**
They are putting themselves at risk without realising it. They apply too little sunscreen, ignore UV warnings, and try DIY tanning methods they find online — not because they do not care, but because no clear, relatable information explains the real danger in a way that connects to their lives. Because the skin damage builds up slowly and invisibly, it never feels like a problem in the moment.

**Where**
In the everyday places that make up their social lives — beaches, festivals, social events, and ordinary settings like walking to class or sitting outside. This also includes overcast days in cities like Melbourne, where UV levels stay dangerously high even when the weather feels cool and cloudy. Most young people do not know this, and existing campaigns do not tell them.

**Why — Why it exists**
Social media rewards bronzed looks and spreads DIY tanning trends while health content gets ignored. Public health campaigns feel repetitive and lecture-like and do not speak to how this age group actually lives. The idea that a tan means you are healthy and attractive is deeply rooted in Australian culture and directly works against sun safety. On top of that, skin cancer feels like something that happens to older people — not to someone in their early twenties — so the risk never feels urgent or real.

### III. Product Concept - What are we building?

GlowSafe is a **web-based** UV awareness and personalised guidance tool for young Australians. It translates real-time UV data from the Bureau of Meteorology into plain-language, personalised daily guidance based on the user's skin type, location, and planned activities. It does not lecture. It speaks to the user's actual goal — looking good and enjoying their social life — and shows them how to do that more safely.

## Scoped Feature Set for 3-Week Onboarding Sprint

The original 7-feature proposal is cut down to 3 core features. These are the only features that should appear on the Leankit board, because the build must match the board exactly.

**Feature 1 — Skin Profile Builder** *(Core)*
A short onboarding quiz where the user selects their skin type, location, and typical outdoor activity. Outputs a personalised UV risk profile stored in the database. This is the foundation everything else is built on.

**Feature 2 — Daily Sun Brief** *(Core)*
The home screen of the app. Pulls real-time UV data from the BOM API for the user's location and translates it into plain-language guidance personalised to their skin type and activity. Flags overcast days where UV is still high. This is the primary daily touchpoint and the most important feature to demonstrate at Expo.

**Feature 3 — Myth Buster** *(Core)*
A simple content section with 5–6 myth cards drawn directly from the empathy map — "I won't burn, I have olive skin", "It is not that hot today", "I will only be out for an hour." Each card addresses the myth with a real Australian data point and ends with a practical, positive alternative. This is lightweight to build and highly impactful to demonstrate.

### Tech Stack

| Component | Technology | Reason |
| --- | --- | --- |
| Frontend | Nextjs / Shadcn UI | Web-based as required by spec — responsive design works on both desktop and mobile browsers |
| Backend | Fastapi | Lightweight API layer for profile management and BOM data processing |
| Database | PostgreSQL via NeonDB | Stores user profiles and skin type data — satisfies mandatory database requirement in spec |
| UV Data | BOM REST API | Real-time UV index data for Australian locations |
| Hosting | Vercel (frontend) + Railway (backend) | Free tiers  |
| Version Control | GitHub | Branch-per-feature, enables orderly and documented code as required by spec |

## Color palette

---

## GlowSafe — Minimal Bright Palette

| Role | Name | Hex | Use |
| --- | --- | --- | --- |
| **Primary** | Sunny Orange | #FF8C42 | Buttons, logo, key highlights |
| **Background** | Clean White | #FFFFFF | App background |
| **Surface** | Soft Yellow | #FFF3CD | Cards and content areas |
| **Safe** | Bright Green | #06D6A0 | Low UV, positive states |
| **Warning** | Amber | #FFB703 | Moderate UV, reminders |
| **Alert** | Coral Red | #EF476F | High UV, overcast alerts |
| **Text** | Near Black | #212121 | All body text |

---

**The logic is simple:**

- White keeps everything clean and uncluttered
- Sunny Orange owns the brand
- Green / Amber / Coral handle the UV traffic light system — immediately readable without explanation
- Soft Yellow adds just enough warmth to the cards so the app never feels cold

Seven colours. Nothing unnecessary. Want me to apply this to a home screen mockup?

References:

---

**1. Aesop — aesop.com**
The closest visual match. Warm cream backgrounds, deep charcoal typography, and a premium editorial feel with no visual clutter. Aesop never uses loud calls to action — it lets the content breathe, which is exactly the tone GlowSafe should aim for. The warmth comes from texture and spacing rather than heavy colour use.

---

**2. Headspace — headspace.com**
A health-purpose product that successfully avoided looking like a government health campaign. Uses warm, approachable illustration and soft colour blocks. Shows that a wellness product can feel both credible and visually inviting — the exact balance GlowSafe needs to strike with Chloe.

---

**3. Frank Body — frankbody.com**
An Australian skincare brand built specifically for young women who discovered it on Instagram. Uses warm amber and coral tones, bold but clean typography, and a tone of voice that feels like a friend rather than a brand. Extremely relevant because Frank Body targets the same demographic as Chloe and has already solved the problem of making skincare feel cool rather than clinical.

---

**4. Native — nativecos.com**
Clean cream backgrounds with warm amber and sage green accents — almost a direct palette match to Direction 1. Shows how sage green can function as a calm, natural accent without tipping into clinical or environmental branding.

---

**5. Ritual — ritual.com**
A supplement brand that makes health feel aspirational rather than medicinal. Uses warm neutrals, elegant typography, and data-backed content delivered in a completely non-scary tone. A strong reference for how GlowSafe should present its UV data — factual but never alarmist.

---

The common thread across all five is that they sell health and wellness without using fear, clinical imagery, or government-style layouts. That is exactly the visual territory GlowSafe needs to occupy.

---


REf: https://www.ogakidigital.com/

**Feature 1 — Skin Profile Builder** *Addresses: Generic health information does not feel personally relevant*

A clean, single-question-per-screen onboarding quiz where the user selects their skin type using warm visual imagery, their Australian location, and their typical outdoor activity. A progress bar keeps the experience feeling quick and focused. The output is a personal UV risk profile card — simple, visual, and stored in the database to drive every other feature in the app.

Without this foundation, every piece of guidance the app delivers is generic. With it, every recommendation feels like it was made specifically for the person reading it. This is the shift from a health campaign to a personal tool — and it happens in under 3 minutes.

---

**Feature 2 — Daily Sun Brief** *Addresses: UV risk is invisible in everyday conditions, especially on overcast days*

The app home screen, updated in real time using BOM API data for the user's specific suburb. UV conditions are broken into four time blocks — morning, midday, afternoon, and evening — each colour-coded using the minimal bright palette so the day is scannable at a glance without reading a single number.

A dedicated overcast day callout appears whenever UV levels are moderate or above despite cool or cloudy conditions — directly targeting the most common and dangerous blind spot among young Australians. The tone is conversational and informative, never alarmist. The user opens the app the way they check the weather and leaves knowing exactly what their day looks like for UV risk.

---

**Feature 3 — Safe Glow Guide** *Addresses: Sun safety feels like it conflicts with lifestyle and aesthetic goals*

A practical, lifestyle-first content section presented as clean scrollable cards with bold headlines and a warm visual tone. Content is framed entirely around achieving a confident, natural-looking result safely — not around avoiding the sun. Topics include how to build a gradual tan without burning, SPF products that suit different skin tones without white cast or greasiness, and how to maintain protection during a full day outdoors without disrupting your look.

This feature exists because the core tension in the problem statement is not a knowledge gap — it is a framing gap. Young Australians disengage from sun safety because it feels like a sacrifice. The Safe Glow Guide reframes it as the smarter way to get what they already want.

---

**Feature 4 — Myth Buster** *Addresses: Social media misinformation is more persuasive than existing health campaigns*

A content section presented in a story-card format. Each card covers one myth in three frames — the myth stated in the user's own words on the first frame, a plain-language rebuttal backed by a real Cancer Council Australia or AIHW data point on the second, and a positive practical alternative on the third. A share button on the final frame allows the card to be sent directly via social media or messaging without leaving the app.

Myths are drawn directly from the empathy map — "I won't burn, I've got olive skin", "It's not that hot today", "I'll only be out for an hour", "Tan lines look good in photos." These are not invented misconceptions. They are the actual beliefs held by the target audience, and they need to be addressed in the same social spaces where they were formed.

---

**Feature 5 — UV Impact Snapshot** *Addresses: The consequences of UV damage feel too distant and abstract to motivate action*

A simple visual tool that shows the user what cumulative UV exposure looks like for their specific skin type over time — and what changes if they start protecting themselves now. Presented as two side-by-side outcomes — current habits versus protected habits — with plain-language descriptions of what shifts and when. Framed entirely as a positive before-and-after, never as damage imagery or a warning.

The insight driving this feature is that skin cancer feels like something that happens to other people, later in life. The UV Impact Snapshot makes the invisible visible — connecting today's small choices to a future the user actually cares about. The data comes from AIHW and Cancer Council research but is always presented as a personal story rather than a population statistic.

---

## Feature Summary

| Feature | Problem It Solves |
| --- | --- |
| Skin Profile Builder | Replaces generic advice with personally relevant guidance |
| Daily Sun Brief | Makes UV risk visible every day including overcast conditions |
| Safe Glow Guide | Resolves the conflict between sun safety and lifestyle goals |
| Myth Buster | Replaces social media misinformation with trusted, sourced content |
| UV Impact Snapshot | Makes long-term consequences personally visible and real |

References: https://flo.health/