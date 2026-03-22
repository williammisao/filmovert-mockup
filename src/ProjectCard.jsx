import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { EASE_OUT } from "./animations";

export default function ProjectCard({
  index   = 0,
  title   = "Project Title",
  category = "Category",
  image,
  year    = "2024",
  href    = "#",
  size    = "normal",
}) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);

  // 3D tilt
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [4, -4]),  { stiffness: 150, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-4, 4]),  { stiffness: 150, damping: 18 });

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width  - 0.5);
    my.set((e.clientY - r.top)  / r.height - 0.5);
  };
  const onLeave = () => { mx.set(0); my.set(0); };

  const height = size === "tall" ? "min(72vh, 640px)" : "min(56vh, 500px)";

  return (
    <>
      <style>{`
        .pc-root { display:block; text-decoration:none; position:relative; overflow:hidden; cursor:pointer; background:#1a1a18; transform-style:preserve-3d; will-change:transform; }
        .pc-img { width:100%; height:100%; object-fit:cover; display:block; transition:transform 0.9s cubic-bezier(0.16,1,0.3,1), filter 0.9s cubic-bezier(0.16,1,0.3,1); will-change:transform; }
        .pc-root:hover .pc-img { transform:scale(1.08); filter:brightness(0.5); }
        .pc-overlay { position:absolute; inset:0; background:linear-gradient(to top,rgba(8,8,7,0.72) 0%,rgba(8,8,7,0.06) 55%,transparent 100%); }
        .pc-meta { position:absolute; bottom:0; left:0; right:0; padding:1.6rem 1.8rem; display:flex; align-items:flex-end; justify-content:space-between; gap:1rem; z-index:2; }
        .pc-title { font-family:'Cormorant Garamond',serif; font-weight:300; font-size:clamp(1.4rem,2.8vw,2rem); line-height:1.05; color:#f0ede8; letter-spacing:-0.01em; margin:0; transform:translateY(5px); transition:transform 0.65s cubic-bezier(0.16,1,0.3,1); }
        .pc-root:hover .pc-title { transform:translateY(0); }
        .pc-right { display:flex; flex-direction:column; align-items:flex-end; gap:4px; flex-shrink:0; }
        .pc-cat { font-family:'DM Sans',sans-serif; font-weight:300; font-size:0.62rem; letter-spacing:0.2em; text-transform:uppercase; color:rgba(240,237,232,0.55); opacity:0; transform:translateY(7px); transition:opacity 0.45s 0.05s ease, transform 0.5s 0.05s cubic-bezier(0.16,1,0.3,1); }
        .pc-root:hover .pc-cat { opacity:1; transform:none; }
        .pc-year { font-family:'DM Sans',sans-serif; font-weight:300; font-size:0.62rem; letter-spacing:0.14em; color:rgba(240,237,232,0.32); }
        .pc-arrow { position:absolute; top:1.4rem; right:1.6rem; width:36px; height:36px; border:1px solid rgba(240,237,232,0.25); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.85rem; color:#f0ede8; opacity:0; transform:translate(-6px,6px) scale(0.85); transition:opacity 0.38s ease, transform 0.5s cubic-bezier(0.16,1,0.3,1); z-index:2; }
        .pc-root:hover .pc-arrow { opacity:1; transform:translate(0,0) scale(1); }
        .pc-idx { position:absolute; top:1.4rem; left:1.6rem; font-family:'DM Sans',sans-serif; font-weight:300; font-size:0.62rem; letter-spacing:0.18em; color:rgba(240,237,232,0.32); z-index:2; }
        /* Category pill that slides in from bottom on hover */
        .pc-pill { position:absolute; bottom:1.6rem; left:50%; transform:translateX(-50%) translateY(16px); background:rgba(240,237,232,0.12); border:1px solid rgba(240,237,232,0.18); padding:0.4rem 1rem; font-family:'DM Sans',sans-serif; font-size:0.6rem; letter-spacing:0.18em; text-transform:uppercase; color:#f0ede8; white-space:nowrap; opacity:0; backdrop-filter:blur(8px); transition:opacity 0.35s ease, transform 0.45s cubic-bezier(0.16,1,0.3,1); z-index:3; display:none; }
      `}</style>

      <motion.a
        ref={ref}
        href={href}
        className="pc-root"
        style={{ height, rotateX: rx, rotateY: ry, perspective: 800 }}
        onMouseMove={onMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); onLeave(); }}
        initial={{ opacity: 0, y: 44 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.95, delay: (index % 3) * 0.13, ease: EASE_OUT }}
        whileTap={{ scale: 0.98 }}
      >
        <div style={{ position: "absolute", inset: 0 }}>
          <img
            className="pc-img"
            src={image || `https://picsum.photos/seed/${title.replace(/\s/g,"")}/800/600`}
            alt={title}
            loading="lazy"
          />
        </div>
        <div className="pc-overlay" />
        <span className="pc-idx">0{index + 1}</span>
        <span className="pc-arrow">↗</span>
        <div className="pc-meta">
          <h3 className="pc-title">{title}</h3>
          <div className="pc-right">
            <span className="pc-cat">{category}</span>
            <span className="pc-year">{year}</span>
          </div>
        </div>
      </motion.a>
    </>
  );
}