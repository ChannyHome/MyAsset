from app.core.db import get_session_maker
from app.services.quote_updater import refresh_quotes_for_supported_assets


def run() -> None:
    session_maker = get_session_maker()
    db = session_maker()
    try:
        summary = refresh_quotes_for_supported_assets(db)
        print(
            "UPDATE_QUOTES_OK",
            f"updated={summary.updated_count}",
            f"skipped={summary.skipped_count}",
            f"failed={summary.failed_count}",
        )
        if summary.errors:
            for err in summary.errors:
                print("ERROR", err)
    finally:
        db.close()


if __name__ == "__main__":
    run()
