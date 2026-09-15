import os
import sys

# Add backend directory to sys.path to allow imports from app
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(current_dir)

from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.services.rag_service import vector_store

def main():
    kb_path = r"C:\Users\anush\OneDrive\Desktop\breast_cancer_knowledge_base"
    
    if not os.path.exists(kb_path):
        print(f"Error: Knowledge base directory not found at {kb_path}")
        return

    print(f"Loading knowledge base from {kb_path}...")
    
    try:
        # Load all markdown files
        loader = DirectoryLoader(kb_path, glob="**/*.md", loader_cls=TextLoader, loader_kwargs={'encoding': 'utf-8'})
        documents = loader.load()
    except Exception as e:
        print(f"Error loading documents: {e}")
        return
    
    print(f"Loaded {len(documents)} documents. Splitting text...")
    
    # Split text into chunks
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len
    )
    
    chunks = text_splitter.split_documents(documents)
    print(f"Created {len(chunks)} text chunks.")
    
    # Add metadata to identify as KB
    for chunk in chunks:
        chunk.metadata["type"] = "kb"
        
    print("Ingesting into ChromaDB...")
    vector_store.add_documents(chunks)
    
    print("Knowledge base successfully ingested into ChromaDB!")

if __name__ == "__main__":
    main()
