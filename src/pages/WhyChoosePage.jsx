import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { whyChooseFeatures } from "../components/ChoiceUS";

const detailCopy = {
  "ai-fraud-detection": {
    headline: "Smarter claim checks before problems reach your desk.",
    points: ["AI-assisted document screening", "Suspicious pattern alerts", "Faster claim review decisions"],
  },
  "customer-support": {
    headline: "Help is available whenever customers need it.",
    points: ["Human and AI-assisted support", "Dashboard contact history", "Quick response tracking"],
  },
  "fast-claim-processing": {
    headline: "Move claims from upload to review with less waiting.",
    points: ["Simple claim submission", "Admin review workflow", "Status updates for every stage"],
  },
  "smart-policy-tracking": {
    headline: "All policy activity stays organized in one place.",
    points: ["Policy dashboard", "Renewal reminders", "Downloadable policy records"],
  },
  "advanced-security": {
    headline: "User data and admin access stay protected.",
    points: ["OTP verified accounts", "Role-aware admin tools", "Secure local document handling"],
  },
  "ai-voice-assistant": {
    headline: "Customers can get guided answers faster.",
    points: ["Conversational support", "Insurance topic guidance", "Quick navigation help"],
  },
};

const WhyChoosePage = () => {
  const { featureSlug } = useParams();
  const feature = whyChooseFeatures.find((item) => item.slug === featureSlug) || whyChooseFeatures[0];
  const details = detailCopy[feature.slug];

  return (
    <main className="bg-white">
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
        <Link to="/" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">
          <ArrowLeft size={16} />
          Back Home
        </Link>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
              <ShieldCheck size={17} />
              Why Choose Agile Insurance
            </div>
            <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">{feature.title}</h1>
            <p className="mt-5 max-w-2xl text-lg font-medium leading-8 text-slate-600">{feature.desc}</p>
            <p className="mt-5 max-w-2xl text-base font-semibold leading-7 text-slate-700">{details.headline}</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {details.points.map((point) => (
                <div key={point} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <CheckCircle2 className="text-emerald-600" size={22} />
                  <div className="mt-3 text-sm font-black text-slate-800">{point}</div>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-lg border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
            <div className="grid h-16 w-16 place-items-center rounded-lg bg-white/10 text-3xl">{feature.icon}</div>
            <div className="mt-6 flex items-center gap-2 text-sm font-bold text-blue-200">
              <Sparkles size={17} />
              Built into the insurance portal
            </div>
            <div className="mt-3 text-2xl font-black">{feature.title}</div>
            <p className="mt-3 text-sm font-semibold leading-6 text-white/70">
              This feature connects customer actions, dashboard records, and admin review tools so work moves clearly from request to resolution.
            </p>
            <Link to="/auth" className="mt-6 inline-flex w-full justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-black text-white hover:bg-blue-700">
              Create Account
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default WhyChoosePage;
