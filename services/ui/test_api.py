import requests
import json
from datetime import datetime

# Test script to verify API endpoints
base_url = "http://localhost:8001"

# Test health endpoint
try:
    response = requests.get(f"{base_url}/health")
    print(f"Health check: {response.status_code} - {response.json()}")
except Exception as e:
    print(f"Health check failed: {e}")

# Test GET endpoints
try:
    response = requests.get(f"{base_url}/api/telemetry/latest")
    print(f"Latest telemetry: {response.status_code} - {len(response.json()) if response.status_code == 200 else 'Error'} records")
except Exception as e:
    print(f"Latest telemetry check failed: {e}")

try:
    response = requests.get(f"{base_url}/api/alerts/active")
    print(f"Active alerts: {response.status_code} - {len(response.json()) if response.status_code == 200 else 'Error'} records")
except Exception as e:
    print(f"Active alerts check failed: {e}")

try:
    response = requests.get(f"{base_url}/api/deliveries/active")
    print(f"Active deliveries: {response.status_code} - {len(response.json()) if response.status_code == 200 else 'Error'} records")
except Exception as e:
    print(f"Active deliveries check failed: {e}")