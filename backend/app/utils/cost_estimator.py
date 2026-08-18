from typing import Dict, Any, List


ACCOMMODATION_RATES_INR_PER_NIGHT = {
    "hostel": 800.0,
    "budget": 1800.0,
    "standard": 3500.0,
    "luxury": 9500.0,
    "resort": 7500.0,
}

TRANSPORT_BASE_RATES_INR = {
    "flight": 4500.0,
    "train": 1200.0,
    "bus": 800.0,
    "car": 2500.0,
    "any": 1500.0,
}


def calculate_budget_breakdown(
    total_budget: float,
    days: int,
    travelers: int,
    accommodation_type: str = "Standard",
    transport_mode: str = "Flight"
) -> Dict[str, Any]:
    """
    Computes a realistic percentage and INR breakdown of the user's travel budget.
    """
    stay_tier = accommodation_type.lower()
    transport_tier = transport_mode.lower()

    # Percentage distribution calibrated for Indian travel context
    if stay_tier in ["luxury", "resort"]:
        stay_pct = 0.40
        food_pct = 0.22
        activities_pct = 0.18
        transport_pct = 0.12
        buffer_pct = 0.08
    elif stay_tier == "hostel":
        stay_pct = 0.20
        food_pct = 0.25
        activities_pct = 0.30
        transport_pct = 0.15
        buffer_pct = 0.10
    else:  # standard / budget
        stay_pct = 0.35
        food_pct = 0.25
        activities_pct = 0.20
        transport_pct = 0.12
        buffer_pct = 0.08

    stay_est = round(total_budget * stay_pct, 2)
    food_est = round(total_budget * food_pct, 2)
    activities_est = round(total_budget * activities_pct, 2)
    transport_est = round(total_budget * transport_pct, 2)
    buffer_est = round(total_budget * buffer_pct, 2)

    return {
        "stay": stay_est,
        "food": food_est,
        "activities": activities_est,
        "transportation": transport_est,
        "emergency_buffer": buffer_est,
        "total_budget": total_budget,
        "daily_per_person_allowance": round(total_budget / (max(days, 1) * max(travelers, 1)), 2),
        "percentages": {
            "stay": int(stay_pct * 100),
            "food": int(food_pct * 100),
            "activities": int(activities_pct * 100),
            "transportation": int(transport_pct * 100),
            "emergency_buffer": int(buffer_pct * 100),
        }
    }
