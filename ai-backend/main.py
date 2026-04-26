from fastapi import FastAPI
from routes import tts, plant

app = FastAPI()

app.include_router(tts.router, prefix="/tts", tags=["TTS"])
app.include_router(plant.router, prefix="/plant", tags=["Plant Disease"])

@app.get("/")
def root():
    return {"message": "API is running"}