# API Development Rules

## Stack
- Python
- FastAPI
- SQLAlchemy ORM
- Alembic migrations
- MySQL in local/production-like operation

## General Rules
- Keep API schemas backward compatible unless a migration/removal plan is explicit.
- Prefer service-layer helpers for business logic instead of duplicating calculations in routers.
- Do not introduce Postgres-only SQL unless MySQL compatibility has been checked.
- Add Alembic migrations for DB schema changes.

## Dividend Rules
- Do not hardcode the `20,000,000 KRW` taxable financial income limit. Read it from app settings.
- Do not infer portfolio tax profile ad hoc in routers. Use the effective dividend tax helper in `dividend_income.py`.
- Portfolio tax profile is the account-level source of truth.
- Asset tax profile is inferred in v1 and should not be stored as an asset column unless a new plan explicitly adds it.
- `PENSION`, `ISA`, and `TAX_EXEMPT` dividend rows must be excluded from taxable summary.

## Validation
- Run `python -m compileall app` after backend changes.
- Run Alembic upgrade when migrations are added.
