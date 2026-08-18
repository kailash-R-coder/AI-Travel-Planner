import pytest
from app.services.weather_service import get_weather_forecast
from app.services.geocoding_service import geocode_city, haversine_distance_km, estimate_transit_time
from app.services.rag_service import VectorSearchEngine, retrieve_relevant_places_rag
from app.services.recommender import HybridPlaceRecommender
from app.services.llm_service import LLMItineraryGenerator, answer_travel_chat
from app.utils.cost_estimator import calculate_budget_breakdown


def test_weather_service():
    forecast = get_weather_forecast(15.2993, 74.1240, days=5)
    assert len(forecast) == 5
    assert "temp_max" in forecast[0]
    assert "condition" in forecast[0]
    assert "precipitation_probability" in forecast[0]


def test_geocoding_service():
    lat, lon = geocode_city("Goa")
    assert round(lat, 1) == 15.3
    assert round(lon, 1) == 74.1

    dist = haversine_distance_km(15.2993, 74.1240, 19.0760, 72.8777)
    assert 400.0 < dist < 500.0

    transit_time = estimate_transit_time(5.0)
    assert "mins" in transit_time


def test_vector_search_and_rag(db_session):
    vec1 = VectorSearchEngine.generate_embedding("sunset beach seafood watersports")
    vec2 = VectorSearchEngine.generate_embedding("scenic beach party")
    vec3 = VectorSearchEngine.generate_embedding("snow mountain skiing himalayas")

    sim_1_2 = VectorSearchEngine.cosine_similarity(vec1, vec2)
    sim_1_3 = VectorSearchEngine.cosine_similarity(vec1, vec3)
    assert sim_1_2 > sim_1_3

    rag_results = retrieve_relevant_places_rag(
        db=db_session,
        destination="Goa",
        interests=["Beaches", "Food"],
        top_k=5
    )
    assert len(rag_results) > 0
    assert any("Baga" in p["name"] or "Aguada" in p["name"] for p in rag_results)


def test_hybrid_recommender(db_session):
    ranked = HybridPlaceRecommender.rank_places(
        db=db_session,
        destination="Jaipur",
        interests=["History", "Food"],
        total_budget=25000.0,
        total_days=3,
        travelers=2,
        weather_forecast=[{"condition": "Sunny", "is_rainy": False, "temp_max": 30.0}],
        top_k=5
    )
    assert len(ranked) > 0
    assert "match_score" in ranked[0]
    assert ranked[0]["match_score"] >= ranked[-1]["match_score"]
    assert "score_breakdown" in ranked[0]


def test_cost_estimator():
    breakdown = calculate_budget_breakdown(
        total_budget=50000.0,
        days=4,
        travelers=2,
        accommodation_type="Standard",
        transport_mode="Flight"
    )
    assert breakdown["total_budget"] == 50000.0
    assert breakdown["stay"] > 0
    assert breakdown["food"] > 0
    assert breakdown["activities"] > 0
    assert sum([
        breakdown["stay"], breakdown["food"], breakdown["activities"],
        breakdown["transportation"], breakdown["emergency_buffer"]
    ]) == pytest.approx(50000.0)


def test_llm_grounded_generator(db_session):
    ranked = HybridPlaceRecommender.rank_places(
        db=db_session,
        destination="Goa",
        interests=["Beaches"],
        total_budget=20000.0,
        total_days=2,
        travelers=1,
        weather_forecast=[{"condition": "Clear sky", "is_rainy": False, "temp_max": 31.0}],
        top_k=6
    )
    items = LLMItineraryGenerator.generate_grounded_itinerary(
        origin="Mumbai",
        destination="Goa",
        days=2,
        travelers=1,
        trip_type="Solo",
        budget=20000.0,
        interests=["Beaches"],
        transportation="Flight",
        accommodation="Standard",
        ranked_places=ranked,
        weather_forecast=[{"condition": "Clear sky", "is_rainy": False, "temp_max": 31.0}]
    )
    assert len(items) == 6
    assert items[0]["time"] == "Morning"
    assert items[1]["time"] == "Afternoon"
    assert items[2]["time"] == "Evening"
    assert items[3]["time"] == "Morning"


def test_travel_chat():
    ans = answer_travel_chat("What clothes should I pack?", destination="Manali")
    assert "pack" in ans.lower() or "manali" in ans.lower()
