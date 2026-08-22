import json

from services.llm_service import generate_response


def analyze_result(
    user_query: str,
    sql: str,
    columns: list,
    rows: list
):

    prompt = f"""
You are QueryPilot, an AI database analytics assistant.

The user asked:

{user_query}

SQL executed:

{sql}

Columns:

{columns}

Query results:

{rows}

Analyze the results and return ONLY valid JSON.

Return exactly:

{{
    "answer": "A concise natural-language answer to the user's question.",
    "summary": "A short summary of the important result.",
    "chart": {{
        "type": "bar | line | pie | table | none",
        "x_axis": "column name or empty string",
        "y_axis": "column name or empty string",
        "title": "chart title"
    }}
}}

RULES:

1. Do not invent data.
2. Use only the provided query results.
3. If the result is a single value, explain that value.
4. If the result contains categories and numeric values, recommend a chart.
5. Use "table" when a chart would not be useful.
6. Use "none" when there is no meaningful visualization.
7. Keep the answer concise.
"""

    response = generate_response(prompt)

    try:

        return json.loads(response)

    except json.JSONDecodeError:

        return {
            "answer": "The query executed successfully.",
            "summary": "",
            "chart": {
                "type": "table",
                "x_axis": "",
                "y_axis": "",
                "title": "Query Results"
            }
        }