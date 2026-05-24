#!/bin/bash
# Start the BCS DXF Bridge service
# Run once: pip3 install -r requirements.txt

cd "$(dirname "$0")"
echo "Starting BCS DXF Bridge on port 8001..."
python3 -m uvicorn main:app --host 0.0.0.0 --port 8001
