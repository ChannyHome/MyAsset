# API Development Rules

## Stack
- Python 3.12
- FastAPI
- Pydantic / pydantic-settings
- SQLAlchemy ORM
- Alembic migrations
- MySQL in local/production-like operation
- APScheduler-style background jobs for quote/dividend scheduler flows

## Architecture Rules
- Routers in `app/api/routers` should be thin.
- Business logic belongs in `app/services`.
- ORM models belong in `app/models`.
- Request/response contracts belong in `app/schemas`.
- DB schema changes require Alembic migrations under `alembic/versions`.
- Avoid putting SQL dialect-specific behavior in services unless MySQL compatibility is confirmed.

## API Rules
- Keep response schemas backward compatible unless a removal plan is explicit.
- Prefer adding fields over changing field meaning.
- Use `Decimal` for money and ratios in backend calculations.
- Use explicit currency fields when storing or returning money.
- Do not return provider secrets or raw decrypted keys.

## Snapshot Rules
- New historical analytics should use `valuation_snapshots`.
- Quote update is allowed to create/update valuation snapshots.
- Read-only refresh endpoints should not create valuation snapshots.
- Snapshot Page should be treated as a valuation snapshot workspace, not legacy `snapshot_*` storage.

## Dividend Rules
- Do not hardcode the `20,000,000 KRW` taxable financial income limit. Read it from app settings.
- Do not infer portfolio tax profile ad hoc in routers. Use the effective dividend tax helper in `dividend_income.py`.
- Portfolio tax profile is the account-level source of truth.
- Asset tax profile is inferred in v1 and should not be stored as an asset column unless a new plan explicitly adds it.
- `PENSION`, `ISA`, and `TAX_EXEMPT` dividend rows must be excluded from taxable summary.
- Expected dividends/distributions and actual received dividends are separate concepts.
- Actual received dividends should remain manual-entry source of truth until broker import is explicitly implemented.
- Use `asset_dividend_profiles` for asset-level dividend/distribution master settings.
- Do not store profile/settings values in `asset_dividend_events`; events are provider/manual import history only.
- Use `asset_provider_identifiers` for provider lookup identifiers instead of embedding provider keys in profile rows.
- `Update Dividend Now` may auto-create missing profiles and provider identifiers, but provider failure should persist a clear coverage status such as `NO_PROVIDER_DATA` or `MANUAL_ESTIMATE_NEEDED`.
- If manual monthly/quarterly amounts exist in `monthly_amounts_json`, calculate annual DPS from that JSON before falling back to manual annual DPS.

## Scheduler Rules
- Quote scheduler and dividend scheduler must remain separate.
- Persist scheduler run status in DB when possible.
- Use `coalesce`, `max_instances=1`, and misfire grace settings to avoid duplicate job overlap.

## Validation
- Run `python -m compileall app` after backend changes.
- Run `python -m alembic upgrade head` when migrations are added.
- If a migration drops data, document backup/recovery assumptions before applying.
