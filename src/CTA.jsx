import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { EASE_OUT } from "./animations";

function Marquee({ text, speed = 34 }) {
  const items = Array(10).fill(text);
  return (
    <div style={{ overflow:"hidden", display:"flex", whiteSpace:"nowrap", opacity:0.055, userSelect:"none", pointerEvents:"none" }}>
      <motion.div
        style={{ display:"flex", gap:"3rem" }}
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        {[...items, ...items].map((t, i) => (
          <span key={i} style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontWeight: 300,
            fontStyle: "italic",
            fontSize: "clamp(4rem, 9vw, 9rem)",
            lineHeight: 1,
            letterSpacing: "-0.02em",
            color: "#f0ede8",
            flexShrink: 0,
          }}>
            {t} ·
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default function CTA({
  eyebrow      = "Ready when you are",
  headline     = ["Let's build", "something", "great."],
  sub          = "We take on a small number of projects each year. If you have something worth making, we'd like to hear about it.",
  primaryCta   = { label:"Start a project", href:"#contact" },
  secondaryCta = { label:"hello@studio.co", href:"mailto:hello@studio.co" },
  marqueeText  = "Let's work together",
  theme        = "dark",
}) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const isDark  = theme === "dark";
  const bg      = isDark ? "#0a0a0a" : "#0f0f0f";
  const ink     = isDark ? "#f0ede8" : "#f5f3ef";
  const muted   = isDark ? "rgba(240,237,232,0.4)" : "rgba(245,243,239,0.42)";
  const btnBg   = isDark ? "#f0ede8" : "#f5f3ef";
  const btnInk  = isDark ? "#0a0a0a" : "#0f0f0f";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300&family=DM+Sans:wght@300;400&display=swap');

        .cta-root {
          position: relative;
          overflow: hidden;
          background: ${bg};
          /* Tall section — commanding presence */
          padding: 14rem var(--px, 3.5rem) 10rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 92vh;
          font-family: 'DM Sans', sans-serif;
        }

        /* Background marquee rows */
        .cta-mq {
          position: absolute; inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          pointer-events: none;
        }

        .cta-inner {
          position: relative;
          z-index: 2;
          text-align: center;
          max-width: 980px;
          margin: 0 auto;
          width: 100%;
        }

        /* Eyebrow */
        .cta-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.7rem;
          font-size: 0.65rem;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: ${muted};
          margin-bottom: 3rem;       /* generous gap before headline */
        }
        .cta-edot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: ${muted};
          animation: epulse 2.4s ease-in-out infinite;
        }
        @keyframes epulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.35;transform:scale(0.62)} }

        /* Display headline */
        .cta-hl {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: clamp(4.5rem, 12vw, 12rem);
          line-height: 0.92;
          letter-spacing: -0.03em;
          color: ${ink};
          margin: 0;
          display: block;
        }
        .cta-hl-dim { font-style: italic; color: ${muted}; }

        /* Sub copy — larger, more comfortable */
        .cta-sub {
          font-weight: 300;
          font-size: clamp(0.95rem, 1.5vw, 1.1rem);
          line-height: 1.82;
          color: ${muted};
          max-width: 500px;
          margin: 4.5rem auto 4.5rem; /* tall gaps above and below */
        }

        /* Button group */
        .cta-group {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.8rem;
          flex-wrap: wrap;
        }

        .cta-btn-p {
          display: inline-flex;
          align-items: center;
          gap: 0.7rem;
          font-family: 'DM Sans', sans-serif;
          font-weight: 400;
          font-size: 0.72rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          text-decoration: none;
          color: ${btnInk};
          background: ${btnBg};
          padding: 1.25rem 2.5rem;   /* larger button */
          transition: transform 0.22s ease, gap 0.22s ease;
          white-space: nowrap;
        }
        .cta-btn-p:hover { transform: translateY(-2px); gap: 1rem; }

        .cta-btn-s {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 0.72rem;
          letter-spacing: 0.14em;
          color: ${muted};
          text-decoration: none;
          padding-bottom: 2px;
          border-bottom: 1px solid rgba(240,237,232,0.18);
          transition: color 0.25s ease, border-color 0.25s ease, gap 0.25s ease;
        }
        .cta-btn-s:hover { color: ${ink}; border-color: ${ink}; gap: 0.8rem; }

        /* Footer meta */
        .cta-foot {
          position: absolute;
          bottom: 3rem;
          left: var(--px, 3.5rem);
          right: var(--px, 3.5rem);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          z-index: 2;
          flex-wrap: wrap;
        }
        .cta-avail {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.62rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: ${muted};
        }
        .cta-adot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #4ade80;
          box-shadow: 0 0 0 0 rgba(74,222,128,0.45);
          animation: ripple 2s ease-out infinite;
        }
        @keyframes ripple { 0%{box-shadow:0 0 0 0 rgba(74,222,128,0.45)} 70%{box-shadow:0 0 0 9px rgba(74,222,128,0)} 100%{box-shadow:0 0 0 0 rgba(74,222,128,0)} }
        .cta-yr { font-size: 0.62rem; letter-spacing: 0.16em; color: ${muted}; opacity: 0.55; }

        @media (max-width: 768px) {
          .cta-root { padding: 10rem var(--px) 7rem; min-height: 100dvh; }
          .cta-sub { margin: 3rem auto 3rem; }
          .cta-group { flex-direction: column; gap: 1.2rem; }
          .cta-foot { bottom: 2rem; }
        }
      `}</style>

      <section className="cta-root" ref={ref} id="contact">
        <div className="cta-mq">
          <Marquee text={marqueeText} speed={42} />
          <Marquee text={marqueeText} speed={30} />
          <Marquee text={marqueeText} speed={38} />
        </div>

        <div className="cta-inner">
          <motion.div
            className="cta-eyebrow"
            initial={{ opacity:0, y:18 }}
            animate={inView ? { opacity:1, y:0 } : {}}
            transition={{ duration:0.7, ease:EASE_OUT }}
          >
            <span className="cta-edot" />
            {eyebrow}
          </motion.div>

          <div aria-label={headline.join(" ")}>
            {headline.map((line, i) => (
              <motion.span
                key={i}
                className={`cta-hl${i === headline.length - 1 ? " cta-hl-dim" : ""}`}
                style={{ display:"block", overflow:"hidden" }}
                initial={{ opacity:0, y:70, skewY:2 }}
                animate={inView ? { opacity:1, y:0, skewY:0 } : {}}
                transition={{ duration:1.05, delay:0.08 + i * 0.15, ease:EASE_OUT }}
              >
                {line}
              </motion.span>
            ))}
          </div>

          <motion.p
            className="cta-sub"
            initial={{ opacity:0, y:22 }}
            animate={inView ? { opacity:1, y:0 } : {}}
            transition={{ duration:0.85, delay:0.55, ease:EASE_OUT }}
          >
            {sub}
          </motion.p>

          <motion.div
            className="cta-group"
            initial={{ opacity:0, y:18 }}
            animate={inView ? { opacity:1, y:0 } : {}}
            transition={{ duration:0.8, delay:0.68, ease:EASE_OUT }}
          >
            <motion.a
              href={primaryCta.href}
              className="cta-btn-p"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              {primaryCta.label} <span>↗</span>
            </motion.a>
            {secondaryCta && (
              <a href={secondaryCta.href} className="cta-btn-s">
                {secondaryCta.label} <span>→</span>
              </a>
            )}
          </motion.div>
        </div>

        <motion.div
          className="cta-foot"
          initial={{ opacity:0 }}
          animate={inView ? { opacity:1 } : {}}
          transition={{ duration:0.7, delay:1.1, ease:EASE_OUT }}
        >
          <div className="cta-avail"><span className="cta-adot" />Currently accepting projects</div>
          <span className="cta-yr">© Studio Name {new Date().getFullYear()}</span>
        </motion.div>
      </section>
    </>
  );
}