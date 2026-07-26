# Contributing to OncoGuard 🏥

Thank you for contributing to OncoGuard! This document outlines our Git workflow, commit message standards, code review rules, and development guidelines for our 48-hour hackathon build and beyond.

---

## 1. Branching Strategy

We use a **two-tier protected branch model** to ensure stability while moving fast:

- **`main`** — Production-ready, stable code only. **Never commit directly to `main`.** Updated only via Pull Request merges from `develop`.
- **`develop`** — Active integration branch where features come together.
- **`feature/<feature-name>`** — Create a feature branch from `develop` for every individual task or component.

### Workflow Example:

```bash
# 1. Switch to develop and pull the latest changes
git checkout develop
git pull origin develop

# 2. Create a new feature branch for your task
git checkout -b feature/rule-engine-caution

# 3. Work on your changes, stage, and commit
git add .
git commit -m "feat: implement CAUTION framework weighted scoring"

# 4. Push your feature branch to remote
git push origin feature/rule-engine-caution

# 5. Open a Pull Request on GitHub against develop
```

---

## 2. Conventional Commit Messages

We strictly follow the **Conventional Commits** specification. Commit messages must be structured as:

```
<type>: <short imperative summary>
```

### Allowed Commit Types:
- **`feat:`** — A new feature or capability (e.g., `feat: implement Layer 1 CAUTION rule scoring`)
- **`fix:`** — A bug fix (e.g., `fix: resolve NaN duration calculation in symptom list`)
- **`docs:`** — Documentation changes only (e.g., `docs: add OpenAPI schemas and schema DDL`)
- **`refactor:`** — Code change that neither fixes a bug nor adds a feature
- **`test:`** — Adding or updating automated tests (e.g., `test: add unit tests for XGBoost SHAP explainer`)
- **`perf:`** — Performance optimizations (e.g., `perf: optimize FAISS vector index search latency`)
- **`chore:`** — Routine maintenance, build scripts, or dependency changes

### Examples of Good vs. Bad Commits:
- ✅ `feat: add phone OTP verification endpoint with rate limiting`
- ✅ `fix: handle offline sync queue retry when 2G drops`
- ❌ `fixed bug`
- ❌ `wip`
- ❌ `updated files`

---

## 3. Code Quality & Standards

### Python (`backend/` & `brain/`)
- Follow **PEP 8** style guidelines.
- Use **`ruff`** or **`flake8`** for linting.
- Use **`black`** for code formatting.
- Ensure all FastAPI endpoints have **Pydantic** type annotations and docstrings.

### JavaScript / React (`frontend/`)
- Follow **ESLint** and **Prettier** rules.
- Write functional components with React Hooks.
- Ensure UI components follow the **Calm Design System** (no scary red alerts; use soothing teal/amber palettes).

### Medical Safety Guardrails
- **No Diagnostic Language:** Never use phrases like *"You have cancer"* or *"Positive diagnosis"*.
- **Required Disclaimers:** All assessment screens must prominently display the disclaimer: *"Advisory only — please consult a qualified healthcare professional."*
- **Explainability:** Always display the SHAP contributing symptom factors alongside risk scores.

---

## 4. Pull Request (PR) & Review Process

1. **Target Branch:** Always open PRs against **`develop`** (never `main`).
2. **Title:** Use the Conventional Commit format for the PR title.
3. **Description:** Include:
   - What the PR does (and why).
   - Any relevant issue numbers.
   - Screenshots or GIFs for UI changes.
   - Verification commands run (e.g., `pytest` or `npm test`).
4. **Approval:** Require **at least 1 teammate approval** before merging.
5. **Merge Strategy:** Use **Squash and Merge** when merging into `develop` to keep git history clean and readable.

---

## 5. Security & Credentials

- 🚨 **NEVER commit `.env` files, API keys, or database passwords.**
- Always use `.env.example` templates with dummy values for documentation.
- If you accidentally commit a secret, immediately notify the team lead and rotate the key.
