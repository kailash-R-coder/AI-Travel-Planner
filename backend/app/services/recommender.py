import math
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.place import Place
from app.services.rag_service import retrieve_relevant_places_rag


class HybridPlaceRecommender:
    """
    Multi-Criteria Hybrid Recommendation Engine:
    Ranks tourist attractions and activities based on:
    1. User Interests (Semantic & Category Matching)
    2. Budget Allowance (Cost Suitability Function)
    3. Live Weather Conditions (Indoor vs Outdoor Feasibility)
    4. Popularity / Historical Rating
    """

    # Weights configuration
    W_INTEREST = 0.35
    W_BUDGET = 0.25
    W_WEATHER = 0.20
    W_POPULARITY = 0.20

    @classmethod
    def calculate_interest_score(cls, place: Dict[str, Any], interests: List[str]) -> float:
        if not interests:
            return 0.7  # Neutral default

        place_cat = place.get("category", "").lower()
        place_tags = [t.lower() for t in place.get("tags", [])]
        
        matches = 0
        for interest in interests:
            i_low = interest.lower()
            if i_low in place_cat or any(i_low in tag for tag in place_tags):
                matches += 1

        if matches > 0:
            return min(1.0, 0.6 + (matches * 0.2))
        return 0.3

    @classmethod
    def calculate_budget_score(cls, place: Dict[str, Any], daily_activity_budget: float) -> float:
        cost = float(place.get("avg_cost", 0.0))
        if cost <= 0 or daily_activity_budget <= 0:
            return 1.0  # Free or no budget restriction

        if cost <= daily_activity_budget:
            # Fully affordable
            return 1.0
        else:
            # Exponential decay penalty for items exceeding the single-activity budget
            ratio = (cost - daily_activity_budget) / max(daily_activity_budget, 1.0)
            return max(0.1, math.exp(-0.8 * ratio))

    @classmethod
    def calculate_weather_score(cls, place: Dict[str, Any], weather_info: Optional[Dict[str, Any]]) -> float:
        if not weather_info:
            return 0.8  # Default baseline

        is_rainy = weather_info.get("is_rainy", False)
        category = place.get("category", "").lower()
        tags = [t.lower() for t in place.get("tags", [])]

        outdoor_keywords = ["beach", "watersports", "paragliding", "trekking", "rafting", "biking", "safari"]
        indoor_keywords = ["museum", "shopping", "cafe", "food", "temple", "palace", "mall", "market"]

        is_outdoor = any(k in category or any(k in tag for tag in tags) for k in outdoor_keywords)
        is_indoor = any(k in category or any(k in tag for tag in tags) for k in indoor_keywords)

        if is_rainy:
            if is_indoor:
                return 1.0  # Highly recommended during rain
            elif is_outdoor:
                return 0.3  # Penalized during heavy precipitation
            return 0.5
        else:
            if is_outdoor:
                return 1.0  # Ideal on clear pleasant days
            return 0.85

    @classmethod
    def calculate_popularity_score(cls, place: Dict[str, Any]) -> float:
        rating = float(place.get("rating", 4.0))
        return min(1.0, max(0.0, rating / 5.0))

    @classmethod
    def rank_places(
        cls,
        db: Session,
        destination: str,
        interests: List[str],
        total_budget: float,
        total_days: int,
        travelers: int,
        weather_forecast: Optional[List[Dict[str, Any]]] = None,
        top_k: int = 15
    ) -> List[Dict[str, Any]]:
        """
        Executes the hybrid ranking pipeline across candidate places retrieved via RAG.
        """
        candidates = retrieve_relevant_places_rag(db, destination, interests, top_k=top_k * 2)
        if not candidates:
            return []

        # Calculate daily budget allocated for activities
        daily_budget_per_person = total_budget / (max(total_days, 1) * max(travelers, 1))
        daily_activity_budget = daily_budget_per_person * 0.25  # 25% for activities/entry/sightseeing

        primary_weather = weather_forecast[0] if weather_forecast and len(weather_forecast) > 0 else None

        ranked_places = []
        for p in candidates:
            s_interest = cls.calculate_interest_score(p, interests)
            s_budget = cls.calculate_budget_score(p, daily_activity_budget)
            s_weather = cls.calculate_weather_score(p, primary_weather)
            s_popularity = cls.calculate_popularity_score(p)

            # Compute weighted hybrid score
            total_score = (
                cls.W_INTEREST * s_interest +
                cls.W_BUDGET * s_budget +
                cls.W_WEATHER * s_weather +
                cls.W_POPULARITY * s_popularity
            )

            p_copy = dict(p)
            p_copy["match_score"] = round(total_score * 100, 1)  # Scale to percentage (e.g. 94.5%)
            p_copy["score_breakdown"] = {
                "interest_fit": round(s_interest, 2),
                "budget_fit": round(s_budget, 2),
                "weather_fit": round(s_weather, 2),
                "popularity": round(s_popularity, 2)
            }
            ranked_places.append(p_copy)

        # Sort descending by match_score
        ranked_places.sort(key=lambda x: x["match_score"], reverse=True)
        return ranked_places[:top_k]
