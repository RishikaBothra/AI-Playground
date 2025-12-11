# src/database/database.py
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, scoped_session
from sqlalchemy.exc import OperationalError

load_dotenv()
database_url = os.getenv("DATABASE_URL")

_invalid_vals = (None, "", "no", "false", "none")

if not database_url or database_url.strip().lower() in _invalid_vals:
    raise RuntimeError(
        "DATABASE_URL is not set or is invalid.\n\n"
        "Set the DATABASE_URL environment variable to a valid SQLAlchemy URL, e.g.:\n"
        "  sqlite:///./dev.db\n"
        "  postgresql+psycopg2://user:pass@localhost:5432/dbname\n\n"
        "If you're using a .env file, ensure it contains DATABASE_URL=... and is located "
        "in the project root or the folder where you run uvicorn/alembic."
    )

try:
    engine = create_engine(database_url, future=True, echo=False)
except Exception as e:
    raise RuntimeError(f"Failed to create SQLAlchemy engine from DATABASE_URL ({repr(database_url)}): {e}") from e

Base = declarative_base()

SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False, expire_on_commit=False)

def get_db():
    """
    FastAPI dependency that yields a SQLAlchemy Session.
    Usage:
        from fastapi import Depends
        def endpoint(db: Session = Depends(get_db)):
            ...
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
