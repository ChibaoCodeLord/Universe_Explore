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

// Deterministic Seeded Pseudo-Random Generator (Purity compliant for React 19 & ESLint)
function createPRNG(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function () {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// Astronomical visual proportions harmonized for 3D exploration
const ORBIT_RADII = [2.35, 3.25, 4.15, 5.05, 6.75, 8.25, 9.75, 11.25];
const DISPLAY_RADII = [0.18, 0.29, 0.31, 0.23, 0.68, 0.58, 0.42, 0.41];

// Real Astronomical Axial Tilts (in radians)
const AXIAL_TILTS: Record<string, number> = {
  mercury: 0.0006, // 0.034°
  venus: 3.096,   // 177.3° (retrograde)
  earth: 0.409,   // 23.44°
  mars: 0.439,    // 25.19°
  jupiter: 0.055, // 3.13°
  saturn: 0.466,  // 26.73°
  uranus: 1.706,  // 97.77° (rolling on its side)
  neptune: 0.494, // 28.32°
};

const OVERVIEW_CAMERA = new THREE.Vector3(0, 13.5, 17.5);
const ORIGIN = new THREE.Vector3(0, 0, 0);
const FOCUS_CAMERA_OFFSET = new THREE.Vector3(2.3, 1.6, 2.6);

// GLSL Simplex 3D Noise & Solar Plasma Shaders
const NOISE_GLSL = `
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float snoise(vec3 v){
  const vec2  C = vec2(1.0/6.0, 1.0/3.0);
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 = v - i + dot(i, C.xxx) ;

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

  i = mod(i, 289.0 );
  vec4 p = permute( permute( permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  float n_ = 0.142857142857;
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
}

float fbm(vec3 p) {
  float v = 0.0;
  float a = 0.5;
  vec3 shift = vec3(100.0);
  for (int i = 0; i < 4; ++i) {
    v += a * snoise(p);
    p = p * 2.0 + shift;
    a *= 0.5;
  }
  return v;
}
`;

const SUN_VERTEX_SHADER = `
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vNormal = normalize(normalMatrix * normal);
  vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const SUN_CORE_FRAGMENT_SHADER = `
uniform float uTime;
varying vec3 vNormal;
varying vec3 vPosition;

${NOISE_GLSL}

void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(-vPosition);
  
  // Turbulent boiling solar plasma & magnetic convection flows
  vec3 p = normal * 3.6;
  float n1 = fbm(p + vec3(uTime * 0.14, uTime * 0.2, uTime * 0.08));
  float n2 = fbm(p * 2.3 - vec3(uTime * 0.25, uTime * 0.12, uTime * 0.16));
  float plasma = (n1 + n2 * 0.5) * 0.65 + 0.35;

  // Thermonuclear fire palette
  vec3 darkSpots = vec3(0.55, 0.03, 0.01);     // Convective dark spots
  vec3 deepOrange = vec3(0.98, 0.3, 0.01);     // Molten plasma orange
  vec3 brightGold = vec3(1.0, 0.75, 0.12);     // Solar yellow
  vec3 whiteHot = vec3(1.0, 0.98, 0.92);       // Blinding white-hot core

  vec3 col = mix(darkSpots, deepOrange, smoothstep(0.08, 0.42, plasma));
  col = mix(col, brightGold, smoothstep(0.42, 0.72, plasma));
  col = mix(col, whiteHot, smoothstep(0.72, 1.0, plasma));

  // Fresnel Solar Atmospheric Rim Radiation
  float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 1.9);
  vec3 rim = mix(vec3(1.0, 0.5, 0.05), vec3(1.0, 0.98, 0.85), fresnel);
  
  vec3 finalColor = col + rim * fresnel * 2.4;
  gl_FragColor = vec4(finalColor, 1.0);
}
`;

const SUN_HALO_FRAGMENT_SHADER = `
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(-vPosition);
  
  // Smooth soft atmospheric radial falloff (no hard edges or plastic rings)
  float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 2.8);
  vec3 glowColor = mix(vec3(1.0, 0.38, 0.02), vec3(1.0, 0.85, 0.35), fresnel);
  
  gl_FragColor = vec4(glowColor * 1.8, fresnel * 0.45);
}
`;

/* --------------------------------------------------------------------------
   1. Procedural Boiling Fireball Sun (Clean & Organic)
   -------------------------------------------------------------------------- */
function Sun() {
  const coreMatRef = useRef<THREE.ShaderMaterial>(null);
  const haloMatRef = useRef<THREE.ShaderMaterial>(null);

  const coreUniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (coreMatRef.current) {
      coreMatRef.current.uniforms.uTime.value = t;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Procedural Boiling Plasma Core Fireball Sphere */}
      <mesh>
        <sphereGeometry args={[0.96, 64, 64]} />
        <shaderMaterial
          ref={coreMatRef}
          vertexShader={SUN_VERTEX_SHADER}
          fragmentShader={SUN_CORE_FRAGMENT_SHADER}
          uniforms={coreUniforms}
        />
      </mesh>

      {/* 2. Soft Atmospheric Solar Glow Shell (Natural Smooth Falloff) */}
      <mesh scale={1.14}>
        <sphereGeometry args={[0.96, 48, 48]} />
        <shaderMaterial
          ref={haloMatRef}
          vertexShader={SUN_VERTEX_SHADER}
          fragmentShader={SUN_HALO_FRAGMENT_SHADER}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>

      {/* 3. Soft Ambient Outer Radiance Shell */}
      <mesh scale={1.48}>
        <sphereGeometry args={[0.96, 32, 32]} />
        <meshBasicMaterial
          color="#ff5500"
          transparent
          opacity={0.08}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 4. Solar Plasma Fire Embers Floating Naturally Around the Star */}
      <Sparkles
        count={90}
        scale={3.2}
        size={2.8}
        speed={0.45}
        opacity={0.55}
        color="#ffa726"
      />

      {/* Photorealistic Dual Sunlight */}
      <pointLight color="#fff8e8" intensity={65} distance={55} decay={1.5} />
      <pointLight color="#ff7700" intensity={28} distance={28} decay={1.8} />
    </group>
  );
}

/* --------------------------------------------------------------------------
   2. Glowing Anti-Aliased Planetary Orbit Paths
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
      <Line
        points={points}
        color={ringColor}
        transparent
        opacity={selected ? 0.8 : 0.22}
        lineWidth={selected ? 1.6 : 0.75}
      />
      {selected && (
        <Line
          points={points}
          color="#f6d190"
          transparent
          opacity={0.35}
          lineWidth={3.4}
        />
      )}
    </group>
  );
}

/* --------------------------------------------------------------------------
   3. Saturn: Photorealistic Textured Rings (NASA Cassini Alpha)
   -------------------------------------------------------------------------- */
function SaturnRings({ planetRadius }: { planetRadius: number }) {
  const loadedTexture = useTexture("/textures/2k_saturn_ring_alpha.png");
  const ringTexture = useMemo(() => {
    const prepared = loadedTexture.clone();
    prepared.colorSpace = THREE.SRGBColorSpace;
    prepared.generateMipmaps = true;
    prepared.minFilter = THREE.LinearMipmapLinearFilter;
    prepared.magFilter = THREE.LinearFilter;
    prepared.needsUpdate = true;
    return prepared;
  }, [loadedTexture]);

  useEffect(() => () => ringTexture.dispose(), [ringTexture]);

  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[planetRadius * 1.25, planetRadius * 2.32, 128]} />
      <meshStandardMaterial
        map={ringTexture}
        alphaMap={ringTexture}
        color="#e8dcbe"
        roughness={0.92}
        metalness={0.0}
        side={THREE.DoubleSide}
        transparent
        opacity={0.92}
        depthWrite={false}
      />
    </mesh>
  );
}

/* --------------------------------------------------------------------------
   4. Earth's Moon (Luna)
   -------------------------------------------------------------------------- */
function EarthMoon({ planetRadius, isPlaying, speed }: { planetRadius: number; isPlaying: boolean; speed: OrbitSpeed }) {
  const moonOrbitRef = useRef<THREE.Group>(null);
  const moonDistance = planetRadius * 2.3;

  useFrame((_, delta) => {
    if (!moonOrbitRef.current || !isPlaying) return;
    moonOrbitRef.current.rotation.y += delta * 0.7 * (speed === 100 ? 12 : speed === 10 ? 3 : 1);
  });

  return (
    <group ref={moonOrbitRef}>
      <mesh position={[moonDistance, 0, 0]}>
        <sphereGeometry args={[0.072, 24, 24]} />
        <meshStandardMaterial color="#c0c2c8" roughness={0.96} metalness={0.0} />
      </mesh>
    </group>
  );
}

/* --------------------------------------------------------------------------
   8. Asteroid Belt & Kuiper Belt (Instanced 3D Particles with Pure PRNG)
   -------------------------------------------------------------------------- */
function AsteroidBelt() {
  const mainBeltRef = useRef<THREE.InstancedMesh>(null);
  const kuiperBeltRef = useRef<THREE.InstancedMesh>(null);
  const count = 900;
  const kuiperCount = 450;

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Pure Deterministic Asteroid Position generator (Seed 42)
  const asteroidData = useMemo(() => {
    const prng = createPRNG(42);
    const items = [];
    for (let i = 0; i < count; i++) {
      const angle = prng() * Math.PI * 2;
      const radius = 5.65 + (prng() - 0.5) * 0.8;
      const height = (prng() - 0.5) * 0.35;
      const scale = 0.015 + prng() * 0.035;
      const rotX = prng() * Math.PI;
      const rotY = prng() * Math.PI;
      const rotZ = prng() * Math.PI;
      items.push({ angle, radius, height, scale, rotX, rotY, rotZ });
    }
    return items;
  }, [count]);

  // Pure Deterministic Kuiper Belt generator (Seed 1337)
  const kuiperData = useMemo(() => {
    const prng = createPRNG(1337);
    const items = [];
    for (let i = 0; i < kuiperCount; i++) {
      const angle = prng() * Math.PI * 2;
      const radius = 12.0 + (prng() - 0.5) * 1.4;
      const height = (prng() - 0.5) * 0.6;
      const scale = 0.02 + prng() * 0.045;
      const rotX = prng() * Math.PI;
      const rotY = prng() * Math.PI;
      const rotZ = prng() * Math.PI;
      items.push({ angle, radius, height, scale, rotX, rotY, rotZ });
    }
    return items;
  }, [kuiperCount]);

  useEffect(() => {
    if (!mainBeltRef.current) return;
    asteroidData.forEach((item, i) => {
      dummy.position.set(
        Math.cos(item.angle) * item.radius,
        item.height,
        Math.sin(item.angle) * item.radius,
      );
      dummy.rotation.set(item.rotX, item.rotY, item.rotZ);
      dummy.scale.set(item.scale, item.scale * 0.9, item.scale);
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
      dummy.rotation.set(item.rotX, item.rotY, item.rotZ);
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
      {/* Main Asteroid Belt (Rocky Asteroids) */}
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
   9. Orbiting Planet Component with Realistic Rings & Atmospheric Glow
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
    prepared.generateMipmaps = true;
    prepared.minFilter = THREE.LinearMipmapLinearFilter;
    prepared.magFilter = THREE.LinearFilter;
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

    const relativePeriod = Math.sqrt(planet.orbital_period_days / 87.97);
    orbitRef.current.rotation.y += (delta * 0.026 * speed) / relativePeriod;
    planetMeshRef.current?.rotateY(delta * 0.35);
  });

  const axialTilt = AXIAL_TILTS[planet.slug] ?? 0;
  const visualScale = selected ? 1.22 : hovered ? 1.12 : 1;

  return (
    <group ref={orbitRef}>
      <group position={[orbitRadius, 0, 0]}>
        {/* Real Astronomical Axial Tilt Container */}
        <group ref={tiltGroupRef} rotation={[0, 0, axialTilt]}>
          {/* Planet Sphere Mesh (Natural Diffuse Atmosphere & Regolith) */}
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
              roughness={planet.slug === "earth" ? 0.75 : planet.category === "Rocky" ? 0.96 : 0.9}
              metalness={0.0}
              emissive={planet.color}
              emissiveIntensity={selected ? 0.22 : hovered ? 0.08 : 0.0}
            />
          </mesh>

          {/* Earth's Orbiting Moon */}
          {planet.slug === "earth" && (
            <EarthMoon planetRadius={displayRadius} isPlaying={isPlaying} speed={speed} />
          )}

          {/* Saturn's Iconic Rings (Only prominent natural ring in the solar system) */}
          {planet.slug === "saturn" && <SaturnRings planetRadius={displayRadius} />}

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

        {/* 3D Floating Name Marker Badge */}
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
   10. Camera Controller with Exponential Lerping & Tracking
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
   11. Master Solar System Scene Assembler
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

      {/* Deep Space Ambient Light */}
      <ambientLight intensity={0.22} />

      {/* Dynamic Incandescent Sun with Corona & Flares */}
      <Sun />

      {/* 3D Asteroid & Kuiper Belts */}
      <AsteroidBelt />

      {/* 8 Orbiting Planets with Rings & Halos */}
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

      {/* Cosmic Multi-Depth Stars */}
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

      {/* Camera Controller */}
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
