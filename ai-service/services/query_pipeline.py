from services.schema_service import get_database_schema
from services.schema_rag import retrieve_relevant_schema
from services.sql_generator import generate_sql
from services.sql_validator import validate_sql
from services.query_executor import execute_query
from services.sql_correction import correct_sql
from services.result_analyzer import analyze_result
from services.chart_validator import validate_chart

def process_query(user_query: str):

    # 1. Get database schema
    schema = get_database_schema()

    if not schema:

        return {
            "success": False,
            "sql": "",
            "rows": [],
            "needs_clarification": True,
            "clarification_question": "The database does not contain any tables.",
            "explanation": "No database schema was found."
        }

    # 2. Retrieve relevant schema
    relevant_schema = retrieve_relevant_schema(
        user_query,
        top_k=3
    )

    if not relevant_schema:

        return {
            "success": False,
            "sql": "",
            "rows": [],
            "needs_clarification": True,
            "clarification_question":
                "I couldn't find relevant database information.",
            "explanation":
                "Schema retrieval returned no relevant tables."
        }

    # 3. Build schema context
    schema_context = "\n\n".join(relevant_schema)

    # 4. Generate SQL
    result = generate_sql(
        user_query,
        schema_context
    )

    # 5. Stop if clarification is needed
    if result.get("needs_clarification"):

        return {
            "success": False,
            **result,
            "rows": []
        }

    sql = result.get("sql", "")

    # 6. Validate SQL
    validation = validate_sql(sql)

    if not validation["valid"]:

        return {
            "success": False,
            "sql": sql,
            "rows": [],
            "needs_clarification": False,
            "error": validation["error"],
            "explanation": "The generated SQL failed validation."
        }

        # 7. Execute SQL
    execution = execute_query(sql)

    # 8. If execution succeeds, return results
    if execution["success"]:

        analysis = analyze_result(
            user_query=user_query,
            sql=sql,
            columns=execution["columns"],
            rows=execution["rows"]
        )
        chart = validate_chart(
            analysis.get("chart", {}),
            execution["columns"]
        )

        return {
            "success": True,
            "sql": sql,
            "rows": execution["rows"],
            "columns": execution["columns"],
            "error": None,
            "needs_clarification": False,
            "explanation": result.get("explanation", ""),
            "sql_corrected": False,
            "answer": analysis.get("answer", ""),
            "summary": analysis.get("summary", ""),
            "chart": chart        }

    # 9. Ask Gemini to correct the failed SQL
    correction = correct_sql(
        user_query=user_query,
        sql=sql,
        error=execution["error"],
        schema=schema_context
    )

    corrected_sql = correction.get("sql", "")

    # 10. Validate corrected SQL
    if not corrected_sql:

        return {
            "success": False,
            "sql": sql,
            "rows": [],
            "columns": [],
            "error": execution["error"],
            "needs_clarification": False,
            "explanation": "SQL execution failed and could not be corrected."
        }

    corrected_validation = validate_sql(corrected_sql)

    if not corrected_validation["valid"]:

        return {
            "success": False,
            "sql": corrected_sql,
            "rows": [],
            "columns": [],
            "error": corrected_validation["error"],
            "needs_clarification": False,
            "explanation": "The corrected SQL failed validation."
        }

    # 11. Execute corrected SQL
    corrected_execution = execute_query(corrected_sql)

    # 12. Return corrected result
    if corrected_execution["success"]:

        analysis = analyze_result(
            user_query=user_query,
            sql=corrected_sql,
            columns=corrected_execution["columns"],
            rows=corrected_execution["rows"]
        )

        return {
            "success": True,
            "sql": corrected_sql,
            "rows": corrected_execution["rows"],
            "columns": corrected_execution["columns"],
            "error": None,
            "needs_clarification": False,
            "explanation": correction.get(
                "explanation",
                "The generated SQL was automatically corrected."
            ),
            "sql_corrected": True,
            "answer": analysis.get("answer", ""),
            "summary": analysis.get("summary", ""),
            "chart": analysis.get("chart", {})
        }