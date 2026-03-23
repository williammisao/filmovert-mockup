import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EASE_OUT, Reveal } from "./animations";

const SERVICES_DATA = {
  STRATEGY: [
    "Brand Ecosystem & Roadmap",
    "Brand Positioning & Architecture",
    "Brand Messaging",
    "Brand Narrative",
    "Market & Consumer Analysis",
    "Go-To-Market Strategy"
  ],
  BRANDING: [
    "Visual Identity Systems",
    "Logo & Mark Design",
    "Brand Guidelines",
    "Typography & Color Theory",
    "Packaging Design",
    "Brand Collateral"
  ],
  DIGITAL: [
    "Design Systems & Guidelines",
    "UI Design",
    "Visual Design",
    "Digital Asset Playbooks",
    "Interactive Prototyping",
    "UX Principles Integration"
  ],
  MARKETING: [
    "Content Strategy",
    "Social Media Management",
    "SEO & SEM",
    "Email Marketing",
    "Paid Advertising",
    "Performance Tracking"
  ],
  PRODUCTION: [
    "Video Production",
    "Motion Graphics",
    "3D Rendering",
    "Photography",
    "Post-Production",
    "Sound Design"
  ]
};

export default function Services({ theme = "light" }) {
  const [activeTab, setActiveTab] = useState("STRATEGY");
  
  const isDark = theme === "dark";
  const ink = isDark ? "var(--ink-inv)" : "var(--ink)";
  const muted = isDark ? "rgba(240,237,232,0.3)" : "rgba(15,15,15,0.3)";

  return (
    <section id="services" style={{ 
      padding: "160px var(--px)", 
      background: isDark ? "var(--bg-dark)" : "var(--bg-light)",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center"
    }}>
      
      {/* ── Top Section: Interactive Title Grid ── */}
      <div style={{ marginBottom: "100px" }}>
        <Reveal>
          <span style={{ 
            fontSize: "0.75rem", 
            letterSpacing: "0.25em", 
            textTransform: "uppercase", 
            color: muted,
            display: "block",
            marginBottom: "50px",
            fontFamily: "var(--font-sans)"
          }}>
            [ Capabilities ]
          </span>
        </Reveal>

        <div style={{ 
          display: "flex", 
          flexWrap: "wrap", 
          gap: "1.5rem 5rem",
          alignItems: "baseline" 
        }}>
          {Object.keys(SERVICES_DATA).map((key) => (
            <motion.h2
              key={key}
              onMouseEnter={() => setActiveTab(key)}
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(3.5rem, 8vw, 8rem)",
                lineHeight: 0.9,
                cursor: "pointer",
                margin: 0,
                color: activeTab === key ? ink : muted,
                transition: "color 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                textTransform: "uppercase",
                display: "flex",
                alignItems: "center",
                position: "relative"
              }}
            >
              {activeTab === key && (
                <motion.span 
                  layoutId="active-indicator"
                  style={{ 
                    width: "14px", 
                    height: "14px", 
                    borderRadius: "50%", 
                    background: ink,
                    position: "absolute",
                    left: "-30px",
                    top: "50%",
                    translateY: "-50%"
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              {key}
            </motion.h2>
          ))}
        </div>
      </div>

      {/* ── Bottom Section: Detail Reveal ── */}
      <div style={{ 
        borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`, 
        paddingTop: "60px",
        display: "grid",
        gridTemplateColumns: "1fr 2fr",
        gap: "40px"
      }}>
        {/* Left Column: Active Label */}
        <div>
          <motion.p
            key={`label-${activeTab}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ 
              fontSize: "0.8rem", 
              color: ink, 
              textTransform: "uppercase", 
              letterSpacing: "0.15em",
              fontFamily: "var(--font-sans)"
            }}
          >
            Core / {activeTab}
          </motion.p>
        </div>

        {/* Right Column: Detailed List */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 60px" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6, ease: EASE_OUT }}
              style={{ gridColumn: "span 2", display: "grid", gridTemplateColumns: "1fr 1fr" }}
            >
              {SERVICES_DATA[activeTab].map((item) => (
                <div key={item} style={{ 
                  fontSize: "1.2rem", 
                  color: ink, 
                  padding: "16px 0",
                  fontFamily: "var(--font-sans)",
                  fontWeight: 300,
                  borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  {item}
                  <span style={{ fontSize: "0.7rem", opacity: 0.3 }}>/</span>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile Styles (Injected) */}
      <style>{`
        @media (max-width: 900px) {
          #services { padding-top: 100px; padding-bottom: 100px; }
          #services h2 { font-size: 4rem; }
          #services .active-indicator { display: none; }
          #services > div:last-child { grid-template-columns: 1fr; }
          #services > div:last-child > div:last-child { grid-template-columns: 1fr; }
          #services > div:last-child > div:last-child > div { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}