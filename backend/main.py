from fastapi import FastAPI, File, HTTPException, UploadFile

app = FastAPI(title="Social Media Content Analyzer API")


ALLOWED_TYPES = {
    "application/pdf": "pdf",
    "image/jpeg": "image",
    "image/png": "image",
}

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/api/analyze")
async def analyze_file(file: UploadFile = File(...)):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type. Please upload a PDF, JPG, or PNG.",
        )

    file_size = 0

    while chunk := await file.read(1024 * 1024):
        file_size += len(chunk)

        if file_size > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=413,
                detail="File is too large. Maximum file size is 10 MB.",
            )

    await file.seek(0)

    file_type = ALLOWED_TYPES[file.content_type]

    return {
        "filename": file.filename,
        "file_type": file_type,
        "message": "File received successfully",
    }