import json
from services.llm_service import generate_response


def generate_sql(user_query: str, schema: str):

    prompt = f"""
You are QueryPilot, an AI database copilot.

Convert the user's natural-language request into SQL
using ONLY the provided database schema.

DATABASE SCHEMA:
{schema}

USER QUERY:
{user_query}

Return ONLY valid JSON with exactly these fields:

{{
    "sql": "SQL query or empty string",
    "is_ambiguous": true or false,
    "needs_clarification": true or false,
    "clarification_question": "question or empty string",
    "explanation": "short explanation"
}}

RULES:
1. Never invent tables or columns.
2. If the request is ambiguous, do not generate SQL.
3. If clarification is required, set needs_clarification to true.
4. Put the clarification question in clarification_question.
5. If the query is clear, generate valid SQL.
6. Use only SQL compatible with the provided schema.
"""

    response = generate_response(prompt)

    try:
        return json.loads(response)
    except json.JSONDecodeError:
        return {
            "sql": "",
            "is_ambiguous": True,
            "needs_clarification": True,
            "clarification_question": "I couldn't understand the request clearly. Could you rephrase it?",
            "explanation": "The AI returned an invalid response format."
        }