// HistoryDashboard.jsx
// Shows the user's past assessments as a timeline with trend lines.
import { useState } from 'react'
import { loadAllSessions, clearAllSessions } from '../sessionStore'

const CANCER_COLORS = {
  oral:       '#2D6A4F',
  cervical:   '#D62828',
  breast:     '#E07A5F',
  colorectal: '#3D405B',
  lung:       '#81B29A',
}

const CANCER_LABELS = {
  oral:       'Oral',
  cervical:   'Cervical',
  breast:     'Breast',
  colorectal: 'Colorectal',
  lung:       'Lung',
}

const LEVEL_CONFIG = {
  urgent_refer: { label: 'Urgent', color: '#BA1A1A', bg: '#FFF0EE' },
  consult:      { label: 'Consult', color: '#C46200', bg: '#FFF5EB' },
  monitor:      { label: 'Monitor', color: '#1A5C38', bg: '#EDFAF2' },
}

function formatDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

// ── Mini sparkline chart for one cancer type ─────────────
function Sparkline({ sessions, cancerType, color }) {
  const dataPoints = sessions
    .slice()
    .reverse()   // oldest first for chart
    .map(s => {
      const r = s.results.find(r => r.cancer_type === cancerType)
      return r ? r.risk_score : null
    })
    .filter(v => v !== null)

  if (dataPoints.length < 2) return null

  const W = 120, H = 40, PAD = 4
  const max = Math.max(...dataPoints, 1)
  const xStep = (W - PAD * 2) / (dataPoints.length - 1)

  const points = dataPoints.map((v, i) => [
    PAD + i * xStep,
    H - PAD - ((v / max) * (H - PAD * 2)),
  ])

  const pathD = points.map((p, i) =>
    `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`
  ).join(' ')

  // Fill area under line
  const areaD = pathD +
    ` L ${points[points.length - 1][0].toFixed(1)} ${H}` +
    ` L ${points[0][0].toFixed(1)} ${H} Z`

  const lastScore = dataPoints[dataPoints.length - 1]
  const prevScore = dataPoints[dataPoints.length - 2]
  const trending  = lastScore > prevScore ? '↑' : lastScore < prevScore ? '↓' : '→'
  const trendColor = lastScore > prevScore ? '#BA1A1A'
    : lastScore < prevScore ? '#1A5C38' : '#6E6E6E'

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <svg width={W} height={H} style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id={`grad-${cancerType}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d={areaD} fill={`url(#grad-${cancerType})`} />
        <path d={pathD} stroke={color} strokeWidth="2" fill="none"
          strokeLinecap="round" strokeLinejoin="round" />
        {/* Last point dot */}
        <circle
          cx={points[points.length - 1][0]}
          cy={points[points.length - 1][1]}
          r="4" fill={color}
        />
      </svg>
      <div>
        <div style={{ fontSize: '20px', fontWeight: 700, color, lineHeight: 1 }}>
          {lastScore}
        </div>
        <div style={{ fontSize: '12px', color: trendColor, fontWeight: 600 }}>
          {trending} {Math.abs(lastScore - prevScore)} pts
        </div>
      </div>
    </div>
  )
}

// ── Single session row in history list ───────────────────
function SessionRow({ session, index }) {
  const [expanded, setExpanded] = useState(false)
  const highestEscalation =
    session.results.find(r => r.escalation_level === 'urgent_refer') ||
    session.results.find(r => r.escalation_level === 'consult') ||
    session.results[0]

  const cfg = highestEscalation
    ? LEVEL_CONFIG[highestEscalation.escalation_level]
    : LEVEL_CONFIG.monitor

  return (
    <div style={{
      borderRadius: '12px',
      border: '1.5px solid var(--border-light)',
      background: 'var(--surface)',
      overflow: 'hidden',
      marginBottom: '10px',
    }}>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '100%',
          padding: '14px 18px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          textAlign: 'left',
        }}
      >
        {/* Index badge */}
        <div style={{
          width: 28, height: 28,
          borderRadius: '50%',
          background: index === 0 ? 'var(--primary)' : 'var(--surface-2)',
          color: index === 0 ? '#fff' : 'var(--text-muted)',
          fontSize: '12px', fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          {index === 0 ? '★' : index + 1}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: '13px', fontWeight: 600,
            color: 'var(--text-mid)', marginBottom: '2px',
          }}>
            {formatDate(session.date)}
            {index === 0 && (
              <span style={{
                marginLeft: '8px', fontSize: '11px',
                background: 'var(--accent-soft)',
                color: 'var(--primary)', padding: '2px 8px',
                borderRadius: '10px', fontWeight: 700,
              }}>Latest</span>
            )}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Age {session.user_profile.age} ·{' '}
            {session.user_profile.sex === 'F' ? 'Female' : 'Male'} ·{' '}
            {session.results.length} type{session.results.length > 1 ? 's' : ''} assessed
          </div>
        </div>

        {/* Escalation badge */}
        <div style={{
          fontSize: '11px', fontWeight: 700,
          padding: '4px 10px', borderRadius: '20px',
          background: cfg.bg, color: cfg.color,
          border: `1px solid ${cfg.color}30`,
          letterSpacing: '0.03em',
          flexShrink: 0,
        }}>
          {cfg.label}
        </div>

        <div style={{
          color: 'var(--text-muted)', fontSize: '16px',
          transform: expanded ? 'rotate(180deg)' : 'rotate(0)',
          transition: 'transform 0.2s',
        }}>▾</div>
      </button>

      {expanded && (
        <div style={{
          padding: '0 18px 16px',
          borderTop: '1px solid var(--border-light)',
          paddingTop: '14px',
        }}>
          {session.results.map(r => {
            const lCfg = LEVEL_CONFIG[r.escalation_level] || LEVEL_CONFIG.monitor
            return (
              <div key={r.cancer_type} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
                fontSize: '13px',
              }}>
                <span style={{ color: 'var(--text-mid)', fontWeight: 500 }}>
                  {CANCER_LABELS[r.cancer_type] || r.cancer_type}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '80px', height: '6px',
                    borderRadius: '3px', background: 'var(--border)',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      width: `${r.risk_score}%`, height: '100%',
                      background: lCfg.color, borderRadius: '3px',
                      transition: 'width 0.6s ease',
                    }} />
                  </div>
                  <span style={{
                    fontWeight: 700, color: lCfg.color,
                    minWidth: '28px', textAlign: 'right',
                  }}>
                    {r.risk_score}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Main Dashboard ───────────────────────────────────────
export default function HistoryDashboard({ onClose, onNewAssessment }) {
  const sessions = loadAllSessions()
  const [confirmClear, setConfirmClear] = useState(false)

  function handleClear() {
    clearAllSessions()
    setConfirmClear(false)
    onClose()
  }

  // Find all cancer types across all sessions
  const cancerTypes = [...new Set(
    sessions.flatMap(s => s.results.map(r => r.cancer_type))
  )]

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: '20px',
      }}>
        <div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '24px', color: 'var(--primary)',
            marginBottom: '2px',
          }}>Assessment History</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            {sessions.length} session{sessions.length !== 1 ? 's' : ''} recorded
          </p>
        </div>
        <button className="btn btn-secondary" onClick={onClose}
          style={{ padding: '10px 18px', fontSize: '14px' }}>
          ✕ Close
        </button>
      </div>

      {sessions.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ fontSize: '40px', marginBottom: '14px' }}>📋</div>
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '20px', color: 'var(--primary)', marginBottom: '8px',
          }}>No History Yet</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Complete your first assessment to start tracking your risk over time.
          </p>
          <div className="nav-row" style={{ justifyContent: 'center', marginTop: '20px' }}>
            <button className="btn btn-primary" onClick={onNewAssessment}
              style={{ maxWidth: '220px' }}>
              Start Assessment →
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Trend sparklines */}
          {cancerTypes.length > 0 && sessions.length >= 2 && (
            <div className="card" style={{ marginBottom: '16px' }}>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '17px', color: 'var(--primary)', marginBottom: '16px',
              }}>
                Risk Trends Over Time
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {cancerTypes.map(type => (
                  <div key={type} style={{
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: '14px',
                    borderBottom: '1px solid var(--border-light)',
                  }}>
                    <div>
                      <div style={{
                        fontSize: '13px', fontWeight: 600,
                        color: 'var(--text-mid)', marginBottom: '2px',
                      }}>
                        {CANCER_LABELS[type] || type}
                      </div>
                      <div style={{
                        fontSize: '11px', color: 'var(--text-muted)',
                      }}>
                        {sessions.filter(s =>
                          s.results.some(r => r.cancer_type === type)
                        ).length} assessments
                      </div>
                    </div>
                    <Sparkline
                      sessions={sessions}
                      cancerType={type}
                      color={CANCER_COLORS[type] || '#2D6A4F'}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Session list */}
          <div style={{ marginBottom: '16px' }}>
            {sessions.map((session, i) => (
              <SessionRow key={session.id} session={session} index={i} />
            ))}
          </div>

          {/* Clear history */}
          <div style={{ textAlign: 'center', marginTop: '8px' }}>
            {!confirmClear ? (
              <button
                className="btn btn-ghost"
                onClick={() => setConfirmClear(true)}
                style={{ fontSize: '13px', color: 'var(--text-muted)' }}
              >
                Clear all history
              </button>
            ) : (
              <div style={{
                background: '#FFF0EE',
                border: '1px solid var(--urgent-border)',
                borderRadius: 'var(--radius-md)',
                padding: '16px', fontSize: '14px',
                color: 'var(--urgent)',
              }}>
                <p style={{ marginBottom: '12px', fontWeight: 500 }}>
                  This will permanently delete all saved assessments.
                </p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setConfirmClear(false)}
                    style={{ padding: '10px 20px', fontSize: '14px' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleClear}
                    style={{
                      padding: '10px 20px', fontSize: '14px',
                      background: 'var(--urgent)', color: '#fff',
                      border: 'none', borderRadius: 'var(--radius-md)',
                      cursor: 'pointer', fontWeight: 600,
                    }}
                  >
                    Yes, Clear All
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
