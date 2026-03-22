// ─── animations.js ────────────────────────────────────────────────────────────
// Shared animation primitives for the entire site.
// Import from any component for consistent motion language.

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

// ─── Easing curves ─────────────────────────────────────────────────────────────

export const EASE_OUT  = [0.16, 1, 0.3, 1];       // snappy deceleration
export const EASE_IN   = [0.7, 0, 0.84, 0];       // punch in
export const EASE_CIRC = [0.85, 0, 0.15, 1];      // smooth s-curve

// ─── Shared variants ───────────────────────────────────────────────────────────

export const fadeUp = (delay = 0, y = 32) => ({
  hidden: { opacity: 0, y },
  show:   { opacity: 1, y: 0, transition: { duration: 0.9, delay, ease: EASE_OUT } },
});

export const fadeIn = (delay = 0) => ({
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.75, delay, ease: EASE_OUT } },
});

export const slideUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 60, skewY: 1.5 },
  show:   { opacity: 1, y: 0, skewY: 0, transition: { duration: 1, delay, ease: EASE_OUT } },
});

export const scaleX = (delay = 0) => ({
  hidden: { scaleX: 0, originX: 0 },
  show:   { scaleX: 1, transition: { duration: 1.1, delay, ease: EASE_OUT } },
});

export const staggerContainer = (stagger = 0.12, delayChildren = 0.06) => ({
  hidden: {},
  show:   { transition: { staggerChildren: stagger, delayChildren } },
});

// ─── Page transition wrapper ───────────────────────────────────────────────────

export const PAGE_VARIANTS = {
  initial: { opacity: 0, y: 18 },
  enter:   { opacity: 1, y: 0,  transition: { duration: 0.85, ease: EASE_OUT } },
  exit:    { opacity: 0, y: -12, transition: { duration: 0.45, ease: EASE_IN  } },
};

// ─── Reusable Reveal component ────────────────────────────────────────────────

/**
 * Reveal — wraps any children with a scroll-triggered fade+slide animation.
 *
 * Props:
 *   delay    number   — stagger offset in seconds
 *   y        number   — vertical travel distance (px)
 *   once     boolean  — animate only on first view (default true)
 *   margin   string   — IntersectionObserver rootMargin
 *   as       string   — HTML tag ("div" | "section" | "span" | …)
 */
export function Reveal({
  children,
  delay = 0,
  y = 32,
  once = true,
  margin = "-72px",
  as = "div",
  style = {},
  className = "",
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin });
  const Tag = motion[as] || motion.div;

  return (
    <Tag
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.95, delay, ease: EASE_OUT }}
      style={style}
      className={className}
    >
      {children}
    </Tag>
  );
}

/**
 * RevealLine — animated horizontal rule that draws from left.
 */
export function RevealLine({ color = "rgba(15,15,15,0.1)", delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ scaleX: 0, originX: 0 }}
      animate={inView ? { scaleX: 1 } : {}}
      transition={{ duration: 1.1, delay, ease: EASE_OUT }}
      style={{ height: "1px", background: color }}
    />
  );
}

/**
 * SplitWords — splits text into individually animated words.
 * Each word emerges from below its baseline (overflow hidden clipping).
 */
export function SplitWords({ text, className = "", style = {} }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <span
          key={i}
          style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom" }}
        >
          <motion.span
            variants={{
              hidden: { y: "110%", opacity: 0, skewY: 2 },
              show:   { y: "0%",   opacity: 1, skewY: 0,
                        transition: { duration: 0.95, ease: EASE_OUT } },
            }}
            style={{ display: "inline-block", willChange: "transform", ...style }}
            className={className}
          >
            {word}{i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </>
  );
}

/**
 * StaggerGroup — wraps children that each carry `variants` with staggered timing.
 */
export function StaggerGroup({
  children,
  stagger = 0.1,
  delayChildren = 0.05,
  className = "",
  style = {},
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      variants={staggerContainer(stagger, delayChildren)}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}