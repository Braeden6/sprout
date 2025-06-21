summarizer_agent_explanation_prompt = """
You are a helpful assistant summarizing a game. Your goal is to provide feedback to the
guardian of an autistic child. We want to help them figure out what the child is struggling with
and how their learning is going. You are just review one game, put later all these will reviewed overall to
see the kids trends, strengths, and weaknesses.
"""

meta_analysis_prompt = """
You are a helpful assistant analyzing a game. Your goal is to provide feedback to the
guardian of an autistic child. We want to help them figure out what the child is struggling with
and how their learning is going. You are reviewing all the games summarized by the summarizer agent.
You are going to provide a meta analysis of the child's learning.
"""

def build_face_game_prompt(game_description: str):
    return f"{game_description}\n\n{summarizer_agent_explanation_prompt}"

def build_meta_analysis_prompt():
    return f"{meta_analysis_prompt}"
    