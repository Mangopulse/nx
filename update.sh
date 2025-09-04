#!/bin/bash
set -e

cd "$(dirname "$0")"

echo "📥 Pulling latest code from Git..."
git checkout main
git pull origin main

echo "🧱 Building Next.js frontend outside Docker..."
cd ui
npm install
npm run build
cd ..

echo "🛠 Building Java backend JAR outside Docker..."
cd api
mvn clean package -DskipTests
cd ..

echo "🐳 Rebuilding Docker containers..."
docker compose build

echo "🚀 Restarting containers..."
docker compose up -d

echo "✅ Deployment complete."
