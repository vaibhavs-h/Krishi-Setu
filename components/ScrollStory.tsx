"use client";

import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

const beats = [
  {
    id: "beat-a",
    start: 0,
    end: 0.2,
    title: "Krishi",
    highlight: "Setu",
    subtitle: "Cultivating Innovation, Harvesting Growth.",
    align: "center",
    isMain: true,
    theme: "neon",
  },
  {
    id: "beat-b",
    start: 0.25,
    end: 0.45,
    title: "Precision Monitoring",
    subtitle: "Real-time rhizosphere analysis and nutrient mapping.",
    align: "left",
    theme: "emerald",
  },
  {
    id: "beat-c",
    start: 0.5,
    end: 0.7,
    title: "Yield Optimization",
    subtitle: "Hyper-local growth forecasting via neural diagnostics.",
    align: "right",
    theme: "cyan",
  },
  {
    id: "beat-d",
    start: 0.75,
    end: 0.95,
    title: "Maximum Profitability",
    subtitle: "Harvest optimized. Global market parity reached.",
    align: "center",
    theme: "amber",
  },
];


function Beat({ data, scrollYProgress }: { data: typeof beats[0]; scrollYProgress: MotionValue<number> }) {
  // Main title stays visible until the dashboard reveal begins (0.95)
  const opacity = useTransform(
    scrollYProgress,
    data.isMain
      ? [data.start, data.start + 0.05, 0.95, 1.0]
      : [data.start, data.start + 0.05, data.end - 0.05, data.end],
    [0, 1, 1, 0]
  );

  // Background color remains adaptive
  const bgGradient = useTransform(
    scrollYProgress,
    [0, 0.3, 0.6, 0.9],
    [
      "rgba(2, 4, 2, 0.85)",       // Start
      "rgba(10, 20, 15, 0.8)",    // Neural Dark (Monitoring)
      "rgba(10, 20, 25, 0.8)",    // Neural Cyan (Optimization)
      "rgba(2, 4, 2, 0.85)"       // End (Dashboard)
    ]
  );

  // Position: Moves to top and stays centered
  const y = useTransform(
    scrollYProgress,
    data.isMain
      ? [0, 0.15]
      : [data.start, data.end],
    data.isMain ? [0, -window.innerHeight * 0.32] : [40, -40]
  );

  // Subtitle fades out for others, but stays fixed for the main title
  const subtitleOpacity = useTransform(
    scrollYProgress,
    data.isMain
      ? [data.start, data.start + 0.05]
      : [data.start, data.start + 0.05, data.end - 0.05, data.end],
    data.isMain ? [0, 1] : [0, 1, 1, 0]
  );

  const getAlignClass = (align: string) => {
    switch (align) {
      case "left":
        return "items-start text-left md:pl-20";
      case "right":
        return "items-end text-right md:pr-20";
      default:
        return "items-center text-center";
    }
  };

  const getThemeClasses = (theme: string) => {
    switch (theme) {
      case "emerald": return "bg-emerald-950/80 border-emerald-500/40 text-emerald-50";
      case "cyan": return "bg-cyan-950/80 border-cyan-500/40 text-cyan-50";
      case "amber": return "bg-amber-950/80 border-amber-500/40 text-amber-50";
      default: return ""; // Main handles its own background via style
    }
  };


  return (
    <motion.div
      style={{
        opacity,
        y,
        pointerEvents: "none"
      }}
      className={`fixed inset-0 flex flex-col justify-center px-6 ${getAlignClass(data.align)} ${data.isMain ? 'z-[100]' : 'z-10'}`}
    >
      <motion.div
        style={data.isMain ? { backgroundColor: bgGradient } : {}}
        className={`max-w-xl p-8 rounded-2xl border transition-all duration-500 backdrop-blur-xl ${getThemeClasses(data.theme || "neon")} ${data.isMain ? 'md:max-w-2xl border-[var(--neon-green)]/30 border-2 shadow-[0_0_30px_rgba(57,255,20,0.1)]' : 'border-white/10 shadow-2xl'}`}
      >
        <div className="flex flex-col gap-2 relative">
          {data.isMain && (
            <div className="absolute -top-12 -right-12 w-16 h-16 flex items-center justify-center opacity-40">
              <div className="absolute inset-0 rounded-full border border-[var(--neon-green)]/30 animate-[spin_4s_linear_infinite]"></div>
              <div className="w-2 h-2 bg-[var(--neon-green)] rounded-full shadow-[0_0_10px_var(--neon-green)]"></div>
            </div>
          )}
          {data.isMain ? (
            <h2 className="font-display text-5xl md:text-8xl font-bold tracking-tighter leading-none mb-2">
              <span className="text-white inline-block mr-4">
                {data.title}
              </span>
              <span className="text-[var(--neon-green)] inline-block drop-shadow-[0_0_15px_rgba(57,255,20,0.4)]">
                {data.highlight}
              </span>
            </h2>
          ) : (
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight mb-3 leading-none opacity-90">
              {data.title}
            </h2>
          )}
        </div>

        {/* Subtitle now fades out for ALL hovers, including the first one */}
        <motion.p
          style={{ opacity: subtitleOpacity }}
          className={`font-mono tracking-wide ${data.isMain ? 'text-lg md:text-xl text-gray-400' : 'text-base md:text-lg text-gray-300'}`}
        >
          <span className="text-[var(--neon-green)] mr-2">&gt;_</span>
          {data.subtitle}
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

export default function ScrollOverlays() {
  const { scrollYProgress } = useScroll();

  return (
    <div className="z-10 relative">
      {beats.map((beat) => (
        <Beat key={beat.id} data={beat} scrollYProgress={scrollYProgress} />
      ))}
    </div>
  );
}
