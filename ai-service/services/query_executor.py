import os

from services.database import get_db_connection


QUERY_TIMEOUT_MS = int(
    os.getenv(
        "QUERY_TIMEOUT_MS",
        "10000"
    )
)


def execute_query(sql: str):

    connection = get_db_connection()
    cursor = connection.cursor()

    try:

        # ========================================================
        # READ-ONLY DATABASE SESSION
        # ========================================================

        connection.set_session(
            readonly=True,
            autocommit=False
        )


        # ========================================================
        # QUERY TIMEOUT
        # ========================================================

        cursor.execute(
            f"SET LOCAL statement_timeout = {QUERY_TIMEOUT_MS}"
        )


        # ========================================================
        # EXECUTE QUERY
        # ========================================================

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
                dict(
                    zip(
                        columns,
                        row
                    )
                )
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