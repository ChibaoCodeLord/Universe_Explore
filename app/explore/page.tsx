"use client";

import { planets } from "@/lib/data";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function ExplorePage() {
  useEffect(() => {
    // Generate stars
    const scatterStars = (container: Element) => {
      const count = parseInt((container as HTMLElement).dataset.count || "40", 10);
      for (let i = 0; i < count; i++) {
        let el = document.createElement("div");
        if (Math.random() < 0.18) {
          el.className = "star-sparkle";
          const s = 8 + Math.random() * 10;
          el.style.width = s + "px";
          el.style.height = s + "px";
        } else {
          el.className = "star-dot";
          const d = 2 + Math.random() * 3;
          el.style.width = d + "px";
          el.style.height = d + "px";
        }
        el.style.left = Math.random() * 96 + 2 + "%";
        el.style.top = Math.random() * 92 + 3 + "%";
        el.style.animationDelay = Math.random() * 4 + "s";
        container.appendChild(el);
      }
    };
    document.querySelectorAll(".stars-explore").forEach(scatterStars);
    return () => {
      document.querySelectorAll(".stars-explore").forEach((container) => {
        container.innerHTML = "";
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-[var(--navy-900)] text-[var(--cream)] py-20 px-6 relative overflow-hidden font-[var(--font-quicksand)]">
      <div className="grain"></div>
      <div className="stars-explore absolute inset-0 pointer-events-none" data-count="100"></div>
      
      {/* Navbar (Simplified for subpages) */}
      <nav className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-50">
        <Link href="/" className="text-2xl font-[var(--font-baloo-2)] font-extrabold text-[var(--gold)] tracking-wider">UNIVERSE</Link>
        <ul className="flex space-x-8 text-sm font-semibold tracking-wider text-[var(--cream)] opacity-80">
          <li><Link href="/" className="hover:opacity-100 transition-opacity">Home</Link></li>
          <li><Link href="/explore" className="opacity-100 font-bold border-b-2 border-[var(--gold)]">Explore</Link></li>
        </ul>
      </nav>

      <div className="max-w-6xl mx-auto mt-10 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="eyebrow mx-auto">✳ Discover the solar system ✳</p>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 font-[var(--font-baloo-2)]">
            Explore the Universe
          </h1>
          <p className="text-[var(--cream)] opacity-80 max-w-2xl mx-auto text-lg">
            Journey through our solar system and discover the unique worlds that orbit our Sun.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {planets.map((planet, index) => (
            <motion.div
              key={planet.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="bg-[var(--parchment)] border-2 border-dashed border-[var(--parchment-line)] rounded-2xl overflow-hidden shadow-[0_14px_30px_rgba(0,0,0,0.28)] flex flex-col text-[var(--ink)]"
            >
              <div className="h-48 relative overflow-hidden flex items-center justify-center p-4 bg-black border-b-2 border-dashed border-[var(--parchment-line)] mix-blend-screen">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={planet.image_url} 
                  alt={planet.name} 
                  className="max-h-full object-contain rounded-full shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-transform duration-500 hover:scale-110"
                />
              </div>
              
              <div className="p-6 flex-grow flex flex-col">
                <h2 className="text-2xl font-bold mb-2 font-[var(--font-baloo-2)] text-[var(--coral-dark)]">{planet.name}</h2>
                <p className="text-sm mb-6 flex-grow font-medium leading-relaxed opacity-90">{planet.short_description}</p>
                <Link href={`/object/${planet.slug}`} className="w-full block">
                  <button className="w-full py-2 bg-transparent hover:bg-[var(--gold)] text-[var(--ink)] border border-[var(--gold-dark)] rounded-full text-sm font-bold tracking-wider transition-colors shadow-sm">
                    LEARN MORE
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
