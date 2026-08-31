import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  Compass,
  Sparkles,
  Sun,
  Telescope,
  Globe,
  Flame,
  Wind,
  Droplets,
  Star,
} from "lucide-react";
import SiteHeader from "@/app/components/SiteHeader";
import StarPattern from "@/app/components/StarPattern";
import StarSkyCanvas from "@/app/components/StarSkyCanvas";
import ZodiacGlyph from "@/app/components/ZodiacGlyph";
import {
  constellationSources,
  constellations,
  getConstellation,
} from "@/lib/constellations";
import "@/app/constellations/constellations.css";

type ConstellationDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return constellations.map((constellation) => ({
    slug: constellation.slug,
  }));
}

export async function generateMetadata({
  params,
}: ConstellationDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const constellation = getConstellation(slug);

  if (!constellation) {
    return {
      title: "Constellation not found | Universe",
      description: "This constellation could not be found in the Universe field guide.",
      openGraph: { images: [] },
      twitter: { images: [] },
    };
  }

  const title = `${constellation.name} (${constellation.vietnameseName}) | Universe`;
  const description = `${constellation.shortDescription} Learn how to locate ${constellation.name} in the night sky.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: [],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [],
    },
  };
}

const ELEMENT_ICONS: Record<string, React.ReactNode> = {
  Fire: <Flame size={14} className="element-icon element-fire" aria-hidden="true" />,
  Earth: <Globe size={14} className="element-icon element-earth" aria-hidden="true" />,
  Air: <Wind size={14} className="element-icon element-air" aria-hidden="true" />,
  Water: <Droplets size={14} className="element-icon element-water" aria-hidden="true" />,
  Celestial: <Star size={14} className="element-icon element-celestial" aria-hidden="true" />,
};

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

export default async function ConstellationDetailPage({
  params,
}: ConstellationDetailPageProps) {
  const { slug } = await params;
  const constellation = getConstellation(slug);

  if (!constellation) notFound();

  const index = constellations.findIndex((item) => item.slug === constellation.slug);
  const previous =
    constellations[(index - 1 + constellations.length) % constellations.length];
  const next = constellations[(index + 1) % constellations.length];

  const sortedStars = [...constellation.stars].sort((a, b) => a.magnitude - b.magnitude);

  return (
    <div
      className="constellation-detail-page"
      style={{ "--detail-accent": constellation.accent } as CSSProperties}
    >
      <StarSkyCanvas accentColor={constellation.accent} />
      <SiteHeader active="constellations" />

      <main className="constellation-detail-main">
        {/* Navigation Breadcrumb */}
        <div className="constellation-detail-nav-bar">
          <Link href="/constellations" className="constellation-detail-back">
            <ChevronLeft size={16} aria-hidden="true" />
            Back to Sky Atlas
          </Link>
          <span className="detail-sector-badge">
            Sector {String(constellation.orderAlongEcliptic).padStart(2, "0")} / 13
          </span>
        </div>

        {/* Hero Section */}
        <section className="constellation-detail-hero">
          {/* Interactive Star Observatory Map */}
          <div className="constellation-detail-map">
            <StarPattern constellation={constellation} />
          </div>

          {/* Detailed Narrative */}
          <div className="constellation-detail-copy">
            <div className="detail-badge-group">
              <span className="detail-glyph-pill">
                <ZodiacGlyph slug={constellation.slug} size={28} aria-hidden="true" />
              </span>
              <p className="constellation-kicker">
                IAU · {constellation.iauAbbreviation} · {constellation.element}
              </p>
            </div>

            <h1>{constellation.name}</h1>
            <p className="constellation-detail-subtitle">
              {constellation.meaning} · {constellation.vietnameseName}
            </p>

            <div className="detail-chips-row">
              <span className="element-chip">
                {ELEMENT_ICONS[constellation.element]}
                {constellation.element} Element
              </span>
              <span className="season-chip">
                {constellation.season} Prime Sky
              </span>
              <span className="transit-chip">
                <Sun size={12} aria-hidden="true" />
                Transit: {constellation.sunDatesActual}
              </span>
            </div>

            <p className="constellation-detail-lede">{constellation.overview}</p>

            <dl className="constellation-detail-facts">
              <div>
                <dt>Brightest Guide Star</dt>
                <dd className="bright-highlight">{constellation.brightestStar}</dd>
              </div>
              <div>
                <dt>Peak Observation</dt>
                <dd>{constellation.eveningPeak}</dd>
              </div>
              <div>
                <dt>Anchor Stars</dt>
                <dd>{constellation.stars.length} wayfinding points</dd>
              </div>
              <div>
                <dt>Distance Span</dt>
                <dd>{constellation.distanceRange}</dd>
              </div>
            </dl>
          </div>
        </section>

        {/* Deep Dive Section Cards */}
        <div className="constellation-detail-sections">
          {/* Recognition Guide Card */}
          <section className="constellation-detail-section detail-guide-card">
            <div className="section-header-pill">
              <Compass size={14} aria-hidden="true" />
              <small>How to locate in the sky</small>
            </div>
            <h2>Begin with one bright anchor.</h2>
            <p>{constellation.recognitionGuide}</p>
            <p className="detail-subtext">
              Look south during {constellation.eveningPeak} in the evening. Visibility
              depends on latitude, light pollution, and horizon clarity.
            </p>
          </section>

          {/* Key Stars Catalog */}
          <section className="constellation-detail-section detail-stars-card">
            <div className="section-header-pill">
              <Sparkles size={14} aria-hidden="true" />
              <small>Guide Lights & Magnitudes</small>
            </div>
            <h2>Meet the stars.</h2>
            <ul className="key-star-list">
              {sortedStars.map((star) => {
                const spectralColor = getSpectralColor(star.spectralType);
                return (
                  <li key={star.id}>
                    <i
                      style={{ backgroundColor: spectralColor, boxShadow: `0 0 10px ${spectralColor}` }}
                      aria-hidden="true"
                    />
                    <div>
                      <strong>{star.name}</strong>
                      <span>{star.designation} {star.spectralType ? `· ${star.spectralType}` : ""}</span>
                    </div>
                    <div className="star-dist-mag">
                      {star.distanceLy && <small>{star.distanceLy} ly</small>}
                      <em>mag {star.magnitude.toFixed(1)}</em>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Astronomical Insights Card */}
          <section className="constellation-detail-section detail-science-card">
            <div className="section-header-pill">
              <Telescope size={14} aria-hidden="true" />
              <small>Astronomical Context</small>
            </div>
            <h2>Beyond the outline.</h2>
            <p>{constellation.astronomyNote}</p>
          </section>

          {/* Reading the pattern */}
          <section className="constellation-detail-section detail-myth-card">
            <div className="section-header-pill">
              <Sparkles size={14} aria-hidden="true" />
              <small>3D Geometry</small>
            </div>
            <h2>A map across light-years.</h2>
            <p>
              The guide lines are imaginary human connections. In reality, these stars are
              separated by hundreds of light-years in the Milky Way disc and are moving in
              distinct orbits through our galaxy.
            </p>
            <div className="constellation-detail-sources">
              {constellationSources.map((source) => (
                <a key={source.url} href={source.url} target="_blank" rel="noreferrer">
                  {source.label.replace("International Astronomical Union — ", "IAU · ").replace("NASA Space Place — ", "NASA · ")}
                  <ArrowUpRight size={12} aria-hidden="true" />
                </a>
              ))}
            </div>
          </section>
        </div>

        {/* Projection Note Banner */}
        <aside className="projection-note">
          <CircleDot size={22} aria-hidden="true" />
          <div>
            <strong>Interactive Field Guide Standard</strong>
            <p>
              The star coordinates and apparent magnitudes in this guide are curated
              from IAU sky catalogs and stellar distance surveys.
            </p>
          </div>
        </aside>

        {/* Previous / Next Constellation Navigation */}
        <nav className="constellation-detail-pagination" aria-label="Constellation navigation">
          <Link href={`/constellation/${previous.slug}`} className="pagination-card">
            <ChevronLeft size={24} aria-hidden="true" />
            <div>
              <small className="pagination-glyph-row">
                Previous Sector · <ZodiacGlyph slug={previous.slug} size={14} aria-hidden="true" />
              </small>
              <strong>{previous.name}</strong>
              <span>{previous.vietnameseName}</span>
            </div>
          </Link>
          <Link href={`/constellation/${next.slug}`} className="pagination-card">
            <div>
              <small className="pagination-glyph-row">
                Next Sector · <ZodiacGlyph slug={next.slug} size={14} aria-hidden="true" />
              </small>
              <strong>{next.name}</strong>
              <span>{next.vietnameseName}</span>
            </div>
            <ChevronRight size={24} aria-hidden="true" />
          </Link>
        </nav>
      </main>
    </div>
  );
}
