import axios from "axios";


const API = axios.create({
    baseURL: "http://localhost:4000/api/ai",
});


// ============================================================
// RUN QUERY
// ============================================================

export const runQuery = async (query) => {

    const response = await API.post(
        "/query",
        {
            query,
        }
    );

    return response.data;
};


// ============================================================
// GET DATABASE SCHEMA
// ============================================================

export const getSchema = async () => {

    const response = await API.get(
        "/schema"
    );

    return response.data;
};