import uuid

from sqlmodel import Session

from app.crud.base import CRUDBase
from app.models.item import Item, ItemCreate, ItemUpdate


class CRUDItem(CRUDBase[Item, ItemCreate, ItemUpdate]):
    def create(
        self, session: Session, *, owner_id: uuid.UUID, obj_in: ItemCreate
    ) -> Item:
        return super().create(session, owner_id=owner_id, obj_in=obj_in)

    def update(
        self, session: Session, *, id: uuid.UUID, obj_in: ItemUpdate
    ) -> Item | None:
        return super().update(session, id=id, obj_in=obj_in)


item = CRUDItem(Item)
