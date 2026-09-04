import { useMemo, useState } from "react";

import {
    Clock3,
    Code2,
    Database,
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
        const date = new Date(timestamp);

        if (Number.isNaN(date.getTime())) {
            return "";
        }

        return date.toLocaleString([], {
            dateStyle: "medium",
            timeStyle: "short",
        });
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
    const [search, setSearch] = useState("");

    const safeHistory = Array.isArray(history)
        ? history
        : [];

    const filteredHistory = useMemo(() => {
        const searchText = search
            .trim()
            .toLowerCase();

        if (!searchText) {
            return safeHistory;
        }

        return safeHistory.filter((item) =>
            String(item?.query || "")
                .toLowerCase()
                .includes(searchText)
        );
    }, [safeHistory, search]);

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

                {safeHistory.length > 0 && (
                    <button
                        className="clear-history"
                        onClick={onClear}
                        type="button"
                    >
                        <Trash2 size={15} />
                        Clear history
                    </button>
                )}

            </div>


            {safeHistory.length > 0 && (
                <div className="history-search">

                    <Search size={16} />

                    <input
                        type="text"
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        placeholder="Search previous queries..."
                        aria-label="Search previous queries"
                    />

                    {search && (
                        <button
                            className="history-search-clear"
                            onClick={() => setSearch("")}
                            type="button"
                            aria-label="Clear search"
                        >
                            <X size={15} />
                        </button>
                    )}

                </div>
            )}


            {safeHistory.length === 0 ? (

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

                    {filteredHistory.map((item, index) => {

                        const itemId =
                            item?.id ??
                            `${item?.timestamp || "query"}-${index}`;

                        return (
                            <article
                                className="history-item"
                                key={itemId}
                            >

                                <div className="history-icon">
                                    <Database size={17} />
                                </div>


                                <div className="history-content">

                                    <h3>
                                        {item?.query ||
                                            "Untitled query"}
                                    </h3>


                                    <p>
                                        {item?.answer ||
                                            item?.summary ||
                                            "Query completed successfully."}
                                    </p>


                                    <div className="history-meta">

                                        {item?.timestamp && (
                                            <span>
                                                <Clock3 size={12} />

                                                {formatDate(
                                                    item.timestamp
                                                )}
                                            </span>
                                        )}


                                        {item?.sql && (
                                            <span>
                                                <Code2 size={12} />
                                                SQL generated
                                            </span>
                                        )}


                                        {item?.sql_corrected && (
                                            <span className="corrected">
                                                SQL corrected
                                            </span>
                                        )}

                                    </div>

                                </div>


                                <div className="history-actions">

                                    <button
                                        className="rerun-button"
                                        onClick={() =>
                                            onSelect?.(item)
                                        }
                                        type="button"
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
                                                onDelete(item.id)
                                            }
                                            title="Delete query"
                                            aria-label="Delete query"
                                            type="button"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    )}

                                </div>

                            </article>
                        );
                    })}

                </div>
            )}

        </section>
    );
}