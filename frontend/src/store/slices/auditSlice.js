// src/store/slices/auditSlice.js
import { createSlice } from "@reduxjs/toolkit";

const STORAGE_AUDIT_LOGS = "agile_insurance_audit_logs_v1";

const defaultLogs = [
  { id: "LOG-001", action: "/api/v4/bridges/deploy", username: "asha.admin@agileinsure.in", initials: "AM", createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: "LOG-002", action: "/api/v4/assets/create", username: "rohit.manager@agileinsure.in", initials: "RK", createdAt: new Date(Date.now() - 14400000).toISOString() },
  { id: "LOG-003", action: "/api/v4/documents/verify", username: "naina.claims@agileinsure.in", initials: "NS", createdAt: new Date(Date.now() - 72000000).toISOString() },
];

const loadLogs = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_AUDIT_LOGS));
    return Array.isArray(saved) && saved.length ? saved : defaultLogs;
  } catch { return defaultLogs; }
};

const auditSlice = createSlice({
  name: "audit",
  initialState: {
    logs: loadLogs(),
    filter: "login",
  },
  reducers: {
    addLog(state, action) {
      state.logs.unshift(action.payload);
      localStorage.setItem(STORAGE_AUDIT_LOGS, JSON.stringify(state.logs));
    },
    setLogs(state, action) {
      state.logs = action.payload;
      localStorage.setItem(STORAGE_AUDIT_LOGS, JSON.stringify(action.payload));
    },
    resetLogs(state) {
      state.logs = defaultLogs;
      localStorage.removeItem(STORAGE_AUDIT_LOGS);
    },
    setFilter(state, action) { state.filter = action.payload; },
  },
});

export const { addLog, setLogs, resetLogs, setFilter } = auditSlice.actions;
export default auditSlice.reducer;
