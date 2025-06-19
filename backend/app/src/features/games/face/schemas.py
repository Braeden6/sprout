from pydantic import BaseModel
from typing import List

class GameState(BaseModel):
    session_id: str
    emotions: List[str]
    image_paths: List[str]
    emotion_options: List[str]

class HelpResponse(BaseModel):
    text: str
    audio: str 