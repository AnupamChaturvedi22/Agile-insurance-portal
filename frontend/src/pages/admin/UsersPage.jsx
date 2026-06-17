// src/components/pages/UsersPage.jsx
import { useDispatch, useSelector } from "react-redux";
import { Users } from "lucide-react";
import { SectionTitle, DataTable, RowActionButtons } from "../../components/admin/shared";
import { setEditingRecord, setDetailPanel } from "../../store/slices/uiSlice";
import { addUser, removeUser } from "../../store/slices/usersSlice";
import { addLog } from "../../store/slices/auditSlice";
import { useAdminActions } from "../../hooks/useAdminActions";
import { apiRequest } from "../../utils/api";
import { setUsers } from "../../store/slices/usersSlice";

const UsersPage = () => {
  const dispatch = useDispatch();
  const { panel, log } = useAdminActions();
  const rows = useSelector((s) => s.users.rows);
  const { selectedProfile } = useSelector((s) => s.auth);
  const activeUsers = rows.filter((u) => u.status === "Active").length;
  const claimRows = useSelector((s) => s.claims.rows);

  const refreshUsers = async () => {
    try {
      const res = await apiRequest("/api/admin/users", { useAdminToken: true });
      const list = res?.data?.users || res?.data?.data || res?.data || [];
      dispatch(setUsers(list.map((u) => ({
        id: u._id || u.id,
        name: u.full_name || u.fullName || u.name || "No Name",
        email: u.email || "",
        phone: u.phone || "Not Added",
        address: u.address || "Not Added",
        policies: u.policies?.length || 0,
        status: u.status || (u.is_verified ? "Active" : "Inactive"),
        city: u.city || "Not Added",
      }))));
      panel("Users refreshed", `${list.length} users loaded from database`);
    } catch { panel("Error", "Could not refresh users from backend."); }
  };

  const createUser = () => {
    const next = {
      id: `USR${Date.now().toString().slice(-5)}`,
      name: "New Customer", email: `customer${rows.length + 1}@agile.demo`,
      phone: "Not added", address: "Not added", policies: 0, status: "Active", city: "Not added",
    };
    dispatch(addUser(next));
    dispatch(setEditingRecord({ kind: "users", key: next.id, draft: { ...next } }));
    log(`/api/v4/users/create -> ${next.email}`);
    panel("User created", `${next.name} was added by ${selectedProfile.name}.`);
  };

  const viewUser = (row) => {
    const userActivity = {
      name: row.name, email: row.email, phone: row.phone, status: row.status,
      claimsSubmitted: claimRows.filter((c) => c.user === row.name || c.email === row.email).length,
    };
    panel(`Viewing ${row.name}`, userActivity, row.profilePhoto || "");
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <SectionTitle
        icon={Users}
        title="User Management"
        action={
          <div className="flex flex-wrap gap-2">
            <button onClick={refreshUsers} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-black text-slate-700 hover:border-blue-300 hover:bg-blue-50">Refresh Real Users</button>
            <button onClick={createUser} className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-black text-white hover:bg-blue-700">Create User</button>
          </div>
        }
      />
      <div className="mt-4 rounded-lg bg-blue-50 px-4 py-3 text-sm font-bold text-blue-800">
        Showing real app profiles. Active users: {activeUsers}.
      </div>
      <DataTable
        columns={["id", "name", "email", "phone", "address", "status"]}
        rows={rows}
        renderActions={(row) => (
          <RowActionButtons
            onView={() => viewUser(row)}
            onEdit={() => { dispatch(setEditingRecord({ kind: "users", key: row.id, draft: { ...row } })); panel("Edit opened", `Editing ${row.id}.`); }}
            onApprove={() => { /* approve = activate user */ panel("User activated", row.id); }}
            onDelete={async () => {
              try { await apiRequest(`/api/admin/users/${row.id}`, { useAdminToken: true, method: "DELETE" }); } catch {}
              dispatch(removeUser(row.id));
              log(`/api/v4/users/delete -> ${row.id}`);
              panel("Deleted", `${row.id} removed by ${selectedProfile.name}.`);
            }}
          />
        )}
      />
    </section>
  );
};

export default UsersPage;
