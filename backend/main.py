# backend/main.py
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import datetime, timezone

from database import engine, Base, get_db
from models import Message
from schemas import MessageCreate, MessageOut


@asynccontextmanager
async def lifespan(app: FastAPI):
    # สร้าง table อัตโนมัติถ้ายังไม่มี
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield


app = FastAPI(
    title="Encouragement Wall API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["Health"])
async def root():
    return {"status": "ok", "message": "Encouragement Wall is running ✨"}


@app.get("/api/messages", response_model=list[MessageOut], tags=["Messages"])
async def get_messages(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Message).order_by(Message.id))
    return result.scalars().all()


@app.post("/api/messages", response_model=MessageOut, status_code=201, tags=["Messages"])
async def create_message(body: MessageCreate, db: AsyncSession = Depends(get_db)):
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")
    msg = Message(
        content=body.content,
        color_idx=body.color_idx,
        pos_x=body.pos_x,
        pos_y=body.pos_y,
        created_at=now,
    )
    db.add(msg)
    await db.commit()
    await db.refresh(msg)
    return msg


@app.get("/api/messages/count", tags=["Messages"])
async def get_count(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(func.count()).select_from(Message))
    return {"count": result.scalar()}


@app.delete("/api/messages/{msg_id}", status_code=204, tags=["Messages"])
async def delete_message(msg_id: int, db: AsyncSession = Depends(get_db)):
    msg = await db.get(Message, msg_id)
    if not msg:
        raise HTTPException(status_code=404, detail="ไม่พบข้อความนี้")
    await db.delete(msg)
    await db.commit()
