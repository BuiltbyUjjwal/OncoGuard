// sessionStore.js
// Handles saving and loading assessment history from localStorage.
// No server needed — works fully offline.

const STORAGE_KEY = 'oncoguard_sessions'
const MAX_SESSIONS = 20  // keep last 20 assessments per user

// ── Save a new session ───────────────────────────────────
export function saveSession(assessmentResult) {
  const sessions = loadAllSessions()

  const snapshot = {
    id:               Date.now(),
    date:             new Date().toISOString(),
    user_profile:     assessmentResult.user_profile,
    results: assessmentResult.results.map(r => ({
      cancer_type:       r.cancer_type,
      risk_score:        r.risk_score,
      escalation_level:  r.escalation_level,
      red_flag_triggered:r.red_flag_triggered,
      matched_symptom_ids: (r.matched_rules || []).map(m => m.symptom_id),
    })),
    any_red_flag: assessmentResult.any_red_flag,
  }

  sessions.unshift(snapshot)             // newest first
  const trimmed = sessions.slice(0, MAX_SESSIONS)

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
  } catch (e) {
    console.warn('OncoGuard: Could not save session to localStorage.', e)
  }

  return snapshot
}

// ── Load all sessions ────────────────────────────────────
export function loadAllSessions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

// ── Load the previous session (before the current one) ──
export function loadPreviousSession() {
  const sessions = loadAllSessions()
  return sessions.length > 0 ? sessions[0] : null
}

// ── Clear all history ────────────────────────────────────
export function clearAllSessions() {
  localStorage.removeItem(STORAGE_KEY)
}

// ── Detect trends between current and previous session ──
export function detectTrends(currentResult, previousSession) {
  const trends = []

  if (!previousSession || !previousSession.results) return trends

  for (const currentCancer of currentResult.results) {
    const prevCancer = previousSession.results.find(
      r => r.cancer_type === currentCancer.cancer_type
    )

    if (!prevCancer) {
      // This cancer type is newly appearing
      trends.push({
        type:        'new_cancer_type',
        cancer_type: currentCancer.cancer_type,
        severity:    currentCancer.escalation_level === 'urgent_refer' ? 'high' : 'medium',
        message:     `${formatCancer(currentCancer.cancer_type)} symptoms are appearing for the first time in your history.`,
      })
      continue
    }

    // Score increased
    const scoreDiff = currentCancer.risk_score - prevCancer.risk_score
    if (scoreDiff >= 15) {
      trends.push({
        type:        'score_increase',
        cancer_type: currentCancer.cancer_type,
        severity:    scoreDiff >= 30 ? 'high' : 'medium',
        message:     `Your ${formatCancer(currentCancer.cancer_type)} risk score has increased by ${scoreDiff} points since your last assessment.`,
        scoreDiff,
      })
    }

    // Escalation level worsened
    const levels = { monitor: 0, consult: 1, urgent_refer: 2 }
    const prevLevel    = levels[prevCancer.escalation_level] ?? 0
    const currentLevel = levels[currentCancer.escalation_level] ?? 0
    if (currentLevel > prevLevel) {
      trends.push({
        type:        'escalation_worsened',
        cancer_type: currentCancer.cancer_type,
        severity:    'high',
        message:     `Your ${formatCancer(currentCancer.cancer_type)} concern level has escalated from "${formatLevel(prevCancer.escalation_level)}" to "${formatLevel(currentCancer.escalation_level)}".`,
      })
    }

    // Persistent red flag — was red flag last time AND still is now
    if (prevCancer.red_flag_triggered && currentCancer.red_flag_triggered) {
      trends.push({
        type:        'persistent_red_flag',
        cancer_type: currentCancer.cancer_type,
        severity:    'high',
        message:     `A red-flag symptom for ${formatCancer(currentCancer.cancer_type)} was present in your last assessment and is still present. Please seek medical attention urgently.`,
      })
    }

    // New symptoms added since last session
    const prevSymptoms    = new Set(prevCancer.matched_symptom_ids || [])
    const currentSymptoms = (currentCancer.matched_rules || []).map(m => m.symptom_id)
    const newSymptoms     = currentSymptoms.filter(id => !prevSymptoms.has(id))
    if (newSymptoms.length > 0) {
      trends.push({
        type:        'new_symptoms',
        cancer_type: currentCancer.cancer_type,
        severity:    'medium',
        message:     `${newSymptoms.length} new symptom${newSymptoms.length > 1 ? 's' : ''} for ${formatCancer(currentCancer.cancer_type)} have appeared since your last assessment.`,
        newSymptoms,
      })
    }
  }

  // Sort: high severity first
  trends.sort((a, b) => (a.severity === 'high' ? -1 : 1))
  return trends
}

// ── Helpers ──────────────────────────────────────────────
function formatCancer(type) {
  const labels = {
    oral:       'Oral Cancer',
    cervical:   'Cervical Cancer',
    breast:     'Breast Cancer',
    colorectal: 'Colorectal Cancer',
    lung:       'Lung Cancer',
  }
  return labels[type] || type
}

function formatLevel(level) {
  const labels = {
    monitor:      'Monitor',
    consult:      'Consult a Doctor',
    urgent_refer: 'Urgent Referral',
  }
  return labels[level] || level
}
