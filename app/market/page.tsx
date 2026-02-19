"use client";

import { useTheme } from "@/components/ThemeProvider";
import Link from "next/link";

export default function MarketPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <div className="bg-[#f0fdf4] dark:bg-[#0f110f] text-slate-800 dark:text-gray-200 transition-colors duration-300 relative min-h-screen overflow-x-hidden font-sans antialiased">
        <style jsx global>{`
          .glass-panel {
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          .text-glow {
            text-shadow: 0 0 20px rgba(57, 255, 20, 0.5);
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
            alt="Blurred golden wheat field at sunset"
            className="w-full h-full object-cover filter blur-[2px] opacity-40"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbja_p9hBcKIPH7ip93_gWOhYQb21xj5ZUsIDGiJ4oOQ_tQQkFfx1WSEJjtnbS9b0bJClSW1Xy_dI2ajaiW3sU6LsHU3W4pTTvne11ATwrh8aWDfLCE_3w4scxmfIVgtRqRYJJQC6v3DSlI4yksbQMqBMvlrh8InMlmWo0hsab3Bmgdyfo7Rfis7FZesw0jcY13H2wGlrTdaSpMm2dHH9XLZHLzYFy7SJVMK_DK2HvQa1dzr9-1YXBrGMh8IZtn0P1rtrnr-3FNc8"
          />
          <div className="absolute inset-0 bg-white/50 dark:bg-[#0f110f]/80 transition-colors duration-700"></div>
          <div className="absolute inset-0 grid-bg pointer-events-none opacity-20"></div>
        </div>

        <div className="relative z-10 flex flex-col min-h-screen">
          <header className="w-full px-8 py-6 flex justify-between items-center relative z-50">
            <Link href="/" className="glass-panel bg-white/70 dark:bg-[rgba(18,24,21,0.7)] px-6 py-3 rounded-full flex items-center space-x-2">
              <span className="font-display font-bold text-lg tracking-tight text-gray-950 dark:text-white"><span className="text-emerald-700 dark:text-[#6ee7b7]">Krishi</span> Setu</span>
              <span className="hidden sm:inline-block text-[10px] uppercase tracking-widest text-slate-950 dark:text-gray-400 pl-2 border-l border-gray-400 dark:border-gray-600 font-bold">Cultivating Innovation</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-1 glass-panel bg-white/70 dark:bg-[rgba(18,24,21,0.7)] px-2 py-2 rounded-full">
              <Link href="/" className="px-4 py-1.5 text-sm font-bold text-slate-950 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">Dashboard</Link>
              <Link href="/market" className="px-4 py-1.5 text-sm font-bold text-black dark:text-[#6ee7b7] bg-white/50 dark:bg-white/10 rounded-full shadow-sm">Markets</Link>
              <Link href="/financial" className="px-4 py-1.5 text-sm font-bold text-slate-950 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">Finance</Link>
              <Link href="/schemes" className="px-4 py-1.5 text-sm font-bold text-slate-950 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">Schemes</Link>
              <Link href="/advisory" className="px-4 py-1.5 text-sm font-bold text-slate-950 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">Advisory</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="glass-panel bg-white/70 dark:bg-[rgba(18,24,21,0.7)] p-3 rounded-full text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-white/20 transition-all group"
              >
                <span className="material-icons-round text-xl group-hover:rotate-12 transition-transform">
                  {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                </span>
              </button>
              <button className="glass-panel bg-white/70 dark:bg-[rgba(18,24,21,0.7)] p-3 rounded-full text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-white/20 transition-all">
                <span className="material-icons-round text-xl">account_circle</span>
              </button>
            </div>
          </header>

          <main className="flex-grow w-full max-w-[1400px] mx-auto px-8 py-4 relative z-10">
            <div className="mb-10 text-center md:text-left flex flex-col md:flex-row justify-between items-end">
              <div>
                <h1 className="font-sans text-4xl md:text-5xl font-extrabold text-gray-950 dark:text-white tracking-tighter mb-2"><span className="text-emerald-700 dark:text-[#6ee7b7]">Market Price</span> Intelligence</h1>
                <p className="text-gray-950 dark:text-gray-300 max-w-2xl text-sm md:text-base font-serif italic tracking-wide font-medium">Real-time crop valuation powered by predictive neural algorithms.</p>
              </div>
              <div className="hidden md:block">
                <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-[#6ee7b7] bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 uppercase tracking-widest">
                  Live Market Feed v2.4
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 glass-panel bg-white/80 dark:bg-[rgba(20,20,20,0.65)] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] rounded-[1.5rem] p-6 shadow-2xl relative overflow-hidden group">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#4ade80]/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-slate-700 dark:text-gray-400 text-[10px] font-bold tracking-[0.2em] font-mono uppercase mb-1">Global Index</h3>
                    <div className="flex items-baseline gap-3">
                      <h2 className="text-4xl font-display font-bold text-slate-900 dark:text-white">Wheat Futures</h2>
                      <span className="px-2 py-1 bg-green-500/10 text-green-600 dark:text-[#4ade80] rounded text-sm font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">trending_up</span> +2.4%
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 rounded-lg text-xs font-medium bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-white/10 transition">1H</button>
                    <button className="px-3 py-1 rounded-lg text-xs font-medium bg-[#4ade80] text-slate-900 font-bold shadow-lg shadow-[#4ade80]/20">1D</button>
                    <button className="px-3 py-1 rounded-lg text-xs font-medium bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-white/10 transition">1W</button>
                  </div>
                </div>

                <div className="relative h-64 w-full mt-4">
                  <div className="absolute inset-0 flex flex-col justify-between text-xs text-slate-600 dark:text-gray-500 font-mono">
                    <div className="border-b border-dashed border-slate-300 dark:border-slate-700/50 w-full h-0"></div>
                    <div className="border-b border-dashed border-slate-300 dark:border-slate-700/50 w-full h-0"></div>
                    <div className="border-b border-dashed border-slate-300 dark:border-slate-700/50 w-full h-0"></div>
                    <div className="border-b border-dashed border-slate-300 dark:border-slate-700/50 w-full h-0"></div>
                  </div>
                  <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 800 200">
                    <defs>
                      <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#4ade80" stopOpacity="0.3"></stop>
                        <stop offset="100%" stopColor="#4ade80" stopOpacity="0"></stop>
                      </linearGradient>
                    </defs>
                    <path className="drop-shadow-[0_0_10px_rgba(74,222,128,0.5)] animate-pulse" d="M0,150 C50,140 100,160 150,130 C200,100 250,110 300,90 C350,70 400,100 450,60 C500,20 550,50 600,40 C650,30 700,50 750,20 L800,10" fill="none" stroke="#4ade80" strokeLinecap="round" strokeWidth="3"></path>
                    <path className="opacity-50" d="M0,150 C50,140 100,160 150,130 C200,100 250,110 300,90 C350,70 400,100 450,60 C500,20 550,50 600,40 C650,30 700,50 750,20 L800,10 L800,200 L0,200 Z" fill="url(#gradient)"></path>
                    <circle className="fill-slate-900 dark:fill-white stroke-[#4ade80] stroke-2" cx="150" cy="130" r="4"></circle>
                    <circle className="fill-slate-900 dark:fill-white stroke-[#4ade80] stroke-2" cx="450" cy="60" r="4"></circle>
                    <circle className="fill-[#4ade80] animate-ping" cx="750" cy="20" r="6"></circle>
                    <circle className="fill-white" cx="750" cy="20" r="4"></circle>
                  </svg>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-4 border-t border-slate-200 dark:border-white/10 pt-4">
                  <div>
                    <p className="text-[10px] text-slate-800 dark:text-gray-400 uppercase tracking-wider mb-1">Current Price</p>
                    <p className="font-mono text-lg font-bold dark:text-white">$742.50 <span className="text-xs text-slate-600 dark:text-gray-500">/ ton</span></p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-800 dark:text-gray-400 uppercase tracking-wider mb-1">Volume (24h)</p>
                    <p className="font-mono text-lg font-bold dark:text-white">12.4K <span className="text-xs text-slate-600 dark:text-gray-500">lots</span></p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-800 dark:text-gray-400 uppercase tracking-wider mb-1">Predicted High</p>
                    <p className="font-mono text-lg font-bold text-[#4ade80]">$785.00</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col gap-6">
                <div className="glass-panel bg-white/80 dark:bg-[rgba(20,20,20,0.65)] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] rounded-[1.5rem] p-6 shadow-xl flex-1 relative overflow-hidden">
                  <div className="flex items-center gap-2 mb-6">
                    <span className="material-symbols-outlined text-[#4ade80] animate-pulse">psychology</span>
                    <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">Neural Insights</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:border-[#4ade80]/50 transition duration-300 group cursor-pointer">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-gray-200 uppercase tracking-wide">Buy Signal</span>
                        <span className="text-[10px] text-slate-800 dark:text-gray-400 font-bold">2m ago</span>
                      </div>
                      <p className="text-sm text-slate-950 dark:text-gray-200 mb-3 font-medium">Rice paddy prices expected to surge due to monsoon delay predictions.</p>
                      <div className="w-full bg-slate-300 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#4ade80] h-full w-[85%] rounded-full shadow-[0_0_10px_rgba(74,222,128,0.5)]"></div>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-[10px] text-slate-800 dark:text-gray-400 font-bold">Confidence</span>
                        <span className="text-[10px] text-[#4ade80] font-extrabold">85%</span>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:border-[#4ade80]/50 transition duration-300 group cursor-pointer">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-slate-800 dark:text-gray-200 uppercase tracking-wide">Hold Advisory</span>
                        <span className="text-[10px] text-slate-800 dark:text-gray-400 font-bold">45m ago</span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-gray-300">Cotton inventory stabilizing. Wait for Q3 report before liquidation.</p>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-300 dark:border-white/10 text-center">
                    <a className="inline-flex items-center gap-1 text-xs font-extrabold text-slate-950 dark:text-white hover:text-[#4ade80] transition-colors uppercase tracking-widest" href="#">
                      View Analysis <span className="material-symbols-outlined text-sm">arrow_outward</span>
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-panel bg-white/80 dark:bg-[rgba(20,20,20,0.65)] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] rounded-[1rem] p-4 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <span className="text-xs text-slate-800 dark:text-gray-200 uppercase font-bold">Rice</span>
                      <span className="text-red-400 text-xs font-mono">-0.8%</span>
                    </div>
                    <div className="mt-2">
                      <p className="text-xl font-bold dark:text-white">$320</p>
                    </div>
                    <svg className="w-full h-8 mt-2 overflow-visible" viewBox="0 0 100 20">
                      <path d="M0,10 L20,15 L40,5 L60,12 L80,8 L100,18" fill="none" stroke="#f87171" strokeWidth="2"></path>
                    </svg>
                  </div>
                  <div className="glass-panel bg-white/80 dark:bg-[rgba(20,20,20,0.65)] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] rounded-[1rem] p-4 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <span className="text-xs text-slate-800 dark:text-gray-200 uppercase font-bold">Corn</span>
                      <span className="text-[#4ade80] text-xs font-mono">+1.2%</span>
                    </div>
                    <div className="mt-2">
                      <p className="text-xl font-bold dark:text-white">$195</p>
                    </div>
                    <svg className="w-full h-8 mt-2 overflow-visible" viewBox="0 0 100 20">
                      <path d="M0,15 L20,10 L40,12 L60,5 L80,8 L100,2" fill="none" stroke="#4ade80" strokeWidth="2"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pb-12">
              <Link href="#" className="group relative overflow-hidden glass-panel bg-gradient-to-br from-slate-100/90 to-slate-200/90 dark:from-white/5 dark:to-white/0 border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] rounded-[1rem] p-6 hover:bg-white/95 dark:hover:bg-white/10 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>
                <div className="text-[10px] text-slate-800 dark:text-gray-400 font-bold tracking-widest uppercase mb-4">Real-time Data</div>
                <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-[#4ade80] transition-colors">Supply Chain <br />Tracker</h3>
                <div className="mt-8 flex justify-between items-end">
                  <span className="material-symbols-outlined text-4xl text-slate-800 dark:text-gray-500 group-hover:text-[#4ade80] transition-colors duration-500">local_shipping</span>
                  <span className="text-xs text-slate-900 dark:text-white group-hover:text-[#4ade80] transition-colors flex items-center gap-1 font-bold">
                    Launch System <span className="material-symbols-outlined text-[10px]">north_east</span>
                  </span>
                </div>
              </Link>
              <Link href="/financial" className="group relative overflow-hidden glass-panel bg-gradient-to-br from-slate-100/90 to-slate-200/90 dark:from-white/5 dark:to-white/0 border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] rounded-[1rem] p-6 hover:bg-white/95 dark:hover:bg-white/10 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>
                <div className="text-[10px] text-slate-800 dark:text-gray-400 font-extrabold tracking-widest uppercase mb-4">Financials</div>
                <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-[#4ade80] transition-colors">Smart Finance <br />& Payments</h3>
                <div className="mt-8 flex justify-between items-end">
                  <span className="material-symbols-outlined text-4xl text-slate-800 dark:text-gray-500 group-hover:text-[#4ade80] transition-colors duration-500">account_balance_wallet</span>
                  <span className="text-xs text-slate-900 dark:text-white group-hover:text-[#4ade80] transition-colors flex items-center gap-1 font-bold">
                    Access Finance <span className="material-symbols-outlined text-[10px]">north_east</span>
                  </span>
                </div>
              </Link>
              <Link href="/advisory" className="group relative overflow-hidden glass-panel bg-gradient-to-br from-slate-100/90 to-slate-200/90 dark:from-white/5 dark:to-white/0 border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] rounded-[1rem] p-6 hover:bg-white/95 dark:hover:bg-white/10 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>
                <div className="text-[10px] text-slate-800 dark:text-gray-400 font-bold tracking-widest uppercase mb-4">Environment</div>
                <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-[#4ade80] transition-colors">Crop Health <br />Monitoring</h3>
                <div className="mt-8 flex justify-between items-end">
                  <span className="material-symbols-outlined text-4xl text-slate-800 dark:text-gray-500 group-hover:text-[#4ade80] transition-colors duration-500">eco</span>
                  <span className="text-xs text-slate-900 dark:text-white group-hover:text-[#4ade80] transition-colors flex items-center gap-1 font-bold">
                    Check Status <span className="material-symbols-outlined text-[10px]">north_east</span>
                  </span>
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
        </div>
      </div>
    </div>
  );
}
