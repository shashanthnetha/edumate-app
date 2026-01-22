from database import SessionLocal, engine
from models import User, Topic, Base

# 1. Start a conversation with the database
db = SessionLocal()

# 2. Check if we already have data (so we don't add duplicates)
existing_user = db.query(User).filter(User.username == "naga").first()

if not existing_user:
    # 3. Create the User from your screenshot
    new_user = User(
        username="naga",
        full_name="Naga Siddhartha",
        xp=127,
        streak_days=0
    )
    db.add(new_user)
    print("✅ Added User: Naga Siddhartha")

# 4. Create the First Topic
existing_topic = db.query(Topic).filter(Topic.name == "Python Loops").first()

if not existing_topic:
    new_topic = Topic(
        name="Python Loops",
        category="Coding",
        difficulty="Beginner"
    )
    db.add(new_topic)
    print("✅ Added Topic: Python Loops")

# 5. Save changes
# ... (Keep User and Topic seeding above)

from models import Question # <--- IMPORTANT: Add Question to the import line at the top!

# 6. Add Questions for Python Loops
# Check if questions exist first
if db.query(Question).count() == 0:
    q1 = Question(
        topic_name="Python Loops",
        text="Which keyword is used to start a loop that repeats a specific number of times?",
        option_a="while",
        option_b="for",
        option_c="repeat",
        correct_option="B"
    )
    
    q2 = Question(
        topic_name="Python Loops",
        text="How do you stop a loop immediately?",
        option_a="stop",
        option_b="exit",
        option_c="break",
        correct_option="C"
    )
    
    q3 = Question(
        topic_name="Python Loops",
        text="What happens if a while loop condition is always True?",
        option_a="It runs once",
        option_b="It runs forever (Infinite Loop)",
        option_c="It crashes immediately",
        correct_option="B"
    )

    db.add_all([q1, q2, q3])
    print("✅ Added 3 Real Quiz Questions")
db.commit()
db.close()
print("🎉 Database seeded successfully!")