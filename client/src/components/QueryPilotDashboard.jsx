import { useState } from "react";
import {
    AlertCircle,
    BarChart3,
    Check,
    ChevronDown,
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


function Sidebar({ active, setActive, onNewQuery }) {
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
                    Query<span className="brand-accent">Pilot</span>
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
                        <strong>QueryPilot DB</strong>
                        <small>PostgreSQL</small>
                    </div>

                    <MoreHorizontal size={16} />
                </div>

                <div className="profile">

                    <span className="avatar">
                        <UserRound size={16} />
                    </span>

                    <div>
                        <strong>QueryPilot User</strong>
                        <small>AI workspace</small>
                    </div>

                </div>

            </div>

        </aside>
    );
}


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
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask anything about your database..."
                aria-label="Natural language query"
            />

            <div className="composer-footer">

                <div className="suggestions">

                    {suggestions.map((suggestion) => (
                        <button
                            key={suggestion}
                            onClick={() => setQuery(suggestion)}
                        >
                            {suggestion}
                        </button>
                    ))}

                </div>

                <button
                    className="run-button"
                    onClick={onRun}
                    disabled={loading || !query.trim()}
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

                    <span>⌘ ↵</span>

                </button>

            </div>

        </section>
    );
}


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
                                "Query executed successfully."}
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
                        Ask a question about your database to get started.
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


function SQLCard({
    sql,
    corrected,
}) {

    const [copied, setCopied] =
        useState(false);

    if (!sql) {
        return null;
    }

    const copySQL = async () => {

        try {
            await navigator.clipboard.writeText(sql);

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
                    {sql}
                </code>
            </pre>

        </section>
    );
}


function ResultsTable({ result }) {

    if (
        !result ||
        !result.rows ||
        result.rows.length === 0
    ) {
        return null;
    }

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

                <button className="icon-button">
                    <MoreHorizontal size={16} />
                </button>

            </div>

            <div className="table-scroll">

                <table>

                    <thead>

                        <tr>

                            {result.columns?.map(
                                (column) => (
                                    <th key={column}>
                                        {column}
                                    </th>
                                )
                            )}

                        </tr>

                    </thead>

                    <tbody>

                        {result.rows.map(
                            (row, index) => (

                                <tr key={index}>

                                    {result.columns?.map(
                                        (column) => (

                                            <td key={column}>
                                                {formatValue(
                                                    row[column]
                                                )}
                                            </td>

                                        )
                                    )}

                                </tr>

                            )
                        )}

                    </tbody>

                </table>

            </div>

        </section>
    );
}


function formatValue(value) {

    if (value === null ||
        value === undefined) {

        return "NULL";
    }

    if (typeof value === "object") {

        return JSON.stringify(value);
    }

    return String(value);
}


function Visualization({
    result,
}) {

    const [mode, setMode] =
        useState("chart");

    if (
        !result ||
        !result.chart ||
        result.chart.type === "none"
    ) {
        return null;
    }

    if (
        !result.rows ||
        result.rows.length === 0
    ) {
        return null;
    }

    const chart = result.chart;

    const chartData = result.rows.map(
        (row) => ({
            ...row,
            [chart.x_axis]:
                row[chart.x_axis],
            [chart.y_axis]:
                Number(row[chart.y_axis]) || 0,
        })
    );

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
                    xAxis={chart.x_axis}
                    yAxis={chart.y_axis}
                />
            ) : (
                <ResultsTable result={result} />
            )}

        </section>
    );
}


function DynamicChart({
    type,
    data,
    xAxis,
    yAxis,
}) {

    if (type === "pie") {

        return (
            <div className="chart-wrap">

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
                            outerRadius={100}
                        >
                            {data.map(
                                (_, index) => (
                                    <Cell
                                        key={index}
                                        fill={
                                            [
                                                "#6d7cff",
                                                "#26c6da",
                                                "#7c5cff",
                                                "#f59e0b",
                                                "#10b981",
                                            ][
                                                index % 5
                                            ]
                                        }
                                    />
                                )
                            )}
                        </Pie>

                        <Tooltip />

                    </PieChart>

                </ResponsiveContainer>

            </div>
        );
    }

    if (type === "line") {

        return (
            <div className="chart-wrap">

                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >

                    <LineChart data={data}>

                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#293449"
                            vertical={false}
                        />

                        <XAxis
                            dataKey={xAxis}
                            stroke="#71809b"
                            tickLine={false}
                            axisLine={false}
                        />

                        <YAxis
                            stroke="#71809b"
                            tickLine={false}
                            axisLine={false}
                        />

                        <Tooltip />

                        <Line
                            type="monotone"
                            dataKey={yAxis}
                            stroke="#6d7cff"
                            strokeWidth={3}
                            dot={{ r: 4 }}
                        />

                    </LineChart>

                </ResponsiveContainer>

            </div>
        );
    }

    return (
        <div className="chart-wrap">

            <ResponsiveContainer
                width="100%"
                height="100%"
            >

                <BarChart data={data}>

                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#293449"
                        vertical={false}
                    />

                    <XAxis
                        dataKey={xAxis}
                        stroke="#71809b"
                        tickLine={false}
                        axisLine={false}
                    />

                    <YAxis
                        stroke="#71809b"
                        tickLine={false}
                        axisLine={false}
                    />

                    <Tooltip />

                    <Bar
                        dataKey={yAxis}
                        fill="#6d7cff"
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


    const handleRunQuery = async () => {

        if (!query.trim()) {
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {

            const data =
                await runQuery(query.trim());

            setResult(data);

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


    const handleNewQuery = () => {

        setQuery("");
        setResult(null);
        setError(null);
        setActive("Overview");

    };


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
                            <b>Connected</b>
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
                            <SQLCard
                                sql={result.sql}
                                corrected={
                                    result.sql_corrected
                                }
                            />
                        )}

                    <ResultsTable
                        result={result}
                    />

                    <Visualization
                        result={result}
                    />

                </div>

            </main>

        </div>
    );
}