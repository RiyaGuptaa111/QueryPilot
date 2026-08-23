import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:4000/api",
    headers: {
        "Content-Type": "application/json",
    },
});

export const runQuery = async (query) => {
    const response = await API.post("/ai/query", {
        query,
    });

    return response.data;
};