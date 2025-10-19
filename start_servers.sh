#!/bin/bash

# Start the Chisifai backend and frontend servers

echo "Starting Chisifai Backend Server..."

# Change to backend directory
cd /home/regueiro/Chisifai/backend || { echo "Error: Backend directory not found"; exit 1; }

# Check if required modules are available
python -c "import fastapi" 2>/dev/null || { echo "Error: FastAPI not installed. Please run: pip install -r requirements.txt"; exit 1; }
python -c "import pydantic" 2>/dev/null || { echo "Error: Pydantic not installed. Please run: pip install -r requirements.txt"; exit 1; }

# Start the server in the background
/home/regueiro/.local/bin/uvicorn main:app --host 0.0.0.0 --port 8001 --reload &

# Wait a moment for the backend to start
sleep 3

# Check if the server is running
if pgrep -f "uvicorn.*main:app" > /dev/null; then
    echo "Backend server started successfully on port 8001"
    echo "Access the API at: http://localhost:8001"
    echo "API documentation at: http://localhost:8001/docs"
    echo ""
    echo "To stop the backend server, run: pkill -f uvicorn"
else
    echo "Error: Failed to start the backend server"
    exit 1
fi

# You can then start the frontend with:
# cd /home/regueiro/Chisifai/frontend-chisifai && npx yarn start