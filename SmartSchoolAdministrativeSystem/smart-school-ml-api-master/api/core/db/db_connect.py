import os
import psycopg2
import psycopg2.extras


def connect(func):
    def wrapper(*args, **kwargs):
        conn = psycopg2.connect(
            host=os.environ["DB_HOST"],
            database=os.environ["DB_DATABASE"],
            user=os.environ["DB_USERNAME"],
            password=os.environ["DB_PASSWORD"],
        )

        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        result = func(*args, cursor=cur, **kwargs)

        conn.commit()
        cur.close()
        conn.close()

        return result

    return wrapper
