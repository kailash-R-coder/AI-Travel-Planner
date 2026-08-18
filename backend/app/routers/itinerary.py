from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.trip import Trip
from app.models.itinerary import ItineraryItem
from app.schemas.itinerary import ItineraryItemCreate, ItineraryItemUpdate, ItineraryItemResponse
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/trips/{trip_id}/items", tags=["Itinerary Modification"])


def _verify_trip_ownership(trip_id: int, user_id: int, db: Session) -> Trip:
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == user_id).first()
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trip not found."
        )
    return trip


@router.post("/", response_model=ItineraryItemResponse, status_code=status.HTTP_201_CREATED)
def add_itinerary_item(
    trip_id: int,
    item_in: ItineraryItemCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add a custom activity or restaurant to the trip itinerary."""
    _verify_trip_ownership(trip_id, current_user.id, db)

    item = ItineraryItem(
        trip_id=trip_id,
        day=item_in.day,
        time=item_in.time,
        place=item_in.place.strip(),
        description=item_in.description.strip(),
        estimated_cost=item_in.estimated_cost,
        activity_type=item_in.activity_type or "Sightseeing",
        travel_time=item_in.travel_time or "15 mins",
        latitude=item_in.latitude,
        longitude=item_in.longitude
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/{item_id}", response_model=ItineraryItemResponse)
def update_itinerary_item(
    trip_id: int,
    item_id: int,
    item_update: ItineraryItemUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Modify a specific itinerary item."""
    _verify_trip_ownership(trip_id, current_user.id, db)

    item = db.query(ItineraryItem).filter(
        ItineraryItem.id == item_id,
        ItineraryItem.trip_id == trip_id
    ).first()

    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Itinerary item not found."
        )

    for field, value in item_update.model_dump(exclude_unset=True).items():
        if value is not None:
            setattr(item, field, value)

    db.commit()
    db.refresh(item)
    return item


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_itinerary_item(
    trip_id: int,
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a specific itinerary item."""
    _verify_trip_ownership(trip_id, current_user.id, db)

    item = db.query(ItineraryItem).filter(
        ItineraryItem.id == item_id,
        ItineraryItem.trip_id == trip_id
    ).first()

    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Itinerary item not found."
        )

    db.delete(item)
    db.commit()
    return None
