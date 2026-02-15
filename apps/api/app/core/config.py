from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "MyAsset API"
    api_v1_prefix: str = "/api/v1"

    database_url: str = "mysql+pymysql://myasset:myasset@127.0.0.1:3306/myasset"

    api_access_log_enabled: bool = False
    api_access_log_dir: str = "logs/api"

    quote_auto_update_enabled: bool = False
    quote_update_interval_minutes: int = 10
    quote_provider: str = "yfinance"

    jwt_secret_key: str = "change-this-in-production"
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 60

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


settings = Settings()
