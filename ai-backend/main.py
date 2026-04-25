from fastapi import FastAPI

app = FastAPI(title="AI Backend")

@app.get("/")
async def root():
    return {"message": "Welcome to the AI Backend API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
