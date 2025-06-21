from fastapi import APIRouter, Depends
from app.src.features.games.face.service import FaceGameService
from .service import GuardianService
from app.src.features.users.model import User
from app.src.core.auth import get_current_user
from typing import List
from .schemas import GameReviewData

router = APIRouter(prefix="/guardian", tags=["guardian"])



@router.get("/games/review")
async def get_games_review(
    current_user: User = Depends(get_current_user),
    face_game_service: FaceGameService = Depends(FaceGameService)
) -> List[GameReviewData]:
    games = await face_game_service.get_all_game_data(current_user)
    return [
        GameReviewData(
            game_name="Emotion Recognition Game", 
            game_summary=game.game_summary, 
            game_date=game.start_time,
            total_time=game.end_time - game.start_time if game.end_time else None
        )
        for game in games if game.game_summary]


@router.post("/games/review/meta-analysis")
async def generate_meta_analysis(
    current_user: User = Depends(get_current_user),
    face_game_service: FaceGameService = Depends(FaceGameService),
    guardian_service: GuardianService = Depends(GuardianService)
) -> str:
    games = await face_game_service.get_all_game_data(current_user)
    summarized_games = [ game for game in games if game.game_summary]
    sorted_summarized_games = sorted(summarized_games, key=lambda x: x.start_time)
    return await guardian_service.generate_game_summary(sorted_summarized_games, str(current_user.id))

