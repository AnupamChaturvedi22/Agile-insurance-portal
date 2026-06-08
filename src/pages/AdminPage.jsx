import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  BadgeCheck,
  BarChart3,
  Bell,
  CheckCircle2,
  ClipboardCheck,
  CreditCard,
  Download,
  Edit3,
  Eraser,
  Eye,
  FileText,
  Headphones,
  History,
  KeyRound,
  LayoutDashboard,
  LineChart,
  Lock,
  LogOut,
  Mail,
  Menu,
  MessageSquare,
  PieChart,
  Plus,
  Save,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Smartphone,
  Trash2,
  UserCog,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { uid } from "../utils/storage";

const STORAGE_USERS = "agile_insurance_users_v1";
const STORAGE_SESSION = "agile_insurance_session_v1";
const STORAGE_ADMINS = "agile_insurance_admins_v1";
const STORAGE_CLAIMS = "agile_insurance_claims_v1";
const STORAGE_AUDIT_LOGS = "agile_insurance_audit_logs_v1";
const STORAGE_SYSTEM_SETTINGS = "agile_insurance_system_settings_v1";
// Support chat storage key - shared with user dashboard contact page
// EDIT HERE: Change storage key if migrating chat data to a different location
const STORAGE_SUPPORT_CHATS = "agile_insurance_support_chats_v1";

const defaultAdminProfiles = [
  {
    adminId: "ADM-SUPER-001",
    password: "Super@123",
    profilePhoto: "",
    name: "Asha Menon",
    email: "asha.admin@agileinsure.in",
    role: "Super Admin",
    initials: "AM",
    access: "Full platform access",
  },
  {
    adminId: "ADM-MGR-002",
    password: "Manager@123",
    profilePhoto: "",
    name: "Rohit Kapoor",
    email: "rohit.manager@agileinsure.in",
    role: "Insurance Manager",
    initials: "RK",
    access: "Policies, users, requirements",
  },
  {
    adminId: "ADM-CLM-003",
    password: "Claims@123",
    profilePhoto: "",
    name: "Naina Shah",
    email: "naina.claims@agileinsure.in",
    role: "Claims Officer",
    initials: "NS",
    access: "Claims and document review",
  },
  {
    adminId: "ADM-SUP-004",
    password: "Support@123",
    profilePhoto: "",
    name: "Imran Ali",
    email: "imran.support@agileinsure.in",
    role: "Support Executive",
    initials: "IA",
    access: "Tickets and user replies",
  },
];

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["Super Admin", "Insurance Manager", "Claims Officer", "Support Executive"] },
  { id: "users", label: "User Management", icon: Users, roles: ["Super Admin", "Insurance Manager"] },
  { id: "claims", label: "Claims Management", icon: ClipboardCheck, roles: ["Super Admin", "Claims Officer"] },
  { id: "requirements", label: "Requirements", icon: BadgeCheck, roles: ["Super Admin", "Insurance Manager"] },
  { id: "support", label: "Support Center", icon: Headphones, roles: ["Super Admin", "Support Executive"] },
  { id: "policies", label: "Policy Management", icon: FileText, roles: ["Super Admin", "Insurance Manager"] },
  { id: "documents", label: "Document Verification", icon: ShieldCheck, roles: ["Super Admin", "Claims Officer"] },
  { id: "reports", label: "Reports & Analytics", icon: BarChart3, roles: ["Super Admin", "Insurance Manager"] },
  { id: "audit", label: "Audit Logs", icon: History, roles: ["Super Admin"] },
  { id: "profile", label: "Admin Profile", icon: UserCog, roles: ["Super Admin", "Insurance Manager", "Claims Officer", "Support Executive"] },
  { id: "settings", label: "System Settings", icon: Settings, roles: ["Super Admin"] },
];

const metrics = [
  { label: "Total Users", value: "24,860", change: "+12.4%", icon: Users, tone: "bg-blue-600", page: "users" },
  { label: "Active Policies", value: "18,204", change: "+8.1%", icon: FileText, tone: "bg-emerald-600", page: "policies" },
  { label: "Pending Claims", value: "326", change: "42 urgent", icon: AlertTriangle, tone: "bg-amber-500", page: "claims" },
  { label: "Approved Claims", value: "4,812", change: "+15.7%", icon: CheckCircle2, tone: "bg-teal-600", page: "claims" },
  { label: "Rejected Claims", value: "284", change: "-2.3%", icon: XCircle, tone: "bg-rose-600", page: "claims" },
  { label: "Open Support Tickets", value: "149", change: "31 high", icon: MessageSquare, tone: "bg-violet-600", page: "support" },
  { label: "Revenue Generated", value: "INR 8.42 Cr", change: "+18.2%", icon: CreditCard, tone: "bg-indigo-600", page: "reports" },
];

const users = [
  { id: "USR1001", name: "Priya Sharma", email: "priya@example.com", phone: "+91 98765 43210", policies: 3, status: "Active", city: "Pune" },
  { id: "USR1002", name: "Rahul Verma", email: "rahul@example.com", phone: "+91 99887 77665", policies: 1, status: "Active", city: "Delhi" },
  { id: "USR1003", name: "Ananya Iyer", email: "ananya@example.com", phone: "+91 91234 56780", policies: 4, status: "Inactive", city: "Bengaluru" },
  { id: "USR1004", name: "Kabir Singh", email: "kabir@example.com", phone: "+91 95555 44112", policies: 2, status: "Active", city: "Mumbai" },
];

const claims = [
  { id: "CLM001", user: "John Mathew", policy: "Health", amount: "INR 50,000", status: "Pending", officer: "Riya S." },
  { id: "CLM002", user: "Aarav Mehta", policy: "Car", amount: "INR 1,24,500", status: "Under Review", officer: "Nikhil P." },
  { id: "CLM003", user: "Meera Rao", policy: "Life", amount: "INR 7,50,000", status: "Approved", officer: "Fatima K." },
  { id: "CLM004", user: "Sana Khan", policy: "Travel", amount: "INR 82,000", status: "Documents", officer: "Dev A." },
];

const requirements = [
  { user: "Kabir S.", age: 34, budget: "INR 18,000", coverage: "INR 15L", status: "Quote Ready" },
  { user: "Nisha P.", age: 42, budget: "INR 30,000", coverage: "INR 25L", status: "Review" },
  { user: "Aditya R.", age: 29, budget: "INR 12,000", coverage: "INR 10L", status: "Consultation" },
];

const documents = [
  { type: "Aadhaar", owner: "Priya Sharma", status: "Approved" },
  { type: "PAN", owner: "Rahul Verma", status: "Pending" },
  { type: "Driving License", owner: "Aarav Mehta", status: "Pending" },
  { type: "Medical Reports", owner: "Meera Rao", status: "Re-upload" },
  { type: "Claim Documents", owner: "Sana Khan", status: "Verification" },
];

const adminSettingCards = [
  { id: "general", title: "General Setting", description: "Configure the fundamental information of the site.", icon: Settings },
  { id: "branding", title: "Logo and Favicon", description: "Upload your logo and favicon here.", icon: LayoutDashboard },
  { id: "configuration", title: "System Configuration", description: "Control all of the basic modules of the system.", icon: UserCog },
  { id: "notifications", title: "Notification Setting", description: "Control and configure overall notification elements of the system.", icon: Bell },
  { id: "payment", title: "Payment Gateways", description: "Configure automatic or manual payment gateways to accept payment from users.", icon: CreditCard },
  { id: "withdrawals", title: "Withdrawals Methods", description: "Set up manual withdrawal methods for payout requests.", icon: KeyRound },
  { id: "forms", title: "Policy Forms", description: "Generate forms for different policies.", icon: ClipboardCheck },
  { id: "features", title: "Manage Features", description: "Generate features for different plans.", icon: Edit3 },
  { id: "regulations", title: "Policy Regulations", description: "Define what will and will not be covered in plans.", icon: AlertTriangle },
  { id: "seo", title: "SEO Configuration", description: "Configure meta title, description, and keywords.", icon: LineChart },
  { id: "frontend", title: "Manage Frontend", description: "Control all frontend contents of the system.", icon: Smartphone },
  { id: "pages", title: "Manage Pages", description: "Control dynamic and static pages of the system.", icon: FileText },
  { id: "kyc", title: "KYC Setting", description: "Configure client information fields.", icon: ShieldCheck },
  { id: "social", title: "Social Login Setting", description: "Provide required social login information.", icon: Users },
  { id: "language", title: "Language", description: "Configure languages and keywords to localize the system.", icon: MessageSquare },
  { id: "extensions", title: "Extensions", description: "Manage extensions of the system.", icon: Plus },
  { id: "policyPages", title: "Policy Pages", description: "Configure policy and terms of the system.", icon: Lock },
  { id: "maintenance", title: "Maintenance Mode", description: "Enable or disable maintenance mode when required.", icon: Settings },
  { id: "cookie", title: "GDPR Cookie", description: "Set GDPR cookie policy for visitors.", icon: CheckCircle2 },
  { id: "css", title: "Custom CSS", description: "Write custom CSS for frontend styles.", icon: FileText },
  { id: "sitemap", title: "Sitemap XML", description: "Insert sitemap XML to enhance SEO performance.", icon: LayoutDashboard },
  { id: "robots", title: "Robots txt", description: "Insert robots.txt content for web crawlers.", icon: FileText },
];

const reportTemplates = [
  { id: "claims-report", title: "Claims Report", category: "Claims", owner: "Claims Office", status: "Ready", pages: 7 },
  { id: "revenue-report", title: "Revenue Report", category: "Finance", owner: "Accounts", status: "Ready", pages: 5 },
  { id: "user-growth-report", title: "User Growth Report", category: "Users", owner: "Operations", status: "Draft", pages: 4 },
  { id: "policy-sales-report", title: "Policy Sales Report", category: "Policies", owner: "Sales", status: "Ready", pages: 6 },
  { id: "agent-performance-report", title: "Agent Performance Report", category: "Agents", owner: "Management", status: "Review", pages: 8 },
];

const policyPlans = [
  { name: "Health Secure Plus", type: "Health", coverage: "INR 25L", premium: "INR 1,850/mo", duration: "1 year", state: "Active" },
  { name: "Drive Shield Elite", type: "Motor", coverage: "IDV based", premium: "INR 9,600/yr", duration: "1 year", state: "Active" },
  { name: "Term Life Max", type: "Life", coverage: "INR 1 Cr", premium: "INR 1,120/mo", duration: "30 years", state: "Draft" },
  { name: "Travel Global Care", type: "Travel", coverage: "USD 100K", premium: "INR 2,400/trip", duration: "Trip", state: "Inactive" },
];

const claimSteps = ["Submitted", "Under Review", "Document Verification", "Approved / Rejected", "Payment Processing", "Completed"];

const pageTitles = {
  dashboard: "Admin Dashboard",
  users: "User Management",
  claims: "Claims Management",
  requirements: "Requirement Management",
  support: "Support Center",
  policies: "Policy Management",
  documents: "Document Verification",
  notifications: "Notification Center",
  reports: "Reports & Analytics",
  audit: "Audit Logs",
  profile: "Admin Profile",
  settings: "System Settings",
  editor: "Markup Editor",
};

const safeJsonParse = (value, fallback) => {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const loadAdmins = () => {
  const saved = safeJsonParse(localStorage.getItem(STORAGE_ADMINS), null);
  return Array.isArray(saved) && saved.length ? saved : defaultAdminProfiles;
};

const saveAdmins = (admins) => {
  localStorage.setItem(STORAGE_ADMINS, JSON.stringify(admins));
};

const readSupportChats = () => {
  const chats = safeJsonParse(localStorage.getItem(STORAGE_SUPPORT_CHATS), []);
  return Array.isArray(chats) ? chats : [];
};

const saveSupportChats = (chats) => {
  localStorage.setItem(STORAGE_SUPPORT_CHATS, JSON.stringify(chats));
};

const normalizeClaim = (claim, index = 0) => {
  const amount = typeof claim.amount === "number" ? `INR ${claim.amount.toLocaleString("en-IN")}` : claim.amount || "INR 0";
  const status = claim.status === "Reviewing" || claim.status === "AI Verification" ? "Pending" : claim.status || "Pending";
  return {
    id: claim.id || claim.claimId || `CLM${String(index + 1).padStart(3, "0")}`,
    user: claim.user || claim.fullName || claim.name || "Customer",
    email: claim.email || "",
    userId: claim.userId || "",
    policy: claim.policy || claim.type || claim.policyName || "Insurance",
    type: claim.type || claim.policy || "Insurance",
    amount,
    rawAmount: Number(claim.amount) || 0,
    status,
    officer: claim.officer || "Unassigned",
    description: claim.description || "Claim submitted from customer portal.",
    docName: claim.docName || claim.document || "Documents pending",
    aiStatus: claim.aiStatus || "Pending",
    progress: claim.progress || 2,
    timeline: Array.isArray(claim.timeline) ? claim.timeline : [],
    createdAt: claim.createdAt || new Date().toISOString(),
    response: claim.response || "",
    rejectionReason: claim.rejectionReason || "",
  };
};

const readClaims = () => {
  const storedClaims = safeJsonParse(localStorage.getItem(STORAGE_CLAIMS), []);
  const source = Array.isArray(storedClaims) && storedClaims.length ? storedClaims : claims;
  return source.map(normalizeClaim);
};

const writeClaims = (rows) => {
  localStorage.setItem(STORAGE_CLAIMS, JSON.stringify(rows.map(normalizeClaim)));
};

const defaultSystemSettings = {
  general: {
    companyName: "Agile Insurance",
    supportEmail: "support@agileinsure.in",
    serviceTaxRate: 18,
    claimSlaDays: 7,
  },
  kyc: {
    aadhaarRequired: true,
    panRequired: true,
    selfieRequired: false,
    autoRejectIncomplete: false,
  },
  claims: {
    manualApprovalRequired: true,
    highValueReviewAmount: 100000,
    allowCustomerResubmission: true,
    settlementDays: 5,
  },
  notifications: {
    emailEnabled: true,
    smsEnabled: true,
    pushEnabled: false,
    renewalReminderDays: 15,
  },
  security: {
    twoFactorRequired: true,
    sessionTimeoutMinutes: 30,
    auditRetentionDays: 180,
  },
};

const readSystemSettings = () => {
  const saved = safeJsonParse(localStorage.getItem(STORAGE_SYSTEM_SETTINGS), null);
  return saved ? { ...defaultSystemSettings, ...saved } : defaultSystemSettings;
};

const saveSystemSettings = (settings) => {
  localStorage.setItem(STORAGE_SYSTEM_SETTINGS, JSON.stringify(settings));
};

const readAuditLogs = () => {
  const logs = safeJsonParse(localStorage.getItem(STORAGE_AUDIT_LOGS), []);
  return Array.isArray(logs) ? logs : [];
};

const saveAuditLogs = (logs) => {
  localStorage.setItem(STORAGE_AUDIT_LOGS, JSON.stringify(logs));
};

const readRealUsers = () => {
  const storedUsers = safeJsonParse(localStorage.getItem(STORAGE_USERS), []);
  const session = safeJsonParse(localStorage.getItem(STORAGE_SESSION), null);
  const users = Array.isArray(storedUsers) ? storedUsers : [];
  const sessionUser = session?.user;
  const merged = sessionUser && !users.some((user) => user.id === sessionUser.id) ? [...users, sessionUser] : users;

  return merged.map((user, index) => ({
    id: user.id || `USR-${index + 1}`,
    name: user.fullName || user.name || "Customer",
    email: user.email || "not-provided@agile.insurance",
    phone: user.phone || "Not added",
    policies: user.policyCount ?? 0,
    status: sessionUser?.id === user.id ? "Logged In" : "Active",
    city: user.city || "Not added",
    profilePhoto: user.profilePhoto || "",
  }));
};

const readUserActivity = (user, adminClaims = []) => {
  const purchases = safeJsonParse(localStorage.getItem("agile_insurance_purchases_v1"), []);
  const claimsData = safeJsonParse(localStorage.getItem("agile_insurance_claims_v1"), []);
  const payments = safeJsonParse(localStorage.getItem("agile_insurance_payments_v1"), []);
  const documentsData = safeJsonParse(localStorage.getItem("agile_insurance_documents_v1"), []);
  const allClaims = [...(Array.isArray(claimsData) ? claimsData : []), ...adminClaims].filter((claim) => {
    const claimUser = claim.user || claim.fullName || claim.name || "";
    const claimEmail = claim.email || "";
    return claimUser === user.name || claimEmail === user.email;
  });
  const allDocuments = Array.isArray(documentsData) ? documentsData : [];

  return {
    profile: user.name,
    email: user.email,
    phone: user.phone,
    city: user.city,
    loginStatus: user.status,
    policiesPurchased: Array.isArray(purchases) ? purchases.length : 0,
    claimsSubmitted: allClaims.length,
    claimSummary: allClaims.length ? allClaims.map((claim) => `${claim.id || claim.claimId || "Claim"} - ${claim.policy || claim.policyName || "Policy"} - ${claim.status || "Submitted"}`).join("; ") : "No claims found for this user",
    paymentsMade: Array.isArray(payments) ? payments.filter((payment) => payment.status === "Success").length : 0,
    documentsUploaded: allDocuments.length,
    documents: allDocuments.length ? allDocuments.map((doc) => doc.name || doc.type || doc.fileName || "Document").join(", ") : "No uploaded documents found",
    recentActivity: user.status === "Logged In" ? "Currently logged in to the user portal" : "Registered user profile available",
  };
};

const formatStructuredDetail = (value) => {
  if (typeof value === "string") return value;
  return Object.entries(value)
    .map(([key, item]) => {
      const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase());
      return `${label}: ${item}`;
    })
    .join("\n");
};

const fileToDataUrl = (file, callback) => {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => callback(String(reader.result || ""));
  reader.readAsDataURL(file);
};

const statusClass = (status) => {
  const value = String(status).toLowerCase();
  if (value.includes("approved") || value.includes("active") || value.includes("ready") || value.includes("logged in")) {
    return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  }
  if (value.includes("reject") || value.includes("inactive") || value.includes("re-upload")) {
    return "bg-rose-50 text-rose-700 ring-rose-200";
  }
  if (value.includes("open") || value.includes("high") || value.includes("pending") || value.includes("review")) {
    return "bg-amber-50 text-amber-700 ring-amber-200";
  }
  return "bg-blue-50 text-blue-700 ring-blue-200";
};

const MiniBars = ({ values, color = "#2563eb" }) => (
  <div className="flex h-28 items-end gap-2">
    {values.map((value, index) => (
      <div key={`${value}-${index}`} className="flex flex-1 items-end">
        <div className="w-full rounded-t" style={{ height: `${value}%`, backgroundColor: color }} title={`${value}%`} />
      </div>
    ))}
  </div>
);

const LineSpark = ({ values, color = "#2563eb" }) => {
  const points = useMemo(() => {
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = Math.max(max - min, 1);
    return values
      .map((value, index) => {
        const x = (index / Math.max(values.length - 1, 1)) * 260;
        const y = 96 - ((value - min) / range) * 82;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  }, [values]);

  return (
    <svg viewBox="0 0 260 110" className="h-28 w-full" role="img" aria-label="Trend line chart">
      <polyline points={points} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      {points.split(" ").map((point) => {
        const [x, y] = point.split(",");
        return <circle key={point} cx={x} cy={y} r="4" fill="white" stroke={color} strokeWidth="3" />;
      })}
    </svg>
  );
};

const SectionTitle = ({ icon: Icon, title, action }) => (
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex min-w-0 items-center gap-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-700">
        <Icon size={18} />
      </span>
      <h2 className="truncate text-base font-black text-slate-950">{title}</h2>
    </div>
    {action}
  </div>
);

const ActionButton = ({ icon: Icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-2 text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
    title={label}
    aria-label={label}
  >
    <Icon size={16} />
  </button>
);

const AdminLogin = ({ adminProfiles, selectedProfile, setSelectedProfile, onLogin }) => {
  const [otpOpen, setOtpOpen] = useState(false);
  const [adminId, setAdminId] = useState(selectedProfile.adminId);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const chooseProfile = (profile) => {
    setSelectedProfile(profile);
    setAdminId(profile.adminId);
    setPassword("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6 text-slate-900 sm:py-10">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm lg:grid-cols-[1fr_440px]">
        <section className="flex flex-col justify-between bg-slate-950 p-6 text-white sm:p-8">
          <div>
            <span className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-xs font-black text-white">
              <ShieldCheck size={16} />
              Agile Insurance Admin
            </span>
            <h1 className="mt-8 max-w-xl text-3xl font-black tracking-tight sm:text-4xl">Secure admin login for role-based operations</h1>
            <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-slate-300">
              Choose an admin profile, verify credentials, and open the workspace with role-matched pages and actions.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {adminProfiles.map((profile) => (
              <button
                key={profile.email}
                onClick={() => chooseProfile(profile)}
                className={`cursor-pointer rounded-lg border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-lg ${selectedProfile.email === profile.email ? "border-blue-400 bg-blue-500/15" : "border-white/10 bg-white/5 hover:bg-white/10"}`}
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-white text-sm font-black text-slate-950">{profile.initials}</span>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-black">{profile.name}</div>
                    <div className="truncate text-xs font-semibold text-slate-300">{profile.role}</div>
                  </div>
                </div>
                <div className="mt-3 text-xs font-semibold text-slate-300">{profile.access}</div>
              </button>
            ))}
          </div>
        </section>

        <section className="p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-lg bg-blue-600 font-black text-white">{selectedProfile.initials}</span>
            <div>
              <div className="text-lg font-black text-slate-950">Admin Login</div>
              <div className="text-sm font-semibold text-slate-500">{selectedProfile.role}</div>
            </div>
          </div>

          <form
            className="mt-8 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              if (adminId !== selectedProfile.adminId || password !== selectedProfile.password) {
                setError("Invalid admin ID or password for the selected profile.");
                return;
              }
              onLogin();
            }}
          >
            <label className="block">
              <span className="text-xs font-black uppercase tracking-wide text-slate-500">Admin ID</span>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm font-bold outline-none focus:border-blue-500" value={adminId} onChange={(event) => setAdminId(event.target.value)} />
              </div>
            </label>

            <label className="block">
              <span className="text-xs font-black uppercase tracking-wide text-slate-500">Password</span>
              <div className="relative mt-2">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-16 text-sm font-bold outline-none focus:border-blue-500" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter admin password" />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs font-black text-blue-700 hover:bg-blue-50"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            <div className="flex items-center justify-between gap-3 text-sm font-bold">
              <label className="inline-flex items-center gap-2 text-slate-600">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300" defaultChecked />
                Remember me
              </label>
              <button type="button" className="text-blue-700 hover:text-blue-900">Forgot Password</button>
            </div>

            <button type="button" onClick={() => setOtpOpen((value) => !value)} className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 text-left text-sm font-black text-slate-700">
              <span className="inline-flex items-center gap-2"><Smartphone size={18} />Two-Factor Authentication</span>
              <span className="text-blue-700">{otpOpen ? "Enabled" : "OTP"}</span>
            </button>

            {otpOpen && (
              <label className="block">
                <span className="text-xs font-black uppercase tracking-wide text-slate-500">OTP Code</span>
                <input className="mt-2 h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm font-black tracking-[0.4em] outline-none focus:border-blue-500" defaultValue="482910" maxLength={6} />
              </label>
            )}

            {error && <div className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-bold text-rose-700">{error}</div>}

            <button className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-black text-white hover:bg-blue-700">
              <Lock size={18} />
              Login as {selectedProfile.role}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

const DataTable = ({ columns, rows, renderActions }) => (
  <div className="mt-5 overflow-x-auto rounded-lg border border-slate-200">
    <table className="w-full min-w-[760px] text-left text-sm">
      <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
        <tr>
          {columns.map((head) => (
            <th key={head} className="px-3 py-3 font-black">{head}</th>
          ))}
          {renderActions && <th className="px-3 py-3 font-black">Actions</th>}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 bg-white">
        {rows.map((row) => (
          <tr key={row.id || row.name || row.user || row.type}>
            {columns.map((column) => {
              const key = column.toLowerCase().replaceAll(" ", "");
              const value = row[key] ?? row[column.toLowerCase()] ?? row[column] ?? row.state ?? "";
              return (
                <td key={column} className="px-3 py-4 font-semibold text-slate-700">
                  {String(value).match(/active|pending|approved|review|open|inactive|draft|verification|re-upload/i) ? (
                    <span className={`rounded-lg px-2 py-1 text-xs font-black ring-1 ${statusClass(value)}`}>{value}</span>
                  ) : (
                    value
                  )}
                </td>
              );
            })}
            {renderActions && <td className="px-3 py-4">{renderActions(row)}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const AdminSidebar = ({
  mobile = false,
  collapsed = false,
  allowedNav,
  activePage,
  selectedProfile,
  openPage,
  onLogout,
  onToggleCollapsed,
}) => (
  <aside className={`${mobile ? "flex" : "hidden lg:flex"} h-full ${collapsed && !mobile ? "w-[92px]" : "w-[292px]"} shrink-0 flex-col border-r border-slate-200 bg-white transition-[width] duration-300`}>
    <div className={`flex items-center gap-3 border-b border-slate-200 px-4 py-5 ${collapsed && !mobile ? "justify-center" : ""}`}>
      {(!collapsed || mobile) && (
        <>
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-blue-600 text-white">
            <ShieldCheck size={22} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-base font-black text-slate-950">Agile Admin</div>
            <div className="truncate text-xs font-semibold text-slate-500">{selectedProfile.role}</div>
          </div>
        </>
      )}
      <button
        onClick={onToggleCollapsed}
        className="grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 hover:shadow-sm"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <Menu size={20} />
      </button>
    </div>

    <nav className="scrollbar-none min-h-0 flex-1 space-y-1 overflow-y-auto px-3 py-4">
      {allowedNav.map((item) => {
        const Icon = item.icon;
        const active = activePage === item.id;
        return (
          <div key={item.id}>
            <button
              onClick={() => openPage(item.id)}
              className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-bold transition hover:-translate-y-0.5 hover:shadow-sm ${collapsed && !mobile ? "justify-center" : ""} ${active ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-blue-50 hover:text-blue-700"}`}
              title={item.label}
            >
              <Icon size={18} className={active ? "text-white" : "text-blue-700"} />
              {(!collapsed || mobile) && <span className="min-w-0 flex-1 truncate">{item.label}</span>}
            </button>
          </div>
        );
      })}
    </nav>

    <div className="border-t border-slate-200 p-4">
      {(!collapsed || mobile) && <div className="mb-3 flex items-center gap-3 rounded-lg bg-slate-50 p-3">
        {selectedProfile.profilePhoto ? (
          <img src={selectedProfile.profilePhoto} alt={selectedProfile.name} className="h-10 w-10 rounded-lg object-cover" />
        ) : (
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-blue-600 text-xs font-black text-white">{selectedProfile.initials}</span>
        )}
        <div className="min-w-0">
          <div className="truncate text-sm font-black text-slate-950">{selectedProfile.name}</div>
          <div className="truncate text-xs font-semibold text-slate-500">{selectedProfile.email}</div>
        </div>
      </div>}
      <button
        onClick={onLogout}
        className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-3 text-sm font-bold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700 ${collapsed && !mobile ? "justify-center" : ""}`}
        title="Logout"
      >
        <LogOut size={18} />
        {(!collapsed || mobile) && "Logout"}
      </button>
    </div>
  </aside>
);

const AdminPage = () => {
  const [adminProfiles, setAdminProfiles] = useState(() => loadAdmins());
  const [selectedProfile, setSelectedProfile] = useState(() => loadAdmins()[0]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [customerRows, setCustomerRows] = useState(() => {
    const realUsers = readRealUsers();
    return realUsers.length ? realUsers : users;
  });
  const [claimRows, setClaimRows] = useState(readClaims);
  const [claimFilter, setClaimFilter] = useState("pending");
  const [requirementRows, setRequirementRows] = useState(requirements);
  const [documentRows, setDocumentRows] = useState(documents);
  const [planRows, setPlanRows] = useState(policyPlans);
  const [showAdminProfilePassword, setShowAdminProfilePassword] = useState(false);
  const [adminNameDraft, setAdminNameDraft] = useState(() => loadAdmins()[0]?.name || "");
  const [passwordDraft, setPasswordDraft] = useState({ old: "", next: "", confirm: "" });
  const [passwordMessage, setPasswordMessage] = useState("");
  const [supportChats, setSupportChats] = useState(() => readSupportChats());
  const [selectedChat, setSelectedChat] = useState(null);
  const [adminReply, setAdminReply] = useState("");
  const [auditLogs, setAuditLogs] = useState(readAuditLogs);
  const [systemSettings, setSystemSettings] = useState(readSystemSettings);
  const [editorTarget, setEditorTarget] = useState(null);
  const [editorTool, setEditorTool] = useState("pen");
  const [editorColor, setEditorColor] = useState("#dc2626");
  const [editorMarks, setEditorMarks] = useState([]);
  const [draftMark, setDraftMark] = useState(null);
  const [detail, setDetail] = useState({
    title: "Admin Activity",
    body: "Select a row or action to view operational context here.",
    photo: "",
  });

  const activeUsers = customerRows.filter((user) => user.status === "Active" || user.status === "Logged In").length;

  const dashboardMetrics = useMemo(
    () =>
      metrics.map((metric) => {
        if (metric.label === "Total Users") return { ...metric, value: String(customerRows.length), change: `${activeUsers} active` };
        if (metric.label === "Pending Claims") return { ...metric, value: String(claimRows.filter((claim) => claim.status !== "Approved" && claim.status !== "Rejected").length) };
        if (metric.label === "Approved Claims") return { ...metric, value: String(claimRows.filter((claim) => claim.status === "Approved").length) };
        if (metric.label === "Rejected Claims") return { ...metric, value: String(claimRows.filter((claim) => claim.status === "Rejected").length) };
        if (metric.label === "Open Support Tickets") return { ...metric, value: String(supportChats.filter((chat) => chat.status !== "Resolved").length), change: `${supportChats.length} total` };
        if (metric.label === "Active Policies") return { ...metric, value: String(planRows.filter((plan) => plan.state === "Active").length) };
        return metric;
      }),
    [activeUsers, claimRows, customerRows.length, planRows, supportChats],
  );

  const allowedNav = useMemo(
    () => navItems.filter((item) => item.roles.includes(selectedProfile.role)),
    [selectedProfile.role],
  );

  const openPage = (page) => {
    setActivePage(page);
    setMobileOpen(false);
    setDetail({ title: pageTitles[page], body: `You opened ${pageTitles[page]} as ${selectedProfile.role}.`, photo: "" });
  };

  const getEditorPoint = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    };
  };

  const openMarkupEditor = (target, type) => {
    const title = target.title || target.type || target.id || target.name || "Report";
    setEditorTarget({ ...target, editorType: type, title });
    setEditorMarks(Array.isArray(target.markups) ? target.markups : []);
    setDraftMark(null);
    setActivePage("editor");
    setDetail({ title: `Editing ${title}`, body: "Use pen, eraser, and color controls to mark mistakes for correction.", photo: "" });
  };

  const startMarkup = (event) => {
    if (!editorTarget) return;
    if (editorTool === "eraser") {
      setEditorMarks((marks) => marks.slice(0, -1));
      return;
    }
    const point = getEditorPoint(event);
    setDraftMark({ id: uid("mark"), color: editorColor, points: [point] });
  };

  const continueMarkup = (event) => {
    if (!draftMark || editorTool !== "pen") return;
    const point = getEditorPoint(event);
    setDraftMark((mark) => ({ ...mark, points: [...mark.points, point] }));
  };

  const finishMarkup = () => {
    if (!draftMark) return;
    setEditorMarks((marks) => [...marks, draftMark]);
    setDraftMark(null);
  };

  const saveMarkupEditor = () => {
    if (!editorTarget) return;
    const targetKey = editorTarget.id || `${editorTarget.type}-${editorTarget.owner}` || editorTarget.title;
    const updatedTarget = { ...editorTarget, markups: editorMarks, status: editorMarks.length ? "Marked" : editorTarget.status };

    if (editorTarget.editorType === "document") {
      setDocumentRows((rows) =>
        rows.map((row) => (`${row.type}-${row.owner}` === `${editorTarget.type}-${editorTarget.owner}` ? updatedTarget : row)),
      );
    }

    if (editorTarget.editorType === "claim") {
      updateClaimRows(
        (rows) => rows.map((row) => (row.id === editorTarget.id ? { ...row, markups: editorMarks, status: editorMarks.length ? "Documents" : row.status } : row)),
        "Claim report marked",
        editorTarget.id,
        `${editorMarks.length} markup notes saved by ${selectedProfile.name}.`,
      );
    } else {
      addAudit("Report markup saved", targetKey, `${editorMarks.length} markup notes saved by ${selectedProfile.name}.`);
    }

    runAction("Markup saved", `${editorMarks.length} correction mark${editorMarks.length === 1 ? "" : "s"} saved for ${editorTarget.title}.`);
  };

  const addAudit = (action, target, details = "") => {
    const entry = {
      id: uid("audit"),
      at: new Date().toISOString(),
      admin: selectedProfile.name,
      role: selectedProfile.role,
      action,
      target,
      details: formatStructuredDetail(details),
    };
    setAuditLogs((logs) => {
      const next = [entry, ...logs].slice(0, 200);
      saveAuditLogs(next);
      return next;
    });
  };

  const runAction = (title, body, photo = "") => setDetail({ title, body: formatStructuredDetail(body), photo });

  const updateClaimRows = (updater, auditAction = "", auditTarget = "", auditDetails = "") => {
    setClaimRows((rows) => {
      const next = typeof updater === "function" ? updater(rows) : updater;
      writeClaims(next);
      return next;
    });
    if (auditAction) addAudit(auditAction, auditTarget, auditDetails);
  };

  const refreshRealUsers = () => {
    const realUsers = readRealUsers();
    setCustomerRows(realUsers.length ? realUsers : users);
    runAction("Users refreshed", `${realUsers.length} real registered or logged-in users loaded from the app profile store.`);
  };

  const createCustomer = () => {
    const nextUser = {
      id: uid("user"),
      name: "New Customer",
      email: `customer${customerRows.length + 1}@agile.insurance`,
      phone: "Not added",
      policies: 0,
      status: "Active",
      city: "Not added",
    };
    setCustomerRows((rows) => [nextUser, ...rows]);
    runAction("User created", `${nextUser.name} was added by ${selectedProfile.name}.`);
  };

  const createPlan = () => {
    const nextPlan = {
      name: `New Insurance Plan ${planRows.length + 1}`,
      type: "Health",
      coverage: "INR 10L",
      premium: "INR 999/mo",
      duration: "1 year",
      state: "Draft",
    };
    setPlanRows((rows) => [nextPlan, ...rows]);
    runAction("Plan created", `${nextPlan.name} is ready for editing and approval.`);
  };

  const createClaim = () => {
    const nextClaim = {
      id: uid("claim"),
      user: customerRows[0]?.name || "New Customer",
      policy: "Health",
      amount: "INR 25,000",
      status: "Pending",
      officer: selectedProfile.name,
    };
    updateClaimRows((rows) => [normalizeClaim(nextClaim), ...rows], "Claim created", nextClaim.id, `Created by ${selectedProfile.name}`);
    runAction("Claim created", `${nextClaim.id} was created and assigned to ${selectedProfile.name}.`);
  };

  const createRequirement = () => {
    const nextRequirement = {
      user: customerRows[0]?.name || "Customer",
      age: 30,
      budget: "INR 15,000",
      coverage: "INR 10L",
      status: "Review",
    };
    setRequirementRows((rows) => [nextRequirement, ...rows]);
    runAction("Requirement created", `A new policy requirement was created for ${nextRequirement.user}.`);
  };

  const updateAdminProfile = (changes) => {
    const nextAdmins = adminProfiles.map((admin) =>
      admin.email === selectedProfile.email ? { ...admin, ...changes } : admin,
    );
    const nextSelected = nextAdmins.find((admin) => admin.email === selectedProfile.email);
    setAdminProfiles(nextAdmins);
    setSelectedProfile(nextSelected);
    saveAdmins(nextAdmins);
    return nextSelected;
  };

  const saveAdminName = () => {
    const name = adminNameDraft.trim();
    if (!name) {
      runAction("Name required", "Admin name cannot be empty.");
      return;
    }
    const nextSelected = updateAdminProfile({
      name,
      initials: name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
    });
    runAction("Admin name updated", `Admin name changed to ${nextSelected.name}.`);
  };

  const saveAdminPassword = () => {
    if (passwordDraft.old !== selectedProfile.password) {
      setPasswordMessage("Old password is incorrect.");
      return;
    }
    if (passwordDraft.next.length < 6) {
      setPasswordMessage("New password must be at least 6 characters.");
      return;
    }
    if (passwordDraft.next !== passwordDraft.confirm) {
      setPasswordMessage("New password and confirm password do not match.");
      return;
    }
    updateAdminProfile({ password: passwordDraft.next });
    setPasswordDraft({ old: "", next: "", confirm: "" });
    setPasswordMessage("Password changed successfully.");
    runAction("Admin password updated", `${selectedProfile.name} changed their password after old password verification.`);
  };

  const updateAdminPhoto = (file) => {
    fileToDataUrl(file, (profilePhoto) => {
      updateAdminProfile({ profilePhoto });
      runAction("Admin photo updated", `${selectedProfile.name} uploaded a new profile photo.`);
    });
  };

  const mutateRows = (kind, target, action) => {
    const targetKey = target.id || target.name || target.user || target.type;
    const updater = (row) => {
      const rowKey = row.id || row.name || row.user || row.type;
      if (rowKey !== targetKey) return row;
      if (action === "approve") {
        if (kind === "claims") return { ...row, status: "Approved", officer: selectedProfile.name, progress: 7, timeline: [...(row.timeline || []), { at: new Date().toISOString(), label: "Claim approved" }] };
        if (kind === "documents") return { ...row, status: "Approved" };
        if (kind === "policies") return { ...row, state: "Active" };
        if (kind === "support") return { ...row, status: "Resolved" };
        return { ...row, status: "Active" };
      }
      return row;
    };
    const remove = (row) => (row.id || row.name || row.user || row.type) !== targetKey;
    const setter = {
      users: setCustomerRows,
      claims: setClaimRows,
      requirements: setRequirementRows,
      documents: setDocumentRows,
      policies: setPlanRows,
    }[kind];

    const updateRows = (rows) => (action === "delete" ? rows.filter(remove) : rows.map(updater));
    if (kind === "claims") {
      updateClaimRows(
        updateRows,
        action === "delete" ? "Claim removed" : "Claim approved",
        targetKey,
        `${targetKey} was ${action === "delete" ? "removed" : "approved"} by ${selectedProfile.name}.`,
      );
    } else {
      setter(updateRows);
      addAudit(
        action === "delete" ? "Record removed" : "Record approved",
        targetKey,
        `${targetKey} was ${action === "delete" ? "removed" : "approved"} by ${selectedProfile.name}.`,
      );
    }
    runAction(
      action === "delete" ? "Deleted" : "Approved",
      `${targetKey} was ${action === "delete" ? "removed" : "approved"} by ${selectedProfile.name}.`,
    );
  };

  const respondToClaim = (claim) => {
    const message = `Dear ${claim.user}, your ${claim.policy} claim ${claim.id} is under review. Please keep your policy number, hospital bills, identity proof, and bank details ready.`;
    updateClaimRows(
      (rows) => rows.map((row) => (row.id === claim.id ? { ...row, status: "Pending", officer: selectedProfile.name, response: message, timeline: [...(row.timeline || []), { at: new Date().toISOString(), label: "Admin response sent" }] } : row)),
      "Claim response sent",
      claim.id,
      message,
    );
    runAction("Response sent to user", {
      claimId: claim.id,
      user: claim.user,
      response: message,
    });
  };

  const rejectClaimForMissingDetails = (claim) => {
    const missing = [];
    if (!claim.amount) missing.push("Claim amount");
    if (!claim.policy) missing.push("Policy type");
    if (claim.status === "Documents") missing.push("Required documents");
    const reason = missing.length ? `Missing details: ${missing.join(", ")}` : "Rejected after verification due to incomplete claim evidence";
    updateClaimRows(
      (rows) => rows.map((row) => (row.id === claim.id ? { ...row, status: "Rejected", officer: selectedProfile.name, rejectionReason: reason, progress: 7, timeline: [...(row.timeline || []), { at: new Date().toISOString(), label: "Claim rejected" }] } : row)),
      "Claim rejected",
      claim.id,
      reason,
    );
    runAction("Claim rejected", {
      claimId: claim.id,
      user: claim.user,
      reason,
      responseToUser: "Your claim was rejected because required details are missing. Please resubmit with complete documents.",
    });
  };

  const actionButtons = (target, kind) => (
    <div className="flex gap-1">
      <ActionButton
        icon={Eye}
        label="View"
        onClick={() =>
          runAction(
            `Viewing ${target.id || target.name || target.user}`,
            kind === "users" ? readUserActivity(target, claimRows) : target,
            kind === "users" ? target.profilePhoto : "",
          )
        }
      />
      <ActionButton
        icon={Edit3}
        label="Edit"
        onClick={() =>
          kind === "claims" || kind === "documents"
            ? openMarkupEditor(target, kind === "claims" ? "claim" : "document")
            : runAction("Edit started", `${selectedProfile.name} is editing ${target.id || target.name || target.user}.`)
        }
      />
      <ActionButton icon={CheckCircle2} label="Approve" onClick={() => mutateRows(kind, target, "approve")} />
      <ActionButton icon={Trash2} label="Delete" onClick={() => mutateRows(kind, target, "delete")} />
    </div>
  );

  const claimTabs = [
    { id: "pending", label: "Pending Claims", count: claimRows.filter((claim) => !["Approved", "Rejected"].includes(claim.status)).length },
    { id: "accepted", label: "Accepted Claims", count: claimRows.filter((claim) => claim.status === "Approved").length },
    { id: "rejected", label: "Rejected Claims", count: claimRows.filter((claim) => claim.status === "Rejected").length },
    { id: "all", label: "All Claims", count: claimRows.length },
  ];

  const visibleClaimRows = claimRows.filter((claim) => {
    if (claimFilter === "accepted") return claim.status === "Approved";
    if (claimFilter === "rejected") return claim.status === "Rejected";
    if (claimFilter === "pending") return !["Approved", "Rejected"].includes(claim.status);
    return true;
  });

  const updateSystemSetting = (group, key, value) => {
    setSystemSettings((settings) => {
      const next = {
        ...settings,
        [group]: {
          ...settings[group],
          [key]: value,
        },
      };
      saveSystemSettings(next);
      return next;
    });
    addAudit("System setting updated", `${group}.${key}`, String(value));
    runAction("Setting saved", `${group}.${key} updated to ${String(value)}.`);
  };

  const clearAuditLogs = () => {
    setAuditLogs([]);
    saveAuditLogs([]);
    runAction("Audit logs cleared", `${selectedProfile.name} cleared the local audit log view.`);
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-xs font-black text-blue-700">
              <ShieldCheck size={16} />
              Centralized admin control
            </div>
            <h1 className="mt-4 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">Insurance Admin Dashboard</h1>
            <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-slate-600">
              Manage users, policies, claims, queries, requirements, document verification, notifications, reports, and operations from one console.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-black text-slate-950">Current Admin Profile</div>
                <div className="mt-1 text-xs font-semibold text-slate-500">{selectedProfile.access}</div>
              </div>
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-blue-600 text-sm font-black text-white">{selectedProfile.initials}</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-bold text-slate-600">
              {["Email / Username", "Password", "Remember Me", "Forgot Password", "OTP 2FA"].map((label) => (
                <div key={label} className="rounded-lg border border-slate-200 bg-white px-3 py-2">{label}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7">
        {dashboardMetrics.map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.label} onClick={() => openPage(item.page)} className="rounded-lg border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-start justify-between gap-3">
                <span className={`grid h-10 w-10 place-items-center rounded-lg ${item.tone} text-white`}>
                  <Icon size={18} />
                </span>
                <span className="rounded-lg bg-slate-100 px-2 py-1 text-[11px] font-black text-slate-600">{item.change}</span>
              </div>
              <div className="mt-4 text-xs font-bold uppercase tracking-wide text-slate-500">{item.label}</div>
              <div className="mt-1 text-xl font-black text-slate-950">{item.value}</div>
            </button>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <SectionTitle icon={PieChart} title="Claims Status Overview" />
          <div className="mt-5 grid gap-5 sm:grid-cols-[180px_1fr]">
            <div className="relative mx-auto aspect-square w-40 rounded-full" style={{ background: "conic-gradient(#2563eb 0 42%, #10b981 42% 70%, #ef4444 70% 84%, #f59e0b 84% 100%)" }}>
              <div className="absolute inset-6 grid place-items-center rounded-full bg-white text-center">
                <span className="text-2xl font-black">6.1K</span>
                <span className="-mt-3 text-[11px] font-bold text-slate-500">claims</span>
              </div>
            </div>
            <div className="space-y-3">
              {[["Pending", "42%", "bg-blue-600"], ["Approved", "28%", "bg-emerald-500"], ["Rejected", "14%", "bg-rose-500"], ["Verification", "16%", "bg-amber-500"]].map(([label, value, color]) => (
                <button key={label} onClick={() => openPage("claims")} className="flex w-full items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold hover:bg-slate-50">
                  <span className="flex items-center gap-2"><span className={`h-3 w-3 rounded-sm ${color}`} />{label}</span>
                  <span>{value}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <SectionTitle icon={LineChart} title="Monthly Policy Sales" />
          <div className="mt-5"><MiniBars values={[44, 58, 52, 70, 66, 78, 91, 86, 94, 82, 96, 88]} /></div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <SectionTitle icon={Users} title="User Registration Trends" />
          <div className="mt-5"><LineSpark values={[120, 160, 142, 188, 220, 234, 251, 290, 310, 348, 390, 426]} color="#0f766e" /></div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <SectionTitle icon={BarChart3} title="Claim Settlement Ratio" />
          <div className="mt-5 grid grid-cols-3 gap-3">
            {[["Settled", "78%", "text-emerald-700"], ["In SLA", "91%", "text-blue-700"], ["Escalated", "6%", "text-rose-700"]].map(([label, value, color]) => (
              <button key={label} onClick={() => openPage("reports")} className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-center hover:bg-white">
                <div className={`text-2xl font-black ${color}`}>{value}</div>
                <div className="mt-1 text-xs font-bold text-slate-500">{label}</div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );

  const renderPage = () => {
    if (activePage === "dashboard") return renderDashboard();
    if (activePage === "users") {
      return (
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <SectionTitle
            icon={Users}
            title="User Management"
            action={
              <div className="flex flex-wrap gap-2">
                <button onClick={refreshRealUsers} className="cursor-pointer rounded-lg border border-slate-200 px-3 py-2 text-sm font-black text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700">Refresh Real Users</button>
                <button onClick={createCustomer} className="cursor-pointer rounded-lg bg-blue-600 px-3 py-2 text-sm font-black text-white transition hover:bg-blue-700">Create User</button>
              </div>
            }
          />
          <div className="mt-4 rounded-lg bg-blue-50 px-4 py-3 text-sm font-bold text-blue-800">
            Showing real app profiles from registration/login storage. Active users: {activeUsers}.
          </div>
          <DataTable columns={["id", "name", "email", "phone", "policies", "status", "city"]} rows={customerRows} renderActions={(row) => actionButtons(row, "users")} />
        </section>
      );
    }
    if (activePage === "claims") {
      return (
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <SectionTitle
            icon={ClipboardCheck}
            title="Claims Management"
            action={
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    const latestClaims = readClaims();
                    setClaimRows(latestClaims);
                    runAction("Claims refreshed", `${latestClaims.length} claims loaded from the customer claim store.`);
                  }}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-black text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                >
                  Refresh Claims
                </button>
                <button onClick={createClaim} className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-black text-white transition hover:bg-blue-700"><Plus size={16} />Create Claim</button>
              </div>
            }
          />
          <div className="mt-5 flex flex-wrap gap-2">
            {claimTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setClaimFilter(tab.id)}
                className={`rounded-lg border px-3 py-2 text-sm font-black transition ${claimFilter === tab.id ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"}`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
          <DataTable columns={["id", "user", "policy", "amount", "status", "officer"]} rows={visibleClaimRows} renderActions={(row) => (
            <div className="flex flex-wrap gap-1">
              {actionButtons(row, "claims")}
              <button onClick={() => respondToClaim(row)} className="rounded-lg border border-slate-200 px-2 py-2 text-xs font-black text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700">
                Respond
              </button>
              <button onClick={() => rejectClaimForMissingDetails(row)} className="rounded-lg border border-rose-200 px-2 py-2 text-xs font-black text-rose-700 transition hover:bg-rose-50">
                Reject Missing
              </button>
            </div>
          )} />
          <div className="mt-5 grid gap-2 sm:grid-cols-3 xl:grid-cols-6">
            {claimSteps.map((step, index) => (
              <button key={step} onClick={() => runAction("Claim workflow", step)} className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-left hover:bg-white">
                <div className="text-xs font-black text-blue-700">Step {index + 1}</div>
                <div className="mt-1 text-sm font-bold text-slate-700">{step}</div>
              </button>
            ))}
          </div>
        </section>
      );
    }
    if (activePage === "requirements") {
      return (
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <SectionTitle icon={BadgeCheck} title="Requirement Management" action={<button onClick={createRequirement} className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-black text-white transition hover:bg-blue-700"><Plus size={16} />Create Requirement</button>} />
          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {requirementRows.map((req) => (
              <article key={req.user} className="rounded-lg border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-black">{req.user}</div>
                    <div className="mt-1 text-xs font-semibold text-slate-500">Age {req.age} - {req.budget} - {req.coverage}</div>
                  </div>
                  <span className={`rounded-lg px-2 py-1 text-xs font-black ring-1 ${statusClass(req.status)}`}>{req.status}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["Suggest Policies", "Generate Quotes", "Approve", "Delete"].map((action) => (
                    <button key={action} onClick={() => action === "Approve" ? mutateRows("requirements", req, "approve") : action === "Delete" ? mutateRows("requirements", req, "delete") : runAction(action, `${action} for ${req.user}.`)} className="cursor-pointer rounded-lg border border-slate-200 px-3 py-2 text-xs font-black transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700">{action}</button>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      );
    }
    if (activePage === "support") {
      // ADMIN SUPPORT CENTER - Real-time chat with users
      // Features:
      // - View all user support chats from dashboard contact page
      // - Reply to specific user queries
      // - Mark chats as resolved
      // - Automatic persistence to localStorage
      //
      // Chat data is synced between user and admin interfaces
      // User sends message → stored in STORAGE_SUPPORT_CHATS
      // Admin views the same chat → can reply
      // User sees admin reply → visible in their chat thread

      const handleReplyToChat = () => {
        if (!selectedChat || !adminReply.trim()) return;

        // Create admin response message with timestamp
        const nextMessage = {
          id: uid("msg"),
          from: "admin",
          sender: selectedProfile.name,
          text: adminReply,
          createdAt: new Date().toISOString(),
        };

        const nextChats = supportChats.map((chat) =>
          chat.id === selectedChat.id
            ? { ...chat, messages: [...chat.messages, nextMessage], updatedAt: new Date().toISOString() }
            : chat,
        );

        setSupportChats(nextChats);
        saveSupportChats(nextChats);
        setSelectedChat({ ...selectedChat, messages: [...selectedChat.messages, nextMessage] });
        setAdminReply("");
        runAction("Reply sent", `Admin response sent to ${selectedChat.userName}.`);
      };

      const resolveChat = () => {
        if (!selectedChat) return;
        const nextChats = supportChats.map((chat) =>
          chat.id === selectedChat.id ? { ...chat, status: "Resolved", updatedAt: new Date().toISOString() } : chat,
        );
        setSupportChats(nextChats);
        saveSupportChats(nextChats);
        setSelectedChat(null);
        runAction("Chat resolved", `Support ticket for ${selectedChat.userName} marked as resolved.`);
      };

      return (
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <SectionTitle icon={Headphones} title="Support Center - User Chats" />
          <div className="mt-5 grid gap-4 xl:grid-cols-[300px_1fr]">
            {/* Chat List */}
            <div className="max-h-[600px] space-y-2 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-4">
              {supportChats.length === 0 ? (
                <div className="text-sm font-semibold text-slate-500">No support chats yet.</div>
              ) : (
                supportChats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => {
                      setSelectedChat(chat);
                      runAction(`Viewing chat: ${chat.id}`, {
                        user: chat.userName,
                        email: chat.userEmail,
                        subject: chat.subject,
                        status: chat.status,
                        messages: `${chat.messages.length} messages`,
                      });
                    }}
                    className={`w-full rounded-lg border p-3 text-left transition ${
                      selectedChat?.id === chat.id
                        ? "border-blue-400 bg-blue-50"
                        : "border-slate-200 bg-white hover:border-blue-300"
                    }`}
                  >
                    <div className="text-sm font-bold text-slate-900">{chat.userName}</div>
                    <div className="text-xs text-slate-500">{chat.subject}</div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className={`rounded px-2 py-1 text-xs font-bold ${statusClass(chat.status)}`}>
                        {chat.status}
                      </span>
                      <span className="text-xs text-slate-500">{chat.messages.length} msg</span>
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Chat Detail */}
            <div className="rounded-lg border border-slate-200">
              {!selectedChat ? (
                <div className="flex h-[600px] items-center justify-center text-slate-500">
                  <p>Select a chat to view messages</p>
                </div>
              ) : (
                <div className="flex h-[600px] flex-col">
                  {/* Header */}
                  <div className="border-b border-slate-200 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-bold text-slate-900">{selectedChat.userName}</div>
                        <div className="text-xs text-slate-500">{selectedChat.userEmail}</div>
                        <div className="mt-1 text-xs font-semibold text-slate-600">{selectedChat.subject}</div>
                      </div>
                      <span className={`rounded-lg px-3 py-1 text-xs font-bold ${statusClass(selectedChat.status)}`}>
                        {selectedChat.status}
                      </span>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 space-y-3 overflow-y-auto p-4">
                    {selectedChat.messages.map((msg) => (
                      <div key={msg.id}>
                        <div className="text-xs font-bold uppercase text-slate-500">{msg.sender}</div>
                        <div
                          className={`mt-1 rounded-lg px-4 py-3 text-sm font-semibold ${
                            msg.from === "admin"
                              ? "bg-blue-50 text-blue-900"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Reply Area */}
                  {selectedChat.status !== "Resolved" && (
                    <div className="border-t border-slate-200 p-4 space-y-3">
                      <input
                        value={adminReply}
                        onChange={(e) => setAdminReply(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleReplyToChat()}
                        placeholder="Type your reply..."
                        className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-blue-500"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleReplyToChat}
                          className="flex-1 inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-black text-white transition hover:bg-blue-700"
                        >
                          <Send size={16} />
                          Send Reply
                        </button>
                        <button
                          onClick={resolveChat}
                          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-black text-white transition hover:bg-emerald-700"
                        >
                          <CheckCircle2 size={16} />
                          Resolve
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      );
    }
    if (activePage === "policies") {
      return (
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <SectionTitle icon={FileText} title="Policy Management" action={<button onClick={createPlan} className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-black text-white transition hover:bg-blue-700"><Plus size={16} />Create Plan</button>} />
          <DataTable columns={["name", "type", "coverage", "premium", "duration", "state"]} rows={planRows} renderActions={(row) => actionButtons(row, "policies")} />
        </section>
      );
    }
    if (activePage === "documents") {
      return (
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <SectionTitle icon={ShieldCheck} title="Document Verification" />
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {documentRows.map((doc) => (
              <article key={`${doc.type}-${doc.owner}`} className="rounded-lg border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-black">{doc.type}</div>
                    <div className="mt-1 text-sm font-semibold text-slate-500">{doc.owner}</div>
                  </div>
                  <span className={`rounded-lg px-2 py-1 text-xs font-black ring-1 ${statusClass(doc.status)}`}>{doc.status}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["View", "Edit", "Approve", "Reject", "Request Re-upload"].map((action) => (
                    <button
                      key={action}
                      onClick={() =>
                        action === "Approve"
                          ? mutateRows("documents", doc, "approve")
                          : action === "Reject"
                            ? mutateRows("documents", doc, "delete")
                            : action === "Edit"
                              ? openMarkupEditor(doc, "document")
                              : runAction(`${action} document`, `${action} selected for ${doc.type}.`)
                      }
                      className="cursor-pointer rounded-lg border border-slate-200 px-3 py-2 text-xs font-black transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
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
    }
    if (activePage === "notifications") {
      return (
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <SectionTitle icon={Bell} title="Notification Center" />
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {["Policy Expiry", "Claim Status", "Payment Reminder", "New Offers"].map((type) => (
              <button key={type} onClick={() => runAction("Notification template", `${type} notification template selected.`)} className="rounded-lg border border-slate-200 p-4 text-left font-black hover:bg-slate-50">{type}</button>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {["Email", "SMS", "Push Notifications"].map((channel) => (
              <button key={channel} onClick={() => runAction("Channel selected", `${channel} channel enabled.`)} className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-black text-blue-700">{channel}</button>
            ))}
            <button onClick={() => runAction("Notification sent", "Selected notification has been queued.")} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-black text-white"><Send size={15} />Send</button>
          </div>
        </section>
      );
    }
    if (activePage === "reports") {
      return (
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <SectionTitle icon={BarChart3} title="Reports & Analytics" />
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {reportTemplates.map((report) => (
              <article key={report.id} className="rounded-lg border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-black text-slate-950">{report.title}</div>
                    <div className="mt-1 text-xs font-semibold text-slate-500">{report.category} - {report.pages} pages</div>
                  </div>
                  <span className={`rounded-lg px-2 py-1 text-xs font-black ring-1 ${statusClass(report.status)}`}>{report.status}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button onClick={() => runAction("Report opened", report)} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-black hover:bg-slate-50">View</button>
                  <button onClick={() => openMarkupEditor(report, "report")} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-black hover:bg-slate-50"><Edit3 size={14} />Edit</button>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {["PDF", "Excel", "CSV"].map((format) => (
              <button key={format} onClick={() => runAction("Export ready", `${format} export generated.`)} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-black hover:bg-slate-50"><Download size={15} />{format}</button>
            ))}
          </div>
        </section>
      );
    }
    if (activePage === "audit") {
      return (
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <SectionTitle
            icon={History}
            title="Audit Logs"
            action={<button onClick={clearAuditLogs} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-black text-slate-700 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700">Clear Logs</button>}
          />
          <div className="mt-5 overflow-hidden rounded-lg border border-slate-200">
            <div className="grid grid-cols-[170px_160px_160px_1fr] gap-3 bg-slate-50 px-4 py-3 text-xs font-black uppercase tracking-wide text-slate-500">
              <div>Time</div>
              <div>Admin</div>
              <div>Action</div>
              <div>Details</div>
            </div>
            <div className="max-h-[560px] overflow-auto">
              {auditLogs.length ? auditLogs.map((log) => (
                <div key={log.id} className="grid grid-cols-[170px_160px_160px_1fr] gap-3 border-t border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">
                  <div>{new Date(log.at).toLocaleString()}</div>
                  <div>{log.admin}<div className="text-xs text-slate-500">{log.role}</div></div>
                  <div className="font-black text-slate-950">{log.action}</div>
                  <div>{log.target}<pre className="mt-1 whitespace-pre-wrap text-xs text-slate-500">{log.details}</pre></div>
                </div>
              )) : (
                <div className="border-t border-slate-200 px-4 py-8 text-center text-sm font-bold text-slate-500">No audit entries yet.</div>
              )}
            </div>
          </div>
        </section>
      );
    }
    if (activePage === "editor") {
      const marks = draftMark ? [...editorMarks, draftMark] : editorMarks;
      const previewRows = [
        ["Record", editorTarget?.title || "Selected report"],
        ["Owner", editorTarget?.owner || editorTarget?.user || "Admin review"],
        ["Type", editorTarget?.category || editorTarget?.policy || editorTarget?.type || "Report"],
        ["Status", editorTarget?.status || "Review"],
        ["Reviewer", selectedProfile.name],
      ];

      return (
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <SectionTitle
            icon={Edit3}
            title="Report Markup Editor"
            action={
              <div className="flex flex-wrap gap-2">
                <button onClick={() => openPage(editorTarget?.editorType === "document" ? "documents" : editorTarget?.editorType === "claim" ? "claims" : "reports")} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-black text-slate-700 hover:bg-slate-50"><ArrowLeft size={16} />Back</button>
                <button onClick={saveMarkupEditor} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-black text-white hover:bg-blue-700"><Save size={16} />Save Marks</button>
              </div>
            }
          />

          <div className="mt-5 grid gap-5 xl:grid-cols-[260px_1fr]">
            <aside className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm font-black text-slate-950">Tools</div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button onClick={() => setEditorTool("pen")} className={`inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-3 text-sm font-black ${editorTool === "pen" ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 bg-white text-slate-700"}`}><Edit3 size={16} />Pen</button>
                <button onClick={() => setEditorTool("eraser")} className={`inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-3 text-sm font-black ${editorTool === "eraser" ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 bg-white text-slate-700"}`}><Eraser size={16} />Eraser</button>
              </div>
              <div className="mt-5 text-xs font-black uppercase tracking-wide text-slate-500">Colour</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {["#dc2626", "#2563eb", "#16a34a", "#f59e0b", "#111827"].map((color) => (
                  <button
                    key={color}
                    onClick={() => setEditorColor(color)}
                    className={`h-9 w-9 rounded-lg border-2 ${editorColor === color ? "border-slate-950" : "border-white"} shadow-sm ring-1 ring-slate-200`}
                    style={{ backgroundColor: color }}
                    aria-label={`Use ${color}`}
                  />
                ))}
              </div>
              <button onClick={() => setEditorMarks((marks) => marks.slice(0, -1))} className="mt-5 w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm font-black text-slate-700 hover:bg-slate-100">Undo Last Mark</button>
              <button onClick={() => setEditorMarks([])} className="mt-2 w-full rounded-lg border border-rose-200 bg-white px-3 py-3 text-sm font-black text-rose-700 hover:bg-rose-50">Clear Marks</button>
              <div className="mt-4 rounded-lg bg-white p-3 text-xs font-semibold leading-5 text-slate-500">
                Pen draws over the report preview. Eraser removes the latest mark when you click the page.
              </div>
            </aside>

            <div className="min-w-0 rounded-lg border border-slate-200 bg-slate-100 p-4">
              <div className="relative mx-auto aspect-[4/5] max-w-3xl overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-slate-200">
                <div className="absolute inset-0 p-8">
                  <div className="flex items-start justify-between gap-6 border-b border-slate-200 pb-5">
                    <div>
                      <div className="text-xs font-black uppercase tracking-wide text-blue-700">InsurTech Admin Review</div>
                      <h2 className="mt-2 text-2xl font-black text-slate-950">{editorTarget?.title || "Report"}</h2>
                      <p className="mt-2 text-sm font-semibold text-slate-500">Administrative correction copy for claim, document, and report verification.</p>
                    </div>
                    <div className="rounded-lg bg-blue-50 px-4 py-3 text-right text-xs font-black text-blue-700">Marked by<br />{selectedProfile.name}</div>
                  </div>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {previewRows.map(([label, value]) => (
                      <div key={label} className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                        <div className="text-[11px] font-black uppercase tracking-wide text-slate-500">{label}</div>
                        <div className="mt-1 text-sm font-black text-slate-800">{value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 space-y-3">
                    {["Customer details verified against submitted proof.", "Policy terms reviewed for coverage and exclusions.", "Evidence section checked for missing or incorrect values.", "Final admin correction notes are saved with this marked copy."].map((line, index) => (
                      <div key={line} className="flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600">
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-slate-900 text-xs font-black text-white">{index + 1}</span>
                        {line}
                      </div>
                    ))}
                  </div>
                </div>
                <svg
                  className="absolute inset-0 h-full w-full touch-none"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  onPointerDown={startMarkup}
                  onPointerMove={continueMarkup}
                  onPointerUp={finishMarkup}
                  onPointerLeave={finishMarkup}
                >
                  {marks.map((mark) => (
                    <polyline
                      key={mark.id}
                      fill="none"
                      stroke={mark.color}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.3"
                      points={mark.points.map((point) => `${point.x},${point.y}`).join(" ")}
                    />
                  ))}
                </svg>
              </div>
            </div>
          </div>
        </section>
      );
    }
    if (activePage === "profile") {
      return (
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <SectionTitle icon={UserCog} title="Admin Profile" />
          <div className="mt-5 grid gap-5 xl:grid-cols-[360px_1fr]">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
              {selectedProfile.profilePhoto ? (
                <img src={selectedProfile.profilePhoto} alt={selectedProfile.name} className="h-20 w-20 rounded-lg object-cover" />
              ) : (
                <span className="grid h-20 w-20 place-items-center rounded-lg bg-blue-600 text-lg font-black text-white">{selectedProfile.initials}</span>
              )}
              <div className="mt-4 text-xl font-black text-slate-950">{selectedProfile.name}</div>
              <div className="mt-1 text-sm font-bold text-slate-500">{selectedProfile.role}</div>
              <div className="mt-4 rounded-lg bg-white p-3 text-sm font-semibold text-slate-600">{selectedProfile.access}</div>
              <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700">
                Upload Photo
                <input type="file" accept="image/*" className="hidden" onChange={(event) => updateAdminPhoto(event.target.files?.[0])} />
              </label>
            </div>

            <div className="space-y-5">
              <div className="rounded-lg border border-slate-200 p-5">
                <div className="text-sm font-black text-slate-950">Edit Admin Details</div>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="text-xs font-black uppercase tracking-wide text-slate-500">Admin Name</span>
                    <input
                      className="mt-2 h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-blue-500"
                      value={adminNameDraft}
                      onChange={(event) => setAdminNameDraft(event.target.value)}
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-black uppercase tracking-wide text-slate-500">Unique Admin ID</span>
                    <input
                      className="mt-2 h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-blue-500"
                      value={selectedProfile.adminId}
                      onChange={(event) => updateAdminProfile({ adminId: event.target.value })}
                    />
                  </label>
                </div>
                <button onClick={saveAdminName} className="mt-4 rounded-lg bg-blue-600 px-4 py-3 text-sm font-black text-white transition hover:bg-blue-700">
                  Save Profile
                </button>
              </div>

              <div className="rounded-lg border border-slate-200 p-5">
                <div className="text-sm font-black text-slate-950">Change Password</div>
                <div className="mt-1 text-xs font-semibold text-slate-500">Enter old password, new password, and confirm password.</div>
                <div className="mt-5 grid gap-4 md:grid-cols-3">
                <label className="block">
                  <span className="text-xs font-black uppercase tracking-wide text-slate-500">Old Password</span>
                  <input
                    className="mt-2 h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-blue-500"
                    type={showAdminProfilePassword ? "text" : "password"}
                    value={passwordDraft.old}
                    onChange={(event) => setPasswordDraft((draft) => ({ ...draft, old: event.target.value }))}
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-black uppercase tracking-wide text-slate-500">New Password</span>
                  <input
                    className="mt-2 h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-blue-500"
                    type={showAdminProfilePassword ? "text" : "password"}
                    value={passwordDraft.next}
                    onChange={(event) => setPasswordDraft((draft) => ({ ...draft, next: event.target.value }))}
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-black uppercase tracking-wide text-slate-500">Confirm Password</span>
                  <input
                    className="mt-2 h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-blue-500"
                    type={showAdminProfilePassword ? "text" : "password"}
                    value={passwordDraft.confirm}
                    onChange={(event) => setPasswordDraft((draft) => ({ ...draft, confirm: event.target.value }))}
                  />
                </label>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button type="button" onClick={() => setShowAdminProfilePassword((value) => !value)} className="rounded-lg border border-slate-200 px-4 py-3 text-sm font-black text-blue-700 hover:bg-blue-50">
                    {showAdminProfilePassword ? "Hide Passwords" : "Show Passwords"}
                  </button>
                  <button onClick={saveAdminPassword} className="rounded-lg bg-blue-600 px-4 py-3 text-sm font-black text-white transition hover:bg-blue-700">
                    Change Password
                  </button>
                </div>
                {passwordMessage && <div className="mt-4 rounded-lg bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700">{passwordMessage}</div>}
              </div>
            </div>
          </div>
        </section>
      );
    }
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <SectionTitle icon={Settings} title="System Settings" />
        <div className="mt-5">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input className="h-12 w-full rounded-lg border border-slate-200 bg-white pl-11 pr-4 text-sm font-semibold outline-none focus:border-blue-500" placeholder="Search settings..." />
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {adminSettingCards.map((card) => {
              const Icon = card.icon;
              return (
                <button
                  key={card.id}
                  onClick={() => runAction(card.title, card.description)}
                  className="group flex min-h-24 items-center gap-4 rounded-lg border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                >
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-blue-600 text-white transition group-hover:bg-blue-700">
                    <Icon size={25} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-base font-black text-slate-900">{card.title}</span>
                    <span className="mt-1 block text-sm font-semibold leading-5 text-slate-500">{card.description}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 grid gap-5 xl:grid-cols-2">
          {Object.entries(systemSettings).map(([group, values]) => (
            <div key={group} className="rounded-lg border border-slate-200 p-5">
              <div className="text-sm font-black capitalize text-slate-950">{group} Settings</div>
              <div className="mt-4 space-y-4">
                {Object.entries(values).map(([key, value]) => {
                  const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase());
                  if (typeof value === "boolean") {
                    return (
                      <label key={key} className="flex items-center justify-between gap-4 rounded-lg bg-slate-50 px-4 py-3">
                        <span className="text-sm font-bold text-slate-700">{label}</span>
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(event) => updateSystemSetting(group, key, event.target.checked)}
                          className="h-5 w-5 rounded border-slate-300"
                        />
                      </label>
                    );
                  }
                  return (
                    <label key={key} className="block">
                      <span className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</span>
                      <input
                        className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-bold outline-none focus:border-blue-500"
                        type={typeof value === "number" ? "number" : "text"}
                        value={value}
                        onChange={(event) => updateSystemSetting(group, key, typeof value === "number" ? Number(event.target.value) : event.target.value)}
                      />
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  if (!isAuthenticated) {
    return (
      <AdminLogin
        adminProfiles={adminProfiles}
        selectedProfile={selectedProfile}
        setSelectedProfile={setSelectedProfile}
        onLogin={() => {
          setIsAuthenticated(true);
          setActivePage("dashboard");
          setAdminNameDraft(selectedProfile.name);
          setDetail({ title: "Login successful", body: `${selectedProfile.name} signed in as ${selectedProfile.role}.`, photo: selectedProfile.profilePhoto || "" });
          addAudit("Admin login", selectedProfile.adminId, `${selectedProfile.name} signed in as ${selectedProfile.role}.`);
        }}
      />
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-slate-100 text-slate-900">
      <div className="flex h-full min-h-0">
        <AdminSidebar
          collapsed={sidebarCollapsed}
          allowedNav={allowedNav}
          activePage={activePage}
          selectedProfile={selectedProfile}
          openPage={openPage}
          onLogout={() => setIsAuthenticated(false)}
          onToggleCollapsed={() => setSidebarCollapsed((value) => !value)}
        />

        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button className="absolute inset-0 bg-slate-950/50" aria-label="Close menu" onClick={() => setMobileOpen(false)} />
            <div className="relative h-full">
              <AdminSidebar
                mobile
                allowedNav={allowedNav}
                activePage={activePage}
                selectedProfile={selectedProfile}
                openPage={openPage}
                onLogout={() => setIsAuthenticated(false)}
                onToggleCollapsed={() => setMobileOpen(false)}
              />
              <button className="absolute right-4 top-4 rounded-lg bg-white p-2 text-slate-700 shadow" aria-label="Close menu" onClick={() => setMobileOpen(false)}>
                <X size={18} />
              </button>
            </div>
          </div>
        )}

        <main className="flex min-w-0 flex-1 flex-col">
          <header className="shrink-0 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:px-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <button className="rounded-lg border border-slate-200 p-2 lg:hidden" aria-label="Open menu" onClick={() => setMobileOpen(true)}>
                  <Menu size={20} />
                </button>
                <div className="min-w-0">
                  <div className="truncate text-xs font-black uppercase tracking-wide text-slate-500">{pageTitles[activePage]}</div>
                  <div className="truncate text-lg font-black text-slate-950">{selectedProfile.role} Workspace</div>
                </div>
              </div>

              <div className="hidden min-w-0 flex-1 justify-center px-4 md:flex">
                <div className="relative w-full max-w-xl">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm font-medium outline-none focus:border-blue-500" placeholder="Search users, claims, tickets, policies..." />
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <button onClick={() => openPage("notifications")} className="grid h-11 w-11 place-items-center rounded-lg border border-slate-200 bg-white text-slate-700" aria-label="Notifications">
                  <Bell size={18} />
                </button>
                <button onClick={() => openPage("profile")} className="hidden h-11 cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 sm:inline-flex">
                  {selectedProfile.profilePhoto ? (
                    <img src={selectedProfile.profilePhoto} alt={selectedProfile.name} className="h-8 w-8 rounded-lg object-cover" />
                  ) : (
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-600 text-xs font-black text-white">{selectedProfile.initials}</span>
                  )}
                  {selectedProfile.name.split(" ")[0]}
                </button>
              </div>
            </div>
          </header>

          <div className="grid min-h-0 flex-1 xl:grid-cols-[minmax(0,1fr)_340px]">
            <section className="scrollbar-none min-h-0 overflow-y-auto p-4 sm:p-6">
              {renderPage()}
            </section>

            <aside className="hidden min-h-0 overflow-y-auto border-l border-slate-200 bg-white p-5 xl:block">
              <div className="sticky top-0 bg-white pb-4">
                <div className="text-sm font-black text-slate-950">Activity Details</div>
                <div className="mt-1 text-xs font-semibold text-slate-500">Latest selected record and action</div>
              </div>

              <div className="space-y-5">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    {selectedProfile.profilePhoto ? (
                      <img src={selectedProfile.profilePhoto} alt={selectedProfile.name} className="h-11 w-11 rounded-lg object-cover" />
                    ) : (
                      <span className="grid h-11 w-11 place-items-center rounded-lg bg-blue-600 text-sm font-black text-white">{selectedProfile.initials}</span>
                    )}
                    <div className="min-w-0">
                      <div className="truncate text-sm font-black">{selectedProfile.name}</div>
                      <div className="truncate text-xs font-semibold text-slate-500">{selectedProfile.role}</div>
                    </div>
                  </div>
                  <div className="mt-3 text-xs font-semibold leading-5 text-slate-600">{selectedProfile.access}</div>
                </div>

                <div className="rounded-lg border border-slate-200 p-4">
                  <div className="text-sm font-black text-slate-950">{detail.title}</div>
                  {detail.photo && <img src={detail.photo} alt={detail.title} className="mt-3 h-24 w-24 rounded-lg object-cover" />}
                  <pre className="mt-3 whitespace-pre-wrap rounded-lg bg-slate-950 p-3 text-xs font-semibold leading-5 text-slate-100">{detail.body}</pre>
                </div>

                <div className="rounded-lg border border-slate-200 p-4">
                  <div className="text-sm font-black text-slate-950">Operations Queue</div>
                  <div className="mt-3 space-y-2 text-sm font-bold text-slate-700">
                    <button onClick={() => openPage("documents")} className="flex w-full justify-between rounded-lg bg-slate-50 px-3 py-3 text-left hover:bg-slate-100"><span>Pending verifications</span><span>{documentRows.filter(d => d.status === "Pending").length}</span></button>
                    <button onClick={() => openPage("claims")} className="flex w-full justify-between rounded-lg bg-slate-50 px-3 py-3 text-left hover:bg-slate-100"><span>Pending claims</span><span>{claimRows.filter(c => !["Approved", "Rejected"].includes(c.status)).length}</span></button>
                    <button onClick={() => openPage("support")} className="flex w-full justify-between rounded-lg bg-slate-50 px-3 py-3 text-left hover:bg-slate-100"><span>Open support chats</span><span>{supportChats.filter(s => s.status !== "Resolved").length}</span></button>
                    <button onClick={() => openPage("requirements")} className="flex w-full justify-between rounded-lg bg-slate-50 px-3 py-3 text-left hover:bg-slate-100"><span>Quotes requested</span><span>{requirementRows.length}</span></button>
                  </div>
                </div>

                <div className="rounded-lg border border-slate-200 p-4">
                  <div className="text-sm font-black text-slate-950">Quick Actions</div>
                  <div className="mt-3 grid gap-2">
                    {[
                      ["Create plan", "policies"],
                      ["Send reminder", "notifications"],
                      ["Export claims", "reports"],
                      ["Open audit logs", "audit"],
                    ].map(([label, page]) => (
                      <button key={label} onClick={() => openPage(page)} className="rounded-lg border border-slate-200 px-3 py-2 text-left text-xs font-black hover:bg-slate-50">{label}</button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
