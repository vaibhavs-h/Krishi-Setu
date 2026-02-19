"use client";

import { useTheme } from "@/components/ThemeProvider";
import Link from "next/link";

export default function SchemesPage() {
  const { theme, toggleTheme } = useTheme();

  return (
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
          <header className="w-full px-8 py-6 flex justify-between items-center relative z-50">
            <Link href="/" className="glass-panel bg-white/70 dark:bg-[rgba(18,24,21,0.7)] px-6 py-3 rounded-full flex items-center space-x-2">
              <span className="font-display font-bold text-lg tracking-tight text-gray-900 dark:text-white"><span className="text-emerald-600 dark:text-[#6ee7b7]">Krishi</span> Setu</span>
              <span className="hidden sm:inline-block text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-400 pl-2 border-l border-gray-300 dark:border-gray-600">Cultivating Innovation</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-1 glass-panel bg-white/70 dark:bg-[rgba(18,24,21,0.7)] px-2 py-2 rounded-full">
              <Link href="/" className="px-4 py-1.5 text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">Dashboard</Link>
              <Link href="/market" className="px-4 py-1.5 text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">Markets</Link>
              <Link href="/financial" className="px-4 py-1.5 text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">Finance</Link>
              <Link href="/schemes" className="px-4 py-1.5 text-sm font-bold text-black dark:text-[#6ee7b7] bg-white/50 dark:bg-white/10 rounded-full shadow-sm">Schemes</Link>
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
            <div className="mb-10 text-center md:text-left flex flex-col md:flex-row justify-between items-end">
              <div>
                <h1 className="font-sans text-4xl md:text-5xl font-extrabold text-gray-950 dark:text-white tracking-tighter mb-2"><span className="text-emerald-700 dark:text-[#6ee7b7]">Scheme</span> Matcher</h1>
                <p className="text-gray-900 dark:text-gray-300 max-w-2xl text-sm md:text-base font-serif italic tracking-wide font-medium">Find government subsidies perfectly tailored to your farm profile.</p>
              </div>
              <div className="hidden md:block">
                <span className="text-xs font-mono text-emerald-600 dark:text-[#6ee7b7] bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                  ALGORITHMIC MATCHING v2.0
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-4 flex flex-col space-y-6">
                <div className="glass-panel bg-white/80 dark:bg-[rgba(30,41,35,0.4)] p-6 rounded-2xl h-full flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-gray-950 dark:text-gray-400 font-bold">Farm Profile</h2>
                    <span className="material-icons-round text-emerald-700 dark:text-[#6ee7b7]">tune</span>
                  </div>
                  <div className="space-y-6 flex-grow">
                    <div className="relative group">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="material-icons-round text-gray-400 group-focus-within:text-emerald-500 transition-colors">search</span>
                      </span>
                      <input className="w-full bg-white/50 dark:bg-black/20 border border-gray-300 dark:border-gray-700 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none" placeholder="Search specifically..." type="text" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-900 dark:text-gray-300 mb-2 uppercase tracking-wide">Crop Type</label>
                      <select className="w-full bg-white/50 dark:bg-black/20 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none">
                        <option>Wheat (Rabi)</option>
                        <option>Rice (Kharif)</option>
                        <option>Sugarcane</option>
                        <option>Cotton</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-900 dark:text-gray-300 mb-2 uppercase tracking-wide">Land Holding (Acres)</label>
                      <div className="relative">
                        <input className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500" max="50" min="1" type="range" defaultValue="12" />
                        <div className="flex justify-between text-xs text-gray-950 dark:text-gray-500 mt-2 font-mono font-bold">
                          <span>1 Acre</span>
                          <span className="text-emerald-700 dark:text-[#6ee7b7] font-bold">12 Acres</span>
                          <span>50+ Acres</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-900 dark:text-gray-300 mb-2 uppercase tracking-wide">Annual Income</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button className="px-4 py-2 rounded-lg border border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 text-sm font-medium text-center transition-all">
                          &lt; ₹2L
                        </button>
                        <button className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-300 text-sm font-medium text-center transition-all">
                          ₹2L - ₹5L
                        </button>
                        <button className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-300 text-sm font-medium text-center transition-all">
                          ₹5L - ₹10L
                        </button>
                        <button className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-300 text-sm font-medium text-center transition-all">
                          &gt; ₹10L
                        </button>
                      </div>
                    </div>
                  </div>
                  <button className="w-full mt-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-500/30 transition-all font-medium flex justify-center items-center gap-2 group">
                    <span className="material-icons-round group-hover:animate-pulse">auto_awesome</span>
                    Run AI Matcher
                  </button>
                </div>
              </div>

              <div className="lg:col-span-8 flex flex-col space-y-6">
                <div className="glass-panel bg-white/90 dark:bg-[rgba(30,41,35,0.4)] p-6 rounded-2xl relative overflow-hidden group hover:border-emerald-500/50 transition-all duration-300 shadow-xl">
                  <div className="absolute top-0 right-0 p-4">
                    <span className="inline-flex items-center gap-1 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-[#6ee7b7] border border-emerald-200 dark:border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider glow-badge">
                      <span className="material-icons-round text-sm">verified</span> 98% Match
                    </span>
                  </div>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-yellow-500 flex items-center justify-center text-white shadow-lg">
                        <span className="material-icons-round text-3xl">wb_sunny</span>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-xl font-display font-bold text-gray-950 dark:text-white mb-2">PM-Kusum Solar Pump Scheme</h3>
                      <p className="text-sm text-gray-900 dark:text-gray-300 mb-4 leading-relaxed font-medium">
                        Get up to <span className="text-emerald-700 dark:text-[#6ee7b7] font-bold">60% subsidy</span> on solar pump installation. Based on your land size (12 Acres) and lack of grid connectivity, this scheme offers high ROI by reducing diesel costs.
                      </p>
                      <div className="flex flex-wrap gap-4 mb-4">
                        <div className="flex items-center gap-2 text-xs text-gray-900 dark:text-gray-400 bg-gray-100 dark:bg-white/5 px-3 py-1.5 rounded-lg font-bold">
                          <span className="material-icons-round text-sm">schedule</span> Deadline: Nov 30
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-900 dark:text-gray-400 bg-gray-100 dark:bg-white/5 px-3 py-1.5 rounded-lg font-bold">
                          <span className="material-icons-round text-sm">attach_money</span> Max Benefit: ₹2.5L
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700/50 flex justify-between items-center">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 bg-gray-300 flex items-center justify-center text-[10px] font-bold">DK</div>
                      <div className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 bg-gray-400 flex items-center justify-center text-[10px] font-bold">RJ</div>
                      <div className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 bg-gray-800 text-white flex items-center justify-center text-[10px] font-bold">+42</div>
                      <span className="ml-4 text-xs text-gray-950 dark:text-gray-500 self-center font-bold">Farmers applied this week</span>
                    </div>
                    <button className="text-sm font-bold text-emerald-600 dark:text-[#6ee7b7] hover:underline flex items-center gap-1">
                      View Details <span className="material-icons-round text-sm">arrow_forward</span>
                    </button>
                  </div>
                </div>

                <div className="glass-panel bg-white/90 dark:bg-[rgba(30,41,35,0.4)] p-6 rounded-2xl relative overflow-hidden group hover:border-emerald-500/50 transition-all duration-300 shadow-xl">
                  <div className="absolute top-0 right-0 p-4">
                    <span className="inline-flex items-center gap-1 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-[#6ee7b7] border border-emerald-200 dark:border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider glow-badge">
                      <span className="material-icons-round text-sm">verified</span> 92% Match
                    </span>
                  </div>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white shadow-lg">
                        <span className="material-icons-round text-3xl">water_drop</span>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-xl font-display font-bold text-gray-950 dark:text-white mb-2">Micro Irrigation Fund</h3>
                      <p className="text-sm text-gray-900 dark:text-gray-300 mb-4 leading-relaxed font-medium">
                        Subsidy for drip and sprinkler irrigation systems. Highly recommended for your <span className="text-emerald-700 dark:text-[#6ee7b7] font-bold">Wheat</span> crop to optimize water usage during Rabi season.
                      </p>
                      <div className="flex flex-wrap gap-4 mb-4">
                        <div className="flex items-center gap-2 text-xs text-gray-900 dark:text-gray-400 bg-gray-100 dark:bg-white/5 px-3 py-1.5 rounded-lg font-bold">
                          <span className="material-icons-round text-sm">schedule</span> Deadline: Open
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-900 dark:text-gray-400 bg-gray-100 dark:bg-white/5 px-3 py-1.5 rounded-lg font-bold">
                          <span className="material-icons-round text-sm">attach_money</span> Max Benefit: ₹1.2L/ha
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700/50 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="material-icons-round text-yellow-500 text-sm">star</span>
                      <span className="text-xs font-bold text-gray-950 dark:text-gray-400">4.8/5 Rated by users</span>
                    </div>
                    <button className="text-sm font-bold text-emerald-600 dark:text-[#6ee7b7] hover:underline flex items-center gap-1">
                      View Details <span className="material-icons-round text-sm">arrow_forward</span>
                    </button>
                  </div>
                </div>

                <div className="glass-panel bg-white/90 dark:bg-[rgba(30,41,35,0.4)] p-6 rounded-2xl relative overflow-hidden group hover:border-emerald-500/50 transition-all duration-300 opacity-80 hover:opacity-100 shadow-xl">
                  <div className="absolute top-0 right-0 p-4">
                    <span className="inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      85% Match
                    </span>
                  </div>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-green-700 flex items-center justify-center text-white shadow-lg">
                        <span className="material-icons-round text-3xl">grass</span>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-xl font-display font-bold text-gray-950 dark:text-white mb-2">Soil Health Card Scheme</h3>
                      <p className="text-sm text-gray-900 dark:text-gray-300 mb-4 leading-relaxed font-medium">
                        Get your soil tested for macro and micro nutrients. Receive fertilizer recommendations tailored to your soil profile.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-12 mt-4">
                <div className="glass-panel bg-white/80 dark:bg-[rgba(30,41,35,0.4)] p-6 rounded-2xl shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-gray-950 dark:text-gray-400 font-bold">Recent Applications</h2>
                    <button className="text-xs text-emerald-600 dark:text-[#6ee7b7] font-medium hover:underline">History</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-xs text-gray-950 dark:text-gray-400 border-b border-gray-300 dark:border-gray-700/50 font-bold">
                          <th className="font-normal py-3">Scheme Name</th>
                          <th className="font-normal py-3">Reference ID</th>
                          <th className="font-normal py-3">Applied On</th>
                          <th className="font-normal py-3 text-right">Potential Benefit</th>
                          <th className="font-normal py-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        <tr className="group hover:bg-white/30 dark:hover:bg-white/5 transition-colors">
                          <td className="py-3 pr-4 font-medium text-gray-800 dark:text-gray-200 flex items-center gap-3">
                            <div className="p-1.5 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                              <span className="material-icons-round text-sm">agriculture</span>
                            </div>
                            Agri-Machinery Subsidy
                          </td>
                          <td className="py-3 text-gray-950 dark:text-gray-400 font-mono text-xs font-bold">#AGR-2023-8892</td>
                          <td className="py-3 text-gray-950 dark:text-gray-400 font-bold">Oct 15, 2023</td>
                          <td className="py-3 text-right font-mono text-gray-800 dark:text-gray-200">₹85,000</td>
                          <td className="py-3 text-center">
                            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">IN REVIEW</span>
                          </td>
                        </tr>
                        <tr className="group hover:bg-white/30 dark:hover:bg-white/5 transition-colors">
                          <td className="py-3 pr-4 font-medium text-gray-800 dark:text-gray-200 flex items-center gap-3">
                            <div className="p-1.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                              <span className="material-icons-round text-sm">water</span>
                            </div>
                            PM Krishi Sinchai
                          </td>
                          <td className="py-3 text-gray-950 dark:text-gray-400 font-mono text-xs font-bold">#PMKSY-9921-X</td>
                          <td className="py-3 text-gray-950 dark:text-gray-400 font-bold">Sep 02, 2023</td>
                          <td className="py-3 text-right font-mono text-gray-800 dark:text-gray-200">₹45,000</td>
                          <td className="py-3 text-center">
                            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">APPROVED</span>
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
