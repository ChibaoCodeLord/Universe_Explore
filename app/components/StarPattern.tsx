"use client";

import { useState, useMemo, useRef, type CSSProperties, type MouseEvent } from "react";
import type { Constellation, ConstellationStar, ConstellationView } from "@/lib/constellations";
import { cosmicAudio } from "@/lib/cosmic-audio";
import ZodiacGlyph from "./ZodiacGlyph";

type StarPatternProps = {
  constellation: Constellation;
  view?: ConstellationView;
  compact?: boolean;
  decorative?: boolean;
  onStarSelect?: (star: ConstellationStar) => void;
};

function starSize(magnitude: number, compact: boolean = false) {
  const base = Math.max(5, Math.min(13, 13 - magnitude * 1.4));
  return compact ? Math.max(3.5, base * 0.75) : base;
}

function getSpectralColor(type?: string): string {
  if (!type) return "#ffffff";
  const first = type.charAt(0).toUpperCase();
  switch (first) {
    case "O": return "#9bb0ff";
    case "B": return "#bbccff";
    case "A": return "#f8f9ff";
    case "F": return "#ffffed";
    case "G": return "#fff4e8";
    case "K": return "#ffd2a1";
    case "M": return "#ff9e79";
    default: return "#ffffff";
  }
}

export default function StarPattern({
  constellation,
  view = "pattern",
  compact = false,
  decorative = false,
  onStarSelect,
}: StarPatternProps) {
  const [hoveredStar, setHoveredStar] = useState<ConstellationStar | null>(null);
  const [rotate3D, setRotate3D] = useState({ x: 0, y: 0 });
  const [isHoveringContainer, setIsHoveringContainer] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const starsById = useMemo(
    () => new Map(constellation.stars.map((star) => [star.id, star])),
    [constellation]
  );

  // Safely normalize celestial depth on a logarithmic scale across all constellations
  const { minLogDist, maxLogDist } = useMemo(() => {
    const logs = constellation.stars
      .map((s) => Math.log(Math.max(10, s.distanceLy || 100)));
    const min = Math.min(...logs);
    const max = Math.max(...logs);
    return { minLogDist: min, maxLogDist: max === min ? min + 1 : max };
  }, [constellation]);

  const summary = `${constellation.name} is shown as ${constellation.stars.length} guide stars. ${constellation.brightestStar} is highlighted as the brightest anchor star.`;

  // Interactive 3D Parallax Mouse movement (smooth, clamped angles)
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (decorative || compact || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;

    if (view === "depth") {
      setRotate3D({
        x: -ny * 20,
        y: nx * 24,
      });
    } else {
      setRotate3D({
        x: -ny * 7,
        y: nx * 7,
      });
    }
  };

  const handleMouseEnter = () => setIsHoveringContainer(true);
  const handleMouseLeave = () => {
    setIsHoveringContainer(false);
    setRotate3D({ x: 0, y: 0 });
    setHoveredStar(null);
  };

  const handleStarHover = (star: ConstellationStar) => {
    if (decorative) return;
    setHoveredStar(star);
    cosmicAudio.playStarHover(star.magnitude);
  };

  const handleStarClick = (star: ConstellationStar) => {
    if (decorative) return;
    onStarSelect?.(star);
  };

  return (
    <div
      ref={containerRef}
      className={`star-pattern star-pattern-${view}${compact ? " is-compact" : ""}${isHoveringContainer ? " is-interactive" : ""}`}
      style={{
        "--pattern-accent": constellation.accent,
      } as CSSProperties}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : summary}
      aria-hidden={decorative || undefined}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Ambient Pulsing Nebular Glow */}
      <span className="star-pattern-glow" aria-hidden="true" />

      {/* Celestial Coordinate Compass Grid */}
      {!compact && !decorative && (
        <div className="star-pattern-hud" aria-hidden="true">
          <span className="hud-compass-cardinal hud-n">N · 00h</span>
          <span className="hud-compass-cardinal hud-e">E · +60°</span>
          <span className="hud-compass-cardinal hud-s">S · 12h</span>
          <span className="hud-compass-cardinal hud-w">W · -60°</span>
          <span className="hud-ring-outer" />
          <span className="hud-ring-mid" />
          <span className="hud-crosshair-x" />
          <span className="hud-crosshair-y" />
        </div>
      )}

      {/* 3D Depth View Perspective Container */}
      <div
        className="star-pattern-3d-stage"
        style={{
          transform: `perspective(900px) rotateX(${rotate3D.x}deg) rotateY(${rotate3D.y}deg)`,
          transition: isHoveringContainer ? "transform 0.1s ease-out" : "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Constellation Connecting Lines */}
        <svg
          className="star-pattern-svg-lines"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={`line-grad-${constellation.slug}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={constellation.accent} stopOpacity="0.85" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.7" />
              <stop offset="100%" stopColor={constellation.accent} stopOpacity="0.85" />
            </linearGradient>
            <filter id={`glow-${constellation.slug}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="0.8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {view !== "stars" &&
            constellation.edges.map(([from, to], edgeIdx) => {
              const start = starsById.get(from);
              const end = starsById.get(to);
              if (!start || !end) return null;

              return (
                <g key={`${from}-${to}`} className="star-edge-group">
                  {/* Outer glow line */}
                  <line
                    x1={start.x}
                    y1={start.y}
                    x2={end.x}
                    y2={end.y}
                    stroke={constellation.accent}
                    strokeWidth="1.2"
                    strokeOpacity="0.3"
                    strokeLinecap="round"
                  />
                  {/* Core laser beam line */}
                  <line
                    x1={start.x}
                    y1={start.y}
                    x2={end.x}
                    y2={end.y}
                    stroke={`url(#line-grad-${constellation.slug})`}
                    strokeWidth="0.65"
                    strokeDasharray="100"
                    strokeDashoffset="0"
                    className="star-laser-edge"
                    style={{ animationDelay: `${edgeIdx * 0.12}s` }}
                    filter={`url(#glow-${constellation.slug})`}
                  />
                </g>
              );
            })}
        </svg>

        {/* Constellation Star Points */}
        {constellation.stars.map((star) => {
          const sz = starSize(star.magnitude, compact);
          const spectralColor = getSpectralColor(star.spectralType);
          
          // Compute normalized depth in safe perspective bounds (-36px to +36px)
          const logDist = Math.log(Math.max(10, star.distanceLy || 100));
          const normDist = (logDist - minLogDist) / (maxLogDist - minLogDist);
          const depthZ = view === "depth" ? (0.5 - normDist) * 72 : 0;
          const isSelected = hoveredStar?.id === star.id;

          return (
            <div
              key={star.id}
              className={`star-pattern-point${star.featured ? " is-featured" : ""}${isSelected ? " is-selected" : ""}`}
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                "--star-size": `${sz}px`,
                "--star-spectral": spectralColor,
                transform: `translate(-50%, -50%) translateZ(${depthZ}px)`,
              } as CSSProperties}
              onMouseEnter={() => handleStarHover(star)}
              onClick={() => handleStarClick(star)}
              role="button"
              tabIndex={decorative ? -1 : 0}
              aria-label={`${star.name}, magnitude ${star.magnitude}`}
            >
              {/* Star Core Halo */}
              <span className="star-core" style={{ backgroundColor: spectralColor }}>
                {/* Diffraction spikes */}
                <span className="star-spike-h" />
                <span className="star-spike-v" />
                {star.featured && <span className="star-beacon-pulse" />}
              </span>

              {/* In-view Star Label: only show if featured anchor star or actively hovered, and never in decorative/compact mode */}
              {!compact && !decorative && (star.featured || isSelected) && (
                <span className="star-pattern-label">
                  <strong>{star.name}</strong>
                  <small>{star.designation}</small>
                </span>
              )}

              {/* 3D Depth Distance Tag */}
              {view === "depth" && !compact && !decorative && star.distanceLy && (
                <span className="star-depth-tag">
                  {star.distanceLy} ly
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Holographic Star Details Inspector Card (Floating Tooltip) */}
      {!compact && !decorative && hoveredStar && (
        <div
          className="star-inspector-overlay"
          style={{
            left: `${Math.min(76, Math.max(24, hoveredStar.x))}%`,
            top: `${hoveredStar.y > 60 ? hoveredStar.y - 12 : hoveredStar.y + 14}%`,
            transform: hoveredStar.y > 60 ? "translate(-50%, -100%)" : "translate(-50%, 0)",
          }}
          aria-live="polite"
        >
          <div className="star-inspector-header">
            <span
              className="spectral-dot"
              style={{ backgroundColor: getSpectralColor(hoveredStar.spectralType) }}
            />
            <div>
              <h4>{hoveredStar.name}</h4>
              <p>{hoveredStar.designation}</p>
            </div>
          </div>
          <div className="star-inspector-stats">
            <div>
              <span>Brightness</span>
              <strong>mag {hoveredStar.magnitude.toFixed(1)}</strong>
            </div>
            {hoveredStar.distanceLy && (
              <div>
                <span>Distance</span>
                <strong>{hoveredStar.distanceLy} ly</strong>
              </div>
            )}
            {hoveredStar.spectralType && (
              <div>
                <span>Spectrum</span>
                <strong>{hoveredStar.spectralType}</strong>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Caption footer */}
      {!compact && !decorative && (
        <span className="star-pattern-caption" aria-hidden="true">
          <span className="badge-iau">
            <ZodiacGlyph slug={constellation.slug} size={12} aria-hidden="true" />
            {constellation.iauAbbreviation}
          </span>
          <span className="caption-text">
            {view === "depth"
              ? "3D Real-Space Orbit · Distance scaled in light-years"
              : view === "stars"
              ? "Deep Stellar Field · Apparent Magnitudes"
              : "Celestial Wayfinding Atlas · Earth Projection"}
          </span>
        </span>
      )}
    </div>
  );
}
