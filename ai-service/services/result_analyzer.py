
from numbers import Number


def analyze_result(
    user_query: str,
    sql: str,
    columns: list,
    rows: list
):

    print("COLUMNS:", columns)
    print("ROWS:", rows)

    # -----------------------------------------
    # 1. No results
    # -----------------------------------------

    if not rows:

        print("⚠️ NO ROWS FOUND")

        return {
            "answer":
                "The query executed successfully, but no records were found.",

            "summary":
                "No matching records were found.",

            "chart": {
                "type": "none",
                "x_axis": "",
                "y_axis": "",
                "title": "Query Results"
            }
        }

    # -----------------------------------------
    # 2. Convert rows into dictionaries
    # -----------------------------------------

    # -----------------------------------------
# 2. Convert rows into dictionaries
# -----------------------------------------

    result_rows = []

    for row in rows:

        # execute_query() already returns dictionaries
        if isinstance(row, dict):
            result_rows.append(row)

        # Safety: if rows ever come as tuples/lists
        else:
            result_rows.append(
                dict(zip(columns, row))
            )

    row_count = len(result_rows)

    print("ROW COUNT:", row_count)
    print("RESULT ROWS:", result_rows)

    # -----------------------------------------
    # 3. Single value result
    # -----------------------------------------

    if len(columns) == 1 and row_count == 1:

        column = columns[0]
        value = result_rows[0][column]

        print("📌 SINGLE VALUE RESULT")

        return {
            "answer":
                f"{column}: {value}",

            "summary":
                f"The query returned one value: {value}.",

            "chart": {
                "type": "none",
                "x_axis": "",
                "y_axis": "",
                "title": "Query Result"
            }
        }

    # -----------------------------------------
    # 4. One column with multiple rows
    # -----------------------------------------

    if len(columns) == 1:

        column = columns[0]

        print("📌 ONE COLUMN RESULT")

        return {
            "answer":
                f"The query returned {row_count} records for {column}.",

            "summary":
                f"{row_count} records were returned.",

            "chart": {
                "type": "table",
                "x_axis": "",
                "y_axis": "",
                "title": "Query Results"
            }
        }

    # -----------------------------------------
    # 5. Detect numeric columns
    # -----------------------------------------

    numeric_columns = []

    for column in columns:

        values = [
            row[column]
            for row in result_rows
            if row[column] is not None
        ]

        print(
            f"🔎 COLUMN: {column} | "
            f"VALUES: {values}"
        )

        if not values:
            continue

        print(
            f"🔎 TYPES: "
            f"{[type(value).__name__ for value in values]}"
        )

        if all(
            isinstance(value, Number)
            and not isinstance(value, bool)
            for value in values
        ):

            numeric_columns.append(column)

    print("--------------------------------")
    print("COLUMNS:", columns)
    print("NUMERIC COLUMNS:", numeric_columns)
    print("--------------------------------")

    # -----------------------------------------
    # 6. Two columns:
    #    one categorical + one numeric
    # -----------------------------------------

    if (
        len(columns) == 2
        and len(numeric_columns) == 1
    ):

        y_axis = numeric_columns[0]

        x_axis = next(
            column
            for column in columns
            if column != y_axis
        )

        print("🔥🔥🔥 BAR CHART SELECTED 🔥🔥🔥")
        print("X AXIS:", x_axis)
        print("Y AXIS:", y_axis)

        chart_result = {
            "type": "bar",
            "x_axis": x_axis,
            "y_axis": y_axis,
            "title": f"{y_axis} by {x_axis}"
        }

        print("CHART RESULT:", chart_result)

        return {
            "answer":
                f"The query executed successfully and returned {row_count} records.",

            "summary":
                f"{row_count} records were returned with {y_axis} as the numeric value.",

            "chart": chart_result
        }

    # -----------------------------------------
    # 7. Default
    # -----------------------------------------

    print("⚠️ DEFAULT TABLE CHART SELECTED")

    return {
        "answer":
            f"The query executed successfully and returned {row_count} records.",

        "summary":
            f"{row_count} records were returned across {len(columns)} columns.",

        "chart": {
            "type": "table",
            "x_axis": "",
            "y_axis": "",
            "title": "Query Results"
        }
    }