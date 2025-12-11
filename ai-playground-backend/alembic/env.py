import os
from dotenv import load_dotenv
from alembic import context

load_dotenv()

config = context.config

database_url = os.getenv("DATABASE_URL")
if database_url:
    config.set_main_option("sqlalchemy.url", database_url)
else:
    raise RuntimeError(
        "DATABASE_URL env var not set. Alembic needs a database URL to run migrations.\n"
        "Set DATABASE_URL in your environment or in a .env file, e.g.:\n"
        "  export DATABASE_URL='sqlite:///./dev.db'\n"
    )
