const HISTORY_KEY = "querypilot_history";

export function getQueryHistory() {
    try {
        const stored = localStorage.getItem(HISTORY_KEY);

        if (!stored) {
            return [];
        }

        return JSON.parse(stored);
    } catch (error) {
        console.error("Failed to read query history:", error);
        return [];
    }
}

export function saveQueryToHistory(queryData) {
    try {
        const history = getQueryHistory();

        const newEntry = {
            id: Date.now().toString(),
            query: queryData.query,
            sql: queryData.sql || "",
            answer: queryData.answer || "",
            summary: queryData.summary || "",
            success: queryData.success !== false,
            sql_corrected: queryData.sql_corrected || false,
            timestamp: new Date().toISOString(),
        };

        const updatedHistory = [
            newEntry,
            ...history,
        ].slice(0, 50);

        localStorage.setItem(
            HISTORY_KEY,
            JSON.stringify(updatedHistory)
        );

        return newEntry;

    } catch (error) {
        console.error(
            "Failed to save query history:",
            error
        );

        return null;
    }
}

export function deleteQueryFromHistory(id) {
    const history = getQueryHistory();

    const updatedHistory =
        history.filter(
            (item) => item.id !== id
        );

    localStorage.setItem(
        HISTORY_KEY,
        JSON.stringify(updatedHistory)
    );

    return updatedHistory;
}

export function clearQueryHistory() {
    localStorage.removeItem(HISTORY_KEY);
}