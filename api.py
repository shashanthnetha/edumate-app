from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import get_db
from groq import Groq
import models
from models import User, Question
from pydantic import BaseModel
from rag import PDFBrain # <--- NEW IMPORT
import os
import shutil

GROQ_API_KEY = os.environ.get("GROQ_API_KEY")# <--- PASTE YOUR KEY AGAIN!

app = FastAPI()

# Allow Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=GROQ_API_KEY)

# Initialize the Document Brain (Global Variable)
pdf_brain = PDFBrain()

# --- DATA MODELS ---
class StudentData(BaseModel):
    current_mastery: float
    is_correct: int

class QuestionData(BaseModel):
    student_question: str
    current_topic: str

# --- ENDPOINTS ---

# 1. UPLOAD PDF (New Feature)
@app.post("/upload_pdf")
async def upload_pdf(file: UploadFile = File(...)):
    # Save the file temporarily
    file_location = f"temp_{file.filename}"
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Process it
    num_chunks = pdf_brain.process_pdf(file_location)
    
    # Cleanup
    os.remove(file_location)
    
    return {"message": "PDF processed successfully", "chunks": num_chunks}

# 2. ASK TUTOR (Updated with RAG)
@app.post("/ask_tutor")
def ask_tutor(data: QuestionData):
    try:
        # Step A: Check if we have PDF context relevant to the question
        context_chunks = pdf_brain.search(data.student_question)
        context_text = "\n\n".join(context_chunks)
        
        # Step B: Create a smarter prompt
        if context_text:
            system_prompt = f"""
            You are a helpful tutor. Use the following CONTEXT from the student's textbook to answer.
            If the answer is in the context, cite it. If not, use your general knowledge.
            
            CONTEXT:
            {context_text}
            """
        else:
            system_prompt = f"You are a helpful tutor for {data.current_topic}. Do not give direct answers, guide the student."

        # Step C: Send to Groq
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": data.student_question},
            ],
            model="llama-3.3-70b-versatile",
        )
        return {"reply": chat_completion.choices[0].message.content}

    except Exception as e:
        return {"reply": f"SYSTEM ERROR: {str(e)}"}

# 3. GET QUIZ
@app.get("/get_quiz/{topic}")
def get_quiz(topic: str, db: Session = Depends(get_db)):
    print(f"🔎 API is looking for quiz topic: '{topic}'") # Debug print
    
    # Query the database for questions matching this topic
    questions = db.query(Question).filter(Question.topic == topic).all()
    
    if not questions:
        print(f"❌ No questions found for '{topic}'")
        raise HTTPException(status_code=404, detail=f"No questions found for topic: {topic}")
    
    print(f"✅ Found {len(questions)} questions!")
    return questions

# 4. DASHBOARD
# --- UPDATE THIS FUNCTION IN api.py ---
@app.get("/dashboard/{username}")
def get_dashboard(username: str, db: Session = Depends(get_db)):
    # 1. Get the User
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # 2. Calculate "Topics Mastered" (Mock logic for now, or check real mastery if we had a table)
    # For now, let's say every 100 XP = 1 Topic Mastered
    topics_mastered = int(user.xp / 100)

    # 3. Calculate "Global Rank"
    # Simple logic: Rank 1 is 1000XP. The higher the XP, the lower the rank number.
    # Base rank is 500, subtract user.xp
    rank = max(1, 500 - user.xp) 

    return {
        "username": user.username,
        "full_name": user.full_name,
        "xp": user.xp,
        "streak": user.streak_days,
        "topics_mastered": topics_mastered, # <--- NEW
        "global_rank": rank                 # <--- NEW
    }

# 5. PREDICT MASTERY
@app.post("/predict_mastery")
def predict(data: StudentData):
    # (Simple logic for now - normally imports BKT)
    new_score = data.current_mastery + 0.10 if data.is_correct else data.current_mastery - 0.05
    if new_score > 1.0: new_score = 1.0
    if new_score < 0.0: new_score = 0.0
    return {"new_mastery": new_score, "recommendation": "Keep going!"}

# --- ADD THIS TO api.py ---

@app.get("/topics/{username}")
def get_all_topics(username: str):
    # This simulates fetching from a database of courses
    return [
        {"id": 1, "title": "Python Loops & Logic", "desc": "Master while/for loops", "category": "Beginner", "progress": 65, "status": "active", "icon": "code"},
        {"id": 2, "title": "Data Structures 101", "desc": "Lists, Sets & Tuples", "category": "Intermediate", "progress": 10, "status": "unlocked", "icon": "database"},
        {"id": 3, "title": "Object-Oriented Py", "desc": "Classes and Inheritance", "category": "Intermediate", "progress": 0, "status": "locked", "icon": "box"},
        {"id": 4, "title": "FastAPI Backend", "desc": "Building APIs with Python", "category": "Advanced", "progress": 0, "status": "locked", "icon": "server"},
        {"id": 5, "title": "AI Integration", "desc": "Using LLMs in apps", "category": "Expert", "progress": 0, "status": "locked", "icon": "brain"},
        {"id": 6, "title": "React Frontend", "desc": "Modern UI components", "category": "Beginner", "progress": 0, "status": "locked", "icon": "layout"},
    ]