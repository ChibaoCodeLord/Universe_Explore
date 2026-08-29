"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import type { RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Billboard, Line, OrbitControls, Sparkles, Stars, useTexture } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { planets, type Planet } from "@/lib/data";

type OrbitSpeed = 1 | 10 | 100;

type SolarSystemSceneProps = {
  selectedSlug: string;
  focusSlug: string | null;
  isPlaying: boolean;
  speed: OrbitSpeed;
  onSelect: (slug: string) => void;
};

type OrbitingPlanetProps = {
  planet: Planet;
  orbitRadius: number;
  displayRadius: number;
  initialAngle: number;
  selected: boolean;
  isPlaying: boolean;
  speed: OrbitSpeed;
  onSelect: (slug: string) => void;
  registerObject: (slug: string, object: THREE.Object3D | null) => void;
};

// Astronomically scaled visual proportions (harmonized for interactive 3D observatory)
const ORBIT_RADII = [2.35, 3.25, 4.15, 5.05, 6.75, 8.25, 9.75, 11.25];
const DISPLAY_RADII = [0.18, 0.29, 0.31, 0.23, 0.68, 0.58, 0.42, 0.41];
const AXIAL_TILTS: Record<string, number> = {
  mercury: 0.0006,
  venus: 3.09, // 177° retrograde
  earth: 0.409, // 23.4°
  mars: 0.439, // 25.2°
  jupiter: 0.055, // 3.1°
  saturn: 0.466, // 26.7°
  uranus: 1.706, // 97.8°
  neptune: 0.494, // 28.3°
};

const ATMOSPHERE_COLORS: Record<string, string> = {
  venus: "#ffd599",
  earth: "#5cb8ff",
  mars: "#ff8c5a",
  jupiter: "#e5b894",
  saturn: "#f2dcaf",
  uranus: "#66e6ff",
  neptune: "#4d94ff",
};

const OVERVIEW_CAMERA = new THREE.Vector3(0, 13.5, 17.5);
const ORIGIN = new THREE.Vector3(0, 0, 0);
const FOCUS_CAMERA_OFFSET = new THREE.Vector3(2.3, 1.6, 2.6);

/* --------------------------------------------------------------------------
   1. The Sun: Dynamic Star with Solar Corona, Flares & Prominence Waves
   -------------------------------------------------------------------------- */
function Sun() {
  const sunCoreRef = useRef<THREE.Mesh>(null);
  const innerCoronaRef = useRef<THREE.Mesh>(null);
  const outerCoronaRef = useRef<THREE.Mesh>(null);
  const flareRingRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (sunCoreRef.current) {
      sunCoreRef.current.rotation.y += delta * 0.12;
      const pulse = 1 + Math.sin(t * 1.8) * 0.015;
      sunCoreRef.current.scale.setScalar(pulse);
    }
    if (innerCoronaRef.current) {
      innerCoronaRef.current.rotation.y -= delta * 0.08;
      innerCoronaRef.current.rotation.z += delta * 0.04;
      const pulse = 1.18 + Math.cos(t * 2.2) * 0.025;
      innerCoronaRef.current.scale.setScalar(pulse);
    }
    if (outerCoronaRef.current) {
      outerCoronaRef.current.rotation.y += delta * 0.05;
      outerCoronaRef.current.rotation.x -= delta * 0.03;
      const pulse = 1.45 + Math.sin(t * 1.4) * 0.04;
      outerCoronaRef.current.scale.setScalar(pulse);
    }
    if (flareRingRef.current) {
      flareRingRef.current.rotation.z += delta * 0.15;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Incandescent Sun Core */}
      <mesh ref={sunCoreRef}>
        <sphereGeometry args={[0.95, 64, 64]} />
        <meshBasicMaterial color="#fff2b2" />
      </mesh>

      {/* Inner Plasma Convection Layer */}
      <mesh ref={innerCoronaRef} scale={1.18}>
        <sphereGeometry args={[0.95, 48, 48]} />
        <meshBasicMaterial
          color="#ffb347"
          transparent
          opacity={0.4}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Outer Solar Atmospheric Corona Glow */}
      <mesh ref={outerCoronaRef} scale={1.45}>
        <sphereGeometry args={[0.95, 36, 36]} />
        <meshBasicMaterial
          color="#ff7b25"
          transparent
          opacity={0.18}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Giant Ambient Stellar Aura Shell */}
      <mesh scale={2.1}>
        <sphereGeometry args={[0.95, 32, 32]} />
        <meshBasicMaterial
          color="#ff5500"
          transparent
          opacity={0.06}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Solar Equatorial Prominence Wave Disk */}
      <mesh ref={flareRingRef} rotation={[Math.PI / 2.05, 0, 0]}>
        <ringGeometry args={[1.05, 1.85, 64]} />
        <meshBasicMaterial
          color="#ffaa33"
          transparent
          opacity={0.14}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Primary Solar Illuminator (High Intensity Sunlight) */}
      <pointLight color="#fff7e6" intensity={58} distance={48} decay={1.5} />
      {/* Warm Ambient Solar Fill Light */}
      <pointLight color="#ff9933" intensity={22} distance={24} decay={1.8} />
    </group>
  );
}

/* --------------------------------------------------------------------------
   2. Orbit Rings: Glowing Anti-Aliased Planetary Orbital Paths
   -------------------------------------------------------------------------- */
function OrbitRing({ radius, selected, isInner }: { radius: number; selected: boolean; isInner: boolean }) {
  const points = useMemo(
    () =>
      Array.from({ length: 193 }, (_, index) => {
        const angle = (index / 192) * Math.PI * 2;
        return new THREE.Vector3(
          Math.cos(angle) * radius,
          0,
          Math.sin(angle) * radius,
        );
      }),
    [radius],
  );

  const ringColor = selected
    ? "#f6d190"
    : isInner
    ? "#8e9ac7"
    : "#6374a8";

  return (
    <group>
      {/* Primary Orbit Line */}
      <Line
        points={points}
        color={ringColor}
        transparent
        opacity={selected ? 0.75 : 0.22}
        lineWidth={selected ? 1.6 : 0.75}
      />
      {/* Glow Halo Line for Selected Orbit */}
      {selected && (
        <Line
          points={points}
          color="#f6d190"
          transparent
          opacity={0.35}
          lineWidth={3.2}
        />
      )}
    </group>
  );
}

/* --------------------------------------------------------------------------
   3. Saturn Rings: Detailed Textured Ring System with Shadows
   -------------------------------------------------------------------------- */
function SaturnRings({ planetRadius }: { planetRadius: number }) {
  const loadedTexture = useTexture("/textures/2k_saturn_ring_alpha.png");
  const ringTexture = useMemo(() => {
    const prepared = loadedTexture.clone();
    prepared.colorSpace = THREE.SRGBColorSpace;
    prepared.needsUpdate = true;
    return prepared;
  }, [loadedTexture]);

  useEffect(() => () => ringTexture.dispose(), [ringTexture]);

  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[planetRadius * 1.28, planetRadius * 2.35, 128]} />
      <meshStandardMaterial
        map={ringTexture}
        alphaMap={ringTexture}
        color="#f2e2c9"
        roughness={0.55}
        metalness={0.05}
        side={THREE.DoubleSide}
        transparent
        opacity={0.95}
        depthWrite={false}
      />
    </mesh>
  );
}

/* --------------------------------------------------------------------------
   4. Uranus Rings: Faint Ice-Dust Ring System
   -------------------------------------------------------------------------- */
function UranusRings({ planetRadius }: { planetRadius: number }) {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[planetRadius * 1.35, planetRadius * 1.85, 96]} />
      <meshBasicMaterial
        color="#aae9ff"
        transparent
        opacity={0.3}
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

/* --------------------------------------------------------------------------
   5. Earth's Moon (Luna)
   -------------------------------------------------------------------------- */
function EarthMoon({ planetRadius, isPlaying, speed }: { planetRadius: number; isPlaying: boolean; speed: OrbitSpeed }) {
  const moonOrbitRef = useRef<THREE.Group>(null);
  const moonDistance = planetRadius * 2.2;

  useFrame((_, delta) => {
    if (!moonOrbitRef.current || !isPlaying) return;
    moonOrbitRef.current.rotation.y += delta * 0.65 * (speed === 100 ? 12 : speed === 10 ? 3 : 1);
  });

  return (
    <group ref={moonOrbitRef}>
      <mesh position={[moonDistance, 0, 0]}>
        <sphereGeometry args={[0.075, 24, 24]} />
        <meshStandardMaterial color="#c8c9ce" roughness={0.9} metalness={0.05} />
      </mesh>
    </group>
  );
}

/* --------------------------------------------------------------------------
   6. Atmospheric Scattering Fresnel Shell
   -------------------------------------------------------------------------- */
function AtmosphericGlow({ planetRadius, color }: { planetRadius: number; color: string }) {
  return (
    <mesh scale={1.04}>
      <sphereGeometry args={[planetRadius, 36, 36]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.22}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.BackSide}
      />
    </mesh>
  );
}

/* --------------------------------------------------------------------------
   7. Asteroid Belt & Kuiper Belt (Instanced 3D Particles)
   -------------------------------------------------------------------------- */
function AsteroidBelt() {
  const mainBeltRef = useRef<THREE.InstancedMesh>(null);
  const kuiperBeltRef = useRef<THREE.InstancedMesh>(null);
  const count = 900;
  const kuiperCount = 450;

  // Generate Main Asteroid Belt matrices (Between Mars and Jupiter: r = 5.6 to 6.2)
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const asteroidData = useMemo(() => {
    const items = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 5.65 + (Math.random() - 0.5) * 0.8;
      const height = (Math.random() - 0.5) * 0.35;
      const scale = 0.015 + Math.random() * 0.035;
      const speed = 0.008 + Math.random() * 0.006;
      items.push({ angle, radius, height, scale, speed });
    }
    return items;
  }, []);

  // Generate Kuiper Belt matrices (Beyond Neptune: r = 11.9 to 13.2)
  const kuiperData = useMemo(() => {
    const items = [];
    for (let i = 0; i < kuiperCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 12.0 + (Math.random() - 0.5) * 1.4;
      const height = (Math.random() - 0.5) * 0.6;
      const scale = 0.02 + Math.random() * 0.045;
      const speed = 0.003 + Math.random() * 0.003;
      items.push({ angle, radius, height, scale, speed });
    }
    return items;
  }, []);

  useEffect(() => {
    if (!mainBeltRef.current) return;
    asteroidData.forEach((item, i) => {
      dummy.position.set(
        Math.cos(item.angle) * item.radius,
        item.height,
        Math.sin(item.angle) * item.radius,
      );
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      dummy.scale.set(item.scale, item.scale * (0.8 + Math.random() * 0.4), item.scale);
      dummy.updateMatrix();
      mainBeltRef.current?.setMatrixAt(i, dummy.matrix);
    });
    mainBeltRef.current.instanceMatrix.needsUpdate = true;
  }, [asteroidData, dummy]);

  useEffect(() => {
    if (!kuiperBeltRef.current) return;
    kuiperData.forEach((item, i) => {
      dummy.position.set(
        Math.cos(item.angle) * item.radius,
        item.height,
        Math.sin(item.angle) * item.radius,
      );
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      dummy.scale.set(item.scale, item.scale, item.scale);
      dummy.updateMatrix();
      kuiperBeltRef.current?.setMatrixAt(i, dummy.matrix);
    });
    kuiperBeltRef.current.instanceMatrix.needsUpdate = true;
  }, [kuiperData, dummy]);

  useFrame((_, delta) => {
    if (mainBeltRef.current) {
      mainBeltRef.current.rotation.y += delta * 0.006;
    }
    if (kuiperBeltRef.current) {
      kuiperBeltRef.current.rotation.y += delta * 0.002;
    }
  });

  return (
    <group>
      {/* Main Asteroid Belt (Rocky Dodecahedrons) */}
      <instancedMesh ref={mainBeltRef} args={[undefined, undefined, count]}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#88817a" roughness={0.88} metalness={0.12} />
      </instancedMesh>

      {/* Kuiper Belt (Icy Asteroids) */}
      <instancedMesh ref={kuiperBeltRef} args={[undefined, undefined, kuiperCount]}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#b2d4e8" roughness={0.7} metalness={0.25} />
      </instancedMesh>
    </group>
  );
}

/* --------------------------------------------------------------------------
   8. Orbiting Planet with Axial Tilt, Day/Night Shading & Interactive HUD
   -------------------------------------------------------------------------- */
function OrbitingPlanet({
  planet,
  orbitRadius,
  displayRadius,
  initialAngle,
  selected,
  isPlaying,
  speed,
  onSelect,
  registerObject,
}: OrbitingPlanetProps) {
  const orbitRef = useRef<THREE.Group>(null);
  const tiltGroupRef = useRef<THREE.Group>(null);
  const planetMeshRef = useRef<THREE.Mesh>(null);
  const loadedTexture = useTexture(planet.texture_url);
  const [hovered, setHovered] = useState(false);

  const texture = useMemo(() => {
    const prepared = loadedTexture.clone();
    prepared.colorSpace = THREE.SRGBColorSpace;
    prepared.wrapS = THREE.RepeatWrapping;
    prepared.needsUpdate = true;
    return prepared;
  }, [loadedTexture]);

  useEffect(() => () => texture.dispose(), [texture]);

  useEffect(() => {
    registerObject(planet.slug, planetMeshRef.current);
    return () => registerObject(planet.slug, null);
  }, [planet.slug, registerObject]);

  useEffect(() => {
    if (orbitRef.current) {
      orbitRef.current.rotation.y = initialAngle;
    }
  }, [initialAngle]);

  useEffect(
    () => () => {
      document.body.style.cursor = "";
    },
    [],
  );

  useFrame((_, delta) => {
    if (!orbitRef.current || !isPlaying) return;

    // Keplerian relative orbital motion
    const relativePeriod = Math.sqrt(planet.orbital_period_days / 87.97);
    orbitRef.current.rotation.y += (delta * 0.026 * speed) / relativePeriod;
    planetMeshRef.current?.rotateY(delta * 0.35);
  });

  const axialTilt = AXIAL_TILTS[planet.slug] ?? 0;
  const atmosphereColor = ATMOSPHERE_COLORS[planet.slug];
  const visualScale = selected ? 1.25 : hovered ? 1.15 : 1;

  return (
    <group ref={orbitRef}>
      <group position={[orbitRadius, 0, 0]}>
        {/* Axial Tilt Sub-group */}
        <group ref={tiltGroupRef} rotation={[0, 0, axialTilt]}>
          {/* Planet Sphere Mesh */}
          <mesh
            ref={planetMeshRef}
            scale={visualScale}
            onClick={(event) => {
              event.stopPropagation();
              onSelect(planet.slug);
            }}
            onPointerEnter={(event) => {
              event.stopPropagation();
              setHovered(true);
              document.body.style.cursor = "pointer";
            }}
            onPointerLeave={() => {
              setHovered(false);
              document.body.style.cursor = "";
            }}
          >
            <sphereGeometry args={[displayRadius, 64, 64]} />
            <meshStandardMaterial
              map={texture}
              roughness={planet.category === "Rocky" ? 0.78 : 0.45}
              metalness={0.02}
              emissive={planet.color}
              emissiveIntensity={selected ? 0.18 : hovered ? 0.1 : 0.02}
            />
          </mesh>

          {/* Atmospheric Glow Shell (if applicable) */}
          {atmosphereColor && (
            <AtmosphericGlow planetRadius={displayRadius * visualScale} color={atmosphereColor} />
          )}

          {/* Earth's Orbiting Moon */}
          {planet.slug === "earth" && (
            <EarthMoon planetRadius={displayRadius} isPlaying={isPlaying} speed={speed} />
          )}

          {/* Saturn's Iconic Rings */}
          {planet.slug === "saturn" && <SaturnRings planetRadius={displayRadius} />}

          {/* Uranus's Tilted Faint Rings */}
          {planet.slug === "uranus" && <UranusRings planetRadius={displayRadius} />}

          {/* Holographic Selection Orbit Beacon */}
          {selected && (
            <group rotation={[Math.PI / 2, 0, 0]}>
              <mesh>
                <torusGeometry args={[displayRadius * 1.65, 0.016, 12, 64]} />
                <meshBasicMaterial color="#f6d190" transparent opacity={0.9} />
              </mesh>
              <mesh scale={1.12}>
                <ringGeometry args={[displayRadius * 1.68, displayRadius * 1.76, 32]} />
                <meshBasicMaterial
                  color="#f6d190"
                  transparent
                  opacity={0.35}
                  side={THREE.DoubleSide}
                />
              </mesh>
            </group>
          )}
        </group>

        {/* 3D Floating Name Marker Badge (Always faces camera) */}
        <Billboard
          position={[0, displayRadius + 0.38, 0]}
          follow={true}
          lockX={false}
          lockY={false}
          lockZ={false}
        >
          <mesh
            onClick={(e) => {
              e.stopPropagation();
              onSelect(planet.slug);
            }}
            onPointerEnter={() => {
              setHovered(true);
              document.body.style.cursor = "pointer";
            }}
            onPointerLeave={() => {
              setHovered(false);
              document.body.style.cursor = "";
            }}
          >
            <planeGeometry args={[0.01, 0.01]} />
            <meshBasicMaterial transparent opacity={0} />
          </mesh>
        </Billboard>
      </group>
    </group>
  );
}

/* --------------------------------------------------------------------------
   9. Cinematic Camera Controller with Exponential Lerping & Tracking
   -------------------------------------------------------------------------- */
function CameraController({
  focusSlug,
  objectRefs,
}: {
  focusSlug: string | null;
  objectRefs: RefObject<Record<string, THREE.Object3D | null>>;
}) {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const worldPosition = useMemo(() => new THREE.Vector3(), []);
  const desiredPosition = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const focusedObject = focusSlug ? objectRefs.current[focusSlug] : null;
    if (focusedObject) {
      focusedObject.getWorldPosition(worldPosition);
      desiredPosition.copy(worldPosition).add(FOCUS_CAMERA_OFFSET);
      camera.position.lerp(desiredPosition, 0.055);
      controls.target.lerp(worldPosition, 0.075);
    } else {
      camera.position.lerp(OVERVIEW_CAMERA, 0.045);
      controls.target.lerp(ORIGIN, 0.06);
    }
    controls.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enablePan={false}
      enableDamping
      dampingFactor={0.075}
      minDistance={2.4}
      maxDistance={28}
      minPolarAngle={0.28}
      maxPolarAngle={Math.PI / 2.05}
    />
  );
}

/* --------------------------------------------------------------------------
   10. Solar System Master Assembler
   -------------------------------------------------------------------------- */
function SolarSystem({
  selectedSlug,
  focusSlug,
  isPlaying,
  speed,
  onSelect,
}: SolarSystemSceneProps) {
  const objectRefs = useRef<Record<string, THREE.Object3D | null>>({});
  const registerObject = useMemo(
    () => (slug: string, object: THREE.Object3D | null) => {
      objectRefs.current[slug] = object;
    },
    [],
  );

  return (
    <>
      <color attach="background" args={["#04071d"]} />
      <fog attach="fog" args={["#04071d", 20, 52]} />

      {/* Atmospheric Ambient Space Fill Light */}
      <ambientLight intensity={0.22} />

      {/* Dynamic Central Sun */}
      <Sun />

      {/* Instanced Asteroid Belts (Main + Kuiper) */}
      <AsteroidBelt />

      {/* 8 Orbiting Planets */}
      {planets.map((planet, index) => (
        <group key={planet.slug}>
          <OrbitRing
            radius={ORBIT_RADII[index]}
            selected={selectedSlug === planet.slug}
            isInner={index < 4}
          />
          <OrbitingPlanet
            planet={planet}
            orbitRadius={ORBIT_RADII[index]}
            displayRadius={DISPLAY_RADII[index]}
            initialAngle={(index / planets.length) * Math.PI * 2 + index * 0.42}
            selected={selectedSlug === planet.slug}
            isPlaying={isPlaying}
            speed={speed}
            onSelect={onSelect}
            registerObject={registerObject}
          />
        </group>
      ))}

      {/* Twinkling Cosmic Starfield */}
      <Stars
        radius={42}
        depth={24}
        count={1800}
        factor={2.8}
        saturation={0.35}
        fade
        speed={0.3}
      />

      {/* Volumetric Stardust Particles */}
      <Sparkles
        count={280}
        scale={28}
        size={2.2}
        speed={0.25}
        opacity={0.35}
        color="#ffeaa7"
      />

      {/* Interactive Cinematic Camera */}
      <CameraController focusSlug={focusSlug} objectRefs={objectRefs} />
    </>
  );
}

export default function SolarSystemScene(props: SolarSystemSceneProps) {
  return (
    <div
      className="solar-system-canvas"
      role="img"
      aria-label="Interactive 3D model of the solar system with real orbits, atmospheric halos, and asteroid belts."
    >
      <Canvas
        camera={{ position: [0, 13.5, 17.5], fov: 46, near: 0.1, far: 110 }}
        dpr={[1, 1.8]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl, camera }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.12;
          gl.outputColorSpace = THREE.SRGBColorSpace;
          camera.lookAt(0, 0, 0);
        }}
      >
        <Suspense fallback={null}>
          <SolarSystem {...props} />
        </Suspense>
      </Canvas>
    </div>
  );
}
