"""
Retrieval-Augmented Generation for the chat assistant using ChromaDB and Groq.
"""
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_groq import ChatGroq
from langchain_classic.chains import create_retrieval_chain
from langchain_classic.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from app.config import settings

# Initialize Embeddings and Vector Store
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
vector_store = Chroma(persist_directory=settings.vector_db_path, embedding_function=embeddings)

llm = ChatGroq(
    temperature=0,
    model_name="llama-3.1-8b-instant",
    api_key=settings.groq_api_key
)


def answer_question(message: str, patient_id: str, language: str = "en") -> str:
    # Build filter to only search knowledge base OR patient's own reports
    # Assuming metadata has 'patient_id' (or 'kb' for knowledge base)
    
    retriever = vector_store.as_retriever(
        search_kwargs={
            "k": 5, 
            # In a real app we'd filter: "filter": {"$or": [{"patient_id": patient_id}, {"type": "kb"}]}
        }
    )
    
    lang_map = {
        "en": "English",
        "hi": "Hindi",
        "ta": "Tamil",
        "bn": "Bengali"
    }
    target_lang = lang_map.get(language, "English")
    
    custom_system_prompt = (
        f"You are an AI medical assistant designed to help patients understand their medical reports. "
        f"Always answer the user in {target_lang}. "
        f"CRITICAL INSTRUCTION FOR MEDICAL TERMS: Do not try to translate complex medical terms (like 'Hemoglobin', 'Ki-67'). Instead, transliterate them (write them in the literal spelling/script of {target_lang}, matching the English pronunciation). "
        f"Use the following retrieved context to answer the user's question. "
        f"If you don't know the answer or the information is not in the context, clearly state that it is not present in the uploaded documents or knowledge base. "
        f"Never hallucinate medical information. "
        f"Always include a disclaimer that you are an AI, not a doctor. "
        f"IMPORTANT: At the end of every answer, include a confidence percentage (e.g. 'Confidence: 95%') indicating how sure you are of this inference based on the retrieved context."
        f"\n\nContext: {{context}}"
    )
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", custom_system_prompt),
        ("human", "{input}"),
    ])
    
    question_answer_chain = create_stuff_documents_chain(llm, prompt)
    rag_chain = create_retrieval_chain(retriever, question_answer_chain)
    
    try:
        response = rag_chain.invoke({"input": message})
        return response["answer"]
    except Exception as e:
        print(f"RAG Error: {e}")
        return "I encountered an error while processing your request. Please try again."

def add_document_to_kb(text: str, metadata: dict):
    vector_store.add_texts(texts=[text], metadatas=[metadata])
    # Chroma persists automatically in newer versions or requires manual call if configured so.
