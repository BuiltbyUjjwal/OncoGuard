# OncoGuard Setup Guide

This guide walks through setting up the OncoGuard project locally for development.

## Prerequisites

- **Python 3.10+** ([Download](https://www.python.org/downloads/))
- **Node.js 16+** ([Download](https://nodejs.org/))
- **PostgreSQL 13+** ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/))
- **VS Code** or your preferred code editor ([Download](https://code.visualstudio.com/))

### Verify Installation

```bash
python --version      # Should be 3.10 or higher
node --version        # Should be 16 or higher
npm --version         # Should be 7 or higher
git --version         # Should be 2.30 or higher
psql --version        # Should be 13 or higher (on Windows, may need PATH setup)
```

---

## Step 1: Clone the Repository

```bash
# Choose your directory
cd ~/projects/

# Clone the repo
git clone https://github.com/YourUsername/oncoguard.git
cd oncoguard

# Set up Git identity (one-time)
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

---

## Step 2: Set Up PostgreSQL Database

### macOS / Linux

```bash
# Start PostgreSQL service
brew services start postgresql   # macOS
# OR
sudo systemctl start postgresql  # Linux

# Create database and user
psql postgres
```

Then run in PostgreSQL prompt:
```sql
CREATE DATABASE oncoguard;
CREATE USER oncoguard_user WITH PASSWORD 'secure_password_here';
ALTER ROLE oncoguard_user SET client_encoding TO 'utf8';
ALTER ROLE oncoguard_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE oncoguard_user SET default_transaction_deferrable TO on;
ALTER ROLE oncoguard_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE oncoguard TO oncoguard_user;
\q
```

### Windows

1. Install PostgreSQL from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Choose `postgres` as superuser password
3. Add PostgreSQL to PATH:
   - Search "Environment Variables" in Windows
   - Edit System Environment Variables
   - Add `C:\Program Files\PostgreSQL\15\bin` to PATH
4. Open PowerShell and run:
```powershell
psql -U postgres
```

Then run SQL commands above.

---

## Step 3: Set Up Backend (FastAPI)

```bash
cd backend

# Create Python virtual environment
python -m venv venv

# Activate virtual environment
# macOS/Linux:
source venv/bin/activate

# Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cat > .env << EOF
DATABASE_URL=postgresql://oncoguard_user:secure_password_here@localhost:5432/oncoguard
ANTHROPIC_API_KEY=your_api_key_here
SECRET_KEY=your_secret_key_here
ENVIRONMENT=development
EOF

# Run database migrations
alembic upgrade head

# Start backend server
python -m uvicorn app.main:app --reload

# Server runs at http://localhost:8000
# API docs at http://localhost:8000/docs
```

---

## Step 4: Set Up Frontend (React)

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
REACT_APP_API_URL=http://localhost:8000
REACT_APP_ENVIRONMENT=development
EOF

# Start development server
npm start

# App opens at http://localhost:3000
```

---

## Step 5: Set Up Brain (AI/ML)

```bash
cd ../brain

# Create Python virtual environment
python -m venv venv

# Activate virtual environment
# macOS/Linux:
source venv/bin/activate

# Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Download datasets (one-time)
python data/download_datasets.py

# Preprocess datasets
python data/preprocess.py

# Train models
python ml_models/xgboost_training.py

# Test rule engine
python -m rule_engine.caution_framework
```

---

## Step 6: Verify Everything Works

### Backend Health Check
```bash
curl http://localhost:8000/health
# Should return: {"status": "ok"}
```

### Frontend Check
- Open http://localhost:3000 in browser
- Should see OncoGuard login page

### AI/ML Check
```bash
cd brain
python -c "from rule_engine.caution_framework import score; print(score({'age': 50, 'symptoms': ['cough']}))"
# Should return a numeric score
```

---

## Environment Variables Explained

### Backend (.env in `backend/`)

```
# Database Connection
DATABASE_URL=postgresql://username:password@localhost:5432/oncoguard

# API Keys
ANTHROPIC_API_KEY=sk-...                    # Get from Anthropic console
SECRET_KEY=your-super-secret-key-here       # Generate random string

# Settings
ENVIRONMENT=development                      # development or production
DEBUG=True                                   # Set to False in production
CORS_ORIGINS=["http://localhost:3000"]     # Frontend URL
```

### Frontend (.env in `frontend/`)

```
# API Configuration
REACT_APP_API_URL=http://localhost:8000     # Backend URL
REACT_APP_ENVIRONMENT=development            # development or production
```

### Brain (.env in `brain/`)

```
# Data paths
DATA_DIR=./data/datasets
MODELS_DIR=./models

# Settings
DEBUG=True
```

---

## Common Issues & Solutions

### Issue: `ModuleNotFoundError: No module named 'app'`
**Solution:**
```bash
# Make sure you're in the backend directory
cd backend
# Make sure virtual environment is activated
source venv/bin/activate
python -m uvicorn app.main:app --reload
```

### Issue: `PSError: connection to server at "localhost" failed`
**Solution:**
```bash
# Start PostgreSQL service
brew services start postgresql    # macOS
sudo systemctl start postgresql   # Linux
pg_ctl -D "C:\Program Files\PostgreSQL\15\data" start  # Windows
```

### Issue: `npm ERR! code ERESOLVE, ERESOLVE unable to resolve dependency tree`
**Solution:**
```bash
cd frontend
npm install --legacy-peer-deps
# Or upgrade npm
npm install -g npm@latest
npm install
```

### Issue: Port already in use (8000 or 3000)
**Solution:**
```bash
# Find process using port 8000
lsof -i :8000          # macOS/Linux
netstat -ano | findstr :8000  # Windows

# Kill the process
kill -9 <PID>          # macOS/Linux
taskkill /PID <PID> /F # Windows

# Or use different port
python -m uvicorn app.main:app --reload --port 8001
```

### Issue: `Could not connect to 'localhost:5432' - could not translate host name`
**Solution:**
- PostgreSQL is not running
- Username/password is wrong
- Check DATABASE_URL in .env
```bash
# Test connection
psql -U oncoguard_user -d oncoguard -h localhost
# It should prompt for password
```

---

## Project Structure for Development

```
oncoguard/
├── backend/              # FastAPI server
│   ├── venv/            # Virtual environment (don't commit!)
│   ├── app/
│   │   ├── main.py
│   │   ├── models.py    # SQLAlchemy models
│   │   ├── routes.py    # API endpoints
│   │   └── dependencies.py
│   ├── requirements.txt
│   ├── .env             # Don't commit!
│   └── .env.example     # Commit this
│
├── frontend/             # React app
│   ├── node_modules/    # Don't commit!
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── .env             # Don't commit!
│   └── .env.example     # Commit this
│
├── brain/                # AI/ML
│   ├── venv/            # Virtual environment (don't commit!)
│   ├── rule_engine/
│   ├── ml_models/
│   ├── rag_llm/
│   ├── data/
│   ├── requirements.txt
│   └── .env             # Don't commit!
│
└── docs/
    └── Documentation files
```

---

## Development Workflow

### Starting a Development Session

```bash
# Terminal 1: Backend
cd backend
source venv/bin/activate
python -m uvicorn app.main:app --reload

# Terminal 2: Frontend
cd frontend
npm start

# Terminal 3: Brain (as needed)
cd brain
source venv/bin/activate
python -m rule_engine.caution_framework
```

### Connecting Components

1. **Frontend calls Backend:**
   ```javascript
   const response = await fetch('http://localhost:8000/api/v1/assessment', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ age: 50, symptoms: ['cough'] })
   });
   ```

2. **Backend calls Brain:**
   ```python
   from brain.rule_engine import score_symptoms
   risk_score = score_symptoms(symptom_data)
   ```

3. **Backend calls Claude API:**
   ```python
   from brain.rag_llm import generate_guidance
   guidance = generate_guidance(risk_score, shap_factors)
   ```

---

## Testing Setup

### Run Backend Tests
```bash
cd backend
pytest tests/
pytest tests/ -v                    # Verbose output
pytest tests/test_models.py -k rule # Run specific tests
```

### Run Frontend Tests
```bash
cd frontend
npm test
npm test -- --coverage             # With coverage report
```

### Run Brain Tests
```bash
cd brain
pytest rule_engine/tests/
pytest ml_models/tests/
pytest rag_llm/tests/
```

---

## Database Migrations

### Create a new migration
```bash
cd backend
alembic revision --autogenerate -m "add_new_table"
```

### Run pending migrations
```bash
alembic upgrade head
```

### Rollback migration
```bash
alembic downgrade -1
```

---

## Debugging Tips

### Debug Backend (FastAPI)

```python
# Add print statements
print(f"DEBUG: user_id = {user_id}")

# Or use debugger
import pdb; pdb.set_trace()  # Execution stops here
# Type 'c' to continue, 'n' for next line, 'p variable' to print

# Or use VS Code debugger (add .vscode/launch.json)
```

### Debug Frontend (React)

```javascript
// Use browser DevTools (F12 or Ctrl+Shift+I)
// Add console.log
console.log("DEBUG:", data);

// Or use debugger
debugger;  // Execution stops here when DevTools open
```

### Debug Brain (AI/ML)

```python
# Test rule engine
from brain.rule_engine import score
print(score({'age': 50, 'symptoms': ['cough']}))

# Test ML models
from brain.ml_models import predict
probs = predict(patient_data)
print(f"Probabilities: {probs}")

# Test RAG
from brain.rag_llm import generate_response
response = generate_response(risk_score, factors)
print(response)
```

---

## Production Setup

Not for development, but here's what changes in production:

```bash
# Backend (use Gunicorn)
gunicorn app.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker

# Frontend (build static files)
npm run build
# Output in frontend/build/

# Database (use managed service like Railway or AWS RDS)
# Set ENVIRONMENT=production
# Use strong passwords, SSL certificates
```

---

## Getting Help

**Something not working?**

1. **Check error message carefully** – it usually tells you the problem
2. **Google the error** – most issues have solutions online
3. **Ask in Slack #oncoguard-dev** – your team can help
4. **Check GitHub Issues** – someone might have solved it
5. **Ask Claude** – ask your AI helper for debugging tips

---

## Next Steps

1. ✅ Set up all three components (backend, frontend, brain)
2. ✅ Verify everything runs without errors
3. ✅ Read [CONTRIBUTING.md](./CONTRIBUTING.md) for team workflow
4. ✅ Create your first feature branch
5. ✅ Make a small change and practice committing

---

**Version:** 1.0  
**Last Updated:** July 26, 2026
