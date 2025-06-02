from fastapi import FastAPI
from fastapi.responses import FileResponse
from google.adk.agents import Agent
from google.adk.tools import google_search
# from google.adk.models.lite_llm import LiteLlm # For multi-model support
from google.adk.sessions import InMemorySessionService, DatabaseSessionService
from google.adk.runners import Runner
from google.genai import types
import random
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    db_url: str = "postgresql://postgres:postgres@localhost:5432/sprout"
    google_api_key: str
    google_genai_use_vertexai: str
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        

settings = Settings()

def get_random_number_betweeen(min: int, max: int) -> int:
    """Retrieves a random number between a specified minimum and maximum.

    Args:
        min (int): The minimum value of the range.
        max (int): The maximum value of the range.

    Returns:
        int: A random number between the specified minimum and maximum.
    """

    return random.randint(min, max)

def get_favorite_color() -> str:
    """Returns the favorite color of the user.

    Returns:
        str: The favorite color of the user.
    """
    return "mustard yellow"

root_agent = Agent(
    name="search_assistant",
    model="gemini-2.0-flash",
    instruction="You are a helpful assistant. Answer user questions using Google Search when needed.",
    description="An assistant that can search the web.",
    tools=[
        # google_search, 
        get_random_number_betweeen,
        get_favorite_color
        ]
)

user_id = "test134"
session_id = "190a8455-5508-4648-ac14-b606c7f8b001"
app_name = "sprout"

database_session_service = DatabaseSessionService(
    db_url=settings.db_url
)

runner = Runner(
    agent=root_agent,
    app_name=app_name,
    session_service=database_session_service
)


async def call_agent(query: str, runner: Runner, user_id: str, session_id: str):
    content = types.Content(role='user', parts=[types.Part(text=query)])

    final_response_text = "Agent did not produce a final response." 
    async for event in runner.run_async(user_id=user_id, session_id=session_id, new_message=content):
        if event.is_final_response():
            if event.content and event.content.parts:
                final_response_text = event.content.parts[0].text
            elif event.actions and event.actions.escalate: # Handle potential errors/escalations
                final_response_text = f"Agent escalated: {event.error_message or 'No specific message.'}"
                
    return final_response_text



async def lifespan(app: FastAPI):
    sessions = await database_session_service.list_sessions(
        app_name=app_name,
        user_id=user_id
    )
    if not len(sessions.sessions):
        new_session = await database_session_service.create_session(
            app_name=app_name,
            user_id=user_id,
            session_id=session_id
        )
    else:
        new_session = sessions.sessions[0]
    app.state.session_id = new_session.id
    yield
    
app = FastAPI(lifespan=lifespan)

@app.get("/chat/history")
async def get_chat_history():
    session = await database_session_service.get_session(
        app_name=app_name,
        user_id=user_id,
        session_id=app.state.session_id
    )
    return {
        "chat_history": [event.content.parts[0].text for event in session.events]
    }
    
@app.delete("/chat/clear")
async def clear_chat_history():
    await database_session_service.delete_session(
        app_name=app_name,
        user_id=user_id,
        session_id=app.state.session_id
    )
    new_session = await database_session_service.create_session(
        app_name=app_name,
        user_id=user_id,
        session_id=session_id
    )
    app.state.session_id = new_session.id
    
    
    

@app.get("/")
async def root(question: str):
    final_response_text = await call_agent(
        question, runner, user_id, app.state.session_id
    )
    
    return final_response_text
