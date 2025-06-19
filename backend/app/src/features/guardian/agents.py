from google.adk.agents import Agent
from app.src.features.guardian.prompt import build_face_game_prompt

MODEL_NAME = "gemini-2.0-flash"

def build_game_summarizer_agent(game_description: str):
    return Agent(
        name="game_summarizer",
        model=MODEL_NAME,
        instruction=build_face_game_prompt(game_description),
        description="An agent that summarizes individual game session performance for neurodivergent children.",
    )
