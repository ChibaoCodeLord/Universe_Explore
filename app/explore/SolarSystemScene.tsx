"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import type { RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Line, OrbitControls, Stars, useTexture } from "@react-three/drei";
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

const ORBIT_RADII = [2.2, 3.05, 3.9, 4.8, 6.15, 7.55, 8.9, 10.15];
const DISPLAY_RADII = [0.18, 0.3, 0.31, 0.23, 0.63, 0.56, 0.4, 0.39];
const OVERVIEW_CAMERA = new THREE.Vector3(0, 12.8, 15.5);
const ORIGIN = new THREE.Vector3(0, 0, 0);
const FOCUS_CAMERA_OFFSET = new THREE.Vector3(2.1, 1.55, 2.4);

function OrbitRing({ radius, selected }: { radius: number; selected: boolean }) {
  const points = useMemo(
    () =>
      Array.from({ length: 129 }, (_, index) => {
        const angle = (index / 128) * Math.PI * 2;
        return new THREE.Vector3(
          Math.cos(angle) * radius,
          0,
          Math.sin(angle) * radius,
        );
      }),
    [radius],
  );

  return (
    <Line
      points={points}
      color={selected ? "#f6d190" : "#7280ba"}
      transparent
      opacity={selected ? 0.62 : 0.2}
      lineWidth={selected ? 1.25 : 0.65}
    />
  );
}

function SaturnRings({ planetRadius }: { planetRadius: number }) {
  const loadedTexture = useTexture("/textures/2k_saturn_ring_alpha.png");
  const ringTexture = useMemo(() => {
    const preparedTexture = loadedTexture.clone();
    preparedTexture.colorSpace = THREE.SRGBColorSpace;
    preparedTexture.needsUpdate = true;
    return preparedTexture;
  }, [loadedTexture]);

  useEffect(() => () => ringTexture.dispose(), [ringTexture]);

  return (
    <mesh rotation={[Math.PI / 2.15, 0, 0]}>
      <ringGeometry args={[planetRadius * 1.25, planetRadius * 2.05, 128]} />
      <meshBasicMaterial
        map={ringTexture}
        alphaMap={ringTexture}
        color="#ead6b8"
        side={THREE.DoubleSide}
        transparent
        opacity={0.9}
        depthWrite={false}
      />
    </mesh>
  );
}

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
  const planetRef = useRef<THREE.Mesh>(null);
  const loadedTexture = useTexture(planet.texture_url);
  const texture = useMemo(() => {
    const preparedTexture = loadedTexture.clone();
    preparedTexture.colorSpace = THREE.SRGBColorSpace;
    preparedTexture.wrapS = THREE.RepeatWrapping;
    preparedTexture.needsUpdate = true;
    return preparedTexture;
  }, [loadedTexture]);
  const [hovered, setHovered] = useState(false);

  useEffect(() => () => texture.dispose(), [texture]);

  useEffect(() => {
    registerObject(planet.slug, planetRef.current);
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
    if (!orbitRef.current || !isPlaying) {
      return;
    }

    const relativePeriod = Math.sqrt(planet.orbital_period_days / 87.97);
    orbitRef.current.rotation.y += (delta * 0.026 * speed) / relativePeriod;
    planetRef.current?.rotateY(delta * 0.22);
  });

  const visualScale = selected ? 1.22 : hovered ? 1.12 : 1;

  return (
    <group ref={orbitRef}>
      <group position={[orbitRadius, 0, 0]}>
        <mesh
          ref={planetRef}
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
          <sphereGeometry args={[displayRadius, 48, 48]} />
          <meshStandardMaterial
            map={texture}
            roughness={0.72}
            metalness={0}
            emissive={planet.color}
            emissiveIntensity={selected ? 0.16 : 0.025}
          />
        </mesh>

        {planet.slug === "saturn" && <SaturnRings planetRadius={displayRadius} />}

        {selected && (
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[displayRadius * 1.55, 0.018, 12, 64]} />
            <meshBasicMaterial color="#f6d190" transparent opacity={0.9} />
          </mesh>
        )}
      </group>
    </group>
  );
}

function Sun() {
  const sunRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (sunRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.15) * 0.025;
      sunRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group>
      <mesh ref={sunRef}>
        <sphereGeometry args={[0.9, 64, 64]} />
        <meshBasicMaterial color="#ffd36e" />
      </mesh>
      <mesh scale={1.14}>
        <sphereGeometry args={[0.9, 48, 48]} />
        <meshBasicMaterial
          color="#ff9d45"
          transparent
          opacity={0.16}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <pointLight color="#fff0c2" intensity={48} distance={32} decay={1.7} />
    </group>
  );
}

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
    if (!controls) {
      return;
    }

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
      minDistance={2.2}
      maxDistance={24}
      minPolarAngle={0.32}
      maxPolarAngle={Math.PI / 2.08}
    />
  );
}

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
      <color attach="background" args={["#05091f"]} />
      <fog attach="fog" args={["#05091f", 18, 42]} />
      <ambientLight intensity={0.18} />
      <Sun />
      {planets.map((planet, index) => (
        <group key={planet.slug}>
          <OrbitRing
            radius={ORBIT_RADII[index]}
            selected={selectedSlug === planet.slug}
          />
          <OrbitingPlanet
            planet={planet}
            orbitRadius={ORBIT_RADII[index]}
            displayRadius={DISPLAY_RADII[index]}
            initialAngle={(index / planets.length) * Math.PI * 2 + index * 0.37}
            selected={selectedSlug === planet.slug}
            isPlaying={isPlaying}
            speed={speed}
            onSelect={onSelect}
            registerObject={registerObject}
          />
        </group>
      ))}
      <Stars
        radius={34}
        depth={18}
        count={1100}
        factor={2.2}
        saturation={0.18}
        fade
        speed={0.22}
      />
      <CameraController focusSlug={focusSlug} objectRefs={objectRefs} />
    </>
  );
}

export default function SolarSystemScene(props: SolarSystemSceneProps) {
  return (
    <div
      className="solar-system-canvas"
      role="img"
      aria-label="Interactive model of the solar system. Choose a planet using the controls below the model."
    >
      <Canvas
        camera={{ position: [0, 12.8, 15.5], fov: 47, near: 0.1, far: 90 }}
        dpr={[1, 1.65]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        onCreated={({ gl, camera }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.08;
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
