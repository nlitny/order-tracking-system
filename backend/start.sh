#!/bin/sh

echo "Waiting for database to be ready..."

# Wait for database to be available
until nc -z db 5432; do
  echo "Waiting for database connection..."
  sleep 2
done

echo "Database is ready!"

# Run database initialization and migrations
echo "Initializing database..."
node db/init.js

echo "Starting application..."
npm run dev
