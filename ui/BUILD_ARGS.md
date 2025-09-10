# Docker Build Arguments for Railway Deployment

This document explains how to pass environment variables to the Docker build process in Railway.

## Environment Variables for Railway

### UI Service (Frontend)

In Railway, set these **Build Arguments** (not just environment variables):

```
NEXT_PUBLIC_API=https://your-api-service.railway.app
NEXT_PUBLIC_BACKEND_URL=https://your-api-service.railway.app
NEXT_PUBLIC_IS_LOCAL=false
```

### API Service (Backend)

In Railway, set these **Environment Variables**:

```
LINK=https://your-ui-service.railway.app
SENDGRID_API_KEY=your_sendgrid_key
SPRING_DATASOURCE_URL=your_postgres_url
SPRING_DATASOURCE_USERNAME=your_db_user
SPRING_DATASOURCE_PASSWORD=your_db_password
```

## Railway Configuration

### Option 1: Using Railway Dashboard

1. Go to your UI service in Railway
2. Navigate to **Variables** tab
3. Add these as **Build-time variables**:
   - `NEXT_PUBLIC_API`
   - `NEXT_PUBLIC_BACKEND_URL`
   - `NEXT_PUBLIC_IS_LOCAL`

### Option 2: Using railway.json

Create a `railway.json` file in your UI directory:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "dockerfile",
    "buildCommand": "docker build --build-arg NEXT_PUBLIC_API=$NEXT_PUBLIC_API --build-arg NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL --build-arg NEXT_PUBLIC_IS_LOCAL=$NEXT_PUBLIC_IS_LOCAL -t ui ."
  }
}
```

## Local Development

For local development, create a `.env.local` file in the UI directory:

```
NEXT_PUBLIC_API=http://localhost:8080
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
NEXT_PUBLIC_IS_LOCAL=true
```

## Dockerfile Changes

The Dockerfile now accepts build arguments and sets them as environment variables during the build process, ensuring Next.js can access them when creating the production bundle.
