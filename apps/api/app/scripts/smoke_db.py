from datetime import datetime

from fastapi.testclient import TestClient

from app.main import app


def run() -> None:
    client = TestClient(app)

    login = client.post(
        "/api/v1/auth/login",
        json={"email": "me@myasset.local", "password": "pass1234"},
    )
    assert login.status_code == 200, login.text
    token = login.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    households = client.get("/api/v1/households", headers=headers)
    assert households.status_code == 200, households.text
    assert len(households.json()) >= 1, households.text

    suffix = datetime.now().strftime("%H%M%S")
    portfolio_name = f"Smoke Portfolio {suffix}"
    asset_symbol = f"SMK{suffix}"

    p_resp = client.post(
        "/api/v1/portfolios",
        json={
            "name": portfolio_name,
            "type": "BROKER",
            "is_included": True,
            "category": "KR_STOCK",
            "memo": "smoke test portfolio",
            "cumulative_deposit_amount": "50000000",
            "cumulative_withdrawal_amount": "1000000",
            "cashflow_source_type": "MANUAL",
        },
        headers=headers,
    )
    assert p_resp.status_code == 201, p_resp.text
    portfolio_id = p_resp.json()["id"]

    a_resp = client.post(
        "/api/v1/assets",
        json={
            "asset_class": "STOCK",
            "symbol": asset_symbol,
            "name": f"Smoke Asset {suffix}",
            "currency": "USD",
        },
        headers=headers,
    )
    assert a_resp.status_code == 201, a_resp.text
    asset_id = a_resp.json()["id"]

    h_resp = client.post(
        "/api/v1/holdings",
        json={
            "portfolio_id": portfolio_id,
            "asset_id": asset_id,
            "quantity": "1",
            "avg_price": "100",
            "source_type": "MANUAL",
        },
        headers=headers,
    )
    assert h_resp.status_code == 201, h_resp.text

    hh_scope = client.get(
        "/api/v1/holdings?scope_type=HOUSEHOLD&scope_id=1",
        headers=headers,
    )
    assert hh_scope.status_code == 200, hh_scope.text
    assert len(hh_scope.json()) >= 1, hh_scope.text

    perf_resp = client.get("/api/v1/portfolios/performance", headers=headers)
    assert perf_resp.status_code == 200, perf_resp.text
    perf_rows = perf_resp.json()
    assert any(item["portfolio_id"] == portfolio_id for item in perf_rows), perf_resp.text

    print("SMOKE_DB_OK")
    print("portfolio_id", portfolio_id)
    print("asset_id", asset_id)


if __name__ == "__main__":
    run()
