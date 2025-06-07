from app.src.features.users.model import User
from fastapi import FastAPI, Depends
from fastapi.responses import FileResponse
from uuid import uuid4
from google.adk.agents import Agent
from google.adk.tools import google_search
# from google.adk.models.lite_llm import LiteLlm # For multi-model support
from google.adk.sessions import InMemorySessionService, DatabaseSessionService
from google.adk.runners import Runner
from google.genai import types
import random
from dotenv import load_dotenv
from app.src.core.settings import settings
from app.src.core.auth import get_current_user

load_dotenv()

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


# Remove hardcoded user_id - now it will be dynamic based on auth
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



    
app = FastAPI()

@app.get("/chat/history")
async def get_chat_history(current_user: User = Depends(get_current_user)):
    session = await database_session_service.get_session(
        app_name=app_name,
        user_id=current_user.id,
        session_id=current_user.session_token
    )
    return {
        "chat_history": [event.content.parts[0].text for event in session.events]
    }
    
@app.delete("/chat/clear")
async def clear_chat_history(current_user: User = Depends(get_current_user)):
    await database_session_service.delete_session(
        app_name=app_name,
        user_id=current_user.id,
        session_id=current_user.session_token
    )
    return {"message": "Chat history cleared"}

@app.get("/")
async def root(question: str, current_user: User = Depends(get_current_user)):
    final_response_text = await call_agent(
        question, runner, current_user.id, current_user.session_token
    )
    
    return final_response_text


@app.get('/auth/new')
async def new_auth():
    new_token = uuid4().hex
    return {
        "id": uuid4(),
        "session_token": new_token}
    

@app.get("/auth/me")
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    return  current_user
