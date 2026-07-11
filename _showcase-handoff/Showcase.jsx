import { useState } from "react";

const PROJECTS = [
  {
    id: "modern",
    name: "Modern Lighting Co.",
    tag: "Contemporary showroom",
    accent: "#C9A96E",
    heroGrad: "linear-gradient(135deg, #3a3a3a, #1f1f1f)",
    cols: 3,
  },
  {
    id: "coastal",
    name: "Coastal Illumination",
    tag: "Coastal & natural",
    accent: "#8FB4C4",
    heroGrad: "linear-gradient(135deg, #2c3e44, #1a2529)",
    cols: 2,
  },
  {
    id: "heritage",
    name: "Heritage Fixtures",
    tag: "Traditional & timeless",
    accent: "#B08D57",
    heroGrad: "linear-gradient(135deg, #3a3228, #1f1b16)",
    cols: 4,
  },
];

function ScreenContent({ project, isPhone }) {
  const cells = isPhone ? 4 : project.cols;
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column" }}>
      <div style={{
        height: isPhone ? "14%" : "12%",
        background: "#0d0d0d",
        display: "flex",
        alignItems: "center",
        padding: "0 8%",
      }}>
        <div style={{ width: "22%", height: "30%", background: project.accent, borderRadius: 2 }} />
      </div>
      <div style={{ flex: 1, background: project.heroGrad, position: "relative", transition: "background 0.5s ease" }}>
        <div style={{
          position: "absolute", bottom: isPhone ? "30%" : "32%", left: "8%",
          width: isPhone ? "55%" : "45%", height: isPhone ? "6%" : "9%",
          background: "rgba(255,255,255,0.25)", borderRadius: 2,
        }} />
        <div style={{
          position: "absolute", bottom: isPhone ? "16%" : "16%", left: "8%",
          width: isPhone ? "35%" : "25%", height: isPhone ? "5%" : "7%",
          background: project.accent, borderRadius: 2, transition: "background 0.5s ease",
        }} />
      </div>
      <div style={{
        height: isPhone ? "28%" : "26%",
        display: "grid",
        gridTemplateColumns: `repeat(${cells}, 1fr)`,
        gap: 4,
        padding: 6,
        background: "#0d0d0d",
      }}>
        {Array.from({ length: isPhone ? 4 : cells }).map((_, i) => (
          <div key={i} style={{ background: "#2a2a2a", borderRadius: 3 }} />
        ))}
      </div>
    </div>
  );
}

export default function Showcase() {
  const [active, setActive] = useState(0);
  const project = PROJECTS[active];

  return (
    <div style={{
      width: "100%",
      background: "#080808",
      borderRadius: 12,
      overflow: "hidden",
      fontFamily: "ui-sans-serif, system-ui, sans-serif",
    }}>
      <div style={{ padding: "64px 40px" }}>
        <div style={{ maxWidth: 560, marginBottom: 44 }}>
          <div style={{
            fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase",
            color: "#C9A96E", display: "flex", alignItems: "center", gap: 8, marginBottom: 18,
          }}>
            <span style={{ width: 24, height: 1, background: "#C9A96E" }} /> Our Work
          </div>
          <div style={{
            fontSize: 30, fontWeight: 500, color: "#fff",
            letterSpacing: "-0.5px", lineHeight: 1.2, marginBottom: 16,
          }}>
            Built for showrooms like yours.
          </div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.8, maxWidth: 460 }}>
            See how we've brought lighting showrooms online — each site designed around their brand, on every device.
          </div>
        </div>

        <div style={{
          display: "flex", alignItems: "flex-end", justifyContent: "center",
          marginBottom: 40, minHeight: 320,
        }}>
          <div style={{ width: 460, maxWidth: "70%", position: "relative", zIndex: 2 }}>
            <div style={{
              background: "#1a1a1a", border: "6px solid #2a2a2a",
              borderRadius: "12px 12px 0 0", aspectRatio: "16/10",
              overflow: "hidden", position: "relative",
            }}>
              <ScreenContent project={project} isPhone={false} />
            </div>
            <div style={{
              height: 14, background: "#2a2a2a", borderRadius: "0 0 10px 10px", position: "relative",
            }}>
              <div style={{
                position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
                width: 80, height: 4, background: "#1a1a1a", borderRadius: "0 0 6px 6px",
              }} />
            </div>
          </div>

          <div style={{ width: 130, marginLeft: -50, marginBottom: 18, position: "relative", zIndex: 3 }}>
            <div style={{
              background: "#1a1a1a", border: "5px solid #2a2a2a",
              borderRadius: 18, aspectRatio: "9/19", overflow: "hidden", position: "relative",
            }}>
              <div style={{
                position: "absolute", top: 5, left: "50%", transform: "translateX(-50%)",
                width: 40, height: 5, background: "#2a2a2a", borderRadius: 4, zIndex: 4,
              }} />
              <ScreenContent project={project} isPhone={true} />
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase",
            color: project.accent, marginBottom: 4, transition: "color 0.4s ease",
          }}>
            {project.tag}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          {PROJECTS.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setActive(i)}
              style={{
                fontSize: 12,
                color: i === active ? "#0a0a0a" : "rgba(255,255,255,0.5)",
                background: i === active ? p.accent : "transparent",
                border: i === active ? `0.5px solid ${p.accent}` : "0.5px solid rgba(255,255,255,0.15)",
                padding: "8px 18px",
                borderRadius: 20,
                cursor: "pointer",
                fontWeight: i === active ? 500 : 400,
                transition: "all 0.3s ease",
                fontFamily: "inherit",
              }}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
