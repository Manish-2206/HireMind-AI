from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

import shutil
import os
import pdfplumber

from app.skills import SKILLS

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "uploads"

# Create uploads folder
os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True
)

# Serve uploaded resumes
app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)


@app.get("/")
def home():

    return {
        "message": "HireMind AI Running"
    }


# Extract PDF text
def extract_text_from_pdf(file_path):

    extracted_text = ""

    with pdfplumber.open(file_path) as pdf:

        for page in pdf.pages:

            text = page.extract_text()

            if text:

                extracted_text += (
                    text + "\n"
                )

    return extracted_text.lower()


# Extract skills
def extract_skills(text):

    found_skills = []

    for skill in SKILLS:

        if skill.lower() in text:

            found_skills.append(skill)

    return found_skills


# Generate summary
def generate_candidate_summary(
    skills,
    score
):

    if score >= 75:

        level = "Strong Match"

    elif score >= 50:

        level = "Moderate Match"

    else:

        level = "Low Match"

    if len(skills) >= 8:

        profile = (
            "Well-rounded technical profile"
        )

    elif len(skills) >= 4:

        profile = (
            "Good technical background"
        )

    else:

        profile = (
            "Limited technical exposure"
        )

    return f"{level} - {profile}"


# Rank resumes API
@app.post("/rank-resumes/")
async def rank_resumes(

    files: list[UploadFile] = File(...),
    job_description: str = Form(...)

):

    results = []

    jd_text = (
        job_description.lower()
    )

    # Extract JD skills
    jd_skills = extract_skills(
        jd_text
    )

    # Prevent empty JD skills
    if len(jd_skills) == 0:

        return {
            "error":
            "No valid skills found in job description"
        }

    for file in files:

        # Save resume
        file_path = os.path.join(
            UPLOAD_FOLDER,
            file.filename
        )

        with open(
            file_path,
            "wb"
        ) as buffer:

            shutil.copyfileobj(
                file.file,
                buffer
            )

        # Extract text
        resume_text = (
            extract_text_from_pdf(
                file_path
            )
        )

        # Extract resume skills
        resume_skills = (
            extract_skills(
                resume_text
            )
        )

        # Skip empty resumes
        if len(resume_skills) == 0:
            continue

        # TF-IDF similarity
        documents = [

            " ".join(jd_skills),

            " ".join(resume_skills)
        ]

        vectorizer = TfidfVectorizer()

        tfidf_matrix = vectorizer.fit_transform(
            documents
        )

        similarity_score = cosine_similarity(

            tfidf_matrix[0:1],
            tfidf_matrix[1:2]

        )[0][0]

        semantic_match_percentage = round(
            float(similarity_score) * 100,
            2
        )

        # Matched skills
        matched_skills = list(
            set(resume_skills)
            &
            set(jd_skills)
        )

        # Missing skills
        missing_skills = list(
            set(jd_skills)
            -
            set(resume_skills)
        )

        # Candidate name
        candidate_name = (
            os.path.splitext(
                file.filename
            )[0]
        )

        # Summary
        summary = (
            generate_candidate_summary(
                resume_skills,
                semantic_match_percentage
            )
        )

        # Store result
        results.append({

            "candidate_name":
            candidate_name,

            "match_percentage":
            semantic_match_percentage,

            "matched_skills":
            matched_skills,

            "missing_skills":
            missing_skills,

            "all_skills":
            resume_skills,

            "summary":
            summary,

            "resume_file":
            file.filename,

            "resume_url":
            f"https://hiremind-ai-backend-gn8t.onrender.com/uploads/{file.filename}"
        })

    # Sort results
    ranked_results = sorted(

        results,

        key=lambda x:
        x["match_percentage"],

        reverse=True
    )

    # Prevent empty results
    if len(ranked_results) == 0:

        return {
            "error":
            "No valid resumes processed"
        }

    # Analytics
    total_candidates = (
        len(ranked_results)
    )

    average_match_score = round(

        sum(
            candidate["match_percentage"]
            for candidate in ranked_results
        ) / total_candidates,

        2
    )

    top_candidate = (
        ranked_results[0]
        ["candidate_name"]
    )

    top_score = (
        ranked_results[0]
        ["match_percentage"]
    )

    # Most common skills
    all_detected_skills = []

    for candidate in ranked_results:

        all_detected_skills.extend(
            candidate["all_skills"]
        )

    skill_frequency = {}

    for skill in all_detected_skills:

        if skill in skill_frequency:

            skill_frequency[skill] += 1

        else:

            skill_frequency[skill] = 1

    most_common_skills = sorted(

        skill_frequency,

        key=skill_frequency.get,

        reverse=True

    )[:5]

    return {

        "candidate_rankings":
        ranked_results,

        "analytics": {

            "total_candidates":
            total_candidates,

            "average_match_score":
            average_match_score,

            "top_candidate":
            top_candidate,

            "top_score":
            top_score,

            "most_common_skills":
            most_common_skills
        }
    }