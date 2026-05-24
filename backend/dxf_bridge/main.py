"""
BCS DXF Bridge — FastAPI microservice
Port: 8001

POST /parse   — upload a .dxf file, get rooms + walls JSON back
GET  /health  — liveness check
"""
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from geometry_engine import parse_dxf
import uvicorn

app = FastAPI(title="BCS DXF Bridge", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok", "service": "dxf-bridge", "port": 8001}


@app.post("/parse")
async def parse(file: UploadFile = File(...)):
    filename = (file.filename or "").lower()
    if not filename.endswith(".dxf"):
        raise HTTPException(status_code=400, detail="File must be a .dxf file")

    content = await file.read()
    if len(content) == 0:
        raise HTTPException(status_code=400, detail="Empty file")

    try:
        result = parse_dxf(content)
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DXF parse error: {str(e)}")


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=False)
