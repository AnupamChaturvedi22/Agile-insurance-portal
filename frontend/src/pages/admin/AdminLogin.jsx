// src/components/pages/AdminLogin.jsx
import { useState } from "react";
import { useSelector } from "react-redux";
import { ShieldCheck, Mail, KeyRound, Lock, Smartphone } from "lucide-react";
import { apiRequest, saveAdminSession } from "../../utils/api";
import { useAdminActions } from "../../hooks/useAdminActions";

const AdminLogin = () => {
  const { adminProfiles } = useSelector((s) => s.auth);
  const { handleLogin } = useAdminActions();
  const [selectedProfile, setSelected] = useState(adminProfiles[0]);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otpOpen, setOtpOpen] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("login");
  const [registerForm, setRegisterForm] = useState({ fullName: "", email: "", phone: "", password: "", role: "Support Executive" });

  const onSubmitLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await apiRequest("/api/admin/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: selectedProfile.email, password }),
      });
      if (res?.success && res?.data?.token) {
        const profile = saveAdminSession(res.data.token, res.data.admin);
        handleLogin(profile, res.data.token);
      } else {
        setError(res?.message || "Invalid credentials.");
      }
    } catch (err) {
      setError(err?.message || "Login failed. Please check your credentials.");
    }
  };

  const onSubmitRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await apiRequest("/api/admin/auth/register", { method: "POST", body: JSON.stringify(registerForm) });
      if (res?.success) { setMode("login"); setError("Account created. Sign in now."); }
      else setError(res?.message || "Registration failed.");
    } catch (err) { setError(err?.message || "Registration failed."); }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6 sm:py-10">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm lg:grid-cols-[1fr_440px]">
        {/* Left – profile picker */}
        <section className="flex flex-col justify-between bg-slate-950 p-6 text-white sm:p-8">
          <div>
            <span className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-xs font-black">
              <ShieldCheck size={16} />Agile Insurance Admin
            </span>
            <h1 className="mt-8 max-w-xl text-3xl font-black tracking-tight sm:text-4xl">Secure admin login for role-based operations</h1>
            <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-slate-300">Choose an admin profile, verify credentials, and open the workspace.</p>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {adminProfiles.map((p) => (
              <button
                key={p.email}
                onClick={() => { setSelected(p); setPassword(""); setError(""); }}
                className={`rounded-lg border p-4 text-left transition hover:-translate-y-0.5 ${selectedProfile.email === p.email ? "border-blue-400 bg-blue-500/15" : "border-white/10 bg-white/5 hover:bg-white/10"}`}
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-white text-sm font-black text-slate-950">{p.initials}</span>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-black">{p.name}</div>
                    <div className="truncate text-xs font-semibold text-slate-300">{p.role}</div>
                  </div>
                </div>
                <div className="mt-3 text-xs font-semibold text-slate-300">{p.access}</div>
              </button>
            ))}
          </div>
        </section>

        {/* Right – form */}
        <section className="p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-lg bg-blue-600 font-black text-white">{selectedProfile.initials}</span>
            <div>
              <div className="text-lg font-black text-slate-950">Admin Login</div>
              <div className="text-sm font-semibold text-slate-500">{selectedProfile.role}</div>
            </div>
          </div>

          {mode === "register" ? (
            <form onSubmit={onSubmitRegister} className="mt-8 space-y-4">
              {[["Full Name", "text", "fullName"], ["Email", "email", "email"], ["Phone", "text", "phone"], ["Password", "password", "password"]].map(([label, type, key]) => (
                <label key={key} className="block">
                  <span className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</span>
                  <input type={type} required className="mt-2 h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-blue-500"
                    value={registerForm[key]} onChange={(e) => setRegisterForm((p) => ({ ...p, [key]: e.target.value }))} />
                </label>
              ))}
              <label className="block">
                <span className="text-xs font-black uppercase tracking-wide text-slate-500">Role</span>
                <select className="mt-2 h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-blue-500"
                  value={registerForm.role} onChange={(e) => setRegisterForm((p) => ({ ...p, role: e.target.value }))}>
                  {["Support Executive", "Insurance Manager", "Claims Officer", "Super Admin"].map((r) => <option key={r}>{r}</option>)}
                </select>
              </label>
              {error && <div className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700">{error}</div>}
              <button className="h-12 w-full rounded-lg bg-blue-600 text-sm font-black text-white hover:bg-blue-700">Create Admin Account</button>
              <button type="button" onClick={() => setMode("login")} className="text-sm font-black text-blue-700">Back to login</button>
            </form>
          ) : (
            <form onSubmit={onSubmitLogin} className="mt-8 space-y-4">
              <label className="block">
                <span className="text-xs font-black uppercase tracking-wide text-slate-500">Admin ID</span>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm font-bold outline-none focus:border-blue-500" value={selectedProfile.email} readOnly />
                </div>
              </label>
              <label className="block">
                <span className="text-xs font-black uppercase tracking-wide text-slate-500">Password</span>
                <div className="relative mt-2">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter admin password"
                    className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-16 text-sm font-bold outline-none focus:border-blue-500" />
                  <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs font-black text-blue-700 hover:bg-blue-50">
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </label>
              <button type="button" onClick={() => setOtpOpen((v) => !v)} className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700">
                <span className="inline-flex items-center gap-2"><Smartphone size={18} />Two-Factor Authentication</span>
                <span className="text-blue-700">{otpOpen ? "Enabled" : "OTP"}</span>
              </button>
              {otpOpen && (
                <label className="block">
                  <span className="text-xs font-black uppercase tracking-wide text-slate-500">OTP Code</span>
                  <input className="mt-2 h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm font-black tracking-[0.4em] outline-none" defaultValue="482910" maxLength={6} />
                </label>
              )}
              {error && <div className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-bold text-rose-700">{error}</div>}
              <button className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 text-sm font-black text-white hover:bg-blue-700">
                <Lock size={18} />Login as {selectedProfile.role}
              </button>
              <button type="button" onClick={() => setMode("register")} className="text-sm font-black text-blue-700">Need a new admin account? Register here</button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminLogin;
