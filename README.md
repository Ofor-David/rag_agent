# HOD Automated Q&A System

AI-powered Question and Answer system for the **Department of Computer Science, Nnamdi Azikiwe University (UNIZIK)**.

Developed for **CSC 309 – Artificial Intelligence** under **Dr. Alade** by **Group 8**.

This system automatically answers frequently asked departmental questions using **Artificial Intelligence, Natural Language Processing (NLP), and Retrieval-Augmented Generation (RAG)**.

---

# Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Project Aim](#project-aim)
- [Objectives](#objectives)
- [Scope of the Study](#scope-of-the-study)
- [Significance](#significance)
- [System Architecture](#system-architecture)
- [Methodology](#methodology)
- [Technology Stack](#technology-stack)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Evaluation Metrics](#evaluation-metrics)
- [Expected Impact](#expected-impact)
- [Definitions](#definitions)
- [Reference](#reference)

---

# Overview

Students frequently visit the **Head of Department (HOD)** to ask repetitive questions related to:

- Final year requirements  
- Graduation procedures  
- Project submission  
- Clearance processes  
- Carry-over courses  
- Extra-year policies  

These repeated inquiries lead to long waiting times and administrative overload.

This project proposes an **AI-powered automated Q&A system** that provides **instant responses to common departmental questions** through a web interface.

The system retrieves verified information from a structured knowledge base and generates accurate answers using a language model.

---

# Problem Statement

Within the Computer Science Department at UNIZIK:

- **2–3 students visit the HOD daily** with similar inquiries
- Students wait **approximately 90 minutes** before receiving assistance
- This results in **270 minutes of lost time daily**
- And **1,350 minutes (22.5 hours) wasted weekly**

Currently, there is **no automated system** that provides instant access to departmental academic information.

---

# Project Aim

To design and implement an **AI-powered Question and Answer system** that automates responses to frequently asked departmental questions.

---

# Objectives

The project aims to:

- Collect and organize frequently asked student questions
- Develop an **NLP-based question processing module**
- Implement a **retrieval-based answer engine**
- Design a **simple and user-friendly interface**
- Evaluate system accuracy and performance

---

# Scope of the Study

The system focuses on **academic departmental inquiries**, including:

- Graduation requirements
- Project submission guidelines
- Course registration
- Clearance procedures
- Carry-over policies
- Extra-year procedures

The system **does not replace official administrative decisions** and will not handle unrelated personal questions.

---

# Significance

### Students
- Faster access to academic information
- Reduced waiting time

### HOD and Staff
- Reduced repetitive inquiries
- Increased productivity

### Department
- Improved operational efficiency
- Better information flow

### Researchers
- Reference for future **AI-based academic information systems**

---

# System Architecture

The system follows a **Retrieval-Augmented Generation (RAG)** architecture.

![System Architecture](/public/architecture.png)

---

# Methodology

## 1. Data Collection

Departmental data such as:

- Frequently Asked Questions
- Graduation policies
- Project clearance requirements
- Extra-year procedures

Data is structured in **JSON format**:

```json
  {
    "question": "Where do I submit clearance documents?",
    "answer": "Departmental academic office or designated submission point.",
    "category": "Clearance"
  },
```

---

## 2. Data Preprocessing

The dataset is cleaned and prepared by:

- Removing duplicate entries
- Fixing grammar
- Ensuring consistent formatting
- Categorizing questions

---

## 3. Embedding Generation

Text embeddings are generated using:

```
gemini-embedding-001
```

Embeddings convert text into **numeric vectors** that capture semantic meaning.

---

## 4. Vector Storage

Embeddings are stored in **Qdrant Cloud** (a vector database service).

This enables **semantic similarity search** — finding answers based on meaning, not just keywords.

---

## 5. Query Processing

When a student submits a question:

1. The input text is cleaned
2. An embedding vector is generated
3. The vector database is searched for the most similar entries

---

## 6. Answer Generation

The retrieved context is passed to Gemini 2.0 Flash

The LLM generates an answer **based only on the retrieved context** to prevent hallucinations.

---

## 7. User Interface

The system provides a **web-based interface** where students can:

- Enter questions
- Receive instant responses
- Flag incorrect answers

Optional:

- Admin dashboard for managing the knowledge base.

---

# Technology Stack

| Component | Technology |
|--------|--------|
| Language | TypeScript |
| Runtime | Node.js |
| Framework | Express.js |
| Embeddings | gemini-embedding-001 |
| LLM | gemini-2.5-flash-lite |
| Vector Database | Qdrant Cloud |
| Data Format | JSON |
| Deployment | Render / Railway |

---

# API Endpoints

## Ask Question

```
POST /api/v1/ask
```

Request

```json
{
  "question": "What are the requirements to clear final year?"
}
```

Response

```json
{
  "status": "success",
  "answer": "...",
  "sources": [],
  "response_time_ms": 843
}
```

---

## Flag an Answer

```
POST /api/v1/flag
```

Allows students to report incorrect answers for HOD review.

---

## Ingest Knowledge Base (Admin)

```
POST /api/v1/admin/ingest
```

Uploads and embeds the knowledge base.

---

## Retrieve Flagged Answers

```
GET /api/v1/admin/flags
```

Returns answers flagged by students.

---

## Health Check

```
GET /api/v1/health
```

Confirms that the server and vector database are operational.

---

# Project Structure

```
backend/
├── src/
│   ├── server.ts
│   ├── test.ts
│   ├── list_models.ts
│   ├── routes/
│   │   ├── ask.ts
│   │   ├── flag.ts
│   │   ├── admin.ts
│   │   └── health.ts
│   │
│   ├── pipeline/
│   │   ├── preprocess.ts
│   │   ├── embed.ts
│   │   ├── search.ts
│   │   └── generate.ts
│   │
│   ├── vectordb/
│   │   ├── quadrant.ts
│   │   ├── ingest.ts
│   │   └── run_ingest.ts
│   │
│   ├── middleware/
│   │   └── adminAuth.ts
│   │
│   └── utils/
│       ├── logger.ts
│       ├── loader.ts
│       ├── types.ts
│       └── response.ts
│
├── data/
│   └── knowledge_base.json
│
├── logs/
│   ├── flags.json
│   └── query_log.json
│
├── .env
├── package.json
├── tsconfig.json
└── README.md

index.html              (frontend, in project root)
```

---

# Evaluation Metrics

The system will be evaluated using:

- **Answer Accuracy** – correctness of responses
- **Response Relevance** – alignment with the user’s question
- **Response Time** – system response speed
- **User Feedback** – flagged answers for improvement

---

# Expected Impact

The system aims to:

- Reduce student waiting time from **90 minutes to near zero**
- Save **over 22 hours of student time weekly**
- Reduce administrative workload on the HOD
- Provide a scalable academic support system

---

# Definitions

**Artificial Intelligence (AI)**  
A field of computing focused on creating systems capable of performing tasks requiring human intelligence.

**Natural Language Processing (NLP)**  
A branch of AI that enables machines to understand human language.

**Retrieval-Based Model**  
A system that retrieves answers from a predefined knowledge base.

**Retrieval-Augmented Generation (RAG)**  
An AI approach that combines knowledge retrieval with language model generation.

**Vector Database**  
A database optimized for storing and searching embeddings.

**Semantic Search**  
Search based on meaning rather than exact keywords.

---

# Reference

Byun et al. (2024) proposed a production-oriented **RAG-based question answering system** that integrates vector search and language models to reduce hallucinations and improve answer relevance.