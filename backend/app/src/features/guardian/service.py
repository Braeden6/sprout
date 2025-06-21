from app.src.features.games.face.models import FaceGameData
from google.adk.runners import Runner

from app.src.core.settings import settings
from google.adk.sessions import DatabaseSessionService
from google.genai import types
from app.src.features.guardian.agents import build_game_summarizer_agent, build_meta_analysis_agent
from typing import List

class GuardianService:
    def __init__(self):
        self.database_session_service = DatabaseSessionService(
            db_url=settings.db_url
        )

    async def game_summarizer(
        self,
        game_description: str,
        game_data: dict,
        session_id: str,
        user_id: str,
    ) -> str:
        runner = Runner(
            agent=build_game_summarizer_agent(game_description),
            app_name=settings.app_name,
            session_service=self.database_session_service
        )
        new_message = types.Content(
            role='user', 
            parts=[types.Part(text="Please summarize the game. here is the game data: " + str(game_data))]
        )

        async for event in runner.run_async(
            user_id=user_id,
            session_id=session_id,
            new_message=new_message,
        ):
            return event.content.parts[0].text or ""
        
    async def generate_game_summary(
        self,
        # tech debt: better abstraction for different games
        games: List[FaceGameData],
        user_id: str,
    ) -> str:
        new_session = await self.database_session_service.create_session(
            user_id=user_id,
            app_name=settings.app_name,
        )
        runner = Runner(
            agent=build_meta_analysis_agent(),
            app_name=settings.app_name,
            session_service=self.database_session_service
        )
        new_message = types.Content(
            role='user', 
            parts=[types.Part( text="Please analyze the games. here is the games data: " +  str(games))]
        )
        async for event in runner.run_async(
            user_id=user_id,
            session_id=new_session.id,
            new_message=new_message,
        ):
            return event.content.parts[0].text or ""

    