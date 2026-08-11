#!/bin/bash
set -e

if [ ! -d node_modules ] || [ -z "$(ls -A node_modules 2>/dev/null)" ]; then
    echo "==> Installing npm dependencies..."
    npm install
fi

echo "==> Starting Vite development server..."
exec npm run dev
