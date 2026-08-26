import { planets } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import VisualColumn from "@/app/components/VisualColumn";

export function generateStaticParams() {
  return planets.map((planet) => ({
    slug: planet.slug,
  }));
}

export default async function ObjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
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
      
      {/* Navbar */}
      <nav className="w-full p-6 flex justify-between items-center z-50 absolute top-0">
        <Link href="/" className="text-2xl font-[var(--font-chewy)] text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] tracking-widest">UNIVERSE</Link>
        <ul className="flex space-x-8 text-sm font-semibold tracking-wider text-[var(--cream)] opacity-80">
          <li><Link href="/" className="hover:opacity-100 transition-opacity">Home</Link></li>
          <li><Link href="/explore" className="opacity-100 font-bold border-b-2 border-[var(--gold)]">Explore</Link></li>
        </ul>
      </nav>

      <div className="pt-24 pb-12 px-6 max-w-6xl mx-auto relative z-10">
        <Link 
          href="/explore" 
          className="inline-flex items-center text-[var(--gold-light)] hover:text-[var(--gold)] transition-colors font-semibold tracking-wider text-sm mb-8"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          BACK TO EXPLORE
        </Link>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Visual Column */}
          <VisualColumn planet={planet} />

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
