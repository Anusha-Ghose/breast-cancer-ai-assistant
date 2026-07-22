# Halcyon — Breast Health Copilot

Cloud-based multimodal AI healthcare assistant, specialized for breast cancer report
analysis: mammogram findings, biopsy/pathology reports, tumor-marker bloodwork, and
handwritten prescriptions, turned into plain-language, personalized health insights.

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
