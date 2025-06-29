#!/bin/bash

set -e

WORKTREE_NAME="$1"

if [ -z "$WORKTREE_NAME" ]; then
    echo "Usage: $0 <worktree-name>"
    echo "Example: $0 feature-branch"
    exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
WORKTREE_DIR="$(dirname "$PROJECT_ROOT")/worktree/$WORKTREE_NAME"

echo "🌳 Creating worktree: $WORKTREE_NAME"
echo "📍 Location: $WORKTREE_DIR"
echo "🏠 Project root: $PROJECT_ROOT"

if [ -d "$WORKTREE_DIR" ]; then
    echo "❌ Worktree directory already exists: $WORKTREE_DIR"
    exit 1
fi

mkdir -p "$(dirname "$WORKTREE_DIR")"

echo "🔀 Adding git worktree..."
cd "$PROJECT_ROOT"
git worktree add "$WORKTREE_DIR" "$WORKTREE_NAME" 2>/dev/null || {
    echo "⚠️  Branch '$WORKTREE_NAME' doesn't exist. Creating new branch..."
    git worktree add -b "$WORKTREE_NAME" "$WORKTREE_DIR"
}

echo "📋 Copying .env file..."
if [ -f "$PROJECT_ROOT/apps/web/.env" ]; then
    cp "$PROJECT_ROOT/apps/web/.env" "$WORKTREE_DIR/apps/web/.env"
    echo "✅ .env file copied successfully"
    
    echo "🔧 Updating APP_URL for worktree..."
    sed -i '' "s|APP_URL=.*|APP_URL=http://local.$WORKTREE_NAME.govdo.com|" "$WORKTREE_DIR/apps/web/.env"
    echo "✅ APP_URL updated to http://local.$WORKTREE_NAME.govdo.com"
    
    echo "🏷️ Adding VHOST_NAME to .env..."
    echo "VHOST_NAME=$WORKTREE_NAME" >> "$WORKTREE_DIR/apps/web/.env"
    echo "✅ VHOST_NAME=$WORKTREE_NAME added to .env"
else
    echo "⚠️  Warning: .env file not found at $PROJECT_ROOT/apps/web/.env"
fi

echo "📁 Changing to worktree directory..."
cd "$WORKTREE_DIR"

echo "🌐 Adding hosts entry for local.$WORKTREE_NAME.govdo.com..."
HOSTS_ENTRY="127.0.0.1 local.$WORKTREE_NAME.govdo.com"
if ! grep -q "local.$WORKTREE_NAME.govdo.com" /etc/hosts; then
    echo "Adding: $HOSTS_ENTRY"
    echo "This requires sudo access to modify /etc/hosts..."
    echo "$HOSTS_ENTRY" | sudo tee -a /etc/hosts > /dev/null
    echo "✅ Hosts entry added successfully"
else
    echo "✅ Hosts entry already exists"
fi

echo "📦 Installing npm dependencies..."
cd apps/web
npm install

echo "🚀 Starting development server..."
npm run dev &
DEV_SERVER_PID=$!
echo "Development server started with PID: $DEV_SERVER_PID"

cd "$WORKTREE_DIR"

echo "🐳 Starting Docker containers..."
docker compose -f .devcontainer/docker-compose.worktree.yml --env-file apps/web/.env up -d --remove-orphans app

echo "⏳ Waiting for containers to be ready..."
sleep 10

echo "🎼 Installing Composer dependencies..."
docker compose -f .devcontainer/docker-compose.worktree.yml exec app composer install

echo ""
echo "🎉 Worktree setup complete!"
echo "📍 Worktree location: $WORKTREE_DIR"
echo "🌐 Development server PID: $DEV_SERVER_PID"
echo ""
echo "To stop the development server:"
echo "  kill -9 $DEV_SERVER_PID"
echo ""
echo "To stop Docker containers:"
echo "  cd $WORKTREE_DIR"
echo "  docker compose -f .devcontainer/docker-compose.worktree.yml down"
echo ""
echo "To remove this worktree when done:"
echo "  git worktree remove $WORKTREE_DIR"