// src/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import claimsReducer from "./slices/claimsSlice";
import usersReducer from "./slices/usersSlice";
import policiesReducer from "./slices/policiesSlice";
import supportReducer from "./slices/supportSlice";
import documentsReducer from "./slices/documentsSlice";
import auditReducer from "./slices/auditSlice";
import settingsReducer from "./slices/settingsSlice";
import uiReducer from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    claims: claimsReducer,
    users: usersReducer,
    policies: policiesReducer,
    support: supportReducer,
    documents: documentsReducer,
    audit: auditReducer,
    settings: settingsReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export default store;
