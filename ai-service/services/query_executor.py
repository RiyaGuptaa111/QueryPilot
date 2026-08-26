from services.database import get_db_connection


def execute_query(sql: str):

    connection = get_db_connection()
    cursor = connection.cursor()

    try:

        cursor.execute(sql)

        # Column names from returned table
        columns = [
            description[0]
            for description in cursor.description
        ]

        rows = cursor.fetchall()

        results = []

        for row in rows:
            results.append(
                dict(zip(columns, row))
            )

        connection.commit()

        return {
            "success": True,
            "columns": columns,
            "rows": results,
            "error": None
        }

    except Exception as error:

        connection.rollback()

        return {
            "success": False,
            "columns": [],
            "rows": [],
            "error": str(error)
        }

    finally:

        cursor.close()
        connection.close()