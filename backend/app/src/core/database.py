from typing import AsyncGenerator
from contextlib import asynccontextmanager
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from app.src.core.settings import settings

DATABASE_URL = settings.db_url.replace("postgresql://", "postgresql+asyncpg://") if settings.db_url else ""

engine = create_async_engine(DATABASE_URL or "")
async_session_maker = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)  # type: ignore


async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_maker() as session:  # type: ignore
        yield session
        
@asynccontextmanager
async def get_async_session_context() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_maker() as session:  # type: ignore
        yield session