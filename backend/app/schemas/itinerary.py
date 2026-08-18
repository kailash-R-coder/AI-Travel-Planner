from pydantic import BaseModel, Field, ConfigDict
from typing import Optional


class ItineraryItemBase(BaseModel):
    day: int = Field(..., ge=1, description="Day number of itinerary")
    time: str = Field(..., description="Morning, Afternoon, or Evening")
    place: str = Field(..., min_length=2, description="Place or restaurant name")
    description: str = Field(..., min_length=5, description="Activity details and tips")
    estimated_cost: float = Field(default=0.0, ge=0.0, description="Estimated cost in INR")
    activity_type: Optional[str] = Field(default="Sightseeing", description="Category of activity")
    travel_time: Optional[str] = Field(default="15-30 mins", description="Transit time estimate")
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class ItineraryItemCreate(ItineraryItemBase):
    pass


class ItineraryItemUpdate(BaseModel):
    day: Optional[int] = None
    time: Optional[str] = None
    place: Optional[str] = None
    description: Optional[str] = None
    estimated_cost: Optional[float] = None
    activity_type: Optional[str] = None
    travel_time: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class ItineraryItemResponse(ItineraryItemBase):
    id: int
    trip_id: int

    model_config = ConfigDict(from_attributes=True)
