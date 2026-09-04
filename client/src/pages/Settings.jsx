import {
    Database,
    History,
    Moon,
    Palette,
    Server,
    Sun,
    Trash2,
} from "lucide-react";


export default function SettingsPage({
    dark,
    setDark,
    historyCount,
    onClearHistory,
}) {

    const handleClearHistory = () => {

        const confirmed =
            window.confirm(
                "Are you sure you want to clear all query history?"
            );

        if (confirmed) {

            onClearHistory();

        }

    };


    return (

        <section className="settings-page">

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <div className="settings-header">

                <p className="eyebrow">
                    Workspace / Settings
                </p>

                <h2>
                    Settings
                </h2>

                <p>
                    Manage your QueryPilot workspace preferences.
                </p>

            </div>


            {/* ================================================= */}
            {/* APPEARANCE */}
            {/* ================================================= */}

            <section className="card settings-section">

                <div className="settings-title">

                    <div className="settings-title-icon">
                        <Palette size={18} />
                    </div>

                    <div>

                        <h3>
                            Appearance
                        </h3>

                        <p>
                            Customize how QueryPilot looks.
                        </p>

                    </div>

                </div>


                <div className="settings-row">

                    <div className="settings-row-info">

                        {dark ? (
                            <Moon size={18} />
                        ) : (
                            <Sun size={18} />
                        )}

                        <div>

                            <strong>
                                Theme
                            </strong>

                            <p>
                                Currently using{" "}
                                {dark
                                    ? "dark mode"
                                    : "light mode"}
                            </p>

                        </div>

                    </div>


                    <button
                        className="settings-action-button"
                        onClick={() =>
                            setDark(!dark)
                        }
                    >

                        {dark ? (
                            <>
                                <Sun size={15} />
                                Light
                            </>
                        ) : (
                            <>
                                <Moon size={15} />
                                Dark
                            </>
                        )}

                    </button>

                </div>

            </section>


            {/* ================================================= */}
            {/* DATABASE */}
            {/* ================================================= */}

            <section className="card settings-section">

                <div className="settings-title">

                    <div className="settings-title-icon">
                        <Database size={18} />
                    </div>

                    <div>

                        <h3>
                            Database
                        </h3>

                        <p>
                            Current QueryPilot database connection.
                        </p>

                    </div>

                </div>


                <div className="settings-row">

                    <div className="settings-row-info">

                        <Server size={18} />

                        <div>

                            <strong>
                                PostgreSQL
                            </strong>

                            <p>
                                QueryPilot DB
                            </p>

                        </div>

                    </div>


                    <span className="settings-status">

                        <span className="status-dot" />

                        Connected

                    </span>

                </div>

            </section>


            {/* ================================================= */}
            {/* HISTORY */}
            {/* ================================================= */}

            <section className="card settings-section">

                <div className="settings-title">

                    <div className="settings-title-icon">
                        <History size={18} />
                    </div>

                    <div>

                        <h3>
                            Query History
                        </h3>

                        <p>
                            Manage locally saved query history.
                        </p>

                    </div>

                </div>


                <div className="settings-row">

                    <div className="settings-row-info">

                        <History size={18} />

                        <div>

                            <strong>
                                Saved queries
                            </strong>

                            <p>
                                {historyCount} saved{" "}
                                {historyCount === 1
                                    ? "query"
                                    : "queries"}
                            </p>

                        </div>

                    </div>


                    <button
                        className="settings-danger-button"
                        onClick={
                            handleClearHistory
                        }
                        disabled={
                            historyCount === 0
                        }
                    >

                        <Trash2 size={15} />

                        Clear history

                    </button>

                </div>

            </section>

        </section>

    );

}