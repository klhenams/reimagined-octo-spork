from core.db.db_connect import connect
import os

@connect
def get_student_by_id(id, cursor):
    cursor.execute('SELECT * FROM "Student" WHERE id=%s;', (id,))
    return cursor.fetchone()