import pytest
from httpx import AsyncClient
from main import app


@pytest.mark.asyncio
async def test_root():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        res = await ac.get("/")
    assert res.status_code == 200
    assert res.json()["status"] == "ok"


@pytest.mark.asyncio
async def test_create_and_get_message():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        # create
        res = await ac.post(
            "/api/messages",
            json={"content": "hello", "color_idx": 1, "pos_x": 10, "pos_y": 20},
        )
        assert res.status_code == 201

        # get
        res = await ac.get("/api/messages")
        assert res.status_code == 200
        assert len(res.json()) >= 1


@pytest.mark.asyncio
async def test_count():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        res = await ac.get("/api/messages/count")
        assert res.status_code == 200
        assert "count" in res.json()
