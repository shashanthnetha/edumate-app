from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 1. DATABASE FILE
# This will create a file named "edumate.db" in your folder.
# It acts like a mini-server.
SQLALCHEMY_DATABASE_URL = "sqlite:///./edumate.db"

# 2. CREATE THE ENGINE
# The "check_same_thread" argument is needed only for SQLite.
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# 3. CREATE THE SESSION FACTORY
# This creates "sessions" (conversations) with the database.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 4. BASE MODEL
# All our tables (Users, Questions) will inherit from this.
Base = declarative_base()

# 5. DEPENDENCY
# This function helps the API get a database connection when needed.
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

print("✅ Database setup complete. Ready to create tables.")