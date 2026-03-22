import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import ProjectCard from "./ProjectCard";
import { EASE_OUT, Reveal, RevealLine } from "./animations";

const DEFAULT_PROJECTS = [
  { id:1, title:"Forma Studio",   category:"Brand Identity",    year:"2024", href:"#", size:"tall",   image:"https://picsum.photos/seed/FormaStudio/900/700" },
  { id:2, title:"Meridian",       category:"Web Design",         year:"2024", href:"#", size:"normal", image:"https://picsum.photos/seed/Meridian/800/600" },
  { id:3, title:"Arc Collective", category:"Art Direction",       year:"2023", href:"#", size:"normal", image:"https://picsum.photos/seed/ArcCollective/800/600" },
  { id:4, title:"Dusk Interiors", category:"Digital Experience", year:"2023", href:"#", size:"normal", image:"https://picsum.photos/seed/DuskInteriors/800/600" },
  { id:5, title:"Vessel",         category:"Brand Identity",     year:"2023", href:"#", size:"tall",   image:"https://picsum.photos/seed/VesselBrand/900/700" },
  { id:6, title:"Pale Blue",      category:"Web Design",         year:"2022", href:"#", size:"normal", image:"https://picsum.photos/seed/PaleBlue/800/600" },
];

function SectionHeader({ label, title, count }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        paddingBottom: "2.5rem",       /* more space above rule */
        marginBottom: "4rem",          /* generous gap to grid */
        flexWrap: "wrap",
        gap: "1.5rem",
        position: "relative",
      }}
    >
      {/* Animated rule at bottom */}
      <motion.div
        initial={{ scaleX: 0, originX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.1, ease: EASE_OUT }}
        style={{ position:"absolute", bottom:0, left:0, right:0, height:"1px", background:"rgba(15,15,15,0.09)" }}
      />

      <div>
        {/* Eyebrow — tiny, very spaced */}
        <motion.div
          initial={{ opacity:0, y:14 }}
          animate={inView ? { opacity:1, y:0 } : {}}
          transition={{ duration:0.7, ease:EASE_OUT }}
          style={{
            fontFamily:"'DM Sans',sans-serif",
            fontWeight:300,
            fontSize:"0.65rem",
            letterSpacing:"0.26em",
            textTransform:"uppercase",
            color:"rgba(15,15,15,0.38)",
            display:"flex",
            alignItems:"center",
            gap:"0.7rem",
            marginBottom:"1.4rem",   /* clear gap between eyebrow and heading */
          }}
        >
          <span style={{ width:"5px", height:"5px", borderRadius:"50%", background:"rgba(15,15,15,0.38)", flexShrink:0 }} />
          {label}
        </motion.div>

        {/* Section heading — larger, strong serif */}
        <motion.h2
          initial={{ opacity:0, y:24 }}
          animate={inView ? { opacity:1, y:0 } : {}}
          transition={{ duration:0.9, delay:0.09, ease:EASE_OUT }}
          style={{
            fontFamily:"'Cormorant Garamond',serif",
            fontWeight:300,
            fontSize:"clamp(2.6rem, 5vw, 4.5rem)",  /* bigger than before */
            lineHeight:1,
            letterSpacing:"-0.02em",
            color:"#0f0f0f",
            margin:0,
          }}
        >
          {title}
        </motion.h2>
      </div>

      {/* Count — right-aligned, very small */}
      <motion.span
        initial={{ opacity:0 }}
        animate={inView ? { opacity:1 } : {}}
        transition={{ duration:0.7, delay:0.28 }}
        style={{
          fontFamily:"'DM Sans',sans-serif",
          fontWeight:300,
          fontSize:"0.65rem",
          letterSpacing:"0.2em",
          textTransform:"uppercase",
          color:"rgba(15,15,15,0.32)",
          paddingBottom:"6px",
        }}
      >
        {String(count).padStart(2,"0")} Projects
      </motion.span>
    </div>
  );
}

function EditorialGrid({ projects }) {
  const rows = [];
  let i = 0, rowIdx = 0;

  while (i < projects.length) {
    const rem = projects.length - i;
    if (rem >= 3) {
      if (rowIdx % 2 === 0) {
        rows.push(
          <div key={`r${i}`} style={{ display:"grid", gridTemplateColumns:"5fr 7fr", gap:"1.8rem", marginBottom:"1.8rem" }}>
            <ProjectCard {...projects[i]}     index={i}   size="tall" />
            <div style={{ display:"flex", flexDirection:"column", gap:"1.8rem" }}>
              <ProjectCard {...projects[i+1]} index={i+1} size="normal" />
              <ProjectCard {...projects[i+2]} index={i+2} size="normal" />
            </div>
          </div>
        );
      } else {
        rows.push(
          <div key={`r${i}`} style={{ display:"grid", gridTemplateColumns:"7fr 5fr", gap:"1.8rem", marginBottom:"1.8rem" }}>
            <div style={{ display:"flex", flexDirection:"column", gap:"1.8rem" }}>
              <ProjectCard {...projects[i]}   index={i}   size="normal" />
              <ProjectCard {...projects[i+1]} index={i+1} size="normal" />
            </div>
            <ProjectCard {...projects[i+2]} index={i+2} size="tall" />
          </div>
        );
      }
      i += 3; rowIdx++;
    } else {
      const rest = projects.slice(i);
      rows.push(
        <div key={`r${i}`} style={{ display:"grid", gridTemplateColumns:`repeat(${Math.min(rest.length,3)},1fr)`, gap:"1.8rem" }}>
          {rest.map((p, j) => <ProjectCard key={p.id} {...p} index={i+j} size="normal" />)}
        </div>
      );
      i += rest.length;
    }
  }
  return <div>{rows}</div>;
}

export default function ProjectsGrid({
  projects = DEFAULT_PROJECTS,
  label    = "Selected Work",
  title    = "Projects",
  bg       = "#f5f3ef",
}) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300&family=DM+Sans:wght@300;400&display=swap');

        .pg-section {
          background: ${bg};
          /* Use CSS var for responsive padding */
          padding: var(--py, 11rem) var(--px, 3.5rem);
          font-family: 'DM Sans', sans-serif;
        }
        .pg-inner { max-width: var(--max-w, 1200px); margin: 0 auto; }

        /* Footer CTA */
        .pg-footer {
          margin-top: 5rem;          /* larger gap after grid */
          padding-top: 3.5rem;
          border-top: 1px solid rgba(15,15,15,0.09);
          display: flex;
          justify-content: center;
        }
        .pg-cta {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 0.72rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #0f0f0f;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.7rem;
          padding-bottom: 3px;
          border-bottom: 1px solid rgba(15,15,15,0.22);
          transition: gap 0.28s ease, border-color 0.25s ease;
        }
        .pg-cta:hover { gap: 1.1rem; border-color: #0f0f0f; }

        @media (max-width: 700px) {
          /* Grid collapses to single column on mobile */
          .pg-grid-row > div { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <section className="pg-section" id="work">
        <div className="pg-inner">
          <SectionHeader label={label} title={title} count={projects.length} />
          <EditorialGrid projects={projects} />
          <div className="pg-footer">
            <Reveal>
              <a href="#all-work" className="pg-cta">View all projects ↗</a>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
