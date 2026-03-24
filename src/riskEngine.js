// riskEngine.js
// Drop this file into your project's /src folder

import kb from "./symptoms_kbv2.json";

/**
 * Main function — call this when the user submits the symptom form.
 *
 * @param {Object} userProfile
 *   {
 *     age: 38,                          // number
 *     sex: "F",                         // "M", "F", or "all"
 *     reportedSymptoms: ["OC-001", "CC-002"],  // array of Symptom_IDs the user ticked
 *     reportedRiskFactors: ["tobacco chewing", "smoking"]  // array of strings from intake form
 *   }
 *
 * @returns {Object} result — the full risk assessment
 */
export function computeRiskProfile(userProfile) {

  const { age, sex, reportedSymptoms, reportedRiskFactors } = userProfile;

  // We'll collect results per cancer type
  const cancerResults = {};

  for (const rule of kb.rules) {

    // ── GATE 1: Does this rule apply to this user's sex? ──────────────────
    if (rule.applies_to_sex !== "all" && rule.applies_to_sex !== sex) {
      continue; // skip — wrong sex
    }

    // ── GATE 2: Does this rule apply to this user's age? ──────────────────
    const [minAge, maxAge] = parseAgeRange(rule.applies_to_age_range);
    if (age < minAge || age > maxAge) {
      continue; // skip — outside age range
    }

    // ── GATE 3: Did the user report this symptom? ─────────────────────────
    if (!reportedSymptoms.includes(rule.symptom_id)) {
      continue; // skip — symptom not reported
    }

    // ── This rule MATCHES. Now evaluate it. ───────────────────────────────

    // Initialise this cancer type's result object if first match
    if (!cancerResults[rule.cancer_type]) {
      cancerResults[rule.cancer_type] = {
        cancer_type:        rule.cancer_type,
        matched_rules:      [],
        raw_score:          0,
        red_flag_triggered: false,
        escalation_level:   "monitor",
      };
    }

    const result = cancerResults[rule.cancer_type];

    // Check if any of the user's risk factors match this rule's risk factors
    const riskFactorMatch = rule.associated_risk_factors.some(rf =>
      reportedRiskFactors.some(urf =>
        urf.toLowerCase().includes(rf.toLowerCase().split("(")[0].trim())
      )
    );

    // Add weight to score:
    // Full weight if risk factor matches OR if symptom alone triggers
    // Half weight if symptom alone does NOT trigger and no risk factor match
    const scoreContribution = (riskFactorMatch || rule.symptom_alone_triggers)
      ? rule.weight
      : rule.weight * 0.5;

    result.raw_score += scoreContribution;
    result.matched_rules.push({
      symptom_id:            rule.symptom_id,
      symptom_display_label: rule.symptom_display_label,
      escalation_action:     rule.escalation_action,
      plain_language_reason: rule.plain_language_reason,
      red_flag:              rule.red_flag,
      risk_factor_matched:   riskFactorMatch,
      score_contribution:    scoreContribution,
    });

    // Red flag override — forces urgent_refer regardless of score
    if (rule.red_flag) {
      result.red_flag_triggered = true;
      result.escalation_level   = "urgent_refer";
    }
  }

  // ── FINAL SCORING: Normalise and assign escalation levels ─────────────
  const MAX_POSSIBLE_SCORE = 1.0; // weights are 0–1; clamp at 1.0
  const finalResults = [];

  for (const cancerType in cancerResults) {
    const result = cancerResults[cancerType];

    // Normalise to 0–100
    result.risk_score = Math.min(
      Math.round((result.raw_score / MAX_POSSIBLE_SCORE) * 100),
      100
    );

    // Only assign escalation level if red flag hasn't already forced it
    if (!result.red_flag_triggered) {
      if (result.risk_score >= 70) {
        result.escalation_level = "urgent_refer";
      } else if (result.risk_score >= 40) {
        result.escalation_level = "consult";
      } else {
        result.escalation_level = "monitor";
      }
    }

    // Pick the highest-priority escalation action to show first
    result.primary_action = result.matched_rules
      .sort((a, b) => b.score_contribution - a.score_contribution)[0]
      .escalation_action;

    finalResults.push(result);
  }

  // Sort results: urgent_refer first, then consult, then monitor
  const order = { urgent_refer: 0, consult: 1, monitor: 2 };
  finalResults.sort((a, b) => order[a.escalation_level] - order[b.escalation_level]);

  return {
    user_profile: userProfile,
    assessment_date: new Date().toISOString(),
    results: finalResults,         // one object per cancer type triggered
    any_red_flag: finalResults.some(r => r.red_flag_triggered),
    disclaimer: kb.metadata.disclaimer,
  };
}

// ── HELPER: Parse "30+" or "25-65" or "all ages" into [min, max] ─────────
function parseAgeRange(rangeStr) {
  if (!rangeStr || rangeStr === "all ages") return [0, 120];
  if (rangeStr.includes("+")) return [parseInt(rangeStr), 120];
  if (rangeStr.includes("-")) {
    const parts = rangeStr.split("-").map(Number);
    return [parts[0], parts[1]];
  }
  return [0, 120];
}




// ## Where Does This Live and How Do You Run It?
// ```
// Your Project Folder/
// ├── src/
// │   ├── symptoms_kb.json      ← the file I just gave you (copy here)
// │   ├── riskEngine.js         ← the file above (create this in VS Code)
// │   ├── App.jsx               ← your React app (not built yet)
// │   └── components/           ← UI components (not built yet)
// ├── package.json
// └── index.html