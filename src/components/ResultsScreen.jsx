import { useEffect, useState } from 'react'

// Maps escalation level to display config
const ESCALATION_CONFIG = {
  urgent_refer: {
    tag:       '🔴 Urgent — Seek Screening Now',
    className: 'urgent',
    scoreColor:'urgent',
    title:     'High Concern Detected',
    subtitle:  'One or more red-flag symptoms were identified. Please seek medical screening as soon as possible.',
  },
  consult: {
    tag:       '🟡 Consult a Doctor',
    className: 'consult',
    scoreColor:'consult',
    title:     'Moderate Concern Detected',
    subtitle:  'Your symptom profile warrants a professional evaluation within 1–2 weeks.',
  },
  monitor: {
    tag:       '🟢 Monitor & Recheck',
    className: 'monitor',
    scoreColor:'monitor',
    title:     'Low Concern — Stay Observant',
    subtitle:  'No immediate red flags, but continue monitoring. Recheck if symptoms persist or worsen.',
  },
}

const CANCER_LABELS = {
  oral:      'Oral / Mouth Cancer',
  cervical:  'Cervical Cancer',
  breast:    'Breast Cancer',
  colorectal:'Colorectal Cancer',
  lung:      'Lung Cancer',
}

// ── Animated score ring ──────────────────────────────────
function ScoreRing({ score, colorClass }) {
  const [displayScore, setDisplayScore] = useState(0)
  const radius = 52
  const circ   = 2 * Math.PI * radius
  const offset = circ - (displayScore / 100) * circ

  useEffect(() => {
    // Animate score counting up
    let start = null
    const duration = 1000
    const target = score

    function step(ts) {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      const eased    = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      setDisplayScore(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }

    requestAnimationFrame(step)
  }, [score])

  return (
    <div className="score-ring-wrap" style={{ width: 130, height: 130 }}>
      <svg className="score-ring" width="130" height="130" viewBox="0 0 130 130">
        <circle className="score-ring-bg"   cx="65" cy="65" r={radius} />
        <circle
          className={`score-ring-fill ${colorClass}`}
          cx="65" cy="65" r={radius}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>
      <div className="score-number">{displayScore}</div>
      <div className="score-label">/ 100</div>
    </div>
  )
}

// ── Single cancer result card ────────────────────────────
function ResultCard({ result }) {
  const topEscalation = result.escalation_level
  const cfg           = ESCALATION_CONFIG[topEscalation] || ESCALATION_CONFIG.monitor

  return (
    <div className={`escalation-banner ${cfg.className}`}>
      <div className={`escalation-level-tag ${cfg.className}`}>
        <span className="escalation-dot" />
        {cfg.tag}
      </div>
      <div className="escalation-cancer">
        {CANCER_LABELS[result.cancer_type] || result.cancer_type}
      </div>
      <div className="escalation-action-text">
        {result.primary_action}
      </div>
      {result.matched_rules?.length > 0 && (
        <div className="matched-symptoms">
          {result.matched_rules.map(r => (
            <span key={r.symptom_id} className="symptom-tag">
              {r.symptom_display_label}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Trend Alert Banner ───────────────────────────────────
function TrendAlert({ trend }) {
  const isHigh = trend.severity === 'high'
  return (
    <div style={{
      background: isHigh ? '#FFF0EE' : '#FFF9EC',
      border: `1.5px solid ${isHigh ? '#FCCFCF' : '#FFE0A3'}`,
      borderLeft: `4px solid ${isHigh ? '#BA1A1A' : '#C46200'}`,
      borderRadius: '10px',
      padding: '13px 16px',
      marginBottom: '10px',
      display: 'flex',
      gap: '10px',
      alignItems: 'flex-start',
      animation: 'slideIn 0.3s ease',
    }}>
      <span style={{ fontSize: '16px', flexShrink: 0, marginTop: '1px' }}>
        {isHigh ? '⚠️' : '📈'}
      </span>
      <div>
        <div style={{
          fontSize: '12px', fontWeight: 700,
          color: isHigh ? '#BA1A1A' : '#C46200',
          letterSpacing: '0.04em', textTransform: 'uppercase',
          marginBottom: '3px',
        }}>
          {isHigh ? 'Trend Warning' : 'Change Detected'}
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text-mid)', lineHeight: 1.5 }}>
          {trend.message}
        </div>
      </div>
    </div>
  )
}

// ── Main Results Screen ──────────────────────────────────
export default function ResultsScreen({ results, trends = [], onReset, onViewHistory }) {
  if (!results) return null

  const { results: cancerResults, any_red_flag, user_profile } = results

  // No symptoms matched any rule
  if (!cancerResults || cancerResults.length === 0) {
    return (
      <div className="fade-in">
        <div className="card">
          <div className="no-results">
            <div className="no-results-icon">🟢</div>
            <div className="no-results-title">No Matching Concerns Found</div>
            <p className="no-results-text">
              Based on the symptoms you reported, no rules in our current
              knowledge base were triggered for your profile.<br /><br />
              If you are still concerned about your health, please visit your
              nearest Primary Health Centre (PHC) for a check-up.
            </p>
          </div>
          <div className="nav-row">
            <button className="btn btn-primary" onClick={onReset}>
              ← Start New Assessment
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Determine overall highest escalation for hero display
  const overallEscalation =
    cancerResults.find(r => r.escalation_level === 'urgent_refer')?.escalation_level ||
    cancerResults.find(r => r.escalation_level === 'consult')?.escalation_level ||
    'monitor'

  const overallScore = Math.min(
    cancerResults.reduce((sum, r) => sum + (r.risk_score || 0), 0),
    100
  )

  const heroConfig = ESCALATION_CONFIG[overallEscalation]

  return (
    <div className="fade-in">
      {/* Trend alerts — only shown from second session onwards */}
      {trends.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <div style={{
            fontSize: '11px', fontWeight: 700,
            color: 'var(--text-muted)', letterSpacing: '0.06em',
            textTransform: 'uppercase', marginBottom: '10px',
          }}>
            ⟳ Compared to your last assessment
          </div>
          {trends.map((t, i) => <TrendAlert key={i} trend={t} />)}
        </div>
      )}

      {/* Hero section with score ring */}
      <div className="results-hero">
        <ScoreRing score={overallScore} colorClass={heroConfig.scoreColor} />
        <h2 className="results-hero-title">{heroConfig.title}</h2>
        <p className="results-hero-sub">{heroConfig.subtitle}</p>
      </div>

      {/* Profile summary */}
      <div style={{
        background: 'var(--surface)',
        borderRadius: 'var(--radius-md)',
        padding: '12px 18px',
        marginBottom: '16px',
        border: '1px solid var(--border-light)',
        fontSize: '13px',
        color: 'var(--text-muted)',
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap',
      }}>
        <span>👤 Age {user_profile.age}</span>
        <span>⚕ Sex: {user_profile.sex === 'F' ? 'Female' : 'Male'}</span>
        <span>🩺 {cancerResults.length} cancer type{cancerResults.length > 1 ? 's' : ''} assessed</span>
        {any_red_flag && (
          <span style={{ color: 'var(--urgent)', fontWeight: 600 }}>
            ⚠ Red flag symptoms present
          </span>
        )}
      </div>

      {/* Individual cancer result cards */}
      {cancerResults.map((result, i) => (
        <ResultCard key={i} result={result} />
      ))}

      {/* Plain language reasons */}
      {cancerResults.some(r => r.matched_rules?.length > 0) && (
        <div className="card" style={{ marginTop: 4 }}>
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '17px',
            color: 'var(--primary)',
            marginBottom: '14px',
          }}>
            Why These Symptoms Matter
          </h3>
          {cancerResults.flatMap(r => r.matched_rules || []).map(rule => (
            <div key={rule.symptom_id} style={{
              marginBottom: '12px',
              paddingBottom: '12px',
              borderBottom: '1px solid var(--border-light)',
            }}>
              <div style={{
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--text-mid)',
                marginBottom: '4px',
              }}>
                {rule.symptom_display_label}
              </div>
              <div style={{
                fontSize: '13px',
                color: 'var(--text-muted)',
                lineHeight: 1.6,
              }}>
                {rule.plain_language_reason}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Disclaimer */}
      <div className="disclaimer-card">
        <strong>Important: </strong>
        This assessment is for <strong>screening awareness only</strong> and does
        not diagnose cancer. The information is based on MoHFW-NPCC, NCI, CDC,
        and WHO guidelines. Always consult a qualified doctor or visit your
        nearest Primary Health Centre (PHC) for a proper examination.
      </div>

      {/* Actions */}
      <div className="nav-row">
        <button className="btn btn-secondary" onClick={onViewHistory}>
          📋 View History
        </button>
        <button className="btn btn-primary" onClick={onReset}>
          ← New Assessment
        </button>
      </div>
    </div>
  )
}
