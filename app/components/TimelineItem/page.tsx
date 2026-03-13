"use client";

import {
  motion,
  useScroll,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from "framer-motion";
import { useRef } from "react";

export default function TimelineItem({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const distance = useMotionValue(0);

  useMotionValueEvent(scrollY, "change", () => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const elementCenter = rect.top + rect.height / 2;
    const viewportCenter = window.innerHeight / 2;

    const diff = Math.abs(viewportCenter - elementCenter);
    distance.set(diff);
  });

  const opacity = useTransform(distance, [0, 400], [1, 0]);
  const scale = useTransform(distance, [0, 400], [1, 0.9]);
  //const lineScale = useTransform(distance, [0, 400], [1, 0]);
  const dotScale = useTransform(distance, [0, 400], [1.3, 0.8]);

  return (
    <div className="relative w-full flex justify-center py-16 md:py-24 lg:py-32">

      {/* Horizontal Line */}
      <motion.div
        style={{ opacity }}
        className="
            absolute 
            left-24 
            top-1/2 
            h-[2px] 
            bg-white 
            origin-left 
            z-0
            w-[calc(50%-394px)]
        "
      />

      {/* Dot */}
      <motion.div
        style={{ scale: dotScale, opacity }}
        className="absolute left-[85px] top-[50%] -translate-y-1/2 w-6 h-6 rounded-full bg-white"
      />

      {/* Card */}
      <motion.div
        ref={ref}
        style={{ opacity }}
        className="relative bg-zinc-900 p-10 rounded-2xl w-[600px] text-center z-20 border border-white/20"
      >
        <h2 className="text-2xl mb-4">{title}</h2>
        <p>{children}</p>
      </motion.div>
    </div>
  );
}