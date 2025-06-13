from fastapi import HTTPException, Depends, Header
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from app.src.core.database import get_async_session
from app.src.features.users.model import User


async def get_current_user(
    authorization: Optional[str] = Header(None),
    db_session: AsyncSession = Depends(get_async_session)
) -> User:
    session_token = authorization.replace("Bearer ", "")
    if not session_token:
        raise HTTPException(status_code=401, detail="No session token provided")
    
    query = select(User).where(User.session_token == session_token)
    result = await db_session.execute(query)
    user = result.scalars().first()
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid session token")
    
    return user