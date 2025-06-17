from app.src.features.users.model import User
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Depends, UploadFile, File
from fastapi.responses import FileResponse, Response
from uuid import uuid4
from google.adk.agents import Agent
from google.adk.sessions import DatabaseSessionService
from google.adk.runners import Runner
from google.genai import types
from google import genai
import random
from dotenv import load_dotenv
from app.src.core.settings import settings
from app.src.core.auth import get_current_user
from pydantic import BaseModel
import random
import base64

load_dotenv()

MODEL_NAME = "gemini-2.0-flash"

# def get_random_number_betweeen(min: int, max: int) -> int:
#     """Retrieves a random number between a specified minimum and maximum.

#     Args:
#         min (int): The minimum value of the range.
#         max (int): The maximum value of the range.

#     Returns:
#         int: A random number between the specified minimum and maximum.
#     """

#     return random.randint(min, max)



face_help_agent = Agent(
    name="face_help_assistant",
    model=MODEL_NAME,
    instruction="""
    You are a helpful assistant helping a neurodivergent kid play a game to match face to emotions. You goal
    is to help the kid win the game. You will be provided an image of the current state of the game.
    
    ## Game Overview
    There will be an equal number of emotions and cartoon characters displaying those emotions. The goal of this
    game is to match the face to the emotion. We are trying to help the kid understand and identify emotions. Once 
    all the emotions are matched and all the emotions have been dragged from above the cartoons to the slot
    below the cartoons, the game is over and the kid wins.
    
    ## Helping the kid
    The kid will click the "Get Help" button to get help button in the top right corner of the game. This is where you
    will come in. Here you should provide the kid help to win the game. Your clue should be helpful and as they use more
    hints and the time is running out, you should provide more helpful clues.
    """,
    description="An assistant helping a neurodivergent kid play a game to match face to emotions.",
)

app_name = "sprout"
emotions = [
    "angry",
    "happy",
    "sad",
    "scared"
]
people = [1,2]

database_session_service = DatabaseSessionService(
    db_url=settings.db_url
)

face_help_runner = Runner(
    agent=face_help_agent,
    app_name=app_name,
    session_service=database_session_service
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GameState(BaseModel):
    session_id: str
    emotions: list[str]
    image_paths: list[str]
    emotion_options: list[str]

class HelpResponse(BaseModel):
    text: str
    audio: str

@app.get("/games/face/init")
async def init_game(current_user: User = Depends(get_current_user)) -> GameState:
    sample_emotions = random.sample(emotions,4)
    sample_people = [random.choice(people) for _ in range(4)]
    
    session = await database_session_service.create_session(
        app_name=app_name,
        user_id=str(current_user.id)
    )
    emotion_options = sample_emotions.copy()
    random.shuffle(emotion_options)
    
    return {
        "session_id": session.id,
        "emotions": sample_emotions,
        "emotion_options": emotion_options,
        "image_paths": [f"/emotions/{person}/{emotions.index(emotion)+1}.png" for emotion, person in zip(sample_emotions, sample_people)]
    }


def convert_to_wav(audio_data: bytes) -> bytes:
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

async def get_face_help(
    image: str,
    session_id: str,
    current_user: User
) -> str:
    content = types.Content(role='user', parts=[
        types.Part(text="Here is the current state of the game. Can you please help me?"),
        types.Part.from_bytes(data=image, mime_type="image/png")
    ])

    async for event in face_help_runner.run_async(
            user_id=str(current_user.id),
            session_id=session_id,
            new_message=content,
        ):
            return event.content.parts[0].text

def generate_audio(text: str) -> bytes:
    client = genai.Client(
        api_key=settings.google_api_key_tts,
        
    )
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
        response_modalities=[
            "audio",
        ],
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
    
    audio_data = response.candidates[0].content.parts[0].inline_data.data
    return audio_data

    
@app.post("/games/face/{session_id}/help")
async def get_help(
    session_id: str,
    image: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
) -> HelpResponse:
    image_content = await image.read()
    image_base64 = base64.b64encode(image_content).decode('utf-8')
    text = await get_face_help(image_base64, session_id, current_user)
    audio_data = generate_audio(text)
    wav_data = convert_to_wav(audio_data)
    audio_base64 = base64.b64encode(wav_data).decode('utf-8')
    
    # for testing
    # with open("test.wav", "wb") as f:
    #     f.write(wav_data)
    
    # with open("test.wav", "rb") as f:
    #     wav_data = f.read()
    #     audio_base64 = base64.b64encode(wav_data).decode('utf-8')
    #     text = "test"
        
    return HelpResponse(
        text=text,
        audio=audio_base64
    )


@app.get('/auth/new')
async def new_auth():
    new_token = uuid4().hex
    return {
        "id": uuid4(),
        "session_token": new_token
    }
    

@app.get("/auth/me")
async def get_current_user_info(current_user: User = Depends(get_current_user)) -> User:
    return  current_user
