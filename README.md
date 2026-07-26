# OncoGuard 🏥

[![Status: Active Development](https://img.shields.io/badge/Status-Active%20Development-00C853?style=flat-square)](https://github.com)
[![AI Architecture: 3-Layer Hybrid](https://img.shields.io/badge/AI%20Architecture-3--Layer%20Hybrid-2962FF?style=flat-square)](./brain)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple?style=flat-square)](./LICENSE)

## Explainable AI-Powered Early Cancer Risk Escalation Platform

**OncoGuard** is an offline-first, multilingual healthcare decision-support PWA designed to identify early cancer symptom patterns and encourage timely medical screening in low-resource environments across India. Combining clinical rules, machine learning, and RAG-grounded LLMs, OncoGuard delivers **explainable risk assessments without diagnosing cancer**.

---

### 🚨 Medical & Clinical Disclaimer
> [!IMPORTANT]
> **OncoGuard is strictly a healthcare decision-support and awareness tool.**
> - ❌ **Does NOT diagnose cancer** or predict treatment outcomes.
> - ❌ **Cannot replace physician consultation** or professional oncology evaluations.
> - ✅ **Advisory Only:** All risk assessments and escalation recommendations must be reviewed by qualified healthcare professionals.

---

### 🧠 Three-Layer Hybrid AI Architecture

```
[Patient Symptoms / Demographics / Longitudinal Data]
                         │
                         ▼
        ┌─────────────────────────────────┐
        │  LAYER 1: Clinical Rule Engine  │  <-- ICMR/WHO CAUTION Framework (0-100 Score)
        └────────────────┬────────────────┘      21-Day Symptom Escalation Logic (<50ms)
                         │
                         ▼
        ┌─────────────────────────────────┐
        │  LAYER 2: Explainable ML Stack  │  <-- 4x XGBoost Classifiers (Oral, Lung, Breast, Cervical)
        └────────────────┬────────────────┘      SHAP TreeExplainer Feature Attribution (<100ms)
                         │
                         ▼
        ┌─────────────────────────────────┐
        │ LAYER 3: Grounded RAG + LLM     │  <-- FAISS Vector Store + 40 ICMR Protocol Chunks
        └─────────────────────────────────┘      Anthropic Claude Sonnet 4.6 API (Multilingual)
```

---

### 📦 Monorepo Structure

```
oncoguard/
├── brain/               # AI/ML Engine: Rule Engine, XGBoost/SHAP Models, FAISS RAG, ICMR Chunks
├── backend/             # FastAPI Server: REST API, Pydantic Schemas, Async SQLAlchemy, PostgreSQL
├── frontend/            # React 18 PWA: Tailwind CSS, Service Workers, Offline Caching (<200ms)
├── docs/                # Core Production Specifications (PRD, TRD, UI/UX, Flow, Schema, Plan)
├── README.md            # Project overview & architecture (This file)
├── SETUP.md             # End-to-end local development setup guide
├── CONTRIBUTING.md      # Team Git workflow, branch rules & commit conventions
└── LICENSE              # MIT License
```

---

### 📚 Core Production Documentation

| Specification File | Description |
| :--- | :--- |
| **[01_PRD.md](./docs/01_PRD.md)** | Product Requirements Document, target personas (ASHA Workers), and core KPIs |
| **[02_TRD.md](./docs/02_TRD.md)** | Technical Requirements Document and Layer 1–3 AI math & architecture |
| **[03_App_Flow.md](./docs/03_App_Flow.md)** | Complete end-to-end user navigation, offline queueing, and alert flows |
| **[04_UI_UX_Design_Brief.md](./docs/04_UI_UX_Design_Brief.md)** | Calm visual design system, accessibility (a11y), and Tailwind tokens |
| **[05_Backend_Schema.md](./docs/05_Backend_Schema.md)** | PostgreSQL DDL, SQLAlchemy async models, and OpenAPI endpoints |
| **[06_Implementation_Plan.md](./docs/06_Implementation_Plan.md)** | 48-Hour Hackathon 9-Phase execution roadmap |

---

### 🚀 Quick Start
For full setup instructions including PostgreSQL configuration, environment variables, and running locally, see our **[SETUP.md](./SETUP.md)**.

```bash
# 1. Clone the repository
git clone https://github.com/YourUsername/oncoguard.git
cd oncoguard

# 2. Check out the active development branch
git checkout develop
```

---

### 🤝 Team & Contributing
We follow the **Conventional Commits** specification (`feat:`, `fix:`, `docs:`, etc.) and a strict **Pull Request review process** on the `develop` branch. Please read **[CONTRIBUTING.md](./CONTRIBUTING.md)** before pushing code.

---

### 📜 License
This project is licensed under the **MIT License** – see [LICENSE](./LICENSE) for details.
