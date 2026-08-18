# AI Travel Planner — Intelligent Personalized Itinerary Engine

> **A Full-Stack AI & Data Science College Project**  
> Built with **FastAPI (Python)**, **React 18 & Vite**, **SQLAlchemy ORM (SQLite / PostgreSQL + pgvector)**, **RAG Semantic Search**, **Multi-Criteria Decision Modeling (MCDM)**, and **Live Meteorological APIs**.

---

## 🌟 Key Features

1. **AI-Powered Trip Generator**: Formulates detailed, day-by-day travel plans (Morning, Afternoon, Evening activities) grounded in real attraction databases and verified costs in INR.
2. **Explainable Multi-Criteria Recommendation System**: Ranks destinations and attractions using a weighted hybrid formulation balancing Interest affinity, Budget suitability, Weather feasibility, and Popularity ratings.
3. **RAG Vector Search Engine**: High-dimensional semantic embeddings with Cosine Similarity ($\cos\theta = \frac{\vec{u}\cdot\vec{v}}{\|\vec{u}\|\|\vec{v}\|}$) to eliminate hallucinations.
4. **Live Weather Grounding**: Real-time 7-day meteorological forecasts via Open-Meteo API (temperature max/min, rain probability, WMO condition codes) with automatic indoor/outdoor schedule adaptation.
5. **Dynamic INR Budget Allocation**: Realistic financial breakdown across Accommodations, Regional Dining, Sightseeing, and Emergency Contingency buffers.
6. **Interactive Spatial Routing**: Interactive Leaflet maps with pins, popups, and sequential route polylines.
7. **Itinerary Modification**: Edit activity timings, costs, descriptions, or add/delete custom activities.
8. **Context-Aware AI Travel Chatbot**: Conversational assistant with trip context memory.
9. **Secure Authentication**: JWT Bearer Tokens with Bcrypt (12 rounds) password hashing.

---

## 📐 AI & Recommendation Mathematical Model

For any candidate attraction $p$, the hybrid recommendation score is computed as:

$$\text{FinalScore}(p) = 0.35 \cdot S_{\text{interest}}(p, U) + 0.25 \cdot S_{\text{budget}}(p, B) + 0.20 \cdot S_{\text{weather}}(p, W) + 0.20 \cdot S_{\text{popularity}}(p)$$

### Sub-Score Formulations:
1. **Interest Score ($S_{\text{interest}}$)**:
   $$\text{CosineSim}(\vec{q}_{\text{interest}}, \vec{v}_{\text{place}}) = \frac{\vec{q} \cdot \vec{v}}{\|\vec{q}\|_2 \|\vec{v}\|_2}$$
2. **Budget Suitability ($S_{\text{budget}}$)**:
   $$S_{\text{budget}} = \begin{cases} 1.0 & \text{if } \text{cost} \le B_{\text{activity}} \\ \exp\left(-0.8 \cdot \frac{\text{cost} - B_{\text{activity}}}{B_{\text{activity}}}\right) & \text{if } \text{cost} > B_{\text{activity}} \end{cases}$$
3. **Weather Fit ($S_{\text{weather}}$)**:
   - Rainy days ($\text{Precipitation} > 50\%$): Boost indoor museums, dining, and palaces ($1.0$); penalize outdoor beaches and water sports ($0.3$).
   - Pleasant days: Boost outdoor adventures, trekking, and viewpoints ($1.0$).
4. **Popularity ($S_{\text{popularity}}$)**:
   $$\frac{\text{Rating}}{5.0}$$

---

## 🏗️ Project Structure

```
ai-travel-planner/
├── backend/
│   ├── app/
│   │   ├── config.py              # Pydantic settings & environment vars
│   │   ├── database.py            # SQLAlchemy engine & session management
│   │   ├── main.py                # FastAPI app & CORS middleware
│   │   ├── models/                # User, Trip, ItineraryItem, Place, ChatHistory
│   │   ├── schemas/               # Pydantic v2 validation schemas
│   │   ├── routers/               # auth, trips, itinerary, places, weather, chat
│   │   ├── services/
│   │   │   ├── auth_service.py    # Bcrypt + JWT token encoder
│   │   │   ├── geocoding_service.py # Haversine distance & transit estimation
│   │   │   ├── llm_service.py     # Gemini / OpenAI / Grounded synthesizer
│   │   │   ├── rag_service.py     # Vector embeddings & Cosine similarity
│   │   │   ├── recommender.py     # Multi-Criteria Decision Model (MCDM)
│   │   │   └── weather_service.py # Live Open-Meteo forecast API
│   │   └── utils/
│   │       ├── cost_estimator.py  # Rule-based INR budget split
│   │       └── seed_data.py       # 30+ Curated tourist spots dataset
│   ├── tests/                     # 12 Pytest unit & integration tests
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/            # Navbar, Footer, MapComponent, WeatherCard, BudgetSummary, ItineraryDayCard, ChatDrawer, PlaceCard
│   │   ├── context/               # AuthContext.jsx
│   │   ├── pages/                 # Landing, Login, Register, Dashboard, TripPlanner, ItineraryView, SavedTrips, ExplorePlaces, Profile
│   │   ├── services/              # api.js fetch client
│   │   ├── App.jsx
│   │   ├── index.css              # Modern responsive CSS design system
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Start the Backend API (FastAPI)
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
- API Swagger Docs: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/health`

### 2. Run Backend Automated Tests
```bash
pytest backend/tests/ -v
```

### 3. Start the Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
- Open `http://localhost:5173` in your browser.

---

## 🎓 Viva & Technical Evaluation Cheat Sheet

| Question | Answer Summary |
| :--- | :--- |
| **How is hallucination prevented?** | By strictly enforcing RAG (Retrieval-Augmented Generation). Verified attractions from the database and live weather from Open-Meteo are fetched first and injected as ground-truth facts into the prompt. |
| **Why use FastAPI over Flask/Django?** | FastAPI offers native asynchronous concurrency, automated OpenAPI documentation generation, and strict data validation via Pydantic v2 schemas. |
| **How does the Recommender rank places?** | It uses a Multi-Criteria Decision Model (MCDM) combining 4 weighted factors: Interest similarity (Cosine distance), Budget compatibility (exponential penalty), Weather viability (precipitation scoring), and Historical ratings. |
| **How are spatial routes computed?** | The Haversine distance formula calculates the great-circle spherical distance between latitude/longitude points, which is then fed into dynamic transit estimation rules. |
