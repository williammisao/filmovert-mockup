import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { EASE_OUT, Reveal } from "./animations";

function ParallaxImage({ src, alt }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-9%", "9%"]);
  return (
    <div ref={ref} style={{ overflow:"hidden", width:"100%", height:"100%", minHeight:"600px" }}>
      <motion.img
        src={src} alt={alt}
        style={{ width:"100%", height:"118%", objectFit:"cover", display:"block", y, marginTop:"-9%" }}
        loading="lazy"
      />
    </div>
  );
}

function PhilItem({ number, heading, body, delay, ink, muted, border }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-48px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity:0, y:22 }}
      animate={inView ? { opacity:1, y:0 } : {}}
      transition={{ duration:0.9, delay, ease:EASE_OUT }}
      style={{
        display: "grid",
        gridTemplateColumns: "3rem 1fr",
        gap: "1.5rem",
        padding: "2.5rem 0",           /* tall row padding — each item breathes */
        borderTop: `1px solid ${border}`,
      }}
    >
      {/* Number — very faint, large */}
      <span style={{
        fontFamily: "'Cormorant Garamond',serif",
        fontWeight: 300,
        fontSize: "1rem",
        color: "rgba(15,15,15,0.15)",
        paddingTop: "0.25rem",
        letterSpacing: "0.04em",
      }}>
        {number}
      </span>
      <div>
        {/* Heading — punchy serif, clear size step above body */}
        <h4 style={{
          fontFamily: "'Cormorant Garamond',serif",
          fontWeight: 300,
          fontSize: "clamp(1.3rem, 2vw, 1.7rem)",
          lineHeight: 1.15,
          letterSpacing: "-0.01em",
          color: ink,
          margin: "0 0 0.9rem",        /* gap between heading and body */
        }}>
          {heading}
        </h4>
        <p style={{
          fontFamily: "'DM Sans',sans-serif",
          fontWeight: 300,
          fontSize: "0.92rem",
          lineHeight: 1.82,
          color: muted,
          margin: 0,
          maxWidth: "520px",
        }}>
          {body}
        </p>
      </div>
    </motion.div>
  );
}

export default function About({
  eyebrow      = "About the Studio",
  heading      = "We believe great design is an act of clarity.",
  description  = "Founded in 2018, we're a small studio of designers, strategists, and technologists who partner with ambitious companies to build brands and digital products that endure. We don't do volume. We do depth.",
  image        = "https://picsum.photos/seed/AboutStudio/900/1100",
  imageCaption = "Our studio — Lisbon, Portugal",
  philosophy   = {
    label: "Our Philosophy",
    items: [
      { heading:"Restraint over decoration.",  body:"We remove until nothing more can be taken away. Every element earns its place, or it doesn't appear." },
      { heading:"Systems, not surfaces.",       body:"We design from the inside out — structure, logic, and language first. Visual form follows as a natural consequence." },
      { heading:"Slow down to go far.",         body:"We work with a small number of clients at a time. That means more thinking, fewer shortcuts, and better outcomes." },
    ],
  },
  cta   = { label:"Start a conversation", href:"#contact" },
  theme = "light",
}) {
  const isDark = theme === "dark";
  const bg     = isDark ? "#0a0a0a" : "#f5f3ef";
  const ink    = isDark ? "#f0ede8" : "#0f0f0f";
  const muted  = isDark ? "rgba(240,237,232,0.4)" : "rgba(15,15,15,0.42)";
  const border = isDark ? "rgba(240,237,232,0.09)" : "rgba(15,15,15,0.09)";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300&family=DM+Sans:wght@300;400&display=swap');

        .ab-root {
          background: ${bg};
          /* Use global CSS vars */
          padding: var(--py, 11rem) var(--px, 3.5rem);
          font-family: 'DM Sans', sans-serif;
          color: ${ink};
        }
        .ab-inner { max-width: var(--max-w, 1200px); margin: 0 auto; }

        /* Two-column grid — generous gap */
        .ab-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 7rem;                   /* wider gutter between text and image */
          align-items: start;
          margin-bottom: 10rem;        /* large gap before philosophy */
        }
        .ab-sticky { position: sticky; top: 7rem; }

        /* Eyebrow */
        .ab-eyebrow {
          font-size: 0.65rem;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: ${muted};
          display: flex;
          align-items: center;
          gap: 0.7rem;
          margin-bottom: 2.4rem;       /* clear gap eyebrow → heading */
        }
        .ab-ey-line { width: 28px; height: 1px; background: ${muted}; flex-shrink: 0; }

        /* Section heading — significantly larger than before */
        .ab-h2 {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: clamp(2.2rem, 4.5vw, 4rem);
          line-height: 1.05;
          letter-spacing: -0.02em;
          color: ${ink};
          margin: 0 0 2.8rem;          /* generous gap heading → body */
        }
        .ab-h2 em { font-style: italic; color: ${muted}; }

        /* Body copy */
        .ab-desc {
          font-weight: 300;
          font-size: 1rem;
          line-height: 1.88;           /* very comfortable reading line-height */
          color: ${muted};
          margin: 0 0 3.2rem;
          max-width: 440px;
        }

        /* CTA link */
        .ab-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.7rem;
          font-size: 0.7rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: ${ink};
          text-decoration: none;
          border: 1px solid rgba(15,15,15,0.2);
          padding: 1rem 1.8rem;
          transition: background 0.25s ease, gap 0.28s ease;
        }
        .ab-cta:hover { background: rgba(15,15,15,0.05); gap: 1.1rem; }

        /* Image caption */
        .ab-cap {
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          color: ${muted};
          margin-top: 1.1rem;
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        .ab-cap::before { content:''; width: 20px; height: 1px; background: ${muted}; flex-shrink: 0; }

        /* Philosophy band */
        .ab-phil {
          display: grid;
          grid-template-columns: 300px 1fr;  /* wider label column */
          gap: 6rem;                           /* generous horizontal gap */
          align-items: start;
          padding-top: 6rem;
          border-top: 1px solid ${border};
        }
        .ab-phil-label {
          font-size: 0.65rem;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: ${muted};
          padding-top: 0.3rem;
          position: sticky;
          top: 7rem;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .ab-grid { gap: 4rem; margin-bottom: 7rem; }
          .ab-phil { grid-template-columns: 220px 1fr; gap: 4rem; }
        }
        @media (max-width: 900px) {
          .ab-grid { grid-template-columns: 1fr; gap: 4rem; margin-bottom: 6rem; }
          .ab-sticky { position: static; }
          .ab-phil { grid-template-columns: 1fr; gap: 2.5rem; padding-top: 4rem; }
          .ab-phil-label { position: static; }
        }
        @media (max-width: 600px) {
          .ab-root { padding: var(--py) var(--px); }
          .ab-grid { margin-bottom: 5rem; }
        }
      `}</style>

      <section className="ab-root" id="about">
        <div className="ab-inner">
          <div className="ab-grid">

            {/* Left column — text */}
            <div>
              <Reveal delay={0}>
                <div className="ab-eyebrow">
                  <span className="ab-ey-line" />
                  {eyebrow}
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="ab-h2">
                  {heading.split(" ").map((w, i, a) =>
                    i === a.length - 1 ? <em key={i}>{w}</em> : <span key={i}>{w} </span>
                  )}
                </h2>
              </Reveal>
              <Reveal delay={0.18}>
                <p className="ab-desc">{description}</p>
              </Reveal>
              <Reveal delay={0.25}>
                <a href={cta.href} className="ab-cta">{cta.label} <span>↗</span></a>
              </Reveal>
            </div>

            {/* Right column — sticky parallax image */}
            <Reveal delay={0.14} style={{ width: "100%" }}>
              <div className="ab-sticky">
                <ParallaxImage src={image} alt={imageCaption} />
                {imageCaption && <p className="ab-cap">{imageCaption}</p>}
              </div>
            </Reveal>
          </div>

          {/* Philosophy */}
          <div className="ab-phil">
            <Reveal>
              <p className="ab-phil-label">{philosophy.label}</p>
            </Reveal>
            <div>
              {philosophy.items.map((item, i) => (
                <PhilItem
                  key={i}
                  number={`0${i + 1}`}
                  heading={item.heading}
                  body={item.body}
                  delay={i * 0.11}
                  ink={ink}
                  muted={muted}
                  border={border}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}