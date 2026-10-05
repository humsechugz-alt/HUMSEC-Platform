import os

import psycopg
from dotenv import load_dotenv
from psycopg.rows import dict_row


load_dotenv()


DATABASE_URL = os.getenv("HUGZNETS_DATABASE_URL")


if not DATABASE_URL:
    raise RuntimeError(
        "HUGZNETS_DATABASE_URL is not configured. "
        "Create backend/.env for local development."
    )


def get_connection():
    return psycopg.connect(
        DATABASE_URL,
        row_factory=dict_row,
    )


def test_database_connection():
    with get_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute("SELECT current_database();")
            result = cursor.fetchone()

    return result["current_database"]
