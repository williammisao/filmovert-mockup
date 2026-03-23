/**
 * Hero.jsx
 *
 * Layout (top → bottom, both share id="home"):
 *
 *   ┌─────────────────────────────────────────┐
 *   │  VIDEO HERO  — 100vh, edge-to-edge      │  ← first thing user sees
 *   │  • Full-bleed autoplay/muted/loop video │
 *   │  • Gradient veil for legibility         │
 *   │  • Eyebrow + tagline overlaid bottom-L  │
 *   │  • Scroll-down arrow bottom-centre      │
 *   └─────────────────────────────────────────┘
 *   ┌─────────────────────────────────────────┐
 *   │  TEXT HERO  — headline + sub + CTA      │  ← scrolled to
 *   │  • Word-split animated headline         │
 *   │  • Horizontal rule                      │
 *   │  • Subtext + CTA button                 │
 *   └─────────────────────────────────────────┘
 *
 * Props:
 *   videoSrc   string   — URL/path of the hero video.
 *                         Defaults to a free Pexels MP4 (creative / abstract).
 *   videoPoster string  — Poster image shown before video loads.
 *   eyebrow    string
 *   lines      string[] — Headline split into lines
 *   sub        string
 *   cta        { label, href }
 *   theme      'light' | 'dark'
 */

import { useRef, useState, useEffect } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { EASE_OUT, SplitWords } from "./animations";
import heroVid from "./videos/HeroVideo.mp4";

// ─── Animation variants ────────────────────────────────────────────────────────

const CONTAINER = {
  hidden: {},
  show: { transition: { staggerChildren: 0.13, delayChildren: 0.15 } },
};

const FADE_UP = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE_OUT } },
};

const LINE_VAR = {
  hidden: { scaleX: 0, originX: 0 },
  show:   { scaleX: 1, transition: { duration: 1.1, ease: EASE_OUT } },
};

// ─── Cursor spotlight (for text section) ──────────────────────────────────────

function CursorSpotlight({ ink }) {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const bgX = useTransform(sx, [0, 1], ["10%", "90%"]);
  const bgY = useTransform(sy, [0, 1], ["10%", "90%"]);
  const [visible, setVisible] = useState(false);

  return (
    <motion.div
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width);
        my.set((e.clientY - r.top) / r.height);
      }}
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

// ─── Scroll arrow ──────────────────────────────────────────────────────────────

function ScrollArrow({ color = "rgba(15,15,15,0.45)" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.6, duration: 0.7, ease: EASE_OUT }}
      style={{
        position:   "absolute",
        bottom:     "2.8rem",
        left:       "50%",
        transform:  "translateX(-50%)",
        display:    "flex",
        flexDirection: "column",
        alignItems: "center",
        gap:        "0.5rem",
        color,
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 300,
        fontSize:   "0.58rem",
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        cursor:     "pointer",
        zIndex:     4,
      }}
      onClick={() =>
        document.getElementById("hero-text")?.scrollIntoView({ behavior: "smooth" })
      }
    >
      {/* Animated line that pulses downward */}
      <motion.span
        style={{
          width:           "1px",
          height:          "42px",
          background:      `linear-gradient(to bottom, transparent 0%, ${color} 100%)`,
          display:         "block",
        }}
        animate={{ scaleY: [0.4, 1, 0.4], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      />
      Scroll
    </motion.div>
  );
}

// ─── Video section ─────────────────────────────────────────────────────────────

function VideoHero({ videoSrc, videoPoster, eyebrow }) {
  const videoRef = useRef(null);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    // Restore src in case it was cleared by a previous unmount (React Strict Mode)
    if (!v.src || v.src === window.location.href) {
      v.src = videoSrc;
      v.load();
    }

    const onReady = () => setVideoReady(true);
    v.addEventListener("canplay", onReady);

    // If already ready (cached), mark immediately
    if (v.readyState >= 3) setVideoReady(true);

    v.play().catch(() => {});

    return () => {
      v.removeEventListener("canplay", onReady);
      v.pause();
      v.src = "";
      v.load();
    };
  }, [videoSrc]);

  return (
    <div className="vh-root">
      {/* ── Video element ── */}
      <motion.video
        ref={videoRef}
        src={videoSrc}
        poster={videoPoster}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="vh-video"
        initial={{ opacity: 0 }}
        animate={{ opacity: videoReady ? 1 : 0 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
      />

      {/* Poster / placeholder shown until video loads */}
      {!videoReady && videoPoster && (
        <img
          src={videoPoster}
          alt=""
          className="vh-poster"
          aria-hidden
        />
      )}

      {/* Scroll prompt */}
      <ScrollArrow />
    </div>
  );
}

// ─── Text hero section ─────────────────────────────────────────────────────────

function TextHero({ eyebrow, lines, sub, cta, theme }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const isDark = theme === "dark";
  const bg     = isDark ? "#0a0a0a" : "#f5f3ef";
  const ink    = isDark ? "#f0ede8" : "#0f0f0f";
  const muted  = isDark ? "rgba(240,237,232,0.38)" : "rgba(15,15,15,0.38)";
  const ctaBg  = isDark ? "#f0ede8" : "#0f0f0f";
  const ctaInk = isDark ? "#0a0a0a" : "#f5f3ef";

  return (
    <section
      id="hero-text"
      ref={ref}
      className="ht-root"
      style={{ background: bg }}
    >
      <CursorSpotlight ink={ink} />

      <motion.div
        className="ht-inner"
        variants={CONTAINER}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
      >
        {eyebrow && (
          <motion.div className="ht-eyebrow" variants={FADE_UP}
            style={{ color: muted }}
          >
            <span className="ht-eyebrow-dot" style={{ background: muted }} />
            {eyebrow}
          </motion.div>
        )}

        <div>
          {lines.map((line, i) => (
            <div key={i} style={{ display: "block" }}>
              <span
                className="ht-hl"
                style={{ color: i === lines.length - 1 ? muted : ink }}
              >
                <SplitWords text={line} />
              </span>
            </div>
          ))}
        </div>

        <motion.div
          className="ht-rule"
          variants={LINE_VAR}
          style={{ background: isDark ? "rgba(240,237,232,0.1)" : "rgba(15,15,15,0.1)" }}
        />

        <div className="ht-bottom">
          <motion.p className="ht-sub" variants={FADE_UP} style={{ color: muted }}>
            {sub}
          </motion.p>
          {cta && (
            <motion.a
              href={cta.href}
              className="ht-cta"
              variants={FADE_UP}
              style={{ background: ctaBg, color: ctaInk }}
            >
              {cta.label} <span>↗</span>
            </motion.a>
          )}
        </div>
      </motion.div>

      {/* Corner labels */}
      <motion.span
        className="ht-scroll"
        style={{ color: muted }}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <span className="ht-scroll-line" style={{ background: muted }} />
        Scroll
      </motion.span>
      <motion.span
        className="ht-idx"
        style={{ color: muted }}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        02 / Headline
      </motion.span>
    </section>
  );
}

// ─── Hero (default export) ─────────────────────────────────────────────────────

export default function Hero({
  // Video props
  videoSrc    = heroVid,
  videoPoster = null,
  // Text hero props
  eyebrow = "Filmovert — Est. 2024",
  lines   = ["We shape", "brands that", "last."],
  sub     = "Strategy, design, and technology — crafted with intention for companies that refuse to be ordinary.",
  cta     = { label: "See our work", href: "#work" },
  theme   = "light",
}) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300&family=DM+Sans:wght@300;400&display=swap');

        /* ══════════════════════════════════════
           VIDEO HERO
        ══════════════════════════════════════ */

        .vh-root {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          background: #ffffff;
        }

        /* Video fills the container, centred + cropped */
        .vh-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          /* GPU layer hint */
          will-change: opacity;
        }

        /* Poster fallback */
        .vh-poster {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }



        /* ══════════════════════════════════════
           TEXT HERO
        ══════════════════════════════════════ */

        .ht-root {
          position: relative;
          overflow: hidden;
          width: 100%;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 14rem var(--px, 3.5rem) 8rem;
        }

        .ht-inner {
          width: 100%;
          position: relative;
          z-index: 1;
        }

        .ht-eyebrow {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: var(--t-micro, 0.65rem);
          letter-spacing: 0.28em;
          text-transform: uppercase;
          margin-bottom: 3.5rem;
          display: flex;
          align-items: center;
          gap: 0.9rem;
        }
        .ht-eyebrow-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .ht-hl {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: clamp(4rem, 13vw, 99rem);
          line-height: 0.92;
          letter-spacing: -0.03em;
          margin: 0;
          display: block;
          font-style: normal;
        }
        /* Last line handled via inline color prop */

        .ht-rule {
          height: 1px;
          margin: 5rem 0;
          transform-origin: left;
          width: 100%;
        }

        .ht-bottom {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 3rem;
          flex-wrap: wrap;
        }

        .ht-sub {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: var(--t-body, clamp(0.95rem, 1.4vw, 1.05rem));
          line-height: 1.85;
          max-width: 480px;
          margin: 0;
        }

        .ht-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.7rem;
          font-family: 'DM Sans', sans-serif;
          font-weight: 400;
          font-size: var(--t-micro, 0.65rem);
          letter-spacing: 0.2em;
          text-transform: uppercase;
          text-decoration: none;
          padding: 1.15rem 2.2rem;
          transition: transform 0.22s ease, gap 0.22s ease;
          white-space: nowrap;
          align-self: flex-end;
        }
        .ht-cta:hover { transform: translateY(-2px); gap: 1rem; }

        /* Corner labels */
        .ht-scroll {
          position: absolute;
          bottom: 3rem;
          left: var(--px, 3.5rem);
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: var(--t-micro, 0.65rem);
          letter-spacing: 0.2em;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 0.7rem;
        }
        .ht-scroll-line { width: 36px; height: 1px; }
        .ht-idx {
          position: absolute;
          bottom: 3rem;
          right: var(--px, 3.5rem);
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: var(--t-micro, 0.65rem);
          letter-spacing: 0.2em;
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .vh-overlay { bottom: 5rem; } /* avoid clash with scroll arrow */
          .ht-root { padding: 10rem var(--px) 6rem; }
          .ht-rule { margin: 3.5rem 0; }
          .ht-bottom { flex-direction: column; gap: 2rem; }
          .ht-cta { align-self: flex-start; }
          .ht-idx { display: none; }
          .vh-muted { top: 5rem; }
        }
        @media (max-width: 480px) {
          .ht-root { padding: 8rem var(--px) 5rem; }
          .ht-eyebrow { margin-bottom: 2.5rem; }
          .ht-rule { margin: 2.5rem 0; }
        }
      `}</style>

      {/* ── 1. Full-screen video — first thing shown ── */}
      <VideoHero
        videoSrc={videoSrc}
        videoPoster={videoPoster}
        eyebrow={eyebrow}
      />

      {/* ── 2. Text headline — scrolled to ── */}
      <TextHero
        eyebrow={eyebrow}
        lines={lines}
        sub={sub}
        cta={cta}
        theme={theme}
      />
    </>
  );
}

// ─── Usage ────────────────────────────────────────────────────────────────────
//
// Default (Pexels demo video):
//   <Hero />
//
// Your own video:
//   <Hero
//     videoSrc="/videos/showreel.mp4"
//     videoPoster="/videos/showreel-poster.jpg"
//     eyebrow="Creative Studio — Est. 2024"
//     lines={["We shape", "brands that", "last."]}
//     sub="Strategy and design..."
//     cta={{ label: "See our work", href: "#work" }}
//     theme="light"
//   />
//
// For best results use a 1920×1080 or wider MP4 (H.264, < 8 MB for fast load).
// Add a WebM source for better compression in Chrome/Firefox.