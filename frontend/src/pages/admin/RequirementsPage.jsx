// src/components/pages/RequirementsPage.jsx
import { useDispatch, useSelector } from "react-redux";
import { BadgeCheck, Plus } from "lucide-react";
import { SectionTitle } from "../../components/admin/shared";
import { addRequirement, updateRequirement, removeRequirement, setEditingRecord as setEditing } from "../../store/slices/uiSlice";
import { setEditingRecord } from "../../store/slices/uiSlice";
import { useAdminActions } from "../../hooks/useAdminActions";
import { statusClass } from "../../utils/helpers";

const RequirementsPage = () => {
  const dispatch = useDispatch();
  const { panel, log } = useAdminActions();
  const rows = useSelector((s) => s.ui.requirementRows);
  const userRows = useSelector((s) => s.users.rows);

  const createRequirement = () => {
    const next = {
      user: userRows[0]?.name || "Customer",
      age: 30,
      budget: "INR 15,000",
      coverage: "INR 10L",
      status: "Review",
    };
    dispatch(addRequirement(next));
    log("/api/v4/requirements/create -> New requirement added");
    panel("Requirement created", `New policy requirement for ${next.user}.`);
  };

  const handleAction = (action, req) => {
    const key = req.user;
    if (action === "Edit") {
      dispatch(setEditingRecord({ kind: "requirements", key, draft: { ...req } }));
      panel("Edit opened", `Editing requirement for ${key}.`);
    } else if (action === "Approve") {
      dispatch(updateRequirement({ user: key, changes: { status: "Quote Ready" } }));
      log(`/api/v4/requirements/approve -> ${key}`);
      panel("Approved", `Requirement for ${key} marked as Quote Ready.`);
    } else if (action === "Delete") {
      dispatch(removeRequirement(key));
      log(`/api/v4/requirements/delete -> ${key}`);
      panel("Deleted", `Requirement for ${key} removed.`);
    } else {
      panel(action, `${action} for ${key}.`);
    }
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <SectionTitle
        icon={BadgeCheck}
        title="Requirement Management"
        action={
          <button
            onClick={createRequirement}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-black text-white hover:bg-blue-700"
          >
            <Plus size={16} />
            Create Requirement
          </button>
        }
      />

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {rows.map((req) => (
          <article key={req.user} className="rounded-lg border border-slate-200 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-black text-slate-900">{req.user}</div>
                <div className="mt-1 text-xs font-semibold text-slate-500">
                  Age {req.age} &bull; {req.budget} &bull; {req.coverage}
                </div>
              </div>
              <span className={`rounded-lg px-2 py-1 text-xs font-black ring-1 ${statusClass(req.status)}`}>
                {req.status}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {["Edit", "Suggest Policies", "Generate Quotes", "Approve", "Delete"].map((action) => (
                <button
                  key={action}
                  onClick={() => handleAction(action, req)}
                  className={`rounded-lg border px-3 py-2 text-xs font-black transition
                    ${action === "Delete"
                      ? "border-rose-200 text-rose-700 hover:bg-rose-50"
                      : "border-slate-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                    }`}
                >
                  {action}
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default RequirementsPage;
