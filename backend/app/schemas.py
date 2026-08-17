from datetime import datetime
from typing import Any, Literal, Optional

from pydantic import BaseModel, Field


class AssessmentRequest(BaseModel):
    age: int = Field(..., ge=1, le=120)
    gender: str
    diet: str
    stressLevel: int = Field(..., ge=0, le=10)
    sleepHours: float = Field(..., ge=0, le=24)
    waterQuality: str
    waterPh: float = Field(..., ge=0, le=14)
    climate: str
    hairChanges: str

    imageName: Optional[str] = None


class ImageMetadata(BaseModel):
    filename: str
    content_type: str
    relative_path: str


class AnalysisResult(BaseModel):
    status: Literal["pending", "processing", "completed", "failed"]
    score: Optional[float] = None
    riskLevel: Optional[str] = None
    visionMetrics: Optional[dict[str, Any]] = None
    xaiFactors: Optional[list[dict[str, Any]]] = None
    actionPlan: Optional[list[dict[str, Any]]] = None
    heatmapData: Optional[dict[str, Any]] = None


class AssessmentHistoryItem(BaseModel):
    id: str
    createdAt: datetime
    updatedAt: datetime
    intake: dict[str, Any]
    image: Optional[ImageMetadata] = None
    analysis: AnalysisResult


class AssessmentResponse(BaseModel):
    status: str
    message: str
    recordId: Optional[str] = None
    data: dict[str, Any]
    persistence: dict


class ImageUploadResponse(BaseModel):
    status: str
    message: str
    filename: str
    content_type: str
    path: str
    assessmentId: Optional[str] = None
