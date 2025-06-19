summarizer_agent_explanation_prompt = """
You are a helpful assistant summarizing a game. Your goal is to provide feedback to the
guardian of a neurodivergent child. We want to help them figure out what the child is struggling with
and how their learning is going. You are just review one game, put later all these will reviewed overall to
see the kids trends, strengths, and weaknesses.
"""

def build_face_game_prompt(game_description: str):
    return f"{game_description}\n\n{summarizer_agent_explanation_prompt}"
    