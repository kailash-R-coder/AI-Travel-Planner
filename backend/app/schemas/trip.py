from datetime import date, datetime
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Dict, Any
from app.schemas.itinerary import ItineraryItemResponse


class TripGenerateRequest(BaseModel):
    origin: str = Field(..., min_length=2, max_length=150, description="Starting location/city")
    destination: str = Field(..., min_length=2, max_length=150, description="Destination city/region")
    start_date: date = Field(..., description="Trip start date (YYYY-MM-DD)")
    end_date: date = Field(..., description="Trip end date (YYYY-MM-DD)")
    budget: float = Field(..., gt=0, description="Total trip budget in INR")
    travelers: int = Field(default=1, ge=1, le=50, description="Total number of travelers")
    trip_type: str = Field(default="Solo", description="Solo, Couple, Family, or Friends")
    interests: List[str] = Field(default_factory=list, description="List of interests (Nature, Food, Adventure, History, Shopping, Beaches)")
    transportation: str = Field(default="Flight", description="Preferred transport mode (Flight, Train, Bus, Car)")
    accommodation: str = Field(default="Standard", description="Accommodation tier (Budget, Standard, Luxury, Hostel, Resort)")


class TripCreate(TripGenerateRequest):
    pass


class TripUpdate(BaseModel):
    origin: Optional[str] = None
    destination: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    budget: Optional[float] = None
    travelers: Optional[int] = None
    trip_type: Optional[str] = None
    interests: Optional[List[str]] = None
    transportation: Optional[str] = None
    accommodation: Optional[str] = None


class TripResponse(BaseModel):
    id: int
    user_id: int
    origin: str
    destination: str
    start_date: date
    end_date: date
    budget: float
    travelers: int
    trip_type: str
    interests: List[str]
    transportation: str
    accommodation: str
    created_at: datetime
    itinerary_items: List[ItineraryItemResponse] = []
    
    total_days: Optional[int] = None
    estimated_total_cost: Optional[float] = None
    weather_forecast: Optional[List[Dict[str, Any]]] = None
    budget_breakdown: Optional[Dict[str, float]] = None

    model_config = ConfigDict(from_attributes=True)


class TripSummary(BaseModel):
    id: int
    origin: str
    destination: str
    start_date: date
    end_date: date
    budget: float
    travelers: int
    trip_type: str
    created_at: datetime
    total_days: int
    total_items_count: int

    model_config = ConfigDict(from_attributes=True)
