import logging

from sqlalchemy import Engine
from sqlmodel import Session

from app.core.db import engine, init_db

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def init(db_engine: Engine) -> None:
    with Session(db_engine) as session:
        init_db(session)


def main() -> None:
    logger.info("Creating initial data")
    init(engine)
    logger.info("Initial data created")


if __name__ == "__main__":
    main()
