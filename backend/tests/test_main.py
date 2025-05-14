import logging

from fastapi.testclient import TestClient

from app.utils.init_data import main as init_db
from app.utils.test_pre_start import main as pre_start

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def test_init_db() -> None:
    init_db()


def test_pre_start() -> None:
    pre_start()


def test_root(client: TestClient) -> None:
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"Hello": "World"}
