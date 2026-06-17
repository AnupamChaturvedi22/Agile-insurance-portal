// src/components/pages/AuditLogPage.jsx
import { useDispatch, useSelector } from "react-redux";
import { ScrollText } from "lucide-react";
import { setFilter, resetLogs } from "../../store/slices/auditSlice";
import { useAdminActions } from "../../hooks/useAdminActions";

const isLogin = (log) => log.action.toLowerCase().includes("login") || log.action.toLowerCase().includes("auth");

const AuditLogPage = () => {
  const dispatch = useDispatch();
  const { panel } = useAdminActions();
  const { logs, filter } = useSelector((s) => s.audit);
  const visible = logs.filter((l) => filter === "login" ? isLogin(l) : !isLogin(l));

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-700"><ScrollText size={18} /></span>
          <div>
            <h2 className="text-base font-black text-slate-950">Audit Log</h2>
            <p className="mt-0.5 text-xs font-semibold text-slate-500">Complete activity trail — login events and all admin actions</p>
          </div>
        </div>
        <button onClick={() => { dispatch(resetLogs()); panel("Audit log reset", "Reset to defaults."); }}
          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-black text-rose-700 hover:bg-rose-50">Reset Logs</button>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-4">
        {[["Total Events", logs.length, "text-blue-700", "bg-blue-50"], ["Login Events", logs.filter(isLogin).length, "text-emerald-700", "bg-emerald-50"], ["Action Events", logs.filter((l) => !isLogin(l)).length, "text-amber-700", "bg-amber-50"]].map(([label, value, color, bg]) => (
          <div key={label} className={`rounded-lg ${bg} p-4`}>
            <div className={`text-2xl font-black ${color}`}>{value}</div>
            <div className="mt-1 text-xs font-bold text-slate-600">{label}</div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {[["login", "Login Audit"], ["insurance", "Claim, Policy, User & Insurance Audit"]].map(([id, label]) => (
          <button key={id} onClick={() => dispatch(setFilter(id))} className={`rounded-lg px-4 py-2 text-sm font-black transition ${filter === id ? "bg-blue-600 text-white" : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}>{label}</button>
        ))}
      </div>

      <div className="mt-5 overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              {["#", "Action Event", "Operator", "Timestamp", "Type"].map((h) => <th key={h} className="px-4 py-3 font-black">{h}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {visible.map((log, i) => (
              <tr key={log.id} className="hover:bg-slate-50">
                <td className="px-4 py-3.5 text-xs font-black text-slate-400">{i + 1}</td>
                <td className="px-4 py-3.5 max-w-xs truncate font-mono text-xs font-semibold text-blue-900">{log.action}</td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded bg-slate-900 text-[10px] font-black text-white">{log.initials}</span>
                    <span className="text-xs font-semibold text-slate-700">{log.username}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-xs font-bold text-slate-500">
                  {new Date(log.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                </td>
                <td className="px-4 py-3.5">
                  <span className={`rounded-lg px-2 py-1 text-xs font-black ring-1 ${isLogin(log) ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-blue-50 text-blue-700 ring-blue-200"}`}>
                    {isLogin(log) ? "Login" : "Action"}
                  </span>
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-sm font-bold text-slate-500">No records yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AuditLogPage;
