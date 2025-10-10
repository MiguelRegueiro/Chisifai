from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from pydantic import BaseModel, Field
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from datetime import datetime, timedelta
import os
import json
from typing import List
import asyncio

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+psycopg2://motify:motify@localhost:5432/motify")
engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine)

app = FastAPI(title="Chisifai Cheese Cake Monitoring API", version="0.1.0")

# WebSocket connections storage
active_connections: List[WebSocket] = []

class Telemetry(BaseModel):
    part_id: str = Field(..., min_length=1)
    ts: datetime
    temp: float
    humidity: float  # Changed from g_force to humidity for car parts
    vibration: float  # Changed from g_force to vibration for car parts
    lat: float = 0.0  # Added for location data
    lng: float = 0.0  # Added for location data

class Alert(BaseModel):
    part_id: str = Field(..., min_length=1)
    alert_type: str = Field(..., min_length=1)
    alert_value: float
    threshold: float
    ts: datetime

# Frontend API endpoints
class DeliveryStatus(BaseModel):
    part_id: str
    temp: float
    humidity: float
    vibration: float
    lat: float
    lng: float
    ts: datetime

class AlertStatus(BaseModel):
    part_id: str
    alert_type: str
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
    if not (-90.0 <= t.lat <= 90.0):
        raise HTTPException(422, "lat out of range")
    if not (-180.0 <= t.lng <= 180.0):
        raise HTTPException(422, "lng out of range")

    with engine.begin() as conn:
        conn.execute(
            text("INSERT INTO telemetry (part_id, ts, temp, humidity, vibration, lat, lng) VALUES (:part_id, :ts, :temp, :humidity, :vibration, :lat, :lng)"),
            {
                "part_id": t.part_id, 
                "ts": t.ts, 
                "temp": t.temp, 
                "humidity": t.humidity, 
                "vibration": t.vibration,
                "lat": t.lat,
                "lng": t.lng
            }
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

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_text(json.dumps(message))
            except:
                # Remove connection if it's no longer valid
                self.disconnect(connection)

manager = ConnectionManager()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Keep the connection alive
            data = await websocket.receive_text()
            # Optionally handle messages from frontend
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# API endpoints for the frontend
@app.get("/api/telemetry/latest")
def get_latest_telemetry():
    """Get the latest telemetry data for all active deliveries"""
    with engine.connect() as conn:
        result = conn.execute(
            text("""
                SELECT DISTINCT ON (part_id) 
                    part_id, temp, humidity, vibration, lat, lng, ts
                FROM telemetry 
                ORDER BY part_id, ts DESC
            """)
        )
        rows = result.fetchall()
        # Convert to list of dictionaries
        telemetry_list = []
        for row in rows:
            telemetry_list.append({
                "part_id": row[0],
                "temp": float(row[1]),
                "humidity": float(row[2]),
                "vibration": float(row[3]),
                "lat": float(row[4]) if row[4] is not None else 0.0,
                "lng": float(row[5]) if row[5] is not None else 0.0,
                "ts": row[6].isoformat() if row[6] else None
            })
        return telemetry_list

@app.get("/api/telemetry/history/{part_id}")
def get_telemetry_history(part_id: str):
    """Get telemetry history for a specific delivery"""
    with engine.connect() as conn:
        result = conn.execute(
            text("""
                SELECT part_id, temp, humidity, vibration, lat, lng, ts
                FROM telemetry 
                WHERE part_id = :part_id
                ORDER BY ts DESC
                LIMIT 100
            """),
            {"part_id": part_id}
        )
        rows = result.fetchall()
        # Convert to list of dictionaries
        telemetry_list = []
        for row in rows:
            telemetry_list.append({
                "part_id": row[0],
                "temp": float(row[1]),
                "humidity": float(row[2]),
                "vibration": float(row[3]),
                "lat": float(row[4]) if row[4] is not None else 0.0,
                "lng": float(row[5]) if row[5] is not None else 0.0,
                "ts": row[6].isoformat() if row[6] else None
            })
        return telemetry_list

@app.get("/api/alerts/active")
def get_active_alerts():
    """Get active alerts (unresolved)"""
    with engine.connect() as conn:
        result = conn.execute(
            text("""
                SELECT part_id, alert_type, alert_value, threshold, ts
                FROM alerts
                ORDER BY ts DESC
                LIMIT 50
            """)
        )
        rows = result.fetchall()
        # Convert to list of dictionaries
        alerts_list = []
        for row in rows:
            alerts_list.append({
                "part_id": row[0],
                "alert_type": row[1],
                "alert_value": float(row[2]),
                "threshold": float(row[3]),
                "ts": row[4].isoformat() if row[4] else None
            })
        return alerts_list

@app.get("/api/deliveries/active")
def get_active_deliveries():
    """Get active deliveries with their latest telemetry"""
    with engine.connect() as conn:
        result = conn.execute(
            text("""
                SELECT DISTINCT ON (t.part_id) 
                    t.part_id, t.temp, t.humidity, t.vibration, t.lat, t.lng, t.ts
                FROM telemetry t
                WHERE t.ts > NOW() - INTERVAL '1 hour'
                ORDER BY t.part_id, t.ts DESC
            """)
        )
        rows = result.fetchall()
        # Convert to list of dictionaries
        deliveries_list = []
        for row in rows:
            deliveries_list.append({
                "part_id": row[0],
                "temp": float(row[1]),
                "humidity": float(row[2]),
                "vibration": float(row[3]),
                "lat": float(row[4]) if row[4] is not None else 0.0,
                "lng": float(row[5]) if row[5] is not None else 0.0,
                "ts": row[6].isoformat() if row[6] else None
            })
        return deliveries_list

# Helper function to broadcast telemetry updates
async def broadcast_telemetry_update(data: dict):
    await manager.broadcast({
        "type": "telemetry_update",
        "data": data
    })

# Helper function to broadcast alert updates
async def broadcast_alert_update(data: dict):
    await manager.broadcast({
        "type": "alert_update",
        "data": data
    })
