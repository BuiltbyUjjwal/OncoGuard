import { useState } from 'react'
import IntakeForm from './components/IntakeForm'
import ResultsScreen from './components/ResultsScreen'
import { computeRiskProfile } from './riskEngine'
import './App.css'

export default function App() {
  const [screen, setScreen] = useState('form')   // 'form' | 'results'
  const [results, setResults] = useState(null)

  function handleFormSubmit(userProfile) {
    const output = computeRiskProfile(userProfile)
    setResults(output)
    setScreen('results')
    window.scrollTo(0, 0)
  }

  function handleReset() {
    setResults(null)
    setScreen('form')
    window.scrollTo(0, 0)
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-inner">
          <div className="logo-mark">
            <span className="logo-icon">◎</span>
            <span className="logo-text">Oncoguard</span>
          </div>
          <span className="header-tagline">Early Cancer Screening Awareness</span>
        </div>
      </header>

      <main className="app-main">
        {screen === 'form'
          ? <IntakeForm onSubmit={handleFormSubmit} />
          : <ResultsScreen results={results} onReset={handleReset} />
        }
      </main>

      <footer className="app-footer">
        <p>This tool is for <strong>awareness only</strong>. It does not diagnose cancer.
          Always consult a qualified healthcare professional.</p>
        <p className="footer-sources">Guidelines: MoHFW-NPCC-2023 · NCI · CDC · WHO-2022</p>
      </footer>
    </div>
  )
}
