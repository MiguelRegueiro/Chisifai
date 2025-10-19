from flask import Flask, request, jsonify
from flask_cors import CORS
import json
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# In-memory storage for received telemetry data
telemetry_storage = []

@app.route('/')
def home():
    return {"message": "Chisifai Telemetry Ingestion API", "status": "running"}

@app.route('/api/telemetry', methods=['POST'])
def receive_telemetry():
    """Receive telemetry data from IoT sensors via Node-RED"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ["id", "packageId", "temperature", "gForce", "latitude", "longitude", "timestamp"]
        for field in required_fields:
            if field not in data:
                return {"error": f"Missing required field: {field}"}, 400
        
        # Add to in-memory storage
        telemetry_storage.append(data)
        
        # Keep only the latest 1000 records to prevent memory overflow
        if len(telemetry_storage) > 1000:
            telemetry_storage.pop(0)
        
        return {"message": "Telemetry data received successfully", "id": data["id"]}, 201
    except Exception as e:
        return {"error": str(e)}, 500

# Keep the original GET endpoints for the frontend
telemetry_data = []
alerts_data = []

# Sample initial data
for i in range(5):
    package_id = f"PKG-{str(i+1).zfill(3)}"
    data = {
        "id": i + 1,
        "packageId": package_id,
        "temperature": 4.5,
        "gForce": 1.2,
        "latitude": 40.4168,
        "longitude": -3.7038,
        "timestamp": datetime.now().isoformat()
    }
    telemetry_data.append(data)

@app.route('/api/telemetry', methods=['GET'])
def get_telemetry():
    """Get latest telemetry data"""
    import random
    for item in telemetry_data:
        item["temperature"] = round(item["temperature"] + (random.random() - 0.5) * 0.5, 2)
        item["gForce"] = round(item["gForce"] + (random.random() - 0.5) * 0.5, 2)
        item["timestamp"] = datetime.now().isoformat()
    return jsonify(telemetry_data)

@app.route('/api/kpis', methods=['GET'])
def get_kpis():
    """Get Key Performance Indicators"""
    import random
    return {
        "slaPercentage": round(90 + random.random() * 8, 1),
        "mttDetection": random.randint(10, 60),
        "falsePositiveRate": round(5 + random.random() * 8, 1)
    }

@app.route('/api/alerts', methods=['GET'])
def get_alerts():
    """Get alerts - generate some randomly for demo"""
    import random
    import time
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
        if 'alerts_data' not in globals():
            globals()['alerts_data'] = []
        alerts_data.insert(0, alert)  # Add to beginning
        # Keep only last 10 alerts
        if len(alerts_data) > 10:
            alerts_data.pop()
    
    return jsonify(alerts_data[:5])  # Return only last 5

@app.route('/api/location', methods=['GET'])
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
    return jsonify(locations)

@app.route('/api/temperature', methods=['GET'])
def get_temperature():
    """Get temperature history for charts"""
    import random
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
    return jsonify(temp_history)

@app.route('/api/gforce', methods=['GET'])
def get_gforce():
    """Get G-force history for charts"""
    import random
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
    return jsonify(gforce_history)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8001, debug=True)