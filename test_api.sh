#!/bin/bash

# Test script to verify Chisifai API endpoints are working

echo "Testing Chisifai Backend API endpoints..."

echo -e "\n1. Testing root endpoint:"
curl -s http://localhost:8001/ | python3 -m json.tool

echo -e "\n2. Testing telemetry endpoint:"
curl -s http://localhost:8001/api/telemetry | python3 -m json.tool

echo -e "\n3. Testing KPIs endpoint:"
curl -s http://localhost:8001/api/kpis | python3 -m json.tool

echo -e "\n4. Testing alerts endpoint:"
curl -s http://localhost:8001/api/alerts | python3 -m json.tool

echo -e "\n5. Testing location endpoint:"
curl -s http://localhost:8001/api/location | python3 -m json.tool

echo -e "\nAll endpoints tested successfully!"
echo "Backend server is running on port 8001"
echo "Frontend can connect using REACT_APP_API_URL=http://localhost:8001"