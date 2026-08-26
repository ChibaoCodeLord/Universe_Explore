"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { planets } from "@/lib/data";

// Helper to get random value within a range
const random = (min: number, max: number) => Math.random() * (max - min) + min;

export default function Home() {
  const [activeSection, setActiveSection] = useState("hero");
  const [stars, setStars] = useState<{ id: number; size: number; x: number; y: number; duration: number; delay: number; isSparkle: boolean }[]>([]);
  const [shootingStars, setShootingStars] = useState<{ id: number; top: number; delay: number; duration: number }[]>([]);

  useEffect(() => {
    // Generate stars for React (avoids hydration mismatch by running on mount)
    const generatedStars = Array.from({ length: 150 }).map((_, i) => ({
      id: i,
      size: Math.random() < 0.15 ? random(6, 12) : random(1, 4),
      x: random(0, 100),
      y: random(0, 100),
      duration: random(3, 7),
      delay: random(0, 5),
      isSparkle: Math.random() < 0.15,
    }));
    setStars(generatedStars);

    // Generate shooting stars
    const generatedShootingStars = Array.from({ length: 5 }).map((_, i) => ({
      id: i,
      top: random(0, 50),
      delay: random(0, 15),
      duration: random(1.5, 3)
    }));
    setShootingStars(generatedShootingStars);
  }, []);

  useEffect(() => {
    // Intersection Observer for dotnav
    const sections = document.querySelectorAll(".section[id]");
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(entry.target.id);
            }
          });
        },
        { threshold: 0.4 }
      );
      sections.forEach((s) => observer.observe(s));
      return () => sections.forEach((s) => observer.unobserve(s));
    }
  }, []);

  const scrollTo = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Get specific planets for the landing page
  const earth = planets.find((p) => p.slug === "earth");
  const jupiter = planets.find((p) => p.slug === "jupiter");
  const mars = planets.find((p) => p.slug === "mars");
  const saturn = planets.find((p) => p.slug === "saturn");

  return (
    <>
      <div className="grain z-50 pointer-events-none fixed inset-0 opacity-[0.04]"></div>

      {/* Global Stars Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className={star.isSparkle ? "star-sparkle" : "star-dot"}
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
              position: "absolute",
              background: star.isSparkle ? "var(--gold-light)" : "var(--cream)",
              borderRadius: star.isSparkle ? "0" : "50%",
              clipPath: star.isSparkle ? "polygon(50% 0%, 61% 39%, 100% 50%, 61% 61%, 50% 100%, 39% 61%, 0% 50%, 39% 39%)" : "none",
            }}
            animate={{
              opacity: [0.1, 1, 0.1],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              delay: star.delay,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Shooting Stars */}
        {shootingStars.map((ss) => (
          <motion.div
            key={`ss-${ss.id}`}
            className="absolute h-[2px] w-32 bg-gradient-to-r from-transparent via-white to-white rounded-full z-0 opacity-80"
            style={{ top: `${ss.top}%`, left: "-20%" }}
            animate={{ left: "120%", top: `${ss.top + 30}%` }}
            transition={{ duration: ss.duration, repeat: Infinity, delay: ss.delay, ease: "linear" }}
          />
        ))}

        {/* Rocket flying by */}
        <motion.div
          className="absolute z-10 w-16 h-16 drop-shadow-[0_0_15px_rgba(255,100,50,0.8)]"
          initial={{ x: "-10vw", y: "80vh", rotate: 45 }}
          animate={{ x: "110vw", y: "-20vh" }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: 4 }}
        >
          <span className="text-5xl block transform rotate-45">🚀</span>
        </motion.div>
      </div>

      <nav className="dotnav z-50" aria-label="Section navigation">
        <button onClick={() => scrollTo("hero")} className={activeSection === "hero" ? "active" : ""}><span className="dotlabel">Universe</span></button>
        <button onClick={() => scrollTo("moods")} className={activeSection === "moods" ? "active" : ""}><span className="dotlabel">A planet for every mood</span></button>
        <button onClick={() => scrollTo("imperfection")} className={activeSection === "imperfection" ? "active" : ""}><span className="dotlabel">The beauty of reality</span></button>
        <button onClick={() => scrollTo("rockets")} className={activeSection === "rockets" ? "active" : ""}><span className="dotlabel">Giants in flight</span></button>
        <button onClick={() => scrollTo("textures")} className={activeSection === "textures" ? "active" : ""}><span className="dotlabel">Cosmic textures</span></button>
      </nav>

      <main className="relative z-10">
        {/* HERO SECTION */}
        <section id="hero" className="section hero relative">
          <svg className="swirl absolute top-[10%] left-1/2 -translate-x-1/2 w-64 md:w-96 opacity-30 z-0" viewBox="0 0 260 100" aria-hidden="true">
            <path d="M10,70 C30,10 90,10 105,45 C120,80 170,85 185,40 C198,0 235,-5 250,25" fill="none" stroke="var(--gold-dark)" strokeWidth="4" strokeLinecap="round" />
          </svg>

          <div className="hero-content relative z-20">
            <motion.p 
              initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
              className="eyebrow"
            >
              ✳ A real space collection ✳
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}
              className="wordmark"
            >
              Universe
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }}
              className="tagline"
            >
              A breathtaking journey across real galaxies, stars and quiet cosmic wonder.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.5 }}
              className="mt-10"
            >
              <Link href="/explore">
                <button className="px-10 py-4 bg-[var(--gold)] hover:bg-[var(--gold-dark)] text-[var(--navy-950)] text-sm font-bold tracking-wider rounded-full shadow-[0_4px_25px_rgba(232,169,76,0.5)] transition-all transform hover:scale-105">
                  START EXPLORING
                </button>
              </Link>
            </motion.div>
          </div>

          {/* Floating Realistic Planets in Hero */}
          {saturn && (
            <motion.div 
              className="absolute left-[5%] bottom-[10%] w-40 md:w-64 z-10 mix-blend-screen"
              animate={{ y: [0, -30, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={saturn.image_url} alt={saturn.name} className="w-full h-auto object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]" />
            </motion.div>
          )}

          {earth && (
            <motion.div 
              className="absolute right-[8%] top-[20%] w-24 md:w-40 z-10 mix-blend-screen"
              animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={earth.image_url} alt={earth.name} className="w-full h-auto object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] rounded-full" />
            </motion.div>
          )}

          <div className="scrollcue absolute bottom-8">
            scroll<span className="arrow mt-2 block">↓</span>
          </div>
        </section>

        {/* MOODS SECTION */}
        <section id="moods" className="section moods">
          <p className="eyebrow">Atmospheres</p>
          <h2>A planet for every condition</h2>
          <div className="mood-row flex flex-wrap justify-center gap-8 md:gap-16 my-12">
            {[planets[6], planets[1], planets[4], planets[7]].map((p, i) => (
              p && (
                <motion.div 
                  key={p.slug} 
                  className="mood-chip flex flex-col items-center"
                  whileHover={{ y: -10 }}
                >
                  <div className="w-20 h-20 md:w-28 md:h-28 mb-4 relative rounded-full shadow-[0_0_25px_rgba(255,255,255,0.1)] overflow-hidden bg-black border-2 border-[var(--navy-700)] mix-blend-screen">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image_url} alt={p.name} className="w-full h-full object-contain scale-110" />
                  </div>
                  <span className="font-semibold text-[var(--cream)] opacity-90">{p.name}</span>
                </motion.div>
              )
            ))}
          </div>
          <div className="card parchment center-card tilt-left">
            <p>
              Every world carries its own real atmosphere, from the toxic, thick clouds of Venus to the icy, calm blue rings of Uranus.
            </p>
          </div>
        </section>

        {/* IMPERFECTION (Mars) SECTION */}
        <section id="imperfection" className="section imperfection">
          <div className="split">
            <div className="art w-full md:w-1/2 flex justify-center">
              {mars && (
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                  className="w-64 h-64 md:w-96 md:h-96 relative rounded-full shadow-[0_0_50px_rgba(230,100,50,0.3)] bg-black overflow-hidden mix-blend-screen"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={mars.image_url} alt="Mars" className="w-full h-full object-contain scale-105" />
                </motion.div>
              )}
            </div>
            <div className="copy w-full md:w-1/2">
              <p className="eyebrow">Real Details</p>
              <h2>The beauty of reality</h2>
              <div className="card parchment tilt-right">
                <p>
                  Craters, storms, and icy poles. The real cosmos is far more beautiful and imperfect than any painting. The Mars surface reveals billions of years of history.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* GIANTS (Jupiter) SECTION */}
        <section id="rockets" className="section rockets">
          <div className="split reverse">
            <div className="copy w-full md:w-1/2">
              <p className="eyebrow">Gas Giants</p>
              <h2>Colossal storms in flight</h2>
              <div className="card parchment tilt-left">
                <p>
                  Jupiter and Saturn dominate the solar system. Their massive sizes and chaotic storm bands are a testament to the raw power of gravity and fluid dynamics in space.
                </p>
              </div>
            </div>
            <div className="art w-full md:w-1/2 flex justify-center">
              {jupiter && (
                <motion.div 
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="w-72 h-72 md:w-[28rem] md:h-[28rem] rounded-full shadow-[0_0_60px_rgba(200,180,150,0.2)] bg-black overflow-hidden relative mix-blend-screen"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={jupiter.image_url} alt="Jupiter" className="w-full h-full object-contain scale-110" />
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {/* TEXTURES SECTION */}
        <section id="textures" className="section textures">
          <p className="eyebrow">Final glow</p>
          <h2>Cosmic textures and light</h2>
          <motion.div 
            className="w-48 h-48 md:w-72 md:h-72 mx-auto my-12 rounded-full overflow-hidden shadow-[0_0_90px_rgba(150,200,250,0.4)] mix-blend-screen bg-black"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={planets[7]?.image_url} alt="Neptune" className="w-full h-full object-contain scale-105" />
          </motion.div>
          <p className="closing max-w-2xl mx-auto text-lg">
            High-resolution captures from space probes build a sense of depth in every planet, while the real sunlight reflecting off atmospheres blends into a calm, glowing presence.
          </p>
        </section>
      </main>

      <footer className="relative z-10 py-10 bg-[var(--navy-950)] text-[var(--cream)] opacity-60 text-sm tracking-widest uppercase">
        ✳ Explored by those who look up ✳
      </footer>
    </>
  );
}
