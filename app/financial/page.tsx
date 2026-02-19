"use client";

import { useTheme } from "@/components/ThemeProvider";
import Link from "next/link";

export default function FinancialPage() {
  const { theme, toggleTheme } = useTheme();
  // const [isDarkMode, setIsDarkMode] = useState(true); // Removed local state

  return (
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
              stroke-dashoffset: 283;
            }
            to {
              stroke-dashoffset: 70;
            }
          }
          .gauge-circle {
            stroke-dasharray: 283;
            stroke-dashoffset: 283;
            animation: dash 1.5s ease-out forwards;
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
          <header className="w-full px-8 py-6 flex justify-between items-center relative z-50">
            <Link href="/" className="glass-panel bg-white/70 dark:bg-[rgba(18,24,21,0.7)] px-6 py-3 rounded-full flex items-center space-x-2">
              <span className="font-display font-bold text-lg tracking-tight text-gray-950 dark:text-white"><span className="text-emerald-700 dark:text-[#6ee7b7]">Krishi</span> Setu</span>
              <span className="hidden sm:inline-block text-[10px] uppercase tracking-widest text-gray-800 dark:text-gray-400 pl-2 border-l border-gray-400 dark:border-gray-600 font-bold">Cultivating Innovation</span>
            </Link>


            <nav className="hidden md:flex items-center space-x-1 glass-panel bg-white/70 dark:bg-[rgba(18,24,21,0.7)] px-2 py-2 rounded-full">
              <Link href="/" className="px-4 py-1.5 text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">Dashboard</Link>
              <Link href="/market" className="px-4 py-1.5 text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">Markets</Link>
              <Link href="/financial" className="px-4 py-1.5 text-sm font-bold text-black dark:text-[#6ee7b7] bg-white/50 dark:bg-white/10 rounded-full shadow-sm">Finance</Link>
              <Link href="/schemes" className="px-4 py-1.5 text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">Schemes</Link>
              <Link href="/advisory" className="px-4 py-1.5 text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">Advisory</Link>
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

          <main className="flex-grow w-full max-w-[1400px] mx-auto px-8 pb-12 pt-4 relative z-10">
            <div className="mb-10 text-center md:text-left">
              <h1 className="font-sans text-4xl md:text-5xl font-extrabold text-gray-950 dark:text-white tracking-tighter mb-2"><span className="text-emerald-700 dark:text-[#6ee7b7]">Smart Financial</span> Hub</h1>
              <p className="text-gray-900 dark:text-gray-300 max-w-2xl text-sm md:text-base font-serif italic tracking-wide font-medium">AI-driven financial insights tailored for your harvest cycle.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
              <div className="lg:col-span-3 flex flex-col space-y-6">
                <div className="glass-panel bg-white/80 dark:bg-[rgba(30,41,35,0.4)] p-6 rounded-2xl h-full flex flex-col justify-between hover:border-emerald-500/30 transition-colors duration-300">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-gray-950 dark:text-gray-400 font-bold">Credit Lines</h2>
                      <span className="material-icons-round text-gray-950 dark:text-white opacity-80">credit_card</span>
                    </div>
                    <div className="space-y-4">
                      <div className="group cursor-pointer">
                        <div className="flex justify-between items-baseline mb-1">
                          <span className="font-medium text-gray-800 dark:text-gray-200">KCC Loan</span>
                          <span className="text-xs text-gray-950 dark:text-white font-bold tracking-widest">ACTIVE</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-1">
                          <div className="bg-emerald-600 dark:bg-[#6ee7b7] h-1.5 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)]" style={{ width: '75%' }}></div>
                        </div>
                        <p className="text-xs text-gray-950 dark:text-gray-400 group-hover:underline transition-colors font-bold">₹1.5L utilized of ₹2.0L</p>
                      </div>
                      <div className="pt-4 border-t border-gray-200 dark:border-gray-700/50 group cursor-pointer">
                        <div className="flex justify-between items-baseline mb-1">
                          <span className="font-bold text-gray-950 dark:text-gray-200">Equipment Finance</span>
                          <span className="text-xs text-gray-700 dark:text-gray-500 font-bold tracking-widest">PENDING</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-1">
                          <div className="bg-emerald-500/40 dark:bg-emerald-500/20 h-1.5 rounded-full" style={{ width: "40%" }}></div>
                        </div>
                        <p className="text-xs text-gray-950 dark:text-gray-400 font-bold">Application in review</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8">
                    <button className="w-full py-3 rounded-xl border border-dashed border-gray-400 dark:border-gray-600 text-gray-600 dark:text-gray-300 text-sm hover:bg-black/5 dark:hover:bg-white/5 hover:border-gray-950 dark:hover:border-white transition-all flex items-center justify-center gap-2">
                      <span className="material-icons-round text-base">add</span> Apply New Line
                    </button>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="glass-panel bg-white/90 dark:bg-[rgba(30,41,35,0.4)] p-8 rounded-2xl h-full flex flex-col items-center justify-center relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-gray-500/5 via-transparent to-transparent pointer-events-none"></div>
                  <span className="material-icons-round absolute top-6 right-6 text-gray-800 dark:text-gray-600 text-2xl font-bold">info_outline</span>
                  <h2 className="font-display text-lg uppercase tracking-widest text-gray-950 dark:text-gray-400 mb-8 z-10 font-bold">Financial Readiness Score</h2>
                  <div className="relative w-64 h-64 mb-6 z-10">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle className="text-gray-200 dark:text-gray-800" cx="50" cy="50" fill="none" r="45" stroke="currentColor" strokeWidth="8"></circle>
                      <circle className="text-emerald-600 dark:text-[#6ee7b7] gauge-circle shadow-[0_0_25px_rgba(110,231,183,0.3)]" cx="50" cy="50" fill="none" r="45" stroke="currentColor" strokeLinecap="round" strokeWidth="8"></circle>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-6xl font-display font-bold text-gray-900 dark:text-white">785</span>
                      <span className="text-sm font-medium text-emerald-600 dark:text-[#6ee7b7] mt-1">EXCELLENT</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-8 w-full max-w-md z-10">
                    <div className="text-center">
                      <p className="text-xs text-gray-900 dark:text-gray-400 uppercase tracking-wide mb-1 font-bold">Interest Saving</p>
                      <p className="text-xl font-bold text-gray-800 dark:text-gray-200">₹12,450</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-900 dark:text-gray-400 uppercase tracking-wide mb-1 font-bold">Repayment Date</p>
                      <p className="text-xl font-bold text-gray-800 dark:text-gray-200">12 Oct</p>
                    </div>
                  </div>
                  <div className="absolute bottom-[-20px] left-[-20px] opacity-10 dark:opacity-5 pointer-events-none rotate-12">
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

              <div className="lg:col-span-3 flex flex-col space-y-6">
                <div className="glass-panel bg-white/80 dark:bg-[rgba(30,41,35,0.4)] p-6 rounded-2xl flex-grow hover:border-emerald-500/30 transition-colors duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-gray-950 dark:text-gray-400 font-bold">Market Rates</h2>
                    <span className="material-icons-round text-gray-950 dark:text-white opacity-80">trending_up</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-white/50 dark:bg-white/5 border border-transparent hover:border-emerald-500/30 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-950 dark:text-white font-bold text-[10px]">SBI</div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Agri Gold</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">7.2%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-white/50 dark:bg-white/5 border border-transparent hover:border-emerald-500/30 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-950 dark:text-white font-bold text-[10px]">HDFC</div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Kisan Flexi</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">8.1%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-white/50 dark:bg-white/5 border border-transparent hover:border-emerald-500/30 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-950 dark:text-white font-bold text-[10px]">BOB</div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Mitra</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">7.4%</span>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700/50">
                    <p className="text-[10px] text-gray-500 text-center">Rates updated real-time via RBI API</p>
                  </div>
                </div>
                <div className="glass-panel bg-emerald-600 dark:bg-[#6ee7b7] p-6 rounded-2xl relative overflow-hidden group cursor-pointer transition-transform hover:-translate-y-1">
                  <div className="absolute -right-4 -top-4 w-20 h-20 bg-white opacity-20 blur-2xl rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2 text-white dark:text-black">
                      <span className="material-icons-round">bolt</span>
                      <h3 className="font-bold text-lg">Instant Advisory</h3>
                    </div>
                    <p className="text-emerald-100 dark:text-gray-800 text-sm mb-4 leading-relaxed">AI suggests refinancing your KCC loan to save ₹3,200 annually.</p>
                    <button className="bg-white dark:bg-black text-emerald-600 dark:text-[#6ee7b7] px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:shadow-lg transition-all flex items-center gap-1">
                      View Plan <span className="material-icons-round text-sm">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-12 mt-2">
                <div className="glass-panel bg-white/80 dark:bg-[rgba(30,41,35,0.4)] p-6 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-gray-950 dark:text-gray-400 font-bold">Recent Transactions</h2>
                    <button className="text-xs text-emerald-600 dark:text-[#6ee7b7] font-medium hover:underline">View All</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-xs text-gray-950 dark:text-gray-400 border-b border-gray-300 dark:border-gray-700/50 font-bold">
                          <th className="font-normal py-3">Transaction</th>
                          <th className="font-normal py-3">Category</th>
                          <th className="font-normal py-3">Date</th>
                          <th className="font-normal py-3 text-right">Amount</th>
                          <th className="font-normal py-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        <tr className="group hover:bg-white/30 dark:hover:bg-white/5 transition-colors">
                          <td className="py-3 pr-4 font-medium text-gray-800 dark:text-gray-200 flex items-center gap-3">
                            <div className="p-1.5 rounded bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                              <span className="material-icons-round text-sm">agriculture</span>
                            </div>
                            Seed Purchase (Rabi)
                          </td>
                          <td className="py-3 text-gray-950 dark:text-gray-400 font-bold">Inventory</td>
                          <td className="py-3 text-gray-950 dark:text-gray-400 font-bold">Oct 24, 2023</td>
                          <td className="py-3 text-right font-mono text-gray-800 dark:text-gray-200">- ₹12,500.00</td>
                          <td className="py-3 text-center">
                            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">COMPLETED</span>
                          </td>
                        </tr>
                        <tr className="group hover:bg-white/30 dark:hover:bg-white/5 transition-colors">
                          <td className="py-3 pr-4 font-medium text-gray-800 dark:text-gray-200 flex items-center gap-3">
                            <div className="p-1.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                              <span className="material-icons-round text-sm">water_drop</span>
                            </div>
                            Irrigation Subsidy
                          </td>
                          <td className="py-3 text-gray-950 dark:text-gray-400 font-bold">Govt Scheme</td>
                          <td className="py-3 text-gray-950 dark:text-gray-400 font-bold">Oct 20, 2023</td>
                          <td className="py-3 text-right font-mono text-emerald-600 dark:text-[#6ee7b7]">+ ₹4,000.00</td>
                          <td className="py-3 text-center">
                            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">RECEIVED</span>
                          </td>
                        </tr>
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
  );
}
