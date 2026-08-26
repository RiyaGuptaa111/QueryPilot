import { useEffect, useState } from "react";

import {
    AlertCircle,
    BarChart3,
    Check,
    Clock3,
    Code2,
    Copy,
    Database,
    History,
    LayoutDashboard,
    Loader2,
    Moon,
    MoreHorizontal,
    Play,
    Plus,
    Settings,
    Sparkles,
    Sun,
    Table2,
    Terminal,
    UserRound,
} from "lucide-react";

import {
    Bar,
    BarChart,
    CartesianGrid,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    Cell,
} from "recharts";

import { runQuery } from "../services/api";
import QueryHistory from "./QueryHistory";
import DatabaseExplorer from "./DatabaseExplorer";


// ============================================================
// SIDEBAR
// ============================================================

function Sidebar({
    active,
    setActive,
    onNewQuery,
}) {
    const items = [
        {
            label: "Overview",
            icon: LayoutDashboard,
        },
        {
            label: "Query History",
            icon: History,
        },
        {
            label: "Database",
            icon: Database,
        },
        {
            label: "Settings",
            icon: Settings,
        },
    ];

    return (
        <aside className="sidebar">

            <div className="brand">

                <span className="brand-mark">
                    <Terminal size={16} />
                </span>

                <span>
                    Query
                    <span className="brand-accent">
                        Pilot
                    </span>
                </span>

            </div>


            <button
                className="new-query"
                onClick={onNewQuery}
            >
                <Plus size={17} />
                New query
                <span>⌘ K</span>
            </button>


            <p className="nav-label">
                Workspace
            </p>


            <nav>

                {items.map(({ label, icon: Icon }) => (

                    <button
                        key={label}
                        className={
                            active === label
                                ? "nav-item active"
                                : "nav-item"
                        }
                        onClick={() => setActive(label)}
                    >

                        <Icon size={17} />

                        {label}

                    </button>

                ))}

            </nav>


            <div className="sidebar-bottom">

                <div className="connection">

                    <span className="status-dot" />

                    <div>
                        <strong>
                            QueryPilot DB
                        </strong>

                        <small>
                            PostgreSQL
                        </small>
                    </div>

                    <MoreHorizontal size={16} />

                </div>


                <div className="profile">

                    <span className="avatar">
                        <UserRound size={16} />
                    </span>

                    <div>
                        <strong>
                            QueryPilot User
                        </strong>

                        <small>
                            AI workspace
                        </small>
                    </div>

                </div>

            </div>

        </aside>
    );
}


// ============================================================
// QUERY COMPOSER
// ============================================================

function QueryComposer({
    query,
    setQuery,
    onRun,
    loading,
}) {

    const suggestions = [
        "What is the average salary of employees?",
        "How many students are there in each department?",
        "Which department has the highest average salary?",
    ];

    return (
        <section className="composer card">

            <div className="section-kicker">
                <Sparkles size={15} />
                Ask your database
            </div>


            <textarea
                value={query}
                onChange={(e) =>
                    setQuery(e.target.value)
                }
                placeholder="Ask anything about your database..."
                aria-label="Natural language query"
            />


            <div className="composer-footer">

                <div className="suggestions">

                    {suggestions.map((suggestion) => (

                        <button
                            key={suggestion}
                            onClick={() =>
                                setQuery(suggestion)
                            }
                        >
                            {suggestion}
                        </button>

                    ))}

                </div>


                <button
                    className="run-button"
                    onClick={onRun}
                    disabled={
                        loading ||
                        !query.trim()
                    }
                >

                    {loading ? (
                        <Loader2
                            className="spin"
                            size={16}
                        />
                    ) : (
                        <Play
                            size={16}
                            fill="currentColor"
                        />
                    )}

                    {loading
                        ? "Running"
                        : "Run query"}

                    <span>
                        ⌘ ↵
                    </span>

                </button>

            </div>

        </section>
    );
}


// ============================================================
// AI RESPONSE
// ============================================================

function AIResponse({
    result,
    loading,
    error,
}) {

    return (
        <section className="card ai-card">

            <div className="section-kicker">

                <Sparkles size={15} />

                AI response

                <span className="live-dot" />

            </div>


            {loading && (

                <div className="loading-state">

                    <Loader2
                        className="spin"
                        size={21}
                    />

                    Thinking through your schema...

                </div>

            )}


            {!loading && error && (

                <div className="error-box">

                    <AlertCircle size={20} />

                    <div>

                        <strong>
                            Query failed
                        </strong>

                        <p>
                            {error}
                        </p>

                    </div>

                </div>

            )}


            {!loading &&
                !error &&
                result?.needs_clarification && (

                    <div className="clarification-box">

                        <div className="clarification-icon">
                            ?
                        </div>

                        <div>

                            <strong>
                                I need some clarification
                            </strong>

                            <p>
                                {result.clarification_question ||
                                    "Could you provide more details about what you want to know?"}
                            </p>

                        </div>

                    </div>

                )}


            {!loading &&
                !error &&
                !result?.needs_clarification &&
                result && (

                    <>

                        <p className="ai-answer">
                            {result.answer ||
                                result.explanation ||
                                (result.rows?.length
                                    ? "Query executed successfully. Results are shown below."
                                    : "Query executed successfully.")}
                        </p>


                        {result.summary && (

                            <p className="ai-summary">
                                {result.summary}
                            </p>

                        )}

                    </>

                )}


            {!loading &&
                !error &&
                !result && (

                    <p className="empty-answer">
                        Ask a question about your database
                        to get started.
                    </p>

                )}


            {result && (

                <div className="response-meta">

                    <span>
                        <Clock3 size={13} />
                        Query processed
                    </span>


                    {result.sql_corrected && (

                        <span className="corrected">

                            <Check size={12} />

                            SQL automatically corrected

                        </span>

                    )}

                </div>

            )}

        </section>
    );
}


// ============================================================
// SQL CARD
// ============================================================

function SQLCard({
    sql,
    corrected,
}) {

    const displaySQL =
        sql ||
        "";

    const [copied, setCopied] =
        useState(false);

  if (!displaySQL) {
    return null;
}


    const copySQL = async () => {

        try {

           await navigator.clipboard.writeText(
    displaySQL
);

            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 1500);

        } catch (error) {
            console.error(error);
        }

    };


    return (
        <section className="card sql-card">

            <div className="card-header">

                <div>

                    <div className="section-kicker">
                        <Code2 size={15} />
                        Generated SQL
                    </div>


                    {corrected && (

                        <span className="corrected">

                            <Check size={12} />

                            SQL automatically corrected

                        </span>

                    )}

                </div>


                <button
                    className="icon-button"
                    onClick={copySQL}
                    aria-label="Copy SQL"
                >

                    {copied ? (
                        <Check size={16} />
                    ) : (
                        <Copy size={16} />
                    )}

                </button>

            </div>


            <pre>
                <code>
                    {displaySQL}
                </code>
            </pre>

        </section>
    );
}


// ============================================================
// RESULTS TABLE
// ============================================================

function ResultsTable({ result }) {

    if (
        !result ||
        !Array.isArray(result.rows) ||
        result.rows.length === 0
    ) {
        return null;
    }


    const columns =
        Array.isArray(result.columns) &&
        result.columns.length > 0
            ? result.columns
            : Object.keys(result.rows[0] || {});


    return (
        <section className="card results-table">

            <div className="card-header">

                <div>

                    <div className="section-kicker">
                        <Table2 size={15} />
                        Query results
                    </div>

                    <h3>
                        {result.rows.length}{" "}
                        {result.rows.length === 1
                            ? "row"
                            : "rows"}{" "}
                        returned
                    </h3>

                </div>

            </div>


            <div className="table-scroll">

                <table>

                    <thead>

                        <tr>

                            {columns.map((column) => (

                                <th key={column}>
                                    {column}
                                </th>

                            ))}

                        </tr>

                    </thead>


                    <tbody>

                        {result.rows.map((row, index) => (

                            <tr key={index}>

                                {columns.map((column) => (

                                    <td key={column}>
                                        {formatValue(
                                            row[column]
                                        )}
                                    </td>

                                ))}

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </section>
    );
}


// ============================================================
// FORMAT VALUE
// ============================================================

function formatValue(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "NULL";
    }


    if (typeof value === "boolean") {
        return value ? "true" : "false";
    }


    if (typeof value === "number") {

        return Number.isFinite(value)
            ? value.toLocaleString()
            : String(value);

    }


    if (value instanceof Date) {
        return value.toLocaleString();
    }


    if (typeof value === "object") {

        try {

            return JSON.stringify(value);

        } catch {

            return String(value);

        }

    }


    return String(value);
}


// ============================================================
// VISUALIZATION
// ============================================================

function Visualization({ result }) {

    const [mode, setMode] =
        useState("chart");


    if (
        !result ||
        !result.chart ||
        result.chart.type === "none" ||
        result.chart.type === "table"
    ) {
        return null;
    }


    if (
        !Array.isArray(result.rows) ||
        result.rows.length === 0
    ) {
        return null;
    }


    const chart = result.chart;

    const xAxis = chart.x_axis;
    const yAxis = chart.y_axis;


    // TASK 8
    if (!xAxis || !yAxis) {

        return (
            <section className="card viz-card">

                <div className="section-kicker">
                    <BarChart3 size={15} />
                    Visualization
                </div>

                <p className="empty-answer">
                    This query does not have enough
                    data dimensions for a chart.
                </p>

            </section>
        );

    }


    // TASK 7
    const chartData = result.rows.map((row) => {

        const formattedRow = {
            ...row,
        };

        if (
            yAxis &&
            formattedRow[yAxis] !== undefined &&
            formattedRow[yAxis] !== null
        ) {

            const numericValue =
                Number(formattedRow[yAxis]);

            if (!Number.isNaN(numericValue)) {

                formattedRow[yAxis] =
                    numericValue;

            }

        }

        return formattedRow;

    });

    console.log("📊 VISUALIZATION RESULT:", result);
    console.log("📊 CHART:", result.chart);
    console.log("📊 CHART DATA:", chartData);
    console.log("📊 X AXIS:", xAxis);
    console.log("📊 Y AXIS:", yAxis);


    return (
        <section className="card viz-card">

            <div className="card-header">

                <div>

                    <div className="section-kicker">
                        <BarChart3 size={15} />
                        Visualization
                    </div>

                    <h3>
                        {chart.title ||
                            "Query Results"}
                    </h3>

                </div>


                <div className="view-toggle">

                    <button
                        className={
                            mode === "chart"
                                ? "selected"
                                : ""
                        }
                        onClick={() =>
                            setMode("chart")
                        }
                    >
                        <BarChart3 size={15} />
                        Chart
                    </button>


                    <button
                        className={
                            mode === "table"
                                ? "selected"
                                : ""
                        }
                        onClick={() =>
                            setMode("table")
                        }
                    >
                        <Table2 size={15} />
                        Table
                    </button>

                </div>

            </div>


            {mode === "chart" ? (

                <DynamicChart
                    type={chart.type}
                    data={chartData}
                    xAxis={xAxis}
                    yAxis={yAxis}
                />

            ) : (

                <ResultsTable
                    result={result}
                />

            )}

        </section>
    );
}


// ============================================================
// DYNAMIC CHART
// ============================================================

// ============================================================
// DYNAMIC CHART
// ============================================================

function DynamicChart({
    type,
    data,
    xAxis,
    yAxis,
}) {

    console.log("📊 DYNAMIC CHART");
    console.log("TYPE:", type);
    console.log("DATA:", data);
    console.log("X AXIS:", xAxis);
    console.log("Y AXIS:", yAxis);


    if (
        !xAxis ||
        !yAxis ||
        !Array.isArray(data) ||
        data.length === 0
    ) {

        return (
            <div className="empty-answer">
                Unable to create visualization
                from the returned columns.
            </div>
        );

    }


    // ========================================================
    // BAR CHART
    // ========================================================

    if (type === "bar") {

        return (
            <div
                className="chart-wrap"
                style={{
                    width: "100%",
                    height: "360px",
                    minHeight: "360px",
                }}
            >

                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >

                    <BarChart
                        data={data}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 60,
                        }}
                    >

                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                        />

                        <XAxis
                            dataKey={xAxis}
                            tickLine={false}
                            axisLine={false}
                            angle={-20}
                            textAnchor="end"
                            interval={0}
                        />

                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            allowDecimals={false}
                        />

                        <Tooltip />

                        <Bar
                            dataKey={yAxis}
                            radius={[
                                5,
                                5,
                                0,
                                0,
                            ]}
                        />

                    </BarChart>

                </ResponsiveContainer>

            </div>
        );

    }


    // ========================================================
    // LINE CHART
    // ========================================================

    if (type === "line") {

        return (
            <div
                className="chart-wrap"
                style={{
                    width: "100%",
                    height: "360px",
                    minHeight: "360px",
                }}
            >

                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >

                    <LineChart
                        data={data}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 20,
                        }}
                    >

                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                        />

                        <XAxis
                            dataKey={xAxis}
                            tickLine={false}
                            axisLine={false}
                        />

                        <YAxis
                            tickLine={false}
                            axisLine={false}
                        />

                        <Tooltip />

                        <Line
                            type="monotone"
                            dataKey={yAxis}
                            strokeWidth={3}
                            dot={{ r: 4 }}
                        />

                    </LineChart>

                </ResponsiveContainer>

            </div>
        );

    }


    // ========================================================
    // PIE CHART
    // ========================================================

    if (type === "pie") {

        return (
            <div
                className="chart-wrap"
                style={{
                    width: "100%",
                    height: "360px",
                    minHeight: "360px",
                }}
            >

                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >

                    <PieChart>

                        <Pie
                            data={data}
                            dataKey={yAxis}
                            nameKey={xAxis}
                            cx="50%"
                            cy="50%"
                            outerRadius={110}
                        >

                            {data.map((_, index) => (

                                <Cell
                                    key={index}
                                    fill={
                                        [
                                            "#6d7cff",
                                            "#26c6da",
                                            "#7c5cff",
                                            "#f59e0b",
                                            "#10b981",
                                        ][index % 5]
                                    }
                                />

                            ))}

                        </Pie>

                        <Tooltip />

                    </PieChart>

                </ResponsiveContainer>

            </div>
        );

    }


    return (
        <div className="empty-answer">
            Unsupported chart type: {type}
        </div>
    );

}


// ============================================================
// MAIN DASHBOARD
// ============================================================

export default function QueryPilotDashboard() {

    const [active, setActive] =
        useState("Overview");


    const [query, setQuery] =
        useState("");


    const [loading, setLoading] =
        useState(false);


    const [result, setResult] =
        useState(null);


    const [error, setError] =
        useState(null);


    const [dark, setDark] =
        useState(true);


    // ========================================================
    // HISTORY
    // ========================================================

    const [history, setHistory] =
        useState(() => {

            try {

                const saved =
                    localStorage.getItem(
                        "querypilot_history"
                    );

                return saved
                    ? JSON.parse(saved)
                    : [];

            } catch {

                return [];

            }

        });


    useEffect(() => {

        localStorage.setItem(
            "querypilot_history",
            JSON.stringify(history)
        );

    }, [history]);


    // ========================================================
    // RUN QUERY
    // ========================================================

    const handleRunQuery = async () => {

        if (!query.trim()) {
            return;
        }


        setLoading(true);
        setError(null);
        setResult(null);


        const currentQuery =
            query.trim();


        try {

            const data = await runQuery(currentQuery);

            // TASK 5
            console.log("========== QUERY RESULT ==========");
            console.log("FULL RESPONSE:", data);
            console.log("SUCCESS:", data?.success);
            console.log("ANSWER:", data?.answer);
            console.log("SUMMARY:", data?.summary);
            console.log("SQL:", data?.sql);
            console.log("ROWS:", data?.rows);
            console.log("COLUMNS:", data?.columns);
            console.log("CHART:", data?.chart);
            console.log("CLARIFICATION:", data?.needs_clarification);
            console.log("==================================");


            setResult(data);


            // SAVE ONLY ON SUCCESS
            // This is the single history-saving block.
            if (
                data &&
                data.success !== false
            ) {

                setHistory((previous) => {

                    const newItem = {

                        id: Date.now(),

                        query: currentQuery,

                        answer:
                            data.answer ||
                            data.explanation ||
                            "Query completed successfully.",

                        sql:
                            data.sql || "",

                        summary:
                            data.summary || "",

                        chart:
                            data.chart || null,

                        timestamp:
                            new Date().toISOString(),

                    };


                    const normalizedQuery =
    currentQuery
        .trim()
        .toLowerCase();

return [
    newItem,
    ...previous.filter(
        (item) =>
            item.query
                ?.trim()
                .toLowerCase() !==
            normalizedQuery
    ),
].slice(0, 50);

                });

            }

        } catch (err) {

            console.error(
                "Query error:",
                err
            );


            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                err.message ||
                "Failed to process query."
            );

        } finally {

            setLoading(false);

        }

    };


    // ========================================================
    // NEW QUERY
    // ========================================================

    const handleNewQuery = () => {

        setQuery("");
        setResult(null);
        setError(null);
        setActive("Overview");

    };


    // ========================================================
    // HISTORY SELECT
    // ========================================================

    const handleHistorySelect = (
        historyItem
    ) => {

        setQuery(
            historyItem.query
        );

        setResult(null);

        setError(null);

        setActive("Overview");

    };


    // ========================================================
    // CLEAR HISTORY
    // ========================================================

    const handleClearHistory = () => {

        setHistory([]);

        localStorage.removeItem(
            "querypilot_history"
        );

    };

    const handleDeleteHistory = (id) => {

    setHistory((previous) =>
        previous.filter(
            (item) => item.id !== id
        )
    );

};


    // ========================================================
    // KEYBOARD SHORTCUT
    // ========================================================

    useEffect(() => {

        const handleKeyDown = (event) => {

            if (
                (event.ctrlKey ||
                    event.metaKey) &&
                event.key.toLowerCase() === "k"
            ) {

                event.preventDefault();

                handleNewQuery();

            }


            if (
                (event.ctrlKey ||
                    event.metaKey) &&
                event.key === "Enter"
            ) {

                event.preventDefault();

                if (
                    query.trim() &&
                    !loading
                ) {

                    handleRunQuery();

                }

            }

        };


        window.addEventListener(
            "keydown",
            handleKeyDown
        );


        return () => {

            window.removeEventListener(
                "keydown",
                handleKeyDown
            );

        };

    }, [query, loading]);


    // ========================================================
    // RENDER
    // ========================================================

    return (

        <div
            className={
                dark
                    ? "app-shell"
                    : "app-shell light-shell"
            }
        >

            <Sidebar
                active={active}
                setActive={setActive}
                onNewQuery={handleNewQuery}
            />


            <main className="main-content">

                <header className="topbar">

                    <div>

                        <p className="eyebrow">
                            Workspace / {active}
                        </p>

                        <h1>
                            AI Database Copilot
                        </h1>

                    </div>


                    <div className="top-actions">

                        <div className="db-status">

                            <span className="status-dot" />

                            PostgreSQL

                            <b>
                                Connected
                            </b>

                        </div>


                        <button
                            className="icon-button"
                            onClick={() =>
                                setDark(!dark)
                            }
                            aria-label="Toggle theme"
                        >

                            {dark ? (
                                <Sun size={17} />
                            ) : (
                                <Moon size={17} />
                            )}

                        </button>

                    </div>

                </header>


                <div className="content-grid">


                    {/* ==================================================
                        OVERVIEW
                    ================================================== */}

                    {active === "Overview" && (

                        <>

                            <QueryComposer
                                query={query}
                                setQuery={setQuery}
                                onRun={handleRunQuery}
                                loading={loading}
                            />


                            <AIResponse
                                result={result}
                                loading={loading}
                                error={error}
                            />


                            {result &&
                                !result.needs_clarification && (

                                    <>

                                        <SQLCard
                                            sql={result.sql}
                                            corrected={
                                                result.sql_corrected
                                            }
                                        />


                                        <ResultsTable
                                            result={result}
                                        />


                                        <Visualization
                                            result={result}
                                        />

                                    </>

                                )}

                        </>

                    )}


                    {/* ==================================================
                        QUERY HISTORY
                    ================================================== */}

                    {active === "Query History" && (

                        <QueryHistory
    history={history}
    onSelect={
        handleHistorySelect
    }
    onClear={
        handleClearHistory
    }
    onDelete={
        handleDeleteHistory
    }
/>

                    )}


                    {/* ==================================================
                        DATABASE
                    ================================================== */}

                    {active === "Database" && (

                        <DatabaseExplorer />

                    )}


                    {/* ==================================================
                        SETTINGS
                    ================================================== */}

                    {active === "Settings" && (

                        <section className="card coming-soon">

                            <Settings size={24} />

                            <h2>
                                Settings
                            </h2>

                            <p>
                                QueryPilot settings
                                will be available here.
                            </p>

                        </section>

                    )}

                </div>

            </main>

        </div>
    );
}