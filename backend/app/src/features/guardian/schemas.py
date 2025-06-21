from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import Optional

class GameReviewData(BaseModel):
    game_name: str
    game_summary: str
    game_date: datetime
    total_time: Optional[timedelta] = None 