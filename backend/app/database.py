import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings

# Determine connect_args based on DB type (e.g., check_same_thread for SQLite)
connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    echo=False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """FastAPI dependency for yielding database session with automatic cleanup."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Initializes database tables and seeds initial place data if empty."""
    # Import all models so metadata is registered
    from app.models.user import User
    from app.models.trip import Trip
    from app.models.itinerary import ItineraryItem
    from app.models.place import Place
    from app.models.chat import ChatHistory
    from app.utils.seed_data import seed_initial_places

    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        seed_initial_places(db)
    finally:
        db.close()
