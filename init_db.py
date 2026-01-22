from database import engine, Base
import models # Import the file we just made

# This command looks at models.py and creates the tables
print("Creating database tables...")
Base.metadata.create_all(bind=engine)
print("✅ Tables created successfully! 'edumate.db' is ready.")