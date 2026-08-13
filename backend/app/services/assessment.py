from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from uuid import uuid4

from fastapi import HTTPException, UploadFile
from bson import ObjectId
from pymongo.errors import PyMongoError

from app.database import get_assessments_collection
from app.schemas import AssessmentRequest
from app.services.ai_service import empty_analysis_result


BACKEND_DIR = Path(__file__).resolve().parents[2]
UPLOAD_DIR = BACKEND_DIR / "uploads"
MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024
CHUNK_SIZE_BYTES = 1024 * 1024

ALLOWED_IMAGE_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
}


def now_utc():
    return datetime.now(timezone.utc)


def build_assessment_document(data: AssessmentRequest) -> dict[str, Any]:
    return {
        "createdAt": now_utc(),
        "updatedAt": now_utc(),
        "intake": {
            "age": data.age,
            "gender": data.gender,
            "diet": data.diet,
            "stressLevel": data.stressLevel,
            "sleepHours": data.sleepHours,
            "waterQuality": data.waterQuality,
            "waterPh": data.waterPh,
            "climate": data.climate,
            "hairChanges": data.hairChanges,
        },
        "image": None,
        "analysis": empty_analysis_result(),
    }


def serialize_assessment(record: dict[str, Any]) -> dict[str, Any]:
    record["id"] = str(record.pop("_id"))
    return record


def validate_record_id(record_id: str):
    if not ObjectId.is_valid(record_id):
        raise HTTPException(status_code=400, detail="Invalid assessment record ID.")

    return ObjectId(record_id)


def get_collection_or_503(action: str):
    collection = get_assessments_collection()

    if collection is None:
        raise HTTPException(
            status_code=503,
            detail=f"MongoDB is not configured. Set MONGODB_URI to {action}.",
        )

    return collection


async def process_assessment(data: AssessmentRequest):
    assessment_data = data.model_dump()
    assessment_record = build_assessment_document(data)
    collection = get_assessments_collection()

    if collection is None:
        return {
            "status": "received",
            "message": "Assessment data received successfully. MongoDB is not configured, so the record was not saved.",
            "recordId": None,
            "data": assessment_data,
            "persistence": {
                "enabled": False,
                "reason": "Set MONGODB_URI to enable assessment storage.",
            },
        }

    try:
        result = await collection.insert_one(assessment_record)
    except PyMongoError as exc:
        raise HTTPException(
            status_code=503,
            detail="Could not save assessment record to MongoDB.",
        ) from exc

    saved_record = serialize_assessment({"_id": result.inserted_id, **assessment_record})

    return {
        "status": "success",
        "message": "Assessment data saved successfully",
        "recordId": str(result.inserted_id),
        "data": saved_record,
        "persistence": {
            "enabled": True,
            "collection": collection.name,
        },
    }


async def get_assessment_history(limit: int = 20):
    collection = get_collection_or_503("retrieve assessment history")

    try:
        cursor = collection.find().sort("createdAt", -1).limit(limit)
        records = [serialize_assessment(record) async for record in cursor]
    except PyMongoError as exc:
        raise HTTPException(
            status_code=503,
            detail="Could not retrieve assessment history from MongoDB.",
        ) from exc

    return {
        "status": "success",
        "count": len(records),
        "records": records,
    }


async def get_assessment_record(record_id: str):
    object_id = validate_record_id(record_id)
    collection = get_collection_or_503("retrieve assessment records")

    try:
        record = await collection.find_one({"_id": object_id})
    except PyMongoError as exc:
        raise HTTPException(
            status_code=503,
            detail="Could not retrieve assessment record from MongoDB.",
        ) from exc

    if record is None:
        raise HTTPException(status_code=404, detail="Assessment record not found.")

    return {
        "status": "success",
        "record": serialize_assessment(record),
    }


def build_image_metadata(filename: str, content_type: str) -> dict[str, str]:
    return {
        "filename": filename,
        "content_type": content_type,
        "relative_path": f"uploads/{filename}",
    }


async def find_assessment_or_404(record_id: str):
    object_id = validate_record_id(record_id)
    collection = get_collection_or_503("update assessment records")

    try:
        record = await collection.find_one({"_id": object_id})
    except PyMongoError as exc:
        raise HTTPException(
            status_code=503,
            detail="Could not retrieve assessment record from MongoDB.",
        ) from exc

    if record is None:
        raise HTTPException(status_code=404, detail="Assessment record not found.")

    return collection, object_id, record


async def save_upload_to_disk(file: UploadFile):
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Only JPEG, PNG, and WEBP images are allowed.",
        )

    extension = ALLOWED_IMAGE_TYPES[file.content_type]
    filename = f"{uuid4().hex}{extension}"
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    destination = UPLOAD_DIR / filename

    total_size = 0

    try:
        with destination.open("wb") as buffer:
            while chunk := await file.read(CHUNK_SIZE_BYTES):
                total_size += len(chunk)

                if total_size > MAX_UPLOAD_SIZE_BYTES:
                    buffer.close()
                    destination.unlink(missing_ok=True)
                    raise HTTPException(
                        status_code=400,
                        detail="Uploaded image must be 5 MB or smaller.",
                    )

                buffer.write(chunk)
    except HTTPException:
        raise
    except OSError as exc:
        destination.unlink(missing_ok=True)
        raise HTTPException(
            status_code=500,
            detail="Could not save uploaded image.",
        ) from exc
    finally:
        await file.close()

    return build_image_metadata(filename, file.content_type)


def delete_uploaded_image_file(image: dict[str, Any] | None):
    if not image:
        return False

    filename = image.get("filename")
    relative_path = image.get("relative_path")

    if not filename or not relative_path:
        return False

    target = (BACKEND_DIR / relative_path).resolve()
    upload_dir = UPLOAD_DIR.resolve()

    if target.parent != upload_dir or target.name != filename:
        return False

    try:
        target.unlink(missing_ok=True)
    except OSError:
        return False

    return True


async def save_scalp_image(file: UploadFile, assessment_id: str | None = None):
    collection = None
    object_id = None

    if assessment_id:
        collection, object_id, _ = await find_assessment_or_404(assessment_id)

    image = await save_upload_to_disk(file)

    if collection is not None and object_id is not None:
        try:
            await collection.update_one(
                {"_id": object_id},
                {"$set": {"image": image, "updatedAt": now_utc()}},
            )
        except PyMongoError as exc:
            delete_uploaded_image_file(image)
            raise HTTPException(
                status_code=503,
                detail="Could not associate uploaded image with assessment.",
            ) from exc

    return {
        "status": "success",
        "message": "Image uploaded successfully",
        "filename": image["filename"],
        "content_type": image["content_type"],
        "path": image["relative_path"],
        "assessmentId": assessment_id,
    }


async def delete_assessment_record(record_id: str):
    object_id = validate_record_id(record_id)
    collection = get_collection_or_503("delete assessment records")

    try:
        record = await collection.find_one({"_id": object_id})
    except PyMongoError as exc:
        raise HTTPException(
            status_code=503,
            detail="Could not retrieve assessment record from MongoDB.",
        ) from exc

    if record is None:
        raise HTTPException(status_code=404, detail="Assessment record not found.")

    try:
        result = await collection.delete_one({"_id": object_id})
    except PyMongoError as exc:
        raise HTTPException(
            status_code=503,
            detail="Could not delete assessment record from MongoDB.",
        ) from exc

    if result.deleted_count != 1:
        raise HTTPException(status_code=404, detail="Assessment record not found.")

    image_deleted = delete_uploaded_image_file(record.get("image"))

    return {
        "status": "success",
        "message": "Assessment record deleted successfully",
        "recordId": record_id,
        "imageDeleted": image_deleted,
    }
