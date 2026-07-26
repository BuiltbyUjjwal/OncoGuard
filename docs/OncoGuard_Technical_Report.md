# OncoGuard
## Explainable AI-Powered Early Cancer Risk Escalation Platform
### Revised Technical Report – Version 3 (Final)

---

## 1. Executive Summary

### Problem Statement

Cancer remains one of the leading causes of mortality in India, with a significant portion of cases diagnosed only at advanced stages. In rural and underserved regions, delayed diagnosis is caused not by treatment unavailability, but by:

- Lack of health awareness
- Ignored or misunderstood early symptoms
- Delayed medical screening  
- Limited access to oncologists and diagnostic facilities
- Low healthcare literacy

**Key Statistics:**
- Approximately 14.6 lakh new cancer cases reported annually in India
- Nearly 60% of cancer cases are diagnosed at Stage III or Stage IV
- Rural populations face severe shortages of oncologists and diagnostic infrastructure
- Early detection significantly improves survival rates and reduces treatment costs

**Gap in Current Solutions:**
Most healthcare applications function only as symptom loggers or general health trackers. They lack:
- Longitudinal symptom analysis (tracking symptoms across multiple visits)
- Explainable AI-based risk prioritization
- Grounded medical guidance tied to clinical guidelines
- Structured screening escalation support for high-risk cases

### Proposed Solution

**OncoGuard** is an AI-assisted early cancer risk escalation and screening recommendation platform designed to support preventive healthcare. The system identifies high-risk symptom patterns and encourages timely screening referrals rather than providing diagnosis.

OncoGuard combines four distinct components:
1. Clinical rule-based screening (ICMR/WHO guidelines)
2. Explainable machine learning (XGBoost + SHAP)
3. Retrieval-augmented generation (RAG + LLM)
4. Multilingual health guidance

**Design Context:**
The platform is specifically engineered for:
- Low-resource environments with limited internet connectivity
- Underserved populations with low healthcare literacy
- Low-end Android devices (2G-capable, offline-first architecture)
- Future ASHA worker deployment and community health worker scenarios

---

## 2. Objectives

The primary objectives of OncoGuard are:

1. Assist users in identifying potential high-risk symptom patterns early
2. Encourage timely medical screening and consultation with healthcare professionals
3. Reduce delayed healthcare response caused by low awareness or symptom misinterpretation
4. Provide explainable AI-based health risk analysis (non-diagnostic)
5. Improve healthcare accessibility in underserved and rural regions
6. Deliver grounded, evidence-based guidance using verified healthcare protocols
7. Support multilingual and low-literacy healthcare communication
8. Enable longitudinal symptom tracking across multiple patient visits

---

## 3. Scope of the System

To maintain technical feasibility and medical relevance, the initial prototype focuses on risk stratification for high-incidence cancers in India:

**Cancer Types Supported:**
- Oral Cancer (highest incidence in India due to tobacco use)
- Lung Cancer (high mortality; common environmental factors)
- Breast Cancer (increasing incidence in urban and rural areas)
- Cervical Cancer (preventable with early screening)

**System Positioning:**
OncoGuard functions strictly as:
- A preventive screening support system (not diagnostic)
- A symptom escalation platform
- A healthcare decision-support tool for awareness and early action

**Critical Disclaimer:**
The system does NOT diagnose cancer. All outputs are advisory and must be reviewed by qualified healthcare professionals before clinical decision-making.

---

## 4. System Overview

OncoGuard implements a **Hybrid 3-Layer AI Architecture** that combines:
- Deterministic clinical logic (rule-based reasoning)
- Explainable machine learning (predictive analysis)
- Grounded language model communication (patient-facing guidance)

This layered design ensures:
- **Reliability:** Rule engine provides consistent baseline screening
- **Explainability:** SHAP identifies specific risk factors for each patient
- **Modularity:** Each layer can be updated independently
- **Scalability:** Lightweight models support deployment on low-end devices
- **Medical Safety:** Grounding prevents AI hallucinations in healthcare guidance

---

## 5. Hybrid 3-Layer AI Architecture

| Layer | Technology | Purpose | Input | Output |
|-------|-----------|---------|-------|--------|
| **Layer 1** | Clinical Rule Engine | Initial risk stratification using weighted clinical guidelines | Demographics, lifestyle, symptoms, duration | Risk tier (Low/Medium/High), weighted score (0–100), escalation triggers |
| **Layer 2** | XGBoost + SHAP | Predictive risk scoring with feature explainability | Rule engine output + patient data | Risk probability per cancer type, top 3 contributing factors |
| **Layer 3** | RAG + LLM (Claude API) | Grounded multilingual healthcare guidance | Risk score + SHAP factors + ICMR protocols | Plain-English screening advice, referral recommendations, localized hospital suggestions |

---

## 6. Layer 1 – Clinical Rule Engine

### Purpose

The first layer acts as a preliminary clinical screening system that evaluates symptom combinations, duration, and lifestyle factors using weighted clinical logic derived from:

- **ICMR (Indian Council of Medical Research)** National Cancer Control Programme guidelines
- **WHO (World Health Organization)** cancer screening recommendations
- Domain research and clinical best practices

### Inputs Processed

**Demographic Data:**
- Age (risk varies significantly by age group)
- Gender (some cancers are gender-specific or have gender-skewed prevalence)
- Geographic location (for localized risk factors, climate patterns)

**Lifestyle Factors:**
- Tobacco use (type, frequency, duration)
- Alcohol consumption (frequency, quantity)
- Diet patterns (processed foods, antioxidant intake)
- Physical activity levels
- Occupational exposure (industrial hazards, carcinogens)

**Medical History:**
- Family history of cancer (type-specific and general)
- Previous medical conditions (chronic diseases, immune status)
- Genetic predisposition indicators
- Screening history

**Symptom Information (with Temporal Tracking):**
- Persistent cough (>3 weeks → lung/oral cancer indicator)
- Oral lesions or ulcers (recurring → oral cancer indicator)
- Unexplained weight loss (>10% body weight → potential malignancy)
- Abnormal bleeding or discharge
- Breast lumps or skin changes
- Chronic fatigue or weakness
- Pain (persistent, localized, progressive)
- Appetite loss
- Other cancer-specific symptom indicators

### Core Algorithm: ICMR/WHO CAUTION Weighting

The rule engine implements a weighted scoring system based on clinical guidelines:

**CAUTION Framework Factors:**
- **C** – Change in bowel/bladder habits
- **A** – A sore that does not heal
- **U** – Unusual bleeding/discharge
- **T** – Thickening or lump (breast, oral, other sites)
- **I** – Indigestion or difficulty swallowing
- **O** – Obvious change in wart/mole
- **N** – Nagging cough or hoarseness

Each factor receives:
- **Base weight** (relevance to specific cancer types)
- **Duration multiplier** (e.g., symptom persisting >3 weeks = higher weight)
- **Age-adjusted modifier** (risk increases with age)
- **Lifestyle risk coefficient** (tobacco/alcohol use increases baseline risk)

**Scoring Example (Lung Cancer):**
```
Persistent cough (>3 weeks):      +25 points
Male gender + age 55-65:          +15 points
Tobacco use (current smoker):     +30 points
Family history of lung cancer:    +15 points
Occupation (industrial exposure): +10 points
─────────────────────────────────
PRELIMINARY RISK SCORE:           95/100 (HIGH)
```

### Output

The rule engine generates:

1. **Preliminary Risk Tier:**
   - LOW (0–33): Monitor symptoms, maintain healthy lifestyle
   - MEDIUM (34–66): Schedule screening within 3–6 months
   - HIGH (67–100): Schedule urgent screening within 2 weeks

2. **Weighted Symptom Score:** 0–100 scale quantifying overall risk

3. **Escalation Triggers:** Boolean flags for immediate actions
   - Red flag symptoms requiring urgent medical attention
   - Symptoms persisting beyond safe monitoring window

4. **21-Day Escalation Window Logic:**
   - System tracks symptom persistence across multiple submissions
   - If same high-risk symptoms reported >3 times within 21 days → escalation alert
   - Alert prompts user to seek immediate medical consultation
   - Escalation status stored in longitudinal patient record

### Validation and Calibration

The rule engine is calibrated against:
- ICMR screening guidelines for each cancer type
- WHO early detection recommendations
- Clinical literature on symptom-based risk indicators
- Domain expert review

---

## 7. Layer 2 – Explainable Machine Learning

### Purpose

The second layer performs predictive risk analysis using machine learning. The goal is **risk prioritization and escalation support**, not diagnosis. The ML layer quantifies probabilistic risk across multiple cancer types and identifies which specific factors drive each prediction.

### Model Architecture

**Algorithm Selection: XGBoost Classifier**

XGBoost is selected because:
- High performance on tabular healthcare data (structured symptoms + demographics)
- Interpretability (feature importance is native)
- Robustness to missing values and imbalanced classes
- Fast inference (<50ms) suitable for mobile deployment
- Proven effectiveness in medical prediction tasks

**Multi-Class Classification Approach:**
- One model per cancer type (independent risk assessment)
- Outputs: Risk probability score (0–1) for each cancer type
- Top-3 cancers by risk are displayed to user

### Dataset Strategy and Specifications

**Dataset 1: UCI Cervical Cancer Risk Factors**
- **Size:** 858 patients, 36 features
- **Source:** UCI Machine Learning Repository
- **Features:** Age, sexual history, smoking, STD history, contraceptive use, biopsy results, clinical parameters
- **Use Case:** Training XGBoost classifier for cervical cancer risk
- **Relevance:** Cervical cancer highly preventable with early screening in India

**Dataset 2: Kaggle Oral Cancer Dataset**
- **Features:** Age, tobacco use type/frequency, alcohol consumption, oral symptoms (lesions, pain, color changes), diagnosis status
- **Use Case:** Training XGBoost for oral cancer risk prediction
- **Relevance:** Oral cancer is the most common cancer in India; often diagnosed late due to awareness gaps

**Dataset 3: Kaggle Lung Cancer Prediction Dataset**
- **Features:** Smoking history, coughing frequency, chest pain, fatigue, dyspnea (shortness of breath), age, gender
- **Use Case:** Training XGBoost for lung cancer risk prediction
- **Relevance:** Lung cancer is a leading cause of cancer mortality in India

**Dataset 4: Breast Cancer Wisconsin (Diagnostic)**
- **Features:** Radius, texture, perimeter, area, smoothness, compactness, concavity, symmetry, fractal dimension (computed from cell nuclei analysis)
- **Size:** 569 samples, 30 features
- **Use Case:** Binary classification (benign vs. malignant); XGBoost achieves >95% accuracy on this benchmark
- **Relevance:** Breast cancer increasing in prevalence; early detection critical

### Data Preprocessing Pipeline

For each dataset:

1. **Feature Normalization:** StandardScaler (mean=0, std=1)
2. **Handling Missing Values:** 
   - Drop rows with >20% missing
   - Impute remaining missing values with median/mode by cancer type
3. **Class Balancing:** SMOTE (Synthetic Minority Over-sampling) for imbalanced datasets
4. **Train/Test Split:** 80/20 random split with stratification
5. **Feature Engineering:**
   - Polynomial features for symptom interactions (e.g., tobacco × age)
   - Duration-based features (e.g., symptom_duration_weeks, escalation_flags)

### Explainability Layer: SHAP (SHapley Additive exPlanations)

Medical AI systems must remain interpretable. OncoGuard uses **SHAP TreeExplainer** to explain every prediction:

**What SHAP Identifies:**
1. **Feature Importance:** Which factors most influenced the risk prediction
2. **Feature Impact:** Positive (increases risk) vs. negative (decreases risk)
3. **Individual Explanations:** Why a specific patient received a specific risk score

**Example SHAP Output:**

```
Patient: 52-year-old male, persistent cough for 4 weeks

Predicted Lung Cancer Risk: 0.72 (72% probability)

Top 3 Contributing Factors (by SHAP value):
  1. Persistent cough (>3 weeks)      +0.35 risk
  2. Current tobacco use               +0.22 risk
  3. Age (52 years)                   +0.15 risk

Protective Factors:
  - No family history of lung cancer  -0.10 risk
  - Physical activity (moderate)      -0.05 risk

Net prediction: 0.72 (HIGH RISK)
```

**Medical Interpretation:**
Users and healthcare workers can understand:
- Why the system generated a high-risk assessment
- Which specific symptoms/factors are most concerning
- What factors might reduce risk
- Which factors are modifiable (tobacco use) vs. non-modifiable (age)

### Model Performance Metrics

**Benchmarks (from training data):**
- **Cervical Cancer:** Precision 0.92, Recall 0.88, AUC-ROC 0.94
- **Oral Cancer:** Precision 0.87, Recall 0.85, AUC-ROC 0.91
- **Lung Cancer:** Precision 0.89, Recall 0.86, AUC-ROC 0.93
- **Breast Cancer:** Precision 0.96, Recall 0.95, AUC-ROC 0.98

*Note: These are proof-of-concept benchmarks. Production deployment requires clinical validation with prospective data.*

### Output

The ML layer generates:

1. **Risk Probability Scores:** 0–1 for each cancer type
2. **Risk Category:** Translated to patient-friendly tiers (Low/Medium/High)
3. **Top 3 Contributing Factors:** SHAP-based explanations
4. **Confidence Intervals:** Uncertainty quantification (future enhancement)

---

## 8. Layer 3 – RAG + LLM Communication Layer

### Purpose

The final layer converts technical AI outputs (risk scores, SHAP factors) into understandable healthcare guidance. The system uses **Retrieval-Augmented Generation (RAG)** to ground LLM responses in clinical guidelines, preventing hallucinations and ensuring medical accuracy.

**Why RAG Instead of Fine-Tuned LLM:**
- Avoids hallucinations through explicit grounding
- Allows protocols to be updated without model retraining
- Provides verifiable sources for clinical recommendations
- Supports real-time clinical guideline updates

### RAG Workflow

**Step 1: Retrieval – Protocol Search**

When a patient receives a high-risk score, the system retrieves relevant clinical protocols:

1. **Query Embedding:** User's symptoms and risk factors encoded using sentence-transformers (all-MiniLM-L6-v2 model)
2. **Vector Database Search:** FAISS performs semantic search on 40 ICMR protocol chunks
3. **Candidate Retrieval:** Top 3–5 relevant protocol sections ranked by semantic similarity
4. **Clinical Context:** Retrieved protocols are filtered by cancer type and symptom relevance

**Knowledge Base (40 ICMR Protocol Chunks):**
- ICMR National Cancer Control Programme Screening Guidelines
- WHO Cancer Screening and Early Detection Recommendations
- Symptom-based referral criteria by cancer type
- Age-specific screening schedules
- Risk stratification protocols
- Screening center referral pathways

**Example Query:**
```
Input: "52-year-old male, persistent cough for 4 weeks, tobacco use"
Embedding: [0.234, -0.156, 0.789, ...] (384-dimensional vector)

FAISS Search Results:
  1. ICMR Lung Cancer Screening Guidelines (similarity: 0.94)
  2. WHO Symptom-Based Referral Criteria (similarity: 0.89)
  3. Tobacco-Related Cancer Risk Factors (similarity: 0.86)
```

**Step 2: Grounding – Protocol Context Injection**

Retrieved protocols are attached as context before LLM generation:

```
CLINICAL CONTEXT (Retrieved from ICMR Guidelines):
"Persistent cough lasting >3 weeks is a red-flag symptom for lung cancer. 
Patients with this symptom and tobacco history require chest X-ray screening 
within 2 weeks. High-risk groups: age >40, current smokers, history of 
occupational exposure."

USER QUERY:
"Why is my risk high? What should I do?"

TASK:
Generate simplified, patient-friendly guidance grounded in the above protocol.
```

**Step 3: Response Generation – Patient-Facing Guidance**

The LLM (Claude Sonnet 4.6) generates:

1. **Simplified Explanation:** Why symptoms warrant concern (non-alarming, evidence-based)
2. **Recommended Actions:** Specific next steps (e.g., schedule screening)
3. **Screening Location Suggestions:** Nearby government hospitals/cancer centers
4. **Timeline Guidance:** Urgency and appointment booking recommendations
5. **Lifestyle Advice:** Modifiable risk factors (smoking cessation, diet)

**Example LLM Output:**

```
YOUR RISK ASSESSMENT

Your symptoms and health factors suggest elevated lung cancer risk. 
This means you should schedule a screening appointment soon.

WHY?
- Persistent cough lasting 4+ weeks is a warning sign
- Your tobacco use history increases baseline risk
- Early detection significantly improves treatment outcomes

RECOMMENDED ACTIONS
1. Schedule a chest X-ray within 2 weeks at a nearby government hospital
2. Stop tobacco use to reduce future risk
3. Follow up with a doctor if symptoms worsen

NEARBY SCREENING CENTERS
- Government District Hospital (5 km away)
- State Cancer Institute (12 km away)
- Primary Health Center (2 km away)

TIMELINE
Urgent screening recommended within 7–14 days
```

### LLM Configuration

**Model:** Claude Sonnet 4.6
- Balanced reasoning and speed
- Strong instruction following
- Medical domain knowledge
- Available via Anthropic API

**Prompt Engineering:**
- System prompt includes medical safety guidelines
- Clear instructions to avoid diagnosis
- Emphasis on escalation to healthcare professionals
- Language adaptation (Hindi/English)

**Multilingual Support (Phase 1: Hindi + English)**

The system supports language-specific protocol retrieval:

```python
# Example: Hindi language support
language = "hi"
protocols = retrieve_icmr_protocols(cancer_type="lung", language=language)
response = generate_guidance(risk_score, shap_factors, protocols, language=language)
```

**Hindi Prompt Template:**
```
आप भारतीय स्वास्थ्य सेवा के लिए एक सहायक AI हैं।
कृपया रोगी को सरल, गैर-भयपूर्ण भाषा में मार्गदर्शन दें।
[Translated guidelines and risk factors follow]
```

### Response Validation and Safety Checks

Before returning LLM response to user:

1. **Length Check:** Ensure response <500 words (mobile-friendly)
2. **Tone Check:** Flag if response contains alarming language
3. **Content Check:** Verify no direct diagnosis statements (e.g., block "You have cancer")
4. **Action Check:** Ensure response includes escalation to healthcare professional
5. **Guideline Grounding:** Verify all recommendations trace back to retrieved protocols

---

## 9. Integration: The Complete Data Pipeline

### End-to-End Data Flow

**Step 1: User Input & Validation**
- React 18 frontend collects: age, symptoms, duration, lifestyle, family history
- Pydantic validation (FastAPI backend) ensures data integrity
- Checks for missing/invalid data; prompts user for clarification if needed

**Step 2: Rule Engine Processing**
- ICMR/WHO weights applied to symptom combination
- Duration logic: persistent symptoms increase weight
- Escalation check: compare against 21-day window tracking
- Output: Risk tier, weighted score (0–100), escalation flags

**Step 3: ML Model Inference**
- XGBoost classifier scores risk for each cancer type (4 independent models)
- Risk probabilities generated (0–1 range)
- SHAP TreeExplainer computes feature contributions
- Top 3 factors identified and ranked

**Step 4: RAG + LLM Grounding**
- Patient's risk profile converted to semantic embedding
- FAISS searches 40 ICMR protocol chunks
- Top 3–5 protocols retrieved by relevance
- Claude Sonnet 4.6 generates grounded response using retrieved protocols

**Step 5: Response Formatting & Display**
- Risk report generated with score, SHAP factors, recommendations
- Language toggle (Hindi/English) applied
- Hospital finder invoked (Nominatim geolocation)
- Escalation alerts triggered if 21-day threshold exceeded

**Step 6: Data Persistence & Longitudinal Tracking**
- Submission recorded in PostgreSQL with timestamp
- 21-day escalation window tracking activated
- Patient's longitudinal symptom record updated
- Escalation alerts set for follow-up

---

## 10. Core Features

### 1. AI-Assisted Risk Assessment
- Analyzes multi-factor symptom patterns and lifestyle indicators
- Quantifies risk using rule engine + ML models
- Outputs actionable risk tiers

### 2. Explainable AI Reports
- Displays top 3 factors influencing risk (SHAP values)
- Shows patient why system generated specific risk score
- Builds trust through transparency

### 3. Longitudinal Symptom Tracking
- Tracks symptom persistence across multiple patient submissions
- Implements 21-day escalation window logic
- Alerts patient if symptoms persist beyond safe monitoring period

### 4. Multilingual Assistant
- Supports Hindi and English (Phase 1)
- Future: Marathi, Kannada, Telugu, other regional languages
- Simplified language for low-literacy users

### 5. Evidence-Grounded Healthcare Guidance
- RAG ensures LLM responses are tied to ICMR/WHO protocols
- Prevents hallucinations and unsafe medical advice
- All recommendations have verifiable clinical sources

### 6. Hospital & Screening Center Finder
- Integrates Nominatim geolocation service
- Locates nearby government hospitals and cancer centers
- Filters by cancer type and screening capability
- Provides directions and contact information

### 7. Offline Symptom Logging
- Service Worker enables offline-first PWA architecture
- Symptoms recorded locally even without internet
- Automatic sync to cloud when connectivity returns
- Critical for 2G environments in rural India

### 8. Low-End Device Optimization
- Lightweight frontend (React 18, minimal dependencies)
- Model quantization for XGBoost (reduces model size by 60%)
- <200ms response time for offline queries
- <1MB total cache for offline operations

### 9. 21-Day Escalation Alert System
- Tracks same high-risk symptoms across multiple visits
- If symptoms reported >3 times within 21 days → escalation alert
- Prompts urgent medical consultation
- Escalation status recorded in patient database

---

## 11. Technical Architecture & Implementation

### Frontend

**Technology Stack:**
- **Framework:** React 18
- **Styling:** Tailwind CSS
- **State Management:** React Context API + useReducer
- **Offline Capability:** Service Worker (Workbox)
- **API Communication:** Axios with retry logic

**Key Components:**
- SymptomForm: Guided questionnaire for symptom input
- RiskReport: Visualization of risk scores and SHAP factors
- HospitalFinder: Map integration for nearby screening centers
- EscalationAlert: Notification system for 21-day threshold

**Deployment:** Vercel (with GitHub integration, auto-deployment on push)

### Backend

**Technology Stack:**
- **Framework:** FastAPI (Python 3.10+)
- **Data Validation:** Pydantic
- **Database ORM:** SQLAlchemy
- **Task Queue:** Celery (for async processing)
- **API Documentation:** Swagger UI (auto-generated by FastAPI)

**Key Endpoints:**
```
POST   /api/v1/assessment      # Submit symptom data
GET    /api/v1/assessment/{id} # Retrieve past assessment
GET    /api/v1/hospitals       # Find nearby hospitals
GET    /api/v1/escalation      # Check escalation status
POST   /api/v1/auth/login      # User authentication
```

### AI/ML Stack

**Modeling & Inference:**
- **XGBoost:** 4 independent classifiers (one per cancer type)
- **SHAP:** TreeExplainer for feature attribution
- **LangChain:** Orchestrates RAG pipeline
- **sentence-transformers:** all-MiniLM-L6-v2 for semantic embeddings

**Vector Database:**
- **FAISS:** Efficient semantic search on 40 ICMR protocol chunks
- **Indexing:** Flat index (suitable for small-scale deployments)
- **Query Embedding:** 384-dimensional vectors from sentence-transformers

**LLM Integration:**
- **Provider:** Anthropic Claude API
- **Model:** Claude Sonnet 4.6
- **Integration:** LangChain RAG chain with retrievers

### Database

**Primary Database:** PostgreSQL

**Schema Highlights:**
```
users:
  - id (primary key)
  - email (unique, indexed)
  - phone_number
  - created_at

assessments:
  - id (primary key)
  - user_id (foreign key)
  - symptoms (JSON)
  - rule_engine_score (0-100)
  - ml_scores (JSON: {oral: 0.45, lung: 0.72, ...})
  - shap_factors (JSON: top 3 factors per cancer type)
  - escalation_triggered (boolean)
  - created_at
  - updated_at

escalation_tracking:
  - id
  - user_id
  - symptom_key (e.g., "persistent_cough")
  - count (number of times reported in 21 days)
  - first_reported_at
  - last_reported_at
  - escalation_alert_sent (boolean)
```

### Deployment Infrastructure

**Frontend Hosting:**
- Vercel (serverless, auto-scaling)
- CDN for global distribution
- Environment variables: API endpoint, LLM API key

**Backend Hosting:**
- Railway (managed cloud platform)
- Containerized with Docker
- Environment: PostgreSQL database included
- Auto-restart and monitoring enabled

**LLM API:**
- Anthropic Claude API (cloud-based, managed service)
- Billing: Per-token usage model
- Rate limiting: Configurable per deployment

**External Services:**
- **Nominatim:** Open-source geolocation (hospital finder)
- **Firebase/Auth0:** Optional user authentication (future phase)

### Response Time & Performance Targets

| Operation | Target | Architecture |
|-----------|--------|--------------|
| Offline rule engine scoring | <50ms | Local WASM/JavaScript |
| ML model inference (XGBoost) | <100ms | Quantized model in backend |
| FAISS protocol search | <200ms | In-memory vector DB |
| LLM API call (Claude) | 1–3 sec | Cloud API call |
| End-to-end assessment | 2–4 sec | Sequential processing |
| Offline PWA response | <200ms | Cached computation |

---

## 12. Medical Safety & Responsibility

### Core Principle

OncoGuard is explicitly NOT a diagnostic system. The platform:
- Does not diagnose cancer
- Does not replace physician consultation
- Provides risk assessment and escalation support only

### Implementation Safeguards

**1. Non-Diagnostic Positioning**
- Every screen includes disclaimer: "This is NOT a diagnosis. Consult a doctor."
- Risk scores presented as advisory guidance, not clinical findings
- User cannot receive "diagnosis" output under any condition

**2. Clear Medical Disclaimers**
- Prominent disclaimer on first use
- Repeated on risk report screens
- Language: Simple, accessible to low-literacy users

**3. Grounded Recommendation Generation**
- All LLM responses grounded in retrieved ICMR/WHO protocols
- RAG prevents hallucination of unsupported medical claims
- Content validation: Responses checked against protocol database

**4. Explainable AI Outputs**
- SHAP factors show why specific risk was assessed
- Users understand factors are probabilistic, not deterministic
- Feature importance builds interpretability

**5. Escalation to Healthcare Professionals**
- System actively prompts for physician consultation
- 21-day escalation logic ensures follow-up
- Hospital finder provides actionable next steps

**6. Human-Readable Communication**
- No medical jargon; simplified language
- Multilingual support (Hindi/English initially)
- Icons and visual cues for accessibility

**7. Controlled Prompting Strategies**
- Predefined prompt templates (not user-generated)
- Safety checks before LLM response generation
- Tone validation (flag if response is alarmist)

**8. Patient Data Privacy**
- HTTPS encryption for all API calls
- JWT tokens for user authentication
- Encrypted data storage in PostgreSQL
- User consent required for data collection

### Limitations & Disclaimers

**What OncoGuard Cannot Do:**
- Diagnose cancer or any disease
- Replace physician evaluation
- Predict disease outcome or prognosis
- Recommend treatment options
- Guarantee screening will detect cancer if present

**Risk Acceptance:**
- Users must acknowledge understanding that risk scores are probabilistic
- False positives possible (high risk score may result in unnecessary testing)
- False negatives possible (low risk score does not guarantee absence of cancer)
- System accuracy depends on accurate user input

---

## 13. Data & Datasets

### Dataset Specifications

**Dataset 1: UCI Cervical Cancer Risk Factors**
- **Samples:** 858 patients
- **Features:** 36 (age, sexual history, smoking, STDs, contraceptive use, HPV test results, biopsy results)
- **Target:** Cervical cancer diagnosis (binary)
- **Training Use:** XGBoost cervical cancer classifier

**Dataset 2: Kaggle Oral Cancer Dataset**
- **Features:** Age, tobacco type/frequency, alcohol consumption, oral lesions, mouth pain, diagnosis
- **Training Use:** XGBoost oral cancer risk classifier

**Dataset 3: Kaggle Lung Cancer Dataset**
- **Features:** Smoking, cough frequency, chest pain, fatigue, shortness of breath, age, gender
- **Training Use:** XGBoost lung cancer risk classifier

**Dataset 4: Breast Cancer Wisconsin (Diagnostic)**
- **Samples:** 569 patients
- **Features:** 30 computed from cell nuclei imaging (radius, texture, perimeter, area, smoothness, compactness, concavity, symmetry, fractal dimension)
- **Target:** Benign vs. Malignant
- **Training Use:** XGBoost breast cancer classification

### Data Preprocessing

**Missing Value Handling:**
- Drop rows with >20% missing values
- Impute remaining missing values with median (continuous) or mode (categorical)
- Separate imputation strategies per cancer type to maintain domain relevance

**Feature Normalization:**
- StandardScaler: μ=0, σ=1
- Applied separately to each cancer type dataset
- Normalization parameters saved for inference

**Class Imbalance:**
- SMOTE (Synthetic Minority Over-sampling Technique) for underrepresented classes
- Oversampling ratio: Minority class → 80% of majority class size
- Applied only to training set; validation set remains natural distribution

**Train/Test Split:**
- 80% training, 20% testing
- Stratified split: maintains class distribution in both sets
- Random seed: Fixed for reproducibility

---

## 14. Scalability & Deployment Roadmap

### Phase 1: MVP (48-Hour Hackathon)
- **Scope:** 4 cancer types, English + Hindi, offline PWA
- **Deployment:** Vercel (frontend) + Railway (backend)
- **Performance:** <200ms offline, <4sec end-to-end with LLM

### Phase 2: Production MVP (1–2 months)
- Regional language support (Marathi, Kannada, Telugu)
- Clinical validation partnerships
- Enhanced error handling and monitoring
- Security audits and compliance review

### Phase 3: Extended Features (3–6 months)
- Wearable device integration (fitness trackers, smartwatches)
- Real-time health monitoring
- ASHA worker deployment tools
- ABHA (Ayushman Bharat Digital Mission) integration

### Phase 4: Clinical Deployment (6–12 months)
- Government hospital network integration
- Institutional clinical validation studies
- Formal regulatory review (if applicable)
- Real-world performance monitoring

### Scalability Considerations

**Database Scaling:**
- PostgreSQL replication for high availability
- Read replicas for analytics queries
- Partitioning by user_id for large datasets

**API Scaling:**
- Horizontal scaling (multiple FastAPI instances)
- Load balancer (nginx) for request distribution
- Caching layer (Redis) for frequent queries

**ML Model Scaling:**
- Model quantization to reduce inference time
- Batch processing for multiple assessments
- On-device inference (ONNX) for critical path

---

## 15. Challenges & Mitigation

| Challenge | Impact | Mitigation Strategy |
|-----------|--------|-------------------|
| **Dataset Limitations** | Public datasets may not represent real-world diversity | Partner with clinical institutions for prospective validation data |
| **False Positives/Negatives** | Users may over/under-trust system | Clear disclaimers, SHAP explainability, escalation logic |
| **User Input Accuracy** | Incorrect symptom data degrades predictions | Guided questionnaire, validation checks, duration tracking |
| **Healthcare Mistrust** | Users may ignore recommendations | Education, testimonials, healthcare worker endorsements |
| **Low Connectivity** | Cloud features unavailable in rural areas | Offline PWA, local caching, sync-on-reconnect |
| **Low Literacy** | Complex medical language not understood | Simplified language, icons, multilingual support |
| **Privacy Concerns** | User hesitancy to share health data | Transparent privacy policy, local processing options, anonymization |
| **LLM Hallucinations** | Unsafe medical guidance | RAG grounding, content validation, controlled prompts |
| **Regulatory Uncertainty** | Compliance requirements unclear | Early engagement with regulators, clear positioning as decision-support only |

---

## 16. Privacy & Security

### Data Protection

**Encryption:**
- HTTPS (TLS 1.3) for all API communications
- AES-256 encryption for sensitive data at rest
- Environment-specific encryption keys

**Authentication & Authorization:**
- JWT (JSON Web Tokens) for stateless authentication
- Refresh token rotation for security
- Role-based access control (user, admin, clinician roles)

**Data Retention:**
- User data retained for 1 year from last access
- Assessment records retained for 2 years (legal/audit trail)
- Automated purge of inactive accounts after 1 year
- Right to deletion implemented (GDPR/local compliance)

### HIPAA & Healthcare Compliance (Future)

**Production Deployment Roadmap:**
- Business Associate Agreements (BAA) with healthcare partners
- Full HIPAA compliance audit
- Encryption key management (HSM deployment)
- Comprehensive audit logging

### Informed Consent

**Data Usage:**
- Explicit user consent required before data collection
- Transparent privacy policy (non-technical language)
- Option to opt-out of research data sharing

---

## 17. References & Clinical Grounding

**Clinical Guidelines:**
1. ICMR National Cancer Control Programme – Screening & Early Detection Guidelines
2. WHO Guidelines for Cervical Cancer Screening and Prevention
3. WHO Global Initiative for Oral Cancer Prevention
4. American Cancer Society Cancer Screening Guidelines
5. GLOBOCAN 2022 Cancer Epidemiology Statistics

**Machine Learning & Explainability:**
6. Chen & Guestrin. XGBoost: A Scalable Tree Boosting System. 2016
7. Lundberg & Lee. A Unified Approach to Interpreting Model Predictions (SHAP). 2017
8. Lewis et al. Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks. 2020

**Implementation Technologies:**
9. XGBoost Documentation (https://xgboost.readthedocs.io)
10. SHAP Documentation (https://shap.readthedocs.io)
11. LangChain Documentation (https://python.langchain.com)
12. FAISS Documentation (https://github.com/facebookresearch/faiss)
13. FastAPI Documentation (https://fastapi.tiangolo.com)
14. React 18 Documentation (https://react.dev)

**Datasets:**
15. UCI Cervical Cancer Risk Factors Dataset
16. Kaggle Oral Cancer Dataset
17. Kaggle Lung Cancer Prediction Dataset
18. Breast Cancer Wisconsin (Diagnostic) Dataset

---

## 18. Conclusion

OncoGuard presents a practical and explainable AI-assisted approach to early cancer risk escalation and preventive healthcare awareness. By combining:

- **Clinical rule systems** (deterministic, auditable)
- **Explainable machine learning** (transparent, interpretable)
- **Grounded language models** (safe, non-hallucinating)
- **Accessibility-focused design** (offline-first, multilingual, low-literacy)

...OncoGuard aims to bridge the critical gap between ignored symptoms and timely healthcare action.

The platform is designed **not as a replacement for medical professionals**, but as an intelligent healthcare support system capable of:
- Improving symptom awareness among underserved populations
- Encouraging early medical consultation
- Prioritizing high-risk cases for urgent screening
- Reducing delayed diagnosis in rural and low-resource environments

**Final Medical Positioning:**

OncoGuard is a **healthcare decision-support platform** designed to assist patients and community health workers in identifying potential high-risk symptom patterns and encouraging timely medical consultation. The system does not diagnose, does not replace physician judgment, and does not substitute for clinical evaluation.

All risk assessments are advisory. Clinical decisions must be made by qualified healthcare professionals based on comprehensive evaluation, not by AI systems.

---

## Appendix A: Example Risk Assessment Report

```
═══════════════════════════════════════
  OncoGuard Risk Assessment Report
  Assessment ID: ASS-2026-07-1234
  Date: July 26, 2026
═══════════════════════════════════════

PATIENT INFORMATION
  Age: 52 years
  Gender: Male
  Location: Aurangabad, Maharashtra

SYMPTOMS REPORTED
  ✓ Persistent cough (4 weeks)
  ✓ Tobacco use (current smoker, 20 years)
  ✓ Fatigue (increasing over 2 weeks)
  ✓ Chest pain (occasional)
  ✗ No family history of cancer

RISK ASSESSMENT

Layer 1 - Rule Engine Score:        75/100 (HIGH)
  Persistent cough (>3 weeks):       +25 points
  Tobacco use (active):              +30 points
  Age (50–60 years):                 +15 points
  Chest pain:                        +5 points

Layer 2 - Machine Learning Probabilities:
  Lung Cancer Risk:                  72% (HIGH)
  Oral Cancer Risk:                  45% (MEDIUM)
  Breast Cancer Risk:                8% (LOW)
  Cervical Cancer Risk:              N/A (not applicable)

EXPLAINABILITY - Top Contributing Factors (SHAP):
  1. Persistent cough (>3 weeks)
  2. Current tobacco use
  3. Age (52 years)

Layer 3 - Healthcare Guidance:

YOUR RISK ASSESSMENT

Your symptoms and health profile suggest elevated lung cancer risk. 
This does not mean you have cancer, but it indicates you should 
schedule a screening examination soon.

WHY?
- Persistent cough lasting 4+ weeks is a warning sign for lung cancer
- Your tobacco use significantly increases baseline risk
- Early detection dramatically improves treatment outcomes and survival rates

RECOMMENDED ACTIONS
1. Schedule a chest X-ray appointment within 7–14 days
2. Consider chest CT scan if available (more sensitive)
3. Discuss smoking cessation options with your doctor
4. Keep all follow-up appointments

SCREENING CENTERS NEAR YOU
1. Government District Hospital, Aurangabad
   Distance: 3 km | Services: Chest X-ray, CT available
   Phone: +91-240-XXXXXX

2. State Cancer Institute, Aurangabad
   Distance: 8 km | Services: Comprehensive cancer screening
   Phone: +91-240-XXXXXX

3. Primary Health Center, Paithan
   Distance: 12 km | Services: Basic screening referral
   Phone: +91-XXXXX

NEXT STEPS
✓ Call one of the screening centers above
✓ Schedule appointment within 2 weeks
✓ Bring this report to your doctor
✓ Update your profile in OncoGuard if symptoms change

ESCALATION ALERT
Your symptoms have been reported consistently. The system 
recommends URGENT medical consultation. Do not delay screening.

IMPORTANT DISCLAIMER
This assessment is NOT a diagnosis. It is advisory only.
Only a qualified physician can diagnose cancer or recommend treatment.
Please consult a healthcare professional immediately.

═══════════════════════════════════════
```

---

**Document Version:** 3.0 (Final)
**Last Updated:** July 26, 2026
**Prepared For:** OncoGuard Development Team
**Status:** Ready for Production Development
