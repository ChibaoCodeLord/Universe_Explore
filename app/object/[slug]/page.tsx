import { planets } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

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
    <div className="min-h-screen bg-[var(--navy-900)] text-[var(--cream)] relative overflow-hidden font-[var(--font-quicksand)]">
      <div className="grain"></div>
      
      {/* Navbar */}
      <nav className="w-full p-6 flex justify-between items-center z-50 absolute top-0">
        <Link href="/" className="text-2xl font-[var(--font-baloo-2)] font-extrabold text-[var(--gold)] tracking-wider">UNIVERSE</Link>
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
          <div className="w-full lg:w-1/2 flex flex-col items-center">
            <div className="relative w-full aspect-square max-w-md bg-black rounded-full flex items-center justify-center p-8 shadow-[0_0_50px_rgba(15,23,80,0.8)] mb-8 border border-[var(--navy-800)] mix-blend-screen">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={planet.image_url} 
                alt={planet.name} 
                className="w-full h-full object-contain rounded-full shadow-[0_0_30px_rgba(0,0,0,0.4)]"
              />
            </div>
            
            <div className="flex flex-wrap gap-4 justify-center w-full max-w-md">
              <button className="px-6 py-3 bg-[var(--gold)] hover:bg-[var(--gold-dark)] text-[var(--navy-950)] text-sm font-bold tracking-wider rounded-full shadow-[0_4px_15px_rgba(232,169,76,0.4)] transition-all flex-1 min-w-[140px]">
                VIEW 3D
              </button>
              <button className="px-6 py-3 bg-transparent hover:bg-[var(--navy-800)] text-[var(--gold)] hover:text-[var(--gold-light)] text-sm font-bold tracking-wider rounded-full border border-[var(--gold)] transition-all flex-1 min-w-[140px]">
                COMPARE
              </button>
            </div>
          </div>

          {/* Info Column */}
          <div className="w-full lg:w-1/2">
            <p className="eyebrow">✳ {planet.short_description} ✳</p>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-8 font-[var(--font-baloo-2)] text-transparent bg-clip-text bg-gradient-to-r from-[var(--gold-light)] to-[var(--gold-dark)]">
              {planet.name.toUpperCase()}
            </h1>
            
            <div className="bg-[var(--parchment)] text-[var(--ink)] border-2 border-dashed border-[var(--parchment-line)] rounded-2xl p-6 mb-8 shadow-[0_14px_30px_rgba(0,0,0,0.28)]">
              <p className="font-medium leading-relaxed text-[0.98rem]">
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
    <div className="bg-[var(--navy-800)] border border-[var(--navy-700)] rounded-xl p-4 flex flex-col shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)]">
      <span className="text-xs text-[var(--gold-light)] opacity-80 font-bold tracking-widest mb-1">{label}</span>
      <span className="text-[var(--cream)] font-semibold text-lg">{value}</span>
    </div>
  );
}
