// src/components/pages/ClaimsPage.jsx
import { useDispatch, useSelector } from "react-redux";
import { ClipboardCheck, Plus } from "lucide-react";
import { SectionTitle, DataTable, RowActionButtons } from "../../components/admin/shared";
import { addClaim, approveClaim, rejectClaim, removeClaim } from "../../store/slices/claimsSlice";
import { setEditingRecord } from "../../store/slices/uiSlice";
import { useAdminActions } from "../../hooks/useAdminActions";
import { apiRequest } from "../../utils/api";

const claimSteps = ["Submitted", "Under Review", "Document Verification", "Approved / Rejected", "Payment Processing", "Completed"];

const ClaimsPage = () => {
  const dispatch = useDispatch();
  const { panel, log } = useAdminActions();
  const rows = useSelector((s) => s.claims.rows);
  const userRows = useSelector((s) => s.users.rows);
  const { selectedProfile } = useSelector((s) => s.auth);

  const createClaim = () => {
    const next = {
      id: `CLM${Date.now().toString().slice(-4)}`,
      user: userRows[0]?.name || "New Customer",
      policy: "Health", amount: "INR 25,000", status: "Pending",
      officer: selectedProfile.name, description: "Claim created from admin portal.", docName: "Documents pending",
    };
    dispatch(addClaim(next));
    dispatch(setEditingRecord({ kind: "claims", key: next.id, draft: { ...next } }));
    log(`/api/v4/claims/create -> ${next.id}`);
    panel("Claim created", `${next.id} was created.`);
  };

  const respondToClaim = async (claim) => {
    const message = `Dear ${claim.user}, your ${claim.policy} claim ${claim.id} is under review. Please keep your policy number, hospital bills, identity proof, and bank details ready.`;
    try {
      await apiRequest(`/api/admin/claims/${claim.id}`, { useAdminToken: true, method: "PATCH", body: JSON.stringify({ status: "reviewing", notes: message }) });
    } catch {}
    dispatch(approveClaim(claim.id));
    log(`/api/v4/claims/respond -> ${claim.id}`);
    panel("Response sent", { claimId: claim.id, user: claim.user, response: message });
  };

  const rejectMissing = async (claim) => {
    const reason = `Missing details: ${[!claim.amount && "amount", !claim.policy && "policy type"].filter(Boolean).join(", ") || "incomplete evidence"}`;
    try {
      await apiRequest(`/api/admin/claims/${claim.id}`, { useAdminToken: true, method: "PATCH", body: JSON.stringify({ status: "rejected", notes: reason }) });
    } catch {}
    dispatch(rejectClaim(claim.id));
    log(`/api/v4/claims/reject -> ${claim.id}`);
    panel("Claim rejected", { claimId: claim.id, reason });
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <SectionTitle
        icon={ClipboardCheck}
        title="Claims Management"
        action={
          <button onClick={createClaim} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-black text-white hover:bg-blue-700">
            <Plus size={16} />Create Claim
          </button>
        }
      />
      <DataTable
        columns={["id", "user", "policy", "amount", "status", "officer"]}
        rows={rows}
        renderActions={(row) => (
          <div className="flex flex-wrap gap-1">
            <RowActionButtons
              onView={() => panel(`Viewing ${row.id}`, row)}
              onEdit={() => { dispatch(setEditingRecord({ kind: "claims", key: row.id, draft: { ...row } })); panel("Edit opened", `Editing ${row.id}.`); }}
              onApprove={async () => {
                try { await apiRequest(`/api/admin/claims/${row.id}`, { useAdminToken: true, method: "PATCH", body: JSON.stringify({ status: "approved" }) }); } catch {}
                dispatch(approveClaim(row.id)); log(`/api/v4/claims/approve -> ${row.id}`); panel("Approved", row.id);
              }}
              onDelete={async () => {
                try { await apiRequest(`/api/admin/claims/${row.id}`, { useAdminToken: true, method: "DELETE" }); } catch {}
                dispatch(removeClaim(row.id)); log(`/api/v4/claims/delete -> ${row.id}`); panel("Deleted", row.id);
              }}
            />
            <button onClick={() => respondToClaim(row)} className="rounded-lg border border-slate-200 px-2 py-2 text-xs font-black text-slate-700 hover:border-blue-300 hover:bg-blue-50">Respond</button>
            <button onClick={() => rejectMissing(row)} className="rounded-lg border border-rose-200 px-2 py-2 text-xs font-black text-rose-700 hover:bg-rose-50">Reject Missing</button>
          </div>
        )}
      />
      <div className="mt-5 grid gap-2 sm:grid-cols-3 xl:grid-cols-6">
        {claimSteps.map((step, i) => (
          <button key={step} onClick={() => panel("Claim workflow", step)} className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-left hover:bg-white">
            <div className="text-xs font-black text-blue-700">Step {i + 1}</div>
            <div className="mt-1 text-sm font-bold text-slate-700">{step}</div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default ClaimsPage;
