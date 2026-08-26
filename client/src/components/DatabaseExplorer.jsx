import {
    ChevronDown,
    ChevronRight,
    Database,
    KeyRound,
    Link2,
    Loader2,
    RefreshCw,
    Table2,
} from "lucide-react";

// import DatabaseExplorer from "../pages/DatabaseExplorer";

import { useEffect, useState } from "react";

import { getSchema } from "../services/api";


export default function DatabaseExplorer() {

    const [schema, setSchema] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);

    const [expanded, setExpanded] = useState({});


    const loadSchema = async () => {

        try {

            setLoading(true);
            setError(null);

            const data = await getSchema();

            console.log("SCHEMA RESPONSE:", data);


            /*
             * Handle all possible backend formats.
             */

            let tables = [];


            if (Array.isArray(data)) {

                tables = data;

            } else if (Array.isArray(data?.schema)) {

                tables = data.schema;

            } else if (Array.isArray(data?.schema?.tables)) {

                tables = data.schema.tables;

            } else if (Array.isArray(data?.results)) {

                tables = data.results;

            }


            setSchema(tables);

        } catch (err) {

            console.error(
                "Schema error:",
                err
            );

            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                err.message ||
                "Unable to load database schema."
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadSchema();

    }, []);


    const toggleTable = (tableName) => {

        setExpanded((previous) => ({
            ...previous,
            [tableName]:
                !previous[tableName],
        }));

    };


    if (loading) {

        return (
            <section className="card schema-page">

                <div className="schema-loading">

                    <Loader2
                        className="spin"
                        size={22}
                    />

                    Loading database schema...

                </div>

            </section>
        );

    }


    if (error) {

        return (
            <section className="card schema-page">

                <div className="schema-error">

                    <Database size={22} />

                    <h3>
                        Unable to load schema
                    </h3>

                    <p>
                        {error}
                    </p>

                    <button
                        className="run-button"
                        onClick={loadSchema}
                    >

                        <RefreshCw size={15} />

                        Retry

                    </button>

                </div>

            </section>
        );

    }


    return (

        <section className="schema-page">

            <div className="schema-header">

                <div>

                    <div className="section-kicker">

                        <Database size={15} />

                        Database Explorer

                    </div>

                    <h2>
                        QueryPilot DB
                    </h2>

                    <p>
                        PostgreSQL database schema
                    </p>

                </div>


                <button
                    className="icon-button"
                    onClick={loadSchema}
                    title="Refresh schema"
                >

                    <RefreshCw size={16} />

                </button>

            </div>


            <div className="schema-status">

                <span className="status-dot" />

                Connected to PostgreSQL

            </div>


            <div className="schema-list">

                {schema.length === 0 ? (

                    <div className="empty-history">

                        <Database size={24} />

                        <h3>
                            No tables found
                        </h3>

                        <p>
                            No database tables were returned.
                        </p>

                    </div>

                ) : (

                    schema.map((table, index) => {

                        const parsed =
                            parseTable(table, index);


                        return (

                            <TableSchemaCard
                                key={`${parsed.name}-${index}`}
                                table={parsed}
                                expanded={
                                    expanded[parsed.name]
                                }
                                onToggle={() =>
                                    toggleTable(
                                        parsed.name
                                    )
                                }
                            />

                        );

                    })

                )}

            </div>

        </section>

    );

}


/* ============================================================
   PARSE TABLE
============================================================ */

function parseTable(table, index) {

    if (
        typeof table === "object" &&
        table !== null
    ) {

        return {

            name:
                table.table_name ||
                table.name ||
                `Table ${index + 1}`,

            columns:
                table.columns || [],

            relationships:
                table.relationships || [],

        };

    }


    const text = String(table);


    const tableMatch =
        text.match(
            /TABLE:\s*(.+)/
        );


    const tableName =
        tableMatch
            ? tableMatch[1].trim()
            : `Table ${index + 1}`;


    const columns = [];


    const columnSection =
        text
            .split("COLUMNS:")[1]
            ?.split("RELATIONSHIPS:")[0] || "";


    columnSection
        .split("\n")
        .forEach((line) => {

            const match =
                line.match(
                    /-\s*(.+?)\s*\((.+?)\)/
                );


            if (match) {

                columns.push({

                    name:
                        match[1].trim(),

                    type:
                        match[2].trim(),

                });

            }

        });


    const relationshipSection =
        text.split("RELATIONSHIPS:")[1] || "";


    const relationships =
        relationshipSection
            .split("\n")
            .map(
                (line) =>
                    line
                        .replace(/^-\s*/, "")
                        .trim()
            )
            .filter(Boolean);


    return {

        name: tableName,

        columns,

        relationships,

    };

}


/* ============================================================
   TABLE CARD
============================================================ */

function TableSchemaCard({
    table,
    expanded,
    onToggle,
}) {

    return (

        <div className="schema-table">

            <button
                className="schema-table-header"
                onClick={onToggle}
            >

                {expanded ? (
                    <ChevronDown size={16} />
                ) : (
                    <ChevronRight size={16} />
                )}

                <Table2 size={17} />

                <strong>
                    {table.name}
                </strong>

                <span>
                    {table.columns.length} columns
                </span>

            </button>


            {expanded && (

                <div className="schema-table-body">

                    <div className="schema-columns">

                        {table.columns.map(
                            (column, index) => {

                                const name =
                                    typeof column === "string"
                                        ? column
                                        : column.name ||
                                          column.column_name ||
                                          "column";


                                const type =
                                    typeof column === "string"
                                        ? ""
                                        : column.type ||
                                          column.data_type ||
                                          "";


                                return (

                                    <div
                                        className="schema-column"
                                        key={`${name}-${index}`}
                                    >

                                        <span className="column-icon">

                                            {name
                                                .toLowerCase()
                                                .includes("id")
                                                ? (
                                                    <KeyRound
                                                        size={13}
                                                    />
                                                )
                                                : (
                                                    <Table2
                                                        size={13}
                                                    />
                                                )}

                                        </span>


                                        <span className="column-name">
                                            {name}
                                        </span>


                                        <span className="column-type">
                                            {type}
                                        </span>

                                    </div>

                                );

                            }
                        )}

                    </div>


                    {table.relationships?.length > 0 && (

                        <div className="relationships">

                            <div className="relationship-title">

                                <Link2 size={13} />

                                Relationships

                            </div>


                            {table.relationships.map(
                                (relationship, index) => (

                                    <div
                                        key={index}
                                        className="relationship"
                                    >
                                        {relationship}
                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>

            )}

        </div>

    );

}