# Multimodal AI Healthcare Assistant - Backend

A complete production-ready backend for a Cloud-Based Multimodal AI Healthcare Assistant.

## Tech Stack
- **Framework**: FastAPI (Python 3.11+)
- **Database**: MongoDB (Motor Async)
- **Vector DB**: ChromaDB
- **AI & NLP**: LangChain, Groq (LLaMA 3-70B)
- **OCR**: pdfplumber, pytesseract (Tesseract)
- **Security**: JWT Authentication (python-jose, bcrypt)

## Architecture Overview
The backend follows clean architecture:
- `app/api/`: FastAPI routers and endpoints.
- `app/core/`: Security and configuration.
- `app/db/`: MongoDB setup.
- `app/models/`: Pydantic schemas.
- `app/services/`: Core business logic (OCR, NLP extraction, RAG, Comparison).

## Database Collections (MongoDB)
- `users`: Stores user credentials, roles, and profiles.
- `reports`: Stores metadata, file paths, raw OCR text, and structured NLP entities.

## Getting Started

### 1. Environment Setup
Create a `.env` file in the root directory (where `docker-compose.yml` is located):
```
# Shared Environment Variables
GROQ_API_KEY=your_groq_key
MONGO_URI=mongodb://mongo:27017/healthcare_assistant
JWT_SECRET=super_secret_key
VECTOR_DB_PATH=./data/vectorstore
CORS_ORIGINS='["http://localhost", "http://localhost:80", "http://localhost:5173"]'
UPLOAD_DIR=./data/uploads

VITE_API_BASE_URL=http://localhost:8000/api
```

### 2. Docker Setup (Recommended)
You can run the entire stack (Frontend, Backend, and MongoDB) using Docker Compose:
```bash
docker compose up --build
```
- **Frontend** will be available at `http://localhost`.
- **Backend API** will be available at `http://localhost:8000`.
- **MongoDB** will be available on `localhost:27017`.

## API Documentation
Once the server is running, visit `http://localhost:8000/docs` for the interactive Swagger UI.

### Key Endpoints:
- **Auth**: `POST /api/auth/signup`, `POST /api/auth/login`
- **Upload**: `POST /api/reports/upload` (Supports digital PDFs, scanned images)
- **Reports**: `GET /api/reports/` (List all), `GET /api/reports/{id}`
- **Timeline**: `GET /api/trends/timeline` (Get historical lab values)
- **Compare**: `GET /api/trends/compare?id1=X&id2=Y` (AI summary of changes)
- **Chat**: `POST /api/chat` (RAG-powered conversational assistant)

## Structure

```
breast-cancer-ai-assistant/
├── frontend/   React + Vite + Tailwind CSS
└── backend/    FastAPI + OCR/NLP/LLM (Groq) + RAG pipeline
```

## Frontend — getting started

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Runs at `http://localhost:5173`. Pages included:

- **Overview** (`/`) — hero, product pillars
- **Upload** (`/upload`) — document type selection + dropzone
- **Report insights** (`/report`) — BI-RADS gauge, receptor status (ER/PR/HER2/Ki-67),
  tumor characteristics, confidence-scored extractions, plain-language summary
- **Trends** (`/trends`) — CA 15-3 and tumor-size timelines across visits
- **Assistant** (`/assistant`) — RAG-grounded chat interface
- Language switcher (English / Hindi / Tamil / Bengali) in the navbar

Currently wired to `src/data/mockData.js` for demo purposes — swap for live calls
in `src/services/api.js` once the backend is running.

## Backend — getting started

```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # add your GROQ_API_KEY
uvicorn main:app --reload
```

Runs at `http://localhost:8000`. Interactive docs at `/docs`.

Route stubs are in `app/api/`; service logic (OCR, NLP extraction, Groq LLM calls,
RAG retrieval, translation) lives in `app/services/` and is left as `NotImplementedError`
for you to fill in — the shape of each pipeline stage is documented in its docstring.

## Tech stack

| Layer | Choice |
|---|---|
| Frontend | React, Tailwind CSS, React Router, Recharts |
| Backend | FastAPI |
| OCR | Tesseract / EasyOCR |
| NLP | spaCy + LLM-assisted extraction |
| LLM | Groq (LLaMA 3.3-70B) |
| RAG | LangChain + Chroma vector store |
| Database | PostgreSQL (structured) + MongoDB (documents), via SQLAlchemy |
| Auth | JWT (python-jose) + bcrypt (passlib) |
