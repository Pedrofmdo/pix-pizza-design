"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Revelação no scroll. Sobe pouco (16px) de propósito: o movimento acompanha
 * a leitura em vez de disputar com ela.
 */
export function Revelar({
  children,
  atraso = 0,
  className,
}: {
  children: ReactNode;
  atraso?: number;
  className?: string;
}) {
  const semMovimento = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={semMovimento ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.5, delay: atraso, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
