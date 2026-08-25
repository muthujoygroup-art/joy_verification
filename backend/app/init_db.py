import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import logging
from backend.app.config import settings

logger = logging.getLogger("init_db")
logging.basicConfig(level=logging.INFO)

def create_postgres_database():
    try:
        conn = psycopg2.connect(
            host=settings.POSTGRES_HOST,
            port=int(settings.POSTGRES_PORT),
            user=settings.POSTGRES_USER,
            password=settings.POSTGRES_PASSWORD,
            dbname="postgres",
            connect_timeout=3
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = conn.cursor()
        
        cur.execute("SELECT 1 FROM pg_database WHERE datname=%s", (settings.POSTGRES_DB,))
        if not cur.fetchone():
            cur.execute(f'CREATE DATABASE "{settings.POSTGRES_DB}"')
            logger.info(f"Successfully created database '{settings.POSTGRES_DB}' in PostgreSQL!")
        else:
            logger.info(f"Database '{settings.POSTGRES_DB}' already exists in PostgreSQL.")
            
        cur.close()
        conn.close()
        return True
    except Exception as e:
        logger.error(f"PostgreSQL database init error: {e}")
        return False

if __name__ == "__main__":
    create_postgres_database()
