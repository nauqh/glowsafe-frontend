# Quiz response payload for LLM

This document describes the JSON payload produced by the Skin Builder quiz. Use it when sending user responses to an LLM to generate personalised sun-safety advice, myth-buster content, or recommendations.

## Payload shape

The payload matches the `SkinProfile` type. All fields from the quiz are included; optional (extended) fields may be omitted if the user has not reached those steps or left them unset.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `skinTypeId` | string | Yes | Fitzpatrick-style skin type; `"1"` (most sensitive) to `"6"` (least). |
| `locationId` | string | Yes | Victoria region; used for location-based UV/advice. |
| `activityIds` | string[] | Yes | IDs of outdoor activities selected (multi-select). |
| `uvRiskLevel` | string | Yes | Derived risk: `"low"` \| `"moderate"` \| `"high"` \| `"very-high"`. |
| `burnHistory` | string | No | Sunburn history. |
| `workPattern` | string | No | Typical weekday time outdoors. |
| `peakSunExposure` | string | No | When they are usually outside. |
| `sunscreenFrequency` | string | No | How often they apply sunscreen before going out. |
| `protectionHabits` | string[] | No | IDs of protection habits (multi-select). |

---

## Valid values (option IDs)

Use these when validating or interpreting the payload.

- **skinTypeId:** `"1"` \| `"2"` \| `"3"` \| `"4"` \| `"5"` \| `"6"`
- **locationId:** `"melbourne-metro"` \| `"mornington-peninsula"` \| `"geelong"` \| `"ballarat"` \| `"bendigo"` \| `"gippsland"` \| `"hume"` \| `"barwon-south-west"` \| `"loddon-mallee"`
- **activityIds** (any of): `"beach-pool"` \| `"festivals-events"` \| `"walking-commuting"` \| `"exercise-sport"` \| `"working-outdoors"` \| `"outdoor-dining"`
- **uvRiskLevel:** `"low"` \| `"moderate"` \| `"high"` \| `"very-high"`
- **burnHistory:** `"never"` \| `"once-twice"` \| `"a-few-times"` \| `"regularly"`
- **workPattern:** `"almost-none"` \| `"under-hour"` \| `"1-3-hours"` \| `"more-than-3"`
- **peakSunExposure:** `"morning"` \| `"midday"` \| `"afternoon"` \| `"evening"` \| `"varies"`
- **sunscreenFrequency:** `"rarely"` \| `"sometimes"` \| `"most-days"` \| `"every-outdoor-day"`
- **protectionHabits** (any of): `"hat"` \| `"sunglasses"` \| `"shade-seeker"` \| `"long-sleeve"` \| `"reapply-sunscreen"` \| `"not-much"`

---

## Sample JSON payload

**Minimal (core 3 steps only):**

```json
{
  "skinTypeId": "2",
  "locationId": "melbourne-metro",
  "activityIds": ["beach-pool", "walking-commuting", "outdoor-dining"],
  "uvRiskLevel": "moderate"
}
```

**Full (all 8 steps completed):**

```json
{
  "skinTypeId": "2",
  "locationId": "melbourne-metro",
  "activityIds": ["beach-pool", "walking-commuting", "outdoor-dining"],
  "uvRiskLevel": "moderate",
  "burnHistory": "once-twice",
  "workPattern": "under-hour",
  "peakSunExposure": "midday",
  "sunscreenFrequency": "sometimes",
  "protectionHabits": ["hat", "sunglasses", "shade-seeker"]
}
```

**Another full example (higher risk, different habits):**

```json
{
  "skinTypeId": "1",
  "locationId": "mornington-peninsula",
  "activityIds": ["beach-pool", "festivals-events", "exercise-sport"],
  "uvRiskLevel": "high",
  "burnHistory": "a-few-times",
  "workPattern": "1-3-hours",
  "peakSunExposure": "midday",
  "sunscreenFrequency": "sometimes",
  "protectionHabits": ["sunglasses", "not-much"]
}
```

> **Note:** Always use the option IDs from the “Valid values” table in API payloads; labels are for display or for building LLM prompts.

---

## Human-readable labels (for prompts)

When building an LLM prompt, you may want to send labels instead of or in addition to IDs. Reference data:

- **Skin types:** Burns easily rarely tans; Burns first then tans a little; Sometimes burns tans gradually; Rarely burns tans easily; Almost never burns tans deeply; Never burns (very dark skin).
- **Locations:** Melbourne Metro, Mornington Peninsula, Geelong, Ballarat, Bendigo, Gippsland, Hume, Barwon & South West, Loddon Mallee.
- **Activities:** Beach or pool days; Festivals and outdoor events; Walking or commuting; Exercise / sport; Working outdoors; Sitting in outdoor dining / social settings.
- **Burn history:** Never; Once or twice; A few times; Regularly.
- **Work pattern:** Almost none — mostly indoors; Under an hour; 1–3 hours; More than 3 hours.
- **Peak sun:** Morning (before 10am); Midday (10am–2pm); Afternoon (2pm–5pm); Evening (after 5pm); It varies a lot.
- **Sunscreen:** Rarely or never; Only at the beach or on obviously hot days; Most sunny days; Every day regardless of weather.
- **Protection habits:** Wear a hat; Wear sunglasses; Seek shade when possible; Wear long sleeves or sun-protective clothing; Reapply sunscreen during the day; Honestly not much.

---

## Usage for LLM

- **Input:** Send the JSON payload (and optionally labels) in your system or user message so the model has full context.
- **Personalisation:** Use `skinTypeId`, `uvRiskLevel`, and `activityIds` for baseline risk and activity-focused advice.
- **Myth busters:** e.g. `sunscreenFrequency: "sometimes"` + `peakSunExposure: "midday"` can trigger the “overcast day” myth card.
- **Location:** Use `locationId` for location-specific UV or weather context (e.g. BOM data).

Source: `lib/skin-profile-data.ts` (types and option lists), quiz save logic in `app/skin-builder/page.tsx`.
