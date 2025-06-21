from google.adk.agents import Agent
from .prompts import build_face_game_prompt

MODEL_NAME = "gemini-2.0-flash"

face_help_agent = Agent(
    name="face_help_assistant",
    model=MODEL_NAME,
    instruction=build_face_game_prompt(),
    description="An assistant helping autistic kid play a game to match face to emotions.",
) 