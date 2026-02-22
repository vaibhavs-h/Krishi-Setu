"use client";

import { useTheme } from "@/context/ThemeContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

interface CreditLine {
  id: string;
  name: string;
  status: "ACTIVE" | "PENDING";
  utilized: number;
  total: number;
  statusColor: string;
}

interface Transaction {
  id: string;
  name: string;
  category: string;
  date: string;
  amount: number;
  type: "DEBIT" | "CREDIT";
  status: "COMPLETED" | "RECEIVED" | "PROCESSING";
  icon: string;
  colorClass: string;
}

interface MarketRate {
  id: string;
  ticker: string;
  name: string;
  rate: number;
  trend: "up" | "down" | "flat";
}

const INITIAL_CREDIT_LINES: CreditLine[] = [
  {
    id: "CL_1",
    name: "Kisan Credit Card (KCC)",
    status: "ACTIVE",
    utilized: 150000,
    total: 200000,
    statusColor: "text-gray-950 dark:text-white"
  },
  {
    id: "CL_2",
    name: "Tractor Finance – Term Loan",
    status: "PENDING",
    utilized: 0,
    total: 450000,
    statusColor: "text-gray-700 dark:text-gray-500"
  }
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "TX_1",
    name: "Hybrid Seed Purchase – Rabi",
    category: "Farm Input",
    date: "Oct 24, 2025",
    amount: 12500.00,
    type: "DEBIT",
    status: "COMPLETED",
    icon: "agriculture",
    colorClass: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
  },
  {
    id: "TX_2",
    name: "PM-KISAN Q3 Installment",
    category: "Govt Scheme",
    date: "Oct 20, 2025",
    amount: 4000.00,
    type: "CREDIT",
    status: "RECEIVED",
    icon: "water_drop",
    colorClass: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
  }
];

const INITIAL_RATES: MarketRate[] = [
  { id: "R_1", ticker: "USD/INR", name: "Forex", rate: 83.12, trend: "flat" },
  { id: "R_2", ticker: "WHEAT", name: "NCDEX", rate: 2450.50, trend: "flat" },
  { id: "R_3", ticker: "SOYBEAN", name: "NCDEX", rate: 4120.00, trend: "flat" }
];

export default function FinancialPage() {
  const { theme } = useTheme();

  // State Management
  const [score, setScore] = useState(0);
  const [targetScore, setTargetScore] = useState(0);
  const [creditLines, setCreditLines] = useState<CreditLine[]>(INITIAL_CREDIT_LINES);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [marketRates, setMarketRates] = useState<MarketRate[]>(INITIAL_RATES);
  const [isApplying, setIsApplying] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    setIsClient(true);

    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      let calculatedScore = 650; // Base fair score

      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, crops, location')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          // Add points for completing profile
          if (profile.full_name) calculatedScore += 25;
          if (profile.location) calculatedScore += 15;
          // Add points for crop diversification (proxy for revenue stability)
          if (profile.crops && profile.crops.length > 1) {
            calculatedScore += (profile.crops.length * 20);
          }
        }
      }

      // Cap at 850
      setTargetScore(Math.min(850, calculatedScore));
    };

    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Gauge Animation
  useEffect(() => {
    if (targetScore === 0) return; // Wait until fetched

    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 20) + 10;
      if (current >= targetScore) {
        setScore(targetScore);
        clearInterval(interval);
      } else {
        setScore(current);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [targetScore]);

  // Market Rates Fluctuation Simulation
  useEffect(() => {
    const rateInterval = setInterval(() => {
      setMarketRates(prev => prev.map(rate => {
        // 30% chance to fluctuate
        if (Math.random() > 0.7) {
          const volatility = rate.ticker === "USD/INR" ? 0.05 : 15.0; // Forex moves small, Ag moves big
          const change = (Math.random() * volatility * 2) - volatility;
          const newRate = Number((rate.rate + change).toFixed(2));
          return {
            ...rate,
            rate: newRate,
            trend: change > 0 ? "up" : "down"
          };
        }
        return { ...rate, trend: "flat" };
      }));
    }, 4000);
    return () => clearInterval(rateInterval);
  }, []);

  // Simulated Incoming Transaction
  useEffect(() => {
    const timer = setTimeout(() => {
      const newDeposit: Transaction = {
        id: `TX_${Date.now()}`,
        name: "Wheat Procurement Payment",
        category: "Crop Sales",
        date: "Today",
        amount: 32000.00,
        type: "CREDIT",
        status: "PROCESSING",
        icon: "account_balance_wallet",
        colorClass: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 outline outline-2 outline-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-pulse"
      };
      // Prepend to array
      setTransactions(prev => [newDeposit, ...prev]);

      // Remove the exact pulse styling after a few seconds
      setTimeout(() => {
        setTransactions(current =>
          current.map(tx => tx.id === newDeposit.id ?
            { ...tx, status: "RECEIVED", colorClass: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" }
            : tx)
        );
      }, 3000);

    }, 5000); // Happens 5 seconds after load
    return () => clearTimeout(timer);
  }, []);

  // Handlers
  const handleApplyLine = () => {
    setIsApplying(true);
    setTimeout(() => {
      const newLine: CreditLine = {
        id: `CL_${Date.now()}`,
        name: "Seasonal Crop Working Capital",
        status: "PENDING",
        utilized: 0,
        total: 50000,
        statusColor: "text-gray-700 dark:text-gray-500"
      };
      setCreditLines(prev => [...prev, newLine]);
      setIsApplying(false);
    }, 1500);
  };

  // Calculations
  const formatCurrency = (val: number) => {
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    return `₹${val.toLocaleString()}`;
  };

  // SVG dash array math (total circumference ~283 for r=45)
  const maxScore = 850;
  const percentage = score / maxScore;
  const dashoffset = 283 - (283 * percentage);

  const scoreRating = score >= 750 ? "EXCELLENT" : score >= 650 ? "GOOD" : "FAIR";

  if (!isClient) return null;

  return (
    <ProtectedRoute>
      <div className={theme === "dark" ? "dark" : ""}>
        <div className="bg-[#f3f4f6] dark:bg-[#0f1110] text-gray-800 dark:text-gray-200 font-sans antialiased min-h-screen relative overflow-x-hidden selection:bg-gray-950 selection:text-white">
          <style jsx global>{`
          .glass-panel {
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
           @keyframes dash {
            from {
              stroke-dasharray: 0, 283;
            }
            to {
              stroke-dasharray: 283, 283;
            }
          }
          .gauge-circle {
            transition: stroke-dashoffset 0.1s linear;
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
              <div className="mb-10 text-center md:text-left">
                <h1 className="font-sans text-4xl md:text-5xl font-extrabold text-gray-950 dark:text-white tracking-tighter mb-2">
                  <span className="text-emerald-700 dark:text-[#6ee7b7]">Smart Financial</span> Hub
                </h1>
                <p className="text-gray-900 dark:text-gray-300 max-w-2xl text-sm md:text-base tracking-wide font-medium">AI-driven financial insights tailored for your harvest cycle.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">

                {/* ---------------- CREDIT LINES ---------------- */}
                <div className="lg:col-span-3 flex flex-col space-y-6">
                  <div className="glass-panel bg-white/80 dark:bg-[rgba(30,41,35,0.4)] p-6 rounded-2xl h-full flex flex-col justify-between hover:border-emerald-500/30 transition-colors duration-300">
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-gray-950 dark:text-gray-400 font-bold">Credit Lines</h2>
                        <span className="material-icons-round text-emerald-600 dark:text-[#6ee7b7]">credit_card</span>
                      </div>
                      <div className="space-y-4">
                        {creditLines.map((line, idx) => (
                          <div key={line.id} className={`group cursor-pointer ${idx > 0 ? "pt-4 border-t border-gray-200 dark:border-gray-700/50" : ""}`}>
                            <div className="flex justify-between items-baseline mb-1">
                              <span className="font-bold text-gray-950 dark:text-gray-200">{line.name}</span>
                              <span className={`text-xs font-bold tracking-widest ${line.statusColor}`}>{line.status}</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-1 overflow-hidden">
                              <div
                                className={`h-1.5 rounded-full ${line.status === "ACTIVE" ? "bg-emerald-600 dark:bg-[#6ee7b7] shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "bg-emerald-500/40 dark:bg-emerald-500/20"}`}
                                style={{ width: line.total > 0 ? `${(Math.max(line.utilized, line.total * 0.1) / line.total) * 100}%` : "10%" }} // Visual min width for pending
                              ></div>
                            </div>
                            <p className="text-xs text-gray-950 dark:text-gray-400 font-bold">
                              {line.status === "ACTIVE" ? `${formatCurrency(line.utilized)} utilized of ${formatCurrency(line.total)}` : "Application in review"}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-8">
                      <button
                        onClick={handleApplyLine}
                        disabled={isApplying}
                        className="w-full py-3 rounded-xl border border-dashed border-gray-400 dark:border-gray-600 text-gray-600 dark:text-gray-300 text-sm hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-white/5 hover:border-emerald-500 dark:hover:border-white transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isApplying ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-500 border-t-transparent"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            <span className="material-icons-round text-base group-hover:scale-110 transition-transform">add</span>
                            Apply New Line
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* ---------------- GAUGE CARD ---------------- */}
                <div className="lg:col-span-6">
                  <div className="glass-panel bg-white/90 dark:bg-[rgba(30,41,35,0.4)] p-8 rounded-2xl h-full flex flex-col items-center justify-center relative overflow-hidden group shadow-xl border border-gray-200 dark:border-white/10">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-emerald-500/5 via-transparent to-transparent pointer-events-none"></div>
                    <span className="material-icons-round absolute top-6 right-6 text-emerald-600/50 dark:text-gray-600 text-2xl font-bold cursor-help hover:text-emerald-600 transition-colors">info_outline</span>
                    <h2 className="font-display text-lg uppercase tracking-widest text-gray-950 dark:text-gray-400 mb-8 z-10 font-bold">Financial Readiness Score</h2>

                    {/* SVG Gauge */}
                    <div className="relative w-64 h-64 mb-6 z-10">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle className="text-gray-200 dark:text-gray-800" cx="50" cy="50" fill="none" r="45" stroke="currentColor" strokeWidth="8"></circle>
                        <circle
                          className="text-emerald-600 dark:text-[#6ee7b7] gauge-circle shadow-[0_0_25px_rgba(110,231,183,0.3)] drop-shadow-lg"
                          cx="50" cy="50" fill="none" r="45" stroke="currentColor" strokeLinecap="round" strokeWidth="8"
                          strokeDasharray="283"
                          strokeDashoffset={dashoffset}
                        ></circle>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-300">
                        <span className="text-6xl font-display font-bold text-gray-900 dark:text-white drop-shadow-md">{score}</span>
                        <span className={`text-sm font-bold tracking-widest mt-1 ${scoreRating === 'EXCELLENT' ? 'text-emerald-600 dark:text-[#6ee7b7]' : scoreRating === 'GOOD' ? 'text-blue-500' : 'text-yellow-500'}`}>
                          {scoreRating}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 w-full max-w-md z-10">
                      <div className="text-center p-3 rounded-xl bg-gray-50/50 dark:bg-black/20 backdrop-blur-sm">
                        <p className="text-xs text-gray-900 dark:text-gray-400 uppercase tracking-wide mb-1 font-bold">Interest Saving</p>
                        <p className="text-xl font-bold text-emerald-700 dark:text-[#6ee7b7]">₹12,450</p>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-gray-50/50 dark:bg-black/20 backdrop-blur-sm">
                        <p className="text-xs text-gray-900 dark:text-gray-400 uppercase tracking-wide mb-1 font-bold">Repayment Date</p>
                        <p className="text-xl font-bold text-gray-800 dark:text-gray-200">12 Oct</p>
                      </div>
                    </div>

                    {/* Decorative element */}
                    <div className="absolute bottom-[-20px] left-[-20px] opacity-[0.03] dark:opacity-5 pointer-events-none rotate-12">
                      <svg className="text-black dark:text-white" fill="none" height="200" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" viewBox="0 0 24 24" width="200">
                        <path d="M12 22v-14"></path>
                        <path d="M12 8c0 0 4 -2 4 -5"></path>
                        <path d="M12 8c0 0 -4 -2 -4 -5"></path>
                        <path d="M12 14c4 0 7 -3 7 -7"></path>
                        <path d="M12 14c-4 0 -7 -3 -7 -7"></path>
                        <path d="M12 22c4 0 7 -4 7 -8"></path>
                        <path d="M12 22c-4 0 -7 -4 -7 -8"></path>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* ---------------- MARKET RATES & ADVISORY ---------------- */}
                <div className="lg:col-span-3 flex flex-col space-y-6">
                  <div className="glass-panel bg-white/80 dark:bg-[rgba(30,41,35,0.4)] p-6 rounded-2xl flex-grow hover:border-emerald-500/30 transition-colors duration-300">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-gray-950 dark:text-gray-400 font-bold flex items-center gap-2">
                        NCDEX &amp; Agri Forex <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      </h2>
                      <span className="material-icons-round text-emerald-600 dark:text-[#6ee7b7]">trending_up</span>
                    </div>
                    <div className="space-y-3">
                      {marketRates.map(rate => (
                        <div key={rate.id} className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-white/5 border border-transparent shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-8 rounded-lg bg-white dark:bg-black/40 flex items-center justify-center text-gray-950 dark:text-white font-bold text-[10px] shadow-sm border border-gray-100 dark:border-gray-800">{rate.ticker}</div>
                            <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{rate.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {rate.trend === "up" && <span className="material-icons-round text-[10px] text-red-500">arrow_upward</span>}
                            {rate.trend === "down" && <span className="material-icons-round text-[10px] text-green-500">arrow_downward</span>}
                            <span className={`text-sm font-bold text-gray-900 dark:text-white transition-colors ${rate.trend === 'up' ? 'text-red-600 dark:text-red-400' : rate.trend === 'down' ? 'text-green-600 dark:text-green-400' : ''}`}>
                              {rate.ticker === 'USD/INR' ? `₹${rate.rate.toFixed(2)}` : `₹${rate.rate.toFixed(0)}/qtl`}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700/50">
                      <p className="text-[10px] text-gray-500 text-center font-mono">NCDEX AGRI &amp; RBI FOREX FEED</p>
                    </div>
                  </div>

                  {/* Promo Card */}
                  <div className="glass-panel bg-emerald-600 dark:bg-emerald-900 p-6 rounded-2xl relative overflow-hidden group cursor-pointer transition-all hover:shadow-emerald-500/20 hover:shadow-xl border border-emerald-500/50">
                    <div className="absolute -right-4 -top-4 w-20 h-20 bg-white opacity-20 blur-2xl rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-2 text-white dark:text-[#6ee7b7]">
                        <span className="material-icons-round animate-bounce-slow">bolt</span>
                        <h3 className="font-bold text-lg tracking-wide">Instant Advisory</h3>
                      </div>
                      <p className="text-emerald-50 dark:text-emerald-100/80 text-sm mb-4 leading-relaxed font-medium">AI suggests refinancing your KCC loan to save ₹3,200 annually.</p>
                      <button className="bg-white dark:bg-emerald-950 text-emerald-700 dark:text-[#6ee7b7] px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center gap-1 group-hover:bg-emerald-50">
                        View Plan <span className="material-icons-round text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* ---------------- TRANSACTIONS ---------------- */}
                <div className="lg:col-span-12 mt-2">
                  <div className="glass-panel bg-white/80 dark:bg-[rgba(30,41,35,0.4)] p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-gray-950 dark:text-gray-400 font-bold">Recent Transactions</h2>
                      <button className="text-xs text-emerald-600 dark:text-[#6ee7b7] font-medium hover:underline bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="text-xs text-gray-950 dark:text-gray-400 border-b border-gray-300 dark:border-gray-700/50 font-bold">
                            <th className="font-normal py-3 px-2">Transaction</th>
                            <th className="font-normal py-3">Category</th>
                            <th className="font-normal py-3">Date</th>
                            <th className="font-normal py-3 text-right">Amount</th>
                            <th className="font-normal py-3 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm">
                          {transactions.map(tx => (
                            <tr key={tx.id} className="group hover:bg-white/50 dark:hover:bg-white/5 transition-colors border-b border-gray-100 dark:border-gray-800/50 last:border-0">
                              <td className="py-3 pr-4 pl-2 font-medium text-gray-800 dark:text-gray-200 flex items-center gap-3">
                                <div className={`p-1.5 rounded ${tx.colorClass} transition-all duration-1000`}>
                                  <span className="material-icons-round text-sm">{tx.icon}</span>
                                </div>
                                {tx.name}
                              </td>
                              <td className="py-3 text-gray-950 dark:text-gray-400 font-bold">{tx.category}</td>
                              <td className="py-3 text-gray-950 dark:text-gray-300 font-bold">{tx.date}</td>
                              <td className={`py-3 text-right font-mono font-bold ${tx.type === 'CREDIT' ? 'text-emerald-600 dark:text-[#6ee7b7]' : 'text-gray-800 dark:text-gray-200'}`}>
                                {tx.type === 'CREDIT' ? '+' : '-'} ₹{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>
                              <td className="py-3 text-center">
                                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider ${tx.status === 'COMPLETED' ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400' :
                                  tx.status === 'RECEIVED' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                                    'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 animate-pulse'
                                  }`}>
                                  {tx.status}
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
      </div >
    </ProtectedRoute >
  );
}
