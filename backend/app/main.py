from datetime import datetime, timezone

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.projects.routes import router as projects_router


app = FastAPI(
    title="HUGZNETS API",
    description="Web development and deployment platform powered by HUMSEC.",
    version="0.1.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(projects_router)


@app.get("/")
def home():
    return {
        "name": "HUGZNETS",
        "message": "Welcome to the HUGZNETS API",
        "status": "online",
        "powered_by": "HUMSEC Developers",
    }


@app.get("/api/health")
def health_check():
    return {
        "name": "HUGZNETS",
        "status": "online",
        "service": "backend",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "powered_by": "HUMSEC Developers",
    }


@app.get("/api/platform")
def platform_info():
    return {
        "platform": "HUGZNETS",
        "purpose": "Web development and deployment",
        "features": [
            "Project management",
            "Build automation",
            "Deployment management",
            "Domain management",
            "Deployment logs",
            "HUGZ AI assistance",
        ],
        "status": "development",
    }
