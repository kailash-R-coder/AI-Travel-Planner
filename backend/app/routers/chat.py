from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.trip import Trip
from app.models.chat import ChatHistory
from app.schemas.chat import ChatRequest, ChatResponse, ChatHistoryItem
from app.services.auth_service import get_current_user
from app.services.llm_service import answer_travel_chat

router = APIRouter(prefix="/chat", tags=["AI Travel Chatbot"])


@router.post("/ask", response_model=ChatResponse)
def ask_travel_ai(
    req: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Sends user travel question to the AI Assistant.
    Retrieves grounded trip context if trip_id is provided, saves conversation to history.
    """
    trip_context = None
    destination_str = "your destination"

    if req.trip_id:
        trip = db.query(Trip).filter(Trip.id == req.trip_id, Trip.user_id == current_user.id).first()
        if trip:
            destination_str = trip.destination
            trip_context = {
                "destination": trip.destination,
                "origin": trip.origin,
                "budget": trip.budget,
                "travelers": trip.travelers,
                "trip_type": trip.trip_type,
                "interests": trip.interests,
                "items": [
                    {"day": i.day, "time": i.time, "place": i.place, "cost": i.estimated_cost}
                    for i in trip.itinerary_items
                ]
            }

    # Generate answer using grounded AI engine
    answer = answer_travel_chat(
        question=req.question,
        trip_context=trip_context,
        destination=destination_str
    )

    # Persist in Chat History
    chat_record = ChatHistory(
        user_id=current_user.id,
        trip_id=req.trip_id,
        question=req.question.strip(),
        answer=answer.strip()
    )
    db.add(chat_record)
    db.commit()
    db.refresh(chat_record)

    return ChatResponse(
        id=chat_record.id,
        question=chat_record.question,
        answer=chat_record.answer,
        trip_id=chat_record.trip_id,
        created_at=chat_record.created_at
    )


@router.get("/history/{trip_id}", response_model=List[ChatHistoryItem])
def get_trip_chat_history(
    trip_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve chat history for a specific trip."""
    history = db.query(ChatHistory).filter(
        ChatHistory.trip_id == trip_id,
        ChatHistory.user_id == current_user.id
    ).order_by(ChatHistory.created_at.asc()).all()
    return history
