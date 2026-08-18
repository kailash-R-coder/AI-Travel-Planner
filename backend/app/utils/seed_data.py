from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models.place import Place


PLACES_DATASET: List[Dict[str, Any]] = [
    # ------------------ GOA ------------------
    {
        "name": "Baga Beach",
        "category": "Beaches",
        "location": "Goa",
        "description": "One of the most energetic beaches in North Goa known for water sports, nightlife, beach shacks, and vibrant parties.",
        "rating": 4.6,
        "avg_cost": 500.0,
        "latitude": 15.5553,
        "longitude": 73.7517,
        "best_time": "Evening & Sunset",
        "tags": ["beach", "watersports", "nightlife", "parties", "seafood"]
    },
    {
        "name": "Aguada Fort & Lighthouse",
        "category": "History",
        "location": "Goa",
        "description": "A well-preserved 17th-century Portuguese fort standing on Sinquerim Beach overlooking the vast Arabian Sea.",
        "rating": 4.5,
        "avg_cost": 100.0,
        "latitude": 15.4922,
        "longitude": 73.7735,
        "best_time": "Morning / Late Afternoon",
        "tags": ["history", "fort", "portuguese", "heritage", "viewpoint"]
    },
    {
        "name": "Dudhsagar Waterfalls",
        "category": "Nature",
        "location": "Goa",
        "description": "A four-tiered waterfall on the Mandovi River known as 'Sea of Milk', surrounded by lush Western Ghats forest.",
        "rating": 4.8,
        "avg_cost": 800.0,
        "latitude": 15.3144,
        "longitude": 74.3143,
        "best_time": "Morning",
        "tags": ["nature", "waterfall", "trekking", "wildlife", "scenic"]
    },
    {
        "name": "Anjuna Flea Market",
        "category": "Shopping",
        "location": "Goa",
        "description": "Iconic bustling open-air market offering bohemian clothes, handmade jewellery, spices, souvenirs, and live music.",
        "rating": 4.3,
        "avg_cost": 1000.0,
        "latitude": 15.5802,
        "longitude": 73.7431,
        "best_time": "Wednesday Afternoon",
        "tags": ["shopping", "handicrafts", "souvenirs", "hippie", "clothing"]
    },
    {
        "name": "Fisherman's Wharf Shack",
        "category": "Food",
        "location": "Goa",
        "description": "Riverside dining experience serving authentic Goan fish curry, prawn balchao, pork vindaloo, and refreshing cocktails.",
        "rating": 4.7,
        "avg_cost": 900.0,
        "latitude": 15.2285,
        "longitude": 73.9452,
        "best_time": "Dinner",
        "tags": ["food", "seafood", "goan", "cocktails", "fine dining"]
    },
    {
        "name": "Grande Island Scuba Diving",
        "category": "Adventure",
        "location": "Goa",
        "description": "Thrilling underwater scuba diving and snorkeling trip with coral reefs, exotic fish, and dolphin spotting.",
        "rating": 4.6,
        "avg_cost": 2500.0,
        "latitude": 15.3533,
        "longitude": 73.7594,
        "best_time": "Early Morning",
        "tags": ["adventure", "scuba", "watersports", "snorkeling", "marine life"]
    },

    # ------------------ JAIPUR ------------------
    {
        "name": "Amber Palace & Fort",
        "category": "History",
        "location": "Jaipur",
        "description": "Majestic hilltop fort with artistic Hindu style elements, sprawling courtyards, Sheesh Mahal mirror palace, and elephant rides.",
        "rating": 4.8,
        "avg_cost": 500.0,
        "latitude": 26.9855,
        "longitude": 75.8513,
        "best_time": "Morning",
        "tags": ["history", "palace", "royalty", "architecture", "heritage"]
    },
    {
        "name": "Hawa Mahal (Palace of Winds)",
        "category": "History",
        "location": "Jaipur",
        "description": "Iconic five-story pink sandstone palace featuring 953 intricately carved jharokhas (windows) designed for royal women.",
        "rating": 4.6,
        "avg_cost": 200.0,
        "latitude": 26.9239,
        "longitude": 75.8267,
        "best_time": "Morning Sunrise",
        "tags": ["history", "architecture", "monument", "photography", "pink city"]
    },
    {
        "name": "Johari Bazaar & Bapu Bazaar",
        "category": "Shopping",
        "location": "Jaipur",
        "description": "Traditional vibrant street bazaars famous for authentic Jaipuri quilts, Mojari leather shoes, gemstones, and block-printed textiles.",
        "rating": 4.4,
        "avg_cost": 1200.0,
        "latitude": 26.9196,
        "longitude": 75.8274,
        "best_time": "Afternoon & Evening",
        "tags": ["shopping", "textiles", "gemstones", "handicrafts", "bazaar"]
    },
    {
        "name": "Chokhi Dhani Ethnic Resort",
        "category": "Food",
        "location": "Jaipur",
        "description": "A cultural village celebration offering authentic Rajasthani Dal Baati Churma royal feast along with folk dances and puppet shows.",
        "rating": 4.7,
        "avg_cost": 1200.0,
        "latitude": 26.7663,
        "longitude": 75.8362,
        "best_time": "Evening / Dinner",
        "tags": ["food", "rajasthani", "cultural", "dal baati", "performance"]
    },
    {
        "name": "Nahargarh Fort Cycling Expedition",
        "category": "Adventure",
        "location": "Jaipur",
        "description": "Early morning uphill cycling tour to Nahargarh fort along the Aravalli hills with sweeping panoramic views of the Pink City.",
        "rating": 4.5,
        "avg_cost": 850.0,
        "latitude": 26.9373,
        "longitude": 75.8156,
        "best_time": "Early Morning",
        "tags": ["adventure", "cycling", "sunrise", "hills", "panoramic"]
    },
    {
        "name": "Jal Mahal Lake Promenade",
        "category": "Nature",
        "location": "Jaipur",
        "description": "A serene water palace in the center of Man Sagar Lake against scenic hills, ideal for birdwatching and tranquil evening strolls.",
        "rating": 4.4,
        "avg_cost": 100.0,
        "latitude": 26.9534,
        "longitude": 75.8462,
        "best_time": "Sunset",
        "tags": ["nature", "lake", "scenic", "birds", "sunset"]
    },

    # ------------------ MANALI ------------------
    {
        "name": "Solang Valley Snow Point",
        "category": "Adventure",
        "location": "Manali",
        "description": "Adventure hub offering paragliding, zorbing, quad biking in summers, and skiing / snowboarding during snowy winters.",
        "rating": 4.7,
        "avg_cost": 2200.0,
        "latitude": 32.3166,
        "longitude": 77.1578,
        "best_time": "Morning to Afternoon",
        "tags": ["adventure", "snow", "paragliding", "skiing", "mountains"]
    },
    {
        "name": "Hadimba Devi Temple",
        "category": "History",
        "location": "Manali",
        "description": "Unique wooden temple constructed in 1553 situated amidst a towering deodar cedar forest in Old Manali.",
        "rating": 4.6,
        "avg_cost": 50.0,
        "latitude": 32.2483,
        "longitude": 77.1809,
        "best_time": "Morning",
        "tags": ["history", "temple", "wooden", "forest", "peaceful"]
    },
    {
        "name": "Jogini Waterfall Trek",
        "category": "Nature",
        "location": "Manali",
        "description": "A breathtaking 3 km scenic trek starting from Vashisht village through pine orchards leading to a cascading mountain waterfall.",
        "rating": 4.8,
        "avg_cost": 0.0,
        "latitude": 32.2697,
        "longitude": 77.1953,
        "best_time": "Morning",
        "tags": ["nature", "trekking", "waterfall", "pines", "valley"]
    },
    {
        "name": "Old Manali Cafe Crawl (Cafe 1947)",
        "category": "Food",
        "location": "Manali",
        "description": "Cozy riverside cafe serving wood-fired Italian pizzas, Himachali Trout, freshly brewed mountain coffee, and live acoustic music.",
        "rating": 4.6,
        "avg_cost": 750.0,
        "latitude": 32.2536,
        "longitude": 77.1751,
        "best_time": "Lunch & Evening",
        "tags": ["food", "cafe", "riverside", "italian", "music"]
    },
    {
        "name": "Mall Road & Tibetan Market",
        "category": "Shopping",
        "location": "Manali",
        "description": "Vibrant pedestrian shopping avenue with Kullu woollen shawls, wooden carvings, apple jams, prayer wheels, and dry fruits.",
        "rating": 4.3,
        "avg_cost": 800.0,
        "latitude": 26.9196,
        "longitude": 75.8274,
        "best_time": "Evening",
        "tags": ["shopping", "woollens", "shawls", "souvenirs", "pedestrian"]
    },

    # ------------------ KERALA (MUNNAR / ALLEPPEY) ------------------
    {
        "name": "Munnar Tea Plantations & Kolukkumalai",
        "category": "Nature",
        "location": "Kerala",
        "description": "Endless rolling emerald tea estates, mist-covered valleys, and the world's highest tea plantation at 7,900 feet.",
        "rating": 4.9,
        "avg_cost": 400.0,
        "latitude": 10.0889,
        "longitude": 77.0595,
        "best_time": "Morning Mist",
        "tags": ["nature", "tea estates", "hills", "greenery", "mist"]
    },
    {
        "name": "Alleppey Backwaters Houseboat Cruise",
        "category": "Beaches",
        "location": "Kerala",
        "description": "Cruising through tranquil palm-fringed canals, paddy fields, and Vembanad Lake in a traditional thatched Kettuvallam.",
        "rating": 4.8,
        "avg_cost": 3500.0,
        "latitude": 9.4981,
        "longitude": 76.3388,
        "best_time": "Full Day & Overnight",
        "tags": ["nature", "backwaters", "cruise", "relaxation", "scenic"]
    },
    {
        "name": "Traditional Kerala Sadya & Seafood Feast",
        "category": "Food",
        "location": "Kerala",
        "description": "Authentic 24-dish vegetarian Sadya feast served on a banana leaf, plus Karimeen Pollichathu (pearl spot fish wrapped in banana leaf).",
        "rating": 4.8,
        "avg_cost": 650.0,
        "latitude": 9.9656,
        "longitude": 76.2421,
        "best_time": "Lunch",
        "tags": ["food", "sadya", "kerala cuisine", "banana leaf", "authentic"]
    },
    {
        "name": "Fort Kochi & Chinese Fishing Nets",
        "category": "History",
        "location": "Kerala",
        "description": "Colonial seaside town with Dutch palaces, Jewish synagogues, 14th-century cantilevered Chinese fishing nets, and art cafes.",
        "rating": 4.5,
        "avg_cost": 150.0,
        "latitude": 9.9658,
        "longitude": 76.2423,
        "best_time": "Sunset",
        "tags": ["history", "colonial", "heritage", "fishing nets", "art"]
    },
    {
        "name": "Munnar Spice Plantation Walk",
        "category": "Shopping",
        "location": "Kerala",
        "description": "Guided aromatic walk through cardamom, cinnamon, clove, and pepper gardens with farm-fresh organic spices shop.",
        "rating": 4.5,
        "avg_cost": 500.0,
        "latitude": 10.0531,
        "longitude": 77.0422,
        "best_time": "Afternoon",
        "tags": ["shopping", "spices", "plantation", "organic", "ayurveda"]
    },
    {
        "name": "Periyar Bamboo Rafting & Jungle Safari",
        "category": "Adventure",
        "location": "Kerala",
        "description": "Trek through dense tiger reserve forests followed by bamboo rafting across Periyar lake observing wild elephants and otters.",
        "rating": 4.7,
        "avg_cost": 2000.0,
        "latitude": 9.4679,
        "longitude": 77.1435,
        "best_time": "Early Morning",
        "tags": ["adventure", "rafting", "wildlife", "safari", "elephants"]
    },

    # ------------------ VARANASI ------------------
    {
        "name": "Dashashwamedh Ghat Evening Ganga Aarti",
        "category": "History",
        "location": "Varanasi",
        "description": "Spiritual ceremony with brass lamps, rhythmic Vedic chants, conch shells, and incense along the sacred river banks.",
        "rating": 4.9,
        "avg_cost": 100.0,
        "latitude": 25.3076,
        "longitude": 83.0104,
        "best_time": "7:00 PM Aarti",
        "tags": ["history", "spiritual", "ghat", "ganga aarti", "devotion"]
    },
    {
        "name": "Kashi Vishwanath Temple",
        "category": "History",
        "location": "Varanasi",
        "description": "One of the twelve sacred Jyotirlinga shrines of Lord Shiva situated by the newly renovated grand spiritual corridor.",
        "rating": 4.8,
        "avg_cost": 0.0,
        "latitude": 25.3109,
        "longitude": 83.0107,
        "best_time": "Early Morning",
        "tags": ["history", "temple", "jyotirlinga", "corridor", "sacred"]
    },
    {
        "name": "Sunrise Boat Ride on the Ganges",
        "category": "Nature",
        "location": "Varanasi",
        "description": "Peaceful rowing boat ride at daybreak gliding past ancient riverfront palaces, bathing pilgrims, and misty horizons.",
        "rating": 4.7,
        "avg_cost": 400.0,
        "latitude": 25.3050,
        "longitude": 83.0080,
        "best_time": "5:30 AM Sunrise",
        "tags": ["nature", "boat ride", "sunrise", "river", "photography"]
    },
    {
        "name": "Banarasi Silk Saree Weaving Center",
        "category": "Shopping",
        "location": "Varanasi",
        "description": "Traditional handloom workshops where master artisans hand-weave pure gold and silver zari Banarasi silk sarees.",
        "rating": 4.5,
        "avg_cost": 2500.0,
        "latitude": 25.3180,
        "longitude": 82.9980,
        "best_time": "Afternoon",
        "tags": ["shopping", "silk", "sarees", "handloom", "zari"]
    },
    {
        "name": "Varanasi Street Food & Malaiyo Trial",
        "category": "Food",
        "location": "Varanasi",
        "description": "Taste Tamatar Chaat, Kachori Sabzi, Blue Lassi, Banarasi Paan, and winter frothy saffron dessert Malaiyo.",
        "rating": 4.8,
        "avg_cost": 300.0,
        "latitude": 25.3120,
        "longitude": 83.0070,
        "best_time": "Morning & Evening",
        "tags": ["food", "chaat", "street food", "lassi", "paan"]
    },

    # ------------------ LADAKH ------------------
    {
        "name": "Pangong Tso High Altitude Lake",
        "category": "Nature",
        "location": "Ladakh",
        "description": "Mesmerizing endorheic lake at 14,270 feet changing colors from turquoise to deep blue, surrounded by rugged snow-capped peaks.",
        "rating": 4.9,
        "avg_cost": 1500.0,
        "latitude": 33.7595,
        "longitude": 78.6674,
        "best_time": "Daytime & Sunset",
        "tags": ["nature", "lake", "himalayas", "high altitude", "scenic"]
    },
    {
        "name": "Khardung La High Mountain Pass",
        "category": "Adventure",
        "location": "Ladakh",
        "description": "One of the highest motorable roads in the world at 17,982 ft, offering an adrenaline-packed road trip on Royal Enfield bikes.",
        "rating": 4.7,
        "avg_cost": 2000.0,
        "latitude": 34.2789,
        "longitude": 77.6047,
        "best_time": "Morning",
        "tags": ["adventure", "biking", "mountain pass", "snow", "road trip"]
    },
    {
        "name": "Thiksey Monastery (Mini Potala)",
        "category": "History",
        "location": "Ladakh",
        "description": "Twelve-story Tibetan Buddhist monastery of the Gelug sect housing a monumental 49-foot Maitreya Buddha statue.",
        "rating": 4.8,
        "avg_cost": 50.0,
        "latitude": 34.0573,
        "longitude": 77.6668,
        "best_time": "Morning Chanting",
        "tags": ["history", "monastery", "buddhism", "architecture", "spiritual"]
    },
    {
        "name": "Nubra Valley Camel Safari (Hunder)",
        "category": "Adventure",
        "location": "Ladakh",
        "description": "Ride double-humped Bactrian camels across cold desert sand dunes framed by jagged Himalayan peaks.",
        "rating": 4.6,
        "avg_cost": 800.0,
        "latitude": 34.5822,
        "longitude": 77.4682,
        "best_time": "Late Afternoon",
        "tags": ["adventure", "desert", "camels", "dunes", "valley"]
    },
    {
        "name": "Tibetan Kitchen & Momos Bistro",
        "category": "Food",
        "location": "Ladakh",
        "description": "Warm restaurant serving steaming Thukpa, Tingmo bread, mutton momos, Butter Tea, and savory Ladakhi stew (Skyu).",
        "rating": 4.7,
        "avg_cost": 550.0,
        "latitude": 34.1642,
        "longitude": 77.5848,
        "best_time": "Dinner",
        "tags": ["food", "tibetan", "thukpa", "momos", "butter tea"]
    },

    # ------------------ RISHIKESH ------------------
    {
        "name": "Ganges White Water River Rafting",
        "category": "Adventure",
        "location": "Rishikesh",
        "description": "Grade III & IV white water rapids through Shivpuri to Marine Drive along the sacred emerald Ganges.",
        "rating": 4.8,
        "avg_cost": 1200.0,
        "latitude": 30.1345,
        "longitude": 78.3842,
        "best_time": "Morning",
        "tags": ["adventure", "rafting", "rapids", "ganges", "adrenaline"]
    },
    {
        "name": "Triveni Ghat Evening Aarti",
        "category": "History",
        "location": "Rishikesh",
        "description": "Confluence of three holy rivers featuring musical chants, floating leaf oil diyas, and peaceful bells.",
        "rating": 4.7,
        "avg_cost": 50.0,
        "latitude": 30.1037,
        "longitude": 78.2941,
        "best_time": "Sunset Aarti",
        "tags": ["history", "spiritual", "aarti", "ghat", "peaceful"]
    },
    {
        "name": "Neer Garh Waterfall Hike",
        "category": "Nature",
        "location": "Rishikesh",
        "description": "Shaded forest hike leading to a 2-tier pristine blue natural spring pool perfect for a refreshing swim.",
        "rating": 4.5,
        "avg_cost": 100.0,
        "latitude": 30.1444,
        "longitude": 78.3378,
        "best_time": "Morning",
        "tags": ["nature", "waterfall", "hike", "swimming", "freshwater"]
    },
    {
        "name": "The Beatles Ashram (Chaurasi Kutia)",
        "category": "History",
        "location": "Rishikesh",
        "description": "Eclectic meditation ashram with graffiti murals where The Beatles stayed in 1968 and composed over 40 songs.",
        "rating": 4.5,
        "avg_cost": 150.0,
        "latitude": 30.1171,
        "longitude": 78.3129,
        "best_time": "Afternoon",
        "tags": ["history", "beatles", "art", "meditation", "ashram"]
    },
    {
        "name": "Little Buddha Cafe",
        "category": "Food",
        "location": "Rishikesh",
        "description": "Treehouse-style cafe overlooking Laxman Jhula serving falafel platters, ayurvedic herbal teas, and healthy smoothie bowls.",
        "rating": 4.6,
        "avg_cost": 450.0,
        "latitude": 30.1287,
        "longitude": 78.3283,
        "best_time": "Lunch & Sunset",
        "tags": ["food", "healthy", "cafe", "river view", "vegetarian"]
    },

    # ------------------ AGRA ------------------
    {
        "name": "Taj Mahal",
        "category": "History",
        "location": "Agra",
        "description": "World Wonder and UNESCO World Heritage ivory-white marble mausoleum on the Yamuna river built by Emperor Shah Jahan.",
        "rating": 4.9,
        "avg_cost": 250.0,
        "latitude": 27.1751,
        "longitude": 78.0421,
        "best_time": "Sunrise",
        "tags": ["history", "wonder", "taj mahal", "marble", "unesco"]
    },
    {
        "name": "Agra Fort (Red Fort)",
        "category": "History",
        "location": "Agra",
        "description": "Massive 16th-century red sandstone Mughal fortress featuring Diwan-i-Khas, Jahangiri Mahal, and imperial courtyards.",
        "rating": 4.6,
        "avg_cost": 150.0,
        "latitude": 27.1795,
        "longitude": 78.0211,
        "best_time": "Afternoon",
        "tags": ["history", "mughal", "fort", "architecture", "heritage"]
    },
    {
        "name": "Mehtab Bagh Sunset Gardens",
        "category": "Nature",
        "location": "Agra",
        "description": "Charbagh complex perfectly aligned across the river offering an unobstructed sunset silhouette view of the Taj Mahal.",
        "rating": 4.5,
        "avg_cost": 100.0,
        "latitude": 27.1800,
        "longitude": 78.0460,
        "best_time": "Sunset",
        "tags": ["nature", "gardens", "sunset", "viewpoint", "peaceful"]
    },
    {
        "name": "Petha & Mughal Delicacies Bazar",
        "category": "Food",
        "location": "Agra",
        "description": "Sample world-famous authentic Agra Angoori & Kesar Petha sweets, Bedmi Puri, and rich aromatic Mughlai kebabs.",
        "rating": 4.4,
        "avg_cost": 350.0,
        "latitude": 27.1830,
        "longitude": 78.0160,
        "best_time": "Evening",
        "tags": ["food", "petha", "mughlai", "sweets", "bazaar"]
    },

    # ------------------ DUBAI (INTERNATIONAL) ------------------
    {
        "name": "Burj Khalifa Observation Deck",
        "category": "History",
        "location": "Dubai",
        "description": "Ascend to levels 124 & 125 of the world's tallest building for 360-degree views over the Arabian Gulf and desert skyline.",
        "rating": 4.8,
        "avg_cost": 3800.0,
        "latitude": 25.1972,
        "longitude": 55.2744,
        "best_time": "Sunset",
        "tags": ["modern", "skyscraper", "skyline", "views", "luxury"]
    },
    {
        "name": "Dubai Desert 4x4 Safari & Dune Bashing",
        "category": "Adventure",
        "location": "Dubai",
        "description": "High-octane red dune 4x4 bashing, sandboarding, falconry, camel rides, and starlit BBQ dinner with Tanoura dance.",
        "rating": 4.8,
        "avg_cost": 3200.0,
        "latitude": 24.8333,
        "longitude": 55.6333,
        "best_time": "Afternoon to Night",
        "tags": ["adventure", "desert safari", "dunes", "bbq", "entertainment"]
    },
    {
        "name": "Dubai Mall & Gold Souk",
        "category": "Shopping",
        "location": "Dubai",
        "description": "World's premier retail destination featuring luxury boutiques, giant aquarium, indoor waterfalls, and Deira gold souks.",
        "rating": 4.7,
        "avg_cost": 2000.0,
        "latitude": 25.1985,
        "longitude": 55.2796,
        "best_time": "Afternoon / Evening",
        "tags": ["shopping", "luxury", "mall", "gold souk", "brands"]
    },
    {
        "name": "Jumeirah Beach & Marina Walk",
        "category": "Beaches",
        "location": "Dubai",
        "description": "Pristine white sand beach with views of Burj Al Arab, beachfront cafes, running tracks, and yacht cruises.",
        "rating": 4.6,
        "avg_cost": 500.0,
        "latitude": 25.0784,
        "longitude": 55.1336,
        "best_time": "Late Afternoon",
        "tags": ["beaches", "marina", "yacht", "sea view", "promenade"]
    },

    # ------------------ PARIS (INTERNATIONAL) ------------------
    {
        "name": "Eiffel Tower & Champ de Mars",
        "category": "History",
        "location": "Paris",
        "description": "Global romantic icon with panoramic city views and dazzling hourly sparkling light shows in the evening.",
        "rating": 4.7,
        "avg_cost": 2800.0,
        "latitude": 48.8584,
        "longitude": 2.2945,
        "best_time": "Sunset & Night",
        "tags": ["history", "monument", "romantic", "iconic", "night lights"]
    },
    {
        "name": "Louvre Museum & Glass Pyramid",
        "category": "History",
        "location": "Paris",
        "description": "World's largest art museum housing masterworks including the Mona Lisa, Venus de Milo, and Winged Victory of Samothrace.",
        "rating": 4.8,
        "avg_cost": 2200.0,
        "latitude": 48.8606,
        "longitude": 2.3376,
        "best_time": "Morning",
        "tags": ["history", "museum", "art", "mona lisa", "culture"]
    },
    {
        "name": "Seine River Cruise & Parisian Cafe",
        "category": "Food",
        "location": "Paris",
        "description": "Scenic glass-canopy boat cruise along Notre-Dame followed by flaky butter croissants, espresso, and french onion soup.",
        "rating": 4.7,
        "avg_cost": 1800.0,
        "latitude": 48.8566,
        "longitude": 2.3522,
        "best_time": "Lunch & Evening",
        "tags": ["food", "cafe", "croissant", "cruise", "seine"]
    }
]


def seed_initial_places(db: Session):
    """Populates the database with initial rich place data if empty."""
    existing_count = db.query(Place).count()
    if existing_count > 0:
        return existing_count

    places_to_add = []
    for item in PLACES_DATASET:
        # Precompute simple keyword embedding representation
        tags_str = " ".join(item.get("tags", []))
        desc_str = f"{item['name']} {item['category']} {item['location']} {item['description']} {tags_str}"
        
        place = Place(
            name=item["name"],
            category=item["category"],
            location=item["location"],
            description=item["description"],
            rating=item["rating"],
            avg_cost=item["avg_cost"],
            latitude=item["latitude"],
            longitude=item["longitude"],
            best_time=item.get("best_time", "All Year"),
            tags=item.get("tags", []),
            embedding=None  # Can be populated by RAG service
        )
        places_to_add.append(place)

    db.add_all(places_to_add)
    db.commit()
    return len(places_to_add)
