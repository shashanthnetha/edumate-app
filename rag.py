import os
from fastembed import TextEmbedding
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Load a lightweight model (uses ~200MB RAM instead of 1GB)
print("🧠 Loading FastEmbed Model...")
embedding_model = TextEmbedding(model_name="BAAI/bge-small-en-v1.5")
print("✅ Model Loaded!")

def get_embedding(text: str):
    """Generates a vector embedding for the given text."""
    # FastEmbed returns a generator, so we convert to list and get the first item
    embeddings = list(embedding_model.embed([text]))
    return embeddings[0]

def find_best_match(query: str, documents: list):
    """Finds the most relevant document chunk for the query."""
    if not documents:
        return None
    
    # 1. Embed the query
    query_vec = get_embedding(query)
    
    # 2. Embed all documents (in a real app, you'd cache these!)
    # Note: FastEmbed is fast, but doing this every time is still a bit slow.
    # For a demo, it's fine.
    doc_vecs = list(embedding_model.embed(documents))
    
    # 3. Calculate similarities
    scores = cosine_similarity([query_vec], doc_vecs)[0]
    
    # 4. Find best score
    best_idx = np.argmax(scores)
    best_score = scores[best_idx]
    
    if best_score < 0.3: # Relevance threshold
        return None
        
    return documents[best_idx]