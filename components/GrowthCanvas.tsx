"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

const FRAME_COUNT = 157;

export default function GrowthCanvas({ onLoaded }: { onLoaded?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    mass: 1,
    stiffness: 80,
    damping: 20,
  });

  useEffect(() => {
    const loadImages = async () => {
      const promises = Array.from({ length: FRAME_COUNT }, (_, i) => {
        return new Promise<HTMLImageElement>((resolve) => {
          const img = new Image();
          img.src = `/growth-sequence/frame_${i}.jpg`;
          img.onload = () => resolve(img);
        });
      });

      const loadedImages = await Promise.all(promises);
      setImages(loadedImages);
      setIsLoaded(true);
      if (onLoaded) onLoaded();
    };

    loadImages();
  }, [onLoaded]);



  useEffect(() => {
    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas || images.length !== FRAME_COUNT) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Handle Resize
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      const progress = smoothProgress.get();
      const totalProgress = progress * (FRAME_COUNT - 1);
      const frameIndex = Math.floor(totalProgress);
      const nextFrameIndex = Math.min(frameIndex + 1, FRAME_COUNT - 1);
      const alpha = totalProgress - frameIndex; // The fractional part for interpolation

      const drawImageCover = (img: HTMLImageElement, opacity: number = 1) => {
        if (!img) return;

        ctx.globalAlpha = opacity;
        const w = window.innerWidth;
        const h = window.innerHeight;
        const imgRatio = img.width / img.height;
        const canvasRatio = w / h;

        let drawWidth = w;
        let drawHeight = h;
        let offsetX = 0;
        let offsetY = 0;

        if (imgRatio > canvasRatio) {
          drawHeight = h;
          drawWidth = h * imgRatio;
          offsetX = -(drawWidth - w) / 2;
        } else {
          drawWidth = w;
          drawHeight = w / imgRatio;
          offsetY = -(drawHeight - h) / 2;
        }

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      };

      // Clear
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // Render base frame
      drawImageCover(images[frameIndex], 1);

      // Render next frame with alpha for interpolation
      if (alpha > 0 && frameIndex !== nextFrameIndex) {
        drawImageCover(images[nextFrameIndex], alpha);
      }

      // Reset alpha
      ctx.globalAlpha = 1;
    };

    const unsubscribe = smoothProgress.on("change", () => {
      requestAnimationFrame(render);
    });

    // Initial render and resize listener
    render();
    window.addEventListener("resize", render);

    return () => {
      unsubscribe();
      window.removeEventListener("resize", render);
    };
  }, [smoothProgress, isLoaded, images]);

  const pulseColor = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [
      "rgba(16, 185, 129, 0.15)", // Emerald
      "rgba(16, 185, 129, 0.25)", // Emerald Deep
      "rgba(6, 182, 212, 0.25)",  // Cyan
      "rgba(245, 158, 11, 0.2)",  // Amber
      "rgba(16, 185, 129, 0.15)"  // Back to Emerald
    ]
  );

  if (!isLoaded) return null;

  return (
    <div className="fixed inset-0 z-0">
      {/* Primary Sharpened Canvas */}
      <canvas
        ref={canvasRef}
        className="block"
        style={{
          filter: 'contrast(1.1) brightness(1.02) saturate(1.1)',
        }}
      />

      {/* Bloom Overlay (Light Pass) */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-40 mix-blend-screen overflow-hidden"
        style={{ filter: 'blur(15px) brightness(1.5)' }}
      >
        <canvas
          ref={(el) => {
            if (el && canvasRef.current) {
              const ctx = el.getContext('2d');
              const mainCanvas = canvasRef.current;
              el.width = mainCanvas.width;
              el.height = mainCanvas.height;
              el.style.width = mainCanvas.style.width;
              el.style.height = mainCanvas.style.height;
              const render = () => {
                ctx?.drawImage(mainCanvas, 0, 0);
                requestAnimationFrame(render);
              };
              render();
            }
          }}
          className="block w-full h-full"
        />
      </div>

      {/* Bio-Luminescent Pulse Overlay */}
      <motion.div
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.02, 1]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: `radial-gradient(circle at center, ${pulseColor} 0%, transparent 70%)`,
          mixBlendMode: 'screen'
        }}
      />

      {/* Cinematic Vignette Overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background: `
            radial-gradient(circle at center, transparent 0%, rgba(2, 4, 2, 0) 35%, rgba(2, 4, 2, 0.9) 80%, rgba(2, 4, 2, 1) 100%),
            linear-gradient(to top, rgba(2, 4, 2, 1) 0%, rgba(2, 4, 2, 0.6) 10%, transparent 20%),
            linear-gradient(to bottom, rgba(2, 4, 2, 0.8) 0%, transparent 15%)
          `
        }}
      />
    </div>
  );
}
