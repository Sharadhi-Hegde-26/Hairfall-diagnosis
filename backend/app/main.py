import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.database import (
    close_database_connection,
    ensure_database_indexes,
    is_database_configured,
    ping_database,
)
from app.routes.assessment import router as assessment_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    if is_database_configured():
        await ensure_database_indexes()

    yield

    close_database_connection()


app = FastAPI(
    title="Hair Health AI Backend",
    description="Backend API for AI-powered hair health assessment",
    version="1.0.0",
    lifespan=lifespan,
)


frontend_origin = os.getenv("FRONTEND_ORIGIN")

if frontend_origin:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[frontend_origin],
        allow_credentials=True,
        allow_methods=["GET", "POST", "DELETE", "OPTIONS"],
        allow_headers=["*"],
    )


app.include_router(assessment_router)


@app.get("/")
def root():
    return {
        "message": "Hair Health AI Backend is running"
    }


@app.get("/health")
async def health_check():
    if not is_database_configured():
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "status": "degraded",
                "database": "not_configured",
            },
        )

    if not await ping_database():
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "status": "unhealthy",
                "database": "unavailable",
            },
        )

    return {
        "status": "healthy",
        "database": "connected",
    }
