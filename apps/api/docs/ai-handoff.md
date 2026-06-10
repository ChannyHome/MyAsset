# AI Handoff Notes for MyAsset API

Read this before modifying backend code.

## Current Direction
- `valuation_snapshots` are the canonical historical data source.
- `snapshot_*` legacy concepts should not be reintroduced.
- Quote update creates valuation snapshots.
- Dividend update is separate from quote update.
- Actual received dividends are manual-entry truth.

## Common Pitfalls
- MySQL does not support every SQLAlchemy/Postgres expression. Avoid `NULLS LAST` unless rewritten for MySQL.
- Pydantic response schemas must include every field routers return.
- Enum values from Pydantic should be normalized with `.value` before storing strings.
- Date logic should respect `Asia/Seoul` for valuation snapshots.
- Do not create snapshots from read-only refresh actions.

## Before Finishing a Backend Change
Run:

```powershell
cd apps/api
.\.venv\Scripts\python.exe -m compileall app
```

If a migration was added:

```powershell
cd apps/api
.\.venv\Scripts\python.exe -m alembic upgrade head
```
