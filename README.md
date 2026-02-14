# MyAsset

## Step-by-step development for beginners

### Step 1 (done): FastAPI minimal skeleton
- `GET /api/v1/health`

### Step 2 (done): JWT login minimal flow (seed users)
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`

### Step 3 (done): DB foundation (SQLAlchemy + Alembic)
- SQLAlchemy models: `users`, `households`, `household_members`
- Alembic revision: `001_base_auth_scope`

## Run backend

```bash
cd apps/api
python -m venv .venv
.venv\\Scripts\\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## API quick test

### Health
`GET http://127.0.0.1:8000/api/v1/health`

### Login
`POST http://127.0.0.1:8000/api/v1/auth/login`

```json
{
  "email": "me@myasset.local",
  "password": "pass1234"
}
```

### Me
`GET http://127.0.0.1:8000/api/v1/auth/me`

Header: `Authorization: Bearer <access_token>`

## Seed users (dev only)
- `me@myasset.local / pass1234`
- `wife@myasset.local / pass1234`
- `son@myasset.local / pass1234`

## Alembic (Step 3)

```bash
cd apps/api
copy .env.example .env
alembic upgrade head
```

Note: Step 3 creates tables only. Real auth DB integration and seed SQL insertion come in Step 4.
## One-command run (Windows PowerShell)

From repo root:

```powershell
# 1) first-time setup + install
.\run.ps1 -Setup

# 2) smoke test (health/login/me)
.\run.ps1 -Smoke

# 3) start server
.\run.ps1
```