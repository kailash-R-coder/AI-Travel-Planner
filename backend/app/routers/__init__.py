from app.routers.auth import router as auth_router
from app.routers.trips import router as trips_router
from app.routers.itinerary import router as itinerary_router
from app.routers.places import router as places_router
from app.routers.weather import router as weather_router
from app.routers.chat import router as chat_router

__all__ = [
    "auth_router",
    "trips_router",
    "itinerary_router",
    "places_router",
    "weather_router",
    "chat_router"
]
