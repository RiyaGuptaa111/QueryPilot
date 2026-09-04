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

import { useEffect, useState } from "react";

import { getSchema } from "../services/api";


export default function DatabaseExplorer() {

    const [schema, setSchema] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);

    const [expanded, setExpanded] = useState({});


    // ============================================================
    // LOAD DATABASE SCHEMA
    // ============================================================

    const loadSchema = async () => {

        try {

            setLoading(true);
            setError(null);

            const data = await getSchema();


            const tables = normalizeSchema(data);

            setSchema(tables);

        } catch (err) {

            console.error(
                "❌ SCHEMA ERROR:",
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


    // ============================================================
    // TOGGLE TABLE
    // ============================================================

    const toggleTable = (tableName) => {

        setExpanded((previous) => ({

            ...previous,

            [tableName]:
                !previous[tableName],

        }));

    };


    // ============================================================
    // LOADING
    // ============================================================

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


    // ============================================================
    // ERROR
    // ============================================================

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
                        type="button"
                    >

                        <RefreshCw size={15} />

                        Retry

                    </button>

                </div>

            </section>

        );

    }


    // ============================================================
    // DATABASE EXPLORER
    // ============================================================

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
                    aria-label="Refresh schema"
                    type="button"
                >

                    <RefreshCw size={16} />

                </button>

            </div>


            <div className="schema-status">

                <span className="status-dot" />

                Connected to PostgreSQL

                <span className="schema-table-count">
                    {schema.length} tables
                </span>

            </div>


            <div className="schema-list">

                {schema.length === 0 ? (

                    <div className="empty-history">

                        <Database size={24} />

                        <h3>
                            No tables found
                        </h3>

                        <p>
                            The PostgreSQL database returned
                            no table information.
                        </p>

                        <button
                            className="run-button"
                            onClick={loadSchema}
                            type="button"
                        >

                            <RefreshCw size={15} />

                            Refresh

                        </button>

                    </div>

                ) : (

                    schema.map((table, index) => {

                        const parsed =
                            parseTable(
                                table,
                                index
                            );


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


// ============================================================
// NORMALIZE SCHEMA RESPONSE
// ============================================================

function normalizeSchema(data) {

    if (!data) {
        return [];
    }


    // Direct array

    if (Array.isArray(data)) {

        return data;

    }


    // { schema: [...] }

    if (Array.isArray(data.schema)) {

        return data.schema;

    }


    // { schema: { tables: [...] } }

    if (
        data.schema &&
        Array.isArray(data.schema.tables)
    ) {

        return data.schema.tables;

    }


    // ============================================================
    // ACTUAL QUERY PILOT RESPONSE
    //
    // {
    //     success: true,
    //     schema: {
    //         departments: {...},
    //         employees: {...}
    //     }
    // }
    // ============================================================

    if (
        data.schema &&
        typeof data.schema === "object" &&
        !Array.isArray(data.schema)
    ) {

        return Object.entries(
            data.schema
        ).map(
            ([tableName, tableData]) => ({

                table_name: tableName,

                columns:
                    Array.isArray(
                        tableData?.columns
                    )
                        ? tableData.columns
                        : [],

                relationships:
                    Array.isArray(
                        tableData?.relationships
                    )
                        ? tableData.relationships
                        : [],

            })
        );

    }


    // { tables: [...] }

    if (Array.isArray(data.tables)) {

        return data.tables;

    }


    // { results: [...] }

    if (Array.isArray(data.results)) {

        return data.results;

    }


    // { data: [...] }

    if (Array.isArray(data.data)) {

        return data.data;

    }


    // { data: { schema: [...] } }

    if (
        data.data &&
        Array.isArray(data.data.schema)
    ) {

        return data.data.schema;

    }


    // { data: { tables: [...] } }

    if (
        data.data &&
        Array.isArray(data.data.tables)
    ) {

        return data.data.tables;

    }


    console.warn(
        "⚠️ Unknown schema response format:",
        data
    );

    return [];

}


// ============================================================
// PARSE TABLE
// ============================================================

function parseTable(table, index) {

    if (
        typeof table === "object" &&
        table !== null
    ) {

        return {

            name:
                table.table_name ||
                table.table ||
                table.name ||
                table.TABLE_NAME ||
                `Table ${index + 1}`,

            columns:
                Array.isArray(table.columns)
                    ? table.columns
                    : Array.isArray(table.fields)
                        ? table.fields
                        : [],

            relationships:
                Array.isArray(
                    table.relationships
                )
                    ? table.relationships
                    : [],

        };

    }


    const text = String(table);


    const tableMatch =
        text.match(
            /TABLE:\s*(.+)/i
        );


    const tableName =
        tableMatch
            ? tableMatch[1].trim()
            : `Table ${index + 1}`;


    const columns = [];


    const columnSection =
        text
            .split(/COLUMNS:/i)[1]
            ?.split(/RELATIONSHIPS:/i)[0] ||
        "";


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
        text
            .split(/RELATIONSHIPS:/i)[1] ||
        "";


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


// ============================================================
// FORMAT RELATIONSHIP
// ============================================================

function formatRelationship(relationship) {

    if (
        typeof relationship === "string"
    ) {

        return relationship;

    }


    if (
        typeof relationship === "object" &&
        relationship !== null
    ) {

        const column =
            relationship.column ||
            relationship.column_name ||
            "";


        const referencedTable =
            relationship.references_table ||
            relationship.referenced_table ||
            "";


        const referencedColumn =
            relationship.references_column ||
            relationship.referenced_column ||
            "";


        if (
            column &&
            referencedTable &&
            referencedColumn
        ) {

            return (
                `${column} → ` +
                `${referencedTable}.` +
                `${referencedColumn}`
            );

        }


        return JSON.stringify(
            relationship
        );

    }


    return String(relationship);

}


// ============================================================
// TABLE CARD
// ============================================================

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
                type="button"
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

                    {table.columns.length > 0 ? (

                        <div className="schema-columns">

                            {table.columns.map(
                                (column, index) => {

                                    const name =
                                        typeof column === "string"
                                            ? column
                                            : column.name ||
                                              column.column_name ||
                                              column.COLUMN_NAME ||
                                              "column";


                                    const type =
                                        typeof column === "string"
                                            ? ""
                                            : column.type ||
                                              column.data_type ||
                                              column.DATA_TYPE ||
                                              "";


                                    return (

                                        <div
                                            className="schema-column"
                                            key={`${name}-${index}`}
                                        >

                                            <span className="column-icon">

                                                {name
                                                    .toLowerCase()
                                                    .includes("id") ? (

                                                    <KeyRound
                                                        size={13}
                                                    />

                                                ) : (

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

                    ) : (

                        <p className="empty-answer">
                            No column information available.
                        </p>

                    )}


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

                                        {formatRelationship(
                                            relationship
                                        )}

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