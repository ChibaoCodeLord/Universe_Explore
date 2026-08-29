import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  CircleDot,
  Layers3,
  Orbit,
  Sparkles,
} from "lucide-react";
import SiteHeader from "@/app/components/SiteHeader";
import StarPattern from "@/app/components/StarPattern";
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
    requestedView === "stars" ? "stars" : "pattern";
  const scorpius = getConstellation("scorpius") ?? constellations[7];

  return (
    <div className="constellations-page">
      <div className="constellation-sky" aria-hidden="true" />
      <SiteHeader active="constellations" />

      <main>
        <section className="constellation-hero" aria-labelledby="constellations-title">
          <div className="constellation-hero-orbit" aria-hidden="true">
            {constellations.map((constellation, index) => (
              <span
                key={constellation.slug}
                style={{ "--orbit-index": index } as React.CSSProperties}
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
            <p className="constellation-kicker">✳ A field guide to the zodiac</p>
            <h1 id="constellations-title">Patterns written in our sky.</h1>
            <p>
              From Earth, distant stars appear to draw familiar figures along
              the Sun’s path. Step closer to see the pattern—and the depth
              hidden behind it.
            </p>
            <div className="constellation-hero-actions">
              <a href="#sky-map" className="constellation-primary-action">
                Explore the sky map
                <ArrowDown size={17} aria-hidden="true" />
              </a>
              <a href="#how-it-works" className="constellation-secondary-action">
                How constellations work
              </a>
            </div>
          </div>

          <div className="constellation-hero-pattern">
            <StarPattern constellation={scorpius} decorative />
            <div className="constellation-hero-pattern-label">
              <span>Earth view</span>
              <strong>Scorpius</strong>
            </div>
          </div>
        </section>

        <ConstellationExperience
          initialConstellation={initialConstellation ?? "scorpius"}
          initialView={initialView}
        />

        <section
          id="how-it-works"
          className="constellation-theory"
          aria-labelledby="theory-title"
        >
          <div className="constellation-section-heading">
            <p className="constellation-kicker">02 · Reading the sky</p>
            <div>
              <h2 id="theory-title">A pattern is a point of view.</h2>
              <p>
                A constellation is useful sky geography, not a single physical
                object. Three simple steps reveal what our eyes leave out.
              </p>
            </div>
          </div>

          <div className="theory-step-grid">
            <article>
              <span className="theory-step-number">01</span>
              <div className="theory-visual theory-visual-dots" aria-hidden="true">
                <i /><i /><i /><i /><i /><i />
              </div>
              <p><Sparkles size={15} aria-hidden="true" /> Look up</p>
              <h3>First, we see points.</h3>
              <span>
                Brightness, darkness and imagination make some stars stand out
                from the crowded sky.
              </span>
            </article>

            <article>
              <span className="theory-step-number">02</span>
              <div className="theory-visual theory-visual-lines" aria-hidden="true">
                <i /><i /><i /><i /><i />
                <b /><b /><b /><b />
              </div>
              <p><Orbit size={15} aria-hidden="true" /> Draw the pattern</p>
              <h3>Then, we connect them.</h3>
              <span>
                The guide lines are conventions. Different cultures have drawn
                different figures across the same light.
              </span>
            </article>

            <article>
              <span className="theory-step-number">03</span>
              <div className="theory-visual theory-visual-depth" aria-hidden="true">
                <i /><i /><i /><i /><i />
              </div>
              <p><Layers3 size={15} aria-hidden="true" /> Add the depth</p>
              <h3>Space breaks the shape apart.</h3>
              <span>
                The stars can lie at very different distances. Change your
                viewpoint and the familiar outline would change too.
              </span>
            </article>
          </div>

          <aside className="projection-note">
            <CircleDot size={21} aria-hidden="true" />
            <div>
              <strong>The lines do not exist in space.</strong>
              <p>
                They are a map-reading aid drawn over a three-dimensional field
                of unrelated or widely separated stars.
              </p>
            </div>
          </aside>
        </section>

        <section className="zodiac-comparison" aria-labelledby="comparison-title">
          <div className="constellation-section-heading constellation-section-heading-light">
            <p className="constellation-kicker">03 · Two different systems</p>
            <div>
              <h2 id="comparison-title">Twelve signs. Thirteen constellations.</h2>
              <p>
                The names overlap, but the two systems divide the sky in
                different ways and answer different questions.
              </p>
            </div>
          </div>

          <div className="zodiac-comparison-grid">
            <article>
              <div className="comparison-card-heading">
                <span>12</span>
                <div>
                  <small>Traditional system</small>
                  <h3>Zodiac signs</h3>
                </div>
              </div>
              <ul>
                <li>Twelve equal slices of 30 degrees</li>
                <li>A symbolic calendar system</li>
                <li>Uses the twelve familiar zodiac names</li>
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
                  <small>Astronomical sky map</small>
                  <h3>Ecliptic constellations</h3>
                </div>
              </div>
              <ul>
                <li>Official sky regions with unequal sizes</li>
                <li>Defined by observable boundaries</li>
                <li>The Sun spends unequal time in each region</li>
                <li>Includes Ophiuchus on the ecliptic</li>
              </ul>
            </article>
          </div>

          <p className="comparison-footnote">
            The two systems answer different questions; one does not simply
            replace the other.
          </p>
        </section>

        <section className="constellation-faq" aria-labelledby="faq-title">
          <div className="constellation-section-heading">
            <p className="constellation-kicker">05 · Clear the cosmic fog</p>
            <div>
              <h2 id="faq-title">Four useful corrections.</h2>
              <p>A little context turns a symbolic sky into a scientific map.</p>
            </div>
          </div>

          <div className="constellation-faq-list">
            <details open>
              <summary>Are the connecting lines real?</summary>
              <p>
                No. They are guide marks people draw to remember and recognize
                a pattern. The official constellation is a region of sky, not
                the stick figure itself.
              </p>
            </details>
            <details>
              <summary>Are stars in one constellation close together?</summary>
              <p>
                Not necessarily. They can look neighboring from Earth while
                sitting at very different distances in three-dimensional space.
              </p>
            </details>
            <details>
              <summary>Why does the pattern barely resemble its name?</summary>
              <p>
                The drawing depends on memory, storytelling and cultural
                tradition. The stars provide prompts rather than a detailed
                picture.
              </p>
            </details>
            <details>
              <summary>Does a zodiac constellation determine personality?</summary>
              <p>
                This field guide focuses on astronomy: observed positions,
                named sky regions and the stars seen within them. It does not
                make astrological personality claims.
              </p>
            </details>
          </div>
        </section>

        <section className="constellation-sources" aria-labelledby="sources-title">
          <div>
            <p className="constellation-kicker">Sources · checked August 2026</p>
            <h2 id="sources-title">Built from named skies.</h2>
          </div>
          <ul>
            {constellationSources.map((source) => (
              <li key={source.url}>
                <a href={source.url} target="_blank" rel="noreferrer">
                  {source.label}
                  <ArrowUpRight size={14} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="constellation-closing">
          <p className="constellation-kicker">The pattern is only the beginning</p>
          <h2>Choose a field. Follow the light.</h2>
          <div>
            <Link href="/constellation/scorpius" className="constellation-primary-action">
              Open a constellation
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
            <Link href="/explore" className="constellation-secondary-action">
              Return to the planets
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
