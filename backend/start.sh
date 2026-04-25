#!/bin/bash 

# Download and install cloudflared
wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -O cloudflared
chmod +x cloudflared

# Start cloudflared tunnel in bg 
./cloudflared tunnel --no-autoupdate run --token $CLOUDFLARE_TUNNEL_TOKEN &

# Start FastAPI
uvicorn main:app --host 0.0.0.0 --port 8000