import sqlite3

# Connect to the database
conn = sqlite3.connect("edumate.db")
cursor = conn.cursor()

print("🌱 Seeding database with new topics...")

# --- TOPIC 1: Python Loops & Logic ---
# We delete old ones to avoid duplicates, then insert new ones
cursor.execute("DELETE FROM questions WHERE topic = 'Python Loops & Logic'")

questions_loops = [
    ("What is the output of: i = 0; while i < 3: print(i); i += 1?", "0 1 2", "1 2 3", "0 1 2 3", "0 1 2"),
    ("Which keyword is used to skip the current iteration in a loop?", "break", "continue", "pass", "continue"),
    ("How do you write a loop that runs 5 times?", "for i in range(5):", "repeat 5:", "while 5:", "for i in range(5):"),
    ("What happens if a while loop condition never becomes False?", "Infinite Loop", "Syntax Error", "It runs once", "Infinite Loop")
]

for q in questions_loops:
    cursor.execute("INSERT INTO questions (topic, text, option_a, option_b, option_c, correct_option) VALUES (?, ?, ?, ?, ?, ?)", 
                   ("Python Loops & Logic", q[0], q[1], q[2], q[3], q[4]))

# --- TOPIC 2: Data Structures 101 ---
cursor.execute("DELETE FROM questions WHERE topic = 'Data Structures 101'")

questions_ds = [
    ("Which data structure is immutable (cannot be changed)?", "List", "Dictionary", "Tuple", "Tuple"),
    ("How do you access the value associated with key 'k' in dict 'd'?", "d['k']", "d.get('k')", "Both A and B", "Both A and B"),
    ("Which structure allows duplicate elements?", "Set", "List", "Dictionary Keys", "List"),
    ("What is the time complexity to lookup an item in a Dictionary?", "O(n)", "O(log n)", "O(1)", "O(1)")
]

for q in questions_ds:
    cursor.execute("INSERT INTO questions (topic, text, option_a, option_b, option_c, correct_option) VALUES (?, ?, ?, ?, ?, ?)", 
                   ("Data Structures 101", q[0], q[1], q[2], q[3], q[4]))

conn.commit()
conn.close()

print("✅ Success! New topics added. You can now take the quizzes.")