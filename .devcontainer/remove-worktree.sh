#!/bin/bash

set -e

if [ -z "$1" ]; then
    echo "Usage: $0 <base-name>"
    echo "Example: $0 feature-xyz"
    exit 1
fi

BASE_NAME="$1"
WORKTREE_AND_BRANCH_NAME="worktree-$BASE_NAME"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
WORKTREE_DIR="$(dirname "$PROJECT_ROOT")/worktree/$WORKTREE_AND_BRANCH_NAME"

if [ ! -d "$WORKTREE_DIR" ]; then
    echo "❌ Worktree directory not found: $WORKTREE_DIR"
    echo "Pruning stale git worktrees just in case..."
    cd "$PROJECT_ROOT"
    git worktree prune
    exit 0
fi

echo "🗑️  Cleaning up worktree and branch: $WORKTREE_AND_BRANCH_NAME"
echo "📍 Location: $WORKTREE_DIR"

# Stop development server by finding its PID via the worktree path
echo "🛑 Stopping development server..."
VITE_PID=$(pgrep -f "$WORKTREE_AND_BRANCH_NAME.*vite" || true)
if [ -n "$VITE_PID" ]; then
    echo "Found Vite process with PID: $VITE_PID. Terminating..."
    kill -9 "$VITE_PID"
    echo "✅ Development server stopped."
else
    echo "✅ No running Vite process found for this worktree."
fi

# Stop Docker containers
echo "🐳 Stopping Docker containers..."
if [ -f "$WORKTREE_DIR/.devcontainer/docker-compose.worktree.yml" ]; then
    cd "$WORKTREE_DIR"
    docker compose -f .devcontainer/docker-compose.worktree.yml --env-file apps/web/.env down --remove-orphans
    echo "✅ Docker containers stopped."
else
    echo "⚠️  docker-compose file not found, skipping docker shutdown."
fi

# Clean up /etc/hosts entry
HOSTS_DOMAIN="local.$WORKTREE_AND_BRANCH_NAME.govdo.com"
HOSTS_ENTRY="127.0.0.1 $HOSTS_DOMAIN"
if grep -q "$HOSTS_DOMAIN" /etc/hosts; then
    echo "🔑 Removing hosts entry for $HOSTS_DOMAIN... (requires sudo)"
    if ! sudo sed -i.bak "/$HOSTS_ENTRY/d" /etc/hosts; then
       echo "❌ Failed to remove hosts entry. You may need to remove it manually."
    else
       echo "✅ Hosts entry removed."
    fi
fi

# Return to project root to manage git objects
cd "$PROJECT_ROOT"

# Remove the worktree directory and associated git metadata
echo "🌳 Removing git worktree..."
git worktree remove "$WORKTREE_DIR"

# Attempt to delete the branch
echo "🌿 Deleting branch '$WORKTREE_AND_BRANCH_NAME'..."
if git rev-parse --verify "refs/heads/$WORKTREE_AND_BRANCH_NAME" >/dev/null 2>&1; then
    if git branch -d "$WORKTREE_AND_BRANCH_NAME"; then
        echo "✅ Branch '$WORKTREE_AND_BRANCH_NAME' deleted successfully."
    else
        echo "⚠️  Branch '$WORKTREE_AND_BRANCH_NAME' has unmerged changes and was not deleted."
        echo "   To force delete it, run: git branch -D $WORKTREE_AND_BRANCH_NAME"
    fi
else
    echo "✅ Branch '$WORKTREE_AND_BRANCH_NAME' does not exist."
fi

echo ""
echo "🎉 Worktree for '$BASE_NAME' cleanup complete!" 