import { useState } from 'react'
import IntakeForm from './components/IntakeForm'
import ResultsScreen from './components/ResultsScreen'
import HistoryDashboard from './components/HistoryDashboard'
import { computeRiskProfile } from './riskEngine'
import {
  saveSession,
  loadPreviousSession,
  detectTrends,
  loadAllSessions,
} from './sessionStore'
import './App.css'

export default function App() {
  const [screen,       setScreen]       = useState('form')
  const [results,      setResults]      = useState(null)
  const [trends,       setTrends]       = useState([])
  const [sessionCount, setSessionCount] = useState(loadAllSessions().length)

  function handleFormSubmit(userProfile) {
    const output   = computeRiskProfile(userProfile)
    const previous = loadPreviousSession()
    const detectedTrends = previous ? detectTrends(output, previous) : []
    saveSession(output)
    setSessionCount(loadAllSessions().length)
    setResults(output)
    setTrends(detectedTrends)
    setScreen('results')
    window.scrollTo(0, 0)
  }

  function handleReset() {
    setResults(null)
    setTrends([])
    setScreen('form')
    window.scrollTo(0, 0)
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-inner">
          <div className="logo-mark">
            <span className="logo-icon">◎</span>
            <span className="logo-text">OncoGuard</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span className="header-tagline">Early Cancer Screening Awareness</span>
            {sessionCount > 0 && screen !== 'history' && (
              <button
                onClick={() => setScreen('history')}
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  borderRadius: '20px',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 600,
                  padding: '5px 12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                }}
              >
                📋 History
                <span style={{
                  background: 'var(--accent)',
                  color: 'var(--primary)',
                  borderRadius: '10px',
                  padding: '1px 7px',
                  fontSize: '11px',
                  fontWeight: 800,
                }}>
                  {sessionCount}
                </span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="app-main">
        {screen === 'form' && (
          <IntakeForm onSubmit={handleFormSubmit} />
        )}
        {screen === 'results' && (
          <ResultsScreen
            results={results}
            trends={trends}
            onReset={handleReset}
            onViewHistory={() => setScreen('history')}
          />
        )}
        {screen === 'history' && (
          <HistoryDashboard
            onClose={() => setScreen('form')}
            onNewAssessment={() => setScreen('form')}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>This tool is for <strong>awareness only</strong>. It does not diagnose cancer.
          Always consult a qualified healthcare professional.</p>
        <p className="footer-sources">Guidelines: MoHFW-NPCC-2023 · NCI · CDC · WHO-2022</p>
      </footer>
    </div>
  )
}
