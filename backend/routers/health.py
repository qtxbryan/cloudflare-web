from fastapi import APIRouter
from pydantic import BaseModel

health_router = APIRouter()


class HealthResponse(BaseModel):
    status: str


@health_router.get("/api/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    return HealthResponse(status="ok")
