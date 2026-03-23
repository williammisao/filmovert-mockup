/**
 * AboutPage.jsx — Standalone /about page
 * Navbar is rendered in App.jsx — do NOT add it here.
 */

import { motion } from "framer-motion";
import { PAGE_VARIANTS } from "./animations";

import About  from "./About";
import Footer from "./Footer";

const PAGE_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@300;400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg-light:     #f5f3ef;
    --bg-dark:      #0a0a0a;
    --ink:          #0f0f0f;
    --ink-inv:      #f0ede8;
    --font-serif:   'Cormorant Garamond', serif;
    --font-sans:    'DM Sans', sans-serif;
    --max-w:        1200px;
    --px:           3.5rem;
    --py:           11rem;
    --border-light: rgba(15,15,15,0.09);
  }

  html { font-size: 16px; -webkit-font-smoothing: antialiased; scroll-behavior: smooth; }
  body { background: var(--bg-light); color: var(--ink); font-family: var(--font-sans); overflow-x: hidden; }
  img { display: block; max-width: 100%; }
  a   { color: inherit; }
  button { font-family: inherit; }

  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(15,15,15,0.15); border-radius: 2px; }

  @media (max-width: 1280px) { :root { --px: 3rem;   --py: 10rem; } }
  @media (max-width: 1024px) { :root { --px: 2.5rem; --py: 8rem;  } }
  @media (max-width: 768px)  { :root { --px: 2rem;   --py: 6rem;  } }
  @media (max-width: 480px)  { :root { --px: 1.4rem; --py: 4.5rem;} }
`;

const SOCIALS = [
  { label: "Instagram",   href: "https://instagram.com" },
  { label: "Twitter / X", href: "https://twitter.com"   },
  { label: "LinkedIn",    href: "https://linkedin.com"  },
  { label: "Dribbble",    href: "https://dribbble.com"  },
];

const PHILOSOPHY = {
  label: "Our Philosophy",
  items: [
    { heading: "Restraint over decoration.",  body: "We remove until nothing more can be taken away. Every element earns its place, or it doesn't appear." },
    { heading: "Systems, not surfaces.",       body: "We design from the inside out — structure, logic, and language first. Visual form follows as a natural consequence." },
    { heading: "Slow down to go far.",         body: "We work with a small number of clients at a time. That means more thinking, fewer shortcuts, and better outcomes." },
  ],
};

export default function AboutPage() {
  return (
    <>
      <style>{PAGE_CSS}</style>

      <motion.div
        variants={PAGE_VARIANTS}
        initial="initial"
        animate="enter"
        exit="exit"
        style={{ width: "100%", overflowX: "hidden" }}
      >
        <About
          eyebrow="About Filmovert"
          heading="We believe great design is an act of clarity."
          description="Founded in 2024, Filmovert is a creative studio specialising in film and digital experiences that endure. We don't do volume. We do depth."
          image="https://picsum.photos/seed/AboutStudio/900/1100"
          imageCaption="Filmovert Studio"
          philosophy={PHILOSOPHY}
          cta={{ label: "Start a conversation", href: "mailto:hello@filmovert.com" }}
          theme="light"
        />

        <Footer
          logo="Filmovert"
          tagline="Crafting films and digital experiences that endure."
          email="hello@filmovert.com"
          location="Your Location"
          socials={SOCIALS}
          legal={`© ${new Date().getFullYear()} Filmovert. All rights reserved.`}
          theme="dark"
        />
      </motion.div>
    </>
  );
}