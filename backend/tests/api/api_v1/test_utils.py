from fastapi.testclient import TestClient

from app.core.config import settings


def test_get_item(client: TestClient) -> None:
    """Test get item by id endpoint"""
    # Make request
    response = client.get(f"{settings.API_V1_STR}/utils/health-check/")

    # Assert response
    assert response.status_code == 200
    assert response.content
