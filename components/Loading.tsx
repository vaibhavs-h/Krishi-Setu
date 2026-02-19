"use client";
import { motion } from "framer-motion";

export default function LoadingState() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
            boxShadow: [
              "0 0 0px rgba(16, 185, 129, 0)",
              "0 0 20px rgba(16, 185, 129, 0.5)",
              "0 0 0px rgba(16, 185, 129, 0)",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-4 h-4 rounded-full bg-emerald-500"
        />
        <motion.p
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-xs tracking-[0.2em] text-emerald-500/80 font-mono uppercase"
        >
          Germinating...
        </motion.p>
      </div>
    </div>
  );
}
