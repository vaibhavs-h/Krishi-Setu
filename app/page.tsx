"use client";

import { useState } from "react";
import GrowthCanvas from "@/components/GrowthCanvas";
import LoadingState from "@/components/Loading";
import Particles from "@/components/Particles";
import ScrollOverlays from "@/components/ScrollOverlays";
import DashboardOverlay from "@/components/DashboardOverlay";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const { scrollYProgress } = useScroll();
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

  return (
    <main className="relative bg-[#020402] min-h-screen selection:bg-[#39ff14] selection:text-black">
      <style jsx global>{`
        :root {
          --neon-green: #39ff14;
          --neon-green-glow: 0 0 10px rgba(57, 255, 20, 0.5);
        }
        .grid-bg {
          background-size: 40px 40px;
          background-image:
            linear-gradient(to right, rgba(57, 255, 20, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(57, 255, 20, 0.05) 1px, transparent 1px);
        }
      `}</style>
      {/* Loading Overlay */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            key="loader"
            className="z-[200] relative"
          >
            <LoadingState />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content - Only visible/scrollable after load? 
          Actually, we can let it sit there but maybe lock scroll. 
          For now, just let it be efficiently hidden by loader.
      */}

      {/* Scrollable Container */}
      <div className="relative h-[500vh]">
        {/* Fixed Background Elements */}

        <Particles />
        <GrowthCanvas onLoaded={() => setIsLoaded(true)} />

        {/* Floating UI / Overlays */}
        {isLoaded && <ScrollOverlays />}

        {/* Scroll Indicator at bottom of first screen */}
        {isLoaded && (
          <motion.div
            style={{ opacity: indicatorOpacity }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="fixed bottom-16 inset-x-0 z-20 flex flex-col items-center gap-4 pointer-events-none"
          >
            <div className="flex flex-col items-center gap-3">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-white bg-[rgba(15,25,20,0.8)] backdrop-blur-xl px-7 py-3 rounded-full border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                Scroll to Grow
              </span>
              <div className="relative w-5 h-8 border border-white/40 rounded-full flex justify-center p-1 bg-black/30 backdrop-blur-sm shadow-lg">
                <motion.div
                  animate={{
                    y: [0, 10, 0],
                    opacity: [0.3, 1, 0.3]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-1 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.6)]"
                />
              </div>
            </div>
          </motion.div>
        )}

        { /* Final Dashboard Overlay */}
        <DashboardOverlay scrollYProgress={scrollYProgress} />
        <div id="dashboard" className="absolute bottom-0 w-full h-1 pointer-events-none" />
      </div>

      {/* Footer / CTA at extremely deep scroll? 
          The GrowthCanvas covers the whole viewport fixed.
          So at the end of 500vh, we just stop?
          The loop says 157 frames. 
          At 100% scroll, we see the last frame.
      */}
    </main>
  );
}
