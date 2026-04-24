from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    workers_ai_api_key: str
    workers_ai_account_id: str
    cors_origin: str = "http://localhost:5173"

    @property
    def workers_ai_url(self) -> str:
        return (
            f"https://api.cloudflare.com/client/v4/accounts/"
            f"{self.workers_ai_account_id}/ai/run/"
            f"@cf/meta/llama-3.1-8b-instruct"
        )

    class Config:
        env_file = ".env"


settings = Settings()
