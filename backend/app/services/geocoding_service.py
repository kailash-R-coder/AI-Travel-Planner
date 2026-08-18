import math
import httpx
from typing import Tuple, Optional, Dict

# Pre-cached coordinates for major Indian & International travel hubs for instant zero-latency lookup
KNOWN_COORDINATES: Dict[str, Tuple[float, float]] = {
    "goa": (15.2993, 74.1240),
    "jaipur": (26.9124, 75.7873),
    "manali": (32.2432, 77.1892),
    "kerala": (10.8505, 76.2711),
    "munnar": (10.0889, 77.0595),
    "alleppey": (9.4981, 76.3388),
    "kochi": (9.9312, 76.2673),
    "varanasi": (25.3176, 82.9739),
    "ladakh": (34.1526, 77.5771),
    "leh": (34.1526, 77.5771),
    "rishikesh": (30.0869, 78.2676),
    "agra": (27.1767, 78.0081),
    "delhi": (28.6139, 77.2090),
    "mumbai": (19.0760, 72.8777),
    "bengaluru": (12.9716, 77.5946),
    "bangalore": (12.9716, 77.5946),
    "hyderabad": (17.3850, 78.4867),
    "kolkata": (22.5726, 88.3639),
    "chennai": (13.0827, 80.2707),
    "udaipur": (24.5854, 73.7125),
    "ooty": (11.4102, 76.6950),
    "darjeeling": (27.0410, 88.2663),
    "amritsar": (31.6340, 74.8723),
    "dubai": (25.2048, 55.2708),
    "paris": (48.8566, 2.3522),
    "bali": (-8.3405, 115.0920),
    "tokyo": (35.6762, 139.6503),
    "singapore": (1.3521, 103.8198),
    "bangkok": (13.7563, 100.5018),
    "london": (51.5074, -0.1278),
    "new york": (40.7128, -74.0060),
}


def geocode_city(city_name: str) -> Tuple[float, float]:
    """
    Resolves city or destination name to (latitude, longitude).
    Uses fast local cache first, then OpenStreetMap Nominatim with fallback.
    """
    clean_name = city_name.strip().lower()
    
    # Check known coordinates
    for key, coords in KNOWN_COORDINATES.items():
        if key in clean_name or clean_name in key:
            return coords

    # Try OpenStreetMap Nominatim API
    try:
        url = "https://nominatim.openstreetmap.org/search"
        headers = {"User-Agent": "AITravelPlanner-BTechProject/1.0"}
        params = {"q": city_name, "format": "json", "limit": 1}
        with httpx.Client(timeout=3.0) as client:
            resp = client.get(url, params=params, headers=headers)
            if resp.status_code == 200:
                results = resp.json()
                if results and len(results) > 0:
                    lat = float(results[0]["lat"])
                    lon = float(results[0]["lon"])
                    return lat, lon
    except Exception:
        pass

    # Default fallback: New Delhi coordinates
    return (28.6139, 77.2090)


def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculates great-circle distance between two geographic points using Haversine formula.
    """
    r = 6371.0  # Earth's radius in kilometers
    d_lat = math.radians(lat2 - lat1)
    d_lon = math.radians(lon2 - lon1)
    a = (math.sin(d_lat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(d_lon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(r * c, 2)


def estimate_transit_time(distance_km: float, mode: str = "Car") -> str:
    """Estimates human-readable travel time based on distance and transport mode."""
    if distance_km <= 2.0:
        return "10-15 mins (Walk / Auto)"
    elif distance_km <= 10.0:
        return f"{int(distance_km * 3)} mins (Taxi / Cab)"
    elif distance_km <= 50.0:
        return f"{int(distance_km * 2)} mins (Cab / Drive)"
    elif distance_km <= 300.0:
        hours = round(distance_km / 60.0, 1)
        return f"{hours} hrs (Train / Drive)"
    else:
        hours = round(distance_km / 500.0 + 1.5, 1)
        return f"{hours} hrs (Flight / Express Train)"
