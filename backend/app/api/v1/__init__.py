from fastapi import APIRouter

from app.api.v1 import (
    routes_checkin,
    routes_face,
    routes_ocr,
    routes_reservation,
    routes_voice,
)

api_router = APIRouter()
api_router.include_router(routes_checkin.router)
api_router.include_router(routes_ocr.router)
api_router.include_router(routes_face.router)
api_router.include_router(routes_reservation.router)
api_router.include_router(routes_voice.router)
