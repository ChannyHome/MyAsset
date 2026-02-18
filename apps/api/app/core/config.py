from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "MyAsset API"
    api_v1_prefix: str = "/api/v1"

    database_url: str = "mysql+pymysql://myasset:myasset@127.0.0.1:3306/myasset"
    cors_allow_origins: str = (
        "http://127.0.0.1:5173,http://localhost:5173,http://127.0.0.1:5174,http://localhost:5174"
    )

    api_access_log_enabled: bool = False
    api_access_log_dir: str = "logs/api"
    api_audit_log_enabled: bool = True
    api_audit_log_max_body_chars: int = 4096

    quote_auto_update_enabled: bool = False
    quote_update_interval_minutes: int = 10
    quote_provider: str = "yfinance"
    fx_strict_mode: bool = False
    fx_stale_minutes: int = 30

    data_go_kr_service_key: str = ""
    data_go_kr_apartment_trade_url: str = (
        "https://apis.data.go.kr/1613000/RTMSDataSvcAptTradeDev/getRTMSDataSvcAptTradeDev"
    )
    data_go_kr_timeout_seconds: float = 10.0
    data_go_kr_rows_per_call: int = 1000
    data_go_kr_lookback_months: int = 6

    app_secrets_master_key: str = ""

    jwt_secret_key: str = "change-this-in-production"
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 60

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    def cors_allow_origins_list(self) -> list[str]:
        return [item.strip() for item in self.cors_allow_origins.split(",") if item.strip()]


settings = Settings()
