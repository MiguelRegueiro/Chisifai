from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+psycopg2://motify:motify@localhost:5432/motify")
engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine)

app = FastAPI(title="Chisifai Cheese Cake Monitoring API", version="0.1.0")

class Telemetry(BaseModel):
    part_id: str = Field(..., min_length=1)
    ts: datetime
    temp: float
    humidity: float  # Changed from g_force to humidity for car parts
    vibration: float  # Changed from g_force to vibration for car parts

class Alert(BaseModel):
    part_id: str = Field(..., min_length=1)
    alert_type: str = Field(..., min_length=1)
    alert_value: float
    threshold: float
    ts: datetime

@app.get("/health")
def health():
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    return {"ok": True}

@app.post("/ingest/telemetry")
def ingest(t: Telemetry):
    # basic range checks
    if not (-40.0 <= t.temp <= 85.0):
        raise HTTPException(422, "temp out of range")
    if not (0.0 <= t.humidity <= 100.0):
        raise HTTPException(422, "humidity out of range")
    if t.vibration < 0.0:
        raise HTTPException(422, "vibration must be >= 0")

    with engine.begin() as conn:
        conn.execute(
            text("INSERT INTO telemetry (part_id, ts, temp, humidity, vibration) VALUES (:part_id, :ts, :temp, :humidity, :vibration)"),
            {"part_id": t.part_id, "ts": t.ts, "temp": t.temp, "humidity": t.humidity, "vibration": t.vibration}
        )
    return {"ok": True}

@app.post("/ingest/alert")
def create_alert(a: Alert):
    with engine.begin() as conn:
        conn.execute(
            text("INSERT INTO alerts (part_id, alert_type, alert_value, threshold, ts) VALUES (:part_id, :alert_type, :alert_value, :threshold, :ts)"),
            {
                "part_id": a.part_id, 
                "alert_type": a.alert_type, 
                "alert_value": a.alert_value, 
                "threshold": a.threshold, 
                "ts": a.ts
            }
        )
    return {"ok": True}
