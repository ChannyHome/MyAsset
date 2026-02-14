import json
import threading
from datetime import datetime
from pathlib import Path

from app.core.config import settings

_WRITE_LOCK = threading.Lock()


def write_api_access_log(entry: dict) -> None:
    if not settings.api_access_log_enabled:
        return

    now = datetime.now()
    log_dir = Path(settings.api_access_log_dir)
    log_dir.mkdir(parents=True, exist_ok=True)
    file_path = log_dir / f"{now:%Y-%m-%d}.log"
    line = json.dumps(entry, ensure_ascii=False, default=str)

    with _WRITE_LOCK:
        with file_path.open("a", encoding="utf-8") as file:
            file.write(line + "\n")
