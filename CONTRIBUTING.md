# Contributing to OncoGuard

Welcome to the OncoGuard development team! This guide explains how to work together on GitHub and contribute to the project.

---

## 🌿 Git Workflow Overview

We use a simple but effective workflow:

```
main (production) ← develop (integration) ← feature branches (your work)
```

**Never commit directly to `main` or `develop`.** Always use feature branches + pull requests.

---

## Step 1: Before You Start Work

### Pull Latest Changes
```bash
# Get the latest code from the team
git checkout develop
git pull origin develop

# Create your feature branch from latest develop
git checkout -b feature/your-feature-name
```

**Why?** This ensures you start with the latest code and don't waste time on merge conflicts.

---

## Step 2: Make Changes

### Keep Commits Small & Focused

**❌ Bad:**
```bash
git add .
git commit -m "work"
# Commits: 500 lines at once, impossible to review
```

**✅ Good:**
```bash
# Commit 1: Add rule engine CAUTION weights
git add rule_engine/caution_framework.py
git commit -m "feat: implement CAUTION scoring algorithm"

# Commit 2: Add tests for CAUTION
git add rule_engine/tests/test_caution.py
git commit -m "test: add 20 test cases for CAUTION scoring"

# Commit 3: Update documentation
git add brain/README.md
git commit -m "docs: update rule engine documentation"
```

**Why?** Small commits are easier to review, revert, and understand later.

---

## Step 3: Commit Message Convention

### Format
```
type: brief description (under 50 chars)

Optional longer explanation if needed.
Explain the "why", not just the "what".
```

### Commit Types

| Type | Used For | Example |
|------|----------|---------|
| `feat` | New feature | `feat: add CAUTION framework scoring` |
| `fix` | Bug fix | `fix: resolve NaN in symptom duration` |
| `docs` | Documentation | `docs: update rule engine guide` |
| `test` | Tests | `test: add unit tests for XGBoost` |
| `refactor` | Code cleanup | `refactor: optimize FAISS search speed` |
| `perf` | Performance | `perf: reduce model inference time from 500ms to 100ms` |
| `chore` | Build, config | `chore: update dependencies` |

### Examples

```bash
# Good commit messages
git commit -m "feat: implement ICMR/WHO CAUTION weights for rule engine"
git commit -m "fix: handle edge case where symptom duration is missing"
git commit -m "docs: add section on SHAP explainability"

# Bad commit messages
git commit -m "update"
git commit -m "fix stuff"
git commit -m "work"
```

---

## Step 4: Push & Create Pull Request

### Push Your Branch
```bash
git push origin feature/your-feature-name

# GitHub shows: "Create Pull Request" button
```

### Create Pull Request (PR) on GitHub

1. Click the "Compare & pull request" button
2. Fill in the PR template:

```markdown
## What does this PR do?
Briefly describe what feature/fix you added.

## Why?
Explain why this change was needed.

## Changes Made
- Added CAUTION framework scoring algorithm
- Implemented 21-day escalation window logic
- Added 30 unit tests

## Performance Impact
Rule engine now scores symptoms in <50ms (previously <100ms).

## Testing
- Unit tests: 30/30 passing
- Manual testing: Tested with 50 sample patients
- Performance: Meets <50ms target

## Checklist
- [x] Code follows team style
- [x] Tests added and passing
- [x] Documentation updated
- [x] No secrets committed (.env, API keys)
```

3. Click "Create pull request"

---

## Step 5: Code Review

### During Review
- **Expect feedback** – it's normal and helps everyone learn
- **Be open to suggestions** – others catch things you miss
- **Ask questions** – if feedback is unclear, ask!
- **Don't take it personally** – we're critiquing code, not you

### Making Changes After Feedback
```bash
# Make requested changes
git add .
git commit -m "Address code review feedback: improve error handling"

# Push changes (no need to create new PR, same PR updates)
git push origin feature/your-feature-name
```

**The PR automatically updates** with your new commits. No need to close and create a new one!

### Approving Others' PRs
- Read the code carefully
- Test locally if possible
- Leave constructive feedback
- Click "Approve" when satisfied

---

## Step 6: Merge

### When PR is Approved

1. **Squash commits if needed:**
   - Many small commits? GitHub can squash them into one
   - Cleaner history for `develop`

2. **Merge:**
   - Click "Merge pull request"
   - Choose "Squash and merge" (usually)
   - This creates one clean commit in `develop`

3. **Delete branch:**
   - GitHub shows: "Delete branch"
   - Click it to clean up

### After Merge
```bash
# Clean up locally
git checkout develop
git pull origin develop
git branch -d feature/your-feature-name
```

---

## 📋 Branch Naming Convention

**Format:** `type/short-description`

**Examples:**
```
feature/rule-engine-caution        # New feature
feature/xgboost-model-training     # New feature
fix/symptom-duration-nan           # Bug fix
docs/update-readme                 # Documentation
refactor/optimize-faiss-search     # Code cleanup
test/add-rule-engine-tests         # Tests
```

**Rules:**
- Use lowercase
- Use hyphens (not underscores)
- Be descriptive
- Keep it short (2-4 words)

---

## 🔒 Protecting the `main` and `develop` Branches

These branches require:
- ✅ Pull request review (at least 1 person approves)
- ✅ Status checks pass (tests, linting)
- ✅ Conversation resolved (all feedback addressed)

**This prevents:**
- ❌ Accidental pushes to main/develop
- ❌ Broken code merging
- ❌ Bypassing code review

---

## 📝 Communication During Development

### Use GitHub Issues
Instead of: "Hey can someone add SHAP visualization?"

**Use:** GitHub Issue
```markdown
Title: Add SHAP feature importance visualization

Description:
Show top 3 factors influencing risk score in the risk report.

This helps users understand why the system gave them a specific risk assessment.

Acceptance Criteria:
- [ ] SHAP values computed for each patient
- [ ] Top 3 factors displayed in report
- [ ] User-friendly explanations provided
```

Then: `git checkout -b feature/shap-visualization` to fix it.

### Use Pull Request Comments
For code discussion:
- Click on specific line of code
- Comment directly on that line
- Team discusses there, not in emails

### Use Slack for Quick Questions
- "Can someone review my PR?" → Slack
- Technical deep-dive → GitHub Issue
- Announcement → #oncoguard-dev

---

## 🧪 Before You Submit a PR

**Checklist:**

- [ ] Code is tested locally (no errors)
- [ ] All tests pass: `pytest` (backend), `npm test` (frontend)
- [ ] Code follows project style (consistent with existing code)
- [ ] No debug prints left in code
- [ ] No secrets committed (.env files, API keys)
- [ ] Documentation updated
- [ ] Commit messages are clear
- [ ] Branch is up-to-date with `develop`:
  ```bash
  git fetch origin
  git merge origin/develop
  # Resolve any conflicts
  git push origin feature/your-feature-name
  ```

---

## 🚨 Common Mistakes (and How to Avoid Them)

### Mistake 1: Committing Secrets
```bash
# ❌ WRONG
git add .env
git commit -m "Add environment variables"

# ✅ CORRECT
# .env file is in .gitignore (don't commit)
# Add .env to .gitignore
echo ".env" >> .gitignore
git add .gitignore
git commit -m "Add .env to gitignore"
```

### Mistake 2: Large Unrelated Changes
```bash
# ❌ WRONG
# PR: "Add rule engine" but also refactors 500 lines
# Makes it hard to review what's actually new

# ✅ CORRECT
# PR 1: feat: add rule engine scoring
# PR 2: refactor: optimize existing code
# Keep features and refactoring separate
```

### Mistake 3: Not Pulling Before Starting
```bash
# ❌ WRONG
git checkout -b feature/my-feature
# Forgot to pull develop first!

# ✅ CORRECT
git checkout develop
git pull origin develop
git checkout -b feature/my-feature
```

### Mistake 4: Committing to `main` or `develop`
```bash
# ❌ WRONG
git checkout develop
git add .
git commit -m "Add feature"
git push origin develop

# ✅ CORRECT
git checkout -b feature/new-feature
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature
# Then create PR on GitHub
```

### Mistake 5: Force Push
```bash
# ❌ NEVER DO THIS
git push origin feature/my-feature --force
# Danger: Loses others' changes if working on same branch

# ✅ Safe alternative
git push origin feature/my-feature
# Let Git tell you if there's a conflict
# Merge properly instead of forcing
```

---

## 📚 Code Style & Standards

### Python (Backend & Brain)
```python
# Follow PEP 8
# Line length: 88 chars (Black formatter)
# Type hints: Use them!

def score_symptoms(symptoms: dict) -> int:
    """
    Score cancer risk from symptoms.
    
    Args:
        symptoms: Dictionary of patient symptoms
        
    Returns:
        Risk score 0-100
    """
    score = 0
    for symptom, weight in CAUTION_WEIGHTS.items():
        if symptoms.get(symptom):
            score += weight
    return min(score, 100)
```

### JavaScript/React (Frontend)
```javascript
// Use ESLint & Prettier
// Functional components only (no class components)
// Use hooks for state management
// Component names in PascalCase

export function RiskReport({ score, factors }) {
  return (
    <div className="risk-report">
      <h2>Your Risk Score: {score}</h2>
      {factors.map((factor, i) => (
        <p key={i}>{factor.name}: {factor.impact}</p>
      ))}
    </div>
  );
}
```

### Comments
```python
# Good comments explain WHY
# Bad comments repeat what code does

# ❌ Bad
x = x + 1  # Increment x

# ✅ Good
# Wait 21 days before re-escalating to allow symptom resolution
escalation_window_days = 21
```

---

## 🧪 Testing Requirements

### Python (Backend & Brain)
```bash
# All new code must have tests
pytest brain/tests/ -v --cov

# Coverage should be >80%
pytest --cov=brain --cov-report=html
# Open htmlcov/index.html to see coverage
```

### React (Frontend)
```bash
# Test components
npm test -- --coverage

# Expected: >80% coverage
```

### What to Test
- ✅ Happy path (normal input)
- ✅ Edge cases (empty, None, negative)
- ✅ Error handling (bad input)

```python
def test_score_happy_path():
    """Normal case"""
    assert score({'age': 50, 'symptoms': ['cough']}) == 75

def test_score_empty_symptoms():
    """Edge case: no symptoms"""
    assert score({'age': 50, 'symptoms': []}) == 0

def test_score_all_symptoms():
    """Edge case: all symptoms present"""
    result = score({'age': 50, 'symptoms': ['cough', 'pain', 'lesion']})
    assert 0 <= result <= 100  # Should be bounded

def test_score_invalid_input():
    """Error case"""
    with pytest.raises(TypeError):
        score(None)
```

---

## 🔄 Syncing Your Branch with Latest Changes

### Before submitting PR:
```bash
# Fetch latest from GitHub
git fetch origin

# Merge develop into your branch
git merge origin/develop

# If conflicts arise, resolve them, then:
git add .
git commit -m "Resolve merge conflicts"
git push origin feature/your-feature-name
```

### If develop changed while PR was in review:
Same process – GitHub will tell you if your branch is out of sync.

---

## 📊 Monitoring Code Health

### Use GitHub Actions (CI/CD)
- Tests run automatically on every PR
- If tests fail, PR can't be merged
- Fix issues and push again

### Monitor Quality
```bash
# Run tests locally before pushing
pytest brain/tests/
npm test

# Run linter
pylint brain/
eslint frontend/src/

# Check coverage
pytest --cov=brain
```

---

## 🎓 Learning Resources

**For Git/GitHub:**
- [Git Handbook](https://guides.github.com/introduction/git-handbook/)
- [GitHub Skills](https://skills.github.com/)
- [Atlassian Git Tutorials](https://www.atlassian.com/git/tutorials)

**For Code Style:**
- [PEP 8 (Python)](https://pep8.org/)
- [Black Formatter (Python)](https://github.com/psf/black)
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)

**For Testing:**
- [Pytest Documentation](https://docs.pytest.org/)
- [React Testing Library](https://testing-library.com/react)

---

## 👥 Team Roles in Code Review

| Role | Responsibility |
|------|------------------|
| **Author** | Submit clear PR, respond to feedback |
| **Reviewer** | Read code, suggest improvements, ask questions |
| **Maintainer** | Approve & merge, ensure quality standards |

**Everyone reviews each other's code** – you learn from others and help them improve.

---

## 🚀 Ready to Contribute?

1. ✅ Read this guide
2. ✅ Set up your environment (see [SETUP.md](./SETUP.md))
3. ✅ Create a feature branch
4. ✅ Make a small change and practice the workflow
5. ✅ Submit your first PR!

---

## Questions?

**Ask in:**
- Slack #oncoguard-dev
- GitHub Issues (for technical)
- Team sync meeting (every Friday)

---

**Version:** 1.0  
**Last Updated:** July 26, 2026  
**For:** OncoGuard Development Team
