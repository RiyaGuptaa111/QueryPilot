import axios from "axios";


// ============================================================
// API BASE URL
// ============================================================

const BASE_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:4000/api";


// ============================================================
// AXIOS API
// ============================================================

const API = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});


// ============================================================
// AUTH HEADER
// ============================================================

API.interceptors.request.use((config) => {
    const token =
        localStorage.getItem(
            "querypilot_token"
        );

    if (token) {
        config.headers.Authorization =
            `Bearer ${token}`;
    }

    return config;
});


// ============================================================
// AUTH
// ============================================================

export const registerUser = async (
    name,
    email,
    password
) => {
    const response =
        await API.post(
            "/auth/register",
            {
                name,
                email,
                password,
            }
        );

    return response.data;
};


export const loginUser = async (
    email,
    password
) => {
    const response =
        await API.post(
            "/auth/login",
            {
                email,
                password,
            }
        );

    return response.data;
};


export const getCurrentUser =
    async () => {
        const response =
            await API.get(
                "/auth/me"
            );

        return response.data;
    };


// ============================================================
// AI QUERY
// ============================================================

export const runQuery =
    async (query) => {
        const response =
            await API.post(
                "/ai/query",
                {
                    query,
                }
            );

        return response.data;
    };


// ============================================================
// DATABASE SCHEMA
// ============================================================

export const getSchema =
    async () => {
        const response =
            await API.get(
                "/ai/schema"
            );

        return response.data;
    };


// ============================================================
// AI HEALTH
// ============================================================

export const checkAIHealth =
    async () => {
        const response =
            await API.get(
                "/ai/health"
            );

        return response.data;
    };


// ============================================================
// DATABASE HEALTH
// ============================================================

export const checkDatabaseHealth =
    async () => {
        const response =
            await API.get(
                "/ai/database-health"
            );

        return response.data;
    };


// ============================================================
// QUERY HISTORY
// ============================================================

export const getQueryHistory =
    async () => {
        const response =
            await API.get(
                "/history"
            );

        return response.data;
    };


export const deleteQueryHistory =
    async (id) => {
        const response =
            await API.delete(
                `/history/${id}`
            );

        return response.data;
    };


export const clearQueryHistory =
    async () => {
        const response =
            await API.delete(
                "/history"
            );

        return response.data;
    };


export default API;