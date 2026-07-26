# OncoGuard Local Development Setup Guide 🛠️

This guide walks you through setting up the OncoGuard monorepo locally for development across all three subsystems: **FastAPI Backend**, **React 18 PWA Frontend**, and **AI/ML Brain Engine**.

---

## 1. System Prerequisites

Ensure you have the following installed on your machine:
- **Python 3.10+** (`python --version`)
- **Node.js 18+ & npm 9+** (`node --version` / `npm --version`)
- **PostgreSQL 14+** (`psql --version`)
- **Git 2.30+** (`git --version`)

---

## 2. Clone Repository & Set Up Git Identity

```bash
# 1. Clone repository
git clone https://github.com/YourUsername/oncoguard.git
cd oncoguard

# 2. Switch to develop branch
git checkout develop

# 3. Configure local git user (if not already set globally)
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

---

## 3. PostgreSQL Database Setup

Open your terminal or PostgreSQL command line (`psql -U postgres`) and run:

```sql
CREATE DATABASE oncoguard_db;
CREATE USER oncoguard_user WITH PASSWORD 'secure_password_here';
ALTER ROLE oncoguard_user SET client_encoding TO 'utf8';
ALTER ROLE oncoguard_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE oncoguard_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE oncoguard_db TO oncoguard_user;
\q
```

---

## 4. Subsystem Setup & Running Services

### Step 4A: Backend (FastAPI + Async SQLAlchemy)

```bash
cd backend

# 1. Create and activate Python virtual environment
python -m venv venv
# macOS/Linux:
source venv/bin/activate
# Windows PowerShell:
venv\Scripts\activate

# 2. Install Python dependencies
pip install -r requirements.txt

# 3. Create .env file from template
cat > .env << EOF
DATABASE_URL=postgresql+asyncpg://oncoguard_user:secure_password_here@localhost:5432/oncoguard_db
SECRET_KEY=your-secret-jwt-signing-key-32-chars
ANTHROPIC_API_KEY=your-anthropic-api-key-here
ENVIRONMENT=development
CORS_ORIGINS=["http://localhost:3000"]
EOF

# 4. Run Alembic database migrations
alembic upgrade head

# 5. Start Uvicorn live-reload development server
uvicorn app.main:app --reload --port 8000
```
- **Backend API Base URL:** `http://localhost:8000`
- **Interactive OpenAPI Docs:** `http://localhost:8000/docs`

---

### Step 4B: AI/ML Brain (Rule Engine, XGBoost, SHAP, RAG)

In a new terminal window:

```bash
cd brain

# 1. Create and activate virtual environment
python -m venv venv
source venv/bin/activate # Windows: venv\Scripts\activate

# 2. Install AI/ML dependencies
pip install -r requirements.txt

# 3. Create .env file
cat > .env << EOF
DATA_DIR=./data/datasets
MODELS_DIR=./models
DEBUG=True
EOF

# 4. Download datasets and preprocess (one-time setup)
python data/download_datasets.py
python data/preprocess.py

# 5. Test Layer 1 Clinical Rule Engine
python -m rule_engine.caution_framework
```

---

### Step 4C: Frontend (React 18 PWA + Tailwind CSS)

In a third terminal window:

```bash
cd frontend

# 1. Install Node dependencies
npm install

# 2. Create .env file
cat > .env << EOF
REACT_APP_API_URL=http://localhost:8000/api/v1
REACT_APP_ENVIRONMENT=development
EOF

# 3. Start development server
npm start
```
- **Frontend App URL:** `http://localhost:3000`

---

## 5. Testing & Verification

Run the test suites to confirm your local environment is functioning correctly:

```bash
# Backend unit & integration tests
cd backend
pytest tests/ -v

# AI/ML Brain rule & model tests
cd ../brain
pytest rule_engine/tests/ ml_models/tests/ -v

# Frontend Jest component tests
cd ../frontend
npm test -- --watchAll=false
```

---

## 6. Common Troubleshooting

- **Port Already in Use (8000 or 3000):**
  - Windows: `netstat -ano | findstr :8000` then `taskkill /PID <PID> /F`
  - macOS/Linux: `lsof -i :8000` then `kill -9 <PID>`
- **PostgreSQL Connection Error:**
  - Check that your `DATABASE_URL` uses `postgresql+asyncpg://` for async SQLAlchemy.
  - Verify PostgreSQL service is running (`pg_isready -h localhost`).
- **npm ERESOLVE Dependency Conflict:**
  - Run `npm install --legacy-peer-deps`.
