# backend/models.py
from sqlalchemy import Column, Float, Integer, String, Text
from database import Base


class Message(Base):
    __tablename__ = "messages"

    id         = Column(Integer, primary_key=True, autoincrement=True)
    content    = Column(Text, nullable=False)
    color_idx  = Column(Integer, nullable=False, default=0)
    pos_x      = Column(Float, nullable=False)
    pos_y      = Column(Float, nullable=False)
    created_at = Column(String(30), nullable=False, default="")
