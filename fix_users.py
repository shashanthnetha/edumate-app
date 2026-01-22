import sqlite3

# Connect to the database
db_path = "edumate.db"
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

print("🔧 Checking 'users' table structure...")

# Force Add the missing column
try:
    cursor.execute("ALTER TABLE users ADD COLUMN last_login TIMESTAMP")
    print("✅ Successfully added 'last_login' column.")
except sqlite3.OperationalError as e:
    if "duplicate column name" in str(e):
        print("ℹ️ 'last_login' column already exists. No changes needed.")
    else:
        print(f"⚠️ Warning: {e}")

conn.commit()
conn.close()

print("✅ User table repair complete.")