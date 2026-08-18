from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Query
from app.services.geocoding_service import geocode_city
from app.services.weather_service import get_weather_forecast

router = APIRouter(prefix="/weather", tags=["Live Weather"])


@router.get("/", response_model=List[Dict[str, Any]])
def get_city_weather(
    city: Optional[str] = Query(None, description="City name to fetch weather for"),
    lat: Optional[float] = Query(None, description="Latitude"),
    lon: Optional[float] = Query(None, description="Longitude"),
    days: int = Query(7, ge=1, le=14, description="Forecast days")
):
    """Retrieve live weather forecast from Open-Meteo API for given city or coordinates."""
    if lat is None or lon is None:
        if not city:
            city = "New Delhi"
        lat, lon = geocode_city(city)

    return get_weather_forecast(lat, lon, days=days)
