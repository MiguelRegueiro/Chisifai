from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from typing import List, Dict, Optional
import random
import time
from datetime import datetime

app = FastAPI(title="Chisifai API", version="1.0.0")

# Add CORS middleware to allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for demonstration
telemetry_data = []
alerts_data = []

# Sample initial data
for i in range(5):
    package_id = f"PKG-{str(i+1).zfill(3)}"
    data = {
        "id": i + 1,
        "packageId": package_id,
        "temperature": round(2 + random.random() * 6, 2),
        "gForce": round(0.2 + random.random() * 2.8, 2),
        "latitude": round(40.4168 + (random.random() - 0.5) * 0.5, 4),
        "longitude": round(-3.7038 + (random.random() - 0.5) * 0.5, 4),
        "timestamp": datetime.now().isoformat()
    }
    telemetry_data.append(data)

@app.get("/")
def read_root():
    return {"message": "Chisifai Backend API", "status": "running"}

@app.get("/api/telemetry")
def get_telemetry():
    """Get latest telemetry data"""
    # Update temperatures to simulate real-time changes
    for item in telemetry_data:
        item["temperature"] = round(
            item["temperature"] + (random.random() - 0.5) * 0.5, 2
        )
        item["gForce"] = round(
            item["gForce"] + (random.random() - 0.5) * 0.5, 2
        )
        item["timestamp"] = datetime.now().isoformat()
    return telemetry_data

@app.get("/api/kpis")
def get_kpis():
    """Get Key Performance Indicators"""
    return {
        "slaPercentage": round(90 + random.random() * 8, 1),
        "mttDetection": random.randint(10, 60),
        "falsePositiveRate": round(5 + random.random() * 8, 1)
    }

@app.get("/api/alerts")
def get_alerts():
    """Get alerts - generate some randomly for demo"""
    # Sometimes return an alert
    if random.random() > 0.8:  # 20% chance of alert
        alert = {
            "id": int(time.time() * 1000),
            "packageId": f"PKG-{random.randint(1, 5):03d}",
            "type": random.choice(["Temperatura Excedida", "Posible Impacto"]),
            "message": random.choice([
                "La temperatura superó los límites establecidos",
                "Se detectó una fuerza G inusual",
                "Alerta de trayectoria inesperada"
            ]),
            "timestamp": datetime.now().strftime("%H:%M:%S"),
            "severity": random.choice(["high", "medium", "low"])
        }
        alerts_data.insert(0, alert)  # Add to beginning
        # Keep only last 10 alerts
        if len(alerts_data) > 10:
            alerts_data.pop()
    
    return alerts_data[:5]  # Return only last 5

@app.get("/api/location")
def get_location():
    """Get location data (similar to telemetry but structured for map)"""
    locations = []
    for item in telemetry_data:
        locations.append({
            "id": item["id"],
            "lat": item["latitude"],
            "lng": item["longitude"],
            "name": item["packageId"],
            "temp": item["temperature"],
            "gForce": item["gForce"]
        })
    return locations

@app.get("/api/temperature")
def get_temperature():
    """Get temperature history for charts"""
    # Generate last 10 temperature readings for each package
    temp_history = []
    for item in telemetry_data:
        history = []
        base_temp = item["temperature"]
        for i in range(10):
            temp = round(base_temp + (random.random() - 0.5) * 2, 2)
            timestamp = (datetime.now().timestamp() - (9-i) * 30)  # 30 seconds apart
            history.append({
                "timestamp": datetime.fromtimestamp(timestamp).isoformat(),
                "value": temp,
                "packageId": item["packageId"]
            })
        temp_history.extend(history)
    return temp_history

@app.get("/api/gforce")
def get_gforce():
    """Get G-force history for charts"""
    # Generate last 10 G-force readings for each package
    gforce_history = []
    for item in telemetry_data:
        history = []
        base_gforce = item["gForce"]
        for i in range(10):
            gforce = round(base_gforce + (random.random() - 0.5) * 1, 2)
            timestamp = (datetime.now().timestamp() - (9-i) * 30)  # 30 seconds apart
            history.append({
                "timestamp": datetime.fromtimestamp(timestamp).isoformat(),
                "value": gforce,
                "packageId": item["packageId"]
            })
        gforce_history.extend(history)
    return gforce_history

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)