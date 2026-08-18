from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List


class PlaceBase(BaseModel):
    name: str
    category: str  # Nature, Food, Adventure, History, Shopping, Beaches
    location: str  # City / Area
    description: str
    rating: float = Field(default=4.5, ge=1.0, le=5.0)
    avg_cost: float = Field(default=0.0, ge=0.0)
    latitude: float
    longitude: float
    best_time: Optional[str] = "All Year"
    tags: List[str] = Field(default_factory=list)


class PlaceCreate(PlaceBase):
    pass


class PlaceResponse(PlaceBase):
    id: int
    match_score: Optional[float] = None

    model_config = ConfigDict(from_attributes=True)


class PlaceRecommendQuery(BaseModel):
    destination: str
    interests: List[str] = Field(default_factory=list)
    budget: Optional[float] = None
    weather_condition: Optional[str] = None
    limit: int = Field(default=10, ge=1, le=50)
