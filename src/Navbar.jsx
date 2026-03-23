import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { EASE_OUT } from "./animations";

// label → anchor id mapping
const NAV_LINKS = [
  { label: "Work",    href: "#work"    },
  { label: "Gallery", href: "#gallery" },
  { label: "About",   href: "#about"   },
  { label: "Contact", href: "#contact" },
];

function MagneticLink({ href, children, className, onClick }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 16, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 180, damping: 16, mass: 0.5 });

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2))  * 0.25);
    y.set((e.clientY - (r.top  + r.height / 2)) * 0.25);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.a
      ref={ref}
      href={href}
      className={className}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy, display: "inline-block" }}
    >
      {children}
    </motion.a>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive]     = useState(null);
  const [ready, setReady]       = useState(false);

  useEffect(() => {
    setReady(true);
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300&family=DM+Sans:wght@300;400&display=swap');

        .nav-bar {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          /* Full-width — no inner max-width container */
          width: 100%;
          transition:
            background     0.5s cubic-bezier(0.16,1,0.3,1),
            backdrop-filter 0.5s cubic-bezier(0.16,1,0.3,1),
            box-shadow     0.5s cubic-bezier(0.16,1,0.3,1),
            padding        0.45s cubic-bezier(0.16,1,0.3,1);
        }

        .nav-bar.up {
          background: transparent;
          backdrop-filter: none;
          -webkit-backdrop-filter: none;
          box-shadow: none;
          padding-top: 2rem;
          padding-bottom: 2rem;
        }

        .nav-bar.down {
          background: rgba(245,243,239,0.86);
          backdrop-filter: saturate(180%) blur(18px);
          -webkit-backdrop-filter: saturate(180%) blur(18px);
          box-shadow: 0 1px 0 rgba(0,0,0,0.07);
          padding-top: 1rem;
          padding-bottom: 1rem;
        }

        /* Inner row: full width, padded with --px on both sides.
           NO max-width — the navbar spans edge to edge. */
        .nav-inner {
          width: 100%;
          padding: 0 var(--px, 3.5rem);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .nav-logo {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: 1.35rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #0f0f0f;
          text-decoration: none;
          line-height: 1;
          transition: opacity 0.3s;
          display: inline-block;
        }
        .nav-logo:hover { opacity: 0.42; }

        .nav-links {
          display: flex;
          gap: 2.8rem;
          list-style: none;
          margin: 0;
          padding: 0;
          align-items: center;
        }

        .nav-link {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 0.75rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #0f0f0f;
          text-decoration: none;
          position: relative;
          padding-bottom: 2px;
          opacity: 0.52;
          transition: opacity 0.25s;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          width: 0; height: 1px;
          background: #0f0f0f;
          transition: width 0.38s cubic-bezier(0.16,1,0.3,1);
        }
        .nav-link:hover, .nav-link.on { opacity: 1; }
        .nav-link:hover::after, .nav-link.on::after { width: 100%; }

        @media (max-width: 640px) {
          .nav-links { gap: 1.6rem; }
        }
      `}</style>

      <nav className={`nav-bar ${scrolled ? "down" : "up"}`} aria-label="Main navigation">
        <div className="nav-inner">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE_OUT }}
          >
            <a href="/" className="nav-logo">Filmovert</a>
          </motion.div>

          <ul className="nav-links">
            {NAV_LINKS.map(({ label, href }, i) => (
              <motion.li key={label}
                initial={{ opacity: 0, y: -14 }}
                animate={ready ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.2 + i * 0.09, ease: EASE_OUT }}
              >
                <MagneticLink
                  href={href}
                  className={`nav-link${active === label ? " on" : ""}`}
                  onClick={() => setActive(label)}
                >
                  {label}
                </MagneticLink>
              </motion.li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
}