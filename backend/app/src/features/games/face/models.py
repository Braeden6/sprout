from sqlmodel import SQLModel, Field, Column
from sqlalchemy import JSON
from typing import List, Optional, Tuple
from datetime import datetime
from uuid import UUID, uuid4
from typing import TYPE_CHECKING
from sqlmodel import Relationship

if TYPE_CHECKING:
    from app.src.features.users.model import User

class FaceGameData(SQLModel, table=True):
    id: UUID = Field(primary_key=True, default_factory=uuid4)
    emotions: List[str] = Field(sa_column=Column(JSON))
    emotion_match_times: List[Tuple[str, float]] = Field(sa_column=Column(JSON), default=[])
    emotion_incorrect_times: List[Tuple[str, float]] = Field(sa_column=Column(JSON), default=[])
    start_time: datetime
    end_time: Optional[datetime] = None
    user_id: UUID = Field(foreign_key="user.id")
    game_summary: Optional[str] = None
    
    user: Optional["User"] = Relationship(back_populates="face_games")