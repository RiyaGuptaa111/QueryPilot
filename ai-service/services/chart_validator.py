def validate_chart(chart: dict, columns: list):

    if not chart:
        return {
            "type": "table",
            "x_axis": "",
            "y_axis": "",
            "title": "Query Results"
        }

    chart_type = chart.get("type", "table")
    x_axis = chart.get("x_axis", "")
    y_axis = chart.get("y_axis", "")

    allowed_types = [
        "bar",
        "line",
        "pie",
        "table",
        "none"
    ]

    if chart_type not in allowed_types:
        chart_type = "table"

    if x_axis and x_axis not in columns:
        x_axis = ""

    if y_axis and y_axis not in columns:
        y_axis = ""

    if chart_type in ["bar", "line", "pie"]:

        if not x_axis or not y_axis:
            chart_type = "table"

    return {
        "type": chart_type,
        "x_axis": x_axis,
        "y_axis": y_axis,
        "title": chart.get(
            "title",
            "Query Results"
        )
    }