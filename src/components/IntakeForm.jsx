import { useState } from 'react'

// ── Symptom data (display labels mapped to IDs) ──────────
// Grouped by cancer type. Sex field used for filtering.
const SYMPTOM_DATA = {
  oral: {
    label: 'Oral / Mouth Cancer',
    appliesTo: 'all',
    symptoms: [
      { id: 'OC-001', label: 'Mouth sore or ulcer not healing after 2 weeks' },
      { id: 'OC-002', label: 'White or red patch inside the mouth' },
      { id: 'OC-003', label: 'Lump or swelling in mouth, jaw, or cheek' },
      { id: 'OC-004', label: "Cannot open mouth fully (restricted jaw movement)" },
      { id: 'OC-005', label: 'Unexplained bleeding or numbness in the mouth or lip' },
      { id: 'OC-006', label: "Sore throat that won't go away (over 3 weeks)" },
      { id: 'OC-007', label: 'Teeth becoming loose without dental cause or injury' },
      { id: 'OC-008', label: 'Painless lump or swelling in the neck' },
      { id: 'OC-009', label: 'Persistent ear pain with no ear infection' },
      { id: 'OC-010', label: 'Unexplained change in voice or new hoarseness' },
    ],
  },
  cervical: {
    label: 'Cervical Cancer',
    appliesTo: 'F',
    symptoms: [
      { id: 'CC-001', label: 'Bleeding or spotting after sexual intercourse' },
      { id: 'CC-002', label: 'Vaginal bleeding after menopause' },
      { id: 'CC-003', label: 'Bleeding between periods or heavier / longer periods' },
      { id: 'CC-004', label: 'Unusual vaginal discharge — foul smell or contains blood' },
      { id: 'CC-005', label: 'Persistent pelvic pain or pain during sex' },
      { id: 'CC-006', label: 'Pain or blood in urine (no confirmed infection)' },
      { id: 'CC-007', label: 'Pain or rectal bleeding during bowel movements' },
      { id: 'CC-008', label: 'Persistent dull lower backache with no known cause' },
      { id: 'CC-009', label: 'Swelling of one or both legs (no injury or known cause)' },
      { id: 'CC-010', label: 'Persistent tiredness + unexplained weight loss (4+ weeks)' },
    ],
  },
}

// ── Risk factor options ──────────────────────────────────
const RISK_FACTORS = [
  { id: 'tobacco_chewing', label: 'Tobacco chewing (gutka, khaini, paan)', appliesTo: 'all' },
  { id: 'smoking',         label: 'Smoking (cigarettes, bidi)',            appliesTo: 'all' },
  { id: 'alcohol',         label: 'Heavy alcohol use',                     appliesTo: 'all' },
  { id: 'paan',            label: 'Betel quid / paan / areca nut use',     appliesTo: 'all' },
  { id: 'no_screening',    label: 'Never had a VIA test or Pap smear',     appliesTo: 'F'   },
  { id: 'hpv',             label: 'Known HPV infection',                   appliesTo: 'F'   },
  { id: 'hiv',             label: 'HIV positive or weakened immune system',appliesTo: 'all' },
  { id: 'high_parity',     label: 'Given birth to 4 or more children',     appliesTo: 'F'   },
  { id: 'none',            label: 'None of the above',                     appliesTo: 'all' },
]

// Risk factor ID → display string for the engine
const RISK_FACTOR_STRINGS = {
  tobacco_chewing: 'tobacco chewing',
  smoking:         'smoking',
  alcohol:         'alcohol use',
  paan:            'betel quid',
  no_screening:    'no prior screening',
  hpv:             'hpv infection',
  hiv:             'hiv',
  high_parity:     'high parity',
  none:            '',
}

const TOTAL_STEPS = 3

export default function IntakeForm({ onSubmit }) {
  const [step,            setStep]            = useState(1)
  const [age,             setAge]             = useState(35)
  const [sex,             setSex]             = useState(null)
  const [riskFactors,     setRiskFactors]     = useState([])
  const [symptoms,        setSymptoms]        = useState([])

  // ── Step validation ──────────────────────────────────
  const canProceed = () => {
    if (step === 1) return sex !== null
    if (step === 2) return true // risk factors optional
    if (step === 3) return symptoms.length > 0
    return false
  }

  // ── Handlers ─────────────────────────────────────────
  function toggleRiskFactor(id) {
    if (id === 'none') {
      setRiskFactors(riskFactors.includes('none') ? [] : ['none'])
      return
    }
    setRiskFactors(prev =>
      prev.includes(id)
        ? prev.filter(r => r !== id)
        : [...prev.filter(r => r !== 'none'), id]
    )
  }

  function toggleSymptom(id) {
    setSymptoms(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  function handleSubmit() {
    const reportedRiskFactors = riskFactors
      .filter(id => id !== 'none')
      .map(id => RISK_FACTOR_STRINGS[id])
      .filter(Boolean)

    onSubmit({
      age,
      sex,
      reportedSymptoms:    symptoms,
      reportedRiskFactors,
    })
  }

  // Age slider dynamic fill
  const rangePct = ((age - 18) / (80 - 18)) * 100

  return (
    <div className="fade-in">
      {/* Step indicator */}
      <div className="step-indicator">
        {[1, 2, 3].map((s, i) => (
          <>
            <div
              key={`dot-${s}`}
              className={`step-dot ${step === s ? 'active' : step > s ? 'done' : ''}`}
            >
              {step > s ? '✓' : s}
            </div>
            {i < 2 && (
              <div key={`line-${s}`} className={`step-line ${step > s ? 'done' : ''}`} />
            )}
          </>
        ))}
      </div>

      {/* ── STEP 1: Profile ─────────────────────────────── */}
      {step === 1 && (
        <div className="card fade-in">
          <h2 className="card-title">Your Profile</h2>
          <p className="card-subtitle">
            This helps us apply the right screening guidelines for you.
            Your answers are never stored or shared.
          </p>

          {/* Age */}
          <div className="field-group">
            <label className="field-label">Your Age</label>
            <div className="age-input-row">
              <div>
                <div className="age-number">{age}</div>
                <div className="age-unit">years old</div>
              </div>
              <div style={{ flex: 1 }}>
                <input
                  type="range"
                  min={18} max={80}
                  value={age}
                  style={{ '--range-pct': `${rangePct}%` }}
                  onChange={e => setAge(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Sex */}
          <div className="field-group" style={{ marginBottom: 0 }}>
            <label className="field-label">Biological Sex</label>
            <div className="sex-toggle">
              <button
                className={`sex-btn ${sex === 'M' ? 'selected' : ''}`}
                onClick={() => setSex('M')}
                type="button"
              >
                ♂ Male
              </button>
              <button
                className={`sex-btn ${sex === 'F' ? 'selected' : ''}`}
                onClick={() => setSex('F')}
                type="button"
              >
                ♀ Female
              </button>
            </div>
          </div>

          <div className="nav-row">
            <button
              className="btn btn-primary"
              disabled={!canProceed()}
              onClick={() => setStep(2)}
            >
              Next: Risk Factors →
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 2: Risk Factors ─────────────────────────── */}
      {step === 2 && (
        <div className="card fade-in">
          <h2 className="card-title">Risk Factors</h2>
          <p className="card-subtitle">
            Select any that apply to you. This helps weigh your results accurately.
            If none apply, select "None of the above."
          </p>

          <div className="checkbox-grid">
            {RISK_FACTORS
              .filter(rf => rf.appliesTo === 'all' || rf.appliesTo === sex)
              .map(rf => (
                <label
                  key={rf.id}
                  className={`checkbox-item ${riskFactors.includes(rf.id) ? 'checked' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={riskFactors.includes(rf.id)}
                    onChange={() => toggleRiskFactor(rf.id)}
                  />
                  <span className="checkbox-label">{rf.label}</span>
                </label>
              ))
            }
          </div>

          <div className="nav-row">
            <button
              className="btn btn-secondary"
              onClick={() => setStep(1)}
            >
              ← Back
            </button>
            <button
              className="btn btn-primary"
              onClick={() => setStep(3)}
            >
              Next: Symptoms →
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: Symptoms ─────────────────────────────── */}
      {step === 3 && (
        <div className="card fade-in">
          <h2 className="card-title">Current Symptoms</h2>
          <p className="card-subtitle">
            Select every symptom you are currently experiencing or have noticed
            in the past few weeks. Select at least one to continue.
          </p>

          {Object.entries(SYMPTOM_DATA)
            .filter(([, group]) => group.appliesTo === 'all' || group.appliesTo === sex)
            .map(([key, group]) => (
              <div className="symptom-group" key={key}>
                <div className="symptom-group-title">{group.label}</div>
                <div className="checkbox-grid">
                  {group.symptoms.map(s => (
                    <label
                      key={s.id}
                      className={`checkbox-item ${symptoms.includes(s.id) ? 'checked' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={symptoms.includes(s.id)}
                        onChange={() => toggleSymptom(s.id)}
                      />
                      <span className="checkbox-label">{s.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))
          }

          <div className="nav-row">
            <button
              className="btn btn-secondary"
              onClick={() => setStep(2)}
            >
              ← Back
            </button>
            <button
              className="btn btn-primary"
              disabled={!canProceed()}
              onClick={handleSubmit}
            >
              Assess My Risk →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
