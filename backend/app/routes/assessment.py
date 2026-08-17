from typing import Optional

from fastapi import APIRouter, File, Query, UploadFile

from app.schemas import AssessmentRequest, AssessmentResponse, ImageUploadResponse
from app.services.assessment import (
    delete_assessment_record,
    get_assessment_history,
    get_assessment_record,
    process_assessment,
    save_scalp_image,
)


router = APIRouter(prefix="/api/assessment", tags=["Assessment"])


@router.post("/", response_model=AssessmentResponse)
async def create_assessment(data: AssessmentRequest):
    return await process_assessment(data)


@router.get("/history")
async def assessment_history(limit: int = 20):
    safe_limit = max(1, min(limit, 100))
    return await get_assessment_history(safe_limit)


@router.post("/upload-image", response_model=ImageUploadResponse)
async def upload_image(
    file: UploadFile = File(...),
    assessment_id: Optional[str] = Query(default=None),
):
    return await save_scalp_image(file, assessment_id)


@router.get("/{record_id}")
async def assessment_record(record_id: str):
    return await get_assessment_record(record_id)


@router.delete("/{record_id}")
async def delete_assessment(record_id: str):
    return await delete_assessment_record(record_id)
