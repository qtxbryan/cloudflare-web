from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from schemas.inference_schema import InferenceRequest, InferenceResponse
from services.inference_service import call_workers_ai, stream_workers_ai

inference_router = APIRouter()


@inference_router.post("/api/inference", response_model=InferenceResponse)
async def inference(request: InferenceRequest) -> InferenceResponse:
    result = await call_workers_ai(request.prompt)
    return InferenceResponse(response=result)


@inference_router.post("/api/inference/stream")
async def inference_stream(request: InferenceRequest) -> StreamingResponse:
    return StreamingResponse(
        stream_workers_ai(request.prompt),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )
