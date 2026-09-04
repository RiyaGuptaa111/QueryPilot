print("🔥🔥🔥 QUERY PIPELINE FILE LOADED 🔥🔥🔥")

import time

from services.schema_service import get_database_schema
from services.schema_rag import retrieve_relevant_schema
from services.sql_generator import generate_sql
from services.sql_validator import validate_sql
from services.query_executor import execute_query
from services.sql_correction import correct_sql
from services.result_analyzer import analyze_result
from services.chart_validator import validate_chart


def process_query(user_query: str):

    print("🔥🔥🔥 PROCESS_QUERY CALLED 🔥🔥🔥")
    print("QUERY:", user_query)

    start_time = time.perf_counter()

    # ========================================================
    # 1. GET DATABASE SCHEMA
    # ========================================================

    schema = get_database_schema()

    if not schema:

        execution_time = round(
            time.perf_counter() - start_time,
            3
        )
        

        return {
            "success": False,
            "sql": "",
            "rows": [],
            "columns": [],
            "needs_clarification": True,
            "clarification_question":
                "The database does not contain any tables.",
            "error": None,
            "explanation":
                "No database schema was found.",
            "execution_time": execution_time
        }


    # ========================================================
    # 2. RETRIEVE RELEVANT SCHEMA
    # ========================================================

    relevant_schema = retrieve_relevant_schema(
        user_query,
        top_k=3
    )

    if not relevant_schema:

        execution_time = round(
            time.perf_counter() - start_time,
            3
        )
        

        return {
            "success": False,
            "sql": "",
            "rows": [],
            "columns": [],
            "needs_clarification": True,
            "clarification_question":
                "I couldn't find relevant database information.",
            "error": None,
            "explanation":
                "Schema retrieval returned no relevant tables.",
            "execution_time": execution_time
        }


    # ========================================================
    # 3. BUILD SCHEMA CONTEXT
    # ========================================================

    schema_context = "\n\n".join(
        relevant_schema
    )


    # ========================================================
    # 4. GENERATE SQL
    # ========================================================

    result = generate_sql(
        user_query,
        schema_context
    )


    # ========================================================
    # 5. CLARIFICATION
    # ========================================================

    if result.get("needs_clarification"):

        execution_time = round(
            time.perf_counter() - start_time,
            3
        )

        return {
            "success": False,
            **result,
            "rows": [],
            "columns": [],
            "execution_time": execution_time
        }


    sql = result.get(
        "sql",
        ""
    ).strip()


    # ========================================================
    # 6. NO SQL
    # ========================================================

    if not sql:

        execution_time = round(
            time.perf_counter() - start_time,
            3
        )

        return {
            "success": False,
            "sql": "",
            "rows": [],
            "columns": [],
            "needs_clarification": False,
            "error":
                "No SQL query was generated.",
            "explanation":
                "The AI did not generate a SQL query.",
            "sql_corrected": False,
            "execution_time": execution_time
        }


    # ========================================================
    # 7. VALIDATE SQL
    # ========================================================

    validation = validate_sql(sql)

    if not validation["valid"]:

        execution_time = round(
            time.perf_counter() - start_time,
            3
        )

        return {
            "success": False,
            "sql": sql,
            "rows": [],
            "columns": [],
            "needs_clarification": False,
            "error":
                validation["error"],
            "explanation":
                "The generated SQL failed validation.",
            "sql_corrected": False,
            "execution_time": execution_time
        }


    # ========================================================
    # 8. EXECUTE SQL
    # ========================================================

    execution = execute_query(sql)

    print("🔥🔥🔥 EXECUTION RESULT 🔥🔥🔥")
    print(execution)


    # ========================================================
    # 9. ORIGINAL SQL SUCCESS
    # ========================================================

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

        execution_time = round(
            time.perf_counter() - start_time,
            3
        )

        return {
            "success": True,
            "sql": sql,
            "rows": execution["rows"],
            "columns": execution["columns"],
            "error": None,
            "needs_clarification": False,
            "explanation":
                result.get(
                    "explanation",
                    ""
                ),
            "sql_corrected": False,
            "answer":
                analysis.get(
                    "answer",
                    ""
                ),
            "summary":
                analysis.get(
                    "summary",
                    ""
                ),
            "chart": chart,
            "execution_time": execution_time
        }


    # ========================================================
    # 10. SQL CORRECTION
    # ========================================================

    correction = correct_sql(
        user_query=user_query,
        sql=sql,
        error=execution["error"],
        schema=schema_context
    )

    corrected_sql = correction.get(
        "sql",
        ""
    ).strip()


    # ========================================================
    # 11. CORRECTION FAILED
    # ========================================================

    if not corrected_sql:

        execution_time = round(
            time.perf_counter() - start_time,
            3
        )

        return {
            "success": False,
            "sql": sql,
            "rows": [],
            "columns": [],
            "error":
                execution["error"],
            "needs_clarification": False,
            "explanation":
                correction.get(
                    "explanation",
                    "SQL execution failed and could not be corrected."
                ),
            "sql_corrected": False,
            "execution_time": execution_time
        }


    # ========================================================
    # 12. VALIDATE CORRECTED SQL
    # ========================================================

    corrected_validation = validate_sql(
        corrected_sql
    )

    if not corrected_validation["valid"]:

        execution_time = round(
            time.perf_counter() - start_time,
            3
        )

        return {
            "success": False,
            "sql": corrected_sql,
            "rows": [],
            "columns": [],
            "error":
                corrected_validation["error"],
            "needs_clarification": False,
            "explanation":
                "The corrected SQL failed validation.",
            "sql_corrected": True,
            "execution_time": execution_time
        }


    # ========================================================
    # 13. EXECUTE CORRECTED SQL
    # ========================================================

    corrected_execution = execute_query(
        corrected_sql
    )


    # ========================================================
    # 14. CORRECTED SQL FAILED
    # ========================================================

    if not corrected_execution["success"]:

        execution_time = round(
            time.perf_counter() - start_time,
            3
        )

        return {
            "success": False,
            "sql": corrected_sql,
            "rows": [],
            "columns": [],
            "error":
                corrected_execution["error"],
            "needs_clarification": False,
            "explanation":
                "The corrected SQL also failed during execution.",
            "sql_corrected": True,
            "execution_time": execution_time
        }


    # ========================================================
    # 15. ANALYZE CORRECTED RESULT
    # ========================================================

    analysis = analyze_result(
        user_query=user_query,
        sql=corrected_sql,
        columns=corrected_execution["columns"],
        rows=corrected_execution["rows"]
    )


    # ========================================================
    # 16. VALIDATE CORRECTED CHART
    # ========================================================

    chart = validate_chart(
        analysis.get("chart", {}),
        corrected_execution["columns"]
    )


    # ========================================================
    # 17. FINAL RESPONSE
    # ========================================================

    execution_time = round(
        time.perf_counter() - start_time,
        3
    )

    return {
        "success": True,
        "sql": corrected_sql,
        "rows": corrected_execution["rows"],
        "columns": corrected_execution["columns"],
        "error": None,
        "needs_clarification": False,
        "explanation":
            correction.get(
                "explanation",
                "The generated SQL was automatically corrected."
            ),
        "sql_corrected": True,
        "answer":
            analysis.get(
                "answer",
                ""
            ),
        "summary":
            analysis.get(
                "summary",
                ""
            ),
        "chart": chart,
        "execution_time": execution_time
    }