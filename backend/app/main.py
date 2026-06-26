from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="SaplyAI Backend",
    description="Backend API for SaplyAI Interview Simulator",
    version="1.0.0"
)

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "Welcome to SaplyAI Backend",
        "status": "running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }