"use client";

import { cn } from "@/utils/cn";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

interface AnimatedTitlesProps {
  titles: string[];
  className?: string;
}

export function AnimatedTitles({ titles, className }: AnimatedTitlesProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (titles.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % titles.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [titles.length]);

  if (titles.length === 0) return null;

  if (shouldReduceMotion || titles.length === 1) {
    return (
      <span className={cn("block text-primary", className)}>{titles[0]}</span>
    );
  }

  return (
    <span className={cn("relative inline-block overflow-hidden", className)}>
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="block text-primary"
        >
          {titles[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
