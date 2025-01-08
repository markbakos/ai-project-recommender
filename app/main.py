from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from .project_scraper import ProjectScraper
from .recommendation_model import Recommender
from datetime import datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

scraper = ProjectScraper()
recommender = Recommender()

class ProjectResponse(BaseModel):
    name: str
    description: str
    url: str
    stars: int
    language: str
    topics: List[str]
    last_updated: datetime


class FeedbackRequest(BaseModel):
    project_url: str
    feedback: str


@app.get("/")
async def root():
    return {"message": "Project Recommender API is running"}


@app.get("/recommend/", response_model=List[ProjectResponse])
async def get_recommendations(tags: str, min_stars: int, max_stars: int):
    """
    Get project recommendations based on tags.
    Tags should be comma-separated, e.g. 'python,machine-learning'
    """
    try:
        tag_list = [tag.strip() for tag in tags.split(",")]
        projects = scraper.search_projects(tag_list, min_stars, max_stars)

        recommended_projects = recommender.recommend_projects(projects, n=3)

        return recommended_projects
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/feedback/")
async def submit_feedback(feedback_request: FeedbackRequest, tags: str, min_stars: int, max_stars: int):
    """
    Submit feedback for a project to improve recommendations.
    Feedback should be one of: 'like', 'dislike', 'maybe'
    """
    try:
        if feedback_request.feedback.lower() not in ['like', 'dislike', 'maybe']:
            raise HTTPException(
                status_code=400,
                detail="Feedback must be one of: 'like', 'dislike', 'maybe'"
            )

        tag_list = [tag.strip() for tag in tags.split(",")]
        projects = scraper.search_projects(tag_list, min_stars, max_stars)

        project = next(
            (p for p in projects if p.url == feedback_request.project_url),
            None
        )

        if not project:
            raise HTTPException(
                status_code=404,
                detail=f"Project not found with URL: {feedback_request.project_url}"
            )

        recommender.update_model(project, feedback_request.feedback)

        return {"message": "Feedback received successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/save-model/")
async def save_model():
    """Save the current model state"""
    try:
        recommender.save_model("recommender_model.pkl")
        return {"message": "Model saved successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/load-model/")
async def load_model():
    """Load the saved model state"""
    try:
        global recommender
        recommender = Recommender.load_model("recommender_model.pkl")
        return {"message": "Model loaded successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))