# OncoGuard — UX Design Specification
### Information Architecture, Page Flow & Screen Design — v1

---

## A Note Before We Start

Most "AI health app" briefs ask for Apple Health's calm and Stripe's clarity and stop there. The interesting design problem in OncoGuard isn't the aesthetic — it's a tension buried in the technical report: the system needs to convey **real urgency** (a 21-day escalation window, a CAUTION-framework red flag, a 72/100 lung cancer risk score) to a population that is often **low-literacy, low-connectivity, and historically mistrustful of digital health tools** — without ever tipping into fear, because fear is what makes people close the app and ignore the symptom in the first place.

Every decision below is made in service of one sentence from the brief: *the user should never feel afraid, only informed.* Where that conflicts with a literal reading of the brief (e.g., collecting age twice, or front-loading a permissions dialog), I've made the call that serves the user, and I've flagged why.

This document covers: information architecture, end-to-end page flow, onboarding, the risk assessment flow, the AI report page, and the dashboard — in that order, because that's the order a real user walks through them.

Three companion diagrams ship alongside this doc:
- `oncoguard_information_architecture.mermaid` — full sitemap
- `oncoguard_end_to_end_flow.mermaid` — the complete user journey, including the escalation loop
- `oncoguard_assessment_flow.mermaid` — the assessment step logic, including offline branching

---

## 1. Who We're Designing For

The technical report is explicit that this isn't a general wellness app — it's a screening escalation tool aimed at underserved populations first. Four personas drive every trade-off below:

| Persona | Context | What they need from the UX |
|---|---|---|
| **First-time rural user** (primary) | Low-end Android, 2G/offline stretches, moderate literacy, Hindi-primary | Almost no typing, icon-first choices, works offline, feels trustworthy on first open |
| **Urban preventive-health user** | Smartphone-native, English-primary, checks in periodically like a fitness app | Data depth, trend charts, a habit-forming dashboard |
| **Escalating / returning user** | Has a rising risk score across 2–3 visits, is the 21-day escalation logic's target | Clarity without alarm, one obvious next action, no friction to book screening |
| **Community health worker** *(future — Phase 3 in the roadmap)* | Assists multiple patients, needs a different multi-record view | Not designed in this pass — flagged so today's IA doesn't block it later |

Designing for persona 1 first is what keeps this from becoming "Apple Health with a cancer theme." It's why symptom duration is a chip, not a date picker; why location is GPS-first, not a typed address; why the onboarding never requires a password.

---

## 2. Design Principles

1. **Urgency lives in clarity, not color.** A high-risk score is communicated through *specific, plain-language next steps* ("Screening within 7 days, here's where"), not through red backgrounds or exclamation points. Color is a small accent, never a wash.
2. **Never ask twice.** Every field the assessment needs (age, gender, location) is collected exactly once, at the point it's needed — not duplicated in onboarding and then again in Step 1.
3. **Trust is earned progressively, not declared once.** The 3-layer architecture (rule engine → SHAP → RAG-grounded LLM) is *shown*, not just claimed — in the loading screen, in the report's "why" section, and in a visible sources list citing ICMR/WHO. This directly answers the report's own "Healthcare Mistrust" risk.
4. **Offline is a first-class state, not an error state.** Given the report's 2G/offline-first requirement, every flow that can degrade gracefully (assessment submission, dashboard load) has a designed offline appearance — not a spinner that fails silently.
5. **Progressive disclosure everywhere.** Long legal text, technical SHAP values, and full protocol citations are collapsed by default and one tap away — never dumped on screen at once.
6. **One primary action per screen.** Borrowed directly from Stripe's checkout discipline: every screen has exactly one emphasized button. Everything else is secondary.

---

## 3. Information Architecture

The system splits into three zones: **Public** (pre-auth), **Onboarding** (first-run only, authenticated but not yet "in" the app), and the **App Shell** (the persistent, navigable product).

Full sitemap: see `oncoguard_information_architecture.mermaid`

**Primary navigation — 7 destinations**, matching the brief:
Dashboard · Assessment · Timeline · Reports · AI Assistant · Hospitals · Settings

**Desktop:** persistent left rail, icon + label, Assessment visually treated as the primary/accent item (filled icon, teal background chip) since it's the app's core action — everything else is investigation of that action's output.

**Mobile:** 7 items don't survive a thumb-reachable bottom bar. Collapsed to 5:

| Bottom Nav Slot | Contents |
|---|---|
| Home | Dashboard |
| Timeline | Timeline |
| **+ (center, elevated)** | Start Assessment — the one action that deserves a FAB-style treatment |
| Assistant | AI Assistant |
| More | Reports, Hospitals, Settings |

A **sticky emergency element** persists only when an escalation is active (see §9) — otherwise that space is unused, so it never feels alarmist by default.

---

## 4. End-to-End Page Flow

Full diagram: see `oncoguard_end_to_end_flow.mermaid`

Narrative walkthrough:

1. **Landing Page** (public) → "Start Assessment" is the only CTA that matters; "Learn More" scrolls in-page rather than navigating away, keeping intent-to-assess intact.
2. **Auth check** → if not logged in, **Login/Signup**. If logged in but first visit, **Onboarding**. Otherwise straight to **Dashboard**.
3. **Dashboard** → "Start Assessment" (empty state for new users, or a smaller repeat-CTA for returning users) leads into the **5-step Assessment**.
4. Assessment submit → **Processing** (3-stage, mirrors the real architecture) → **AI Report / Result**.
5. From Result, four branches: **Timeline** (this result is now a milestone), **Reports** (export/print), **AI Assistant** (context-loaded follow-up chat), **Hospital Finder** (deep-linked with cancer type + location prefilled).
6. **Escalation loop:** if the rule engine's 21-day tracking fires (same high-risk symptom reported 3+ times), the Result page and the Dashboard both surface a **Priority Alert** — styled calm, worded direct — with a single tap to Hospitals or a callback request.

This is the one loop the whole product is built around: **assess → understand → act → return**. Every other page (Timeline, Reports, Settings) exists to support that loop, not compete with it.

---

## 5. Onboarding Flow

The brief's login page calls for a glass card, split hero, Google login, language + dark mode toggles. I've kept those elements but reordered *when* they appear, because for persona 1 (first-time rural user), the very first thing that determines whether they trust this app is whether they can **read it and consent to it** — not whether it looks premium.

**Screen 1 — Welcome.** Value prop in one sentence ("Early awareness saves lives"), WHO/ICMR trust marks visible immediately, language selector already available in the top corner — not buried three screens deep. This is a deliberate deviation: a Hindi-primary user shouldn't have to read English to find the language switch.

**Screen 2 — Language & text size.** Large tappable cards (English / हिंदी, more coming), plus a text-size toggle. Two taps, done. This screen exists *before* consent because consent text must be read in the user's language to be meaningful.

**Screen 3 — Consent & Disclaimer.** Non-negotiable, per the technical report's own safety requirements (§12, §16). Written in plain language, one collapsible "read full privacy policy" link, one checkbox ("I understand this is not a diagnosis and I consent to my data being used for my care"), one CTA. This screen cannot be skipped — but it's also *one screen*, not a five-page legal wall.

**Screen 4 — Sign up / Login.** Phone number + OTP as the primary path (no password to remember, no email required — critical for persona 1), with Email/Password and Google Login as secondary options, matching the brief. Split layout with the illustration retained here rather than on screen 1, since by this point the user is committed and the visual polish reinforces "this is a premium, serious product" right before they hand over a phone number.

**Screen 5 — Trust carousel** *(optional, skippable, "Skip" always visible)*. Three cards: "This is not a diagnosis," "How the AI explains itself," "Your data stays private." Reinforces trust without blocking anyone in a hurry.

**Landing on Dashboard:** empty state, single card — "Let's understand your health. Start your first assessment." No 3-card grid of zeros, no charts with no data.

**What I deliberately did *not* do:** ask for age/gender/location during onboarding, or request notification permission upfront. Both are requested exactly once, in context — demographics in Assessment Step 1, and notification permission only *after* the first result, framed as "We'll remind you in 21 days if this symptom continues — want us to notify you?" Just-in-time permission requests convert far better than blanket upfront asks, and they avoid the classic mistake of a health app asking to send notifications before the user has any reason to want one.

---

## 6. Risk Assessment Flow

Full diagram: see `oncoguard_assessment_flow.mermaid`

A persistent step indicator sits at the top of all five steps (Stripe-checkout style: numbered, checkmarked when complete, current step filled, future steps ghosted). One primary "Continue," one text-link "Back." Progress autosaves locally on every field change — a small "Saved" or offline-cloud icon confirms it, directly serving the report's offline-first / 2G requirement. Nothing is lost if the connection drops or the app is closed.

**Step 1 — Basic Information.** Age as a numeric stepper (not a typed field — faster and error-proof on a cracked touchscreen). Gender as icon cards. Location: GPS auto-detect first, with a state/district dropdown fallback for users who decline location access — never a free-text address field, since this feeds directly into the hospital finder later.

**Step 2 — Lifestyle.** Smoking, alcohol, diet, and exercise each as a row of illustrated chips (None / Occasional / Regular / Heavy) rather than sliders or free text — this maps straight onto the rule engine's weighted categories (tobacco type/frequency, per §6 of the tech report) without asking the user to understand what "frequency" means numerically.

**Step 3 — Medical History.** Family history and previous illness as checklists, but critically, every item has an **"I'm not sure"** option alongside Yes/No. Forcing a binary answer on family cancer history is exactly the kind of question that stalls users in low-awareness contexts (the report's own stated problem) — "I'm not sure" is a valid, honest answer and the rule engine can treat it as neutral rather than the user guessing "No" just to move forward.

**Step 4 — Symptoms.** The most detailed step, directly implementing the CAUTION framework. A search bar filters a scrollable list of illustrated symptom cards (a sore that won't heal, unusual bleeding, a lump, a nagging cough...). Toggling a symptom **on** progressively reveals two follow-ups only for that symptom: a **duration** selector (Less than 1 week / 1–3 weeks / More than 3 weeks — matching the rule engine's duration multiplier) and a **severity** slider labeled Mild/Moderate/Severe rather than a bare 1–5 scale. Nothing appears until it's relevant — a 15-symptom checklist with 15 duration pickers open at once would be the single fastest way to lose this user.

**Step 5 — Review.** A clean summary grouped by section, each with an inline "Edit" link back to that exact step (no need to click through 1-2-3-4 again). The non-diagnostic reminder appears once more here, right before submission — the last honest checkpoint before the user commits. Submit is the single large CTA.

**Offline handling:** if the device has no connection at submit time, the flow doesn't block — it runs the rule engine locally (which the report specifies as WASM/JS-capable, <50ms) and shows a **preliminary result immediately**, clearly labeled "Full analysis will complete once you're back online," then silently upgrades to the full SHAP + RAG report on reconnect. This is the single biggest gap in the original brief's loading screen spec — a 3-second animated loading state assumes connectivity that, per the report's own design context, is exactly what this user often doesn't have.

---

## 7. Processing / Loading State

This screen has one job the brief already gets right: make the invisible architecture visible, because that's what builds trust in an AI health tool. I've mapped it 1:1 to the actual 3-layer system rather than generic "Analyzing..." copy:

1. ✓ **Checking clinical guidelines** — the rule engine applying ICMR/WHO weights
2. ✓ **Calculating your personal risk factors** — XGBoost + SHAP
3. ✓ **Grounding your guidance in verified sources** — RAG retrieval against the ICMR protocol base

Each stage completes independently with a soft checkmark animation (200–300ms, no bounce), total ~3 seconds when online. A calm animated node network in the background — abstract, not a spinning DNA helix or a heartbeat monitor, which would tip toward "medical drama" rather than "calm precision."

---

## 8. AI Report / Result Page

This is the page the entire product has to earn trust on, and it's where the "calm even at high risk" principle gets tested hardest. Structure, top to bottom:

**Score card.** A circular progress ring — always rendered in the **primary teal**, regardless of risk tier. Risk tier (Low/Medium/High) is communicated through a small colored *tag* next to the score and through the plain-language headline beneath it ("Your results suggest it's a good time to book a screening"), never through a red-washed card or a giant banner. This is the concrete design answer to the brief's "high risk should still look calm": the ring's color never changes, only a small label does.

| Risk Tier | Score | Tag color (small pill only) | Headline tone |
|---|---|---|---|
| Low | 0–33 | Muted green | "You're doing great — here's what to keep up." |
| Medium | 34–66 | Muted amber | "Worth scheduling a check-up in the next few months." |
| High | 67–100 | Muted red, icon-sized only | "Let's get this looked at soon — here's exactly how." |

**"Why this score?" — three explanation cards.** Each shows an icon, a plain-language factor (not "SHAP value +0.35" but "Your cough has lasted over 3 weeks"), and a relative-weight bar instead of a raw number. Where the model surfaces protective factors (per the report's SHAP output example, e.g. "no family history: −0.10"), those are shown too, in the same calm style — balance matters here; a report that only lists bad news reads as an accusation.

**Recommended action timeline** — Today / Within 7 days / Within 21 days, as a horizontal stepper. This is the user-facing translation of the report's 21-day escalation window: the copy explicitly says *why* — "If this symptom is still present in 3 weeks, we'll check in with you."

**Priority Alert (conditional).** Only appears if the escalation logic has actually fired (same symptom reported 3+ times in 21 days). Styled as a distinct but still muted card with a "Priority" tag and one direct action button ("Call nearest center" / "Book now") — urgency conveyed through *directness of the action*, not visual intensity.

**Hospital finder module.** Embedded map preview, 2–3 nearest centers with distance/rating/directions, "View all" expanding to the full Hospitals page with the cancer type and location already carried over — no re-entering context.

**Lifestyle checklist**, explicitly split into "Things you can change" (tobacco, diet) and "Things to be aware of" (age, family history) — mirroring the report's own modifiable-vs-non-modifiable distinction, and giving the user something actionable rather than a list of unchangeable risk factors.

**Sources — the trust-building payoff.** A collapsed "Guidance based on" section listing the actual retrieved protocols (ICMR Lung Cancer Screening Guidelines, WHO Symptom-Based Referral Criteria) with similarity-backed citations. This single section is the direct UX answer to the report's RAG-grounding investment — most users will never read it, but its mere presence, one tap away, is what separates this from every other symptom-checker app that "just makes stuff up."

**Persistent footer.** A small, permanent, non-modal disclaimer strip: "This is not a diagnosis. Please consult a healthcare professional." Shown as a subtle bar on every visit — except the user's very first-ever result, where it's a one-time confirmation modal, matching the report's "prominent disclaimer on first use" requirement without repeating a modal every single time after that.

---

## 9. Dashboard (Home)

Structure, top to bottom:

**Header.** Personalized greeting ("Good morning, Ujjwal"), one-line status ("Here's your health today"), profile avatar, notification bell (badge only appears for an actual escalation or reminder — never a decorative red dot), language toggle.

**Health overview — three cards.** Current Risk Level (with a small trend arrow if this isn't the first assessment), Last Assessment (date + one-line summary), Next Recommendation (with its own CTA). **First-time empty state** replaces all three with a single wide card: an illustration and "Start your first assessment" — never three cards showing zeros or dashes, which reads as broken rather than new.

**Health Timeline (mini).** A horizontal scrollable strip of milestone dots, one per past assessment, subtly color-coded by tier (same muted-tag logic as the report page). Tapping a dot opens that historical report. This is the same interaction language as Apple Health's activity history — familiar, low-cognitive-load.

**Symptom trends.** Small multi-series charts — weight, smoking status, symptom count, risk score over time — Stripe-dashboard style: minimal axes, generous whitespace, no gridline clutter. These only appear once there are 2+ data points; a chart with a single dot is not a chart, it's noise.

**Right rail** (desktop) / **stacked section below the fold** (mobile): Today's recommendation, upcoming reminder, nearest screening center, and an **AI health insight** — a short natural-language line generated by the same RAG+LLM layer that powers the report ("Your risk factors have improved since your last check — great work cutting back on tobacco"). This is a genuine extension of the architecture beyond the one-time report: it gives the LLM layer an ongoing role in the product, turning the dashboard from a static summary into something that talks back, briefly and usefully, every time the user opens the app.

**Emergency element (mobile only, conditional).** A small sticky bar appears *only* when an escalation is active, offering one tap to the relevant action. When there's no escalation, that space is simply the "+" for a new assessment — the UI never manufactures urgency that isn't there.

---

## 10. Supporting Surfaces (lighter treatment)

- **Timeline** — the full, non-abbreviated version of the dashboard strip: every assessment as a milestone, filterable by cancer type or date range, with escalation events marked distinctly.
- **Reports** — a list view of past reports (same card style as Result page's score card, condensed), each exportable to PDF/print/share; report detail reuses the Result page layout exactly, so there's no new mental model to learn.
- **AI Assistant** — a familiar chat interface (bubbles, suggested questions, voice input), but every answer carries an expandable "Sources" footer (ICMR/WHO/NCCN), matching the Result page's grounding pattern. When entered from a report's "Ask a follow-up" link, the conversation opens pre-loaded with that result's context so the user never has to re-explain their situation.
- **Hospital Finder** — map + list, filterable by cancer type and distance, each card expanding in place for phone/directions rather than navigating away.
- **Settings** — Profile, Language, Privacy & Data (with a visible, one-tap data deletion path — the report's "right to deletion" requirement made concrete), Notifications, Accessibility (text size, screen-reader labels, high-contrast mode).

---

## 11. Escalation & Notification Design (cross-cutting)

The 21-day escalation logic is a backend concept; on the front end it only ever shows up as one consistent visual pattern, used in exactly two places (Result page, Dashboard): a muted "Priority" card with a direct single action. It never becomes a push notification with alarming copy, never a full-screen interrupt, never a red banner. The goal is a user who, three weeks after a first symptom, sees the same calm design language telling them clearly it's time to act — not a system that suddenly starts shouting.

---

## 12. Accessibility & Low-Literacy Considerations

- Icon-first choices everywhere a chip/toggle can replace typed or numeric input.
- A per-question "read aloud" affordance in the Assessment flow (small speaker icon) — a direct, low-cost addition given the report's low-literacy target population; not in the original brief, but justified by persona 1's needs.
- Text-size toggle set during onboarding, respected everywhere.
- AA contrast minimum throughout, large tap targets (44px+), full keyboard navigation, screen-reader labels on every icon-only control.
- All CAUTION-framework symptom names paired with an illustration and a plain-language rephrase, never medical terminology alone.

---

## 13. Design System Quick Reference

**Color — usage rule:** the five accent colors from the brief (teal primary, blue secondary, green/amber/red for tier) are used only as small tags, icons, or thin borders — never as full card or section backgrounds. Backgrounds stay `#F8FAFC` / white throughout, including on High-risk screens.

**Type scale:**

| Level | Size | Weight | Use |
|---|---|---|---|
| Display | 40–56px | 600 | Hero headline, the big risk score number |
| H1 | 28–32px | 600 | Page titles |
| H2 | 20–22px | 600 | Section headers |
| Body | 15–16px | 400 | Paragraphs, form labels |
| Caption | 12–13px | 400–500 | Secondary/meta text |

**Spacing:** 8px base unit; 24/32/48/64px section rhythm.

**Radius:** 12px on buttons/inputs, 16–20px on standard cards, 24px on floating/glass hero cards — per the brief's range, reserving the largest radius for the most premium-feeling surfaces.

**Motion:** 200–300ms ease-out on hover/lift, ease-in-out on step transitions, checkmark completions eased not sprung. Nothing bounces — consistent with "nothing bouncy" in the brief and with the overall calm-clinical tone.

---

## What This Document Doesn't Cover

Pixel-level component specs, the visual design system file, and the actual React implementation are the next phase, not this one. This document is the map that phase should be built from. Happy to move straight into high-fidelity React components (shadcn/ui + Tailwind + Framer Motion, per the brief's stack) for any specific page next — the Result page and Assessment flow are probably the highest-leverage places to start, since they're where the calm-vs-urgency tension actually gets tested.
