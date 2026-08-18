from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class ItineraryItem(Base):
    __tablename__ = "itinerary_items"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    trip_id = Column(Integer, ForeignKey("trips.id", ondelete="CASCADE"), nullable=False, index=True)
    day = Column(Integer, nullable=False)  # Day 1, Day 2, etc.
    time = Column(String(50), nullable=False)  # Morning, Afternoon, Evening
    place = Column(String(200), nullable=False)  # Place name / Restaurant name
    description = Column(Text, nullable=False)
    estimated_cost = Column(Float, default=0.0)  # Estimated cost in INR
    activity_type = Column(String(50), default="Sightseeing")  # Sightseeing, Dining, Adventure, Relaxation, Culture, Shopping
    travel_time = Column(String(50), default="15-30 mins")  # e.g., "20 mins by taxi"
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)

    # Relationships
    trip = relationship("Trip", back_populates="itinerary_items")
