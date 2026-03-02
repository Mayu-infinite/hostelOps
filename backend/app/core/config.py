from pydantic import BaseSettings


class Settings(BaseSettings):
    app_name: str = "Hostel Issue Management System"


settings = Settings()
