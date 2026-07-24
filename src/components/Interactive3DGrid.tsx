import { useEffect, useRef, useState } from "react";

export default function Interactive3DGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tiles, setTiles] = useState<{ id: number }[]>([]);
  const tilesRef = useRef<HTMLDivElement[]>([]);
  const gridRef = useRef({ cols: 1, rows: 1, tw: 48, th: 48 });

  const TARGET = 48;
  const RADIUS = 100;  // ~2 tile widths → 4-6 tiles
  const MAX_TILT = 42; // dramatic peel

  useEffect(() => {
    const calculateGrid = () => {
      const el = containerRef.current;
      if (!el) return;
      const W = el.clientWidth;
      const H = el.clientHeight;
      const cols = Math.max(1, Math.round(W / TARGET));
      const rows = Math.max(1, Math.round(H / TARGET));
      gridRef.current = { cols, rows, tw: W / cols, th: H / rows };
      setTiles(Array.from({ length: cols * rows }, (_, i) => ({ id: i })));
      tilesRef.current = [];
      el.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
      el.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    };

    calculateGrid();
    const ro = new ResizeObserver(calculateGrid);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const trigger = container.parentElement || container;

    if (!window.matchMedia("(hover: hover)").matches) return;

    let rafId = 0;
    let mx = -9999, my = -9999;
    // Track which tiles are "active" to know when to restore transition
    const activeSet = new Set<number>();

    const SPRING_BACK = "transform 0.65s cubic-bezier(0.22,1,0.36,1), background-color 0.5s ease, border-color 0.5s ease, box-shadow 0.55s ease";
    const INSTANT     = "none"; // no transition while mouse is moving — snaps immediately

    const applyFrame = () => {
      const rect = container.getBoundingClientRect();
      const relX = mx - rect.left;
      const relY = my - rect.top;
      const { cols, tw, th } = gridRef.current;

      tilesRef.current.forEach((tile, idx) => {
        if (!tile) return;

        const col = idx % cols;
        const row = Math.floor(idx / cols);
        const cx = col * tw + tw / 2;
        const cy = row * th + th / 2;

        const dx = relX - cx;
        const dy = relY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < RADIUS) {
          const raw = (RADIUS - dist) / RADIUS;
          const s = raw * raw; // quadratic falloff

          // Peel: near edge lifts toward viewer, hinge at far edge
          const rotY = -(dx / RADIUS) * MAX_TILT * s;
          const rotX =  (dy / RADIUS) * MAX_TILT * s;
          const lift = s * 38;
          const scale = 1 + s * 0.03;

          // Hinge origin at far edge from cursor
          const ox = dx >= 0 ? "0%" : "100%";
          const oy = dy >= 0 ? "0%" : "100%";

          // Cast shadow: offset away from cursor, deeper = more lift
          const shX = -(dx / RADIUS) * lift * 0.55;
          const shY = -(dy / RADIUS) * lift * 0.55 + lift * 0.35;
          const shBlur = lift * 2.2;

          // Curl gradient: bright shimmer at lifted edge → transparent at hinge
          const gradAngle = Math.atan2(-dy, -dx) * (180 / Math.PI);
          // Crease line at hinge (faint dark line where paper bends)
          const creaseAngle = gradAngle + 180;

          const peelGrad = [
            `linear-gradient(${gradAngle}deg, rgba(255,252,245,${s * 0.7}) 0%, rgba(250,249,246,0) 55%)`,
            `linear-gradient(${creaseAngle}deg, rgba(0,0,0,${s * 0.06}) 0%, transparent 18%)`,
          ].join(", ");

          // Snap instantly on hover-enter/move
          tile.style.transition = INSTANT;
          tile.style.transformOrigin = `${ox} ${oy}`;
          tile.style.transform = `perspective(420px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(${lift}px) scale(${scale})`;
          tile.style.backgroundColor = "rgba(250,249,246,1)";
          tile.style.backgroundImage = peelGrad;
          tile.style.borderColor = `rgba(197,168,128,${0.08 + s * 0.5})`;
          tile.style.boxShadow = `${shX}px ${shY}px ${shBlur}px rgba(0,0,0,${s * 0.14}), inset 0 0 8px rgba(197,168,128,${s * 0.1})`;
          tile.style.zIndex = String(Math.round(s * 10));

          activeSet.add(idx);
        } else if (activeSet.has(idx)) {
          // Was active — restore spring-back transition then reset
          tile.style.transition = SPRING_BACK;
          tile.style.transformOrigin = "center center";
          tile.style.transform = "";
          tile.style.backgroundColor = "transparent";
          tile.style.backgroundImage = "none";
          tile.style.borderColor = "transparent";
          tile.style.boxShadow = "none";
          tile.style.zIndex = "0";
          activeSet.delete(idx);
        }
        // tiles that were never active: untouched (already transparent)
      });

      rafId = 0;
    };

    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      if (!rafId) rafId = requestAnimationFrame(applyFrame);
    };

    const onLeave = () => {
      mx = -9999; my = -9999;
      tilesRef.current.forEach((tile, idx) => {
        if (!tile || !activeSet.has(idx)) return;
        tile.style.transition = SPRING_BACK;
        tile.style.transformOrigin = "center center";
        tile.style.transform = "";
        tile.style.backgroundColor = "transparent";
        tile.style.backgroundImage = "none";
        tile.style.borderColor = "transparent";
        tile.style.boxShadow = "none";
        tile.style.zIndex = "0";
      });
      activeSet.clear();
    };

    trigger.addEventListener("mousemove", onMove);
    trigger.addEventListener("mouseleave", onLeave);
    return () => {
      trigger.removeEventListener("mousemove", onMove);
      trigger.removeEventListener("mouseleave", onLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [tiles]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{ display: "grid" }}
    >
      {tiles.map((tile, idx) => (
        <div
          key={tile.id}
          ref={(el) => { if (el) tilesRef.current[idx] = el; }}
          style={{
            position: "relative",
            boxSizing: "border-box",
            border: "0.5px solid transparent",
            backgroundColor: "transparent",
            backgroundImage: "none",
            transformStyle: "preserve-3d",
            transformOrigin: "center center",
            willChange: "transform, background-color, box-shadow",
            // Default transition for spring-back; overridden to "none" on active
            transition:
              "transform 0.65s cubic-bezier(0.22,1,0.36,1), background-color 0.5s ease, border-color 0.5s ease, box-shadow 0.55s ease",
          }}
        />
      ))}
    </div>
  );
}
