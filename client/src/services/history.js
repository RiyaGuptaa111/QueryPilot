const HISTORY_KEY = "querypilot_history";

const MAX_HISTORY_ITEMS = 50;


// ============================================================
// GET HISTORY
// ============================================================

export function getQueryHistory() {
    try {
        const stored =
            localStorage.getItem(HISTORY_KEY);

        if (!stored) {
            return [];
        }

        const parsed = JSON.parse(stored);

        return Array.isArray(parsed)
            ? parsed
            : [];

    } catch (error) {

        console.error(
            "Failed to read query history:",
            error
        );

        return [];
    }
}


// ============================================================
// SAVE QUERY
// ============================================================

export function saveQueryToHistory(queryData) {

    try {

        if (!queryData?.query?.trim()) {
            return null;
        }

        const history =
            getQueryHistory();

        const normalizedQuery =
            queryData.query
                .trim()
                .toLowerCase();


        const newEntry = {

            id: Date.now().toString(),

            query:
                queryData.query.trim(),

            sql:
                queryData.sql || "",

            answer:
                queryData.answer ||
                queryData.explanation ||
                "",

            summary:
                queryData.summary || "",

            rows:
                Array.isArray(queryData.rows)
                    ? queryData.rows
                    : [],

            columns:
                Array.isArray(queryData.columns)
                    ? queryData.columns
                    : [],

            chart:
                queryData.chart || null,

            success:
                queryData.success !== false,

            sql_corrected:
                Boolean(
                    queryData.sql_corrected
                ),

            timestamp:
                new Date().toISOString(),
        };


        // Remove an older copy of the same query.
        const updatedHistory = [

            newEntry,

            ...history.filter(
                (item) =>
                    item?.query
                        ?.trim()
                        .toLowerCase() !==
                    normalizedQuery
            ),

        ].slice(0, MAX_HISTORY_ITEMS);


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


// ============================================================
// DELETE QUERY
// ============================================================

export function deleteQueryFromHistory(id) {

    try {

        const history =
            getQueryHistory();

        const updatedHistory =
            history.filter(
                (item) =>
                    String(item.id) !==
                    String(id)
            );


        localStorage.setItem(
            HISTORY_KEY,
            JSON.stringify(updatedHistory)
        );


        return updatedHistory;

    } catch (error) {

        console.error(
            "Failed to delete query history item:",
            error
        );

        return getQueryHistory();
    }
}


// ============================================================
// CLEAR HISTORY
// ============================================================

export function clearQueryHistory() {

    try {

        localStorage.removeItem(
            HISTORY_KEY
        );

    } catch (error) {

        console.error(
            "Failed to clear query history:",
            error
        );

    }
}