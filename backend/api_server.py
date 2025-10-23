#!/usr/bin/env python3
"""
Simple API server to serve data from SQLite database to the frontend
"""

import sqlite3
import json
from datetime import datetime, timedelta
import random
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional


# Database configuration
DB_FILE = 'chisifai.db'

app = FastAPI(title="Chisifai API", description="API for Chisifai dashboard data")

# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TelemetryRecord(BaseModel):
    id: int
    packageId: str
    temperature: float
    gForce: float
    latitude: float
    longitude: float
    timestamp: str
    batteryLevel: Optional[float]
    signalStrength: Optional[int]


class KPIs(BaseModel):
    temperatureCompliance: float
    productConditionRate: float
    avgDeliveryTime: float
    customerSatisfaction: float
    slaPercentage: float
    mttDetection: int
    alertCount: int


class Alert(BaseModel):
    id: int
    packageId: str
    type: str
    message: str
    timestamp: str
    severity: str


class LocationData(BaseModel):
    id: int
    packageId: str
    latitude: float
    longitude: float
    timestamp: str


class TemperatureData(BaseModel):
    timestamp: str
    value: float
    packageId: str


class GForceData(BaseModel):
    timestamp: str
    value: float
    packageId: str


def get_db_connection():
    """Get database connection"""
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row  # This enables column access by name
    return conn


@app.get("/api/telemetry", response_model=List[TelemetryRecord])
def get_telemetry_data():
    """Get latest telemetry data for all packages"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Get the latest reading for each package
        cursor.execute("""
            SELECT t1.* FROM telemetry t1
            INNER JOIN (
                SELECT package_id, MAX(timestamp) as max_timestamp
                FROM telemetry
                GROUP BY package_id
            ) t2 ON t1.package_id = t2.package_id AND t1.timestamp = t2.max_timestamp
            ORDER BY t1.timestamp DESC
        """)
        
        records = cursor.fetchall()
        result = []
        for record in records:
            result.append(TelemetryRecord(
                id=record['id'],
                packageId=record['package_id'],
                temperature=record['temperature'],
                gForce=record['g_force'],
                latitude=record['latitude'],
                longitude=record['longitude'],
                timestamp=record['timestamp'],
                batteryLevel=record['battery_level'],
                signalStrength=record['signal_strength']
            ))
        
        return result
    finally:
        conn.close()


@app.get("/api/kpis", response_model=KPIs)
def get_kpis():
    """Get Key Performance Indicators"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Get total packages
        cursor.execute("SELECT COUNT(DISTINCT package_id) FROM telemetry")
        total_packages = cursor.fetchone()[0] or 1
        
        # Get packages with temperature issues
        cursor.execute("SELECT COUNT(DISTINCT package_id) FROM telemetry WHERE temperature > 26.0")
        temp_violations = cursor.fetchone()[0]
        
        # Get packages with g-force issues
        cursor.execute("SELECT COUNT(DISTINCT package_id) FROM telemetry WHERE g_force > 2.5")
        gforce_violations = cursor.fetchone()[0]
        
        # Calculate metrics
        packages_with_issues = temp_violations + gforce_violations
        sla_percentage = ((total_packages - packages_with_issues) / total_packages) * 100 if total_packages > 0 else 100
        temperature_compliance = 100 - (temp_violations / total_packages * 100) if total_packages > 0 else 100
        avg_delivery_time = round(25 + random.random() * 15, 1)  # Placeholder
        product_condition_rate = round(94 + random.random() * 5, 1)  # Placeholder
        customer_satisfaction = round(4.0 + random.random() * 0.8, 1)  # Placeholder
        
        # Get active alerts count
        cursor.execute("SELECT COUNT(*) FROM alerts WHERE is_resolved = 0 OR is_resolved IS NULL")
        active_alerts = cursor.fetchone()[0]
        
        return KPIs(
            temperatureCompliance=round(temperature_compliance, 1),
            productConditionRate=round(product_condition_rate, 1),
            avgDeliveryTime=avg_delivery_time,
            customerSatisfaction=round(customer_satisfaction, 1),
            slaPercentage=round(sla_percentage, 1),
            mttDetection=30,  # Placeholder
            alertCount=active_alerts
        )
    finally:
        conn.close()


@app.get("/api/alerts", response_model=List[Alert])
def get_alerts():
    """Get active alerts"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("""
            SELECT * FROM alerts 
            WHERE is_resolved = 0 OR is_resolved IS NULL
            ORDER BY timestamp DESC 
            LIMIT 10
        """)
        alerts = cursor.fetchall()
        
        result = []
        for alert in alerts:
            # Format timestamp to match expected format
            try:
                # Try to parse the timestamp and format it properly
                dt = datetime.fromisoformat(alert['timestamp'].replace('Z', '+00:00'))
                formatted_time = dt.strftime("%H:%M:%S")
            except:
                formatted_time = alert['timestamp']
                
            result.append(Alert(
                id=alert['id'],
                packageId=alert['package_id'],
                type=alert['alert_type'],
                message=alert['message'],
                timestamp=formatted_time,
                severity=alert['severity']
            ))
        
        return result
    finally:
        conn.close()


@app.get("/api/location", response_model=List[LocationData])
def get_location_data():
    """Get location data for all packages"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Get latest location for each package
        cursor.execute("""
            SELECT t1.id, t1.package_id, t1.latitude, t1.longitude, t1.timestamp 
            FROM telemetry t1
            INNER JOIN (
                SELECT package_id, MAX(timestamp) as max_timestamp
                FROM telemetry
                GROUP BY package_id
            ) t2 ON t1.package_id = t2.package_id AND t1.timestamp = t2.max_timestamp
            ORDER BY t1.timestamp DESC
        """)
        locations = cursor.fetchall()
        
        result = []
        for loc in locations:
            result.append(LocationData(
                id=loc['id'],
                packageId=loc['package_id'],
                latitude=loc['latitude'],
                longitude=loc['longitude'],
                timestamp=loc['timestamp']
            ))
        
        return result
    finally:
        conn.close()


@app.get("/api/temperature", response_model=List[TemperatureData])
def get_temperature_data():
    """Get temperature history"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Get recent temperature readings
        cursor.execute("""
            SELECT timestamp, temperature, package_id FROM telemetry 
            ORDER BY timestamp DESC 
            LIMIT 500
        """)
        temp_data = cursor.fetchall()
        
        result = []
        for data in temp_data:
            result.append(TemperatureData(
                timestamp=data['timestamp'],
                value=data['temperature'],
                packageId=data['package_id']
            ))
        
        return result
    finally:
        conn.close()


@app.get("/api/gforce", response_model=List[GForceData])
def get_gforce_data():
    """Get g-force history"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Get recent g-force readings
        cursor.execute("""
            SELECT timestamp, g_force, package_id FROM telemetry 
            ORDER BY timestamp DESC 
            LIMIT 500
        """)
        gforce_data = cursor.fetchall()
        
        result = []
        for data in gforce_data:
            result.append(GForceData(
                timestamp=data['timestamp'],
                value=data['g_force'],
                packageId=data['package_id']
            ))
        
        return result
    finally:
        conn.close()


@app.get("/")
def read_root():
    """Root endpoint to verify API is running"""
    return {"message": "Chisifai API is running", "timestamp": datetime.now().isoformat()}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)