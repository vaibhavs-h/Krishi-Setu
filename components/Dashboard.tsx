"use client";

import Link from "next/link";
import { motion, useTransform, MotionValue } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Header from "@/components/Header";

import { useAuth } from "@/context/AuthContext";

import { useRouter } from "next/navigation";

export default function Dashboard({ scrollYProgress, skipIntro = false }: { scrollYProgress: MotionValue<number>, skipIntro?: boolean }) {

  const { user } = useAuth();
  const router = useRouter();
  // Fade in the dashboard content completely at the end of the scroll
  const opacity = useTransform(scrollYProgress, [0.93, 1], [0, 1]);
  const pointerEvents = useTransform(scrollYProgress, (v) => (v > 0.95 ? "auto" : "none"));

  const handleCardClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    if (user) {
      router.push(path);
    } else {
      router.push("/login");
    }
  };

  // Override opacity if user is logged in or bypassed to skip scroll animation
  const effectiveOpacity = user || skipIntro ? 1 : opacity;
  const effectivePointerEvents = user || skipIntro ? "auto" : pointerEvents;

  return (
    <motion.div
      style={{ opacity: effectiveOpacity, pointerEvents: effectivePointerEvents }}
      className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-white/50 dark:bg-[#020402]/60 backdrop-blur-md"
    >
      <style jsx global>{`
        :root {
          --neon-green: #39ff14;
          --neon-green-glow: 0 0 10px rgba(57, 255, 20, 0.5);
        }
        .neural-text {
          color: transparent;
          -webkit-text-stroke: 1px rgba(57, 255, 20, 0.3);
          background-image: linear-gradient(180deg, #fff 0%, rgba(57, 255, 20, 0.8) 100%);
          background-clip: text;
          -webkit-background-clip: text;
          text-shadow: 0 0 15px rgba(57, 255, 20, 0.4);
        }
        .grid-bg {
          background-size: 40px 40px;
          background-image:
            linear-gradient(to right, rgba(57, 255, 20, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(57, 255, 20, 0.05) 1px, transparent 1px);
        }
        .orb-glow {
          box-shadow: 0 0 20px 5px rgba(57, 255, 20, 0.4), inset 0 0 20px rgba(57, 255, 20, 0.4);
        }
      `}</style>

      {/* Background Grid */}
      <div className="absolute inset-0 z-0 grid-bg pointer-events-none opacity-40" />

      {/* Unified Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-8 w-full max-w-[1400px] mx-auto py-10 relative z-10">
        {/* Decorative elements */}
        <div className="absolute top-1/4 right-1/4 animate-bounce duration-[3000ms] z-0 hidden lg:block opacity-40">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-emerald-500/30 dark:border-[var(--neon-green)]/30 animate-[spin_4s_linear_infinite]"></div>
            <div className="absolute inset-2 rounded-full border border-emerald-500/50 dark:border-[var(--neon-green)]/50 border-dashed animate-[spin_10s_linear_infinite_reverse]"></div>
            <div className="w-3 h-3 bg-emerald-500 dark:bg-[var(--neon-green)] rounded-full orb-glow"></div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center w-full max-w-5xl mx-auto mb-16 relative">
          <div className="space-y-6 relative z-20">
            <h1 className="font-display text-5xl md:text-8xl font-bold tracking-tighter text-gray-900 dark:text-white leading-[0.9] mb-4">
              Empowering Farmers through <br />
              <span className="neural-text relative inline-block pb-2 mt-2">
                Neural Intelligence
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-900 dark:text-gray-300 max-w-2xl mx-auto font-mono tracking-wide font-medium">
              <span className="text-emerald-700 dark:text-[var(--neon-green)] font-bold">&gt;_</span> Bridging traditional wisdom with high-speed data analytics.
              <br /><span className="text-slate-700 dark:text-slate-400 text-sm font-bold">Targeting yield optimization protocols...</span>
            </p>
          </div>
        </div>

        {/* HUD / Navigation Hub */}
        <div className="w-full mt-auto mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-2">
          {/* Card 1: Market Tracker */}
          <Link href="/market" onClick={(e) => handleCardClick(e, "/market")} className="group relative overflow-hidden h-48 bg-white/40 dark:bg-[rgba(10,20,15,0.85)] rounded-2xl border border-black/5 dark:border-white/5 hover:border-emerald-500/50 dark:hover:border-[var(--neon-green)]/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(57,255,20,0.1)] backdrop-blur-xl flex">
            <div className="w-1/2 p-6 flex flex-col justify-between relative z-10 border-r border-black/5 dark:border-white/5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-700 dark:text-[var(--neon-green)] text-lg">currency_rupee</span>
                <span className="text-[10px] uppercase tracking-widest font-bold font-mono text-gray-950 dark:text-gray-400">Market</span>
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold text-gray-900 dark:text-white leading-tight mb-1 group-hover:text-emerald-600 dark:group-hover:text-[var(--neon-green)] transition-colors">Price<br />Tracker</h3>
                <div className="text-[10px] text-gray-950 dark:text-gray-300 font-mono mt-2 group-hover:text-emerald-700 dark:group-hover:text-white transition-colors flex items-center gap-1 uppercase font-bold">
                  View Data <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </div>
            <div className="w-1/2 relative bg-black/5 dark:bg-black/20 p-4 flex items-center justify-center">
              <div className="absolute top-3 right-3 text-[10px] font-mono text-emerald-600 dark:text-[var(--neon-green)] flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-[var(--neon-green)] animate-pulse"></div> LIVE
              </div>
              <svg className="w-full h-24 overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 50">
                <path d="M0,40 L10,35 L20,38 L30,20 L40,25 L50,15 L60,18 L70,5 L80,10 L90,2 L100,5" fill="none" stroke="currentColor" className="text-emerald-500/50 dark:text-[var(--neon-green)]" strokeWidth="2" vectorEffect="non-scaling-stroke"></path>
                <path d="M0,40 L10,35 L20,38 L30,20 L40,25 L50,15 L60,18 L70,5 L80,10 L90,2 L100,5 V50 H0 Z" fill="currentColor" className="text-emerald-500/10 dark:text-[var(--neon-green)]/10"></path>
              </svg>
              <div className="absolute bottom-2 right-2 text-[10px] font-mono text-gray-500">+2.4%</div>
            </div>
          </Link>

          {/* Card 2: Government Schemes */}
          <Link href="/schemes" onClick={(e) => handleCardClick(e, "/schemes")} className="group relative overflow-hidden h-48 bg-white/40 dark:bg-[rgba(10,20,15,0.85)] rounded-2xl border border-black/5 dark:border-white/5 hover:border-cyan-500/50 dark:hover:border-cyan-400/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(34,211,238,0.1)] backdrop-blur-xl flex">
            <div className="w-1/2 p-6 flex flex-col justify-between relative z-10 border-r border-black/5 dark:border-white/5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-cyan-600 dark:text-cyan-400 text-lg">policy</span>
                <span className="text-[10px] uppercase tracking-widest font-bold font-mono text-gray-950 dark:text-gray-400">Govt</span>
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold text-gray-900 dark:text-white leading-tight mb-1 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">Scheme<br />Finder</h3>
                <div className="text-[10px] text-gray-950 dark:text-gray-300 font-mono mt-2 group-hover:text-cyan-700 dark:group-hover:text-white transition-colors flex items-center gap-1 uppercase font-bold">
                  Check Eligibility <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </div>
            <div className="w-1/2 relative bg-black/5 dark:bg-black/20 p-4 flex items-center justify-center">
              <div className="absolute top-3 right-3 text-[10px] font-mono text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
                98 MATCHES
              </div>
              <div className="flex items-end gap-1 h-12">
                {[20, 40, 25, 45, 35, 20].map((h, i) => (
                  <div key={i} className="w-1.5 bg-cyan-500/30 dark:bg-cyan-400/30 rounded-t-sm" style={{ height: `${h * 2}%` }} />
                ))}
              </div>
            </div>
          </Link>

          {/* Card 3: Financial Hub */}
          <Link href="/financial" onClick={(e) => handleCardClick(e, "/financial")} className="group relative overflow-hidden h-48 bg-white/40 dark:bg-[rgba(10,20,15,0.85)] rounded-2xl border border-black/5 dark:border-white/5 hover:border-amber-500/50 dark:hover:border-amber-400/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(251,191,36,0.1)] backdrop-blur-xl flex">
            <div className="w-1/2 p-6 flex flex-col justify-between relative z-10 border-r border-black/5 dark:border-white/5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-lg">account_balance_wallet</span>
                <span className="text-[10px] uppercase tracking-widest font-bold font-mono text-gray-950 dark:text-gray-400">Finance</span>
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold text-gray-900 dark:text-white leading-tight mb-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">Smart<br />Banking</h3>
                <div className="text-[10px] text-gray-950 dark:text-gray-300 font-mono mt-2 group-hover:text-amber-700 dark:group-hover:text-white transition-colors flex items-center gap-1 uppercase font-bold">
                  View Finance <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </div>
            <div className="w-1/2 relative bg-black/5 dark:bg-black/20 p-4 flex items-center justify-center">
              <div className="absolute top-3 right-3 text-[10px] font-mono text-amber-600 dark:text-amber-400 flex items-center gap-1 uppercase">
                Secure
              </div>
              <svg className="w-full h-24 overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 50">
                <path d="M0,30 C20,30 20,10 40,10 C60,10 60,40 80,40 C90,40 95,25 100,20" fill="none" stroke="currentColor" className="text-amber-500/50 dark:text-amber-400/50" strokeWidth="2"></path>
                <circle cx="40" cy="10" fill="currentColor" className="text-amber-500 dark:text-amber-400 animate-pulse" r="3"></circle>
              </svg>
            </div>
          </Link>

          {/* Card 4: Climate Advisory */}
          <Link href="/advisory" onClick={(e) => handleCardClick(e, "/advisory")} className="group relative overflow-hidden h-48 bg-white/40 dark:bg-[rgba(10,20,15,0.85)] rounded-2xl border border-black/5 dark:border-white/5 hover:border-sky-500/50 dark:hover:border-sky-400/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(56,189,248,0.1)] backdrop-blur-xl flex">
            <div className="w-1/2 p-6 flex flex-col justify-between relative z-10 border-r border-black/5 dark:border-white/5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sky-600 dark:text-sky-400 text-lg">cloud</span>
                <span className="text-[10px] uppercase tracking-widest font-bold font-mono text-gray-950 dark:text-gray-400">Weather</span>
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold text-gray-900 dark:text-white leading-tight mb-1 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">Climate<br />Advisory</h3>
                <div className="text-[10px] text-gray-950 dark:text-gray-300 font-mono mt-2 group-hover:text-sky-700 dark:group-hover:text-white transition-colors flex items-center gap-1 uppercase font-bold">
                  View Forecast <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </div>
            <div className="w-1/2 relative bg-black/5 dark:bg-black/20 p-4 flex items-center justify-center">
              <div className="absolute top-3 right-3 text-[10px] font-mono text-sky-600 dark:text-sky-400 flex items-center gap-1">
                24°C
              </div>
              <svg className="w-full h-24 overflow-visible opacity-50" preserveAspectRatio="none" viewBox="0 0 100 50">
                <path d="M0,25 Q25,5 50,25 T100,25" fill="none" stroke="currentColor" className="text-sky-500 dark:text-sky-400" strokeDasharray="4 2" strokeWidth="2"></path>
              </svg>
              <div className="absolute bottom-2 left-2 text-[10px] font-mono text-gray-950 dark:text-gray-500 uppercase tracking-tighter font-bold">Hum: 65%</div>
            </div>
          </Link>
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
    </motion.div>
  );
}
