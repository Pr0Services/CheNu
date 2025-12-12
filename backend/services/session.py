# chenu_v8/db/session.py
from contextlib import contextmanager
from sqlalchemy.orm import Session
from .models import Database
from ..config import settings

# Instance globale de DB
db = Database(settings.DATABASE_URL)

def create_all_tables():
    db.create_all_tables()

@contextmanager
def get_session() -> Session:
    """Context manager pour obtenir une session SQLAlchemy."""
    with db.get_session() as session:
        yield session
