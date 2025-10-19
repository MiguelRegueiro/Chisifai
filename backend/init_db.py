#!/usr/bin/env python3
"""
Database initialization script for Chisifai
"""

from database import engine, Base

def init_db():
    print("Initializing database...")
    # Create all tables
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

if __name__ == "__main__":
    init_db()