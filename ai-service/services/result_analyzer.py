def analyze_result(
    user_query: str,
    sql: str,
    columns: list,
    rows: list
):
    """
    Analyze database results without calling Gemini.

    This keeps result analysis deterministic and avoids
    consuming an additional Gemini API request.
    """

    # No results
    if not rows:
        return {
            "answer": "The query executed successfully, but no records were found.",
            "summary": "No matching records were found.",
            "chart": {
                "type": "none",
                "x_axis": "",
                "y_axis": "",
                "title": "Query Results"
            }
        }

    # Convert rows into dictionaries
    result_rows = []

    for row in rows:
        result_rows.append(
            dict(zip(columns, row))
        )

    row_count = len(result_rows)

    # Single value result
    if len(columns) == 1 and row_count == 1:

        column = columns[0]
        value = result_rows[0][column]

        return {
            "answer": f"{column}: {value}",
            "summary": f"The query returned one value: {value}.",
            "chart": {
                "type": "none",
                "x_axis": "",
                "y_axis": "",
                "title": "Query Result"
            }
        }

    # One column with multiple rows
    if len(columns) == 1:

        column = columns[0]

        return {
            "answer": (
                f"The query returned {row_count} records "
                f"for {column}."
            ),
            "summary": f"{row_count} records were returned.",
            "chart": {
                "type": "table",
                "x_axis": "",
                "y_axis": "",
                "title": "Query Results"
            }
        }

    # Detect numeric columns
    numeric_columns = []

    for column in columns:

        values = [
            row[column]
            for row in result_rows
            if row[column] is not None
        ]

        if values and all(
            isinstance(value, (int, float))
            and not isinstance(value, bool)
            for value in values
        ):
            numeric_columns.append(column)

    # If there is one categorical column + one numeric column,
    # recommend a bar chart.
    if len(columns) == 2 and len(numeric_columns) == 1:

        x_axis = next(
            column
            for column in columns
            if column != numeric_columns[0]
        )

        y_axis = numeric_columns[0]

        return {
            "answer": (
                f"The query returned {row_count} records."
            ),
            "summary": (
                f"The results contain {row_count} records "
                f"with {y_axis} as a numeric value."
            ),
            "chart": {
                "type": "bar",
                "x_axis": x_axis,
                "y_axis": y_axis,
                "title": f"{y_axis} by {x_axis}"
            }
        }

    # Default case
    return {
        "answer": (
            f"The query executed successfully and returned "
            f"{row_count} records."
        ),
        "summary": (
            f"{row_count} records were returned "
            f"across {len(columns)} columns."
        ),
        "chart": {
            "type": "table",
            "x_axis": "",
            "y_axis": "",
            "title": "Query Results"
        }
    }