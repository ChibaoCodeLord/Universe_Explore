"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Eye, Route } from "lucide-react";
import StarPattern from "@/app/components/StarPattern";
import {
  constellations,
  type ConstellationView,
} from "@/lib/constellations";

type ConstellationExperienceProps = {
  initialConstellation: string;
  initialView: ConstellationView;
};

export default function ConstellationExperience({
  initialConstellation,
  initialView,
}: ConstellationExperienceProps) {
  const [selectedSlug, setSelectedSlug] = useState(initialConstellation);
  const [view, setView] = useState<ConstellationView>(initialView);
  const railRef = useRef<HTMLDivElement>(null);

  const selectedConstellation = useMemo(
    () =>
      constellations.find(
        (constellation) => constellation.slug === selectedSlug,
      ) ?? constellations[7],
    [selectedSlug],
  );
  const selectedIndex = constellations.findIndex(
    (constellation) => constellation.slug === selectedConstellation.slug,
  );

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("constellation", selectedConstellation.slug);

    if (view === "stars") {
      url.searchParams.set("view", "stars");
    } else {
      url.searchParams.delete("view");
    }

    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  }, [selectedConstellation.slug, view]);

  const chooseConstellation = (slug: string) => {
    setSelectedSlug(slug);
  };

  const stepConstellation = (direction: -1 | 1) => {
    const nextIndex =
      (selectedIndex + direction + constellations.length) % constellations.length;
    chooseConstellation(constellations[nextIndex].slug);
  };

  const handleRailKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex =
      (selectedIndex + direction + constellations.length) % constellations.length;
    chooseConstellation(constellations[nextIndex].slug);
    railRef.current?.querySelectorAll("button")[nextIndex]?.focus();
  };

  return (
    <>
      <section
        id="sky-map"
        className="constellation-explorer"
        aria-labelledby="sky-map-title"
      >
        <div className="constellation-section-heading">
          <p className="constellation-kicker">01 · Sky atlas</p>
          <div>
            <h2 id="sky-map-title">Connect the light.</h2>
            <p>
              Choose a constellation, then remove its guide lines to see the
              scattered stars underneath the familiar figure.
            </p>
          </div>
        </div>

        <div className="constellation-observatory">
          <div className="constellation-stage-column">
            <div
              className="constellation-stage-card"
              style={
                { "--constellation-accent": selectedConstellation.accent } as React.CSSProperties
              }
            >
              <div className="constellation-stage-topline">
                <span>
                  <i aria-hidden="true" /> Earth view
                </span>
                <span>IAU · {selectedConstellation.iauAbbreviation}</span>
              </div>

              <StarPattern constellation={selectedConstellation} view={view} />

              <div className="constellation-view-switcher" aria-label="Star map view">
                <button
                  type="button"
                  className={view === "pattern" ? "is-active" : undefined}
                  aria-pressed={view === "pattern"}
                  onClick={() => setView("pattern")}
                >
                  <Route size={16} aria-hidden="true" />
                  Pattern
                </button>
                <button
                  type="button"
                  className={view === "stars" ? "is-active" : undefined}
                  aria-pressed={view === "stars"}
                  onClick={() => setView("stars")}
                >
                  <Eye size={16} aria-hidden="true" />
                  Stars only
                </button>
              </div>
            </div>

            <div
              className="constellation-rail"
              ref={railRef}
              role="tablist"
              aria-label="Choose a zodiac constellation"
              onKeyDown={handleRailKeyDown}
            >
              {constellations.map((constellation, index) => (
                <button
                  key={constellation.slug}
                  type="button"
                  role="tab"
                  tabIndex={constellation.slug === selectedConstellation.slug ? 0 : -1}
                  aria-selected={constellation.slug === selectedConstellation.slug}
                  className={
                    constellation.slug === selectedConstellation.slug
                      ? "is-active"
                      : undefined
                  }
                  onClick={() => chooseConstellation(constellation.slug)}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <i
                    style={{ backgroundColor: constellation.accent }}
                    aria-hidden="true"
                  />
                  {constellation.name}
                </button>
              ))}
            </div>
          </div>

          <aside
            className="constellation-info-card"
            aria-live="polite"
            style={
              { "--constellation-accent": selectedConstellation.accent } as React.CSSProperties
            }
          >
            <div className="constellation-info-mark" aria-hidden="true">
              <i />
              <span>{selectedConstellation.iauAbbreviation}</span>
            </div>
            <p className="constellation-info-index">
              Field {String(selectedConstellation.orderAlongEcliptic).padStart(2, "0")}
            </p>
            <h3>{selectedConstellation.name}</h3>
            <p className="constellation-info-meaning">
              {selectedConstellation.meaning} · {selectedConstellation.vietnameseName}
            </p>
            {!selectedConstellation.isTraditionalZodiac && (
              <span className="ecliptic-badge">Also crossed by the ecliptic</span>
            )}
            <p className="constellation-info-description">
              {selectedConstellation.shortDescription}
            </p>

            <dl className="constellation-quick-facts">
              <div>
                <dt>Brightest guide</dt>
                <dd>{selectedConstellation.brightestStar}</dd>
              </div>
              <div>
                <dt>Evening peak</dt>
                <dd>{selectedConstellation.eveningPeak}</dd>
              </div>
              <div>
                <dt>Guide stars</dt>
                <dd>{selectedConstellation.stars.length}</dd>
              </div>
              <div>
                <dt>IAU code</dt>
                <dd>{selectedConstellation.iauAbbreviation}</dd>
              </div>
            </dl>

            <div className="constellation-info-actions">
              <button
                type="button"
                onClick={() => stepConstellation(-1)}
                aria-label="Previous constellation"
              >
                <ChevronLeft size={18} aria-hidden="true" />
              </button>
              <Link href={`/constellation/${selectedConstellation.slug}`}>
                Open field guide
                <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
              <button
                type="button"
                onClick={() => stepConstellation(1)}
                aria-label="Next constellation"
              >
                <ChevronRight size={18} aria-hidden="true" />
              </button>
            </div>
          </aside>
        </div>
      </section>

      <section className="constellation-gallery" aria-labelledby="zodiac-field-title">
        <div className="constellation-section-heading">
          <p className="constellation-kicker">04 · Field collection</p>
          <div>
            <h2 id="zodiac-field-title">Thirteen fields of sky.</h2>
            <p>
              The twelve familiar names share the ecliptic with Ophiuchus. Each
              drawing below is a simplified wayfinding pattern.
            </p>
          </div>
        </div>

        <div className="constellation-card-grid">
          {constellations.map((constellation, index) => (
            <article
              key={constellation.slug}
              className="constellation-gallery-card"
              style={
                { "--constellation-accent": constellation.accent } as React.CSSProperties
              }
            >
              <div className="constellation-card-topline">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span>{constellation.iauAbbreviation}</span>
              </div>
              <StarPattern constellation={constellation} compact decorative />
              <div className="constellation-card-copy">
                <p>{constellation.meaning}</p>
                <h3>{constellation.name}</h3>
                <span>{constellation.vietnameseName}</span>
                {!constellation.isTraditionalZodiac && (
                  <small>Also crossed by the ecliptic</small>
                )}
                <Link href={`/constellation/${constellation.slug}`}>
                  Explore {constellation.name}
                  <ArrowUpRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
