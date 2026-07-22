"""
Retrieval-Augmented Generation for the chat assistant.
Knowledge sources:
- The patient's own uploaded documents (embedded + stored per-patient)
- A verified breast-cancer medical knowledge base (guidelines, glossaries)
Uses LangChain + a vector store (Chroma) for retrieval, then Groq for generation.
"""


def answer_question(message: str, report_id: str | None) -> str:
    """
    1. Embed `message`
    2. Retrieve top-k relevant chunks from patient documents + knowledge base
    3. Construct a grounded prompt with retrieved context
    4. Generate answer via llm_service, citing which report the answer draws from
    """
    raise NotImplementedError
