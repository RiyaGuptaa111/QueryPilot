import sqlparse


def validate_sql(sql: str):

    if not sql or not sql.strip():
        return {
            "valid": False,
            "error": "SQL query is empty."
        }

    statements = sqlparse.parse(sql)

    if len(statements) != 1:
        return {
            "valid": False,
            "error": "Only one SQL statement is allowed."
        }

    normalized_sql = sql.strip().lower()

    dangerous_commands = [
        "drop ",
        "delete ",
        "truncate ",
        "alter ",
        "create ",
        "insert ",
        "update ",
        "grant ",
        "revoke "
    ]

    for command in dangerous_commands:

        if normalized_sql.startswith(command):

            return {
                "valid": False,
                "error": f"Operation '{command.strip()}' is not allowed."
            }

    return {
        "valid": True,
        "error": None
    }