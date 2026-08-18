from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.place import Place
from app.schemas.place import PlaceResponse, PlaceRecommendQuery
from app.services.recommender import HybridPlaceRecommender
from app.services.geocoding_service import geocode_city
from app.services.weather_service import get_weather_forecast

router = APIRouter(prefix="/places", tags=["Places & Recommendations"])


@router.get("/", response_model=List[PlaceResponse])
def get_places(
    destination: Optional[str] = Query(None, description="Filter places by destination/city"),
    category: Optional[str] = Query(None, description="Filter by category (Nature, Food, etc.)"),
    db: Session = Depends(get_db)
):
    """Retrieve catalog of verified attractions with optional destination and category filters."""
    query = db.query(Place)
    if destination:
        query = query.filter(Place.location.ilike(f"%{destination.strip()}%"))
    if category:
        query = query.filter(Place.category.ilike(f"%{category.strip()}%"))
    return query.all()


@router.post("/recommend", response_model=List[PlaceResponse])
def recommend_places(
    query: PlaceRecommendQuery,
    db: Session = Depends(get_db)
):
    """
    Executes the Hybrid Recommendation Model to rank attractions in the requested destination.
    Takes into account interest tags, budget, and live weather conditions.
    """
    lat, lon = geocode_city(query.destination)
    weather_forecast = get_weather_forecast(lat, lon, days=3)

    budget = query.budget if query.budget else 25000.0
    ranked = HybridPlaceRecommender.rank_places(
        db=db,
        destination=query.destination,
        interests=query.interests,
        total_budget=budget,
        total_days=3,
        travelers=1,
        weather_forecast=weather_forecast,
        top_k=query.limit
    )
    return [PlaceResponse.model_validate(p) for p in ranked]


@router.get("/{place_id}", response_model=PlaceResponse)
def get_place_detail(place_id: int, db: Session = Depends(get_db)):
    """Retrieve details for a single tourist attraction."""
    place = db.query(Place).filter(Place.id == place_id).first()
    if not place:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Place not found."
        )
    return place
