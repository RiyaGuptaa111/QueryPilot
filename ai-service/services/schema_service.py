from services.database import get_db_connection


print("🔥🔥🔥 SCHEMA SERVICE FILE LOADED 🔥🔥🔥")


def get_database_schema():

    print("🔥🔥🔥 GET_DATABASE_SCHEMA CALLED 🔥🔥🔥")

    connection = None
    cursor = None

    try:

        connection = get_db_connection()

        print("✅ DATABASE CONNECTION CREATED")

        cursor = connection.cursor()


        # ========================================================
        # GET TABLES + COLUMNS
        # ========================================================

        cursor.execute("""
            SELECT
                table_name,
                column_name,
                data_type
            FROM information_schema.columns
            WHERE table_schema = 'public'
            AND table_name NOT LIKE 'pg_%'
            ORDER BY table_name, ordinal_position;
        """)

        column_rows = cursor.fetchall()

        print(
            "📊 COLUMN ROW COUNT:",
            len(column_rows)
        )


        # ========================================================
        # GET FOREIGN KEY RELATIONSHIPS
        # ========================================================

        cursor.execute("""
            SELECT
                tc.table_name AS table_name,
                kcu.column_name AS column_name,
                ccu.table_name AS referenced_table,
                ccu.column_name AS referenced_column
            FROM information_schema.table_constraints AS tc

            JOIN information_schema.key_column_usage AS kcu
                ON tc.constraint_name = kcu.constraint_name
                AND tc.table_schema = kcu.table_schema

            JOIN information_schema.constraint_column_usage AS ccu
                ON ccu.constraint_name = kcu.constraint_name
                AND ccu.table_schema = kcu.table_schema

            WHERE tc.constraint_type = 'FOREIGN KEY'
            AND tc.table_schema = 'public';
        """)

        relationship_rows = cursor.fetchall()

        print(
            "🔗 RELATIONSHIP COUNT:",
            len(relationship_rows)
        )


        # ========================================================
        # BUILD SCHEMA
        # ========================================================

        schema = {}


        for (
            table_name,
            column_name,
            data_type
        ) in column_rows:

            if table_name not in schema:

                schema[table_name] = {

                    "table_name": table_name,

                    "columns": [],

                    "relationships": []

                }


            schema[table_name]["columns"].append({

                "name": column_name,

                "type": data_type

            })


        # ========================================================
        # ADD RELATIONSHIPS
        # ========================================================

        for (
            table_name,
            column_name,
            referenced_table,
            referenced_column
        ) in relationship_rows:

            if table_name not in schema:

                schema[table_name] = {

                    "table_name": table_name,

                    "columns": [],

                    "relationships": []

                }


            schema[table_name][
                "relationships"
            ].append({

                "column": column_name,

                "references_table":
                    referenced_table,

                "references_column":
                    referenced_column

            })


        # ========================================================
        # CONVERT DICTIONARY → LIST
        # ========================================================

        schema_list = list(
            schema.values()
        )


        print(
            "🔥 TABLE COUNT:",
            len(schema_list)
        )

        print(
            "🔥 DATABASE SCHEMA:",
            schema_list
        )


        return schema_list


    except Exception as error:

        print(
            "❌❌❌ SCHEMA ERROR ❌❌❌"
        )

        print(
            "ERROR:",
            error
        )

        raise


    finally:

        if cursor:

            cursor.close()

        if connection:

            connection.close()

        print(
            "🔒 DATABASE CONNECTION CLOSED"
        )