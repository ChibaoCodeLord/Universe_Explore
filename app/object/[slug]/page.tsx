import { planets } from "@/lib/data";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import LazyVisualColumn from "@/app/components/LazyVisualColumn";
import SiteHeader from "@/app/components/SiteHeader";

type ObjectDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return planets.map((planet) => ({
    slug: planet.slug,
  }));
}

export async function generateMetadata({
  params,
}: ObjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const planet = planets.find((item) => item.slug === slug);

  if (!planet) {
    return {
      title: "World not found | Universe",
      description: "This world could not be found in the Universe collection.",
      openGraph: { images: [] },
      twitter: { images: [] },
    };
  }

  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const imageUrl = new URL(planet.image_url, origin).toString();
  const title = `${planet.name} | Universe`;

  return {
    title,
    description: planet.short_description,
    openGraph: {
      title,
      description: planet.short_description,
      images: [imageUrl],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: planet.short_description,
      images: [imageUrl],
    },
  };
}

export default async function ObjectDetailPage({ params }: ObjectDetailPageProps) {
  const resolvedParams = await params;
  const planet = planets.find((p) => p.slug === resolvedParams.slug);

  if (!planet) {
    notFound();
  }

  return (
    <div 
      className="min-h-screen text-[var(--cream)] relative overflow-hidden font-[var(--font-comic-neue)]"
      style={{ backgroundImage: "url('/assets/bg.jpg')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" }}
    >
      <div className="absolute inset-0 bg-black/30 pointer-events-none"></div>
      
      <SiteHeader active="explore" />

      <div className="pt-12 pb-12 px-6 max-w-6xl mx-auto relative z-10">
        <Link
          href="/explore" 
          className="inline-flex items-center text-[var(--gold-light)] hover:text-[var(--gold)] transition-colors font-semibold tracking-wider text-sm mb-8"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          BACK TO EXPLORE
        </Link>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Visual Column */}
          <LazyVisualColumn planet={planet} />

          {/* Info Column */}
          <div className="w-full lg:w-1/2">
            <p className="eyebrow text-white/70">✳ {planet.short_description} ✳</p>
            <h1 className="text-5xl md:text-7xl mb-8 font-[var(--font-chewy)] text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
              {planet.name.toUpperCase()}
            </h1>
            
            <div className="bg-[var(--navy-900)]/40 backdrop-blur-md text-white border border-white/10 rounded-3xl p-6 mb-8 shadow-[0_14px_30px_rgba(0,0,0,0.3)]">
              <p className="font-medium leading-relaxed text-lg opacity-90">
                {planet.content}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <StatBox label="RADIUS" value={planet.radius} />
              <StatBox label="MASS" value={planet.mass} />
              <StatBox label="GRAVITY" value={planet.gravity} />
              <StatBox label="TEMPERATURE" value={planet.temperature} />
              <StatBox label="DAY (ROTATION)" value={planet.day} />
              <StatBox label="YEAR (ORBIT)" value={planet.year} />
              <StatBox label="FROM THE SUN" value={`${planet.distance_million_km.toLocaleString("en-US")} million km`} />
              <StatBox label="WORLD TYPE" value={planet.category} />
              <StatBox label="MOONS" value={planet.moons.toString()} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex flex-col shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)]">
      <span className="text-xs text-white/60 font-bold tracking-widest mb-1">{label}</span>
      <span className="text-white font-semibold text-xl">{value}</span>
    </div>
  );
}
