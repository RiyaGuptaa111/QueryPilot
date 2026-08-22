import json

from services.llm_service import generate_response


def generate_sql(user_query: str, schema: str):

    prompt = f"""
You are QueryPilot, an AI database copilot.

Your job is to convert a user's natural-language question
into a valid PostgreSQL SQL query.

RELEVANT DATABASE SCHEMA:
{schema}

USER QUESTION:
{user_query}

Return ONLY valid JSON:

{{
    "sql": "SQL query or empty string",
    "is_ambiguous": true or false,
    "needs_clarification": true or false,
    "clarification_question": "question or empty string",
    "explanation": "short explanation"
}}

RULES:

1. Use ONLY tables and columns present in the provided schema.
2. Never invent table or column names.
3. Use PostgreSQL syntax.
4. If the question is ambiguous, do not generate SQL.
5. If clarification is needed, set needs_clarification to true.
6. If the question is clear, set needs_clarification to false.
7. Return SQL without markdown code blocks.
8. Keep the explanation short.
"""

    response = generate_response(prompt)

    try:
        return json.loads(response)

    except json.JSONDecodeError:

        return {
            "sql": "",
            "is_ambiguous": True,
            "needs_clarification": True,
            "clarification_question": "Could you rephrase your question?",
            "explanation": "The AI returned an invalid response format."
        }