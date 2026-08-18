from datetime import datetime, timezone, date
from sqlalchemy import Column, Integer, String, Float, Date, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database import Base


class Trip(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    origin = Column(String(150), nullable=False)
    destination = Column(String(150), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    budget = Column(Float, nullable=False)  # Total Budget in INR
    travelers = Column(Integer, default=1, nullable=False)
    trip_type = Column(String(50), default="Solo")  # Solo, Couple, Family, Friends
    interests = Column(JSON, default=list)  # ["Nature", "Food", "Adventure", "History", "Shopping", "Beaches"]
    transportation = Column(String(50), default="Flight")  # Flight, Train, Bus, Car, Any
    accommodation = Column(String(50), default="Standard")  # Budget, Standard, Luxury, Hostel, Resort
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    user = relationship("User", back_populates="trips")
    itinerary_items = relationship("ItineraryItem", back_populates="trip", cascade="all, delete-orphan", order_by="ItineraryItem.day, ItineraryItem.id")
    chat_messages = relationship("ChatHistory", back_populates="trip", cascade="all, delete-orphan")
