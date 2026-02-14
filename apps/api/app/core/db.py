from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import settings

_engine = None
_SessionLocal = None



def get_engine():
    global _engine
    if _engine is None:
        _engine = create_engine(settings.database_url, pool_pre_ping=True)
    return _engine



def get_session_maker():
    global _SessionLocal
    if _SessionLocal is None:
        _SessionLocal = sessionmaker(bind=get_engine(), autoflush=False, autocommit=False, class_=Session)
    return _SessionLocal



def get_db():
    session = get_session_maker()()
    try:
        yield session
    finally:
        session.close()