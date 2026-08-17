import os

from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import ASCENDING
from pymongo.errors import PyMongoError


# Load variables from backend/.env
load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
MONGODB_DATABASE = os.getenv("MONGODB_DATABASE", "hairfall_diagnosis")

ASSESSMENTS_COLLECTION = "assessments"


client = (
    AsyncIOMotorClient(
        MONGODB_URI,
        serverSelectionTimeoutMS=5000,
    )
    if MONGODB_URI
    else None
)

database = client[MONGODB_DATABASE] if client is not None else None


def get_assessments_collection():
    if database is None:
        return None

    return database[ASSESSMENTS_COLLECTION]


def is_database_configured():
    return client is not None


async def ping_database():
    if client is None:
        return False

    try:
        await client.admin.command("ping")
    except PyMongoError:
        return False

    return True


async def ensure_database_indexes():
    collection = get_assessments_collection()

    if collection is None:
        return

    try:
        await collection.create_index(
            [("createdAt", ASCENDING)]
        )
    except PyMongoError:
        return


def close_database_connection():
    if client is not None:
        client.close()