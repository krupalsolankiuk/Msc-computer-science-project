from app.core.config import settings


class FaceService:
    """Wraps DeepFace to compare a live capture against a document photo.

    DeepFace is imported lazily inside the method (rather than at module
    load time) because loading its underlying model weights is slow and
    only needed when this endpoint is actually called.
    """

    def verify(self, live_image_path: str, doc_image_path: str) -> dict:
        from deepface import DeepFace  # lazy import

        result = DeepFace.verify(
            img1_path=live_image_path,
            img2_path=doc_image_path,
            model_name=settings.FACE_MODEL_NAME,
            detector_backend=settings.FACE_DETECTOR_BACKEND,
            enforce_detection=False,
        )

        distance = float(result["distance"])
        verified = distance <= settings.FACE_MATCH_THRESHOLD

        return {
            "verified": verified,
            "distance": distance,
            "threshold": settings.FACE_MATCH_THRESHOLD,
            "model": settings.FACE_MODEL_NAME,
        }
