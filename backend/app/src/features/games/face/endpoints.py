from fastapi import APIRouter, Depends, BackgroundTasks
from .service import FaceGameService
from app.src.features.users.model import User
from app.src.core.auth import get_current_user
from fastapi import UploadFile, File
from .schemas import GameState, HelpResponse

router = APIRouter(prefix="/games/face", tags=["games/face"])

@router.get("/init")
async def init_game(
    current_user: User = Depends(get_current_user),
    service: FaceGameService = Depends(FaceGameService)
) -> GameState:
    return await service.init_game(current_user)

@router.post("/{session_id}/help")
async def get_help(
    session_id: str,
    image: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    service: FaceGameService = Depends(FaceGameService)
) -> HelpResponse:
    return await service.get_help(session_id, current_user, image)

# tech debt: dont return emotions only check for correctness here
# reason: technically you can cheat on frontend because you know the emotions (but this is a kids game)
@router.post("/{session_id}/match")
async def match_emotion(
    session_id: str,
    emotion: str,
    is_correct: bool,
    current_user: User = Depends(get_current_user),
    service: FaceGameService = Depends(FaceGameService)
):
    return await service.update_game_data(session_id, emotion, is_correct, current_user)


@router.post("/{session_id}/finish")
async def finish_game(
    session_id: str,
    background_tasks: BackgroundTasks,
    image: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    service: FaceGameService = Depends(FaceGameService)
) -> HelpResponse:
    return await service.complete_game(session_id, current_user, background_tasks, image)