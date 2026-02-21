"use client";


import { useTheme } from "@/context/ThemeContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";

export default function AdvisoryPage() {
  const { theme } = useTheme();

  return (
    <ProtectedRoute>
      <div className={theme === "dark" ? "dark" : ""}>
        <div className="bg-[#f3f4f6] dark:bg-[#0f1110] text-gray-800 dark:text-gray-200 font-sans antialiased min-h-screen relative overflow-x-hidden selection:bg-[#6ee7b7] selection:text-black">
          {/* Scrollbar styles */}
          <style jsx global>{`
          ::-webkit-scrollbar { width: 8px; }
          ::-webkit-scrollbar-track { background: #0f1110; }
          ::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
          ::-webkit-scrollbar-thumb:hover { background: #444; }
          .glass-panel {
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          @keyframes dash {
            from { stroke-dashoffset: 283; }
            to { stroke-dashoffset: 107; }
          }
          .gauge-circle {
            stroke-dasharray: 283;
            stroke-dashoffset: 283;
            animation: dash 1.5s ease-out forwards;
          }
          @keyframes progress {
            from { width: 0; }
          }
          .animate-progress {
            animation: progress 1s ease-out forwards;
          }
          @keyframes chart-grow {
            from { height: 0; }
          }
          .chart-bar {
            animation: chart-grow 0.6s ease-out forwards;
            transition: background-color 0.2s;
          }
          .grid-bg {
            background-size: 40px 40px;
            background-image:
              linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          }
        `}</style>

          {/* Background */}
          <div className="fixed inset-0 z-0">
            <img
              alt="Golden wheat field at sunrise"
              className="w-full h-full object-cover opacity-40 transition-opacity duration-700"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyqqgvDwY3DiUlQpMrJonrI0xYT1ufkIsbqmm1pxWOmv3C9urkFRsAg4N7QJQEJnWhWUfk7sO3VOEUindtx9W5egYMUJ04KUoU9SamYF-bx5-dvdQQPPwNtdhd24hbFYfKwALxqmoDVxtRB7EBVMydqX3vxYgVG1Wn-3PL1Dyzd4RnIyUmfN0iQ_ebMap_h7VALr78tyxGLO_mlb1sn6HDCw8QN6PkvaJ2IDl_0LjQ_READU3-lRUB2i5j3C3dMRO0wdT7f2wD_HY"
            />
            <div className="absolute inset-0 bg-white/50 dark:bg-[#0f1110]/80 transition-colors duration-700"></div>
            <div className="absolute inset-0 grid-bg pointer-events-none opacity-20"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col min-h-screen">
            {/* Header */}
            <Header />

            {/* Main */}
            <main className="flex-grow w-full max-w-[1400px] mx-auto px-8 pb-12 pt-4 relative z-10">
              {/* Page Title */}
              <div className="mb-10 text-center md:text-left">
                <h1 className="font-sans text-4xl md:text-5xl font-extrabold text-gray-950 dark:text-white tracking-tighter mb-2">
                  <span className="text-emerald-700 dark:text-[#6ee7b7]">Weather & Climate</span> Advisory
                </h1>
                <p className="text-gray-900 dark:text-gray-300 max-w-2xl text-sm md:text-base tracking-wide font-medium">
                  Real-time hyperlocal forecasts and AI-driven sowing recommendations.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Card 1: Current Weather */}
                <div className="lg:col-span-4 flex flex-col space-y-6">
                  <div className="glass-panel bg-white/80 dark:bg-[rgba(30,41,35,0.4)] p-8 rounded-2xl h-full flex flex-col hover:border-emerald-500/30 transition-colors duration-300 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-32 bg-yellow-400/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-yellow-400/20 transition-all" />
                    <div className="flex items-center justify-between mb-8 z-10">
                      <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-gray-950 dark:text-gray-400 font-bold">Current Weather</h2>
                      <div className="px-2 py-1 rounded-md bg-green-100 dark:bg-green-900/30 text-[10px] font-bold text-green-700 dark:text-green-400 uppercase tracking-wide">Live</div>
                    </div>
                    <div className="flex-grow flex flex-col justify-center z-10">
                      <div className="flex items-center gap-6 mb-8">
                        <span className="material-symbols-outlined text-7xl text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.4)] animate-pulse" style={{ fontSize: "4.5rem" }}>sunny</span>
                        <div>
                          <span className="text-6xl font-display font-bold text-gray-950 dark:text-white tracking-tighter">32°C</span>
                          <p className="text-lg text-gray-950 dark:text-gray-300 font-bold">Sunny &amp; Clear Sky</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        {/* Humidity */}
                        <div className="flex justify-between items-center p-4 rounded-xl bg-white/40 dark:bg-white/5 border border-white/50 dark:border-white/10 shadow-sm backdrop-blur-sm">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                              <span className="material-symbols-outlined text-xl">humidity_percentage</span>
                            </div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Humidity</span>
                          </div>
                          <span className="text-lg font-bold text-gray-900 dark:text-white">48%</span>
                        </div>
                        {/* Wind */}
                        <div className="flex justify-between items-center p-4 rounded-xl bg-white/40 dark:bg-white/5 border border-white/50 dark:border-white/10 shadow-sm backdrop-blur-sm">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-800 dark:text-gray-400">
                              <span className="material-symbols-outlined text-xl font-bold">air</span>
                            </div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Wind</span>
                          </div>
                          <span className="text-lg font-bold text-gray-900 dark:text-white">12 km/h</span>
                        </div>
                        {/* UV Index */}
                        <div className="flex justify-between items-center p-4 rounded-xl bg-white/40 dark:bg-white/5 border border-white/50 dark:border-white/10 shadow-sm backdrop-blur-sm">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg text-orange-600 dark:text-orange-400">
                              <span className="material-symbols-outlined text-xl">light_mode</span>
                            </div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">UV Index</span>
                          </div>
                          <span className="text-lg font-bold text-orange-600 dark:text-orange-400">High</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 2: Soil Moisture Gauge */}
                <div className="lg:col-span-5">
                  <div className="glass-panel bg-white/90 dark:bg-[rgba(30,41,35,0.4)] p-8 rounded-2xl h-full flex flex-col items-center justify-center relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent pointer-events-none" />
                    <div className="w-full flex justify-between items-start mb-6 z-10">
                      <div>
                        <h2 className="font-display text-sm uppercase tracking-widest text-gray-950 dark:text-gray-400 mb-1 font-bold">Soil Moisture</h2>
                        <p className="text-xs text-emerald-700 dark:text-[#6ee7b7] font-mono font-bold">Sensor ID: #AG-8834</p>
                      </div>
                      <span className="material-symbols-outlined text-gray-800 dark:text-gray-600 text-2xl font-bold">sensors</span>
                    </div>
                    {/* Gauge */}
                    <div className="relative w-64 h-64 mb-8 z-10">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle className="text-gray-200 dark:text-gray-800" cx="50" cy="50" fill="none" r="45" stroke="currentColor" strokeWidth="6" />
                        <circle
                          className="text-emerald-500 dark:text-emerald-400 gauge-circle"
                          cx="50" cy="50" fill="none" r="45"
                          stroke="currentColor" strokeLinecap="round" strokeWidth="6"
                          style={{ strokeDashoffset: 107 }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="material-symbols-outlined text-4xl text-emerald-500 dark:text-emerald-400 mb-1">water_drop</span>
                        <span className="text-5xl font-display font-bold text-gray-950 dark:text-white">62<span className="text-2xl align-top text-gray-700">%</span></span>
                        <span className="text-xs font-bold text-gray-800 dark:text-gray-400 mt-2 uppercase tracking-wide">Saturation</span>
                      </div>
                    </div>
                    {/* Hydration bar chart */}
                    <div className="w-full max-w-sm z-10">
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-xs font-bold text-gray-900 dark:text-gray-400 uppercase tracking-wider">Hydration Status</span>
                        <span className="text-xs font-bold text-gray-950 dark:text-white">Optimal</span>
                      </div>
                      <div className="flex gap-1 h-12 items-end">
                        <div className="w-full bg-blue-400/30 rounded-t-sm chart-bar" style={{ height: "40%" }} />
                        <div className="w-full bg-blue-400/40 rounded-t-sm chart-bar" style={{ height: "50%" }} />
                        <div className="w-full bg-blue-400/60 rounded-t-sm chart-bar" style={{ height: "30%" }} />
                        <div className="w-full bg-blue-400/80 rounded-t-sm chart-bar" style={{ height: "60%" }} />
                        <div className="w-full bg-blue-500 rounded-t-sm chart-bar relative group/bar" style={{ height: "62%" }}>
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-black text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-20">Current</div>
                        </div>
                        <div className="w-full bg-blue-400/40 rounded-t-sm chart-bar" style={{ height: "55%" }} />
                        <div className="w-full bg-blue-400/20 rounded-t-sm chart-bar" style={{ height: "45%" }} />
                      </div>
                      <div className="flex justify-between mt-1 text-[10px] text-gray-950 dark:text-gray-400 font-mono font-bold">
                        <span>-3H</span><span>NOW</span><span>+3H</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 3: Field Vitals + AI Harvest Window */}
                <div className="lg:col-span-3 flex flex-col space-y-6">
                  {/* Field Vitals */}
                  <div className="glass-panel bg-white/80 dark:bg-[rgba(30,41,35,0.4)] p-6 rounded-2xl flex flex-col hover:border-emerald-500/30 transition-colors duration-300">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-gray-950 dark:text-gray-400 font-bold">Field Vitals</h2>
                      <span className="material-symbols-outlined text-emerald-700 dark:text-[#6ee7b7]">vital_signs</span>
                    </div>
                    <div className="space-y-5">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs font-bold text-gray-900 dark:text-gray-300">Nitrogen Level</span>
                          <span className="text-xs font-bold text-gray-950 dark:text-white">Good</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-white/10 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-emerald-500 h-1.5 rounded-full animate-progress" style={{ width: "75%" }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs font-bold text-gray-900 dark:text-gray-300">Soil pH</span>
                          <span className="text-xs font-bold text-gray-950 dark:text-white">6.8 Neutral</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-white/10 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-blue-500 h-1.5 rounded-full animate-progress" style={{ width: "55%" }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Pest Risk</span>
                          <span className="text-xs font-bold text-red-500">Low</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-white/10 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-red-400 h-1.5 rounded-full animate-progress" style={{ width: "15%" }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI Harvest Window */}
                  <div className="glass-panel bg-gradient-to-b from-white/90 to-white/70 dark:from-[rgba(30,41,35,0.4)] dark:to-[rgba(30,41,35,0.4)] p-6 rounded-2xl flex-grow flex flex-col relative overflow-hidden border-emerald-500/20">
                    <div className="absolute top-0 right-0 p-16 bg-emerald-500/5 blur-3xl rounded-full pointer-events-none" />
                    <div className="flex items-center justify-between mb-4 z-10">
                      <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-gray-950 dark:text-gray-400 font-bold">AI Harvest Window</h2>
                      <span className="material-symbols-outlined text-purple-700 dark:text-purple-400">psychology</span>
                    </div>
                    <div className="bg-white/50 dark:bg-black/20 rounded-xl p-4 border border-white/40 dark:border-white/5 backdrop-blur-sm z-10 flex-grow flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                          <span className="material-symbols-outlined text-xl">analytics</span>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-900 dark:text-gray-500 uppercase tracking-wide font-bold">Confidence Score</p>
                          <p className="text-2xl font-bold text-gray-950 dark:text-white">94%</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                        Neural analysis suggests optimal harvest conditions approaching. Soil moisture stability indicates peak yield potential in{" "}
                        <span className="font-bold text-gray-900 dark:text-white">4-5 days</span>.
                      </p>
                    </div>
                    <button className="w-full mt-4 py-3 rounded-xl bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black text-sm font-medium transition-all shadow-lg flex items-center justify-center gap-2 z-10">
                      <span>Analysis Details</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>
                </div>

                {/* Card 4: Historical Rainfall Chart */}
                <div className="lg:col-span-12 mt-2">
                  <div className="glass-panel bg-white/80 dark:bg-[rgba(30,41,35,0.4)] p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-gray-950 dark:text-gray-400 font-bold">Historical Rainfall Data</h2>
                        <p className="text-xs text-gray-950 dark:text-gray-400 mt-1 font-bold">Last 6 Months Precipitation Levels (mm)</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-3 py-1 text-xs rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-[#6ee7b7] font-medium">6M</button>
                        <button className="px-3 py-1 text-xs rounded-full hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 transition-colors">1Y</button>
                        <button className="px-3 py-1 text-xs rounded-full hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 transition-colors">ALL</button>
                      </div>
                    </div>
                    <div className="h-48 w-full flex items-end justify-between gap-2 md:gap-4 px-2 relative">
                      {/* Y-axis labels */}
                      <div className="hidden md:flex flex-col justify-between h-full text-[10px] text-gray-400 py-1 absolute left-0">
                        <span>100mm</span>
                        <span>50mm</span>
                        <span>0mm</span>
                      </div>
                      {/* Bars */}
                      {[
                        { month: "MAY", height: "45%", mm: "45mm", highlight: false },
                        { month: "JUN", height: "12%", mm: "12mm", highlight: false },
                        { month: "JUL", height: "85%", mm: "85mm", highlight: false },
                        { month: "AUG", height: "90%", mm: "120mm", highlight: true },
                        { month: "SEP", height: "65%", mm: "65mm", highlight: false },
                        { month: "OCT", height: "30%", mm: "30mm", highlight: false },
                      ].map((bar) => (
                        <div key={bar.month} className="group flex flex-col items-center gap-2 w-full h-full justify-end relative">
                          <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-xs px-2 py-1 rounded z-10">{bar.mm}</div>
                          <div
                            className={`w-full max-w-[40px] rounded-t-sm chart-bar ${bar.highlight
                              ? "bg-emerald-400 dark:bg-[#6ee7b7] shadow-[0_0_15px_rgba(110,231,183,0.3)]"
                              : "bg-blue-200 dark:bg-blue-900/30 group-hover:bg-blue-300 dark:group-hover:bg-blue-800/50 transition-colors"
                              }`}
                            style={{ height: bar.height }}
                          />
                          <span className={`text-[10px] font-mono ${bar.highlight ? "text-gray-800 dark:text-white font-bold" : "text-gray-500 dark:text-gray-400"}`}>
                            {bar.month}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </main>

            {/* Footer */}
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
    </ProtectedRoute>
  );
}
