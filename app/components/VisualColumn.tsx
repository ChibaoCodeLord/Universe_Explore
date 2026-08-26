"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, Float, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { Planet } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";
import { CuboidIcon as Cube, ImageIcon } from "lucide-react";

const GAS_GIANTS = ["jupiter", "saturn", "uranus", "neptune"];

type SurfaceMaterialProps = {
  planet: Planet;
  isGasGiant: boolean;
};

function hexToRgb(hex: string): [number, number, number] {
  const normalized = hex.replace("#", "");
  const value = Number.parseInt(normalized, 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

function mixColor(
  from: [number, number, number],
  to: [number, number, number],
  amount: number,
): [number, number, number] {
  const t = THREE.MathUtils.clamp(amount, 0, 1);
  return [
    Math.round(THREE.MathUtils.lerp(from[0], to[0], t)),
    Math.round(THREE.MathUtils.lerp(from[1], to[1], t)),
    Math.round(THREE.MathUtils.lerp(from[2], to[2], t)),
  ];
}

function hash(x: number, y: number, seed: number) {
  let value = Math.imul(x + seed * 1013, 374761393) + Math.imul(y + seed * 1999, 668265263);
  value = (value ^ (value >>> 13)) >>> 0;
  return ((Math.imul(value, 1274126177) ^ (value >>> 16)) >>> 0) / 4294967295;
}

function smoothstep(value: number) {
  return value * value * (3 - 2 * value);
}

function tiledNoise(u: number, v: number, frequency: number, seed: number) {
  const x = u * frequency;
  const y = v * frequency;
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const x1 = (x0 + 1) % frequency;
  const y1 = y0 + 1;
  const tx = smoothstep(x - x0);
  const ty = smoothstep(y - y0);
  const wrappedX0 = ((x0 % frequency) + frequency) % frequency;

  const top = THREE.MathUtils.lerp(hash(wrappedX0, y0, seed), hash(x1, y0, seed), tx);
  const bottom = THREE.MathUtils.lerp(hash(wrappedX0, y1, seed), hash(x1, y1, seed), tx);
  return THREE.MathUtils.lerp(top, bottom, ty);
}

function fractalNoise(u: number, v: number, seed: number) {
  return (
    tiledNoise(u, v, 7, seed) * 0.5 +
    tiledNoise(u, v, 19, seed + 1) * 0.3 +
    tiledNoise(u, v, 53, seed + 2) * 0.2
  );
}

function wrappedDistance(a: number, b: number) {
  const distance = Math.abs(a - b);
  return Math.min(distance, 1 - distance);
}

function createProceduralTexture(planet: Planet) {
  const width = 1024;
  const height = 512;
  const data = new Uint8Array(width * height * 4);
  const seed = planet.slug.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const base = hexToRgb(planet.color);
  const craters = Array.from({ length: planet.slug === "mercury" ? 22 : 10 }, (_, index) => ({
    x: hash(index, 1, seed),
    y: hash(index, 2, seed),
    radius: 0.012 + hash(index, 3, seed) * 0.055,
  }));

  for (let y = 0; y < height; y += 1) {
    const v = y / (height - 1);

    for (let x = 0; x < width; x += 1) {
      const u = x / (width - 1);
      const noise = fractalNoise(u, v, seed);
      let color: [number, number, number] = base;

      if (planet.slug === "mercury") {
        const stone = mixColor([61, 58, 55], [190, 180, 164], noise);
        let craterShade = 0;

        for (const crater of craters) {
          const dx = wrappedDistance(u, crater.x);
          const dy = (v - crater.y) * 1.9;
          const distance = Math.sqrt(dx * dx + dy * dy) / crater.radius;
          if (distance < 1) {
            craterShade += distance > 0.72 ? 0.18 : -0.22 * (1 - distance);
          }
        }

        color = mixColor(stone, craterShade >= 0 ? [235, 225, 207] : [28, 27, 29], Math.abs(craterShade));
      } else if (planet.slug === "venus") {
        const swirl = 0.5 + 0.5 * Math.sin(v * 80 + Math.sin(u * Math.PI * 8) * 5 + noise * 9);
        color = mixColor([145, 78, 26], [255, 218, 125], swirl * 0.7 + noise * 0.3);
      } else if (planet.slug === "mars") {
        const terrain = mixColor([91, 35, 24], [225, 111, 55], noise);
        const darkRegion = tiledNoise(u + 0.07, v, 5, seed + 8);
        color = mixColor(terrain, [70, 34, 29], Math.max(0, darkRegion - 0.58) * 1.5);

        if (v < 0.045 || v > 0.955) {
          const cap = Math.max((0.045 - Math.min(v, 1 - v)) / 0.045, 0);
          color = mixColor(color, [239, 218, 195], cap * 0.8);
        }
      } else if (planet.slug === "jupiter") {
        const turbulence = (noise - 0.5) * 7;
        const band = 0.5 + 0.5 * Math.sin(v * 95 + turbulence + Math.sin(u * Math.PI * 8));
        color = mixColor([117, 67, 48], [240, 216, 174], band);

        const spotX = wrappedDistance(u, 0.7) / 0.105;
        const spotY = (v - 0.64) / 0.055;
        const spotDistance = spotX * spotX + spotY * spotY;
        if (spotDistance < 1) {
          color = mixColor(color, [179, 70, 45], (1 - spotDistance) * 0.85);
        }
      } else if (planet.slug === "saturn") {
        const band = 0.5 + 0.5 * Math.sin(v * 125 + noise * 3.5);
        color = mixColor([168, 137, 91], [247, 224, 172], band * 0.7 + 0.2);
      } else if (planet.slug === "uranus") {
        const band = 0.5 + 0.5 * Math.sin(v * 45 + noise * 2);
        color = mixColor([84, 170, 186], [183, 232, 229], band * 0.35 + noise * 0.25);
      } else if (planet.slug === "neptune") {
        const band = 0.5 + 0.5 * Math.sin(v * 72 + noise * 5);
        color = mixColor([18, 47, 132], [73, 132, 226], band * 0.55 + noise * 0.25);
        const stormX = wrappedDistance(u, 0.34) / 0.075;
        const stormY = (v - 0.52) / 0.04;
        const stormDistance = stormX * stormX + stormY * stormY;
        if (stormDistance < 1) {
          color = mixColor(color, [12, 20, 62], (1 - stormDistance) * 0.75);
        }
      }

      const index = (y * width + x) * 4;
      data[index] = color[0];
      data[index + 1] = color[1];
      data[index + 2] = color[2];
      data[index + 3] = 255;
    }
  }

  const texture = new THREE.DataTexture(data, width, height, THREE.RGBAFormat);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}

function LocalTextureMaterial({ planet, isGasGiant }: SurfaceMaterialProps) {
  const loadedTexture = useTexture(planet.texture_url);
  const texture = useMemo(() => {
    const preparedTexture = loadedTexture.clone();
    preparedTexture.colorSpace = THREE.SRGBColorSpace;
    preparedTexture.wrapS = THREE.RepeatWrapping;
    preparedTexture.anisotropy = 8;
    preparedTexture.needsUpdate = true;
    return preparedTexture;
  }, [loadedTexture]);

  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <meshStandardMaterial
      map={texture}
      bumpMap={texture}
      bumpScale={0.035}
      roughness={isGasGiant ? 0.55 : 0.72}
      metalness={0.02}
    />
  );
}

function ProceduralTextureMaterial({ planet, isGasGiant }: SurfaceMaterialProps) {
  const texture = useMemo(() => createProceduralTexture(planet), [planet]);

  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <meshStandardMaterial
      map={texture}
      bumpMap={isGasGiant ? undefined : texture}
      bumpScale={isGasGiant ? 0 : 0.025}
      roughness={isGasGiant ? 0.5 : 0.82}
      metalness={0.02}
    />
  );
}

function PlanetSphere({ planet }: { planet: Planet }) {
  const isGasGiant = GAS_GIANTS.includes(planet.slug);

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh>
        <sphereGeometry args={[2.5, 64, 64]} />
        {planet.texture_url ? (
          <LocalTextureMaterial planet={planet} isGasGiant={isGasGiant} />
        ) : (
          <ProceduralTextureMaterial planet={planet} isGasGiant={isGasGiant} />
        )}
      </mesh>
      
      {/* Rings for Saturn */}
      {planet.slug === 'saturn' && (
        <mesh rotation={[Math.PI / 2.2, 0, 0]}>
          <ringGeometry args={[3.2, 5.5, 64]} />
          <meshStandardMaterial
            color="#d4c0a1"
            side={THREE.DoubleSide}
            transparent
            opacity={0.82}
            roughness={0.6}
          />
        </mesh>
      )}
      
      {/* Atmosphere glow for some planets */}
      <mesh>
        <sphereGeometry args={[2.6, 32, 32]} />
        <meshBasicMaterial
          color={planet.color}
          transparent
          opacity={0.18}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </Float>
  );
}

export default function VisualColumn({ planet }: { planet: Planet }) {
  const [view3D, setView3D] = useState(true);

  return (
    <div className="w-full lg:w-1/2 flex flex-col items-center justify-center relative">
      {/* Floating Watercolor Star */}
      <div 
        className="absolute -top-10 -left-10 w-24 md:w-32 z-30 mix-blend-screen pointer-events-none"
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
      <div className="absolute -top-12 lg:-top-16 right-0 z-20 flex gap-2">
        <button 
          onClick={() => setView3D(false)}
          aria-pressed={!view3D}
          aria-label={`View ${planet.name} as a 2D image`}
          className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider transition-all flex items-center gap-2 ${
            !view3D 
              ? 'bg-[var(--gold)] text-[var(--navy-900)] shadow-[0_0_15px_rgba(232,169,76,0.4)]' 
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
        >
          <ImageIcon size={14} />
          2D
        </button>
        <button 
          onClick={() => setView3D(true)}
          aria-pressed={view3D}
          aria-label={`Explore ${planet.name} in 3D`}
          className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider transition-all flex items-center gap-2 ${
            view3D 
              ? 'bg-[var(--gold)] text-[var(--navy-900)] shadow-[0_0_15px_rgba(232,169,76,0.4)]' 
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
        >
          <Cube size={14} />
          3D
        </button>
      </div>

      <div className="relative w-full aspect-square max-w-[500px] flex items-center justify-center mb-8">
        <AnimatePresence mode="wait">
          {!view3D ? (
            <motion.div 
              key="2d"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full flex items-center justify-center p-4"
            >
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
            </motion.div>
          ) : (
            <motion.div 
              key="3d"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full h-full absolute inset-0 rounded-full overflow-visible"
              style={{
                background: "radial-gradient(circle at center, rgba(20, 30, 60, 0.4) 0%, transparent 70%)",
                touchAction: "none",
              }}
              role="img"
              aria-label={`Interactive 3D model of ${planet.name}. Drag to rotate and scroll to zoom.`}
            >
              <Canvas
                camera={{ position: [0, 0, 7.5], fov: 45 }}
                dpr={[1, 2]}
                gl={{ antialias: true, alpha: true }}
              >
                <ambientLight intensity={0.55} />
                <directionalLight position={[5, 3, 5]} intensity={2.4} color="#ffffff" />
                <pointLight position={[-5, -3, 2]} intensity={0.65} color={planet.color} />
                
                <Suspense fallback={null}>
                  <PlanetSphere planet={planet} />
                  <Stars radius={10} depth={5} count={1000} factor={4} saturation={0} fade speed={1} />
                </Suspense>
                
                <OrbitControls 
                  makeDefault
                  enableZoom
                  enablePan={false}
                  enableDamping
                  dampingFactor={0.06}
                  autoRotate
                  autoRotateSpeed={0.5}
                  minDistance={4}
                  maxDistance={10}
                />
              </Canvas>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="absolute -bottom-10 opacity-40 text-xs tracking-widest text-center pointer-events-none w-full">
        {view3D ? "DRAG TO ROTATE • SCROLL TO ZOOM" : "ACTUAL OBSERVATION"}
      </div>
    </div>
  );
}
