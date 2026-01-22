import os
from fastembed import TextEmbedding
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

class PDFBrain:
    def __init__(self):
        print("🧠 Loading FastEmbed Model (Lightweight)...")
        # This model is small (~200MB) and fits in the free tier
        self.model = TextEmbedding(model_name="BAAI/bge-small-en-v1.5")
        print("✅ Model Loaded!")

    def find_best_match(self, query: str, documents: list):
        """
        Takes a user query and a list of text chunks (documents).
        Returns the single most relevant chunk.
        """
        if not documents:
            return None
        
        # 1. Embed the query
        # FastEmbed returns a generator, so we convert to list
        query_vec = list(self.model.embed([query]))[0]
        
        # 2. Embed all documents
        # In a real production app, we would cache these vectors!
        doc_vecs = list(self.model.embed(documents))
        
        # 3. Calculate similarity
        scores = cosine_similarity([query_vec], doc_vecs)[0]
        
        # 4. Find the winner
        best_idx = np.argmax(scores)
        best_score = scores[best_idx]
        
        # 5. Threshold (if score is too low, say we don't know)
        if best_score < 0.3:
            return None
            
        return documents[best_idx]