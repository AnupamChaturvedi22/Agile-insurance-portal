// src/components/layout/AdminHeader.jsx
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Bell, Home, Menu, Search } from "lucide-react";
import { pageTitles } from "../../../utils/helpers";

const AdminHeader = ({ onMenuOpen, onNavigate }) => {
  const navigate = useNavigate();

  const { selectedProfile } = useSelector((s) => s.auth);
  const { activePage } = useSelector((s) => s.ui);

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <header className="shrink-0 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:px-6">
      <div className="flex items-center justify-between gap-3">
        {/* Left Section */}
        <div className="flex min-w-0 items-center gap-3">
          <button
            className="rounded-lg border border-slate-200 p-2 lg:hidden"
            onClick={onMenuOpen}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          <div className="min-w-0">
            <div className="truncate text-xs font-black uppercase tracking-wide text-slate-500">
              {pageTitles[activePage]}
            </div>

            <div className="truncate text-lg font-black text-slate-950">
              {selectedProfile.role} Workspace
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="hidden min-w-0 flex-1 justify-center px-4 md:flex">
          <div className="relative w-full max-w-xl">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />

            <input
              className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm font-medium outline-none focus:border-blue-500"
              placeholder="Search users, claims, tickets, policies..."
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex shrink-0 items-center gap-2">
          {/* Home Button */}
          <button
            onClick={handleGoHome}
            className="hidden h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 sm:inline-flex"
            aria-label="Go to Home"
          >
            <Home size={18} />
            Home
          </button>

          {/* Notifications */}
          <button
            onClick={() => onNavigate("notifications")}
            className="grid h-11 w-11 place-items-center rounded-lg border border-slate-200 bg-white text-slate-700"
            aria-label="Notifications"
          >
            <Bell size={18} />
          </button>

          {/* Profile */}
          <button
            onClick={() => onNavigate("profile")}
            className="hidden h-11 cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 sm:inline-flex"
          >
            {selectedProfile.profilePhoto ? (
              <img
                src={selectedProfile.profilePhoto}
                alt={selectedProfile.name}
                className="h-8 w-8 rounded-lg object-cover"
              />
            ) : (
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-600 text-xs font-black text-white">
                {selectedProfile.initials}
              </span>
            )}

            {selectedProfile.name?.split(" ")[0]}
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;