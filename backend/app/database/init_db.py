from app.database.connection import get_connection


def create_tables():
    with get_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS projects (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(150) NOT NULL,
                    slug VARCHAR(180) UNIQUE NOT NULL,
                    project_type VARCHAR(100) NOT NULL,
                    description TEXT DEFAULT '',
                    framework VARCHAR(100) DEFAULT '',
                    backend VARCHAR(100) DEFAULT '',
                    database VARCHAR(100) DEFAULT '',
                    api_style VARCHAR(100) DEFAULT '',
                    hugz_ai_enabled BOOLEAN DEFAULT FALSE,
                    guardian_enabled BOOLEAN DEFAULT FALSE,
                    status VARCHAR(50) DEFAULT 'created',
                    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
                );
                """
            )

        connection.commit()


if __name__ == "__main__":
    create_tables()
    print("HUGZNETS database tables created successfully.")
