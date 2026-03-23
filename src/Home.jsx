/**
 * Home.jsx — Full agency homepage
 *
 * Section order:
 *   Navbar → Hero → ProjectsGrid → SphereGallery → About → Services → CTA → Footer
 *
 * The SphereGallery is wrapped in a section with a matching editorial header
 * so it feels like a native part of the page, not a dropped-in widget.
 */

import { useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

import Navbar         from "./Navbar";
import Hero           from "./Hero";
import ProjectsGrid   from "./ProjectsGrid";
import SphereGallery  from "./SphereGallery";
import About          from "./About";
import Services       from "./Services";
import CTA            from "./CTA";
import Footer         from "./Footer";

import { PAGE_VARIANTS, EASE_OUT } from "./animations";

// ─── Global design tokens ──────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@300;400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg-light:     #f5f3ef;
    --bg-dark:      #0a0a0a;
    --ink:          #0f0f0f;
    --ink-inv:      #f0ede8;
    --muted-light:  rgba(15,15,15,0.42);
    --muted-dark:   rgba(240,237,232,0.42);
    --border-light: rgba(15,15,15,0.09);
    --border-dark:  rgba(240,237,232,0.09);
    --font-serif:   'Cormorant Garamond', serif;
    --font-sans:    'DM Sans', sans-serif;
    --max-w:        1200px;
    --px:           3.5rem;
    --py:           11rem;
    --t-display:    clamp(5rem, 14vw, 13rem);
    --t-h2:         clamp(2.2rem, 4vw, 4rem);
    --t-body:       clamp(0.95rem, 1.4vw, 1.05rem);
    --t-micro:      0.65rem;
  }

  html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    scroll-behavior: smooth;
  }

  body {
    background: var(--bg-light);
    color: var(--ink);
    font-family: var(--font-sans);
    overflow-x: hidden;
    width: 100%;
  }

  img { display: block; max-width: 100%; }
  a   { color: inherit; }
  button { font-family: inherit; }

  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(15,15,15,0.15); border-radius: 2px; }

  .section-divider {
    height: 1px;
    background: var(--border-light);
    width: 100%;
    transform-origin: left;
  }

  @media (max-width: 1280px) { :root { --px: 3rem;   --py: 10rem; } }
  @media (max-width: 1024px) { :root { --px: 2.5rem; --py: 8rem;  } }
  @media (max-width: 768px)  { :root { --px: 2rem;   --py: 6rem;  } }
  @media (max-width: 480px)  { :root { --px: 1.4rem; --py: 4.5rem;} }
`;

// ─── Animated divider ──────────────────────────────────────────────────────────
function Divider() {
  return (
    <motion.div
      className="section-divider"
      initial={{ scaleX: 0, originX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 1.2, ease: EASE_OUT }}
    />
  );
}

// ─── Sphere section wrapper ────────────────────────────────────────────────────
// Gives the 3D gallery a proper editorial header above it so it reads as a
// native section, not an embedded widget.
function SphereSection() {
  const headerRef = useRef(null);
  const inView    = useInView(headerRef, { once: true, margin: "-60px" });

  return (
    <section id="gallery" style={{ background: "#0d0c0b", width: "100%" }}>

      {/* Section header — matches the design language of ProjectsGrid */}
      <div
        ref={headerRef}
        style={{
          padding:         "var(--py, 11rem) var(--px, 3.5rem) 0",
          display:         "flex",
          alignItems:      "flex-end",
          justifyContent:  "space-between",
          flexWrap:        "wrap",
          gap:             "1.5rem",
          borderBottom:    "1px solid rgba(240,237,232,0.09)",
          paddingBottom:   "2.5rem",
          marginBottom:    "0",
        }}
      >
        {/* Left — eyebrow + heading */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE_OUT }}
            style={{
              fontFamily:    "var(--font-sans, 'DM Sans', sans-serif)",
              fontWeight:    300,
              fontSize:      "0.65rem",
              letterSpacing: "0.26em",
              textTransform: "uppercase",
              color:         "rgba(240,237,232,0.38)",
              display:       "flex",
              alignItems:    "center",
              gap:           "0.7rem",
              marginBottom:  "1.4rem",
            }}
          >
            <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "rgba(240,237,232,0.38)", flexShrink: 0 }} />
            Work in 3D
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.09, ease: EASE_OUT }}
            style={{
              fontFamily:    "var(--font-serif, 'Cormorant Garamond', serif)",
              fontWeight:    300,
              fontSize:      "clamp(2.6rem, 5vw, 4.5rem)",
              lineHeight:    1,
              letterSpacing: "-0.02em",
              color:         "#f0ede8",
              margin:        0,
            }}
          >
            Explore the archive
          </motion.h2>
        </div>

        {/* Right — descriptor */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE_OUT }}
          style={{
            fontFamily:  "var(--font-sans, 'DM Sans', sans-serif)",
            fontWeight:  300,
            fontSize:    "0.88rem",
            lineHeight:  1.78,
            color:       "rgba(240,237,232,0.4)",
            maxWidth:    "340px",
            margin:      0,
            paddingBottom: "6px",
          }}
        >
          Twenty-two projects, arranged across space. Drag to orbit — hover to pause.
        </motion.p>
      </div>

      {/* The 3D canvas — full viewport height */}
      <SphereGallery
        bg="#0d0c0b"
        radius={2.8}
        cardWidth={0.85}
        cardHeight={1.1}
      />
    </section>
  );
}

// ─── Smooth anchor scroll ──────────────────────────────────────────────────────
function useSmoothScroll() {
  useEffect(() => {
    const handler = (e) => {
      const anchor = e.target.closest("a[href^='#']");
      if (!anchor) return;
      const id = anchor.getAttribute("href").slice(1);
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.pushState(null, "", `#${id}`);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);
}

// ─── Page data ─────────────────────────────────────────────────────────────────
const PROJECTS = [
  { id:1, title:"Forma Studio",   category:"Brand Identity",    year:"2024", href:"#", size:"tall",   image:"https://picsum.photos/seed/FormaStudio/900/700" },
  { id:2, title:"Meridian",       category:"Web Design",         year:"2024", href:"#", size:"normal", image:"https://picsum.photos/seed/Meridian/800/600" },
  { id:3, title:"Arc Collective", category:"Art Direction",       year:"2023", href:"#", size:"normal", image:"https://picsum.photos/seed/ArcCollective/800/600" },
  { id:4, title:"Dusk Interiors", category:"Digital Experience", year:"2023", href:"#", size:"normal", image:"https://picsum.photos/seed/DuskInteriors/800/600" },
  { id:5, title:"Vessel",         category:"Brand Identity",     year:"2023", href:"#", size:"tall",   image:"https://picsum.photos/seed/VesselBrand/900/700" },
  { id:6, title:"Pale Blue",      category:"Web Design",         year:"2022", href:"#", size:"normal", image:"https://picsum.photos/seed/PaleBlue/800/600" },
];

const PHILOSOPHY = {
  label: "Our Philosophy",
  items: [
    { heading:"Restraint over decoration.",  body:"We remove until nothing more can be taken away. Every element earns its place, or it doesn't appear." },
    { heading:"Systems, not surfaces.",       body:"We design from the inside out — structure, logic, and language first. Visual form follows as a natural consequence." },
    { heading:"Slow down to go far.",         body:"We work with a small number of clients at a time. That means more thinking, fewer shortcuts, and better outcomes." },
  ],
};

const SERVICES = [
  { id:"01", title:"Brand Identity",           description:"We build complete visual identities — mark, wordmark, colour, type, and motion — that hold their character across every surface and scale.",                              tags:["Strategy","Logo","Typography","Colour","Guidelines"] },
  { id:"02", title:"Web Design & Development", description:"Bespoke digital experiences, from information architecture and interaction design through to production-ready code. Performance, accessibility, and beauty — in that order.", tags:["UX/UI","Prototyping","React","Framer","CMS"] },
  { id:"03", title:"Art Direction",            description:"Creative direction for campaigns, editorial shoots, and brand worlds. We shape how a brand looks, moves, and feels across photography, video, and print.",               tags:["Campaign","Photography","Video","Editorial"] },
  { id:"04", title:"Digital Experience",       description:"Interactive installations, data-driven interfaces, and web applications that put craft at the centre of complex problems.",                                               tags:["Interaction","Animation","WebGL","Data Viz"] },
];

const SOCIALS = [
  { label:"Instagram",   href:"https://instagram.com" },
  { label:"Twitter / X", href:"https://twitter.com" },
  { label:"LinkedIn",    href:"https://linkedin.com" },
  { label:"Dribbble",    href:"https://dribbble.com" },
];

// ─── Home ──────────────────────────────────────────────────────────────────────
export default function Home() {
  useSmoothScroll();

  return (
    <>
      <style>{GLOBAL_CSS}</style>

      <AnimatePresence mode="wait">
        <motion.div
          key="home"
          variants={PAGE_VARIANTS}
          initial="initial"
          animate="enter"
          exit="exit"
          style={{ width: "100%", overflowX: "hidden" }}
        >
          {/* 1 ── Fixed navbar */}
          <Navbar />

          {/* 2 ── Hero — full-width headline */}
          <Hero
            eyebrow="Filmovert — Est. 2025"
            lines={["We shape", "brands that", "last."]}
            sub="Strategy, design, and technology — crafted with intention for companies that refuse to be ordinary."
            cta={{ label: "See our work", href: "#work" }}
            theme="light"
          />

          {/* 3 ── Projects grid */}
          <ProjectsGrid
            label="Selected Work"
            title="Projects"
            projects={PROJECTS}
            bg="var(--bg-light)"
          />

          {/* 4 ── 3D Sphere gallery — dark section, full viewport height */}
          <SphereSection />

          {/* 5 ── About */}
          <About
            eyebrow="About Filmovert"
            heading="We believe great design is an act of clarity."
            description="Founded in 2025, Filmovert is a small studio of designers, strategists, and technologists who partner with ambitious companies to build brands and digital products that endure. We don't do volume. We do depth."
            image="https://picsum.photos/seed/AboutStudio/900/1100"
            imageCaption="Our studio — India"
            philosophy={PHILOSOPHY}
            cta={{ label: "Start a conversation", href: "#contact" }}
            theme="light"
          />

          <Divider />

          {/* 6 ── Services */}
          <Services
            eyebrow="What we do"
            heading="Our services"
            sub="A focused set of disciplines, delivered with depth."
            services={SERVICES}
            theme="light"
          />

          {/* 7 ── CTA */}
          <CTA
            eyebrow="Ready when you are"
            headline={["Let's build", "something", "great."]}
            sub="We take on a small number of projects each year. If you have something worth making, we'd like to hear about it."
            primaryCta={{ label: "Start a project", href: "#contact" }}
            secondaryCta={{ label: "hello@filmovert.com", href: "mailto:hello@filmovert.com" }}
            marqueeText="Let's work together"
            theme="dark"
          />

          {/* 8 ── Footer */}
          <Footer
            logo="Filmovert"
            tagline="Crafting brands and digital experiences that endure."
            email="hello@filmovert.com"
            location="India"
            socials={SOCIALS}
            legal={`© ${new Date().getFullYear()} Filmovert. All rights reserved.`}
            theme="dark"
          />
        </motion.div>
      </AnimatePresence>
    </>
  );
}