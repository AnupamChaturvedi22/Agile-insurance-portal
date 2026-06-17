// src/store/slices/claimsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const defaultClaims = [
  { id: "CLM001", user: "John Mathew", policy: "Health", amount: "INR 50,000", status: "Pending", officer: "Riya S." },
  { id: "CLM002", user: "Aarav Mehta", policy: "Car", amount: "INR 1,24,500", status: "Under Review", officer: "Nikhil P." },
  { id: "CLM003", user: "Meera Rao", policy: "Life", amount: "INR 7,50,000", status: "Approved", officer: "Fatima K." },
  { id: "CLM004", user: "Sana Khan", policy: "Travel", amount: "INR 82,000", status: "Documents", officer: "Dev A." },
];

const claimsSlice = createSlice({
  name: "claims",
  initialState: { rows: defaultClaims, loading: false },
  reducers: {
    setClaims(state, action) { state.rows = action.payload; },
    addClaim(state, action) { state.rows.unshift(action.payload); },
    updateClaim(state, action) {
      const { id, changes } = action.payload;
      state.rows = state.rows.map((r) => (r.id === id ? { ...r, ...changes } : r));
    },
    removeClaim(state, action) {
      state.rows = state.rows.filter((r) => r.id !== action.payload);
    },
    approveClaim(state, action) {
      state.rows = state.rows.map((r) => r.id === action.payload ? { ...r, status: "Approved" } : r);
    },
    rejectClaim(state, action) {
      state.rows = state.rows.map((r) => r.id === action.payload ? { ...r, status: "Rejected" } : r);
    },
    setLoading(state, action) { state.loading = action.payload; },
  },
});

export const { setClaims, addClaim, updateClaim, removeClaim, approveClaim, rejectClaim, setLoading } = claimsSlice.actions;
export default claimsSlice.reducer;
