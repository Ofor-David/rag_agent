# HOD Q&A System

An AI-powered Question & Answer system for the Department of Computer Science, Nnamdi Azikiwe University. Students can ask departmental questions and receive instant, accurate answers — without waiting for the HOD.

Built with **TypeScript · Express · Gemini AI · ChromaDB**.

---

## How it works

A student types a question. The system cleans it, converts it to a semantic vector using Google's embedding model, searches the knowledge base for the most relevant answers, and passes the results to Gemini to generate a natural language response. The whole process takes 2–5 seconds versus a 90-minute HOD wait.

```
Question → Preprocess → Embed → Vector Search → Retrieve Context → Generate Answer
```

---

## Prerequisites

Make sure you have all of the following installed before continuing.

| Requirement | Version | Check |
|---|---|---|
| Node.js | 18 or higher | `node -v` |
| npm | 9 or higher | `npm -v` |
| Python | 3.8 or higher | `python3 --version` |
| pip | any | `pip --version` |
| Git | any | `git --version` |

---

## 1. Get your Gemini API key

The system uses Google's Gemini API for both embeddings and answer generation. It is free with no credit card required.

**Important:** You must create the key from AI Studio, not from Google Cloud Console. A Cloud Console key will give a `403 PERMISSION_DENIED` error.

1. Open **https://aistudio.google.com/apikey** in your browser
2. Sign in with a Google account
3. Click **Create API key**
4. On the dialog that appears, click **Create API key in new project** — do not link it to an existing Cloud project
5. Copy the key that appears. It starts with `AIza...`
6. Store it somewhere safe — you will need it in Step 4

---

## 2. Clone the repository

```bash
git clone https://github.com/your-username/hod-qa-backend.git
cd hod-qa-backend
```

---

## 3. Install Node.js dependencies

```bash
npm install
```

---

## 4. Configure environment variables

Create a `.env` file at the project root:

```bash
cp .env.example .env
```

Or create it manually and paste the following:

```env
# Server
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://127.0.0.1:5500

# Admin
ADMIN_API_KEY=your-secret-admin-key

# Google Gemini — paste your AI Studio key here
GEMINI_API_KEY=AIza...

QDRANT_URL=https://3514eb48-9fa4-4909-9e66-bc12bc1c85c6.us-east4-0.gcp.cloud.qdrant.io
QDRANT_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIiwiZXhwIjoxODQzMDQxNjM2fQ.8fqu4uuS7deCEw5S6aRnLlUFv--KPYJjPKkkVCwscGI
QDRANT_COLLECTION=hod_knowledge_base

# Pipeline
TOP_K_RESULTS=3
```

Replace `GEMINI_API_KEY` with the key you copied in Step 1.

---

## 5. Start ChromaDB (optional — only needed for local development)

If using **Qdrant Cloud** (the default), skip this step.

For local ChromaDB development instead:

```bash
pip install chromadb
chroma run
```

Keep this terminal open. ChromaDB will run on port 8000.

---

## 6. Run knowledge base ingestion

Ingestion reads `data/knowledge_base.json`, converts each entry into an embedding vector using Gemini, and stores it in ChromaDB. You only need to run this once — or again whenever you update the knowledge base.

```bash
npm run ingest
```

Expected output:

```
Loaded 100 knowledge base entries.
No existing collection found, creating fresh.
Embedded 1/100: Clearance
Embedded 2/100: Graduation
...
Embedded 100/100: General

Ingestion complete. Inserted: 100, Skipped: 0
```

If you see `Skipping entry due to error` messages, check that:
- Your `GEMINI_API_KEY` in `.env` is correct
- The ChromaDB server is running on port 8000
- You created the key from AI Studio, not Google Cloud Console

---

## 7. Start the backend server

Open a new terminal (keep the ChromaDB terminal running):

```bash
npm run dev
```

You should see:

```
Server running on http://localhost:3001
```

---

## 8. Open the frontend

Open `index.html` directly in your browser. No build step or server needed.

On most systems you can do:

```bash
# macOS
open index.html

# Linux
xdg-open index.html

# Windows
start index.html
```

Or simply drag the file into a browser window.

You should see the HOD Q&A interface. Type a question and click **Ask**.

---

## API endpoints

All endpoints are prefixed with `/api/v1`.

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/health` | Server and DB liveness check | None |
| `POST` | `/ask` | Submit a question, get an AI answer | None |
| `POST` | `/flag` | Flag an answer for HOD review | None |
| `POST` | `/admin/ingest` | Re-ingest the knowledge base | `X-Admin-Key` header |
| `GET` | `/admin/flags` | List all flagged answers | `X-Admin-Key` header |

### Test with curl

```bash
# Health check
curl http://localhost:3001/api/v1/health

# Ask a question
curl -X POST http://localhost:3001/api/v1/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "What are the requirements to clear final year?"}'

# Flag an answer
curl -X POST http://localhost:3001/api/v1/flag \
  -H "Content-Type: application/json" \
  -d '{"question": "test?", "answer": "test answer", "reason": "seems wrong"}'

# View flagged answers (admin)
curl http://localhost:3001/api/v1/admin/flags \
  -H "X-Admin-Key: your-secret-admin-key"

# Trigger re-ingestion (admin)
curl -X POST http://localhost:3001/api/v1/admin/ingest \
  -H "X-Admin-Key: your-secret-admin-key"
```

---

## Project structure

```
backend/
├── src/
│   ├── server.ts              Express app entry point
│   ├── test.ts                Manual pipeline test script
│   ├── list_models.ts         Debug: list available Gemini models
│   ├── routes/
│   │   ├── health.ts          GET /api/v1/health
│   │   ├── flag.ts            POST /api/v1/flag
│   │   ├── ask.ts             POST /api/v1/ask
│   │   └── admin.ts           POST /api/v1/admin/*
│   ├── pipeline/
│   │   ├── preprocess.ts      Step 1 — clean question text
│   │   ├── embed.ts           Step 2 — Gemini embedding
│   │   ├── search.ts          Step 3-4 — vector search + context retrieval
│   │   └── generate.ts        Step 5 — Gemini answer generation
│   ├── vectordb/
│   │   ├── quadrant.ts        Qdrant Cloud adapter
│   │   ├── ingest.ts          Ingestion pipeline (Qdrant)
│   │   └── run_ingest.ts      Script entrypoint for npm run ingest
│   ├── middleware/
│   │   └── adminAuth.ts       X-Admin-Key header check
│   └── utils/
│       ├── response.ts        sendError / sendSuccess helpers
│       ├── loader.ts          Reads and validates knowledge_base.json
│       ├── types.ts           Shared TypeScript interfaces
│       └── logger.ts          Query logging to logs/query_log.json
├── data/
│   └── knowledge_base.json     Departmental FAQ source data
├── logs/
│   ├── flags.json              Student-flagged answers (auto-created)
│   └── query_log.json         All Q&A interactions (auto-created)
├── index.html                  Frontend — open directly in browser
├── .env                        Environment variables (never commit)
├── .env.example                Template for .env
├── .gitignore
├── tsconfig.json
└── package.json
```

---

## npm scripts

| Script | Command | Description |
|---|---|---|
| `npm run dev` | `npx tsx src/server.ts` | Start dev server |
| `npm run build` | `tsc` | Compile TypeScript to `dist/` |
| `npm run start` | `node dist/server.js` | Run compiled production build |
| `npm run ingest` | `npx tsx src/vectordb/run_ingest.ts` | Ingest knowledge base into Qdrant |
| `npm run test` | `npx tsx src/test.ts` | Test each pipeline stage individually |
| `npm run list-models` | `npx tsx src/list_models.ts` | List available Gemini models |

---

## Updating the knowledge base

The knowledge base lives in `data/knowledge_base.json`. Each entry has three fields:

```json
[
  {
    "question": "What are the requirements to clear final year?",
    "answer": "You must complete all registered courses, submit your final year project, pay all outstanding fees, and obtain clearance from the library and departmental secretary.",
    "category": "Clearance"
  }
]
```

Valid categories are: `Graduation`, `Project`, `Clearance`, `Registration`, `Extra-Year`, `General`.

After editing the file, re-run ingestion:

```bash
npm run ingest
```

---

## Deployment

Deployment support is coming. For now the project runs fully locally.

To share a demo, run the backend locally and open `index.html` in any browser on the same machine.

---

## Troubleshooting

**`API key should be set when using the Gemini API`**  
Your `.env` file is not being loaded before the Gemini client initializes. Make sure `import 'dotenv/config'` is the first line in your entry file.

**`403 PERMISSION_DENIED — ACCESS_TOKEN_SCOPE_INSUFFICIENT`**  
Your API key was created from Google Cloud Console instead of AI Studio. Go to **aistudio.google.com/apikey**, create a new key in a new project, and replace it in `.env`.

**`404 — models/text-embedding-004 is not found`**  
Wrong model name for the current SDK version. The correct model is `gemini-embedding-001`.

**`Cannot find module ... /routes/health`**  
TypeScript module resolution is misconfigured. Make sure `tsconfig.json` has `"module": "NodeNext"` and `"moduleResolution": "NodeNext"`, and all local imports end with `.js`.

**Page reloads when submitting a question or flag**  
Add `e.preventDefault()` to the button click handlers in `index.html`.

---

## Built by

CSC 309 — Artificial Intelligence | Group 8  
Department of Computer Science, Nnamdi Azikiwe University  
Supervisor: Dr. Alade