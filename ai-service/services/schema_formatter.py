def format_schema(schema):

    formatted = []

    for table_name, table_info in schema.items():

        formatted.append(f"TABLE: {table_name}")

        formatted.append("COLUMNS:")

        for column in table_info["columns"]:
            formatted.append(
                f"- {column['name']} ({column['type']})"
            )

        if table_info["relationships"]:

            formatted.append("RELATIONSHIPS:")

            for relation in table_info["relationships"]:
                formatted.append(
                    f"- {table_name}.{relation['column']} "
                    f"-> {relation['references_table']}."
                    f"{relation['references_column']}"
                )

        formatted.append("")

    return "\n".join(formatted)