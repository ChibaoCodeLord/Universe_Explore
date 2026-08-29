import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  CircleDot,
} from "lucide-react";
import SiteHeader from "@/app/components/SiteHeader";
import StarPattern from "@/app/components/StarPattern";
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

  const title = `${constellation.name} Constellation | Universe`;
  const description = constellation.shortDescription;

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
  const keyStars = [...constellation.stars]
    .sort((a, b) => a.magnitude - b.magnitude)
    .slice(0, 5);

  return (
    <div
      className="constellation-detail-page"
      style={{ "--detail-accent": constellation.accent } as CSSProperties}
    >
      <div className="constellation-sky" aria-hidden="true" />
      <SiteHeader active="constellations" />

      <main className="constellation-detail-main">
        <Link href="/constellations" className="constellation-detail-back">
          <ChevronLeft size={16} aria-hidden="true" />
          Back to the sky atlas
        </Link>

        <section className="constellation-detail-hero">
          <div className="constellation-detail-map">
            <StarPattern constellation={constellation} />
          </div>

          <div className="constellation-detail-copy">
            <p className="constellation-kicker">
              Zodiac field {String(constellation.orderAlongEcliptic).padStart(2, "0")} · {constellation.iauAbbreviation}
            </p>
            <h1>{constellation.name}</h1>
            <p className="constellation-detail-subtitle">
              {constellation.meaning} · {constellation.vietnameseName}
            </p>
            {!constellation.isTraditionalZodiac && (
              <span className="ecliptic-badge">Also crossed by the ecliptic</span>
            )}
            <p className="constellation-detail-lede">{constellation.overview}</p>

            <dl className="constellation-detail-facts">
              <div>
                <dt>Brightest guide</dt>
                <dd>{constellation.brightestStar}</dd>
              </div>
              <div>
                <dt>Evening peak</dt>
                <dd>{constellation.eveningPeak}</dd>
              </div>
              <div>
                <dt>Pattern sample</dt>
                <dd>{constellation.stars.length} guide stars</dd>
              </div>
              <div>
                <dt>Sky system</dt>
                <dd>{constellation.isTraditionalZodiac ? "Traditional 12 + IAU field" : "IAU ecliptic field"}</dd>
              </div>
            </dl>
          </div>
        </section>

        <div className="constellation-detail-sections">
          <section className="constellation-detail-section">
            <small>How to find it</small>
            <h2>Begin with one bright anchor.</h2>
            <p>{constellation.recognitionGuide}</p>
            <p>
              The month above is an approximate evening guide. Visibility still
              changes with latitude, local horizon, weather and light pollution.
            </p>
          </section>

          <section className="constellation-detail-section">
            <small>Key stars</small>
            <h2>Meet the guide lights.</h2>
            <ul className="key-star-list">
              {keyStars.map((star) => (
                <li key={star.id}>
                  <i
                    style={star.featured ? { backgroundColor: constellation.accent } : undefined}
                    aria-hidden="true"
                  />
                  <div>
                    <strong>{star.name}</strong>
                    <span>{star.designation}</span>
                  </div>
                  <em>mag {star.magnitude.toFixed(1)}</em>
                </li>
              ))}
            </ul>
            <p>
              Apparent magnitude describes how bright a star looks from Earth;
              a smaller number means a brighter point in the sky.
            </p>
          </section>

          <section className="constellation-detail-section">
            <small>Astronomy note</small>
            <h2>Beyond the outline.</h2>
            <p>{constellation.astronomyNote}</p>
          </section>

          <section className="constellation-detail-section">
            <small>Reading the pattern</small>
            <h2>A map, not a family portrait.</h2>
            <p>
              The guide lines are imaginary. Stars that sit near one another in
              this Earth-facing projection can be widely separated in space and
              may have no physical connection.
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

        <aside className="projection-note">
          <CircleDot size={21} aria-hidden="true" />
          <div>
            <strong>Simplified field-guide drawing</strong>
            <p>
              The diagram emphasizes recognizable guide stars. It is not a
              complete boundary chart, scientific projection or live sky view.
            </p>
          </div>
        </aside>

        <nav className="constellation-detail-pagination" aria-label="Constellation pages">
          <Link href={`/constellation/${previous.slug}`}>
            <ChevronLeft size={20} aria-hidden="true" />
            <span>
              <small>Previous field</small>
              <strong>{previous.name}</strong>
            </span>
          </Link>
          <Link href={`/constellation/${next.slug}`}>
            <span>
              <small>Next field</small>
              <strong>{next.name}</strong>
            </span>
            <ChevronRight size={20} aria-hidden="true" />
          </Link>
        </nav>
      </main>
    </div>
  );
}

