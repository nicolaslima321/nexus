#!/bin/bash

FRONTEND_DIR="$(pwd)/frontend"
BACKEND_DIR="$(pwd)/backend"

if [ -f "$FRONTEND_DIR/.env.example" ]; then
  cp "$FRONTEND_DIR/.env.example" "$FRONTEND_DIR/.env"
  echo "Created .env file in frontend directory."
else
  echo ".env.example file not found in frontend directory."
fi

if [ -f "$BACKEND_DIR/.env.example" ]; then
  cp "$BACKEND_DIR/.env.example" "$BACKEND_DIR/.env"
  echo "Created .env file in backend directory."
else
  echo ".env.example file not found in backend directory."
fi
