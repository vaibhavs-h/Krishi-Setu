"use client";

import { useTheme } from "@/context/ThemeContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

interface Scheme {
  id: string;
  name: string;
  description: string;
  icon: string;
  gradient: string;
  deadline: string;
  maxBenefit: string;
  fullBenefits: string;
  eligibility: string;
  requiredDocs: string;
  category: string;
  targetCrops: string[];
  maxLand: number;
  maxIncome: number;
  usersApplied: number;
  rating?: string;
  match?: number;
  matchReason?: string;
  applyUrl: string;
}

interface Application {
  id: string;
  name: string;
  ref: string;
  date: string;
  benefit: string;
  status: "IN REVIEW" | "APPROVED" | "REJECTED";
  icon: string;
  colorClass: string;
}

const INITIAL_APPLICATIONS: Application[] = [];

export default function SchemesPage() {
  const { theme } = useTheme();
  const [supabase] = useState(() => createClient());
  const [isClient, setIsClient] = useState(false);

  // Filters State
  const [crop, setCrop] = useState("Wheat");
  const [land, setLand] = useState(12);
  const [incomeIndex, setIncomeIndex] = useState(1); // 0: <2L, 1: 2-5L, 2: 5-10L, 3: >10L
  const incomeValues = [1.5, 3.5, 7.5, 15]; // representative values in Lakhs

  // App State
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [applications, setApplications] = useState<Application[]>(INITIAL_APPLICATIONS);
  const [isMatching, setIsMatching] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);

  // Official apply URLs for major schemes (keyed by partial title match)
  const SCHEME_URLS: Record<string, string> = {
    "PM-KISAN": "https://pmkisan.gov.in",
    "PMFBY": "https://pmfby.gov.in",
    "PM-KUSUM": "https://mnre.gov.in/solar/schemes",
    "PKVY": "https://pgsindia-ncof.gov.in",
    "Agriculture Infrastructure Fund": "https://agriinfra.dac.gov.in",
    "NFSM": "https://nfsm.gov.in",
    "SMAM": "https://agrimachinery.nic.in",
    "PM Kisan MaanDhan": "https://maandhan.in",
    "Soil Health Card": "https://soilhealth.dac.gov.in",
    "eNAM": "https://enam.gov.in",
    "Kisan Credit Card": "https://www.nabard.org/content1.aspx?id=572",
    "ACABC": "https://manage.gov.in/acabc.asp",
    "RKVY": "https://rkvy.nic.in",
    "PM FME": "https://mofpi.gov.in/pmfme",
    "PMMSY": "https://pmmsy.dof.gov.in",
    "National Bamboo": "https://nbm.nic.in",
    "Horticulture Cluster": "https://midh.gov.in",
    "NHM": "https://midh.gov.in",
    "Van Dhan": "https://trifed.tribal.gov.in",
    "Rythu Bandhu": "https://rythubandhu.telangana.gov.in",
    "Krishak Bandhu": "https://krishakbandhu.net",
    "KALIA": "https://kalia.co.in",
    "Paramparagat": "https://pgsindia-ncof.gov.in",
    "Meri Fasal": "https://fasal.haryana.gov.in",
    "eUparjan": "https://mpeuparjan.nic.in",
    "IKHEDUT": "https://ikhedut.gujarat.gov.in",
    "Shetkari": "https://agri.maharashtra.gov.in",
    "PM-AASHA": "https://agmarknet.gov.in",
    "Gopinath Munde": "https://agri.maharashtra.gov.in",
    "YSR Rythu": "https://rythubharosa.ap.gov.in",
    "Mukhyamantri Kisan Kalyan": "https://saara.mp.gov.in",
    "Rajiv Gandhi Kisan": "https://rgkny.cg.nic.in",
    "Mukhyamantri Krishak": "https://upagripardarshi.gov.in",
    "default": "https://dbt.gov.in"
  };

  const getApplyUrl = (schemeName: string): string => {
    for (const [key, url] of Object.entries(SCHEME_URLS)) {
      if (schemeName.toLowerCase().includes(key.toLowerCase())) return url;
    }
    return SCHEME_URLS.default;
  };

  // Hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch Profile Data
  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('crops')
          .eq('id', session.user.id)
          .single();

        if (profile?.crops && profile.crops.length > 0) {
          setCrop(profile.crops[0]);
        }
      }
      runMatcher(); // initial run
    };
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  const runMatcher = async () => {
    setIsMatching(true);

    // Slight artificial delay to show the nice animation and "feel" algorithmic
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const incomeVal = incomeValues[incomeIndex] * 100000; // Convert to raw INR

      // 1. Fetch ALL schemes from the database (or we could pre-filter by state if desired)
      const { data, error } = await supabase.from('schemes').select('*');
      if (error) throw error;

      if (data && data.length > 0) {
        // 2. Send Profile and DB data to our Gemini API Route
        const response = await fetch('/api/match-schemes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            profile: { crop, land, incomeVal },
            schemes: data
          })
        });

        if (!response.ok) {
          console.error("Gemini API Error:", await response.text());
          throw new Error("Failed to process AI Match");
        }

        const { matches } = await response.json();

        // 3. Map the AI matches back over the original structured DB data for UI attributes
        const enrichedSchemes = matches.map((match: any) => {
          const s = data.find(dbScheme => dbScheme.id === match.id);
          if (!s) return null;

          const gradients = ["from-emerald-400 to-green-600", "from-blue-400 to-cyan-500", "from-purple-500 to-indigo-600", "from-orange-400 to-red-500"];
          const icons = ["eco", "water_drop", "solar_power", "grass", "agriculture", "warehouse"];
          const randomGradient = gradients[Math.abs(s.title.length) % gradients.length];
          const randomIcon = icons[Math.abs(s.title.length) % icons.length];

          let shortBenefit = s.benefits;
          if (shortBenefit && shortBenefit.length > 50) shortBenefit = shortBenefit.substring(0, 47) + "...";

          return {
            id: s.id,
            name: s.title,
            description: s.description,
            icon: randomIcon,
            gradient: randomGradient,
            deadline: s.deadline ? new Date(s.deadline).toLocaleDateString("en-US", { month: "short", day: "2-digit" }) : "N/A",
            maxBenefit: shortBenefit || "N/A",
            fullBenefits: s.benefits || "See official website for benefit details.",
            eligibility: s.eligibility_criteria || "See official website for eligibility details.",
            requiredDocs: s.required_documents || "Aadhaar, Land Record, Bank Account",
            category: s.category || "General",
            targetCrops: s.target_crops || [],
            maxLand: s.max_land_area || 999,
            maxIncome: s.max_income || 9999999,
            usersApplied: Math.floor(s.title.length * 10) + 50,
            rating: `${(Math.min(5, 4.2 + (s.title.length % 8) / 10)).toFixed(1)}/5`,
            match: match.matchScore,
            matchReason: match.matchReason,
            applyUrl: getApplyUrl(s.title)
          }
        }).filter(Boolean);

        setSchemes(enrichedSchemes);
      }
    } catch (error) {
      console.error("Error running matcher against Supabase:", error);
    } finally {
      setIsMatching(false);
    }
  };

  const handleApply = (scheme: Scheme) => {
    const newApp: Application = {
      id: `${scheme.id}_${Date.now()}`,
      name: scheme.name,
      ref: `#APP-${Math.floor(Math.random() * 90000) + 10000}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      benefit: scheme.maxBenefit,
      status: "IN REVIEW",
      icon: scheme.icon,
      colorClass: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"
    };

    setApplications(prev => [newApp, ...prev]);
  };

  if (!isClient) return null;

  return (
    <ProtectedRoute>
      <div className={theme === "dark" ? "dark" : ""}>
        <div className="bg-[#f3f4f6] dark:bg-[#0f1110] text-gray-800 dark:text-gray-200 font-sans antialiased min-h-screen relative overflow-x-hidden selection:bg-[#6ee7b7] selection:text-black">
          <style jsx global>{`
          .glass-panel {
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          .glow-badge {
            box-shadow: 0 0 15px rgba(57, 255, 20, 0.3);
          }
          .font-display {
            font-family: 'Space Grotesk', sans-serif;
          }
          .grid-bg {
            background-size: 40px 40px;
            background-image:
              linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          }
        `}</style>

          <div className="fixed inset-0 z-0">
            <img
              alt="Golden wheat field at sunrise"
              className="w-full h-full object-cover opacity-40 transition-opacity duration-700"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyqqgvDwY3DiUlQpMrJonrI0xYT1ufkIsbqmm1pxWOmv3C9urkFRsAg4N7QJQEJnWhWUfk7sO3VOEUindtx9W5egYMUJ04KUoU9SamYF-bx5-dvdQQPPwNtdhd24hbFYfKwALxqmoDVxtRB7EBVMydqX3vxYgVG1Wn-3PL1Dyzd4RnIyUmfN0iQ_ebMap_h7VALr78tyxGLO_mlb1sn6HDCw8QN6PkvaJ2IDl_0LjQ_READU3-lRUB2i5j3C3dMRO0wdT7f2wD_HY"
            />
            <div className="absolute inset-0 bg-white/50 dark:bg-[#0f1110]/80 transition-colors duration-700"></div>
            <div className="absolute inset-0 grid-bg pointer-events-none opacity-20"></div>
          </div>

          <div className="relative z-10 flex flex-col min-h-screen">
            <Header />

            <main className="flex-grow w-full max-w-[1400px] mx-auto px-8 pb-12 pt-4 relative z-10">
              <div className="mb-10 text-center md:text-left flex flex-col md:flex-row justify-between items-end">
                <div>
                  <h1 className="font-sans text-4xl md:text-5xl font-extrabold text-gray-950 dark:text-white tracking-tighter mb-2"><span className="text-emerald-700 dark:text-[#6ee7b7]">Scheme</span> Matcher</h1>
                  <p className="text-gray-900 dark:text-gray-300 max-w-2xl text-sm md:text-base tracking-wide font-medium">Find government subsidies perfectly tailored to your farm profile.</p>
                </div>
                <div className="hidden md:block">
                  <span className="text-xs font-mono text-emerald-600 dark:text-[#6ee7b7] bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                    ALGORITHMIC MATCHING v2.0
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* ---------------- FILTER SIDEBAR ---------------- */}
                <div className="lg:col-span-4 flex flex-col space-y-6">
                  <div className="glass-panel bg-white/80 dark:bg-[rgba(30,41,35,0.4)] p-6 rounded-2xl h-full flex flex-col border border-slate-200 dark:border-white/10 shadow-xl">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-gray-950 dark:text-gray-400 font-bold">Farm Profile</h2>
                      <span className="material-icons-round text-emerald-700 dark:text-[#6ee7b7]">tune</span>
                    </div>
                    <div className="space-y-6 flex-grow">
                      <div>
                        <label className="block text-xs font-bold text-gray-900 dark:text-gray-300 mb-2 uppercase tracking-wide">Primary Crop Focus</label>
                        <select
                          className="w-full bg-white/50 dark:bg-black/20 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none cursor-pointer"
                          value={crop}
                          onChange={(e) => setCrop(e.target.value)}
                        >
                          <option value="Wheat">Wheat</option>
                          <option value="Rice">Rice</option>
                          <option value="Sugarcane">Sugarcane</option>
                          <option value="Cotton">Cotton</option>
                          <option value="Soybean">Soybean</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-900 dark:text-gray-300 mb-2 uppercase tracking-wide">
                          Land Holding <span className="text-emerald-600 dark:text-[#6ee7b7]">({land} Acres)</span>
                        </label>
                        <div className="relative">
                          <input
                            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            max="50" min="1" type="range"
                            value={land}
                            onChange={(e) => setLand(Number(e.target.value))}
                          />
                          <div className="flex justify-between text-xs text-gray-950 dark:text-gray-500 mt-2 font-mono font-bold">
                            <span>1 Ac</span>
                            <span>50+ Ac</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-900 dark:text-gray-300 mb-2 uppercase tracking-wide">Annual Income</label>
                        <div className="grid grid-cols-2 gap-3">
                          {["< ₹2L", "₹2L - ₹5L", "₹5L - ₹10L", "> ₹10L"].map((label, idx) => (
                            <button
                              key={label}
                              onClick={() => setIncomeIndex(idx)}
                              className={`px-4 py-2 rounded-lg text-sm font-medium text-center transition-all ${incomeIndex === idx ? 'border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 shadow-md shadow-emerald-500/20' : 'border border-gray-300 dark:border-gray-700 hover:border-emerald-400 text-gray-600 dark:text-gray-400'}`}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={runMatcher}
                      disabled={isMatching}
                      className={`w-full mt-8 py-3 rounded-xl shadow-lg transition-all font-medium flex justify-center items-center gap-2 group ${isMatching ? 'bg-gray-300 dark:bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/30'}`}
                    >
                      {isMatching ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-500 border-t-white"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <span className="material-icons-round group-hover:animate-spin-slow">auto_awesome</span>
                          Run AI Matcher
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* ---------------- SCHEMES LIST ---------------- */}
                <div className="lg:col-span-8 flex flex-col space-y-6 relative min-h-[400px]">
                  {isMatching && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/20 dark:bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl">
                      <span className="material-icons-round text-5xl text-emerald-500 animate-pulse mb-4">memory</span>
                      <h3 className="text-xl font-bold font-display text-gray-900 dark:text-white tracking-widest uppercase glow-badge rounded-md">Analyzing Subsidies...</h3>
                    </div>
                  )}

                  {schemes.map((scheme, index) => (
                    <div key={scheme.id} className={`glass-panel bg-white/90 dark:bg-[rgba(30,41,35,0.4)] p-6 rounded-2xl relative overflow-hidden group hover:border-emerald-500/50 transition-all duration-500 shadow-xl ${(isMatching || (scheme.match && scheme.match < 40)) ? 'opacity-60' : 'opacity-100 hover:scale-[1.01]'}`}>
                      <div className="absolute top-0 right-0 p-4">
                        <span className={`inline-flex items-center gap-1 border px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${index === 0 ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-[#6ee7b7] border-emerald-200 dark:border-emerald-500/30 glow-badge' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700'}`}>
                          {index === 0 && <span className="material-icons-round text-sm">verified</span>}
                          {scheme.match}% Match
                        </span>
                      </div>
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-shrink-0">
                          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${scheme.gradient} flex items-center justify-center text-white shadow-lg`}>
                            <span className="material-icons-round text-3xl">{scheme.icon}</span>
                          </div>
                        </div>
                        <div className="flex-grow pr-16 md:pr-24">
                          <h3 className="text-xl font-display font-bold text-gray-950 dark:text-white mb-2">{scheme.name}</h3>
                          <p className="text-sm text-gray-900 dark:text-gray-300 mb-4 leading-relaxed font-medium">
                            {scheme.description}
                          </p>
                          {scheme.matchReason && (
                            <div className="mb-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/50 rounded-xl p-3 flex gap-3">
                              <span className="material-icons-round text-emerald-600 dark:text-[#6ee7b7] text-lg mt-0.5">auto_awesome</span>
                              <p className="text-xs text-emerald-800 dark:text-emerald-300 font-medium leading-relaxed">
                                {scheme.matchReason}
                              </p>
                            </div>
                          )}
                          <div className="flex flex-wrap gap-4 mb-4">
                            <div className="flex items-center gap-2 text-xs text-gray-900 dark:text-gray-400 bg-gray-100 dark:bg-white/5 px-3 py-1.5 rounded-lg font-bold">
                              <span className="material-icons-round text-sm text-emerald-600 dark:text-emerald-400">schedule</span> Deadline: {scheme.deadline}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-900 dark:text-gray-400 bg-gray-100 dark:bg-white/5 px-3 py-1.5 rounded-lg font-bold">
                              <span className="material-icons-round text-sm text-emerald-600 dark:text-emerald-400">attach_money</span> Max Benefit: {scheme.maxBenefit}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-4">
                          <div className="flex -space-x-2">
                            <div className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 bg-gray-300 flex items-center justify-center text-[10px] font-bold">DK</div>
                            <div className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 bg-gray-400 flex items-center justify-center text-[10px] font-bold">RJ</div>
                            <div className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">+{scheme.usersApplied}</div>
                          </div>
                          {scheme.rating && (
                            <div className="hidden sm:flex items-center gap-1">
                              <span className="material-icons-round text-yellow-500 text-sm">star</span>
                              <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{scheme.rating}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                          <button
                            onClick={() => setSelectedScheme(scheme)}
                            className="text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-[#6ee7b7] hover:underline transition-colors flex-grow text-center"
                          >
                            Details
                          </button>
                          <a
                            href={scheme.applyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-5 py-2 rounded-xl text-sm font-bold bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-[#6ee7b7] dark:hover:bg-emerald-800/60 transition-all border border-emerald-200 dark:border-emerald-800 flex-grow text-center flex items-center justify-center gap-1"
                          >
                            Apply Online <span className="material-icons-round text-xs">open_in_new</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ---------------- RECENT APPLICATIONS TABLE ---------------- */}
                <div className="lg:col-span-12 mt-4">
                  <div className="glass-panel bg-white/80 dark:bg-[rgba(30,41,35,0.4)] p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-gray-950 dark:text-gray-400 font-bold">Recent Applications</h2>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="text-xs text-gray-950 dark:text-gray-400 border-b border-gray-300 dark:border-gray-700/50 font-bold">
                            <th className="font-normal py-3 pl-2">Scheme Name</th>
                            <th className="font-normal py-3">Reference ID</th>
                            <th className="font-normal py-3">Applied On</th>
                            <th className="font-normal py-3 text-right">Potential Benefit</th>
                            <th className="font-normal py-3 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm">
                          {applications.map(app => (
                            <tr key={app.id} className="group hover:bg-white/50 dark:hover:bg-white/5 transition-colors border-b border-gray-100 dark:border-gray-800/50 last:border-0">
                              <td className="py-3 pr-4 pl-2 font-medium text-gray-800 dark:text-gray-200 flex items-center gap-3">
                                <div className={`p-1.5 rounded ${app.colorClass}`}>
                                  <span className="material-icons-round text-sm">{app.icon}</span>
                                </div>
                                {app.name}
                              </td>
                              <td className="py-3 text-gray-950 dark:text-gray-400 font-mono text-xs font-bold">{app.ref}</td>
                              <td className="py-3 text-gray-950 dark:text-gray-400 font-bold">{app.date}</td>
                              <td className="py-3 text-right font-mono text-gray-800 dark:text-gray-200 font-medium">{app.benefit}</td>
                              <td className="py-3 text-center">
                                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${app.status === 'APPROVED' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                                  app.status === 'REJECTED' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                                    'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                                  }`}>
                                  {app.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </main>

            <footer className="fixed bottom-0 w-full z-50 glass-panel bg-white/80 dark:bg-[rgba(20,20,20,0.65)] border-t border-black/5 dark:border-white/10 py-1.5 px-8 backdrop-blur-lg mt-auto">
              <div className="max-w-[1400px] mx-auto flex justify-between items-center text-[10px] uppercase tracking-wider text-gray-800 dark:text-gray-400 font-mono font-bold">
                <div className="flex items-center space-x-4 mb-2 md:mb-0">
                  <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse"></span> System Online</span>
                  <span>Version 1.0.1</span>
                </div>
                <div>© 2026 TechVerse Builders. All Rights Reserved.</div>
              </div>
            </footer>
          </div>
        </div>
      </div>

      {/* ── Scheme Details Slide-Over Drawer ──────────────────────────── */}
      {selectedScheme && (
        <div className="fixed inset-0 z-50 flex justify-end" role="dialog">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedScheme(null)} />
          <div className="relative w-full max-w-lg h-full bg-white dark:bg-[#111a14] shadow-2xl flex flex-col overflow-y-auto border-l border-gray-200 dark:border-white/10">
            <div className={`bg-gradient-to-br ${selectedScheme.gradient} p-6 text-white flex-shrink-0`}>
              <div className="flex items-start justify-between mb-4">
                <span className="text-xs font-mono font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">{selectedScheme.category}</span>
                <button onClick={() => setSelectedScheme(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                  <span className="material-icons-round text-lg">close</span>
                </button>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                  <span className="material-icons-round text-3xl">{selectedScheme.icon}</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold leading-tight">{selectedScheme.name}</h2>
                  <p className="text-sm text-white/80 mt-1">Deadline: {selectedScheme.deadline}</p>
                </div>
              </div>
              {selectedScheme.match && (
                <div className="mt-4 bg-white/20 rounded-xl px-4 py-2 flex items-center gap-2">
                  <span className="material-icons-round text-sm">auto_awesome</span>
                  <span className="text-sm font-bold">{selectedScheme.match}% AI Match</span>
                </div>
              )}
            </div>
            <div className="flex-grow p-6 space-y-6 overflow-y-auto">
              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">About this Scheme</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{selectedScheme.description}</p>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/50 rounded-xl p-4">
                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 mb-2 flex items-center gap-1">
                  <span className="material-icons-round text-sm">payments</span> Benefits
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">{selectedScheme.fullBenefits}</p>
              </div>
              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-1">
                  <span className="material-icons-round text-sm">checklist</span> Eligibility Criteria
                </h3>
                <ol className="space-y-2">
                  {selectedScheme.eligibility.split(/\d+\./).filter(Boolean).map((point, i) => (
                    <li key={i} className="flex gap-3 text-sm text-gray-700 dark:text-gray-300">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-xs font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                      <span className="leading-relaxed">{point.trim()}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 rounded-xl p-4">
                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400 mb-2 flex items-center gap-1">
                  <span className="material-icons-round text-sm">info</span> How to Apply
                </h3>
                <ol className="space-y-1 text-sm text-gray-700 dark:text-gray-300 list-none">
                  <li className="flex gap-2"><span className="text-blue-500 font-bold">1.</span> Visit the official website (link below)</li>
                  <li className="flex gap-2"><span className="text-blue-500 font-bold">2.</span> Register with your Aadhaar-linked mobile number</li>
                  <li className="flex gap-2"><span className="text-blue-500 font-bold">3.</span> Fill the application form with land &amp; crop details</li>
                  <li className="flex gap-2"><span className="text-blue-500 font-bold">4.</span> Upload the required documents listed below</li>
                  <li className="flex gap-2"><span className="text-blue-500 font-bold">5.</span> Submit — track status on portal or via SMS</li>
                  <li className="flex gap-2"><span className="text-blue-500 font-bold">6.</span> Benefit credited directly to your bank account via DBT</li>
                </ol>
              </div>
              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-1">
                  <span className="material-icons-round text-sm">folder</span> Required Documents
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedScheme.requiredDocs.split(',').map((doc, i) => (
                    <span key={i} className="text-xs bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-full font-medium">{doc.trim()}</span>
                  ))}
                </div>
              </div>
              {selectedScheme.matchReason && (
                <div className="bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800/30 rounded-xl p-4">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400 mb-2 flex items-center gap-1">
                    <span className="material-icons-round text-sm">psychology</span> Why AI Matched This
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{selectedScheme.matchReason}</p>
                </div>
              )}
            </div>
            <div className="flex-shrink-0 p-6 border-t border-gray-100 dark:border-white/10 bg-white dark:bg-[#111a14]">
              <a href={selectedScheme.applyUrl} target="_blank" rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg text-sm">
                <span className="material-icons-round text-sm">open_in_new</span>
                Apply on Official Portal
              </a>
              <p className="text-center text-xs text-gray-400 mt-2 break-all">Opens: <span className="font-mono">{selectedScheme.applyUrl}</span></p>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
