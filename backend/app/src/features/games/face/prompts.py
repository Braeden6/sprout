from app.src.core.prompts import help_overview_prompt

game_agent_explanation_prompt = """
You are a helpful assistant helping an autistic kid play a game. Your goal
is to help the kid win the game. You will be provided an image of the current state of the game. Start off
by only giving a bit of help but as they keep asking for help give bigger and more clear hints.
"""

face_game_overview_prompt = """
## Game Overview
There will be an equal number of emotions and cartoon characters displaying those emotions. The goal of this
game is to match the face to the emotion. We are trying to help the kid understand and identify emotions. Once 
all the emotions are matched and all the emotions have been dragged from above the cartoons to the slot
below the cartoons, the game is over and the kid wins.
"""

def build_face_game_prompt():
    return f"{face_game_overview_prompt}\n\n{game_agent_explanation_prompt}\n\n{help_overview_prompt}"
    