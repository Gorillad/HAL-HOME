#!/bin/bash
# ── HAL Designer Editor Launcher ─────────────────────────────
# Double-click this file on your Mac to start the server
# and open the Designer Editor in your browser automatically.
# ─────────────────────────────────────────────────────────────

cd "$(dirname "$0")"

echo "Starting HAL Designer Editor..."

# Kill any old server on port 4242
lsof -ti :4242 | xargs kill -9 2>/dev/null
sleep 1

# Start the server in the background
nohup node server/index.js > /tmp/hal-server.log 2>&1 &
SERVER_PID=$!
echo "Server starting (PID $SERVER_PID)..."

# Wait until the server is ready (up to 10 seconds)
for i in {1..20}; do
  sleep 0.5
  if lsof -i :4242 -sTCP:LISTEN &>/dev/null; then
    echo "Server is ready!"
    break
  fi
done

# Open the Designer Editor in the default browser
open "http://localhost:4242/editor/designer.html?design=woolf"

echo ""
echo "✓ Designer Editor is open at http://localhost:4242/editor/designer.html?design=woolf"
echo "  Server log: /tmp/hal-server.log"
echo "  Press Ctrl+C here to stop the server when done."
echo ""

# Keep the terminal open and show server logs live
tail -f /tmp/hal-server.log
