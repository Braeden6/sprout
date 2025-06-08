from typing import Optional, Dict
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    db_url: Optional[str] = "postgresql://postgres:postgres@localhost:5432/sprout"
    frontend_url: str = "http://localhost:5173"
    api_url: str = "http://localhost:8000"
    
    google_api_key: str
    google_genai_use_vertexai: Optional[bool] = False
    

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
    
    @property
    def token_user_mapping(self) -> Dict[str, str]:
        """Parse auth tokens into a dictionary mapping tokens to user IDs."""
        if not self.auth_tokens:
            return {}
        
        mapping = {}
        for token_user in self.auth_tokens.split(','):
            if ':' in token_user:
                token, user_id = token_user.strip().split(':', 1)
                mapping[token.strip()] = user_id.strip()
        return mapping


settings = Settings()
