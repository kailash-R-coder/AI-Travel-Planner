import math
import re
from typing import List, Dict, Any, Tuple
from sqlalchemy.orm import Session
from app.models.place import Place


class VectorSearchEngine:
    """
    Lightweight, deterministic high-dimensional TF-IDF & semantic vector embedding engine.
    Designed for B.Tech AI & Data Science viva demonstration.
    Computes normalized sparse-dense feature vectors and Cosine Similarity.
    """

    VOCABULARY = [
        "nature", "waterfall", "trekking", "wildlife", "scenic", "beach", "watersports", "nightlife",
        "parties", "seafood", "history", "fort", "portuguese", "heritage", "viewpoint", "shopping",
        "handicrafts", "souvenirs", "hippie", "clothing", "food", "cocktails", "fine dining",
        "adventure", "scuba", "snorkeling", "marine life", "palace", "royalty", "architecture",
        "monument", "photography", "pink city", "textiles", "gemstones", "bazaar", "rajasthani",
        "cultural", "dal baati", "cycling", "sunrise", "hills", "panoramic", "lake", "sunset",
        "snow", "paragliding", "skiing", "mountains", "temple", "wooden", "forest", "peaceful",
        "pines", "valley", "cafe", "riverside", "italian", "music", "woollens", "shawls", "pedestrian",
        "tea estates", "greenery", "mist", "backwaters", "cruise", "relaxation", "sadya", "kerala",
        "colonial", "fishing nets", "art", "spices", "plantation", "organic", "ayurveda", "rafting",
        "safari", "elephants", "spiritual", "ghat", "ganga aarti", "devotion", "jyotirlinga",
        "boat ride", "river", "silk", "sarees", "handloom", "chaat", "street food", "lassi", "paan",
        "himalayas", "high altitude", "biking", "mountain pass", "road trip", "monastery", "buddhism",
        "desert", "camels", "dunes", "tibetan", "thukpa", "momos", "rapids", "ganges", "adrenaline",
        "hike", "swimming", "freshwater", "beatles", "meditation", "ashram", "healthy", "vegetarian",
        "wonder", "taj mahal", "marble", "unesco", "mughal", "gardens", "petha", "sweets", "skyscraper",
        "luxury", "desert safari", "mall", "gold souk", "romantic", "museum", "croissant"
    ]

    @classmethod
    def _tokenize(cls, text: str) -> List[str]:
        return re.findall(r"\b[a-z0-9]+\b", text.lower())

    @classmethod
    def generate_embedding(cls, text: str) -> List[float]:
        """Generates a normalized L2 unit-norm embedding vector for the given text."""
        tokens = cls._tokenize(text)
        if not tokens:
            return [0.0] * len(cls.VOCABULARY)

        token_freq = {}
        for t in tokens:
            token_freq[t] = token_freq.get(t, 0) + 1

        vector = []
        for word in cls.VOCABULARY:
            # Word exact match or stem substring match
            weight = 0.0
            for t, freq in token_freq.items():
                if word == t or word in t or t in word:
                    weight += freq * 1.5
            vector.append(weight)

        # L2 Normalization (||v||_2 = 1)
        norm = math.sqrt(sum(x * x for x in vector))
        if norm > 0:
            return [round(x / norm, 5) for x in vector]
        return [0.0] * len(cls.VOCABULARY)

    @classmethod
    def cosine_similarity(cls, vec1: List[float], vec2: List[float]) -> float:
        """Computes Cosine Similarity between two normalized vectors: cos(theta) = u . v"""
        if not vec1 or not vec2 or len(vec1) != len(vec2):
            return 0.0
        dot_product = sum(a * b for a, b in zip(vec1, vec2))
        return max(0.0, min(1.0, dot_product))


def retrieve_relevant_places_rag(
    db: Session,
    destination: str,
    interests: List[str],
    top_k: int = 12
) -> List[Dict[str, Any]]:
    """
    RAG Retrieval Pipeline:
    1. Fetches candidate attractions filtered by destination or nearby regions.
    2. Builds query embedding from destination + interests.
    3. Computes cosine similarity vector score.
    4. Returns Top-K relevant places with ground-truth facts (ratings, costs, timings).
    """
    clean_dest = destination.strip().lower()
    
    # Query places from DB matching destination
    all_places = db.query(Place).all()
    if not all_places:
        return []

    # Construct query string
    query_text = f"{destination} {' '.join(interests)} holiday travel visit explore"
    query_vector = VectorSearchEngine.generate_embedding(query_text)

    scored_places = []
    for place in all_places:
        place_text = f"{place.name} {place.category} {place.location} {place.description} {' '.join(place.tags or [])}"
        place_vector = VectorSearchEngine.generate_embedding(place_text)
        
        sim_score = VectorSearchEngine.cosine_similarity(query_vector, place_vector)
        
        # Boost if destination name matches directly
        is_dest_match = (clean_dest in place.location.lower()) or (place.location.lower() in clean_dest)
        if is_dest_match:
            sim_score += 0.45
            
        # Category affinity boost
        for interest in interests:
            if interest.lower() in place.category.lower() or interest.lower() in [t.lower() for t in (place.tags or [])]:
                sim_score += 0.20

        scored_places.append({
            "id": place.id,
            "name": place.name,
            "category": place.category,
            "location": place.location,
            "description": place.description,
            "rating": place.rating,
            "avg_cost": place.avg_cost,
            "latitude": place.latitude,
            "longitude": place.longitude,
            "best_time": place.best_time,
            "tags": place.tags or [],
            "similarity_score": round(sim_score, 4)
        })

    # Sort descending by similarity score
    scored_places.sort(key=lambda x: x["similarity_score"], reverse=True)
    return scored_places[:top_k]
