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
          <div className="w-full lg:w-1/2 flex flex-col items-center relative">
            {/* Floating Watercolor Star */}
            <div 
              className="absolute -top-10 -left-10 w-24 md:w-32 z-20 mix-blend-screen pointer-events-none"
              style={{ animation: "float-star 6s ease-in-out infinite" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/assets/star.jpg" 
                alt="Watercolor Star" 
                className="w-full h-auto object-contain"
                style={{ 
                  filter: "contrast(1.4) brightness(0.9)",
                  maskImage: "radial-gradient(circle at center, black 50%, transparent 75%)",
                  WebkitMaskImage: "radial-gradient(circle at center, black 50%, transparent 75%)"
                }}
              />
            </div>
            
            <div className="relative w-full aspect-square max-w-md flex items-center justify-center p-4 mb-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={planet.image_url} 
                alt={planet.name} 
                className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                style={{
                  mixBlendMode: "screen",
                  ...(planet.image_url.endsWith('.jpg') ? {
                    maskImage: "radial-gradient(circle closest-side, black 95%, transparent 100%)",
                    WebkitMaskImage: "radial-gradient(circle closest-side, black 95%, transparent 100%)",
                    filter: "contrast(1.2) brightness(0.9)"
                  } : {})
                }}
              />
            </div>
            
            <div className="flex flex-wrap gap-4 justify-center w-full max-w-md">
              <button className="px-6 py-3 bg-white hover:bg-gray-200 text-black text-sm font-bold tracking-wider rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.3)] transition-all flex-1 min-w-[140px]">
                VIEW 3D
              </button>
              <button className="px-6 py-3 bg-transparent hover:bg-white/10 text-white text-sm font-bold tracking-wider rounded-full border border-white/30 transition-all flex-1 min-w-[140px]">
                COMPARE
              </button>
            </div>
          </div>

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
