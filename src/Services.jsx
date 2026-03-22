import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { EASE_OUT, Reveal, RevealLine } from "./animations";

const DEFAULT_SERVICES = [
  { id:"01", title:"Brand Identity",           description:"We build complete visual identities — mark, wordmark, colour, type, and motion — that hold their character across every surface and scale.",                                            tags:["Strategy","Logo","Typography","Colour","Guidelines"] },
  { id:"02", title:"Web Design & Development", description:"Bespoke digital experiences, from information architecture and interaction design through to production-ready code. Performance, accessibility, and beauty — in that order.",             tags:["UX/UI","Prototyping","React","Framer","CMS"] },
  { id:"03", title:"Art Direction",            description:"Creative direction for campaigns, editorial shoots, and brand worlds. We shape how a brand looks, moves, and feels across photography, video, and print.",                               tags:["Campaign","Photography","Video","Editorial"] },
  { id:"04", title:"Digital Experience",       description:"Interactive installations, data-driven interfaces, and web applications that put craft at the centre of complex problems. We thrive at the boundary of design and engineering.",         tags:["Interaction","Animation","WebGL","Data Viz"] },
];

function ServiceRow({ service, index, isLast, ink, muted, border }) {
  const [open, setOpen] = useState(false);
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity:0, y:24 }}
      animate={inView ? { opacity:1, y:0 } : {}}
      transition={{ duration:0.85, delay:index * 0.1, ease:EASE_OUT }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        style={{
          width: "100%",
          background: "none",
          border: "none",
          padding: "2.8rem 0",          /* tall row — each service breathes */
          cursor: "pointer",
          display: "grid",
          gridTemplateColumns: "4rem 1fr auto",
          alignItems: "center",
          gap: "2rem",
          textAlign: "left",
          borderTop: `1px solid ${border}`,
          borderBottom: isLast && !open ? `1px solid ${border}` : "none",
        }}
      >
        {/* Index number */}
        <span style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 300,
          fontSize: "0.9rem",
          color: muted,
          opacity: 0.45,
          letterSpacing: "0.05em",
        }}>
          {service.id}
        </span>

        {/* Title — larger, clear hierarchy */}
        <span style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 300,
          fontSize: "clamp(1.5rem, 3.2vw, 2.6rem)",
          lineHeight: 1.1,
          letterSpacing: "-0.01em",
          color: ink,
          transition: "opacity 0.25s ease",
          opacity: open ? 1 : 0.82,
        }}>
          {service.title}
        </span>

        {/* Toggle */}
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.42, ease: EASE_OUT }}
          style={{
            width: "36px",
            height: "36px",
            border: `1px solid ${border}`,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.1rem",
            color: muted,
            flexShrink: 0,
            lineHeight: 1,
          }}
        >
          +
        </motion.span>
      </button>

      {/* Expanded content */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.55, ease: EASE_OUT }}
            style={{ overflow: "hidden", borderBottom: isLast ? `1px solid ${border}` : "none" }}
          >
            <div style={{
              display: "grid",
              gridTemplateColumns: "4rem 1fr 1fr",
              gap: "2rem",
              padding: "0 0 3rem",     /* generous bottom padding inside expanded row */
            }}>
              <div />
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 300,
                fontSize: "0.96rem",
                lineHeight: 1.82,
                color: muted,
                margin: 0,
              }}>
                {service.description}
              </p>
              <div style={{ display:"flex", flexWrap:"wrap", gap:"0.6rem", alignContent:"flex-start" }}>
                {service.tags.map(tag => (
                  <span key={tag} style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 300,
                    fontSize: "0.62rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: muted,
                    border: `1px solid ${border}`,
                    padding: "0.35rem 0.85rem",
                    whiteSpace: "nowrap",
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Services({
  eyebrow  = "What we do",
  heading  = "Our services",
  sub      = "A focused set of disciplines, delivered with depth.",
  services = DEFAULT_SERVICES,
  theme    = "light",
}) {
  const isDark = theme === "dark";
  const bg     = isDark ? "#0d0d0d" : "#f5f3ef";
  const ink    = isDark ? "#f0ede8" : "#0f0f0f";
  const muted  = isDark ? "rgba(240,237,232,0.42)" : "rgba(15,15,15,0.42)";
  const border = isDark ? "rgba(240,237,232,0.09)" : "rgba(15,15,15,0.09)";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300&family=DM+Sans:wght@300;400&display=swap');

        .sv-root {
          background: ${bg};
          padding: var(--py, 11rem) var(--px, 3.5rem);
        }
        .sv-inner { max-width: var(--max-w, 1200px); margin: 0 auto; }

        /* Header — two-column, heading left, sub right */
        .sv-header {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          align-items: end;
          margin-bottom: 5rem;         /* clear gap between header and list */
        }

        .sv-eyebrow {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 0.65rem;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: ${muted};
          display: flex;
          align-items: center;
          gap: 0.7rem;
          margin-bottom: 1.6rem;       /* clear gap eyebrow → heading */
        }
        .sv-ey-dot { width: 5px; height: 5px; border-radius: 50%; background: ${muted}; flex-shrink: 0; }

        /* Heading — punchy, large */
        .sv-h2 {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: clamp(2.4rem, 5vw, 4.5rem);
          line-height: 1;
          letter-spacing: -0.02em;
          color: ${ink};
          margin: 0;
        }

        /* Sub — body copy weight, comfortable line-height */
        .sv-sub {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 1rem;
          line-height: 1.82;
          color: ${muted};
          margin: 0;
          max-width: 400px;
          align-self: end;
        }

        @media (max-width: 768px) {
          .sv-header { grid-template-columns: 1fr; gap: 2rem; margin-bottom: 3.5rem; }
          .sv-sub { max-width: 100%; }
        }
        @media (max-width: 480px) {
          .sv-root { padding: var(--py) var(--px); }
        }
      `}</style>

      <section className="sv-root" id="services">
        <div className="sv-inner">

          <div className="sv-header">
            <div>
              <Reveal delay={0}>
                <div className="sv-eyebrow">
                  <span className="sv-ey-dot" />
                  {eyebrow}
                </div>
              </Reveal>
              <Reveal delay={0.08}>
                <h2 className="sv-h2">{heading}</h2>
              </Reveal>
            </div>
            <Reveal delay={0.16} style={{ alignSelf:"end" }}>
              <p className="sv-sub">{sub}</p>
            </Reveal>
          </div>

          <RevealLine color={border} />

          <div>
            {services.map((svc, i) => (
              <ServiceRow
                key={svc.id}
                service={svc}
                index={i}
                isLast={i === services.length - 1}
                ink={ink}
                muted={muted}
                border={border}
              />
            ))}
          </div>

        </div>
      </section>
    </>
  );
}