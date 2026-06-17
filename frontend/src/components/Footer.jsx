import { motion } from 'framer-motion';
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import {
  Plus,
  ShieldCheck
} from "lucide-react";
import { useState, useEffect } from "react";
import { apiRequest } from "../utils/api";
import {
  FaFacebook,
  FaYoutube,
  FaLinkedin,
  FaTwitter
} from "react-icons/fa";

// Footer component - site-wide footer with navigation, trust indicators, and legal info
// Contains 4 main navigation sections, payment methods, security badge, and social links
const Footer = () => {
  const [pageSettings, setPageSettings] = useState(null);
  // Footer navigation structure
  // EDIT HERE: Add, remove, or modify footer sections and links
  // Format: { title: "Section Name", links: [{ label: "Link Text", to: "/route" }], hasIcon: true/false }
  // hasIcon shows a "+" icon before each link for visual consistency
  const sections = [
  {
    title: "Insurance",
    links: [
      pageSettings?.generalInsurancePage && { label: "General Insurance", to: "/general-insurance" },
      pageSettings?.lifeInsurancePage && { label: "Life Insurance", to: "/life-insurance" },
      pageSettings?.termInsurancePage && { label: "Term Insurance", to: "/term-insurance" },
      pageSettings?.investmentPage && { label: "Investment", to: "/investment" },
      pageSettings?.healthInsurancePage && { label: "Health Insurance", to: "/health-insurance" },
      pageSettings?.otherInsurancePage && { label: "Other Insurance", to: "/other-insurance" },
    ].filter(Boolean),
    hasIcon: true,
  },

  {
  title: "Calculators",
  links: [
    pageSettings?.premiumCalculator && {
      label: "Insurance Premium Calculator",
      to: "/calculator?type=premium",
    },

    pageSettings?.termCalculator && {
      label: "Term Insurance Calculator",
      to: "/calculator?type=term",
    },

    pageSettings?.emiCalculator && {
      label: "EMI Calculator",
      to: "/calculator?type=emi",
    },

    pageSettings?.carCalculator && {
      label: "Car Insurance Calculator",
      to: "/calculator?type=car",
    },
  ].filter(Boolean),

  hasIcon: true,
},

  {
    title: "Resources",
    links: [
      pageSettings?.articlesPage && { label: "Articles", to: "/articles" },
      pageSettings?.reviewsPage && { label: "Customer reviews", to: "/reviews" },
      pageSettings?.companiesPage && { label: "Insurance companies", to: "/companies" },
      pageSettings?.newsroomPage && { label: "Newsroom", to: "/newsroom" },
      pageSettings?.awardsPage && { label: "Awards", to: "/awards" },
    ].filter(Boolean),
  },

  {
    title: "Agile Claim",
    links: [
      pageSettings?.aboutPage && { label: "About Us", to: "/about-us" },
      pageSettings?.careersPage && { label: "Careers", to: "/careers" },
      pageSettings?.legalPoliciesPage && { label: "Legal & Admin policies", to: "/legal-policies" },
      pageSettings?.contactPage && { label: "Contact us", to: "/contact" },
    ].filter(Boolean),
  },
];


  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, staggerChildren: 0.1 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

useEffect(() => {
  const loadSettings = async () => {
    try {
      const res = await apiRequest("/api/admin/settings");
      setPageSettings(res.data.pages);
    } catch (err) {
      console.error(err);
    }
  };

  loadSettings();
}, []);


if (!pageSettings) {
  return <footer>Loading...</footer>;
}


  return (
    <footer className="bg-[#051024] text-gray-400 px-4 py-8 sm:px-6 sm:py-10 lg:px-24 font-sans border-t rounded-t-3xl border-slate-800">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="container mx-auto"
      >
        {/* TOP SECTION: LINKS */}
        <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 md:grid-cols-4 md:gap-8 md:mb-10">
          {sections.map((section, idx) => (
            <div key={idx}>
              <h4 className="text-white font-semibold mb-4 text-base">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, lIdx) => (
                  <motion.li
                    key={lIdx}
                    variants={itemVariants}
                    whileHover={{ x: 5, color: "#fff" }}
                    className="flex items-center gap-2 cursor-pointer transition-colors text-sm"
                  >
                    {section.hasIcon && <Plus size={14} className="text-gray-500" />}
                    {typeof link === "string" ? (
                      <a href={`#${link.replace(/\s+/g, '-').toLowerCase()}`} className="cursor-pointer hover:text-white transition-colors">{link}</a>
                    ) : (
                      <Link to={link.to} className="cursor-pointer hover:text-white transition-colors">{link.label}</Link>
                    )}
                  </motion.li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      {/* MIDDLE SECTION: TRUST BAR */}
      <div className="bg-[#0a192f] border border-slate-800 rounded-xl p-4 sm:p-5 mb-8 flex flex-col lg:flex-row justify-between items-center gap-5">

        {/* Payment method names and logos can be changed in src/assets/assets.js and the labels below. */}
        {/* Payment Methods */}
        <div className="text-center lg:text-left">
          <p className="text-xs font-bold uppercase tracking-widest mb-4 text-slate-500">
            Payment Methods
          </p>

          <div className="flex flex-wrap justify-center lg:justify-start gap-4 items-center">

            {/* GPay */}
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm hover:scale-105 transition-all duration-300">
              <img
                src={assets.Gpay}
                alt="GPay"
                className="w-14 object-contain"
              />
            </div>

            {/* Visa */}
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm hover:scale-105 transition-all duration-300">
              <img
                src={assets.Visa}
                alt="Visa"
                className="w-14 object-contain"
              />
            </div>

            {/* Mastercard */}
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm hover:scale-105 transition-all duration-300">
              <img
                src={assets.MastercardLogo}
                alt="Mastercard"
                className="w-14 object-contain"
              />
            </div>

            {/* Paytm */}
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm hover:scale-105 transition-all duration-300">
              <img
                src={assets.PaytmLogo}
                alt="Paytm"
                className="w-14 object-contain"
              />
            </div>

          </div>
        </div>

  {/* Security badge text/certification label. */}
  {/* Secured With */}
  <div className="flex flex-col items-center border-x-0 lg:border-x border-slate-700 px-0 lg:px-10">
    <p className="text-xs font-bold uppercase tracking-widest mb-4 text-slate-500">
      Secured With
    </p>

    <div className="flex items-center gap-2 bg-slate-800/50 p-2 rounded border border-green-500/30">
      <ShieldCheck className="text-green-500" size={20} />
      <span className="text-[10px] text-white font-bold">
        PCI DSS Certified
      </span>
    </div>
  </div>

  {/* Replace "#" href values below with real social profile URLs. */}
  {/* Social Icons */}
  <div className="text-center lg:text-right">
    <p className="text-xs font-bold uppercase tracking-widest mb-4 text-slate-500">
      Follow us on
    </p>

    <div className="flex gap-4">
      {[
        { Icon: FaFacebook, url: "https://www.facebook.com" },
        { Icon: FaYoutube, url: "https://www.youtube.com" },
        { Icon: FaLinkedin, url: "https://www.linkedin.com" },
        { Icon: FaTwitter, url: "https://www.twitter.com" }
      ].map(({ Icon, url }, index) => (
        <motion.a
          key={index}
          whileHover={{ y: -5, backgroundColor: "#1e293b" }}
          href={url}
          target="_blank"
          rel="noreferrer"
          className="bg-slate-800 p-3 rounded-lg text-white transition-colors cursor-pointer hover:text-blue-400"
        >
          <Icon size={18} />
        </motion.a>
      ))}
    </div>
  </div>
</div>
        {/* Legal company name, registration, contact, and disclaimer copy live in this block. */}
        {/* BOTTOM SECTION: DISCLAIMER */}
        <div className="space-y-3 text-[10px] leading-relaxed text-slate-500 max-w-6xl mx-auto">
          <div className="flex gap-2">
            <div className="min-w-[8px] h-[8px] rounded-full bg-slate-700 mt-1"></div>
            <p>
              <span className="text-slate-300 font-medium">Agile Claim App Insurance Brokers Private Limited</span> 
              CIN: U74999HR2014PTC053454 Registered Office - Plot No. 119, Sector - 44, Gurugram - 122001, Haryana Tel no. : 0124-4218302 Email ID: care@agileclaim.com
            </p>
          </div>
          <div className="flex gap-2">
            <div className="min-w-[8px] h-[8px] rounded-full bg-slate-700 mt-1"></div>
            <p>Agile Claim is registered as a Composite Broker | Registration No. 742, Registration Code No. IRDA/ DB 797/ 19, Valid till 09/06/2027, License category- Composite Broker</p>
          </div>
          <div className="flex gap-2">
            <div className="min-w-[8px] h-[8px] rounded-full bg-slate-700 mt-1"></div>
            <p>Visitors are hereby informed that their information submitted on the website may be shared with insurers. Product information is authentic and solely based on the information received from the insurers.</p>
          </div>
          <p className="font-bold text-slate-400 mt-6 text-center lg:text-left">
            BEWARE OF SPURIOUS PHONE CALLS AND FICTITIOUS / FRAUDULENT OFFERS
          </p>
          <p className="text-center lg:text-left">
            IRDAI or its officials do not involve in activities like selling insurance policies, announcing bonus or investment of premiums. Public receiving such phone calls are requested to lodge a police complaint.
          </p>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
