from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional


class ChatRequest(BaseModel):
    trip_id: Optional[int] = None
    question: str = Field(..., min_length=1, max_length=2000, description="User's query to travel AI")


class ChatResponse(BaseModel):
    id: Optional[int] = None
    question: str
    answer: str
    trip_id: Optional[int] = None
    created_at: Optional[datetime] = None


class ChatHistoryItem(BaseModel):
    id: int
    user_id: int
    trip_id: Optional[int] = None
    question: str
    answer: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
