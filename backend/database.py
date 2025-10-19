from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database configuration - default to PostgreSQL for production, SQLite for development
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://chisifai_user:chisifai_password@localhost/chisifai_db")

# Create engine
# Using pool_pre_ping to handle potential connection issues
engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class Telemetry(Base):
    __tablename__ = "telemetry"

    id = Column(Integer, primary_key=True, index=True)
    package_id = Column(String, index=True)
    temperature = Column(Float)
    g_force = Column(Float)
    latitude = Column(Float)
    longitude = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)
    battery_level = Column(Float, nullable=True)
    signal_strength = Column(Integer, nullable=True)

# Create tables
Base.metadata.create_all(bind=engine)

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()