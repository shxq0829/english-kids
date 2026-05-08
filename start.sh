#!/bin/bash
cd /Users/mac/english-kids
./node_modules/.bin/vite --host 0.0.0.0 --port 5173 &
VITE_PID=$!
sleep 3
if kill -0 $VITE_PID 2>/dev/null; then
  echo "VITE_RUNNING:$VITE_PID"
else
  echo "VITE_FAILED"
fi
