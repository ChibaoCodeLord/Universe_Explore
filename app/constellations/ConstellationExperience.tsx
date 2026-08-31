"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Eye,
  Route,
  Layers,
  Volume2,
  VolumeX,
  Compass,
  Sparkles,
  Sun,
  Flame,
  Globe,
  Wind,
  Droplets,
  Star,
  Snowflake,
  Sprout,
  Orbit,
} from "lucide-react";
import StarPattern from "@/app/components/StarPattern";
import ZodiacGlyph from "@/app/components/ZodiacGlyph";
import {
  constellations,
  type ConstellationView,
  type ConstellationStar,
} from "@/lib/constellations";
import { cosmicAudio } from "@/lib/cosmic-audio";

type ConstellationExperienceProps = {
  initialConstellation: string;
  initialView: ConstellationView;
  children?: React.ReactNode;
};

type FilterCategory = "all" | "spring" | "summer" | "autumn" | "winter" | "traditional" | "ophiuchus";

const ELEMENT_ICONS: Record<string, React.ReactNode> = {
  Fire: <Flame size={13} className="element-icon element-fire" aria-hidden="true" />,
  Earth: <Globe size={13} className="element-icon element-earth" aria-hidden="true" />,
  Air: <Wind size={13} className="element-icon element-air" aria-hidden="true" />,
  Water: <Droplets size={13} className="element-icon element-water" aria-hidden="true" />,
  Celestial: <Star size={13} className="element-icon element-celestial" aria-hidden="true" />,
};

export default function ConstellationExperience({
  initialConstellation,
  initialView,
  children,
}: ConstellationExperienceProps) {
  const [selectedSlug, setSelectedSlug] = useState(initialConstellation);
  const [view, setView] = useState<ConstellationView>(initialView);
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("all");
  const [activeTab, setActiveTab] = useState<"overview" | "guide" | "stars">("overview");
  const [isMuted, setIsMuted] = useState(() => cosmicAudio.getMuted());
  const [selectedStar, setSelectedStar] = useState<ConstellationStar | null>(null);
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

  // Filtered constellations for the gallery or quick rail
  const filteredConstellations = useMemo(() => {
    switch (activeFilter) {
      case "spring":
        return constellations.filter((c) => c.season === "Spring");
      case "summer":
        return constellations.filter((c) => c.season === "Summer");
      case "autumn":
        return constellations.filter((c) => c.season === "Autumn");
      case "winter":
        return constellations.filter((c) => c.season === "Winter");
      case "traditional":
        return constellations.filter((c) => c.isTraditionalZodiac);
      case "ophiuchus":
        return constellations.filter((c) => !c.isTraditionalZodiac);
      default:
        return constellations;
    }
  }, [activeFilter]);

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("constellation", selectedConstellation.slug);

    if (view !== "pattern") {
      url.searchParams.set("view", view);
    } else {
      url.searchParams.delete("view");
    }

    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  }, [selectedConstellation.slug, view]);

  // Scroll active button into view in rail
  useEffect(() => {
    if (railRef.current) {
      const activeBtn = railRef.current.querySelector(".constellation-rail-btn.is-active");
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    }
  }, [selectedConstellation.slug]);

  const chooseConstellation = (slug: string) => {
    setSelectedSlug(slug);
    setSelectedStar(null);
    const constIndex = constellations.findIndex((c) => c.slug === slug);
    cosmicAudio.playCelestialChime(constIndex, constIndex * 28);
  };

  const stepConstellation = (direction: -1 | 1) => {
    const nextIndex =
      (selectedIndex + direction + constellations.length) % constellations.length;
    chooseConstellation(constellations[nextIndex].slug);
  };

  const handleViewChange = (newView: ConstellationView) => {
    setView(newView);
    cosmicAudio.playModeSwitch();
  };

  const handleAudioToggle = () => {
    const nextMuted = cosmicAudio.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) {
      cosmicAudio.playCelestialChime(selectedIndex, selectedIndex * 28);
    }
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
          <p className="constellation-kicker">
            <Sparkles size={13} aria-hidden="true" /> 01 · Interactive Sky Atlas
          </p>
          <div>
            <h2 id="sky-map-title">Explore the celestial sphere.</h2>
            <p>
              Travel across the thirteen ecliptic fields. Switch between the connected
              wayfinding guide, natural stellar brightness, and 3D real-space depth.
            </p>
          </div>
        </div>

        {/* Filter Categories Bar */}
        <div className="constellation-filter-bar" role="toolbar" aria-label="Filter constellations">
          <div className="filter-chip-group">
            <button
              type="button"
              className={`filter-chip ${activeFilter === "all" ? "is-active" : ""}`}
              onClick={() => setActiveFilter("all")}
            >
              <Sparkles size={13} aria-hidden="true" />
              All 13 Fields
            </button>
            <button
              type="button"
              className={`filter-chip ${activeFilter === "spring" ? "is-active" : ""}`}
              onClick={() => setActiveFilter("spring")}
            >
              <Sprout size={13} aria-hidden="true" />
              Spring Sky
            </button>
            <button
              type="button"
              className={`filter-chip ${activeFilter === "summer" ? "is-active" : ""}`}
              onClick={() => setActiveFilter("summer")}
            >
              <Sun size={13} aria-hidden="true" />
              Summer Sky
            </button>
            <button
              type="button"
              className={`filter-chip ${activeFilter === "autumn" ? "is-active" : ""}`}
              onClick={() => setActiveFilter("autumn")}
            >
              <Wind size={13} aria-hidden="true" />
              Autumn Sky
            </button>
            <button
              type="button"
              className={`filter-chip ${activeFilter === "winter" ? "is-active" : ""}`}
              onClick={() => setActiveFilter("winter")}
            >
              <Snowflake size={13} aria-hidden="true" />
              Winter Sky
            </button>
            <button
              type="button"
              className={`filter-chip ${activeFilter === "traditional" ? "is-active" : ""}`}
              onClick={() => setActiveFilter("traditional")}
            >
              <Orbit size={13} aria-hidden="true" />
              12 Traditional Zodiac
            </button>
            <button
              type="button"
              className={`filter-chip ${activeFilter === "ophiuchus" ? "is-active" : ""}`}
              onClick={() => setActiveFilter("ophiuchus")}
            >
              <ZodiacGlyph slug="ophiuchus" size={13} aria-hidden="true" />
              13th Ophiuchus
            </button>
          </div>

          <button
            type="button"
            className={`cosmic-audio-toggle ${isMuted ? "is-muted" : "is-active"}`}
            onClick={handleAudioToggle}
            aria-label={isMuted ? "Enable cosmic audio effects" : "Mute cosmic audio effects"}
            title={isMuted ? "Enable cosmic sound effects" : "Mute cosmic sound effects"}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            <span>{isMuted ? "Sound Off" : "Cosmic Sound"}</span>
          </button>
        </div>

        {/* Observatory Main Stage */}
        <div className="constellation-observatory">
          <div className="constellation-stage-column">
            <div
              className="constellation-stage-card"
              style={
                { "--constellation-accent": selectedConstellation.accent } as React.CSSProperties
              }
            >
              {/* Futuristic HUD Corner Reticles */}
              <span className="stage-reticle stage-reticle-tl" aria-hidden="true" />
              <span className="stage-reticle stage-reticle-tr" aria-hidden="true" />
              <span className="stage-reticle stage-reticle-bl" aria-hidden="true" />
              <span className="stage-reticle stage-reticle-br" aria-hidden="true" />

              {/* Observatory Topline Coordinates */}
              <div className="constellation-stage-topline">
                <span>
                  <i aria-hidden="true" />
                  <strong>{selectedConstellation.name}</strong> · {selectedConstellation.vietnameseName}
                </span>
                <span className="ecliptic-transit-pill">
                  <Sun size={12} aria-hidden="true" /> {selectedConstellation.sunDatesActual}
                </span>
                <span className="iau-code-pill">
                  <ZodiacGlyph slug={selectedConstellation.slug} size={13} aria-hidden="true" />
                  IAU · {selectedConstellation.iauAbbreviation}
                </span>
              </div>

              {/* Central Star Pattern Component with 3D Depth support */}
              <StarPattern
                constellation={selectedConstellation}
                view={view}
                onStarSelect={(star) => setSelectedStar(star)}
              />

              {/* View Mode Switcher (Pattern, Stars, 3D Depth) */}
              <div className="constellation-view-switcher" role="radiogroup" aria-label="Star map view mode">
                <button
                  type="button"
                  role="radio"
                  className={view === "pattern" ? "is-active" : undefined}
                  aria-checked={view === "pattern"}
                  onClick={() => handleViewChange("pattern")}
                >
                  <Route size={15} aria-hidden="true" />
                  Pattern
                </button>
                <button
                  type="button"
                  role="radio"
                  className={view === "stars" ? "is-active" : undefined}
                  aria-checked={view === "stars"}
                  onClick={() => handleViewChange("stars")}
                >
                  <Eye size={15} aria-hidden="true" />
                  Stars only
                </button>
                <button
                  type="button"
                  role="radio"
                  className={view === "depth" ? "is-active" : undefined}
                  aria-checked={view === "depth"}
                  onClick={() => handleViewChange("depth")}
                >
                  <Layers size={15} aria-hidden="true" />
                  3D Space Depth
                </button>
              </div>
            </div>

            {/* Zodiac Ecliptic Quick Ribbon */}
            <div
              className="constellation-rail"
              ref={railRef}
              role="tablist"
              aria-label="Choose a zodiac constellation"
              onKeyDown={handleRailKeyDown}
            >
              {filteredConstellations.map((constellation) => {
                const isSelected = constellation.slug === selectedConstellation.slug;
                return (
                  <button
                    key={constellation.slug}
                    type="button"
                    role="tab"
                    tabIndex={isSelected ? 0 : -1}
                    aria-selected={isSelected}
                    className={`constellation-rail-btn ${isSelected ? "is-active" : ""}`}
                    onClick={() => chooseConstellation(constellation.slug)}
                    style={
                      { "--btn-accent": constellation.accent } as React.CSSProperties
                    }
                  >
                    <span className="rail-glyph">
                      <ZodiacGlyph slug={constellation.slug} size={18} aria-hidden="true" />
                    </span>
                    <span className="rail-order">
                      {String(constellation.orderAlongEcliptic).padStart(2, "0")}
                    </span>
                    <i
                      style={{ backgroundColor: constellation.accent }}
                      aria-hidden="true"
                    />
                    <span className="rail-name">{constellation.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Holographic Info Card */}
          <aside
            className="constellation-info-card"
            aria-live="polite"
            style={
              { "--constellation-accent": selectedConstellation.accent } as React.CSSProperties
            }
          >
            <div className="constellation-info-header">
              <div className="constellation-info-meta-row">
                <div className="constellation-info-mark" aria-hidden="true">
                  <span>{selectedConstellation.iauAbbreviation}</span>
                </div>
                <p className="constellation-info-index">
                  Ecliptic Sector {String(selectedConstellation.orderAlongEcliptic).padStart(2, "0")}
                </p>
              </div>
              <h3>{selectedConstellation.name}</h3>
              <p className="constellation-info-meaning">
                {selectedConstellation.meaning} · {selectedConstellation.vietnameseName}
              </p>
            </div>

            <div className="constellation-tag-row">
              <span className="element-badge">
                {ELEMENT_ICONS[selectedConstellation.element]}
                {selectedConstellation.element}
              </span>
              <span className="season-badge">
                {selectedConstellation.season} Sky
              </span>
              {!selectedConstellation.isTraditionalZodiac ? (
                <span className="ecliptic-badge">13th Astronomical Constellation</span>
              ) : (
                <span className="traditional-badge">Traditional Zodiac</span>
              )}
            </div>

            {/* Quick Metrics Grid */}
            <dl className="constellation-quick-facts">
              <div>
                <dt>Brightest Guide</dt>
                <dd className="fact-highlight">{selectedConstellation.brightestStar}</dd>
              </div>
              <div>
                <dt>Evening Peak</dt>
                <dd>{selectedConstellation.eveningPeak}</dd>
              </div>
              <div>
                <dt>Guide Stars</dt>
                <dd>{selectedConstellation.stars.length} anchor lights</dd>
              </div>
              <div>
                <dt>Distance Span</dt>
                <dd>{selectedConstellation.distanceRange.replace(" – ", "–").replace(" light-years", " ly")}</dd>
              </div>
            </dl>

            {/* Tabbed Info View */}
            <div className="info-tab-selector" role="tablist" aria-label="Constellation details">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "overview"}
                className={activeTab === "overview" ? "is-active" : ""}
                onClick={() => setActiveTab("overview")}
              >
                Overview
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "guide"}
                className={activeTab === "guide" ? "is-active" : ""}
                onClick={() => setActiveTab("guide")}
              >
                Sky Guide
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "stars"}
                className={activeTab === "stars" ? "is-active" : ""}
                onClick={() => setActiveTab("stars")}
              >
                Key Stars
              </button>
            </div>

            <div className="info-tab-content">
              {activeTab === "overview" && (
                <p className="constellation-info-description">
                  {selectedConstellation.shortDescription} {selectedConstellation.overview}
                </p>
              )}

              {activeTab === "guide" && (
                <div className="constellation-guide-box">
                  <p><strong>How to recognize:</strong> {selectedConstellation.recognitionGuide}</p>
                  <p className="sub-note"><strong>Astronomy insight:</strong> {selectedConstellation.astronomyNote}</p>
                </div>
              )}

              {activeTab === "stars" && (
                <div className="constellation-mini-starlist">
                  {selectedConstellation.stars.map((s) => (
                    <div
                      key={s.id}
                      className={`mini-star-item ${selectedStar?.id === s.id ? "is-selected" : ""}`}
                      onClick={() => setSelectedStar(s)}
                    >
                      <span className="mini-star-dot" style={{ backgroundColor: selectedConstellation.accent }} />
                      <div className="mini-star-name">
                        <strong>{s.name}</strong>
                        <small>{s.designation}</small>
                      </div>
                      <span className="mini-star-mag">mag {s.magnitude.toFixed(1)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="constellation-info-actions">
              <button
                type="button"
                onClick={() => stepConstellation(-1)}
                aria-label="Previous constellation"
                className="step-btn"
              >
                <ChevronLeft size={18} aria-hidden="true" />
              </button>
              <Link
                href={`/constellation/${selectedConstellation.slug}`}
                className="explore-field-btn"
              >
                Open Full Field Guide
                <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
              <button
                type="button"
                onClick={() => stepConstellation(1)}
                aria-label="Next constellation"
                className="step-btn"
              >
                <ChevronRight size={18} aria-hidden="true" />
              </button>
            </div>
          </aside>
        </div>
      </section>

      {children}

      {/* Constellation Gallery */}
      <section className="constellation-gallery" aria-labelledby="zodiac-field-title">
        <div className="constellation-section-heading">
          <p className="constellation-kicker">
            <Compass size={13} aria-hidden="true" /> 04 · Field Collection
          </p>
          <div>
            <h2 id="zodiac-field-title">Thirteen fields of the ecliptic.</h2>
            <p>
              The twelve familiar signs share the solar path with Ophiuchus. Select any
              drawing below to explore its star map and three-dimensional cosmic depth.
            </p>
          </div>
        </div>

        <div className="constellation-card-grid">
          {constellations.map((constellation, index) => (
            <article
              key={constellation.slug}
              className={`constellation-gallery-card ${
                constellation.slug === selectedConstellation.slug ? "is-selected-card" : ""
              }`}
              style={
                { "--constellation-accent": constellation.accent } as React.CSSProperties
              }
            >
              <div className="constellation-card-topline">
                <span className="card-order-badge">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="card-glyph">
                  <ZodiacGlyph slug={constellation.slug} size={18} aria-hidden="true" />
                </span>
                <span className="card-iau">{constellation.iauAbbreviation}</span>
              </div>

              <div
                className="gallery-card-preview"
                onClick={() => chooseConstellation(constellation.slug)}
                title={`Select ${constellation.name} in observatory`}
              >
                <StarPattern constellation={constellation} compact decorative />
              </div>

              <div className="constellation-card-copy">
                <div className="card-tag-cluster">
                  <span className="card-season-tag">{constellation.season}</span>
                  <span className="card-meaning-tag">{constellation.meaning}</span>
                </div>
                <h3>{constellation.name}</h3>
                <span className="card-vn-name">{constellation.vietnameseName}</span>

                <p className="card-anchor-star">
                  Brightest star: <strong>{constellation.brightestStar}</strong>
                </p>

                <div className="card-action-row">
                  <button
                    type="button"
                    className="card-quick-view-btn"
                    onClick={() => {
                      chooseConstellation(constellation.slug);
                      const el = document.getElementById("sky-map");
                      el?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    View in atlas
                  </button>
                  <Link
                    href={`/constellation/${constellation.slug}`}
                    className="card-detail-link"
                  >
                    Field Guide <ArrowUpRight size={14} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
