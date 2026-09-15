# JOY TRUE PROFILE — Production Deployment Guide

## 1. Target Environment
- **Host**: cPanel / Cloud Linux VPS (Passenger WSGI + Node/Vite Client)
- **Live URL**: https://test2.joycorporatesolutions.com/
- **Backend Port**: 8000 (Internal FastAPI)
- **Python Version**: 3.10+
- **Node.js Version**: 20+

## 2. Deployment Steps

### Frontend Build
`powershell
npm run build
`
The compiled assets will be placed in dist/.

### Backend Deployment via Passenger WSGI
Ensure passenger_wsgi.py points to the FastAPI ASGI application using 2wsgi:
`python
from a2wsgi import ASGIMiddleware
from backend.app.main import app
application = ASGIMiddleware(app)
`

### PostgreSQL Migration
Run schema migrations:
`powershell
python backend/app/migrate_production_schema.py
`

### Verification & Health Check
Test the live API health endpoint:
`powershell
curl -I https://test2.joycorporatesolutions.com/api/docs
`
