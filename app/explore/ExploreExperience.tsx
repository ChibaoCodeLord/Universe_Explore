"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Orbit,
  Pause,
  Play,
  RotateCcw,
} from "lucide-react";
import { planets, type Planet } from "@/lib/data";

const SolarSystemScene = dynamic(() => import("./SolarSystemScene"), {
  ssr: false,
  loading: () => (
    <div className="orbit-loading" role="status">
      <span className="orbit-loading-dot" />
      Preparing the solar system…
    </div>
  ),
});

type ExploreView = "gallery" | "orbit";
type OrbitSpeed = 1 | 10 | 100;

type ExploreExperienceProps = {
  initialView: ExploreView;
  initialPlanet: string;
};

const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
});

function formatOrbit(periodDays: number) {
  if (periodDays < 1000) {
    return `${numberFormatter.format(periodDays)} days`;
  }

  return `${numberFormatter.format(periodDays / 365.25)} years`;
}

function PlanetArtwork({ planet }: { planet: Planet }) {
  const needsMask = planet.image_url.endsWith(".jpg");

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={planet.image_url}
      alt=""
      className="gallery-planet-image"
      style={{
        ...(needsMask
          ? {
              maskImage:
                "radial-gradient(circle closest-side, black 93%, transparent 100%)",
              WebkitMaskImage:
                "radial-gradient(circle closest-side, black 93%, transparent 100%)",
            }
          : {}),
      }}
    />
  );
}

export default function ExploreExperience({
  initialView,
  initialPlanet,
}: ExploreExperienceProps) {
  const [view, setView] = useState<ExploreView>(initialView);
  const [selectedSlug, setSelectedSlug] = useState(initialPlanet);
  const [focusSlug, setFocusSlug] = useState<string | null>(
    initialView === "orbit" ? initialPlanet : null,
  );
  const [isPlaying, setIsPlaying] = useState(true);
  const [hasMotionOverride, setHasMotionOverride] = useState(false);
  const [speed, setSpeed] = useState<OrbitSpeed>(10);
  const planetRailRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const orbitIsPlaying = hasMotionOverride ? isPlaying : !reduceMotion;

  const selectedPlanet = useMemo(
    () => planets.find((planet) => planet.slug === selectedSlug) ?? planets[2],
    [selectedSlug],
  );
  const selectedIndex = planets.findIndex(
    (planet) => planet.slug === selectedPlanet.slug,
  );

  useEffect(() => {
    const url = new URL(window.location.href);
    if (view === "orbit") {
      url.searchParams.set("view", "orbit");
      url.searchParams.set("planet", selectedPlanet.slug);
    } else {
      url.searchParams.delete("view");
      url.searchParams.delete("planet");
    }
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  }, [selectedPlanet.slug, view]);

  const choosePlanet = (slug: string) => {
    setSelectedSlug(slug);
    setFocusSlug(slug);
  };

  const stepPlanet = (direction: -1 | 1) => {
    const nextIndex =
      (selectedIndex + direction + planets.length) % planets.length;
    choosePlanet(planets[nextIndex].slug);
  };

  const handleRailKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
      return;
    }

    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    stepPlanet(direction);
    const nextIndex =
      (selectedIndex + direction + planets.length) % planets.length;
    const nextButton = planetRailRef.current?.querySelectorAll("button")[nextIndex];
    nextButton?.focus();
  };

  const switchView = (nextView: ExploreView) => {
    setView(nextView);
    if (nextView === "orbit") {
      setFocusSlug(selectedPlanet.slug);
    }
  };

  return (
    <main className="explore-main">
      <section className="explore-intro" aria-labelledby="explore-title">
        <div>
          <p className="explore-kicker">✳ Interactive field guide</p>
          <h1 id="explore-title">Choose how you cross the cosmos.</h1>
          <p className="explore-lede">
            Browse every world at a glance, or enter orbit and follow the solar
            system from its bright center to the edge of sunlight.
          </p>
        </div>

        <div className="view-switcher" aria-label="Explore view">
          <button
            type="button"
            className={view === "gallery" ? "is-active" : undefined}
            aria-pressed={view === "gallery"}
            onClick={() => switchView("gallery")}
          >
            <LayoutGrid size={17} aria-hidden="true" />
            Gallery
          </button>
          <button
            type="button"
            className={view === "orbit" ? "is-active" : undefined}
            aria-pressed={view === "orbit"}
            onClick={() => switchView("orbit")}
          >
            <Orbit size={18} aria-hidden="true" />
            Orbit
          </button>
        </div>
      </section>

      {view === "gallery" ? (
        <section className="planet-gallery" aria-label="Planet gallery">
          {planets.map((planet, index) => (
            <article
              className="gallery-planet-card"
              key={planet.id}
              style={{ "--planet-accent": planet.color } as React.CSSProperties}
            >
              <div className="gallery-card-index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </div>
              <div className="gallery-artwork">
                <div className="gallery-orbit-line" aria-hidden="true" />
                <PlanetArtwork planet={planet} />
              </div>
              <div className="gallery-card-copy">
                <div className="gallery-card-meta">
                  <span>{planet.category}</span>
                  <span>{numberFormatter.format(planet.distance_million_km)}M km</span>
                </div>
                <h2>{planet.name}</h2>
                <p>{planet.short_description}</p>
                <Link href={`/object/${planet.slug}`}>
                  Explore {planet.name}
                  <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="orbit-experience" aria-label="Interactive solar system">
          <div className="orbit-stage-column">
            <div className="orbit-stage">
              <SolarSystemScene
                selectedSlug={selectedPlanet.slug}
                focusSlug={focusSlug}
                isPlaying={orbitIsPlaying}
                speed={speed}
                onSelect={choosePlanet}
              />
              <div className="orbit-stage-note">
                <span>Illustrative scale</span>
                <span>Drag to look around · Scroll to zoom</span>
              </div>
            </div>

            <div className="orbit-controls" aria-label="Orbit controls">
              <button
                type="button"
                className="orbit-control-primary"
                onClick={() => {
                  setIsPlaying(!orbitIsPlaying);
                  setHasMotionOverride(true);
                }}
                aria-label={orbitIsPlaying ? "Pause planet orbits" : "Play planet orbits"}
              >
                {orbitIsPlaying ? <Pause size={17} /> : <Play size={17} />}
                {orbitIsPlaying ? "Pause" : "Play"}
              </button>

              <div className="speed-control" aria-label="Orbit speed">
                <span>Speed</span>
                {([1, 10, 100] as OrbitSpeed[]).map((option) => (
                  <button
                    type="button"
                    key={option}
                    className={speed === option ? "is-active" : undefined}
                    aria-pressed={speed === option}
                    onClick={() => setSpeed(option)}
                  >
                    {option}×
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="orbit-reset"
                onClick={() => setFocusSlug(null)}
              >
                <RotateCcw size={16} aria-hidden="true" />
                Overview
              </button>
            </div>

            <div
              className="planet-rail"
              ref={planetRailRef}
              role="tablist"
              aria-label="Choose a planet"
              onKeyDown={handleRailKeyDown}
            >
              {planets.map((planet) => (
                <button
                  key={planet.slug}
                  type="button"
                  role="tab"
                  aria-selected={selectedPlanet.slug === planet.slug}
                  tabIndex={selectedPlanet.slug === planet.slug ? 0 : -1}
                  className={
                    selectedPlanet.slug === planet.slug ? "is-active" : undefined
                  }
                  onClick={() => choosePlanet(planet.slug)}
                >
                  <span
                    className="planet-rail-dot"
                    style={{ backgroundColor: planet.color }}
                    aria-hidden="true"
                  />
                  {planet.name}
                </button>
              ))}
            </div>
          </div>

          <aside
            className="orbit-info-card"
            aria-live="polite"
            style={{ "--planet-accent": selectedPlanet.color } as React.CSSProperties}
          >
            <div className="orbit-info-topline">
              <span>World {String(selectedPlanet.order).padStart(2, "0")}</span>
              <span>{selectedPlanet.category}</span>
            </div>
            <div className="orbit-info-art">
              <PlanetArtwork planet={selectedPlanet} />
            </div>
            <h2>{selectedPlanet.name}</h2>
            <p>{selectedPlanet.short_description}</p>

            <dl className="orbit-quick-facts">
              <div>
                <dt>From the Sun</dt>
                <dd>{numberFormatter.format(selectedPlanet.distance_million_km)}M km</dd>
              </div>
              <div>
                <dt>Radius</dt>
                <dd>{numberFormatter.format(selectedPlanet.radius_km)} km</dd>
              </div>
              <div>
                <dt>One orbit</dt>
                <dd>{formatOrbit(selectedPlanet.orbital_period_days)}</dd>
              </div>
              <div>
                <dt>Moons</dt>
                <dd>{selectedPlanet.moons}</dd>
              </div>
            </dl>

            <div className="orbit-info-actions">
              <button
                type="button"
                onClick={() => stepPlanet(-1)}
                aria-label="Previous planet"
              >
                <ChevronLeft size={17} />
              </button>
              <Link href={`/object/${selectedPlanet.slug}`}>
                Open 3D world
                <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
              <button
                type="button"
                onClick={() => stepPlanet(1)}
                aria-label="Next planet"
              >
                <ChevronRight size={17} />
              </button>
            </div>
          </aside>
        </section>
      )}
    </main>
  );
}
