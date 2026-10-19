import os
import uuid

from fastapi import APIRouter, File, UploadFile

from app.core.config import settings
from app.schemas.checkin import FaceVerifyResult
from app.services.face_service import FaceService

router = APIRouter(prefix="/face", tags=["face"])
face_service = FaceService()


@router.post("/verify", response_model=FaceVerifyResult)
async def verify_face(
    live_image: UploadFile = File(...),
    document_image: UploadFile = File(...),
):
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    live_path = os.path.join(settings.UPLOAD_DIR, f"{uuid.uuid4()}_live.jpg")
    doc_path = os.path.join(settings.UPLOAD_DIR, f"{uuid.uuid4()}_doc.jpg")

    with open(live_path, "wb") as f:
        f.write(await live_image.read())
    with open(doc_path, "wb") as f:
        f.write(await document_image.read())

    try:
        result = face_service.verify(live_path, doc_path)
    finally:
        for p in (live_path, doc_path):
            if os.path.exists(p):
                os.remove(p)

    return FaceVerifyResult(**result)
