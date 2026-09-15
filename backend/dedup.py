import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def main():
    client = AsyncIOMotorClient('mongodb://localhost:27017')
    db = client.healthcare_assistant
    reports = await db.reports.find({}).to_list(100)
    
    seen = {}
    to_delete = []
    
    for r in reports:
        fname = r.get("original_filename", "")
        # Also maybe group by some extracted content hash?
        # Actually just filename is probably what the user means by "uploaded the same document multiple times"
        if fname in seen:
            to_delete.append(r["_id"])
        else:
            seen[fname] = r["_id"]
            
    print(f"Total reports: {len(reports)}")
    print(f"Found {len(to_delete)} duplicates")
    
    for _id in to_delete:
        await db.reports.delete_one({"_id": _id})
        print(f"Deleted duplicate {_id}")
        
if __name__ == "__main__":
    asyncio.run(main())
