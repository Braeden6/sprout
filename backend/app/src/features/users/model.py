from uuid import UUID, uuid4
from sqlmodel import Field, SQLModel
from typing import List, TYPE_CHECKING
from sqlmodel import Relationship

if TYPE_CHECKING:
    from app.src.features.games.face.models import FaceGameData

class User(SQLModel, table=True):
    id: UUID = Field(primary_key=True, default_factory=uuid4)
    age: int = Field(default=0)
    email: str = Field(default="")
    character_name: str = Field(default="")
    session_token: str = Field(default="")
    
    face_games: List["FaceGameData"] = Relationship(back_populates="user")
    
