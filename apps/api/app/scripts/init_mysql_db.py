from sqlalchemy.engine import make_url
import pymysql

from app.core.config import settings



def run() -> None:
    url = make_url(settings.database_url)

    if not url.drivername.startswith("mysql"):
        raise RuntimeError(
            f"DATABASE_URL must be MySQL for init script. current={url.drivername}"
        )

    db_name = url.database
    if not db_name:
        raise RuntimeError("DATABASE_URL is missing database name")

    conn = pymysql.connect(
        host=url.host or "127.0.0.1",
        port=url.port or 3306,
        user=url.username or "",
        password=url.password or "",
        database="mysql",
        charset="utf8mb4",
        autocommit=True,
    )
    try:
        with conn.cursor() as cur:
            cur.execute(
                f"CREATE DATABASE IF NOT EXISTS `{db_name}` "
                "CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
            )
        print(f"INIT_DB_OK database={db_name}")
    finally:
        conn.close()


if __name__ == "__main__":
    run()