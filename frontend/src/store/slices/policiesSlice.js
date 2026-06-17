// src/store/slices/policiesSlice.js
import { createSlice } from "@reduxjs/toolkit";

const defaultPlans = [
  { name: "Health Secure Plus", type: "Health", coverage: "INR 25L", premium: "INR 1,850/mo", duration: "1 year", state: "Active" },
  { name: "Drive Shield Elite", type: "Motor", coverage: "IDV based", premium: "INR 9,600/yr", duration: "1 year", state: "Active" },
  { name: "Term Life Max", type: "Life", coverage: "INR 1 Cr", premium: "INR 1,120/mo", duration: "30 years", state: "Draft" },
  { name: "Travel Global Care", type: "Travel", coverage: "USD 100K", premium: "INR 2,400/trip", duration: "Trip", state: "Inactive" },
];

const policiesSlice = createSlice({
  name: "policies",
  initialState: { rows: defaultPlans },
  reducers: {
    setPolicies(state, action) { state.rows = action.payload; },
    addPolicy(state, action) { state.rows.unshift(action.payload); },
    updatePolicy(state, action) {
      const { name, changes } = action.payload;
      state.rows = state.rows.map((r) => (r.name === name ? { ...r, ...changes } : r));
    },
    removePolicy(state, action) {
      state.rows = state.rows.filter((r) => r.name !== action.payload);
    },
    approvePolicy(state, action) {
      state.rows = state.rows.map((r) => r.name === action.payload ? { ...r, state: "Active" } : r);
    },
  },
});

export const { setPolicies, addPolicy, updatePolicy, removePolicy, approvePolicy } = policiesSlice.actions;
export default policiesSlice.reducer;
