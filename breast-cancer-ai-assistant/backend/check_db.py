import asyncio
from app.db.database import db, connect_to_mongo

async def main():
    await connect_to_mongo()
    doc = await db.db.reports.find_one(sort=[('upload_date', -1)])
    if not doc:
        print("No documents found.")
        return
    print("DOCUMENT ID:", doc.get("_id"))
    print("OCR TEXT:", repr(doc.get('ocr_text', '')))
    print("ENTITIES:", doc.get('extracted_entities', {}))

asyncio.run(main())
