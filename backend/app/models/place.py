from sqlalchemy import Column, Integer, String, Float, Text, JSON
from app.database import Base


class Place(Base):
    __tablename__ = "places"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(200), nullable=False, index=True)
    category = Column(String(100), nullable=False, index=True)  # Nature, Food, Adventure, History, Shopping, Beaches
    location = Column(String(150), nullable=False, index=True)  # City / Region name (e.g. "Goa", "Jaipur", "Manali")
    description = Column(Text, nullable=False)
    rating = Column(Float, default=4.5)  # 1.0 - 5.0
    avg_cost = Column(Float, default=0.0)  # Average entry/activity/meal cost in INR
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    best_time = Column(String(100), default="All Year")  # e.g. "Sunset", "Morning", "Winter"
    tags = Column(JSON, default=list)  # ["heritage", "photography", "scenic", "beach"]
    embedding = Column(JSON, nullable=True)  # Normalized vector embedding array for semantic similarity
