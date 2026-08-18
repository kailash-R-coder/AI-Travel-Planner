from datetime import date, datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.trip import Trip
from app.models.itinerary import ItineraryItem
from app.schemas.trip import TripGenerateRequest, TripResponse, TripSummary, TripUpdate
from app.services.auth_service import get_current_user
from app.services.geocoding_service import geocode_city
from app.services.weather_service import get_weather_forecast
from app.services.recommender import HybridPlaceRecommender
from app.services.llm_service import LLMItineraryGenerator
from app.utils.cost_estimator import calculate_budget_breakdown

router = APIRouter(prefix="/trips", tags=["Trips & Itineraries"])


def _populate_trip_response_metadata(trip: Trip) -> TripResponse:
    """Helper to attach total_days, weather, budget breakdown, and estimated costs to TripResponse."""
    num_days = max(1, (trip.end_date - trip.start_date).days + 1)
    
    # Geocode destination & fetch live weather forecast
    lat, lon = geocode_city(trip.destination)
    weather = get_weather_forecast(lat, lon, days=num_days)
    
    # Compute budget breakdown
    breakdown = calculate_budget_breakdown(
        total_budget=trip.budget,
        days=num_days,
        travelers=trip.travelers,
        accommodation_type=trip.accommodation,
        transport_mode=trip.transportation
    )
    
    # Sum item costs
    total_items_cost = sum(item.estimated_cost for item in trip.itinerary_items)
    
    resp = TripResponse.model_validate(trip)
    resp.total_days = num_days
    resp.estimated_total_cost = round(total_items_cost + breakdown["stay"] + breakdown["transportation"], 2)
    resp.weather_forecast = weather
    resp.budget_breakdown = {
        "stay": breakdown["stay"],
        "food": breakdown["food"],
        "activities": breakdown["activities"],
        "transportation": breakdown["transportation"],
        "emergency_buffer": breakdown["emergency_buffer"]
    }
    return resp


@router.post("/generate", response_model=TripResponse, status_code=status.HTTP_201_CREATED)
def generate_and_save_trip(
    trip_req: TripGenerateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    AI Generation Endpoint:
    1. Validates inputs and dates.
    2. Geocodes destination & queries live 7-day weather.
    3. Runs RAG + Multi-Criteria Recommender to rank attractions.
    4. Invokes LLM / Grounded Engine to construct day-by-day Morning/Afternoon/Evening schedule.
    5. Saves Trip and ItineraryItem records in Database.
    6. Returns complete hydrated Trip with weather and budget analytics.
    """
    if trip_req.end_date < trip_req.start_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="End date cannot be earlier than start date."
        )

    num_days = max(1, (trip_req.end_date - trip_req.start_date).days + 1)
    if num_days > 30:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Trip duration cannot exceed 30 days."
        )

    # 1. Geocoding & Weather Forecast
    lat, lon = geocode_city(trip_req.destination)
    weather_forecast = get_weather_forecast(lat, lon, days=num_days)

    # 2. Multi-Criteria Recommender Ranking
    ranked_places = HybridPlaceRecommender.rank_places(
        db=db,
        destination=trip_req.destination,
        interests=trip_req.interests,
        total_budget=trip_req.budget,
        total_days=num_days,
        travelers=trip_req.travelers,
        weather_forecast=weather_forecast,
        top_k=num_days * 3
    )

    # 3. LLM / Grounded Synthesis
    generated_items_data = LLMItineraryGenerator.generate_grounded_itinerary(
        origin=trip_req.origin,
        destination=trip_req.destination,
        days=num_days,
        travelers=trip_req.travelers,
        trip_type=trip_req.trip_type,
        budget=trip_req.budget,
        interests=trip_req.interests,
        transportation=trip_req.transportation,
        accommodation=trip_req.accommodation,
        ranked_places=ranked_places,
        weather_forecast=weather_forecast
    )

    # 4. Save Trip Record to Database
    new_trip = Trip(
        user_id=current_user.id,
        origin=trip_req.origin.strip(),
        destination=trip_req.destination.strip(),
        start_date=trip_req.start_date,
        end_date=trip_req.end_date,
        budget=trip_req.budget,
        travelers=trip_req.travelers,
        trip_type=trip_req.trip_type,
        interests=trip_req.interests,
        transportation=trip_req.transportation,
        accommodation=trip_req.accommodation
    )
    db.add(new_trip)
    db.commit()
    db.refresh(new_trip)

    # 5. Save Itinerary Items
    for item in generated_items_data:
        itinerary_item = ItineraryItem(
            trip_id=new_trip.id,
            day=item["day"],
            time=item["time"],
            place=item["place"],
            description=item["description"],
            estimated_cost=item.get("estimated_cost", 0.0),
            activity_type=item.get("activity_type", "Sightseeing"),
            travel_time=item.get("travel_time", "20 mins"),
            latitude=item.get("latitude"),
            longitude=item.get("longitude")
        )
        db.add(itinerary_item)

    db.commit()
    db.refresh(new_trip)

    return _populate_trip_response_metadata(new_trip)


@router.get("/", response_model=List[TripSummary])
def get_user_trips(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve all saved trips for the authenticated user."""
    trips = db.query(Trip).filter(Trip.user_id == current_user.id).order_by(Trip.created_at.desc()).all()
    
    summaries = []
    for t in trips:
        num_days = max(1, (t.end_date - t.start_date).days + 1)
        summaries.append(
            TripSummary(
                id=t.id,
                origin=t.origin,
                destination=t.destination,
                start_date=t.start_date,
                end_date=t.end_date,
                budget=t.budget,
                travelers=t.travelers,
                trip_type=t.trip_type,
                created_at=t.created_at,
                total_days=num_days,
                total_items_count=len(t.itinerary_items)
            )
        )
    return summaries


@router.get("/{trip_id}", response_model=TripResponse)
def get_trip_details(
    trip_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve a single trip with full day-by-day itinerary, map coordinates, and weather."""
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trip not found."
        )
    return _populate_trip_response_metadata(trip)


@router.put("/{trip_id}", response_model=TripResponse)
def update_trip(
    trip_id: int,
    update_data: TripUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update trip details (destination, dates, budget, etc.)."""
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trip not found."
        )

    for field, value in update_data.model_dump(exclude_unset=True).items():
        setattr(trip, field, value)

    db.commit()
    db.refresh(trip)
    return _populate_trip_response_metadata(trip)


@router.delete("/{trip_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_trip(
    trip_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a saved trip and its associated itinerary items and chat history."""
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trip not found."
        )
    db.delete(trip)
    db.commit()
    return None
