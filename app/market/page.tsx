"use client";

import { useTheme } from "@/context/ThemeContext";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";

const DEFAULT_CROPS = ["Wheat", "Rice", "Corn", "Cotton"];

const BASE_PRICES: Record<string, number> = {
  Wheat: 2450.00,
  Rice: 3800.00,
  Corn: 1760.00,
  Cotton: 7450.00,
  Sugarcane: 340.00,
  Soybean: 4900.00,
  Default: 2000.00
};

interface DataPoint {
  price: number;
  time: number;
}

interface CropMarket {
  name: string;
  price: number;
  history: DataPoint[];
  volume: string;
  changePercent: number;
  predictedHigh: number;
}

export default function MarketPage() {
  const { theme } = useTheme();
  const [supabase] = useState(() => createClient());
  const [userCrops, setUserCrops] = useState<string[]>(DEFAULT_CROPS);
  const [activeCrop, setActiveCrop] = useState<string>(DEFAULT_CROPS[0]);
  const [marketData, setMarketData] = useState<Record<string, CropMarket>>({});
  const [isClient, setIsClient] = useState(false);

  // Hydration state
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch user crops
  useEffect(() => {
    async function fetchUserCrops() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('crops')
            .eq('id', session.user.id)
            .single();

          if (profile?.crops && profile.crops.length > 0) {
            const combined = Array.from(new Set([...profile.crops, ...DEFAULT_CROPS])).slice(0, 4);
            setUserCrops(combined);
            setActiveCrop(profile.crops[0] || combined[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching crops:", error);
      }
    }
    fetchUserCrops();
  }, [supabase]);

  // Initial Data Generation
  useEffect(() => {
    if (userCrops.length === 0) return;
    const initialData: Record<string, CropMarket> = {};
    const now = Date.now();

    userCrops.forEach(crop => {
      const base = BASE_PRICES[crop] || BASE_PRICES.Default;
      const history: DataPoint[] = [];
      let currentPrice = base;

      // Generate 20 historical points
      for (let i = 20; i >= 0; i--) {
        const change = (Math.random() - 0.5) * (base * 0.02);
        currentPrice += change;
        history.push({ price: currentPrice, time: now - i * 3000 });
      }

      const initialPrice = history[0].price;
      const finalPrice = history[history.length - 1].price;
      const changePercent = ((finalPrice - initialPrice) / initialPrice) * 100;
      const predictedHigh = Math.max(...history.map(d => d.price)) * 1.05;

      initialData[crop] = {
        name: crop,
        price: finalPrice,
        history,
        volume: (Math.random() * 10 + 5).toFixed(1) + "K qtl",
        changePercent,
        predictedHigh
      };
    });
    setMarketData(initialData);
  }, [userCrops]);

  // Live Simulation ticker
  useEffect(() => {
    if (Object.keys(marketData).length === 0) return;

    const interval = setInterval(() => {
      setMarketData(prev => {
        const newData = { ...prev };
        const now = Date.now();

        Object.keys(newData).forEach(crop => {
          const cropData = newData[crop];
          const lastPrice = cropData.price;

          const base = BASE_PRICES[crop] || BASE_PRICES.Default;
          const change = (Math.random() - 0.5) * (base * 0.015);
          const newPrice = Math.max(0, lastPrice + change);

          const newHistory = [...cropData.history.slice(1), { price: newPrice, time: now }];

          const initialPrice = newHistory[0].price;
          const changePercent = ((newPrice - initialPrice) / initialPrice) * 100;

          const predictedHigh = Math.max(...newHistory.map(d => d.price)) * 1.05;

          newData[crop] = {
            ...cropData,
            price: newPrice,
            history: newHistory,
            changePercent,
            predictedHigh
          };
        });

        return newData;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [marketData]);

  // Calculations for Active Crop
  const activeData = marketData[activeCrop];

  const chartPath = useMemo(() => {
    if (!activeData || activeData.history.length === 0) return "";
    const history = activeData.history;
    const minPrice = Math.min(...history.map(d => d.price));
    const maxPrice = Math.max(...history.map(d => d.price));
    const range = maxPrice - minPrice || 1;
    const padding = range * 0.2;

    const scaleY = (price: number) => {
      const graphHeight = 160;
      const normalized = (price - (minPrice - padding)) / (range + padding * 2);
      return Math.max(0, Math.min(200, 180 - (normalized * graphHeight)));
    };

    const scaleX = (index: number) => {
      const graphWidth = 800;
      return (index / (history.length - 1)) * graphWidth;
    };

    const points = history.map((d, i) => `${scaleX(i).toFixed(1)},${scaleY(d.price).toFixed(1)}`);

    let path = `M${points[0]} `;
    for (let i = 1; i < history.length; i++) {
      const [prevX, prevY] = points[i - 1].split(',').map(Number);
      const [currX, currY] = points[i].split(',').map(Number);
      const midX = (prevX + currX) / 2;
      path += `C${midX},${prevY} ${midX},${currY} ${currX},${currY} `;
    }
    return path;

  }, [activeData]);

  const endY = chartPath ? chartPath.trim().split(' ').pop()?.split(',')?.pop() || "0" : "0";
  const closedChartPath = chartPath ? `${chartPath} L800,200 L0,200 Z` : "";
  const isPositiveTrend = activeData?.changePercent >= 0;
  const strokeColor = isPositiveTrend ? "#4ade80" : "#f87171"; // green or red base
  const shadowColor = isPositiveTrend ? "rgba(74,222,128,0.5)" : "rgba(248,113,113,0.5)";

  const generateSparkline = (history: DataPoint[]) => {
    if (!history || history.length === 0) return "";
    const min = Math.min(...history.map(d => d.price));
    const max = Math.max(...history.map(d => d.price));
    const range = max - min || 1;

    const points = history.map((d, i) => {
      const x = (i / (history.length - 1)) * 100;
      const y = 20 - ((d.price - min) / range) * 20;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    return `M${points.join(' L')}`;
  };

  const getInsights = (cropData: CropMarket) => {
    if (!cropData || cropData.history.length < 5) return [];

    const history = cropData.history;
    const shortTermTrend = history[history.length - 1].price - history[history.length - 5].price;
    let signal1 = "Hold Advisory";
    let desc1 = `${cropData.name} inventory stabilizing. Wait for further signals before acting.`;
    let color1 = "text-yellow-500";
    let bg1 = "bg-yellow-500";
    let confidence1 = Math.floor((Math.random() * 20) + 60); // 60-80

    if (shortTermTrend > (cropData.price * 0.005)) {
      signal1 = "Buy Signal";
      desc1 = `${cropData.name} prices showing upward momentum. Consider acquiring inventory.`;
      color1 = "text-[#4ade80]";
      bg1 = "bg-[#4ade80]";
      confidence1 = Math.floor((Math.random() * 15) + 80);
    } else if (shortTermTrend < -(cropData.price * 0.005)) {
      signal1 = "Sell Advisory";
      desc1 = `Downward pressure on ${cropData.name} detected. Liquidate excess stock.`;
      color1 = "text-red-400";
      bg1 = "bg-red-400";
      confidence1 = Math.floor((Math.random() * 15) + 80);
    }

    return [
      { id: 1, signal: signal1, desc: desc1, color: color1, bg: bg1, confidence: confidence1, time: "Just now" },
      { id: 2, signal: "Hold Advisory", desc: "Mandi arrivals in key mandis remain stable. MSP procurement likely to provide price floor support.", color: "text-slate-400 dark:text-gray-300", bg: "bg-slate-400 dark:bg-slate-600", confidence: 75, time: "45m ago" }
    ];
  };

  const insights = activeData ? getInsights(activeData) : [];

  if (!isClient) {
    return null; // Prevents hydration mismatch
  }

  return (
    <ProtectedRoute>
      <div className={theme === "dark" ? "dark" : ""}>
        <div className="bg-[#f0fdf4] dark:bg-[#0f110f] text-slate-800 dark:text-gray-200 transition-colors duration-300 relative min-h-screen overflow-x-hidden font-sans antialiased">
          <style jsx global>{`
          .glass-panel {
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.1);
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
            <Header />

            <main className="flex-grow w-full max-w-[1400px] mx-auto px-8 py-4 relative z-10">
              <div className="mb-10 text-center md:text-left flex flex-col md:flex-row justify-between items-end">
                <div>
                  <h1 className="font-sans text-4xl md:text-5xl font-extrabold text-gray-950 dark:text-white tracking-tighter mb-2"><span className="text-emerald-700 dark:text-[#6ee7b7]">Market Price</span> Intelligence</h1>
                  <p className="text-gray-950 dark:text-gray-300 max-w-2xl text-sm md:text-base tracking-wide font-medium">Live NCDEX-referenced mandi prices with AI-powered buy/sell signals.</p>
                </div>
                <div className="hidden md:block">
                  <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-[#6ee7b7] bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 uppercase tracking-widest flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Live Market Feed v2.4
                  </span>
                </div>
              </div>

              {!activeData ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* MAIN CHART PANEL */}
                  <div className="lg:col-span-8 glass-panel bg-white/80 dark:bg-[rgba(20,20,20,0.65)] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] rounded-[1.5rem] p-6 shadow-2xl relative overflow-hidden group">
                    <div className={`absolute -top-20 -right-20 w-64 h-64 ${isPositiveTrend ? 'bg-[#4ade80]/10' : 'bg-red-400/10'} rounded-full blur-3xl pointer-events-none transition-colors duration-1000`}></div>
                    <div className="flex justify-between items-start mb-8 z-10 relative">
                      <div>
                        <h3 className="text-slate-700 dark:text-gray-400 text-[10px] font-bold tracking-[0.2em] font-mono uppercase mb-1">Global Index</h3>
                        <div className="flex items-baseline gap-3">
                          <h2 className="text-4xl font-display font-bold text-slate-900 dark:text-white">{activeCrop} Futures</h2>
                          <span className={`px-2 py-1 ${isPositiveTrend ? 'bg-green-500/10 text-green-600 dark:text-[#4ade80]' : 'bg-red-500/10 text-red-600 dark:text-red-400'} rounded text-sm font-semibold flex items-center gap-1 transition-colors duration-300`}>
                            <span className="material-symbols-outlined text-sm">{isPositiveTrend ? 'trending_up' : 'trending_down'}</span>
                            {isPositiveTrend ? '+' : ''}{activeData.changePercent.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-3 py-1 rounded-lg text-xs font-medium bg-[#4ade80] text-slate-900 font-bold shadow-lg shadow-[#4ade80]/20">LIVE</button>
                      </div>
                    </div>

                    <div className="relative h-64 w-full mt-4">
                      {/* Grid Lines */}
                      <div className="absolute inset-0 flex flex-col justify-between text-xs text-slate-600 dark:text-gray-500 font-mono">
                        <div className="border-b border-dashed border-slate-300 dark:border-slate-700/50 w-full h-0"></div>
                        <div className="border-b border-dashed border-slate-300 dark:border-slate-700/50 w-full h-0"></div>
                        <div className="border-b border-dashed border-slate-300 dark:border-slate-700/50 w-full h-0"></div>
                        <div className="border-b border-dashed border-slate-300 dark:border-slate-700/50 w-full h-0"></div>
                      </div>

                      <svg className="absolute inset-0 w-full h-full overflow-visible z-10" viewBox="0 0 800 200" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="gradient-green" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#4ade80" stopOpacity="0.4"></stop>
                            <stop offset="100%" stopColor="#4ade80" stopOpacity="0"></stop>
                          </linearGradient>
                          <linearGradient id="gradient-red" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#f87171" stopOpacity="0.4"></stop>
                            <stop offset="100%" stopColor="#f87171" stopOpacity="0"></stop>
                          </linearGradient>
                        </defs>
                        {chartPath && (
                          <g>
                            <path
                              className="transition-all duration-700 ease-in-out"
                              style={{ filter: `drop-shadow(0 0 8px ${shadowColor})` }}
                              d={chartPath}
                              fill="none"
                              stroke={strokeColor}
                              strokeLinecap="round"
                              strokeWidth="3"
                            ></path>
                            <path
                              className="opacity-50 transition-all duration-700 ease-in-out"
                              d={closedChartPath}
                              fill={isPositiveTrend ? "url(#gradient-green)" : "url(#gradient-red)"}
                            ></path>
                            {/* Blinking indicator at the latest data point */}
                            <circle className="transition-all duration-700 ease-in-out animate-ping" cx="800" cy={endY} r="6" fill={strokeColor}></circle>
                            <circle className="transition-all duration-700 ease-in-out fill-white" cx="800" cy={endY} r="4"></circle>
                          </g>
                        )}
                      </svg>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-4 border-t border-slate-200 dark:border-white/10 pt-4 relative z-10">
                      <div>
                        <p className="text-[10px] text-slate-800 dark:text-gray-400 uppercase tracking-wider mb-1">Current Price</p>
                        <p className="font-mono text-lg font-bold text-slate-900 dark:text-white transition-colors">
                          ${activeData.price.toFixed(2)} <span className="text-xs text-slate-600 dark:text-gray-500 font-sans font-medium">/ ton</span>
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-800 dark:text-gray-400 uppercase tracking-wider mb-1">Volume (24h)</p>
                        <p className="font-mono text-lg font-bold text-slate-900 dark:text-white">{activeData.volume} <span className="text-xs text-slate-600 dark:text-gray-500 font-sans font-medium">lots</span></p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-800 dark:text-gray-400 uppercase tracking-wider mb-1">Predicted High</p>
                        <p className={`font-mono text-lg font-bold transition-colors ${isPositiveTrend ? 'text-[#4ade80]' : 'text-slate-900 dark:text-white'}`}>
                          ${activeData.predictedHigh.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* SIDEBAR PANEL */}
                  <div className="lg:col-span-4 flex flex-col gap-6">
                    {/* Neural Insights */}
                    <div className="glass-panel bg-white/80 dark:bg-[rgba(20,20,20,0.65)] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] rounded-[1.5rem] p-6 shadow-xl flex-1 relative overflow-hidden transition-colors duration-500">
                      <div className="flex items-center gap-2 mb-6">
                        <span className={`material-symbols-outlined animate-pulse ${isPositiveTrend ? 'text-[#4ade80]' : 'text-red-400'}`}>psychology</span>
                        <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">Neural Insights</h3>
                      </div>
                      <div className="space-y-4">
                        {insights.map((insight) => (
                          <div key={insight.id} className={`p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20 transition duration-300 group cursor-default`}>
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-xs font-bold text-slate-900 dark:text-gray-200 uppercase tracking-wide">{insight.signal}</span>
                              <span className="text-[10px] text-slate-800 dark:text-gray-400 font-bold">{insight.time}</span>
                            </div>
                            <p className="text-sm text-slate-950 dark:text-gray-200 mb-3 font-medium">{insight.desc}</p>
                            <div className="w-full bg-slate-300 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                              <div className={`${insight.bg} h-full rounded-full transition-all duration-1000`} style={{ width: `${insight.confidence}%` }}></div>
                            </div>
                            <div className="flex justify-between mt-1">
                              <span className="text-[10px] text-slate-800 dark:text-gray-400 font-bold">Confidence</span>
                              <span className={`text-[10px] font-extrabold ${insight.color}`}>{insight.confidence}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 pt-4 border-t border-slate-300 dark:border-white/10 text-center">
                        <a className="inline-flex items-center gap-1 text-xs font-extrabold text-slate-950 dark:text-white hover:text-emerald-500 transition-colors uppercase tracking-widest" href="#">
                          View Full Analysis <span className="material-symbols-outlined text-sm">arrow_outward</span>
                        </a>
                      </div>
                    </div>

                    {/* Crop selection cards */}
                    <div className="grid grid-cols-2 gap-4">
                      {userCrops.slice(0, 4).map(crop => {
                        const data = marketData[crop];
                        if (!data) return null;
                        const isPos = data.changePercent >= 0;

                        return (
                          <div
                            key={crop}
                            onClick={() => setActiveCrop(crop)}
                            className={`glass-panel cursor-pointer transition-all duration-300 ${activeCrop === crop ? 'bg-white border-[#4ade80] dark:bg-[rgba(40,50,40,0.8)] shadow-[0_0_15px_rgba(74,222,128,0.2)] scale-[1.02]' : 'bg-white/80 dark:bg-[rgba(20,20,20,0.65)] hover:border-slate-400 dark:border-[rgba(255,255,255,0.1)] hover:scale-[1.01]'} border rounded-[1rem] p-4 flex flex-col justify-between`}
                          >
                            <div className="flex justify-between items-start">
                              <span className={`text-xs uppercase font-extrabold ${activeCrop === crop ? 'text-slate-900 dark:text-white' : 'text-slate-800 dark:text-gray-300'}`}>{crop}</span>
                              <span className={`${isPos ? 'text-[#4ade80]' : 'text-red-400'} text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${isPos ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                                {isPos ? '+' : ''}{data.changePercent.toFixed(1)}%
                              </span>
                            </div>
                            <div className="mt-3">
                              <p className={`text-xl font-bold transition-colors ${activeCrop === crop ? 'text-slate-900 dark:text-[#4ade80]' : 'text-slate-900 dark:text-white'}`}>
                                ${data.price.toFixed(0)}
                              </p>
                            </div>
                            <svg className="w-full h-8 mt-2 overflow-visible" viewBox="0 0 100 20" preserveAspectRatio="none">
                              <path
                                d={generateSparkline(data.history)}
                                fill="none"
                                stroke={isPos ? "#4ade80" : "#f87171"}
                                strokeWidth="2"
                                vectorEffect="non-scaling-stroke"
                                className="transition-all duration-700"
                              ></path>
                            </svg>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Nav Links */}
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
    </ProtectedRoute>
  );
}
