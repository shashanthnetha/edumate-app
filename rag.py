import os

# --- FORCE HUGGING FACE TO IGNORE SYSTEM FOLDERS ---
# This tells the library: "Don't check for tokens, and save everything locally."
os.environ["HF_HUB_DISABLE_IMPLICIT_TOKEN"] = "1"
os.environ["HF_HOME"] = "./model_cache"

from pypdf import PdfReader
from sentence_transformers import SentenceTransformer
import numpy as np

class PDFBrain:
    def __init__(self):
        print("🧠 Loading Embedding Model... (This will create a 'model_cache' folder)")
        
        # We explicitly say token=False to stop it from looking for login keys
        self.model = SentenceTransformer(
            'all-MiniLM-L6-v2', 
            cache_folder="./model_cache",
            token=False 
        )
        
        self.chunks = []
        self.embeddings = []
        print("✅ Model Loaded Successfully.")

    def process_pdf(self, file_path):
        """Reads a PDF and cuts it into bite-sized chunks for the AI."""
        reader = PdfReader(file_path)
        text = ""
        for page in reader.pages:
            try:
                text += page.extract_text() + "\n"
            except:
                pass 
        
        # Split by double newlines (paragraphs)
        raw_chunks = text.split('\n\n')
        self.chunks = [c.strip() for c in raw_chunks if len(c) > 50]
        
        if not self.chunks:
            return 0
            
        print(f"📄 PDF Processed. Found {len(self.chunks)} chunks. Converting to Vectors...")
        
        # Convert text to numbers
        self.embeddings = self.model.encode(self.chunks)
        print("✅ Vector Database Built in Memory.")
        return len(self.chunks)

    def search(self, query, top_k=3):
        if not self.chunks:
            return []
        
        query_vector = self.model.encode([query])[0]
        scores = np.dot(self.embeddings, query_vector)
        top_indices = np.argsort(scores)[::-1][:top_k]
        
        results = []
        for idx in top_indices:
            results.append(self.chunks[idx])
            
        return results

if __name__ == "__main__":
    brain = PDFBrain()
    print("Run api.py to use this properly.")