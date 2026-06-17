// src/store/slices/uiSlice.js
import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    activePage: "dashboard",
    mobileOpen: false,
    sidebarCollapsed: false,
    editingRecord: null,       // { kind, key, draft }
    detailPanel: {
      title: "Admin Activity",
      body: "Select a row or action to view operational context here.",
      photo: "",
    },
    requirementRows: [
      { user: "Kabir S.", age: 34, budget: "INR 18,000", coverage: "INR 15L", status: "Quote Ready" },
      { user: "Nisha P.", age: 42, budget: "INR 30,000", coverage: "INR 25L", status: "Review" },
      { user: "Aditya R.", age: 29, budget: "INR 12,000", coverage: "INR 10L", status: "Consultation" },
    ],
  },
  reducers: {
    setActivePage(state, action) { state.activePage = action.payload; },
    setMobileOpen(state, action) { state.mobileOpen = action.payload; },
    setSidebarCollapsed(state, action) { state.sidebarCollapsed = action.payload; },
    setEditingRecord(state, action) { state.editingRecord = action.payload; },
    updateEditingDraft(state, action) {
      if (state.editingRecord) {
        state.editingRecord.draft = { ...state.editingRecord.draft, ...action.payload };
      }
    },
    clearEditingRecord(state) { state.editingRecord = null; },
    setDetailPanel(state, action) { state.detailPanel = action.payload; },
    addRequirement(state, action) { state.requirementRows.unshift(action.payload); },
    updateRequirement(state, action) {
      const { user, changes } = action.payload;
      state.requirementRows = state.requirementRows.map((r) => r.user === user ? { ...r, ...changes } : r);
    },
    removeRequirement(state, action) {
      state.requirementRows = state.requirementRows.filter((r) => r.user !== action.payload);
    },
  },
});

export const {
  setActivePage, setMobileOpen, setSidebarCollapsed,
  setEditingRecord, updateEditingDraft, clearEditingRecord,
  setDetailPanel, addRequirement, updateRequirement, removeRequirement,
} = uiSlice.actions;
export default uiSlice.reducer;
