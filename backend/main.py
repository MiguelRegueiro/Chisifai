from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from typing import List, Dict, Optional
from sqlalchemy.orm import Session
import random
import time
from datetime import datetime
from database import get_db, Telemetry
from models import TelemetryCreate, TelemetryResponse

app = FastAPI(title="Chisifai API", version="1.0.0")

# Add CORS middleware to allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for demonstration (will be replaced with database)
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

@app.post("/api/telemetry")
def create_telemetry(telemetry: TelemetryCreate, db: Session = Depends(get_db)):
    """Receive telemetry data from IoT sensors via Node-RED"""
    try:
        # Create a new Telemetry record
        db_telemetry = Telemetry(
            package_id=telemetry.packageId,
            temperature=telemetry.temperature,
            g_force=telemetry.gForce,
            latitude=telemetry.latitude,
            longitude=telemetry.longitude,
            timestamp=datetime.fromisoformat(telemetry.timestamp.replace('Z', '+00:00')) if telemetry.timestamp.endswith('Z') else datetime.fromisoformat(telemetry.timestamp),
            battery_level=telemetry.batteryLevel,
            signal_strength=telemetry.signalStrength
        )
        db.add(db_telemetry)
        db.commit()
        db.refresh(db_telemetry)
        
        return {"message": "Telemetry data received and stored successfully", "id": db_telemetry.id}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error storing telemetry data: {str(e)}")


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
        "falsePositiveRate": round(5 + random.random() * 8, 1),
        # Nuevas métricas importantes para entrega de tartas de queso
        "temperatureCompliance": round(85 + random.random() * 12, 1),  # % de entregas con temperatura adecuada
        "avgDeliveryTime": round(25 + random.random() * 15, 1),       # Tiempo promedio de entrega en minutos
        "productConditionRate": round(94 + random.random() * 5, 1),   # % de productos entregados en buenas condiciones
        "customerSatisfaction": round(4.0 + random.random() * 0.8, 1) # Calificación promedio del cliente
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

@app.get("/api/telemetry/stored")
def get_stored_telemetry(db: Session = Depends(get_db)):
    """Get stored telemetry data from database"""
    stored_telemetry = db.query(Telemetry).order_by(Telemetry.timestamp.desc()).limit(100).all()
    return [
        {
            "id": item.id,
            "packageId": item.package_id,
            "temperature": item.temperature,
            "gForce": item.g_force,
            "latitude": item.latitude,
            "longitude": item.longitude,
            "timestamp": item.timestamp.isoformat(),
            "batteryLevel": item.battery_level,
            "signalStrength": item.signal_strength
        }
        for item in stored_telemetry
    ]


@app.get("/api/location")
def get_location():
    """Get location data (similar to telemetry but structured for map)"""
    import random
    locations = []
    for item in telemetry_data:
        # Simulate movement by adding small random changes to position
        lat_change = (random.random() - 0.5) * 0.01  # Small lat change
        lng_change = (random.random() - 0.5) * 0.01  # Small lng change
        
        # Update the position in telemetry_data for consistency
        item["latitude"] = round(item["latitude"] + lat_change, 4)
        item["longitude"] = round(item["longitude"] + lng_change, 4)
        
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