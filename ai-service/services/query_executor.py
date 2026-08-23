from services.database import get_db_connection


def execute_query(sql: str):

    connection = get_db_connection()
    cursor = connection.cursor()

    try:

        cursor.execute(sql)
        
# column names from the returned table
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

        return {
            "success": True,
            "columns": columns,
            "rows": results,
            "error": None
        }

    except Exception as error:

        return {
            "success": False,
            "columns": [],
            "rows": [],
            "error": str(error)
        }

    finally:

        cursor.close()
        connection.close()