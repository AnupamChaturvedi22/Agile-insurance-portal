// src/store/slices/usersSlice.js
import { createSlice } from "@reduxjs/toolkit";

const usersSlice = createSlice({
  name: "users",
  initialState: { rows: [], loading: false },
  reducers: {
    setUsers(state, action) { state.rows = action.payload; },
    addUser(state, action) { state.rows.unshift(action.payload); },
    updateUser(state, action) {
      const { id, changes } = action.payload;
      state.rows = state.rows.map((r) => (r.id === id ? { ...r, ...changes } : r));
    },
    removeUser(state, action) {
      state.rows = state.rows.filter((r) => r.id !== action.payload);
    },
    setLoading(state, action) { state.loading = action.payload; },
  },
});

export const { setUsers, addUser, updateUser, removeUser, setLoading } = usersSlice.actions;
export default usersSlice.reducer;
