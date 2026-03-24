import { useState } from 'react'

// ── Symptom data — all 4 cancer types ───────────────────
const SYMPTOM_DATA = {
  oral: {
    label: 'Oral / Mouth Cancer',
    appliesTo: 'all',
    symptoms: [
      { id: 'OC-001', label: 'Mouth sore or ulcer not healing after 2 weeks' },
      { id: 'OC-002', label: 'White or red patch inside the mouth' },
      { id: 'OC-003', label: 'Lump or swelling in mouth, jaw, or cheek' },
      { id: 'OC-004', label: 'Cannot open mouth fully (restricted jaw movement)' },
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
  lung: {
    label: 'Lung Cancer',
    appliesTo: 'all',
    symptoms: [
      { id: 'LC-001', label: 'Persistent cough lasting more than 3 weeks' },
      { id: 'LC-002', label: 'Coughing up blood or blood-streaked mucus' },
      { id: 'LC-003', label: 'Persistent chest pain, worse when breathing or coughing' },
      { id: 'LC-004', label: 'New shortness of breath or difficulty breathing (2+ weeks)' },
      { id: 'LC-005', label: 'Unexplained hoarseness or voice change (3+ weeks)' },
      { id: 'LC-006', label: 'Unexplained weight loss of 5kg+ in 1–2 months' },
      { id: 'LC-007', label: 'Recurring chest infections (pneumonia/bronchitis) coming back' },
      { id: 'LC-008', label: 'Severe unexplained fatigue and loss of appetite (3+ weeks)' },
      { id: 'LC-009', label: 'Bone pain in back, hips, or shoulders (worse at night)' },
      { id: 'LC-010', label: 'Swelling of face, neck, or arms (no known cause)' },
    ],
  },
  breast: {
    label: 'Breast Cancer',
    appliesTo: 'F',
    symptoms: [
      { id: 'BC-001', label: 'New lump, thickening, or hard mass in breast or armpit' },
      { id: 'BC-002', label: 'One breast changed in size or shape (unexplained)' },
      { id: 'BC-003', label: 'Breast skin: puckering, dimpling, redness, or orange-peel texture' },
      { id: 'BC-004', label: 'Nipple recently turned inward or changed shape (new)' },
      { id: 'BC-005', label: 'Fluid from nipple (not breast milk) — especially blood-stained' },
      { id: 'BC-006', label: 'Red, scaly, itchy, or crusty skin on or around the nipple (3+ weeks)' },
      { id: 'BC-007', label: 'Swelling or lump in the armpit (underarm) — no infection' },
      { id: 'BC-008', label: 'Persistent breast pain in one area that does not change (3+ weeks)' },
      { id: 'BC-009', label: 'Entire breast red, swollen, and warm — not breastfeeding' },
      { id: 'BC-010', label: 'Weight loss, back pain, or breathing difficulty — with known prior lump' },
    ],
  },
}

// ── Risk factor options ──────────────────────────────────
const RISK_FACTORS = [
  { id: 'tobacco_chewing', label: 'Tobacco chewing (gutka, khaini, paan)',  appliesTo: 'all' },
  { id: 'smoking',         label: 'Smoking (cigarettes, bidi)',             appliesTo: 'all' },
  { id: 'alcohol',         label: 'Heavy alcohol use',                      appliesTo: 'all' },
  { id: 'paan',            label: 'Betel quid / paan / areca nut use',      appliesTo: 'all' },
  { id: 'biomass',         label: 'Cook indoors on wood/dung/coal fire (chulha)', appliesTo: 'all' },
  { id: 'no_screening',    label: 'Never had a VIA test or Pap smear',      appliesTo: 'F'   },
  { id: 'hpv',             label: 'Known HPV infection',                    appliesTo: 'F'   },
  { id: 'hiv',             label: 'HIV positive or weakened immune system', appliesTo: 'all' },
  { id: 'family_history',  label: 'Family history of cancer (parent/sibling)', appliesTo: 'all' },
  { id: 'high_parity',     label: 'Given birth to 4 or more children',      appliesTo: 'F'   },
  { id: 'none',            label: 'None of the above',                      appliesTo: 'all' },
]

// Risk factor ID → string passed to the engine
const RISK_FACTOR_STRINGS = {
  tobacco_chewing: 'tobacco chewing',
  smoking:         'smoking',
  alcohol:         'alcohol use',
  paan:            'betel quid',
  biomass:         'biomass smoke',
  no_screening:    'no prior screening',
  hpv:             'hpv infection',
  hiv:             'hiv',
  family_history:  'family history',
  high_parity:     'high parity',
  none:            '',
}

export default function IntakeForm({ onSubmit }) {
  const [step,            setStep]            = useState(1)
  const [age,             setAge]             = useState(35)
  const [sex,             setSex]             = useState(null)
  const [riskFactors,     setRiskFactors]     = useState([])
  const [symptoms,        setSymptoms]        = useState([])
  const [otherRiskFactor, setOtherRiskFactor] = useState('')

  const canProceed = () => {
    if (step === 1) return sex !== null
    if (step === 2) return true
    if (step === 3) return symptoms.length > 0
    return false
  }

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

    if (otherRiskFactor.trim()) {
      reportedRiskFactors.push(otherRiskFactor.trim().toLowerCase())
    }

    onSubmit({ age, sex, reportedSymptoms: symptoms, reportedRiskFactors })
  }

  const rangePct = ((age - 18) / (80 - 18)) * 100

  return (
    <div className="fade-in">
      {/* Step indicator */}
      <div className="step-indicator">
        {[1, 2, 3].map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? 1 : 'none' }}>
            <div className={`step-dot ${step === s ? 'active' : step > s ? 'done' : ''}`}>
              {step > s ? '✓' : s}
            </div>
            {i < 2 && <div className={`step-line ${step > s ? 'done' : ''}`} />}
          </div>
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

          {/* Other risk factor — free text */}
          <div className="field-group" style={{ marginTop: '16px', marginBottom: 0 }}>
            <label className="field-label">Other Risk Factor (Optional)</label>
            <input
              type="text"
              placeholder="e.g. family history of cancer, obesity..."
              value={otherRiskFactor}
              onChange={e => setOtherRiskFactor(e.target.value)}
              style={{
                width: '100%',
                padding: '13px 16px',
                borderRadius: 'var(--radius-md)',
                border: otherRiskFactor
                  ? '1.5px solid var(--primary-mid)'
                  : '1.5px solid var(--border)',
                background: otherRiskFactor ? '#F4FAF6' : 'var(--surface)',
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                color: 'var(--text)',
                outline: 'none',
                transition: 'border-color 0.2s, background 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--primary)'}
              onBlur={e => e.target.style.borderColor = otherRiskFactor
                ? 'var(--primary-mid)' : 'var(--border)'}
            />
            <p style={{
              fontSize: '12px',
              color: 'var(--text-muted)',
              marginTop: '6px',
              paddingLeft: '2px',
            }}>
              Type anything not listed above. This will be included in your assessment.
            </p>
          </div>

          <div className="nav-row">
            <button className="btn btn-secondary" onClick={() => setStep(1)}>
              ← Back
            </button>
            <button className="btn btn-primary" onClick={() => setStep(3)}>
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
            <button className="btn btn-secondary" onClick={() => setStep(2)}>
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
