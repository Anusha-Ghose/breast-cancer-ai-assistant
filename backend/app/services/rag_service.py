"""
Retrieval-Augmented Generation for the chat assistant using ChromaDB and Groq.
Includes Empathetic Emotion-Aware AI and Personalized Longitudinal RAG context.
"""
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_groq import ChatGroq
from langchain_classic.chains import create_retrieval_chain
from langchain_classic.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from app.config import settings
import re
import json

# Initialize Embeddings and Vector Store
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
vector_store = Chroma(persist_directory=settings.vector_db_path, embedding_function=embeddings)

llm = ChatGroq(
    temperature=0.1,
    model_name="openai/gpt-oss-20b",
    api_key=settings.groq_api_key
)

def analyze_emotion(message: str) -> dict:
    """
    Identifies emotion/sentiment (anxious, distressed, neutral, optimistic, uncertain)
    to adapt the AI's tone with empathy.
    """
    lower_msg = message.lower()
    
    anxiety_keywords = ["worried", "scared", "afraid", "anxious", "panic", "fear", "cancer", "metastasis", "stage", "dying", "danger", "bi-rads 5", "high risk"]
    distress_keywords = ["pain", "terrible", "can't sleep", "crying", "depressed", "overwhelmed", "hopeless", "severe"]
    uncertainty_keywords = ["don't understand", "confused", "what does this mean", "explain", "help me read", "not sure"]

    if any(k in lower_msg for k in distress_keywords):
        return {
            "emotion": "Distressed",
            "empathy_level": "High",
            "guidance": "Acknowledge the emotional burden with deep empathy and reassurance. Use warm, highly supportive, clear language before explaining medical terms."
        }
    elif any(k in lower_msg for k in anxiety_keywords):
        return {
            "emotion": "Anxious / Concerned",
            "empathy_level": "Moderate-High",
            "guidance": "Provide gentle, compassionate validation of their concerns. Emphasize that medical findings are steps toward clarity and action."
        }
    elif any(k in lower_msg for k in uncertainty_keywords):
        return {
            "emotion": "Uncertain / Seeking Clarity",
            "empathy_level": "Moderate",
            "guidance": "Use a clear, patient-friendly, reassuring educational tone with step-by-step plain English explanations."
        }
    else:
        return {
            "emotion": "Neutral / Informational",
            "empathy_level": "Standard",
            "guidance": "Be polite, warm, clear, professional, and patient-centered."
        }

def answer_question(message: str, patient_id: str, language: str = "en", longitudinal_context: str = "") -> dict:
    emotion_meta = analyze_emotion(message)
    
    retriever = vector_store.as_retriever(
        search_kwargs={
            "k": 5,
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
        f"You are Halcyon, an empathetic, expert AI medical assistant specializing in breast health and medical report interpretation. "
        f"Always answer the user in {target_lang}. "
        f"EMPATHY & TONE INSTRUCTION: The user is currently feeling {emotion_meta['emotion']}. {emotion_meta['guidance']} "
        f"CRITICAL INSTRUCTION FOR MEDICAL TERMS: Do not try to translate complex medical terms (like 'Hemoglobin', 'Ki-67', 'CA 15-3'). Instead, transliterate them (write them in the literal spelling/script of {target_lang}, matching the English pronunciation). "
        f"\n\nPATIENT LONGITUDINAL HISTORY:\n{longitudinal_context if longitudinal_context else 'No prior longitudinal report timeline provided.'}\n\n"
        f"Use the retrieved medical literature and patient context below to answer the user's question clearly. "
        f"If you don't know the answer or the information is not in the context, clearly state that it is not present in the uploaded documents or knowledge base. "
        f"Never hallucinate medical information. "
        f"Always include a disclaimer that you are an AI, not a doctor. "
        f"IMPORTANT: At the end of your answer, include a confidence percentage (e.g. 'Confidence: 95%') indicating how sure you are of this inference based on the retrieved context."
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
        answer = response["answer"]
    except Exception as e:
        print(f"RAG Error: {e}")
        answer = f"I am here with you. While accessing full details encountered a brief delay, I am here to help answer your questions about your breast health reports. Please feel free to ask again."
    
    return {
        "answer": answer,
        "emotion_analysis": emotion_meta,
        "grounded": True,
        "longitudinal_applied": bool(longitudinal_context)
    }

def add_document_to_kb(text: str, metadata: dict):
    vector_store.add_texts(texts=[text], metadatas=[metadata])
