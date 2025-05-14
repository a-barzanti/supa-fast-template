import uuid
from collections.abc import Generator

import pytest
from faker import Faker
from fastapi.testclient import TestClient
from gotrue import User
from sqlmodel import Session, delete
from supabase import Client, create_client

from app import crud
from app.core.config import settings
from app.core.db import engine, init_db
from app.main import app
from app.models.item import Item, ItemCreate
from app.schemas.auth import Token


@pytest.fixture(scope="module")
def db() -> Generator[Session, None]:
    with Session(engine) as session:
        init_db(session)
        yield session
        statement = delete(Item)
        session.exec(statement)  # type: ignore
        session.commit()


@pytest.fixture(scope="module")
def client() -> Generator[TestClient, None, None]:
    with TestClient(app) as c:
        yield c


@pytest.fixture(scope="session", autouse=True)
def global_cleanup() -> Generator[None, None]:
    yield
    # Clean up all users
    super_client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
    users = super_client.auth.admin.list_users()
    for user in users:
        super_client.auth.admin.delete_user(user.id)


@pytest.fixture(scope="function")
def super_client() -> Generator[Client, None]:
    super_client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
    yield super_client


fake = Faker()


@pytest.fixture(scope="function")
def test_user(super_client: Client) -> Generator[User, None]:
    response = super_client.auth.sign_up(
        {"email": fake.email(), "password": "testpassword123"}
    )
    yield response.user


@pytest.fixture(scope="function")
def test_item(db: Session, test_user: User) -> Generator[Item, None]:
    item_in = ItemCreate(
        title=fake.sentence(nb_words=3), description=fake.text(max_nb_chars=200)
    )
    yield crud.item.create(db, owner_id=uuid.UUID(test_user.id), obj_in=item_in)


@pytest.fixture(scope="function")
def token(super_client: Client) -> Generator[Token, None]:
    response = super_client.auth.sign_up(
        {"email": fake.email(), "password": "testpassword123"}
    )
    yield Token(access_token=response.session.access_token)
