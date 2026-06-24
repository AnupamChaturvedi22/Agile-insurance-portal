import {
  ShieldAlert,
  RefreshCw,
  Clock,
  Shield,
  Lock,
  Activity,
  ArrowLeft,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function MaintenancePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen overflow-hidden bg-slate-50 text-slate-900 relative">

      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute left-[-200px] top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-blue-100 blur-3xl" />
        <div className="absolute right-[-200px] top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-cyan-100 blur-3xl" />
      </div>

      {/* Decorative Waves */}
      <div className="absolute bottom-0 left-0 h-64 w-full opacity-20">
        <div className="h-full w-full bg-gradient-to-r from-blue-200 via-cyan-100 to-blue-200 blur-2xl" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-4xl rounded-[32px] border border-slate-200 bg-white p-10 shadow-2xl">

          <button
            onClick={() => {
              if (window.history.length > 1) {
                navigate(-1);
              } else {
                navigate("/");
              }
            }}
            className="mb-6 inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          {/* Logo */}
          <div className="mb-10 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
              <ShieldAlert size={34} className="text-blue-600" />
            </div>

            <div>
              <h2 className="text-3xl font-black">
                Agile <span className="text-blue-600">Insurance</span>
              </h2>
              {/* <p className="text-sm font-medium text-slate-500">
                Admin Portal
              </p> */}
            </div>
          </div>

          {/* Center Illustration */}
          <div className="flex justify-center">
            <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-blue-50 border border-blue-100 shadow-lg">
              <ShieldAlert size={60} className="text-blue-600" />
            </div>
          </div>

          {/* Content */}
          <div className="mt-8 text-center">

            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-5 py-2 text-sm font-bold text-blue-700">
              <Clock size={16} />
              Scheduled Maintenance
            </span>

            <h1 className="mt-6 text-5xl font-black tracking-tight text-slate-900">
              We'll Be Back Soon!
            </h1>

            <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-blue-600" />

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Agile Insurance Portal is currently undergoing maintenance and
              system improvements to provide a faster, more secure and reliable
              experience.
            </p>

            <p className="mt-3 text-blue-600 font-semibold">
              Thank you for your patience and understanding.
            </p>

            {/* Downtime Card */}
            <div className="mx-auto mt-10 flex max-w-2xl flex-col items-center justify-between gap-5 rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm md:flex-row">

              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-blue-100 p-3">
                  <Clock size={28} className="text-blue-600" />
                </div>

                <div className="text-left">
                  <div className="text-sm font-semibold text-slate-500">
                    Estimated Downtime
                  </div>
                  <div className="text-2xl font-black text-slate-900">
                    30 - 60 Minutes
                  </div>
                </div>
              </div>

              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700"
              >
                <RefreshCw size={18} />
                Refresh Page
              </button>
            </div>

            {/* Stats */}
            <div className="mt-12 grid gap-5 md:grid-cols-3">

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-3 flex justify-center">
                  <Shield className="text-blue-600" size={34} />
                </div>

                <div className="text-3xl font-black text-blue-600">
                  99.9%
                </div>

                <div className="mt-2 text-sm text-slate-500">
                  Platform Reliability
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-3 flex justify-center">
                  <Activity className="text-blue-600" size={34} />
                </div>

                <div className="text-3xl font-black text-blue-600">
                  24/7
                </div>

                <div className="mt-2 text-sm text-slate-500">
                  Security Monitoring
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-3 flex justify-center">
                  <Lock className="text-blue-600" size={34} />
                </div>

                <div className="text-3xl font-black text-blue-600">
                  Secure
                </div>

                <div className="mt-2 text-sm text-slate-500">
                  Data Protection
                </div>
              </div>

            </div>

            {/* Footer */}
            <p className="mt-12 text-sm text-slate-400">
              © 2026 Agile Insurance Portal. All rights reserved.
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}