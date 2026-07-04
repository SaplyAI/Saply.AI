import os
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

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

groq_client = Groq(api_key=os.environ.get("GROQ_API_KEY")) if os.environ.get("GROQ_API_KEY") else None


def build_fallback_question(interview_type: str, role: str, resume_text: str = "") -> str:
    if interview_type == "hr":
        return "Tell me about a time you worked with a team through a difficult situation and how you handled it."
    if resume_text:
        return f"Based on your resume, walk me through one project you are most proud of and explain your contribution."
    return f"Tell me about a recent project or coursework experience relevant to an entry-level {role} role."

class Message(BaseModel):
    role: str      # "assistant" (the AI) or "user" (the candidate)
    content: str

class ChatRequest(BaseModel):
    interview_type: str
    role: str
    chat_history: list[Message]

@app.get("/")
def root():
    return {"message": "Welcome to SaplyAI Backend", "status": "running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.post("/api/start-interview")
async def start_interview(
    interview_type: str = Form(...),  # "technical" or "hr"
    role: str = Form(...),            # "SDE", "AI/ML Engineer", etc.
    resume: UploadFile = File(None)   
):
    """Initializes the interview session with targeted difficulty levels based on track."""
    resume_text = ""
    if resume and interview_type == "technical":
        try:
            bytes_content = await resume.read()
            resume_text = bytes_content.decode("utf-8", errors="ignore")[:1500]
        except Exception:
            resume_text = ""

    # 1. Branch the system prompt based on HR vs Technical
    if interview_type == "hr":
        system_prompt = (
            "You are a friendly HR Recruiter conducting a campus placement interview for a graduating 4th-year college student. "
            "Your goal is to evaluate behavioral and situational traits (e.g., teamwork, conflict resolution, time management, adaptability). "
            "CRITICAL: Do NOT ask any technical, coding, or system design questions. Only ask standard, classic behavioral interview questions. "
            "Ask exactly ONE clear question at a time. No conversational filler or introductory greetings."
        )
    else:
        # Technical track calibrated for 4th-year placements / internships
        system_prompt = (
            f"You are a supportive, practical Technical Interviewer conducting a 4th-year college campus placement interview for an entry-level {role} role. "
            f"Calibrate your difficulty to a graduating student who has completed basic internships. Do NOT ask overly complex, elite, or hyper-abstract architecture questions. "
            f"Focus on core data structures, algorithms, foundational concepts of {role}, and practical scenarios you'd encounter in an internship. "
            f"Ask exactly ONE clear question at a time. No conversational filler or introductory greetings."
        )
        if resume_text:
            system_prompt += f" Base your opening question entirely on the student's internship experience or projects mentioned here: {resume_text}"
        else:
            system_prompt += f" Start with a standard, approachable opening technical question or project walkthrough relevant to a 4th-year {role} applicant."

    if groq_client is None:
        first_question = build_fallback_question(interview_type, role, resume_text)
    else:
        try:
            completion = groq_client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": "Hello, I am ready to begin the interview."}
                ],
                temperature=0.6
            )
            first_question = completion.choices[0].message.content
        except Exception as e:
            first_question = f"Error generating opening question: {str(e)}"

    return {
        "success": True,
        "first_question": first_question
    }


@app.post("/api/next-question")
async def next_question(payload: ChatRequest):
    """Evaluates the candidate's answer and continues the conversation at an appropriate 4th-year level."""
    
    if payload.interview_type == "hr":
        system_prompt = (
            "You are an HR Recruiter conducting a behavioral campus placement interview. "
            "Evaluate the candidate's response. Ask exactly ONE follow-up behavioral question. "
            "Keep it focused on soft skills, workplace situations, and behavioral competencies. "
            "STRICTLY FORBIDDEN: Do not ask any technical or coding questions under any circumstances. "
            "Do not give explicit feedback or say things like 'Great answer!'"
        )
    else:
        system_prompt = (
            f"You are a Technical Interviewer conducting a campus placement interview for an entry-level {payload.role} role. "
            f"Maintain an encouraging but professional tone suitable for a 4th-year college student. "
            f"If their last answer was brief, guide them gently or ask an approachable, conversational technical follow-up. "
            f"If they answered well, dig just one level deeper into the practical implementation or project details, then gracefully transition to a different standard 4th-year competency. "
            f"Do NOT give academic grades, explicit scores, or conversational meta-filler. Ask exactly ONE clear question."
        )
    
    messages = [{"role": "system", "content": system_prompt}]
    
    for msg in payload.chat_history:
        messages.append({"role": msg.role, "content": msg.content})
        
    if groq_client is None:
        next_q = build_fallback_question(payload.interview_type, payload.role)
    else:
        try:
            completion = groq_client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=messages,
                temperature=0.5
            )
            next_q = completion.choices[0].message.content
        except Exception as e:
            next_q = f"Error generating next question: {str(e)}"
        
    return {
        "success": True,
        "next_question": next_q
    }