def validate_chart(chart: dict, columns: list):

    print("🔥🔥🔥 VALIDATE_CHART CALLED 🔥🔥🔥")
    print("INPUT CHART:", chart)
    print("COLUMNS:", columns)

    if not chart:
        print("⚠️ NO CHART PROVIDED")
        return {
            "type": "table",
            "x_axis": "",
            "y_axis": "",
            "title": "Query Results"
        }

    chart_type = chart.get("type", "table")
    x_axis = chart.get("x_axis", "")
    y_axis = chart.get("y_axis", "")

    print("CHART TYPE BEFORE VALIDATION:", chart_type)
    print("X AXIS BEFORE VALIDATION:", x_axis)
    print("Y AXIS BEFORE VALIDATION:", y_axis)

    allowed_types = [
        "bar",
        "line",
        "pie",
        "table",
        "none"
    ]

    if chart_type not in allowed_types:
        print("⚠️ INVALID CHART TYPE")
        chart_type = "table"

    if x_axis and x_axis not in columns:
        print("⚠️ INVALID X AXIS:", x_axis)
        x_axis = ""

    if y_axis and y_axis not in columns:
        print("⚠️ INVALID Y AXIS:", y_axis)
        y_axis = ""

    if chart_type in ["bar", "line", "pie"]:

        if not x_axis or not y_axis:
            print("⚠️ CHART CONVERTED TO TABLE BECAUSE AXIS IS MISSING")
            chart_type = "table"

    final_chart = {
        "type": chart_type,
        "x_axis": x_axis,
        "y_axis": y_axis,
        "title": chart.get(
            "title",
            "Query Results"
        )
    }

    print("🔥🔥🔥 FINAL CHART 🔥🔥🔥")
    print(final_chart)

    return final_chart