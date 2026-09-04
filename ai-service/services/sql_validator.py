import sqlparse


def validate_sql(sql: str):

    if not sql or not sql.strip():

        return {
            "valid": False,
            "error": "SQL query is empty."
        }


    # Parse SQL statements
    statements = sqlparse.parse(sql)


    # Only one statement allowed
    if len(statements) != 1:

        return {
            "valid": False,
            "error": "Only one SQL statement is allowed."
        }


    normalized_sql = sql.strip().lower()


    # Remove trailing semicolon
    normalized_sql = normalized_sql.rstrip(";").strip()


    # ============================================================
    # ONLY READ-ONLY QUERIES
    # ============================================================

    if not (
        normalized_sql.startswith("select ")
        or normalized_sql.startswith("select(")
        or normalized_sql.startswith("with ")
    ):

        return {
            "valid": False,
            "error": "Only read-only SELECT queries are allowed."
        }


    # ============================================================
    # BLOCK DANGEROUS OPERATIONS
    # ============================================================

    dangerous_commands = [
        "insert",
        "update",
        "delete",
        "drop",
        "truncate",
        "alter",
        "create",
        "grant",
        "revoke",
        "merge",
        "copy",
        "vacuum",
        "reindex",
        "comment",
        "execute",
        "call"
    ]


    parsed_tokens = sqlparse.parse(normalized_sql)[0].flatten()


    for token in parsed_tokens:

        if token.ttype in sqlparse.tokens.Keyword.DML:

            keyword = token.value.lower()

            if keyword in dangerous_commands:

                return {
                    "valid": False,
                    "error": f"Operation '{keyword}' is not allowed."
                }


        if token.ttype in sqlparse.tokens.Keyword.DDL:

            keyword = token.value.lower()

            if keyword in dangerous_commands:

                return {
                    "valid": False,
                    "error": f"Operation '{keyword}' is not allowed."
                }


    return {
        "valid": True,
        "error": None
    }