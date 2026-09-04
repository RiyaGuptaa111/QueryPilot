import axios from "axios";


// ============================================================
// AI API
// ============================================================

const API = axios.create({
    baseURL: "http://localhost:4000/api/ai",
    headers: {
        "Content-Type": "application/json",
    },
});


// ============================================================
// AUTH API
// ============================================================

const AUTH_API = axios.create({
    baseURL: "http://localhost:4000/api/auth",
    headers: {
        "Content-Type": "application/json",
    },
});


// ============================================================
// RUN QUERY
// ============================================================

export const runQuery = async (query) => {

    if (!query || !query.trim()) {
        throw new Error(
            "Query cannot be empty."
        );
    }

    const token = localStorage.getItem(
        "querypilot_token"
    );

    console.log("JWT TOKEN:", token);
    
    if (!token) {
        throw new Error(
            "Authentication required. Please login again."
        );
    }

    const response = await API.post(
        "/query",
        {
            query: query.trim(),
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};


// ============================================================
// GET DATABASE SCHEMA
// ============================================================

export const getSchema = async () => {

    const token = localStorage.getItem(
        "querypilot_token"
    );

    if (!token) {
        throw new Error(
            "Authentication required. Please login again."
        );
    }

    const response = await API.get(
        "/schema",
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};


// ============================================================
// HEALTH CHECK
// ============================================================

export const checkAIService = async () => {

    const token = localStorage.getItem(
        "querypilot_token"
    );

    if (!token) {
        throw new Error(
            "Authentication required. Please login again."
        );
    }

    const response = await API.get(
        "/health",
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};


// ============================================================
// LOGIN
// ============================================================

export const loginUser = async (
    username,
    password
) => {

    const response = await AUTH_API.post(
        "/login",
        {
            username,
            password,
        }
    );

    return response.data;
};


// ============================================================
// REGISTER
// ============================================================

export const registerUser = async (
    username,
    password
) => {

    const response = await AUTH_API.post(
        "/register",
        {
            username,
            password,
        }
    );

    return response.data;
};


export default API;