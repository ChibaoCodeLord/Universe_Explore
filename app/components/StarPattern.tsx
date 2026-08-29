import type { CSSProperties } from "react";
import type { Constellation, ConstellationView } from "@/lib/constellations";

type StarPatternProps = {
  constellation: Constellation;
  view?: ConstellationView;
  compact?: boolean;
  decorative?: boolean;
};

function starSize(magnitude: number) {
  return Math.max(5, Math.min(12, 12 - magnitude * 1.35));
}

export default function StarPattern({
  constellation,
  view = "pattern",
  compact = false,
  decorative = false,
}: StarPatternProps) {
  const starsById = new Map(
    constellation.stars.map((star) => [star.id, star]),
  );
  const summary = `${constellation.name} is shown as ${constellation.stars.length} guide stars. ${constellation.brightestStar} is highlighted as the brightest star in this simplified pattern.`;

  return (
    <div
      className={`star-pattern star-pattern-${view}${compact ? " is-compact" : ""}`}
      style={{ "--pattern-accent": constellation.accent } as CSSProperties}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : summary}
      aria-hidden={decorative || undefined}
    >
      <span className="star-pattern-glow" aria-hidden="true" />
      <span className="star-pattern-grid" aria-hidden="true" />

      <span className="star-pattern-lines" aria-hidden="true">
        {constellation.edges.map(([from, to]) => {
          const start = starsById.get(from);
          const end = starsById.get(to);

          if (!start || !end) return null;

          const deltaX = end.x - start.x;
          const deltaY = end.y - start.y;
          const length = Math.sqrt(deltaX ** 2 + deltaY ** 2);
          const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

          return (
            <span
              key={`${from}-${to}`}
              className="star-pattern-line"
              style={
                {
                  left: `${start.x}%`,
                  top: `${start.y}%`,
                  width: `${length}%`,
                  transform: `rotate(${angle}deg)`,
                } as CSSProperties
              }
            />
          );
        })}
      </span>

      {constellation.stars.map((star) => (
        <span
          key={star.id}
          className={`star-pattern-point${star.featured ? " is-featured" : ""}`}
          style={
            {
              left: `${star.x}%`,
              top: `${star.y}%`,
              "--star-size": `${starSize(star.magnitude)}px`,
            } as CSSProperties
          }
          aria-hidden="true"
        >
          <i />
          {!compact && star.featured && (
            <span className="star-pattern-label">
              <strong>{star.name}</strong>
              <small>{star.designation}</small>
            </span>
          )}
        </span>
      ))}

      {!compact && (
        <span className="star-pattern-caption" aria-hidden="true">
          <span>{constellation.iauAbbreviation}</span>
          Simplified guide pattern · not to scale
        </span>
      )}
    </div>
  );
}
