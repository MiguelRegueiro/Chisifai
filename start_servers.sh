#!/bin/bash

# Start the Chisifai backend and frontend servers

echo "Starting Chisifai Backend Server..."
cd /home/regueiro/Chisifai/backend
/home/regueiro/.local/bin/uvicorn main:app --host 0.0.0.0 --port 8001 --reload &

# Wait a moment for the backend to start
sleep 3

echo "Backend server started on port 8001"
echo "To stop the backend server, run: pkill -f uvicorn"

# You can then start the frontend with:
# cd /home/regueiro/Chisifai/frontend-chisifai && npx yarn start