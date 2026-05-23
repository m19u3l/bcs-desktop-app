from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn

app = FastAPI(title="BCS ClaimScope Pipeline")

class ModelRequest(BaseModel):
    description: str

@app.get("/api/v2/health")
def health_check():
    return {"status": "ok", "message": "ClaimScope Engine Online"}

@app.post("/api/v2/estimates/generate-nlp")
def map_xactimate_scope(payload: ModelRequest):
    text = payload.description.lower()
    assemblies = []

    if "leak" in text or "pipe" in text or "water" in text:
        assemblies.extend([
            {"code": "WTR-EXM", "name": "Water extraction from affected flooring", "quantity": 500, "unit": "SF", "subtotalCents": 72500},
            {"code": "WTR-DRY", "name": "Dehumidifier structural equipment setup", "quantity": 3, "unit": "DA", "subtotalCents": 25500},
            {"code": "WNTR-PLK", "name": "EPA WNTR Pipe Leak Simulation Variable", "quantity": 1, "unit": "EA", "subtotalCents": 0},
        ])

    if "drywall" in text or "wall" in text:
        assemblies.extend([
            {"code": "ASM-DRYW-05", "name": "Drywall Assembly (Hang, Tape, Sand)", "quantity": 1200, "unit": "SF", "subtotalCents": 540000},
            {"code": "PNT-2", "name": "Paint walls - two coats sealer", "quantity": 1200, "unit": "SF", "subtotalCents": 114000},
        ])

    if "roof" in text or "shingle" in text:
        assemblies.extend([
            {"code": "RF-SHG-30", "name": "Architectural shingle removal and replacement", "quantity": 24, "unit": "SQ", "subtotalCents": 960000},
            {"code": "RF-UDL", "name": "Synthetic underlayment install", "quantity": 24, "unit": "SQ", "subtotalCents": 144000},
        ])

    if "mold" in text or "remediation" in text:
        assemblies.extend([
            {"code": "MLD-CONT", "name": "Containment barrier setup", "quantity": 400, "unit": "SF", "subtotalCents": 48000},
            {"code": "MLD-REM", "name": "Mold remediation - affected surface", "quantity": 200, "unit": "SF", "subtotalCents": 120000},
            {"code": "MLD-HEPA", "name": "HEPA air scrubber placement", "quantity": 2, "unit": "DA", "subtotalCents": 18000},
        ])

    if "floor" in text or "flooring" in text:
        assemblies.extend([
            {"code": "FLR-LVP", "name": "LVP flooring removal and replacement", "quantity": 500, "unit": "SF", "subtotalCents": 275000},
            {"code": "FLR-PAD", "name": "Underlayment pad installation", "quantity": 500, "unit": "SF", "subtotalCents": 37500},
        ])

    if not assemblies:
        assemblies.append({
            "code": "MISC-01",
            "name": "General site damage evaluation inspection",
            "quantity": 1,
            "unit": "EA",
            "subtotalCents": 15000,
        })

    return {"status": "success", "generatedPayload": {"assemblies": assemblies}}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
