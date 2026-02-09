from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8')

    project_name: str = 'ecommerce-fastapi-react'
    api_v1_prefix: str = ''

    database_url: str

    jwt_secret: str
    jwt_algorithm: str = 'HS256'
    jwt_expires_minutes: int = 60 * 24 * 7

    frontend_url: str = 'http://localhost:5173'


settings = Settings()
