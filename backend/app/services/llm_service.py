import json
import logging
from typing import List, Dict, Any, Optional
import httpx

from app.config import settings

logger = logging.getLogger(__name__)


class LLMItineraryGenerator:
    """
    Synthesizes RAG context, live weather, cost estimation, and user preferences
    into a cohesive, day-by-day personalized travel itinerary.
    Supports Google Gemini, OpenAI, and a grounded Rule-Based Knowledge Engine.
    """

    @classmethod
    def _build_system_prompt(cls) -> str:
        return (
            "You are an expert AI Travel Planner and tour guide. "
            "You will be given grounded factual data about destination attractions, verified costs in INR, "
            "and live weather forecasts. "
            "STRICT RULES:\n"
            "1. You must ONLY use the provided real tourist places, coordinates, and costs.\n"
            "2. Do NOT hallucinate fake opening hours, coordinates, or unrealistic prices.\n"
            "3. Format each day strictly with Morning, Afternoon, and Evening activities.\n"
            "4. Return ONLY valid JSON adhering to the required structure."
        )

    @classmethod
    def _build_user_prompt(
        cls,
        origin: str,
        destination: str,
        days: int,
        travelers: int,
        trip_type: str,
        budget: float,
        interests: List[str],
        transportation: str,
        accommodation: str,
        ranked_places: List[Dict[str, Any]],
        weather_forecast: List[Dict[str, Any]]
    ) -> str:
        places_summary = []
        for p in ranked_places[:12]:
            places_summary.append(
                f"- {p['name']} ({p['category']}): avg cost INR {p['avg_cost']}, rating {p['rating']}/5, "
                f"lat: {p['latitude']}, lon: {p['longitude']}. Description: {p['description']}"
            )

        weather_summary = []
        for idx, w in enumerate(weather_forecast[:days], 1):
            w_date = w.get("date", f"Day {idx}")
            w_cond = w.get("condition", "Pleasant")
            w_temp = w.get("temp_max", 28.0)
            w_prec = w.get("precipitation_probability", 10)
            weather_summary.append(f"Date {w_date}: {w_cond}, Max {w_temp}C, Rain prob: {w_prec}%")

        prompt = f"""
Plan a {days}-day personalized travel itinerary for {travelers} traveler(s) ({trip_type} trip).
Origin: {origin}
Destination: {destination}
Budget: INR {budget}
Preferred Transport: {transportation}
Accommodation: {accommodation}
Interests: {', '.join(interests) if interests else 'General sightseeing'}

LIVE WEATHER FORECAST:
{chr(10).join(weather_summary)}

GROUNDED VERIFIED PLACES IN {destination.upper()}:
{chr(10).join(places_summary)}

Generate a JSON object with this exact schema:
{{
  "days": [
    {{
      "day_number": 1,
      "theme": "Day Theme/Focus",
      "items": [
        {{
          "time": "Morning",
          "place": "Exact Place Name from list",
          "description": "Engaging activity description and insider tip",
          "estimated_cost": 250.0,
          "activity_type": "Sightseeing",
          "travel_time": "20 mins by Cab",
          "latitude": 15.555,
          "longitude": 73.751
        }},
        {{
          "time": "Afternoon",
          "place": "Place Name",
          "description": "Activity description",
          "estimated_cost": 400.0,
          "activity_type": "Dining",
          "travel_time": "15 mins",
          "latitude": 15.550,
          "longitude": 73.750
        }},
        {{
          "time": "Evening",
          "place": "Place Name",
          "description": "Sunset / Evening activity",
          "estimated_cost": 300.0,
          "activity_type": "Leisure",
          "travel_time": "25 mins",
          "latitude": 15.545,
          "longitude": 73.745
        }}
      ]
    }}
  ]
}}
"""
        return prompt

    @classmethod
    def generate_with_gemini(cls, prompt: str) -> Optional[Dict[str, Any]]:
        """Invokes Google Gemini 1.5 Flash API if API key is provided."""
        if not settings.GEMINI_API_KEY:
            return None

        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={settings.GEMINI_API_KEY}"
            payload = {
                "contents": [{"parts": [{"text": f"{cls._build_system_prompt()}\n\n{prompt}"}]}],
                "generationConfig": {
                    "temperature": 0.3,
                    "responseMimeType": "application/json"
                }
            }
            with httpx.Client(timeout=15.0) as client:
                res = client.post(url, json=payload)
                if res.status_code == 200:
                    data = res.json()
                    candidates = data.get("candidates", [])
                    if candidates:
                        text = candidates[0]["content"]["parts"][0]["text"]
                        return json.loads(text)
        except Exception as e:
            logger.warning(f"Gemini API generation failed: {e}")
        return None

    @classmethod
    def generate_with_openai(cls, prompt: str) -> Optional[Dict[str, Any]]:
        """Invokes OpenAI GPT-4o-mini / GPT-3.5 API if key is provided."""
        if not settings.OPENAI_API_KEY:
            return None

        try:
            url = "https://api.openai.com/v1/chat/completions"
            headers = {"Authorization": f"Bearer {settings.OPENAI_API_KEY}"}
            payload = {
                "model": "gpt-4o-mini",
                "messages": [
                    {"role": "system", "content": cls._build_system_prompt()},
                    {"role": "user", "content": prompt}
                ],
                "response_format": {"type": "json_object"},
                "temperature": 0.3
            }
            with httpx.Client(timeout=15.0) as client:
                res = client.post(url, headers=headers, json=payload)
                if res.status_code == 200:
                    data = res.json()
                    content = data["choices"][0]["message"]["content"]
                    return json.loads(content)
        except Exception as e:
            logger.warning(f"OpenAI API generation failed: {e}")
        return None

    @classmethod
    def generate_grounded_itinerary(
        cls,
        origin: str,
        destination: str,
        days: int,
        travelers: int,
        trip_type: str,
        budget: float,
        interests: List[str],
        transportation: str,
        accommodation: str,
        ranked_places: List[Dict[str, Any]],
        weather_forecast: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        Main itinerary synthesizer.
        Attempts Gemini/OpenAI if configured, and falls back to deterministic grounded synthesis.
        """
        days = max(1, min(days, 14))
        prompt = cls._build_user_prompt(
            origin, destination, days, travelers, trip_type, budget,
            interests, transportation, accommodation, ranked_places, weather_forecast
        )

        # 1. Try Gemini
        llm_result = cls.generate_with_gemini(prompt)
        
        # 2. Try OpenAI
        if not llm_result:
            llm_result = cls.generate_with_openai(prompt)

        # 3. If LLM returned valid structure, parse it
        if llm_result and "days" in llm_result and isinstance(llm_result["days"], list):
            flattened_items = []
            for day_obj in llm_result["days"]:
                day_num = day_obj.get("day_number", 1)
                for item in day_obj.get("items", []):
                    flattened_items.append({
                        "day": day_num,
                        "time": item.get("time", "Morning"),
                        "place": item.get("place", f"{destination} Attraction"),
                        "description": item.get("description", "Explore the destination."),
                        "estimated_cost": float(item.get("estimated_cost", 200.0)),
                        "activity_type": item.get("activity_type", "Sightseeing"),
                        "travel_time": item.get("travel_time", "20 mins"),
                        "latitude": float(item.get("latitude", 0.0)) if item.get("latitude") else None,
                        "longitude": float(item.get("longitude", 0.0)) if item.get("longitude") else None,
                    })
            if flattened_items:
                return flattened_items

        # 4. Deterministic Grounded Engine (Guaranteed zero-failure output for Viva)
        return cls._synthesize_grounded_itinerary_items(
            destination, days, travelers, ranked_places, weather_forecast, budget, interests
        )

    @classmethod
    def _synthesize_grounded_itinerary_items(
        cls,
        destination: str,
        days: int,
        travelers: int,
        ranked_places: List[Dict[str, Any]],
        weather_forecast: List[Dict[str, Any]],
        budget: float,
        interests: List[str]
    ) -> List[Dict[str, Any]]:
        """
        Assembles a coherent day-by-day travel sequence using Recommender-ranked places.
        Assigns morning, afternoon, and evening slots with realistic activity types and costs.
        """
        items = []
        num_places = len(ranked_places)
        place_idx = 0

        for day in range(1, days + 1):
            weather_day = weather_forecast[day - 1] if day - 1 < len(weather_forecast) else {"condition": "Pleasant", "is_rainy": False}
            is_rainy = weather_day.get("is_rainy", False)
            condition = weather_day.get("condition", "Pleasant")

            # Morning Activity (Sightseeing / Adventure)
            p_morn = ranked_places[place_idx % num_places] if num_places > 0 else None
            place_idx += 1
            if p_morn:
                items.append({
                    "day": day,
                    "time": "Morning",
                    "place": p_morn["name"],
                    "description": f"Start the day exploring {p_morn['name']}. {p_morn['description']} "
                                   f"Weather forecast: {condition}. Best experienced in the morning breeze.",
                    "estimated_cost": p_morn["avg_cost"] * travelers,
                    "activity_type": p_morn["category"],
                    "travel_time": "15-25 mins from hotel",
                    "latitude": p_morn["latitude"],
                    "longitude": p_morn["longitude"]
                })
            else:
                items.append({
                    "day": day,
                    "time": "Morning",
                    "place": f"{destination} Scenic Center",
                    "description": f"Morning discovery and sightseeing walk through key landmarks of {destination}.",
                    "estimated_cost": 150.0 * travelers,
                    "activity_type": "Sightseeing",
                    "travel_time": "20 mins",
                    "latitude": 28.6139,
                    "longitude": 77.2090
                })

            # Afternoon Activity (Dining / Cultural / Museum / Relaxation)
            p_aft = ranked_places[place_idx % num_places] if num_places > 0 else None
            place_idx += 1
            if p_aft:
                items.append({
                    "day": day,
                    "time": "Afternoon",
                    "place": p_aft["name"],
                    "description": f"Afternoon visit to {p_aft['name']}. {p_aft['description']} "
                                   f"Ideal for lunch, culture, and relaxation away from peak midday sun.",
                    "estimated_cost": p_aft["avg_cost"] * travelers,
                    "activity_type": p_aft["category"],
                    "travel_time": "15 mins transit",
                    "latitude": p_aft["latitude"],
                    "longitude": p_aft["longitude"]
                })
            else:
                items.append({
                    "day": day,
                    "time": "Afternoon",
                    "place": f"Local Cuisine Bistro & Market",
                    "description": f"Indulge in traditional cuisine and regional specialty delicacies in {destination}.",
                    "estimated_cost": 450.0 * travelers,
                    "activity_type": "Food",
                    "travel_time": "15 mins",
                    "latitude": 28.6139,
                    "longitude": 77.2090
                })

            # Evening Activity (Sunset / Markets / Nightlife / Leisure)
            p_eve = ranked_places[place_idx % num_places] if num_places > 0 else None
            place_idx += 1
            if p_eve:
                items.append({
                    "day": day,
                    "time": "Evening",
                    "place": p_eve["name"],
                    "description": f"Unwind at {p_eve['name']}. {p_eve['description']} "
                                   f"Enjoy the sunset ambiance, photography, and evening leisure strolls.",
                    "estimated_cost": p_eve["avg_cost"] * travelers,
                    "activity_type": p_eve["category"],
                    "travel_time": "20 mins transit",
                    "latitude": p_eve["latitude"],
                    "longitude": p_eve["longitude"]
                })
            else:
                items.append({
                    "day": day,
                    "time": "Evening",
                    "place": f"{destination} Sunset Promenade",
                    "description": f"Evening walk and leisure shopping through the illuminated streets and viewpoints of {destination}.",
                    "estimated_cost": 250.0 * travelers,
                    "activity_type": "Leisure",
                    "travel_time": "15 mins",
                    "latitude": 28.6139,
                    "longitude": 77.2090
                })

        return items


def answer_travel_chat(
    question: str,
    trip_context: Optional[Dict[str, Any]] = None,
    destination: Optional[str] = None
) -> str:
    """
    Conversational AI assistant that provides contextual travel advice based on trip details.
    """
    dest = destination or (trip_context.get("destination") if trip_context else "your destination")
    q_low = question.lower()

    # Rule-based contextually grounded conversational responses for offline/viva demo
    if "pack" in q_low or "clothes" in q_low or "wear" in q_low:
        return (
            f"For your trip to **{dest}**, pack lightweight breathable cottons for daytime exploration, "
            f"comfortable walking shoes, sunscreen, UV sunglasses, and a compact umbrella or light jacket "
            f"for evening temperature drops."
        )
    elif "budget" in q_low or "cost" in q_low or "expensive" in q_low or "money" in q_low:
        if trip_context and "budget" in trip_context:
            return (
                f"Your total allocated budget for this trip is **INR {trip_context['budget']:,.2f}**. "
                f"We recommend earmarking ~35% for accommodation, 25% for dining & food, 20% for sightseeing & entry tickets, "
                f"and saving 10% as an emergency buffer."
            )
        return f"Daily expenses in {dest} typically range between INR 1,500 - 3,500 per person including food and local transit."
    elif "food" in q_low or "eat" in q_low or "restaurant" in q_low or "vegetarian" in q_low:
        return (
            f"When in **{dest}**, make sure to sample the regional specialties! "
            f"Look for top-rated local eateries serving authentic regional thalis, street food chaat, "
            f"and fresh seasonal drinks. Ask for purified water and freshly cooked meals."
        )
    elif "weather" in q_low or "rain" in q_low or "temperature" in q_low:
        return (
            f"The weather forecast for **{dest}** looks favorable with pleasant daytime temperatures. "
            f"Stay hydrated during daytime outdoor activities and check the live weather widget before heading out!"
        )
    elif "safe" in q_low or "safety" in q_low or "emergency" in q_low:
        return (
            f"General safety tips for **{dest}**: Keep emergency local helpline numbers saved, "
            f"use authorized prepaid taxis or verified ride-hailing apps, and keep digital copies of your ID documents securely stored."
        )
    else:
        return (
            f"Regarding '{question}': In **{dest}**, we recommend following your customized itinerary schedule, "
            f"booking high-demand attraction slots in advance, and consulting local guides for hidden scenic spots."
        )
