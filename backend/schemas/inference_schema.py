from pydantic import BaseModel, ConfigDict, Field


class InferenceRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    prompt: str = Field(description="The user's prompt to send to the AI model")


class InferenceResponse(BaseModel):
    response: str = Field(description="The AI model's response")
