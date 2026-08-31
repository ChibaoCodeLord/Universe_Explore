"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import { ArrowUpRight, CircleDot, Sparkles, Wind } from "lucide-react";
import { planets, type Planet } from "@/lib/data";

type Star = {
  id: number;
  size: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
  isSparkle: boolean;
};

type ShootingStar = {
  id: number;
  top: number;
  delay: number;
  duration: number;
};

function seededRandom(seed: number) {
  let state = seed >>> 0;

  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

const randomValue = seededRandom(1986);
const randomBetween = (min: number, max: number) => randomValue() * (max - min) + min;

const BACKGROUND_STARS: Star[] = Array.from({ length: 150 }, (_, id) => ({
  id,
  size: randomValue() < 0.15 ? randomBetween(6, 12) : randomBetween(1, 4),
  x: randomBetween(0, 100),
  y: randomBetween(0, 100),
  duration: randomBetween(3, 7),
  delay: randomBetween(0, 5),
  isSparkle: randomValue() < 0.15,
}));

const SHOOTING_STARS: ShootingStar[] = Array.from({ length: 5 }, (_, id) => ({
  id,
  top: randomBetween(0, 50),
  delay: randomBetween(0, 15),
  duration: randomBetween(1.5, 3),
}));

const MOOD_WORLDS = [
  { slug: "uranus", mood: "Quiet", detail: "A pale-blue world that rolls through space." },
  { slug: "venus", mood: "Electric", detail: "Golden clouds hiding a volcanic surface." },
  { slug: "jupiter", mood: "Untamed", detail: "Centuries-old storms moving without rest." },
  { slug: "neptune", mood: "Dreamy", detail: "Midnight winds at the edge of sunlight." },
];

function PlanetArtwork({
  planet,
  className,
  alt,
}: {
  planet: Planet;
  className: string;
  alt?: string;
}) {
  const needsMask = planet.image_url.endsWith(".jpg");

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={planet.image_url}
      alt={alt ?? planet.name}
      className={className}
      style={{
        mixBlendMode: "screen",
        ...(needsMask
          ? {
              maskImage: "radial-gradient(circle closest-side, black 93%, transparent 100%)",
              WebkitMaskImage: "radial-gradient(circle closest-side, black 93%, transparent 100%)",
              filter: "contrast(1.2) saturate(1.08) brightness(0.92) drop-shadow(0 22px 28px rgba(0, 0, 0, 0.4))",
            }
          : {}),
      }}
    />
  );
}

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 54, filter: "blur(12px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SectionNumber({ children }: { children: ReactNode }) {
  return <span className="section-number" aria-hidden="true">{children}</span>;
}

export default function Home() {
  const [activeSection, setActiveSection] = useState("hero");
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 26,
    mass: 0.35,
  });

  useEffect(() => {
    const sections = document.querySelectorAll(".section[id]");

    if (!("IntersectionObserver" in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.4 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const jupiter = planets.find((planet) => planet.slug === "jupiter");
  const mars = planets.find((planet) => planet.slug === "mars");
  const neptune = planets.find((planet) => planet.slug === "neptune");
  const saturn = planets.find((planet) => planet.slug === "saturn");

  return (
    <>
      <div className="grain" />
      <motion.div className="cosmic-progress" style={{ scaleX: smoothProgress }} />

      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        {BACKGROUND_STARS.map((star) => (
          <motion.div
            key={star.id}
            className={star.isSparkle ? "star-sparkle" : "star-dot"}
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
              position: "absolute",
            }}
            animate={
              reduceMotion
                ? undefined
                : { opacity: [0.1, 1, 0.1], scale: [0.8, 1.2, 0.8] }
            }
            transition={{
              duration: star.duration,
              repeat: Infinity,
              delay: star.delay,
              ease: "easeInOut",
            }}
          />
        ))}

        {SHOOTING_STARS.map((shootingStar) => (
          <motion.div
            key={`shooting-star-${shootingStar.id}`}
            className="shooting-star"
            style={{ top: `${shootingStar.top}%`, left: "-20%" }}
            animate={
              reduceMotion
                ? undefined
                : { left: "120%", top: `${shootingStar.top + 30}%` }
            }
            transition={{
              duration: shootingStar.duration,
              repeat: Infinity,
              delay: shootingStar.delay,
              ease: "linear",
            }}
          />
        ))}

        {!reduceMotion && (
          <motion.div
            className="flying-rocket"
            initial={{ x: "-10vw", y: "80vh", rotate: 45 }}
            animate={{ x: "110vw", y: "-20vh" }}
            transition={{ duration: 14, repeat: Infinity, ease: "linear", delay: 5 }}
          >
            🚀
          </motion.div>
        )}
      </div>

      <nav className="dotnav" aria-label="Section navigation">
        <button onClick={() => scrollTo("hero")} className={activeSection === "hero" ? "active" : ""}>
          <span className="dotlabel">Universe</span>
        </button>
        <button onClick={() => scrollTo("moods")} className={activeSection === "moods" ? "active" : ""}>
          <span className="dotlabel">Find your orbit</span>
        </button>
        <button onClick={() => scrollTo("imperfection")} className={activeSection === "imperfection" ? "active" : ""}>
          <span className="dotlabel">Beautifully imperfect</span>
        </button>
        <button onClick={() => scrollTo("rockets")} className={activeSection === "rockets" ? "active" : ""}>
          <span className="dotlabel">Inside the storm</span>
        </button>
        <button onClick={() => scrollTo("textures")} className={activeSection === "textures" ? "active" : ""}>
          <span className="dotlabel">Keep looking up</span>
        </button>
      </nav>

      <main className="relative z-10">
        <section
          id="hero"
          className="section hero"
          style={{
            backgroundImage: "url('/assets/bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/40 z-0" />
          <svg className="swirl" viewBox="0 0 260 100" aria-hidden="true">
            <path d="M10,70 C30,10 90,10 105,45 C120,80 170,85 185,40 C198,0 235,-5 250,25" />
          </svg>

          <div className="hero-content">
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9 }}
              className="flex justify-center mb-2"
            >
              <motion.img
                src="/logo.png"
                alt="Universe Galaxy Logo"
                className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-[0_0_24px_rgba(246,209,144,0.65)]"
                animate={reduceMotion ? undefined : { rotate: 360 }}
                transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="eyebrow"
            >
              ✳ A real space collection ✳
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="wordmark drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]"
            >
              Universe
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="tagline"
            >
              Brings the cosmos to life through delicate watercolor textures
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mt-10"
            >
              <a href="/explore" className="hero-cta">
                Start exploring <ArrowUpRight size={17} />
              </a>
            </motion.div>
          </div>

          <motion.div
            className="hero-watercolor-star"
            animate={reduceMotion ? undefined : { y: [0, -15, 0], rotate: [-10, 10, -10] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/star.jpg"
              alt="Watercolor star"
              className="w-full h-auto object-contain"
              style={{
                filter: "contrast(1.4) brightness(0.9)",
                maskImage: "radial-gradient(circle at center, black 50%, transparent 75%)",
                WebkitMaskImage: "radial-gradient(circle at center, black 50%, transparent 75%)",
              }}
            />
          </motion.div>

          {saturn && (
            <motion.div
              className="hero-saturn"
              animate={reduceMotion ? undefined : { y: [0, -20, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            >
              <PlanetArtwork
                planet={saturn}
                className="w-full h-auto object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
              />
            </motion.div>
          )}

          <motion.div
            className="hero-watercolor-rocket"
            animate={reduceMotion ? undefined : { y: [0, 20, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/rocket.jpg"
              alt="Watercolor rocket"
              className="w-full h-auto object-contain"
              style={{
                filter: "contrast(1.4) brightness(0.9)",
                maskImage: "radial-gradient(ellipse at center, black 55%, transparent 75%)",
                WebkitMaskImage: "radial-gradient(ellipse at center, black 55%, transparent 75%)",
              }}
            />
          </motion.div>

          <div className="scrollcue">
            scroll<span className="arrow">↓</span>
          </div>
          <div className="hero-bottom-fade" aria-hidden="true" />
        </section>

        <section id="moods" className="section cosmic-section moods">
          <SectionNumber>01</SectionNumber>
          <div className="watercolor-bloom bloom-violet" aria-hidden="true" />
          <motion.div
            className="orbit-sketch orbit-sketch-wide"
            aria-hidden="true"
            animate={reduceMotion ? undefined : { rotate: 360 }}
            transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
          />

          <div className="section-shell">
            <Reveal className="section-heading section-heading-centered">
              <p className="eyebrow"><Sparkles size={14} /> Atmospheres</p>
              <h2>Find a world that feels like you.</h2>
              <p className="section-lede">
                Every planet carries a different rhythm—quiet, volatile, colossal, or impossibly far away.
              </p>
            </Reveal>

            <div className="mood-orbit-grid">
              {MOOD_WORLDS.map((mood, index) => {
                const planet = planets.find((item) => item.slug === mood.slug);
                if (!planet) return null;

                return (
                  <motion.div
                    key={mood.slug}
                    initial={reduceMotion ? false : { opacity: 0, y: 45, scale: 0.92 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={reduceMotion ? undefined : { y: -12 }}
                  >
                    <a href={`/object/${planet.slug}`} className="mood-planet-card group">
                      <span className="mood-card-index">0{index + 1}</span>
                      <div className="mood-planet-stage">
                        <span className="planet-orbit-ring" />
                        <PlanetArtwork
                          planet={planet}
                          className="mood-planet-image group-hover:scale-110"
                        />
                      </div>
                      <p className="mood-name">{mood.mood}</p>
                      <h3>{planet.name}</h3>
                      <p className="mood-detail">{mood.detail}</p>
                      <span className="mood-link">Enter orbit <ArrowUpRight size={15} /></span>
                    </a>
                  </motion.div>
                );
              })}
            </div>

            <Reveal className="cosmic-note" delay={0.15}>
              <CircleDot size={20} />
              <p>There is no empty space here—only worlds waiting at different frequencies.</p>
            </Reveal>
          </div>
        </section>

        <section id="imperfection" className="section cosmic-section imperfection">
          <SectionNumber>02</SectionNumber>
          <div className="watercolor-bloom bloom-coral" aria-hidden="true" />
          <div className="section-shell story-grid">
            <Reveal className="planet-composition mars-composition">
              {mars && (
                <>
                  <motion.div
                    className="planet-halo mars-halo"
                    animate={reduceMotion ? undefined : { scale: [0.96, 1.06, 0.96], opacity: [0.45, 0.8, 0.45] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.div
                    className="planet-orbit planet-orbit-a"
                    animate={reduceMotion ? undefined : { rotate: 360 }}
                    transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
                  />
                  <motion.div
                    className="planet-orbit planet-orbit-b"
                    animate={reduceMotion ? undefined : { rotate: -360 }}
                    transition={{ duration: 42, repeat: Infinity, ease: "linear" }}
                  />
                  <motion.div
                    className="story-planet mars-planet"
                    animate={reduceMotion ? undefined : { rotate: 360 }}
                    transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
                  >
                    <PlanetArtwork planet={mars} className="story-planet-image" />
                  </motion.div>
                  <span className="planet-pin pin-top"><i /> Olympus Mons</span>
                  <span className="planet-pin pin-bottom"><i /> Ancient impact basin</span>
                </>
              )}
            </Reveal>

            <Reveal className="story-copy" delay={0.12}>
              <p className="eyebrow"><CircleDot size={14} /> Real details</p>
              <h2>Beautifully<br />imperfect.</h2>
              <p className="story-lede">
                The cosmos was never polished. Its scars are the story: impact craters, dust valleys, frozen caps, and surfaces shaped over billions of years.
              </p>
              <div className="fact-ribbon">
                <div><span>01</span><p>Cratered terrain</p></div>
                <div><span>02</span><p>Iron-rich dust</p></div>
                <div><span>03</span><p>Polar ice</p></div>
              </div>
              {mars && (
                <a href={`/object/${mars.slug}`} className="text-link">
                  Explore Mars in detail <ArrowUpRight size={17} />
                </a>
              )}
            </Reveal>
          </div>
        </section>

        <section id="rockets" className="section cosmic-section rockets">
          <SectionNumber>03</SectionNumber>
          <div className="watercolor-bloom bloom-gold" aria-hidden="true" />
          <div className="section-shell story-grid story-grid-reverse">
            <Reveal className="story-copy" delay={0.1}>
              <p className="eyebrow"><Wind size={14} /> Gas giants</p>
              <h2>Step inside<br />the storm.</h2>
              <p className="story-lede">
                Jupiter is less a surface and more a living weather system—bands folding into each other, lightning below the clouds, and a storm wider than Earth.
              </p>
              <div className="storm-card">
                <span className="storm-pulse" />
                <div>
                  <small>Great Red Spot</small>
                  <strong>A storm observed for centuries</strong>
                </div>
              </div>
              {jupiter && (
                <a href={`/object/${jupiter.slug}`} className="text-link">
                  Drift around Jupiter <ArrowUpRight size={17} />
                </a>
              )}
            </Reveal>

            <Reveal className="planet-composition jupiter-composition">
              {jupiter && (
                <>
                  <div className="planet-halo jupiter-halo" />
                  <motion.div
                    className="story-planet jupiter-planet"
                    animate={reduceMotion ? undefined : { y: [0, -18, 0], rotate: [-1, 2, -1] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <PlanetArtwork planet={jupiter} className="story-planet-image" />
                  </motion.div>
                  <span className="floating-moon moon-one"><i /> Io</span>
                  <span className="floating-moon moon-two"><i /> Europa</span>
                  <span className="floating-moon moon-three"><i /> Ganymede</span>
                </>
              )}
            </Reveal>
          </div>
        </section>

        <section id="textures" className="section cosmic-section textures">
          <SectionNumber>04</SectionNumber>
          <div className="watercolor-bloom bloom-blue" aria-hidden="true" />
          <div className="section-shell final-shell">
            <Reveal className="section-heading section-heading-centered">
              <p className="eyebrow"><Sparkles size={14} /> One last glow</p>
              <h2>Keep looking up.</h2>
              <p className="section-lede">
                The farther we travel, the quieter the light becomes—and the more there is to discover.
              </p>
            </Reveal>

            {neptune && (
              <Reveal className="neptune-portal" delay={0.1}>
                <motion.div
                  className="portal-orbit portal-orbit-outer"
                  animate={reduceMotion ? undefined : { rotate: 360 }}
                  transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="portal-orbit portal-orbit-inner"
                  animate={reduceMotion ? undefined : { rotate: -360 }}
                  transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="neptune-glow"
                  animate={reduceMotion ? undefined : { scale: [0.96, 1.08, 0.96], opacity: [0.5, 0.9, 0.5] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="neptune-planet"
                  animate={reduceMotion ? undefined : { y: [0, -12, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <PlanetArtwork planet={neptune} className="story-planet-image" />
                </motion.div>
                <span className="portal-caption">4.5 billion km from the Sun</span>
              </Reveal>
            )}

            <Reveal className="home-constellation-teaser" delay={0.14}>
              <div className="home-star-map" aria-hidden="true">
                <i /><i /><i /><i /><i /><i />
                <b /><b /><b /><b /><b />
                <span>Earth view · Scorpius</span>
              </div>
              <div>
                <p className="eyebrow"><Sparkles size={14} /> New field guide</p>
                <h3>Patterns written in our sky.</h3>
                <p>
                  Meet the distant stars behind the zodiac—and discover why twelve familiar signs share the Sun’s path with thirteen constellations.
                </p>
                <a href="/constellations" className="text-link">
                  Follow the constellations <ArrowUpRight size={17} />
                </a>
              </div>
            </Reveal>

            <Reveal className="final-copy" delay={0.18}>
              <p>
                Eight planets. Eight completely different worlds. Move closer, rotate them, and find the details hidden in their light.
              </p>
              <a href="/explore" className="final-cta">
                Explore the full collection <ArrowUpRight size={18} />
              </a>
            </Reveal>

            <div className="cosmic-ticker" aria-hidden="true">
              <span>Mercury ✦ Venus ✦ Earth ✦ Mars ✦ Jupiter ✦ Saturn ✦ Uranus ✦ Neptune ✦</span>
              <span>Mercury ✦ Venus ✦ Earth ✦ Mars ✦ Jupiter ✦ Saturn ✦ Uranus ✦ Neptune ✦</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <span>✳ Explored by those who look up ✳</span>
        <div className="site-footer-links">
          <a href="/explore">All worlds <ArrowUpRight size={14} /></a>
          <a href="/constellations">Sky atlas <ArrowUpRight size={14} /></a>
        </div>
      </footer>
    </>
  );
}
