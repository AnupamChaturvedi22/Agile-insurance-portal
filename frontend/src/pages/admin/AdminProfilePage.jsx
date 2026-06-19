// src/components/pages/AdminProfilePage.jsx
import { useState } from "react";
import { useSelector } from "react-redux";
import { UserCog } from "lucide-react";
import { SectionTitle } from "../../components/admin/shared";
import { useAdminActions } from "../../hooks/useAdminActions";
import { fileToDataUrl } from "../../utils/helpers";

const AdminProfilePage = () => {
  const { selectedProfile } = useSelector((s) => s.auth);
  const { updateAdminProfile, log, panel } = useAdminActions();
  const [nameDraft, setNameDraft] = useState(selectedProfile.name);
  const [showPwd, setShowPwd] = useState(false);
  const [pwdDraft, setPwdDraft] = useState({ old: "", next: "", confirm: "" });
  const [pwdMsg, setPwdMsg] = useState("");

  const saveName = () => {
    if (!nameDraft.trim()) { panel("Name required", "Admin name cannot be empty."); return; }
    const initials = nameDraft.trim().split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
    updateAdminProfile({ name: nameDraft.trim(), initials });
    log(`/api/v4/profile/updateName -> ${nameDraft.trim()}`);
  };

  const savePassword = () => {
    if (pwdDraft.old !== selectedProfile.password) { setPwdMsg("Old password is incorrect."); return; }
    if (pwdDraft.next.length < 6) { setPwdMsg("New password must be at least 6 characters."); return; }
    if (pwdDraft.next !== pwdDraft.confirm) { setPwdMsg("Passwords do not match."); return; }
    updateAdminProfile({ password: pwdDraft.next });
    setPwdDraft({ old: "", next: "", confirm: "" });
    setPwdMsg("Password changed successfully.");
    log("/api/v4/profile/updatePassword -> Modified credentials");
  };

  const onPhotoUpload = (file) => {
    fileToDataUrl(file, (profilePhoto) => {
      updateAdminProfile({ profilePhoto });
      log("/api/v4/profile/updatePhoto -> Photo updated");
    });
  };

  const removePhoto = () => {
    updateAdminProfile({ profilePhoto: null });
    log("/api/v4/profile/removePhoto -> Photo removed");
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <SectionTitle icon={UserCog} title="Admin Profile" />
      <div className="mt-5 grid gap-5 xl:grid-cols-[360px_1fr]">
        {/* Photo card */}
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
          {selectedProfile.profilePhoto
            ? <img src={selectedProfile.profilePhoto} alt={selectedProfile.name} className="h-20 w-20 rounded-lg object-cover" />
            : <span className="grid h-20 w-20 place-items-center rounded-lg bg-blue-600 text-lg font-black text-white">{selectedProfile.initials}</span>}
          <div className="mt-4 text-xl font-black text-slate-950">{selectedProfile.name}</div>
          <div className="mt-1 text-sm font-bold text-slate-500">{selectedProfile.role}</div>
          <div className="mt-4 rounded-lg bg-white p-3 text-sm font-semibold text-slate-600">{selectedProfile.access}</div>
          <div className="mt-4 flex flex-col gap-2">
            <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-700 hover:border-blue-300 hover:bg-blue-50">
              Upload Photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onPhotoUpload(e.target.files?.[0])}
              />
            </label>

            {selectedProfile.profilePhoto && (
              <button
                onClick={removePhoto}
                className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-black text-rose-700 hover:bg-rose-100"
              >
                Remove Photo
              </button>
            )}
          </div>
        </div>

        <div className="space-y-5">
          {/* Name */}
          <div className="rounded-lg border border-slate-200 p-5">
            <div className="text-sm font-black text-slate-950">Edit Admin Details</div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="text-xs font-black uppercase tracking-wide text-slate-500">Admin Name</span>
                <input className="mt-2 h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-blue-500"
                  value={nameDraft} onChange={(e) => setNameDraft(e.target.value)} />
              </label>
              <label className="block">
                <span className="text-xs font-black uppercase tracking-wide text-slate-500">Admin ID</span>
                <input className="mt-2 h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-blue-500"
                  value={selectedProfile.adminId} onChange={(e) => updateAdminProfile({ adminId: e.target.value })} />
              </label>
            </div>
            <button onClick={saveName} className="mt-4 rounded-lg bg-blue-600 px-4 py-3 text-sm font-black text-white hover:bg-blue-700">Save Profile</button>
          </div>

          {/* Password */}
          <div className="rounded-lg border border-slate-200 p-5">
            <div className="text-sm font-black text-slate-950">Change Password</div>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {[["Old Password", "old"], ["New Password", "next"], ["Confirm Password", "confirm"]].map(([label, key]) => (
                <label key={key} className="block">
                  <span className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</span>
                  <input type={showPwd ? "text" : "password"} value={pwdDraft[key]}
                    onChange={(e) => setPwdDraft((d) => ({ ...d, [key]: e.target.value }))}
                    className="mt-2 h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-blue-500" />
                </label>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button onClick={() => setShowPwd((v) => !v)} className="rounded-lg border border-slate-200 px-4 py-3 text-sm font-black text-blue-700 hover:bg-blue-50">{showPwd ? "Hide" : "Show"} Passwords</button>
              <button onClick={savePassword} className="rounded-lg bg-blue-600 px-4 py-3 text-sm font-black text-white hover:bg-blue-700">Change Password</button>
            </div>
            {pwdMsg && <div className="mt-4 rounded-lg bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700">{pwdMsg}</div>}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminProfilePage;
