from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TelemetryBase(BaseModel):
    packageId: str
    temperature: float
    gForce: float
    latitude: float
    longitude: float
    timestamp: str
    batteryLevel: Optional[float] = None
    signalStrength: Optional[int] = None

class TelemetryCreate(TelemetryBase):
    pass

class TelemetryResponse(TelemetryBase):
    id: int
    
    class Config:
        from_attributes = True