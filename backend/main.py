from fastapi import FastAPI

app = FastAPI(title="Social Media Content Analyzer API")


@app.get("/health")
def health_check():
    return {"status": "ok"}