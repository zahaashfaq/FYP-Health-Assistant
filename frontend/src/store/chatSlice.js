// src/store/chatSlice.js
import { createSlice } from "@reduxjs/toolkit";

// ── helpers ──────────────────────────────────────────────────────────────────
const STORAGE_KEY = "fitbot_sessions_v2";

let _counter = 1;
const uid = () => `${Date.now()}-${_counter++}`;

const welcomeMessage = () => ({
  id: `msg-${uid()}`,
  text: "Hello! I'm your AI Fitness Assistant. I can create personalized workout plans, diet recommendations, and answer fitness questions — all tailored to your profile. How can I help you today?",
  sender: "bot",
  timestamp: new Date().toISOString(),
});

const newSession = () => ({
  id: `session-${uid()}`,
  title: "New Chat",
  createdAt: new Date().toISOString(),
  messages: [welcomeMessage()],
});

const saveSessions = (sessions, activeId) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ sessions, activeId }));
  } catch {}
};

const loadSessions = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (
        parsed &&
        Array.isArray(parsed.sessions) &&
        parsed.sessions.length > 0 &&
        parsed.activeId
      ) {
        return parsed;
      }
    }
  } catch {}
  const initial = newSession();
  return { sessions: [initial], activeId: initial.id };
};

const initialData = loadSessions();

// ── slice ─────────────────────────────────────────────────────────────────────
const chatSlice = createSlice({
  name: "chat",
  initialState: {
    // sessions: Array of { id, title, createdAt, messages[] }
    sessions: initialData.sessions,
    activeId: initialData.activeId,
    isLoading: false,
    error: null,
    userProfile: null,
  },

  reducers: {
    // Add a message to the currently active session
    addMessage: (state, action) => {
      const session = state.sessions.find((s) => s.id === state.activeId);
      if (!session) return;

      session.messages.push(action.payload);

      // Auto-title from the first user message
      if (session.title === "New Chat" && action.payload.sender === "user") {
        const raw = action.payload.text.trim();
        session.title = raw.length > 45 ? raw.slice(0, 43) + "…" : raw;
      }

      saveSessions(state.sessions, state.activeId);
    },

    // Start a brand-new session and make it active
    createSession: (state) => {
      const s = newSession();
      state.sessions.unshift(s); // newest first
      state.activeId = s.id;
      saveSessions(state.sessions, state.activeId);
    },

    // Switch to an existing session
    switchSession: (state, action) => {
      if (state.sessions.some((s) => s.id === action.payload)) {
        state.activeId = action.payload;
        saveSessions(state.sessions, state.activeId);
      }
    },

    // Delete a session; fall back to the next available one
    deleteSession: (state, action) => {
      state.sessions = state.sessions.filter((s) => s.id !== action.payload);
      if (state.sessions.length === 0) {
        const s = newSession();
        state.sessions = [s];
        state.activeId = s.id;
      } else if (state.activeId === action.payload) {
        state.activeId = state.sessions[0].id;
      }
      saveSessions(state.sessions, state.activeId);
    },

    // Rename a session
    renameSession: (state, action) => {
      const { id, title } = action.payload;
      const session = state.sessions.find((s) => s.id === id);
      if (session) session.title = title;
      saveSessions(state.sessions, state.activeId);
    },

    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },
  },
});

// ── selectors ─────────────────────────────────────────────────────────────────
export const selectActiveSession = (state) =>
  state.chat.sessions.find((s) => s.id === state.chat.activeId) || null;

export const selectActiveMessages = (state) =>
  selectActiveSession(state)?.messages || [];

export const {
  addMessage,
  createSession,
  switchSession,
  deleteSession,
  renameSession,
  setLoading,
  setError,
  setUserProfile,
} = chatSlice.actions;

export default chatSlice.reducer;