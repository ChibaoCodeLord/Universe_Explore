import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  CircleDot,
  Layers3,
  Orbit,
  Sparkles,
  Compass,
  Calendar,
  Sun,
  ShieldCheck,
  Telescope,
} from "lucide-react";
import SiteHeader from "@/app/components/SiteHeader";
import StarPattern from "@/app/components/StarPattern";
import StarSkyCanvas from "@/app/components/StarSkyCanvas";
import ZodiacGlyph from "@/app/components/ZodiacGlyph";
import {
  constellationSources,
  constellations,
  getConstellation,
  type ConstellationView,
} from "@/lib/constellations";
import ConstellationExperience from "./ConstellationExperience";
import "./constellations.css";

export const metadata: Metadata = {
  title: "Zodiac Constellations | Universe",
  description:
    "Learn how distant stars become patterns from Earth, explore the thirteen constellations crossed by the ecliptic, and meet their brightest guide stars.",
};

type ConstellationsPageProps = {
  searchParams: Promise<{
    constellation?: string | string[];
    view?: string | string[];
  }>;
};

// Current season helper for live night sky advice
function getCurrentSeasonInfo() {
  const month = new Date().getMonth() + 1; // 1 - 12
  if (month >= 3 && month <= 5) {
    return {
      season: "Spring Sky",
      featured: ["Leo", "Virgo", "Cancer"],
      tip: "Look high in the southern sky for the Sickle of Leo and brilliant blue-white Spica in Virgo.",
    };
  }
  if (month >= 6 && month <= 8) {
    return {
      season: "Summer Sky",
      featured: ["Scorpius", "Sagittarius", "Ophiuchus"],
      tip: "The Milky Way core rises with fiery Antares in Scorpius and the Teapot of Sagittarius.",
    };
  }
  if (month >= 9 && month <= 11) {
    return {
      season: "Autumn Sky",
      featured: ["Capricornus", "Aquarius", "Pisces"],
      tip: "Faint water constellations dominate the southern horizon alongside Pegasus and Fomalhaut.",
    };
  }
  return {
    season: "Winter Sky",
    featured: ["Taurus", "Gemini", "Aries"],
    tip: "Orange Aldebaran and the twin stars Castor & Pollux shine brilliantly near Orion.",
  };
}

export default async function ConstellationsPage({
  searchParams,
}: ConstellationsPageProps) {
  const query = await searchParams;
  const requestedConstellation = Array.isArray(query.constellation)
    ? query.constellation[0]
    : query.constellation;
  const requestedView = Array.isArray(query.view) ? query.view[0] : query.view;
  const initialConstellation = getConstellation(requestedConstellation ?? "")
    ? requestedConstellation
    : "scorpius";
  const initialView: ConstellationView =
    requestedView === "stars" || requestedView === "depth" ? requestedView : "pattern";
  const scorpius = getConstellation("scorpius") ?? constellations[7];

  const currentSky = getCurrentSeasonInfo();

  return (
    <div className="constellations-page">
      {/* Dynamic Starfield & Nebula Canvas */}
      <StarSkyCanvas accentColor="#e77459" />
      <SiteHeader active="constellations" />

      <main>
        {/* Hero Section */}
        <section className="constellation-hero" aria-labelledby="constellations-title">
          {/* Ecliptic Orbit Decorative Ring */}
          <div className="constellation-hero-orbit" aria-hidden="true">
            {constellations.map((constellation, index) => (
              <span
                key={constellation.slug}
                style={{ "--orbit-index": index } as React.CSSProperties}
                title={constellation.name}
              >
                <i
                  style={{
                    backgroundColor: constellation.accent,
                    color: constellation.accent,
                  }}
                />
              </span>
            ))}
          </div>

          <div className="constellation-hero-copy">
            <div className="hero-badge-row">
              <p className="constellation-kicker">
                <Sparkles size={14} aria-hidden="true" /> A field guide to the celestial sphere
              </p>
            </div>

            <h1 id="constellations-title">
              Patterns written <br />
              <span className="hero-title-gradient">in our sky.</span>
            </h1>

            <p>
              From Earth, distant stars appear to draw familiar figures along the Sun’s
              annual path. Step into our astronomical observatory to see the connected
              patterns—and uncover the vast 3D depths behind them.
            </p>

            {/* Live Observation Advice Widget */}
            <div className="hero-live-sky-card">
              <div className="live-sky-header">
                <Calendar size={14} aria-hidden="true" />
                <span>Tonight’s Sky · {currentSky.season}</span>
              </div>
              <p className="live-sky-tip">{currentSky.tip}</p>
              <div className="live-sky-tags">
                {currentSky.featured.map((name) => (
                  <span key={name} className="live-sky-tag">
                    ✦ {name}
                  </span>
                ))}
              </div>
            </div>

            <div className="constellation-hero-actions">
              <a href="#sky-map" className="constellation-primary-action">
                <Telescope size={17} aria-hidden="true" />
                Launch the Sky Atlas
                <ArrowDown size={16} aria-hidden="true" />
              </a>
              <a href="#how-it-works" className="constellation-secondary-action">
                How constellations work
              </a>
            </div>
          </div>

          {/* Hero Featured Constellation (Scorpius 3D preview) */}
          <div className="constellation-hero-pattern">
            <div className="hero-pattern-halo" aria-hidden="true" />
            <StarPattern constellation={scorpius} view="pattern" decorative />
            <div className="constellation-hero-pattern-label">
              <div className="pattern-label-header">
                <span>Earth Projection · IAU Sco</span>
                <span className="hero-glyph-badge">
                  <ZodiacGlyph slug={scorpius.slug} size={20} aria-hidden="true" />
                </span>
              </div>
              <strong>{scorpius.name}</strong>
              <small>{scorpius.meaning} · {scorpius.brightestStar}</small>
            </div>
          </div>
        </section>

        {/* Interactive Observatory Section */}
        <ConstellationExperience
          initialConstellation={initialConstellation ?? "scorpius"}
          initialView={initialView}
        />

        {/* Reading The Sky (Theory) Section */}
        <section
          id="how-it-works"
          className="constellation-theory"
          aria-labelledby="theory-title"
        >
          <div className="constellation-section-heading">
            <p className="constellation-kicker">
              <Compass size={13} aria-hidden="true" /> 02 · Astronomical Perception
            </p>
            <div>
              <h2 id="theory-title">A pattern is a point of view.</h2>
              <p>
                A constellation is convenient sky geography, not a single physical
                cluster. Three steps reveal what our eyes leave out.
              </p>
            </div>
          </div>

          <div className="theory-step-grid">
            <article className="theory-card">
              <span className="theory-step-number">01</span>
              <div className="theory-visual theory-visual-dots" aria-hidden="true">
                <i /><i /><i /><i /><i /><i />
              </div>
              <p>
                <Sparkles size={15} aria-hidden="true" /> Look up
              </p>
              <h3>First, we see points.</h3>
              <span>
                Brightness, darkness, and human imagination make certain guide stars
                stand out from the dense field of billions of background lights.
              </span>
            </article>

            <article className="theory-card">
              <span className="theory-step-number">02</span>
              <div className="theory-visual theory-visual-lines" aria-hidden="true">
                <i /><i /><i /><i /><i />
                <b /><b /><b /><b />
              </div>
              <p>
                <Orbit size={15} aria-hidden="true" /> Draw the pattern
              </p>
              <h3>Then, we connect them.</h3>
              <span>
                The guide lines are human conventions. Different ancient cultures
                imagined different mythological figures across the exact same points of light.
              </span>
            </article>

            <article className="theory-card">
              <span className="theory-step-number">03</span>
              <div className="theory-visual theory-visual-depth" aria-hidden="true">
                <i /><i /><i /><i /><i />
              </div>
              <p>
                <Layers3 size={15} aria-hidden="true" /> Add the depth
              </p>
              <h3>Space breaks the shape apart.</h3>
              <span>
                Stars can sit hundreds of light-years apart in 3D space. Fly to another
                star system and the familiar outline vanishes completely.
              </span>
            </article>
          </div>

          <aside className="projection-note">
            <CircleDot size={22} aria-hidden="true" />
            <div>
              <strong>The connecting lines do not exist in space.</strong>
              <p>
                They are map-reading aids drawn over a three-dimensional field of
                independent, widely separated stars traveling through the galaxy.
              </p>
            </div>
          </aside>
        </section>

        {/* 12 Signs vs 13 Constellations Comparison */}
        <section className="zodiac-comparison" aria-labelledby="comparison-title">
          <div className="constellation-section-heading constellation-section-heading-light">
            <p className="constellation-kicker">
              <Sun size={13} aria-hidden="true" /> 03 · Two Different Sky Systems
            </p>
            <div>
              <h2 id="comparison-title">Twelve signs. Thirteen constellations.</h2>
              <p>
                While the names overlap, astronomy and astrology divide the sky with
                fundamentally different methods and purposes.
              </p>
            </div>
          </div>

          <div className="zodiac-comparison-grid">
            <article className="comparison-card-traditional">
              <div className="comparison-card-heading">
                <span>12</span>
                <div>
                  <small>Astrological Calendar</small>
                  <h3>Zodiac Signs</h3>
                </div>
              </div>
              <ul>
                <li>Twelve equal mathematical segments of 30° each</li>
                <li>Fixed seasonal calendar based on the equinoxes</li>
                <li>Uses twelve traditional Babylonian signs</li>
                <li>Does not include Ophiuchus as a sign</li>
              </ul>
            </article>

            <div className="comparison-divider" aria-hidden="true">
              <span>≠</span>
            </div>

            <article className="comparison-card-sky">
              <div className="comparison-card-heading">
                <span>13</span>
                <div>
                  <small>Real Astronomical Sky Map</small>
                  <h3>Ecliptic Constellations</h3>
                </div>
              </div>
              <ul>
                <li>Official IAU sky boundaries of unequal physical sizes</li>
                <li>Defined by actual observed stars and coordinates</li>
                <li>The Sun spends varying times (44 days in Virgo, only 7 in Scorpius)</li>
                <li>Includes Ophiuchus (The Serpent Bearer) along the Sun’s path</li>
              </ul>
            </article>
          </div>

          <p className="comparison-footnote">
            The two systems answer different questions; astronomical field guides map
            observable cosmic reality across time and space.
          </p>
        </section>

        {/* FAQ Section */}
        <section className="constellation-faq" aria-labelledby="faq-title">
          <div className="constellation-section-heading">
            <p className="constellation-kicker">
              <ShieldCheck size={13} aria-hidden="true" /> 05 · Frequently Asked Questions
            </p>
            <div>
              <h2 id="faq-title">Clearing the cosmic fog.</h2>
              <p>Essential answers that turn symbolic folklore into clear astronomical understanding.</p>
            </div>
          </div>

          <div className="constellation-faq-list">
            <details open>
              <summary>Are the connecting lines real in outer space?</summary>
              <p>
                No. Connecting lines are purely human wayfinding aids designed to help observers
                identify landmarks in the night sky. In official astronomy (IAU), a constellation is
                an entire bordered sector of the celestial sphere.
              </p>
            </details>
            <details>
              <summary>Are stars in a constellation bound to each other?</summary>
              <p>
                Rarely. While stars may look like close neighbors when viewed from Earth, they
                typically lie at drastically different distances—often separated by hundreds of
                light-years in three-dimensional space.
              </p>
            </details>
            <details>
              <summary>Why did the Sun’s position shift over thousands of years?</summary>
              <p>
                Earth undergoes axial precession—a slow conical wobble of its rotational axis like a
                spinning top, completing a cycle every 25,772 years. This shifts the apparent position
                of equinoxes westward across the constellations.
              </p>
            </details>
            <details>
              <summary>What makes Ophiuchus the 13th ecliptic constellation?</summary>
              <p>
                The ecliptic—the Sun’s apparent annual path across our sky—passes directly through
                the constellation Ophiuchus between November 29 and December 18, before entering
                Sagittarius.
              </p>
            </details>
          </div>
        </section>

        {/* Sources & References */}
        <section className="constellation-sources" aria-labelledby="sources-title">
          <div>
            <p className="constellation-kicker">Astronomical Citations</p>
            <h2 id="sources-title">Verified cosmic data.</h2>
          </div>
          <ul>
            {constellationSources.map((source) => (
              <li key={source.url}>
                <a href={source.url} target="_blank" rel="noreferrer">
                  {source.label}
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* Closing Call to Action */}
        <section className="constellation-closing">
          <p className="constellation-kicker">Your journey across the stars continues</p>
          <h2>Choose a field. Follow the light.</h2>
          <div>
            <Link href="/constellation/scorpius" className="constellation-primary-action">
              Explore Scorpius in Depth
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
            <Link href="/explore" className="constellation-secondary-action">
              Return to Solar System Planets
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
