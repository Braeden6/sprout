from logging.config import fileConfig
from sqlalchemy import engine_from_config
from sqlalchemy import pool
from alembic import context
from app.src.core.settings import settings
# from app.src.models import * # noqa
from app.src.core.utils import get_all_models
from sqlmodel import SQLModel
from app.src.features.games.face.models import *

config = context.config


if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# import all models from features
get_all_models()

target_metadata = SQLModel.metadata

# Tables to ignore (managed elsewhere)
EXCLUDED_TABLES = {'user_states', 'app_states', 'events', 'sessions'}

def include_object(object, name, type_, reflected, compare_to):
    """
    Exclude certain tables from Alembic's consideration.
    These tables are managed elsewhere and should be ignored.
    """
    if type_ == "table" and name in EXCLUDED_TABLES:
        return False
    return True

config.set_main_option("sqlalchemy.url", settings.db_url or "")

def run_migrations_offline() -> None:

    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        include_object=include_object,
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, 
            target_metadata=target_metadata,
            include_object=include_object,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
