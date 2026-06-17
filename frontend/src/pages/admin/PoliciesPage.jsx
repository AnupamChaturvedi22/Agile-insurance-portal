// src/components/pages/PoliciesPage.jsx
import { useDispatch, useSelector } from "react-redux";
import { FileText, Plus } from "lucide-react";
import { SectionTitle, DataTable, RowActionButtons } from "../../components/admin/shared";
import { addPolicy, approvePolicy, removePolicy } from "../../store/slices/policiesSlice";
import { setEditingRecord } from "../../store/slices/uiSlice";
import { useAdminActions } from "../../hooks/useAdminActions";

const PoliciesPage = () => {
  const dispatch = useDispatch();
  const { panel, log } = useAdminActions();
  const rows = useSelector((s) => s.policies.rows);

  const createPlan = () => {
    const next = { name: `New Plan ${rows.length + 1}`, type: "Health", coverage: "INR 10L", premium: "INR 999/mo", duration: "1 year", state: "Draft" };
    dispatch(addPolicy(next));
    log(`/api/v4/policies/create -> ${next.name}`);
    panel("Plan created", `${next.name} is ready for editing.`);
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <SectionTitle icon={FileText} title="Policy Management" action={
        <button onClick={createPlan} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-black text-white hover:bg-blue-700"><Plus size={16} />Create Plan</button>
      } />
      <DataTable columns={["name", "type", "coverage", "premium", "duration", "state"]} rows={rows} renderActions={(row) => (
        <RowActionButtons
          onView={() => panel(`Viewing ${row.name}`, row)}
          onEdit={() => dispatch(setEditingRecord({ kind: "policies", key: row.name, draft: { ...row } }))}
          onApprove={() => { dispatch(approvePolicy(row.name)); log(`/api/v4/policies/approve -> ${row.name}`); panel("Approved", row.name); }}
          onDelete={() => { dispatch(removePolicy(row.name)); log(`/api/v4/policies/delete -> ${row.name}`); panel("Deleted", row.name); }}
        />
      )} />
    </section>
  );
};

export default PoliciesPage;
