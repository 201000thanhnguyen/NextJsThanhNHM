"use client";

import {
  motion,
  useScroll,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from "framer-motion";
import { useRef } from "react";

export default function CenterFocus({
  children,
}: {
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
  const scale = useTransform(distance, [0, 400], [1, 1]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, scale }}
      className="transition-all duration-300"
    >
      {children}
    </motion.div>
  );
}