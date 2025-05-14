from faker import Faker
from fastapi.testclient import TestClient

from app.core.config import settings
from app.models.item import Item, ItemCreate, ItemUpdate
from app.schemas.auth import Token
from tests.utils import get_auth_header

fake = Faker()


def test_create_item(client: TestClient, token: Token) -> None:
    """Test create item endpoint"""
    # Prepare test data
    title = fake.sentence(nb_words=3)
    description = fake.text(max_nb_chars=200)
    item_in = ItemCreate(title=title, description=description)

    # Make request
    response = client.post(
        f"{settings.API_V1_STR}/items/create-item",
        headers=get_auth_header(token.access_token),
        json=item_in.model_dump(),
    )

    # Assert response
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == title
    assert data["description"] == description
    assert "id" in data
    assert "owner_id" in data


def test_get_item(client: TestClient, token: Token, test_item: Item) -> None:
    """Test get item by id endpoint"""
    # Make request
    response = client.get(
        f"{settings.API_V1_STR}/items/get-item/{test_item.id}",
        headers=get_auth_header(token.access_token),
    )

    # Assert response
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == str(test_item.id)
    assert data["title"] == test_item.title
    assert data["description"] == test_item.description
    assert data["owner_id"] == str(test_item.owner_id)


def test_get_items(client: TestClient, token: Token, test_item: Item) -> None:
    """Test get items list endpoint"""
    # Make request
    response = client.get(
        f"{settings.API_V1_STR}/items/get-items",
        headers=get_auth_header(token.access_token),
    )

    # Assert response
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0

    # Verify the test_item is in the response
    item_ids = [item["id"] for item in data]
    assert str(test_item.id) in item_ids


def test_update_item(client: TestClient, token: Token, test_item: Item) -> None:
    """Test update item endpoint"""
    # Prepare update data
    new_title = fake.sentence(nb_words=3)
    new_description = fake.text(max_nb_chars=200)
    item_update = ItemUpdate(title=new_title, description=new_description)

    # Make request
    response = client.put(
        f"{settings.API_V1_STR}/items/update-item/{test_item.id}",
        headers=get_auth_header(token.access_token),
        json=item_update.model_dump(),
    )

    # Assert response
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == str(test_item.id)
    assert data["title"] == new_title
    assert data["description"] == new_description
    assert data["owner_id"] == str(test_item.owner_id)


def test_delete_item(client: TestClient, token: Token, test_item) -> None:
    """Test delete item endpoint"""
    # Make delete request
    response = client.delete(
        f"{settings.API_V1_STR}/items/delete/{test_item.id}",
        headers=get_auth_header(token.access_token),
    )

    # Assert delete response
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == str(test_item.id)

    # Verify item is deleted by trying to get it
    get_response = client.get(
        f"{settings.API_V1_STR}/items/get-item/{test_item.id}",
        headers=get_auth_header(token.access_token),
    )
    assert get_response.status_code == 200
    assert get_response.json() is None
