from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

class MongoDB:
    client: AsyncIOMotorClient = None
    db = None

db = MongoDB()

async def connect_to_mongo():
    db.client = AsyncIOMotorClient(settings.mongo_uri)
    # Parse DB name from URI
    db_name = settings.mongo_uri.split("/")[-1].split("?")[0]
    if not db_name:
        db_name = "healthcare_assistant"
    db.db = db.client[db_name]
    print("Connected to MongoDB")

async def close_mongo_connection():
    if db.client:
        db.client.close()
        print("Closed MongoDB connection")
