// src/store/slices/supportSlice.js
import { createSlice } from "@reduxjs/toolkit";

const STORAGE_SUPPORT_CHATS = "agile_insurance_support_chats_v1";

const loadChats = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_SUPPORT_CHATS));
    return Array.isArray(saved) ? saved : [];
  } catch { return []; }
};

const supportSlice = createSlice({
  name: "support",
  initialState: {
    chats: loadChats(),
    tickets: [
      { id: "TKT001", user: "User A", subject: "Claim Issue", priority: "High", status: "Open" },
      { id: "TKT002", user: "User B", subject: "Premium payment failed", priority: "Medium", status: "In Progress" },
      { id: "TKT003", user: "User C", subject: "Policy document missing", priority: "Low", status: "Waiting for User" },
    ],
    selectedChatId: null,
  },
  reducers: {
    setChats(state, action) {
      state.chats = action.payload;
      localStorage.setItem(STORAGE_SUPPORT_CHATS, JSON.stringify(action.payload));
    },
    updateChat(state, action) {
      const { id, changes } = action.payload;
      state.chats = state.chats.map((c) => (c.id === id ? { ...c, ...changes } : c));
      localStorage.setItem(STORAGE_SUPPORT_CHATS, JSON.stringify(state.chats));
    },
    setSelectedChatId(state, action) { state.selectedChatId = action.payload; },
    addTicket(state, action) { state.tickets.unshift(action.payload); },
    updateTicket(state, action) {
      const { id, changes } = action.payload;
      state.tickets = state.tickets.map((t) => (t.id === id ? { ...t, ...changes } : t));
    },
    removeTicket(state, action) {
      state.tickets = state.tickets.filter((t) => t.id !== action.payload);
    },
  },
});

export const { setChats, updateChat, setSelectedChatId, addTicket, updateTicket, removeTicket } = supportSlice.actions;
export default supportSlice.reducer;
