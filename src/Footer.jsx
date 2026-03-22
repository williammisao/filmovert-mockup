import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { EASE_OUT } from "./animations";

const DEFAULT_SOCIALS = [
  { label:"Instagram",   href:"https://instagram.com" },
  { label:"Twitter / X", href:"https://twitter.com" },
  { label:"LinkedIn",    href:"https://linkedin.com" },
  { label:"Dribbble",    href:"https://dribbble.com" },
];

export default function Footer({
  logo     = "Studio / Name",
  tagline  = "Crafting brands and digital experiences that endure.",
  email    = "hello@studio.co",
  socials  = DEFAULT_SOCIALS,
  legal    = `© ${new Date().getFullYear()} Studio Name. All rights reserved.`,
  location = "Lisbon, Portugal — GMT+1",
  theme    = "dark",
}) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-48px" });

  const isDark = theme === "dark";
  const bg     = isDark ? "#0a0a0a" : "#0f0f0f";
  const ink    = isDark ? "#f0ede8" : "#f5f3ef";
  const muted  = isDark ? "rgba(240,237,232,0.36)" : "rgba(245,243,239,0.36)";
  const bdr    = isDark ? "rgba(240,237,232,0.07)"  : "rgba(245,243,239,0.07)";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300&family=DM+Sans:wght@300;400&display=swap');

        .ft-root {
          background: ${bg};
          font-family: 'DM Sans', sans-serif;
          color: ${ink};
          /* Generous footer padding */
          padding: 7rem var(--px, 3.5rem) 3rem;
        }
        .ft-inner { max-width: var(--max-w, 1200px); margin: 0 auto; }

        /* Three-column top section */
        .ft-top {
          display: grid;
          grid-template-columns: 1.2fr 1fr 1.2fr;  /* slightly wider logo & contact */
          gap: 4rem;
          padding-bottom: 5rem;                      /* tall gap before rule */
          border-bottom: 1px solid ${bdr};
          align-items: start;
        }

        /* Logo — prominent serif */
        .ft-logo {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: 1.4rem;                          /* larger than before */
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: ${ink};
          text-decoration: none;
          display: block;
          line-height: 1;
          margin-bottom: 1.4rem;                      /* gap to tagline */
          transition: opacity 0.3s;
        }
        .ft-logo:hover { opacity: 0.42; }

        .ft-tag {
          font-weight: 300;
          font-size: 0.85rem;
          line-height: 1.78;
          color: ${muted};
          max-width: 240px;
        }

        /* Column label — tiny, very spaced */
        .ft-col-label {
          font-size: 0.6rem;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: ${muted};
          margin-bottom: 1.6rem;                      /* larger gap label → links */
          display: block;
          opacity: 0.7;
        }

        /* Nav links */
        .ft-nav { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.85rem; }
        .ft-nav a {
          font-weight: 300;
          font-size: 0.88rem;
          letter-spacing: 0.04em;
          color: ${muted};
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          transition: color 0.22s ease, gap 0.22s ease;
          gap: 0;
        }
        .ft-nav a:hover { color: ${ink}; gap: 0.35rem; }
        .ft-nav a::after { content: '↗'; font-size: 0.65rem; opacity: 0; transform: translate(-4px, 2px); transition: opacity 0.2s, transform 0.25s ease; }
        .ft-nav a:hover::after { opacity: 0.55; transform: translate(0, 0); }

        /* Email — large serif, the CTA of the footer */
        .ft-email {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: clamp(1.2rem, 2vw, 1.65rem);   /* noticeably larger */
          letter-spacing: -0.01em;
          color: ${ink};
          text-decoration: none;
          display: inline-block;
          position: relative;
          line-height: 1.1;
          transition: opacity 0.25s;
        }
        .ft-email::after {
          content: '';
          position: absolute;
          bottom: -3px; left: 0;
          width: 0; height: 1px;
          background: ${ink};
          transition: width 0.42s cubic-bezier(0.16,1,0.3,1);
        }
        .ft-email:hover { opacity: 0.7; }
        .ft-email:hover::after { width: 100%; }

        /* Location */
        .ft-loc {
          font-weight: 300;
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          color: ${muted};
          margin-top: 1.2rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .ft-loc-dot { width: 5px; height: 5px; border-radius: 50%; background: #4ade80; flex-shrink: 0; animation: ft-blink 3s ease-in-out infinite; }
        @keyframes ft-blink { 0%,100%{opacity:1} 50%{opacity:0.28} }

        /* Bottom bar */
        .ft-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          padding-top: 2.5rem;           /* taller padding above bottom bar */
          flex-wrap: wrap;
        }

        .ft-legal {
          font-weight: 300;
          font-size: 0.65rem;
          letter-spacing: 0.08em;
          color: ${muted};
          opacity: 0.7;
        }

        /* Social links */
        .ft-socials { display: flex; gap: 2rem; list-style: none; padding: 0; margin: 0; flex-wrap: wrap; }
        .ft-socials a {
          font-weight: 300;
          font-size: 0.65rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: ${muted};
          text-decoration: none;
          position: relative;
          padding-bottom: 1px;
          transition: color 0.22s;
        }
        .ft-socials a::after {
          content: '';
          position: absolute; bottom: 0; left: 0;
          width: 0; height: 1px;
          background: ${ink};
          transition: width 0.32s cubic-bezier(0.16,1,0.3,1);
        }
        .ft-socials a:hover { color: ${ink}; }
        .ft-socials a:hover::after { width: 100%; }

        /* Responsive */
        @media (max-width: 900px) { .ft-top { grid-template-columns: 1fr 1fr; gap: 3rem; } }
        @media (max-width: 600px) {
          .ft-root { padding: 5rem var(--px) 2.5rem; }
          .ft-top { grid-template-columns: 1fr; gap: 2.8rem; padding-bottom: 3.5rem; }
          .ft-bottom { flex-direction: column; align-items: flex-start; gap: 1.4rem; }
        }
      `}</style>

      <footer className="ft-root" ref={ref}>
        <div className="ft-inner">
          <motion.div
            className="ft-top"
            initial={{ opacity:0, y:28 }}
            animate={inView ? { opacity:1, y:0 } : {}}
            transition={{ duration:0.95, ease:EASE_OUT }}
          >
            {/* Col 1 — Logo + tagline */}
            <div>
              <a href="/" className="ft-logo">{logo}</a>
              <p className="ft-tag">{tagline}</p>
            </div>

            {/* Col 2 — Navigation */}
            <div>
              <span className="ft-col-label">Navigate</span>
              <ul className="ft-nav">
                {["Work", "About", "Services", "Contact"].map(item => (
                  <li key={item}>
                    <a href={`#${item.toLowerCase()}`}>{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3 — Contact */}
            <div>
              <span className="ft-col-label">Say hello</span>
              <a href={`mailto:${email}`} className="ft-email">{email}</a>
              {location && (
                <div className="ft-loc">
                  <span className="ft-loc-dot" />
                  {location}
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            className="ft-bottom"
            initial={{ opacity:0 }}
            animate={inView ? { opacity:1 } : {}}
            transition={{ duration:0.7, delay:0.22, ease:EASE_OUT }}
          >
            <span className="ft-legal">{legal}</span>
            <ul className="ft-socials">
              {socials.map(s => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </footer>
    </>
  );
}