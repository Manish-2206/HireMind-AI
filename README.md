````md
# HireMind AI — AI Resume Screening System

HireMind AI is a full-stack AI-powered Applicant Tracking System (ATS) designed to automate resume screening, semantic candidate matching, skill extraction, and recruiter analytics.

The platform allows recruiters to upload multiple resumes and compare candidates against a job description using NLP embeddings and AI-based semantic matching.

---

# Features

- Multi-resume upload system
- AI semantic resume matching
- NLP-based skill extraction
- Candidate ranking engine
- Resume PDF viewer
- Recruiter dashboard
- Interactive frontend UI
- FastAPI REST APIs
- Resume analytics
- Match score calculation
- Missing skill detection
- Matched skill identification

---

# Tech Stack

## Frontend

- React.js
- Vite
- Axios

## Backend

- FastAPI
- Python
- Uvicorn

## AI / NLP

- Sentence Transformers
- all-MiniLM-L6-v2
- Cosine Similarity
- Scikit-learn

## PDF Processing

- PDFPlumber

---

# Project Workflow

```txt
Recruiter Uploads Resumes
            ↓
Resume Text Extraction
            ↓
NLP Skill Detection
            ↓
Semantic Embedding Generation
            ↓
AI Similarity Matching
            ↓
Candidate Ranking & Analytics
```
````

---

# Folder Structure

```txt
HireMind-AI/
│
├── backend/
│   ├── app/
│   ├── uploads/
│   ├── requirements.txt
│   └── main.py
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── screenshots/
│
├── README.md
└── .gitignore
```

---

# Installation Guide

# Backend Setup

```bash
cd backend
```

Create virtual environment:

```bash
python -m venv venv
```

Activate virtual environment:

### Windows

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run FastAPI server:

```bash
uvicorn app.main:app --reload
```

Backend runs on:

```txt
http://127.0.0.1:8000
```

---

# Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run frontend:

```bash
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```

---

# API Endpoint

## Rank Multiple Resumes

```http
POST /rank-resumes/
```

### Input

- Multiple PDF resumes
- Job description text

### Output

- Ranked candidates
- Match percentage
- Matched skills
- Missing skills
- Candidate summaries
- Resume viewing URLs

---

# Example Job Description

```txt
Looking for a Python developer with React, SQL, Git, Docker, FastAPI, NLP, Machine Learning, and cloud deployment experience.
```

---

# AI Matching Logic

The system uses:

- Sentence Transformers embeddings
- Semantic similarity
- Cosine similarity scoring
- NLP keyword extraction

to compare resumes with job descriptions intelligently instead of relying only on exact keyword matching.

---

# Current Features Implemented

- Resume upload
- Multiple candidate processing
- Semantic AI ranking
- Resume parsing
- Recruiter dashboard
- Resume viewer
- Match analytics
- Interactive frontend
- REST API backend

---

# Future Improvements

- JWT authentication
- Recruiter login system
- MongoDB/PostgreSQL integration
- Resume database storage
- Email notifications
- Cloud deployment
- Docker support
- AI interview assistant
- Candidate shortlisting system
- Advanced recruiter analytics

---

# Screenshots

Add screenshots of:

- Dashboard
- Resume rankings
- Candidate analytics
- Resume viewer

inside:

```txt
screenshots/
```

and include them here later.

---

# Author

## Manish Baliji

AI/ML & Full Stack Developer

GitHub:
[https://github.com/Manish-2206](https://github.com/Manish-2206)

---

# License

This project is for educational and portfolio purposes.

```

```
