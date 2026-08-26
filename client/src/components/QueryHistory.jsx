import { useMemo, useState } from "react";

import {
    Clock3,
    Code2,
    Database,
    History,
    Play,
    Search,
    Trash2,
    X,
} from "lucide-react";


function formatDate(timestamp) {

    if (!timestamp) {
        return "";
    }

    try {

        return new Date(timestamp).toLocaleString(
            [],
            {
                dateStyle: "medium",
                timeStyle: "short",
            }
        );

    } catch {

        return "";

    }

}


export default function QueryHistory({
    history = [],
    onSelect,
    onClear,
    onDelete,
}) {

    const [search, setSearch] =
        useState("");


    const filteredHistory = useMemo(() => {

        const searchText =
            search.trim().toLowerCase();

        if (!searchText) {
            return history;
        }

        return history.filter((item) =>
            item.query
                ?.toLowerCase()
                .includes(searchText)
        );

    }, [history, search]);


    return (

        <section className="history-page">

            <div className="history-header">

                <div>

                    <p className="eyebrow">
                        Workspace / Query History
                    </p>

                    <h2>
                        Query History
                    </h2>

                    <p className="history-description">
                        Review and rerun your previous
                        database queries.
                    </p>

                </div>


                {history.length > 0 && (

                    <button
                        className="clear-history"
                        onClick={onClear}
                    >
                        <Trash2 size={15} />
                        Clear history
                    </button>

                )}

            </div>


            {history.length > 0 && (

                <div className="history-search">

                    <Search size={16} />

                    <input
                        type="text"
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        placeholder="Search previous queries..."
                        aria-label="Search previous queries"
                    />

                    {search && (

                        <button
                            className="history-search-clear"
                            onClick={() =>
                                setSearch("")
                            }
                            aria-label="Clear search"
                        >
                            <X size={15} />
                        </button>

                    )}

                </div>

            )}


            {history.length === 0 ? (

                <div className="empty-history">

                    <div className="empty-history-icon">
                        <Clock3 size={24} />
                    </div>

                    <h3>
                        No queries yet
                    </h3>

                    <p>
                        Your successful queries will
                        appear here.
                    </p>

                </div>

            ) : filteredHistory.length === 0 ? (

                <div className="empty-history">

                    <div className="empty-history-icon">
                        <Search size={24} />
                    </div>

                    <h3>
                        No matching queries
                    </h3>

                    <p>
                        Try a different search term.
                    </p>

                </div>

            ) : (

                <div className="history-list">

                    {filteredHistory.map((item) => (

                        <article
                            className="history-item"
                            key={item.id}
                        >

                            <div className="history-icon">
                                <Database size={17} />
                            </div>


                            <div className="history-content">

                                <h3>
                                    {item.query}
                                </h3>


                                <p>
                                    {item.answer ||
                                        "Query completed successfully."}
                                </p>


                                <div className="history-meta">

                                    <span>
                                        <Clock3
                                            size={12}
                                        />

                                        {formatDate(
                                            item.timestamp
                                        )}
                                    </span>


                                    {item.sql && (

                                        <span>
                                            <Code2
                                                size={12}
                                            />
                                            SQL generated
                                        </span>

                                    )}

                                </div>

                            </div>


                            <div className="history-actions">

                                <button
                                    className="rerun-button"
                                    onClick={() =>
                                        onSelect(item)
                                    }
                                >
                                    <Play
                                        size={14}
                                        fill="currentColor"
                                    />
                                    Rerun
                                </button>


                                {onDelete && (

                                    <button
                                        className="history-delete"
                                        onClick={() =>
                                            onDelete(
                                                item.id
                                            )
                                        }
                                        title="Delete query"
                                        aria-label="Delete query"
                                    >
                                        <Trash2
                                            size={15}
                                        />
                                    </button>

                                )}

                            </div>

                        </article>

                    ))}

                </div>

            )}

        </section>

    );

}