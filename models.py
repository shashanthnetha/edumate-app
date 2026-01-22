from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base
import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    full_name = Column(String)
    xp = Column(Integer, default=0)
    streak_days = Column(Integer, default=0)
    last_login = Column(DateTime, default=datetime.datetime.utcnow)

class Question(Base):
    __tablename__ = "questions"
    id = Column(Integer, primary_key=True, index=True)
    
    # --- WE ADDED THIS LINE: ---
    topic = Column(String, index=True) 
    # ---------------------------

    text = Column(String)
    option_a = Column(String)
    option_b = Column(String)
    option_c = Column(String)
    correct_option = Column(String)  # Stores "A", "B", or "C"

class UserProgress(Base):
    __tablename__ = "progress"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    topic = Column(String)
    mastery_score = Column(Float, default=0.0)
    
    user = relationship("User")