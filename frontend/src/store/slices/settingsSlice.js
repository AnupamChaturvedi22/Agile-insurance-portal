// src/store/slices/settingsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const STORAGE_SYSTEM_SETTINGS = "agile_insurance_system_settings_v1";

const loadSettings = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_SYSTEM_SETTINGS));
    return saved && typeof saved === "object" ? { modules: {}, ...saved } : { modules: {} };
  } catch { return { modules: {} }; }
};

const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    data: loadSettings(),
    selectedSettingId: "general",
    saving: false,
  },
  reducers: {
    setSettings(state, action) {
      state.data = action.payload;
      localStorage.setItem(STORAGE_SYSTEM_SETTINGS, JSON.stringify(action.payload));
    },
    mergeSettings(state, action) {
      state.data = deepMerge(state.data, action.payload);
      localStorage.setItem(STORAGE_SYSTEM_SETTINGS, JSON.stringify(state.data));
    },
    setSelectedSettingId(state, action) { state.selectedSettingId = action.payload; },
    setSaving(state, action) { state.saving = action.payload; },
  },
});

function deepMerge(base = {}, patch = {}) {
  return Object.keys({ ...(base || {}), ...(patch || {}) }).reduce((acc, key) => {
    const b = base?.[key];
    const p = patch?.[key];
    if (b && p && typeof b === "object" && !Array.isArray(b) && typeof p === "object" && !Array.isArray(p)) {
      acc[key] = deepMerge(b, p);
    } else {
      acc[key] = p ?? b;
    }
    return acc;
  }, {});
}

export const { setSettings, mergeSettings, setSelectedSettingId, setSaving } = settingsSlice.actions;
export default settingsSlice.reducer;
