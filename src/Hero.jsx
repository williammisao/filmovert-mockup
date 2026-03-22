import { useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { EASE_OUT, SplitWords } from "./animations";

const CONTAINER = {
  hidden: {},
  show: { transition: { staggerChildren: 0.13, delayChildren: 0.15 } },
};

const FADE_UP = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE_OUT } },
};

const LINE = {
  hidden: { scaleX: 0, originX: 0 },
  show:   { scaleX: 1, transition: { duration: 1.1, ease: EASE_OUT } },
};

function CursorSpotlight() {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const bgX = useTransform(sx, [0, 1], ["10%", "90%"]);
  const bgY = useTransform(sy, [0, 1], ["10%", "90%"]);
  const [visible, setVisible] = useState(false);

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top)  / r.height);
  };

  return (
    <motion.div
      onMouseMove={onMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      style={{ position: "absolute", inset: 0, pointerEvents: "all" }}
    >
      <motion.div
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(700px circle at var(--sx) var(--sy), rgba(255,255,255,0.05) 0%, transparent 65%)",
          "--sx": bgX, "--sy": bgY,
        }}
      />
    </motion.div>
  );
}

export default function Hero({
  eyebrow = "Creative Studio — Est. 2024",
  lines   = ["We shape", "brands that", "last."],
  sub     = "Strategy, design, and technology — crafted with intention for companies that refuse to be ordinary.",
  cta     = { label: "See our work", href: "#work" },
  theme   = "light",
}) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const isDark = theme === "dark";
  const bg     = isDark ? "#0a0a0a" : "#f5f3ef";
  const ink    = isDark ? "#f0ede8" : "#0f0f0f";
  const muted  = isDark ? "rgba(240,237,232,0.38)" : "rgba(15,15,15,0.38)";
  const ctaBg  = isDark ? "#f0ede8" : "#0f0f0f";
  const ctaInk = isDark ? "#0a0a0a" : "#f5f3ef";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300&family=DM+Sans:wght@300;400&display=swap');

        .hero-root {
          position: relative;
          overflow: hidden;
          background: ${bg};
          /* Tall padding: nav height + generous top breathing room */
          padding: 14rem var(--px, 3.5rem) 8rem;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .hero-inner {
          max-width: var(--max-w, 1200px);
          margin: 0 auto;
          width: 100%;
          position: relative;
          z-index: 1;
        }

        /* Eyebrow — small, very spaced, high contrast muted */
        .hero-eyebrow {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: var(--t-micro, 0.65rem);
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: ${muted};
          margin-bottom: 3.5rem;     /* generous gap before headline */
          display: flex;
          align-items: center;
          gap: 0.9rem;
        }
        .hero-eyebrow-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: ${muted};
          flex-shrink: 0;
        }

        /* Display headline — maximum size and impact */
        .hero-hl {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: var(--t-display, clamp(4.5rem, 13vw, 12rem));
          line-height: 0.92;          /* ultra-tight for display sizes */
          letter-spacing: -0.03em;
          color: ${ink};
          margin: 0;
          display: block;
        }
        .hero-hl-dim {
          color: ${muted};
          font-style: italic;
        }

        /* Rule — breathing gap above and below */
        .hero-rule {
          height: 1px;
          background: rgba(15,15,15,0.1);
          margin: 5rem 0;            /* much more space around the rule */
          transform-origin: left;
        }

        /* Bottom row — sub and CTA */
        .hero-bottom {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 3rem;
          flex-wrap: wrap;
        }

        /* Sub — larger, more readable, wider max-width */
        .hero-sub {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: var(--t-body, clamp(0.95rem, 1.4vw, 1.05rem));
          line-height: 1.85;
          color: ${muted};
          max-width: 480px;
          margin: 0;
        }

        /* CTA button */
        .hero-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.7rem;
          font-family: 'DM Sans', sans-serif;
          font-weight: 400;
          font-size: var(--t-micro, 0.65rem);
          letter-spacing: 0.2em;
          text-transform: uppercase;
          text-decoration: none;
          color: ${ctaInk};
          background: ${ctaBg};
          padding: 1.15rem 2.2rem;
          transition: transform 0.22s ease, gap 0.22s ease;
          white-space: nowrap;
          align-self: flex-end;
        }
        .hero-cta:hover { transform: translateY(-2px); gap: 1rem; }

        /* Corner micro-labels */
        .hero-scroll {
          position: absolute;
          bottom: 3rem;
          left: var(--px, 3.5rem);
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: var(--t-micro, 0.65rem);
          letter-spacing: 0.2em;
          color: ${muted};
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 0.7rem;
        }
        .hero-scroll-line { width: 36px; height: 1px; background: ${muted}; }
        .hero-idx {
          position: absolute;
          bottom: 3rem;
          right: var(--px, 3.5rem);
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: var(--t-micro, 0.65rem);
          letter-spacing: 0.2em;
          color: ${muted};
        }

        @media (max-width: 768px) {
          .hero-root { padding: 10rem var(--px) 6rem; }
          .hero-rule { margin: 3.5rem 0; }
          .hero-bottom { flex-direction: column; gap: 2rem; }
          .hero-cta { align-self: flex-start; }
          .hero-idx { display: none; }
        }
        @media (max-width: 480px) {
          .hero-root { padding: 8rem var(--px) 5rem; }
          .hero-eyebrow { margin-bottom: 2.5rem; }
          .hero-rule { margin: 2.5rem 0; }
        }
      `}</style>

      <section className="hero-root" ref={ref} id="home">
        <CursorSpotlight />

        <motion.div
          className="hero-inner"
          variants={CONTAINER}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
        >
          {eyebrow && (
            <motion.div className="hero-eyebrow" variants={FADE_UP}>
              <span className="hero-eyebrow-dot" />
              {eyebrow}
            </motion.div>
          )}

          <div>
            {lines.map((line, i) => (
              <div key={i} style={{ display: "block" }}>
                <span className={`hero-hl${i === lines.length - 1 ? " hero-hl-dim" : ""}`}>
                  <SplitWords text={line} />
                </span>
              </div>
            ))}
          </div>

          <motion.div className="hero-rule" variants={LINE} />

          <div className="hero-bottom">
            <motion.p className="hero-sub" variants={FADE_UP}>{sub}</motion.p>
            {cta && (
              <motion.a href={cta.href} className="hero-cta" variants={FADE_UP}>
                {cta.label} <span>↗</span>
              </motion.a>
            )}
          </div>
        </motion.div>

        <motion.span
          className="hero-scroll"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          <span className="hero-scroll-line" />Scroll
        </motion.span>
        <motion.span
          className="hero-idx"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          01 / Hero
        </motion.span>
      </section>
    </>
  );
}