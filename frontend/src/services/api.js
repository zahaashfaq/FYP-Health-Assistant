// src/services/Api.js
const API_URL = "https://localhost:7176/api";

export const api = {
    // ── Auth ──────────────────────────────────────────────────────────────────
    login: async (credentials) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
        });
        return response.json();
    },

    register: async (userData) => {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });
        return response;
    },

    forgotPassword: async (email) => {
        const response = await fetch(`${API_URL}/auth/forgot-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });
        if (!response.ok) {
            const text = await response.text();
            throw new Error(text || "Failed to send reset email");
        }
        return response.json();
    },

    googleLogin: async (idToken) => {
        const response = await fetch(`${API_URL}/auth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken }),
        });
        const text = await response.text();
        if (!response.ok) throw new Error(text || "Google sign-in failed");
        return text ? JSON.parse(text) : {};
    },

    // ── Profile ───────────────────────────────────────────────────────────────
    createProfile: async (profileData, token) => {
        const response = await fetch(`${API_URL}/profile`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(profileData),
        });
        return response.json();
    },

    completeOnboarding: async (profileData) => {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/profile/onboarding`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(profileData),
        });
        if (!response.ok) throw new Error("Onboarding failed");
        return response.json();
    },

    getProfile: async () => {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/profile/me`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 404) return null;
        if (!response.ok) throw new Error("Failed to fetch profile");
        return response.json();
    },

    getBmiLogs: async () => {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/profile/bmi-logs`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.json();
    },

    updateProfile: async (profileData) => {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/profile/update`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(profileData),
        });
        return response.json();
    },

    // ── Chat (AI) ─────────────────────────────────────────────────────────────
    /**
     * Sends a message to the AI fitness assistant.
     * @param {{ message: string, history: Array, userProfile: object|null }} payload
     * @returns {{ reply: string, source: string }}
     */
    sendChatMessage: async ({ message, history, userProfile }) => {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/chat/message`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ message, history, userProfile }),
        });
        if (!response.ok) {
            const text = await response.text();
            throw new Error(text || "Chat request failed");
        }
        return response.json(); // { reply: string, source: string }
    },

    /**
     * Fetches persisted chat history from the server for logged-in user.
     */
    getChatHistory: async () => {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/chat/history`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) return [];
        return response.json();
    },

    // ── Videos ────────────────────────────────────────────────────────────────
    getVideos: async () => {
        const response = await fetch(`${API_URL}/video`);
        return response.json();
    },

    createVideo: async (videoData) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/video`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify(videoData),
        });
        return response.json();
    },

    updateVideo: async (id, videoData) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/video/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify(videoData),
        });
        return response.json();
    },

    deleteVideo: async (id) => {
        const token = localStorage.getItem('token');
        await fetch(`${API_URL}/video/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });
    },

    seedVideos: async () => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/video/seed`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.json();
    },

    // ── Tags ─────────────────────────────────────────────────────────────────
    getTags: async () => {
        const response = await fetch(`${API_URL}/tags`);
        return response.json();
    },

    saveSynonym: async (data) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/tags/synonym`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify(data),
        });
        return response.json();
    },

    deleteSynonym: async (id) => {
        const token = localStorage.getItem('token');
        await fetch(`${API_URL}/tags/synonym/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });
    },

    saveStopWord: async (data) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/tags/stopword`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify(data),
        });
        return response.json();
    },

    deleteStopWord: async (id) => {
        const token = localStorage.getItem('token');
        await fetch(`${API_URL}/tags/stopword/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });
    },

    seedTags: async () => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/tags/seed`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.json();
    },
};