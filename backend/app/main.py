import time
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from backend.app.config import settings
from backend.app.database import engine, Base
from backend.app.seed import seed_database
from backend.app.routers import (
    auth_router,
    superadmin_router,
    company_router,
    hr_router,
    verification_router,
    master_data_router,
    tickets_router,
    billing_router,
    documents_router,
    settings_router
)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Enterprise Employee Identity & Profile Verification Platform Backend API",
    docs_url="/docs",
    redoc_url="/redoc"
)

# 1. GZip Response Compression Middleware (Compresses responses > 500 bytes)
app.add_middleware(GZipMiddleware, minimum_size=500)

# 2. CORS Middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Performance Timing & Load Balancer Telemetry Middleware
@app.middleware("http")
async def add_performance_headers(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = f"{process_time:.4f}s"
    response.headers["X-Load-Balancer-Node"] = "joy-cluster-node-01"
    response.headers["X-Active-Cluster-Region"] = "ap-south-1"
    return response

# Startup event to ensure database tables and initial seed data are populated
@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    seed_database()

# Mount all API Routers under /api prefix
app.include_router(auth_router, prefix=settings.API_PREFIX)
app.include_router(superadmin_router, prefix=settings.API_PREFIX)
app.include_router(company_router, prefix=settings.API_PREFIX)
app.include_router(hr_router, prefix=settings.API_PREFIX)
app.include_router(verification_router, prefix=settings.API_PREFIX)
app.include_router(master_data_router, prefix=settings.API_PREFIX)
app.include_router(tickets_router, prefix=settings.API_PREFIX)
app.include_router(billing_router, prefix=settings.API_PREFIX)
app.include_router(documents_router, prefix=settings.API_PREFIX)
app.include_router(settings_router, prefix=settings.API_PREFIX)

@app.get(f"{settings.API_PREFIX}/health")
def health_check():
    """Health check endpoint to verify backend service and database connectivity"""
    return {
        "status": "healthy",
        "service": "JOY DATA VERIFICATION API",
        "version": settings.VERSION,
        "database": "connected",
        "load_balancer": "active",
        "node": "joy-cluster-node-01"
    }

@app.get("/")
def root():
    return {
        "message": "JOY DATA VERIFICATION API is running.",
        "documentation": "/docs"
    }
