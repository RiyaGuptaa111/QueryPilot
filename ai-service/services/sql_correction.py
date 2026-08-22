import json

from services.llm_service import generate_response


def correct_sql(
    user_query: str,
    sql: str,
    error: str,
    schema: str
):

    prompt = f"""
You are QueryPilot, an AI PostgreSQL database copilot.

The following SQL query was generated for a user's question,
but PostgreSQL returned an error.

USER QUESTION:
{user_query}

DATABASE SCHEMA:
{schema}

GENERATED SQL:
{sql}

POSTGRESQL ERROR:
{error}

Your task is to correct the SQL query.

RULES:

1. Use ONLY tables and columns present in the schema.
2. Use PostgreSQL syntax.
3. Do not invent columns or tables.
4. Do not use INSERT, UPDATE, DELETE, DROP, ALTER, or TRUNCATE.
5. Return ONLY valid JSON.
6. If the SQL cannot be safely corrected, return an empty SQL string.

Return exactly:

{{
    "sql": "corrected SQL",
    "explanation": "short explanation of what was corrected"
}}
"""

    response = generate_response(prompt)

    try:
        return json.loads(response)

    except json.JSONDecodeError:

        return {
            "sql": "",
            "explanation": "The AI returned an invalid correction."
        }