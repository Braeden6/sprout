from typing import Optional, Dict
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Database
    db_url: Optional[str] = "postgresql://postgres:postgres@localhost:5432/sprout"
    
    # Google AI
    google_api_key_tts: Optional[str] = None
    google_api_key: Optional[str] = None
    google_genai_use_vertexai: Optional[bool] = False
    
    
    # Auth
    allowed_origins: Optional[str] = "http://localhost:5173" # can be comma separated list of origins
    
    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'
        extra = "allow"


settings = Settings()
