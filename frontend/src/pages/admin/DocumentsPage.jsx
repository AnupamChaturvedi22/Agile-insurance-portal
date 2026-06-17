// src/components/pages/DocumentsPage.jsx
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ShieldCheck, PenLine, Circle, Eraser, Undo2, Send } from "lucide-react";
import { SectionTitle } from "../../components/admin/shared";
import { approveDocument, removeDocument, updateDocument, setSelectedDocumentId, setMarkupTool, addMark, undoMark } from "../../store/slices/documentsSlice";
import { setEditingRecord } from "../../store/slices/uiSlice";
import { useAdminActions } from "../../hooks/useAdminActions";
import { statusClass } from "../../utils/helpers";

const DocumentsPage = () => {
  const dispatch = useDispatch();
  const { panel, log } = useAdminActions();
  const { rows, selectedDocumentId, documentMarks, markupTool } = useSelector((s) => s.documents);
  const [draftMark, setDraftMark] = useState(null);

  const selectedDoc = rows.find((d) => d.id === selectedDocumentId) || null;
  const docKey = selectedDoc ? `${selectedDoc.type}-${selectedDoc.owner}` : "";
  const currentMarks = documentMarks[docKey] || [];

  const pointFromEvent = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 };
  };

  const startMarkup = (e) => {
    if (!selectedDoc) return;
    const point = pointFromEvent(e);
    if (markupTool === "eraser") { dispatch(undoMark(docKey)); return; }
    setDraftMark({ id: `mark-${Date.now()}`, tool: markupTool, points: [point], color: markupTool === "circle" ? "#dc2626" : "#2563eb" });
  };
  const continueMarkup = (e) => {
    if (!draftMark || markupTool !== "pen") return;
    setDraftMark((m) => ({ ...m, points: [...m.points, pointFromEvent(e)] }));
  };
  const finishMarkup = (e) => {
    if (!draftMark || !selectedDoc) return;
    const end = pointFromEvent(e);
    const completed = draftMark.tool === "circle" ? { ...draftMark, points: [draftMark.points[0], end] } : draftMark;
    dispatch(addMark({ key: docKey, mark: completed }));
    setDraftMark(null);
  };
  const sendCorrection = () => {
    if (!selectedDoc) return;
    dispatch(updateDocument({ id: selectedDoc.id, changes: { status: "Re-upload Requested", note: "Marked corrections sent by admin." } }));
    log(`/api/v4/documents/markup/send -> ${docKey}`);
    panel("Document sent back", `${selectedDoc.owner} will see correction marks for ${selectedDoc.type}.`);
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <SectionTitle icon={ShieldCheck} title="Document Verification" />
      <div className="mt-5 grid gap-5 2xl:grid-cols-[360px_1fr]">
        {/* List */}
        <div className="space-y-3">
          {rows.map((doc) => (
            <article key={doc.id} className={`rounded-lg border p-4 ${selectedDocumentId === doc.id ? "border-blue-300 bg-blue-50" : "border-slate-200"}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-black">{doc.type}</div>
                  <div className="mt-1 text-sm font-semibold text-slate-500">{doc.owner}</div>
                  {doc.note && <div className="mt-2 text-xs font-bold text-rose-700">{doc.note}</div>}
                </div>
                <span className={`rounded-lg px-2 py-1 text-xs font-black ring-1 ${statusClass(doc.status)}`}>{doc.status}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  ["View", () => { dispatch(setSelectedDocumentId(doc.id)); panel("Document opened", `${doc.type} for ${doc.owner}.`); }],
                  ["Edit", () => dispatch(setEditingRecord({ kind: "documents", key: doc.id, draft: { ...doc } }))],
                  ["Approve", () => { dispatch(approveDocument(doc.id)); log(`/api/v4/documents/approve -> ${doc.id}`); panel("Approved", doc.id); }],
                  ["Reject", () => { dispatch(removeDocument(doc.id)); log(`/api/v4/documents/reject -> ${doc.id}`); panel("Rejected", doc.id); }],
                ].map(([label, action]) => (
                  <button key={label} onClick={action} className={`rounded-lg border px-3 py-2 text-xs font-black transition ${label === "Reject" ? "border-rose-200 text-rose-700 hover:bg-rose-50" : "border-slate-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"}`}>{label}</button>
                ))}
              </div>
            </article>
          ))}
        </div>

        {/* Markup canvas */}
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          {selectedDoc ? (
            <>
              <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="text-sm font-black text-slate-950">{selectedDoc.type} Review</div>
                  <div className="mt-1 text-xs font-bold text-slate-500">{selectedDoc.owner}</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[["pen", "Pen", PenLine], ["circle", "Circle", Circle], ["eraser", "Eraser", Eraser]].map(([id, label, Icon]) => (
                    <button key={id} onClick={() => dispatch(setMarkupTool(id))}
                      className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-black ${markupTool === id ? "border-blue-300 bg-blue-600 text-white" : "border-slate-200 bg-white text-slate-700"}`}>
                      <Icon size={14} />{label}
                    </button>
                  ))}
                  <button onClick={() => dispatch(undoMark(docKey))} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 hover:bg-slate-50"><Undo2 size={14} />Undo</button>
                  <button onClick={sendCorrection} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-black text-white hover:bg-emerald-700"><Send size={14} />Send Back</button>
                </div>
              </div>
              <div className="mt-4 relative mx-auto aspect-[4/5] max-w-3xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                <div className="absolute inset-0">
                  {selectedDoc.dataUrl
                    ? selectedDoc.mimeType?.startsWith("image/")
                      ? <img src={selectedDoc.dataUrl} alt={selectedDoc.type} className="h-full w-full object-contain" />
                      : <iframe title={selectedDoc.type} src={selectedDoc.dataUrl} className="h-full w-full border-0" />
                    : (
                      <div className="h-full p-8">
                        <div className="border-b border-slate-200 pb-4">
                          <div className="text-xs font-black uppercase tracking-wide text-blue-700">Submitted Document</div>
                          <div className="mt-2 text-2xl font-black text-slate-950">{selectedDoc.type}</div>
                          <div className="mt-1 text-sm font-bold text-slate-500">Owner: {selectedDoc.owner}</div>
                        </div>
                        <div className="mt-6 grid gap-3 text-sm font-semibold text-slate-600">
                          {["Identity fields verified against user profile.", "Policy or claim reference checked by admin.", "Missing or incorrect areas can be circled before sending back.", "User receives the correction request after Send Back."].map((line, i) => (
                            <div key={i} className="flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-3">
                              <span className="grid h-7 w-7 place-items-center rounded-lg bg-slate-900 text-xs font-black text-white">{i + 1}</span>
                              {line}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
                <svg className="absolute inset-0 h-full w-full touch-none" viewBox="0 0 100 100" preserveAspectRatio="none"
                  onPointerDown={startMarkup} onPointerMove={continueMarkup} onPointerUp={finishMarkup}>
                  {[...currentMarks, ...(draftMark ? [draftMark] : [])].map((mark) => {
                    if (mark.tool === "circle") {
                      const [s, end = s] = mark.points;
                      const x = Math.min(s.x, end.x), y = Math.min(s.y, end.y);
                      const w = Math.max(Math.abs(end.x - s.x), 2), h = Math.max(Math.abs(end.y - s.y), 2);
                      return <ellipse key={mark.id} cx={x + w / 2} cy={y + h / 2} rx={w / 2} ry={h / 2} fill="none" stroke={mark.color} strokeWidth="1.2" />;
                    }
                    return <polyline key={mark.id} fill="none" stroke={mark.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" points={mark.points.map((p) => `${p.x},${p.y}`).join(" ")} />;
                  })}
                </svg>
              </div>
            </>
          ) : (
            <div className="grid min-h-[420px] place-items-center rounded-lg border border-dashed border-slate-300 bg-white text-center">
              <div><div className="text-sm font-black text-slate-800">Select a document</div><div className="mt-1 text-xs font-semibold text-slate-500">Use View to open the markup workspace.</div></div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DocumentsPage;
