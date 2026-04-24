import logging
from typing import AsyncGenerator

import httpx
from fastapi import HTTPException

from core.config import settings

logger = logging.getLogger(__name__)


async def call_workers_ai(prompt: str) -> str:
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                settings.workers_ai_url,
                headers={"Authorization": f"Bearer {settings.workers_ai_api_key}"},
                json={"messages": [{"role": "user", "content": prompt}]},
                timeout=30.0,
            )
            response.raise_for_status()
            data = response.json()
            return data["result"]["response"]
    except httpx.HTTPStatusError as exc:
        logger.error("Workers AI returned %s: %s", exc.response.status_code, exc.response.text)
        raise HTTPException(status_code=502, detail="Upstream AI service returned an error")
    except httpx.RequestError as exc:
        logger.error("Workers AI request failed: %s", exc)
        raise HTTPException(status_code=502, detail="Failed to reach upstream AI service")
    except (KeyError, ValueError) as exc:
        logger.error("Unexpected Workers AI response shape: %s", exc)
        raise HTTPException(status_code=502, detail="Unexpected response from upstream AI service")


async def stream_workers_ai(prompt: str) -> AsyncGenerator[str, None]:
    try:
        async with httpx.AsyncClient() as client:
            async with client.stream(
                "POST",
                settings.workers_ai_url,
                headers={"Authorization": f"Bearer {settings.workers_ai_api_key}"},
                json={
                    "messages": [{"role": "user", "content": prompt}],
                    "stream": True,
                },
                timeout=60.0,
            ) as response:
                response.raise_for_status()
                async for line in response.aiter_lines():
                    if line.startswith("data: "):
                        yield f"{line}\n\n"
    except httpx.HTTPStatusError as exc:
        logger.error("Workers AI stream error %s: %s", exc.response.status_code, exc.response.text)
        yield "data: [ERROR]\n\n"
    except httpx.RequestError as exc:
        logger.error("Workers AI stream request failed: %s", exc)
        yield "data: [ERROR]\n\n"
    except (KeyError, ValueError) as exc:
        logger.error("Unexpected Workers AI stream shape: %s", exc)
        yield "data: [ERROR]\n\n"
