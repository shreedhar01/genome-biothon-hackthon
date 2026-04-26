from fastapi import APIRouter
from fastapi.responses import Response
from pydantic import BaseModel
from model.tts import synthesize_audio

router = APIRouter()

class TTSRequest(BaseModel):
    text: str

@router.post("/synthesize")
async def synthesize(request: TTSRequest):
    buf = synthesize_audio(request.text)
    audio_bytes = buf.read()
    return Response(
        content=audio_bytes,
        media_type="audio/wav",
        headers={
            "Content-Disposition": "attachment; filename=output.wav",
            "Content-Length": str(len(audio_bytes)),
        }
    )