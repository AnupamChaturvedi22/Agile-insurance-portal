// src/store/slices/documentsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const defaultDocuments = [
  { id: "DOC001", type: "Aadhaar", owner: "Priya Sharma", status: "Approved" },
  { id: "DOC002", type: "PAN", owner: "Rahul Verma", status: "Pending" },
  { id: "DOC003", type: "Driving License", owner: "Aarav Mehta", status: "Pending" },
  { id: "DOC004", type: "Medical Reports", owner: "Meera Rao", status: "Re-upload" },
  { id: "DOC005", type: "Claim Documents", owner: "Sana Khan", status: "Verification" },
];

const readUploadedDocs = () => {
  try {
    const saved = JSON.parse(localStorage.getItem("agile_insurance_documents_v1") || "[]");
    if (!Array.isArray(saved)) return [];
    return saved.map((doc, i) => ({
      id: doc.id || `UPDOC-${i + 1}`,
      type: doc.name || doc.type || "Uploaded Document",
      owner: doc.owner || "Registered User",
      status: doc.status || "Pending",
      note: doc.createdAt ? `Uploaded ${new Date(doc.createdAt).toLocaleString()}` : "Uploaded by user",
      dataUrl: doc.dataUrl || "",
      mimeType: doc.mimeType || "",
    }));
  } catch { return []; }
};

const uploaded = readUploadedDocs();

const documentsSlice = createSlice({
  name: "documents",
  initialState: {
    rows: uploaded.length ? [...uploaded, ...defaultDocuments] : defaultDocuments,
    selectedDocumentId: null,
    documentMarks: {},
    markupTool: "pen",
  },
  reducers: {
    setDocuments(state, action) { state.rows = action.payload; },
    updateDocument(state, action) {
      const { id, changes } = action.payload;
      state.rows = state.rows.map((d) => (d.id === id ? { ...d, ...changes } : d));
    },
    approveDocument(state, action) {
      state.rows = state.rows.map((d) => d.id === action.payload ? { ...d, status: "Approved" } : d);
    },
    removeDocument(state, action) {
      state.rows = state.rows.filter((d) => d.id !== action.payload);
    },
    setSelectedDocumentId(state, action) { state.selectedDocumentId = action.payload; },
    setMarkupTool(state, action) { state.markupTool = action.payload; },
    addMark(state, action) {
      const { key, mark } = action.payload;
      if (!state.documentMarks[key]) state.documentMarks[key] = [];
      state.documentMarks[key].push(mark);
    },
    undoMark(state, action) {
      const key = action.payload;
      if (state.documentMarks[key]?.length) {
        state.documentMarks[key] = state.documentMarks[key].slice(0, -1);
      }
    },
    clearMarks(state, action) { state.documentMarks[action.payload] = []; },
  },
});

export const {
  setDocuments, updateDocument, approveDocument, removeDocument,
  setSelectedDocumentId, setMarkupTool, addMark, undoMark, clearMarks,
} = documentsSlice.actions;
export default documentsSlice.reducer;
