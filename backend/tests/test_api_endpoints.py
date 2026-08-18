import pytest
from fastapi.testclient import TestClient


def get_auth_token(client: TestClient):
    reg_resp = client.post("/api/auth/register", json={
        "name": "Alex Traveler",
        "email": "alex.traveler@example.com",
        "password": "SecurePassword123!"
    })
    return reg_resp.json()["access_token"]


def test_trip_full_lifecycle(client: TestClient):
    token = get_auth_token(client)
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Generate Trip with AI
    trip_payload = {
        "origin": "Mumbai",
        "destination": "Goa",
        "start_date": "2026-09-10",
        "end_date": "2026-09-12",
        "budget": 30000.0,
        "travelers": 2,
        "trip_type": "Friends",
        "interests": ["Beaches", "Food", "Adventure"],
        "transportation": "Flight",
        "accommodation": "Standard"
    }
    gen_resp = client.post("/api/trips/generate", json=trip_payload, headers=headers)
    assert gen_resp.status_code == 201
    trip_data = gen_resp.json()
    trip_id = trip_data["id"]
    assert trip_data["destination"] == "Goa"
    assert trip_data["total_days"] == 3
    assert len(trip_data["itinerary_items"]) >= 6
    assert "budget_breakdown" in trip_data
    assert "weather_forecast" in trip_data

    # 2. Get User Trips List
    list_resp = client.get("/api/trips/", headers=headers)
    assert list_resp.status_code == 200
    assert len(list_resp.json()) >= 1

    # 3. Get Trip Details
    detail_resp = client.get(f"/api/trips/{trip_id}", headers=headers)
    assert detail_resp.status_code == 200
    assert detail_resp.json()["id"] == trip_id

    # 4. Add a new Itinerary Item
    item_payload = {
        "day": 2,
        "time": "Evening",
        "place": "Curlies Beach Shack Party",
        "description": "Sunset cocktails, trance music, and seaside dinner under the stars.",
        "estimated_cost": 1200.0,
        "activity_type": "Nightlife",
        "travel_time": "10 mins by auto",
        "latitude": 15.5800,
        "longitude": 73.7400
    }
    add_item_resp = client.post(f"/api/trips/{trip_id}/items/", json=item_payload, headers=headers)
    assert add_item_resp.status_code == 201
    new_item_id = add_item_resp.json()["id"]

    # 5. Modify Itinerary Item
    update_payload = {
        "estimated_cost": 1500.0,
        "description": "Updated sunset dinner with beach live band."
    }
    upd_resp = client.put(f"/api/trips/{trip_id}/items/{new_item_id}", json=update_payload, headers=headers)
    assert upd_resp.status_code == 200
    assert upd_resp.json()["estimated_cost"] == 1500.0

    # 6. Delete Itinerary Item
    del_item_resp = client.delete(f"/api/trips/{trip_id}/items/{new_item_id}", headers=headers)
    assert del_item_resp.status_code == 204

    # 7. Ask AI Chatbot about the trip
    chat_payload = {
        "trip_id": trip_id,
        "question": "What should I pack for this trip?"
    }
    chat_resp = client.post("/api/chat/ask", json=chat_payload, headers=headers)
    assert chat_resp.status_code == 200
    assert len(chat_resp.json()["answer"]) > 10

    # 8. Check Chat History
    hist_resp = client.get(f"/api/chat/history/{trip_id}", headers=headers)
    assert hist_resp.status_code == 200
    assert len(hist_resp.json()) == 1

    # 9. Delete Trip
    del_trip_resp = client.delete(f"/api/trips/{trip_id}", headers=headers)
    assert del_trip_resp.status_code == 204

    # 10. Confirm trip is gone
    get_del_resp = client.get(f"/api/trips/{trip_id}", headers=headers)
    assert get_del_resp.status_code == 404


def test_places_and_weather_endpoints(client: TestClient):
    # Places listing
    places_resp = client.get("/api/places/?destination=Goa")
    assert places_resp.status_code == 200
    assert len(places_resp.json()) > 0

    # Places recommendation
    rec_payload = {
        "destination": "Goa",
        "interests": ["Beaches", "Food"],
        "budget": 20000.0,
        "limit": 5
    }
    rec_resp = client.post("/api/places/recommend", json=rec_payload)
    assert rec_resp.status_code == 200
    assert len(rec_resp.json()) > 0
    assert "match_score" in rec_resp.json()[0]

    # Weather endpoint
    weather_resp = client.get("/api/weather/?city=Goa&days=5")
    assert weather_resp.status_code == 200
    assert len(weather_resp.json()) == 5
