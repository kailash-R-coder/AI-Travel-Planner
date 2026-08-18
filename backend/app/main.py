from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import init_db
from app.routers import (
    auth_router,
    trips_router,
    itinerary_router,
    places_router,
    weather_router,
    chat_router
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize DB tables and seed places
    init_db()
    yield
    # Shutdown


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="AI-Powered Personalized Travel Planner API for B.Tech AI & DS Project",
    lifespan=lifespan
)

# Configure CORS for React frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(auth_router, prefix=settings.API_V1_PREFIX)
app.include_router(trips_router, prefix=settings.API_V1_PREFIX)
app.include_router(itinerary_router, prefix=settings.API_V1_PREFIX)
app.include_router(places_router, prefix=settings.API_V1_PREFIX)
app.include_router(weather_router, prefix=settings.API_V1_PREFIX)
app.include_router(chat_router, prefix=settings.API_V1_PREFIX)


@app.get("/")
def root():
    return {
        "status": "online",
        "message": "Welcome to AI Travel Planner API",
        "docs_url": "/docs",
        "version": settings.VERSION
    }


@app.get("/health")
def health_check():
    return {"status": "healthy", "database": "connected"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
