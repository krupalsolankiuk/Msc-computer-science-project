import os
import uuid

from fastapi import APIRouter, File, UploadFile

from app.core.config import settings
from app.schemas.checkin import OCRResult
from app.services.ocr_service import OCRService

router = APIRouter(prefix="/ocr", tags=["ocr"])
ocr_service = OCRService()


@router.post("/scan", response_model=OCRResult)
async def scan_document(image: UploadFile = File(...)):
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    file_path = os.path.join(settings.UPLOAD_DIR, f"{uuid.uuid4()}_{image.filename}")

    with open(file_path, "wb") as f:
        f.write(await image.read())

    try:
        result = ocr_service.extract_identity(file_path)
    finally:
        # Data minimisation: remove the uploaded document image once processed
        if os.path.exists(file_path):
            os.remove(file_path)

    return OCRResult(**result)
