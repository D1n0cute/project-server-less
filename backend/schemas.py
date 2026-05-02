# backend/schemas.py
from pydantic import BaseModel, Field
from typing import Optional


class MessageCreate(BaseModel):
    content:   str   = Field(min_length=1, max_length=80)
    color_idx: int   = Field(default=0, ge=0)
    pos_x:     float = Field(ge=0.0, le=100.0)
    pos_y:     float = Field(ge=0.0, le=100.0)


class MessageOut(BaseModel):
    id:         int
    content:    str
    color_idx:  int
    pos_x:      float
    pos_y:      float
    created_at: Optional[str] = None

    model_config = {"from_attributes": True}
