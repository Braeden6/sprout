import random
import base64
from google.adk.runners import Runner
from google.adk.sessions import DatabaseSessionService
from google.genai import types
from google import genai
from datetime import datetime
from sqlmodel import select, and_
import time
from sqlalchemy.orm import attributes

from .agents import face_help_agent
from .schemas import GameState, HelpResponse
from .models import FaceGameData
from app.src.features.users.model import User
from app.src.core.settings import settings
from app.src.core.database import get_async_session, get_async_session_context
from app.src.features.games.face.prompts import face_game_overview_prompt
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends, HTTPException, UploadFile, File, BackgroundTasks
from app.src.features.guardian.service import GuardianService


class FaceGameService:
    def __init__(
        self, 
        db_session: AsyncSession = Depends(get_async_session),
        guardian_service: GuardianService = Depends(GuardianService)
    ):
        self.emotions = ["angry", "happy", "sad", "scared"]
        self.people = [1, 2]
        self.db_session = db_session
        self.guardian_service = guardian_service
        
        self.database_session_service = DatabaseSessionService(
            db_url=settings.db_url
        )
        
        self.face_help_runner = Runner(
            agent=face_help_agent,
            app_name="sprout",
            session_service=self.database_session_service
        )

    async def init_game(
        self, 
        current_user: User,
    ) -> GameState:
        sample_emotions = random.sample(self.emotions, 4)
        sample_people = [random.choice(self.people) for _ in range(4)]
        
        session = await self.database_session_service.create_session(
            app_name=settings.app_name,
            user_id=str(current_user.id)
        )
        
        emotion_options = sample_emotions.copy()
        random.shuffle(emotion_options)
        
        self.db_session.add(
            FaceGameData(
                id=session.id,
                emotions=sample_emotions,
                start_time=datetime.now(),
                correct_matches=0,
                incorrect_matches=0,
                emotion_match_times=[],
                emotion_incorrect_times=[],
                user_id=current_user.id
            )
        )
        await self.db_session.commit()
        
        return GameState(
            session_id=session.id,
            emotions=sample_emotions,
            emotion_options=emotion_options,
            image_paths=[
                f"/emotions/{person}/{self.emotions.index(emotion)+1}.png" 
                for emotion, person in zip(sample_emotions, sample_people)
            ]
        )

    async def get_help(
        self,
        session_id: str,
        current_user: User,
        image: UploadFile = File(...)
    ) -> HelpResponse:
        image_content = await image.read()
        image_base64 = base64.b64encode(image_content).decode('utf-8')
        text = await self._get_reply(image_base64, session_id, current_user, "Here is the current state of the game. Can you please help me?")
        audio_data = self._generate_audio(text)
        wav_data = self._convert_to_wav(audio_data)
        audio_base64 = base64.b64encode(wav_data).decode('utf-8')
        
        return HelpResponse(text=text, audio=audio_base64)
    
    async def _get_game_data(
        self,
        session_id: str,
        current_user: User
    ) -> FaceGameData:
        query = select(FaceGameData).where(
            and_(   
                FaceGameData.id == session_id,
                FaceGameData.user_id == current_user.id
            )
        )
        result = await self.db_session.execute(query)
        return result.scalar_one_or_none()
    
    async def _generate_game_summary_background(
        self,
        session_id: str,
        user_id: int,
        game_data: FaceGameData
    ):
        game_summary = await self.guardian_service.game_summarizer(
            game_description=face_game_overview_prompt,
            game_data=game_data.model_dump(),
            session_id=session_id,
            user_id=str(user_id)
        )
        
        # Create a new database session for the background task
        async with get_async_session_context() as db_session:
            query = select(FaceGameData).where(
                and_(   
                    FaceGameData.id == session_id,
                    FaceGameData.user_id == user_id
                )
            )
            result = await db_session.execute(query)
            fresh_game_data = result.scalar_one_or_none()
            
            if fresh_game_data:
                fresh_game_data.game_summary = game_summary
                print(fresh_game_data.game_summary)
                attributes.flag_modified(fresh_game_data, "game_summary")
                await db_session.commit()
    
    async def complete_game(
        self,
        session_id: str,
        current_user: User,
        background_tasks: BackgroundTasks,
        image: UploadFile = File(...)
    ) -> HelpResponse:
        image_content = await image.read()
        image_base64 = base64.b64encode(image_content).decode('utf-8')
        game_data = await self._get_game_data(session_id, current_user)
        if not game_data:
            raise HTTPException(status_code=404, detail="Game data not found")
        
        text = await self._get_reply(image_base64, session_id, current_user, "I have finished the game. I just clicked the finish button. How did I do? And I got a score of 100%")
        audio_data = self._generate_audio(text)
        wav_data = self._convert_to_wav(audio_data)
        audio_base64 = base64.b64encode(wav_data).decode('utf-8')
        
        background_tasks.add_task(
            self._generate_game_summary_background,
            session_id,
            current_user.id,
            game_data
        )
        return HelpResponse(text=text, audio=audio_base64)
    
    async def update_game_data(
        self,
        session_id: str,
        emotion: str,
        is_correct: bool,
        current_user: User
    ):
        game_data = await self._get_game_data(session_id, current_user)
        if not game_data:
            raise HTTPException(status_code=404, detail="Game data not found")
        
        timestamp = time.time()  
        if is_correct:
            game_data.emotion_match_times.append((emotion, timestamp))
            attributes.flag_modified(game_data, "emotion_match_times")
        else:
            game_data.emotion_incorrect_times.append((emotion, timestamp))
            attributes.flag_modified(game_data, "emotion_incorrect_times")
            
        await self.db_session.commit()

    async def _get_reply(
        self,
        image: str,
        session_id: str,
        current_user: User,
        new_message: str
    ) -> str:
        content = types.Content(role='user', parts=[
            types.Part(text=new_message),
            types.Part.from_bytes(data=image, mime_type="image/png")
        ])

        async for event in self.face_help_runner.run_async(
                user_id=str(current_user.id),
                session_id=session_id,
                new_message=content,
            ):
                return event.content.parts[0].text
        return "I'm here to help! Look at the emotions on the faces and try to match them."

    def _generate_audio(self, text: str) -> bytes:
        client = genai.Client(api_key=settings.google_api_key_tts)
        
        contents = [
            types.Content(
                role="user",
                parts=[
                    types.Part.from_text(text=f"""You are voicing a character for a neurodivergent kids game. 
                                         Speak as clearly and friendly as possible. Say the following exactly:
                                         {text}"""),
                ],
            ),
        ]
        
        generate_content_config = types.GenerateContentConfig(
            temperature=1,
            response_modalities=["audio"],
            speech_config=types.SpeechConfig(
                voice_config=types.VoiceConfig(
                    prebuilt_voice_config=types.PrebuiltVoiceConfig(
                        voice_name="Zephyr"
                    )
                )
            ),
        )

        response = client.models.generate_content(
            model="gemini-2.5-flash-preview-tts",
            contents=contents,
            config=generate_content_config,
        )
        
        return response.candidates[0].content.parts[0].inline_data.data

    def _convert_to_wav(self, audio_data: bytes) -> bytes:
        header = (
            b'RIFF' + 
            (36 + len(audio_data)).to_bytes(4, 'little') + 
            b'WAVE' + 
            b'fmt ' + 
            (16).to_bytes(4, 'little') + 
            (1).to_bytes(2, 'little') + 
            (1).to_bytes(2, 'little') + 
            (24000).to_bytes(4, 'little') + 
            (24000 * 2).to_bytes(4, 'little') + 
            (2).to_bytes(2, 'little') + 
            (16).to_bytes(2, 'little') + 
            b'data' + 
            len(audio_data).to_bytes(4, 'little')
        )
        return header + audio_data