"use client";

import { useEffect, useMemo, useRef, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars, Float, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { Planet } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";
import { CuboidIcon as Cube, ImageIcon } from "lucide-react";

const GAS_GIANTS = ["jupiter", "saturn", "uranus", "neptune"];

type RGB = [number, number, number];

type SurfaceMaterialProps = {
  planet: Planet;
  isGasGiant: boolean;
};

type SurfaceMaps = {
  colorMap: THREE.DataTexture;
  bumpMap: THREE.DataTexture;
};

type PlanetLook = {
  roughness: number;
  clearcoat: number;
  clearcoatRoughness: number;
  bumpScale: number;
  flattening: number;
  atmosphereColor: string;
  atmosphereStrength: number;
};

type AtmosphericLayerLook = {
  color: RGB;
  opacity: number;
  speed: number;
  bandFrequency: number;
  threshold: number;
};

const PLANET_LOOKS: Record<string, PlanetLook> = {
  mercury: {
    roughness: 0.94,
    clearcoat: 0,
    clearcoatRoughness: 1,
    bumpScale: 0.11,
    flattening: 1,
    atmosphereColor: "#b8aa9b",
    atmosphereStrength: 0.04,
  },
  venus: {
    roughness: 0.78,
    clearcoat: 0.08,
    clearcoatRoughness: 0.72,
    bumpScale: 0.018,
    flattening: 0.995,
    atmosphereColor: "#ffc66f",
    atmosphereStrength: 0.42,
  },
  earth: {
    roughness: 0.72,
    clearcoat: 0.22,
    clearcoatRoughness: 0.42,
    bumpScale: 0.045,
    flattening: 0.997,
    atmosphereColor: "#56aaff",
    atmosphereStrength: 0.55,
  },
  mars: {
    roughness: 0.92,
    clearcoat: 0.01,
    clearcoatRoughness: 1,
    bumpScale: 0.085,
    flattening: 0.995,
    atmosphereColor: "#e47b4d",
    atmosphereStrength: 0.12,
  },
  jupiter: {
    roughness: 0.68,
    clearcoat: 0.1,
    clearcoatRoughness: 0.75,
    bumpScale: 0.012,
    flattening: 0.94,
    atmosphereColor: "#e7bd91",
    atmosphereStrength: 0.18,
  },
  saturn: {
    roughness: 0.72,
    clearcoat: 0.08,
    clearcoatRoughness: 0.82,
    bumpScale: 0.009,
    flattening: 0.9,
    atmosphereColor: "#ead3a2",
    atmosphereStrength: 0.16,
  },
  uranus: {
    roughness: 0.62,
    clearcoat: 0.16,
    clearcoatRoughness: 0.58,
    bumpScale: 0.006,
    flattening: 0.98,
    atmosphereColor: "#87e7ef",
    atmosphereStrength: 0.42,
  },
  neptune: {
    roughness: 0.6,
    clearcoat: 0.18,
    clearcoatRoughness: 0.52,
    bumpScale: 0.012,
    flattening: 0.97,
    atmosphereColor: "#477cff",
    atmosphereStrength: 0.5,
  },
};

const ATMOSPHERIC_LAYERS: Record<string, AtmosphericLayerLook> = {
  venus: {
    color: [255, 228, 174],
    opacity: 0.24,
    speed: 0.012,
    bandFrequency: 16,
    threshold: 0.56,
  },
  jupiter: {
    color: [244, 231, 208],
    opacity: 0.15,
    speed: 0.022,
    bandFrequency: 28,
    threshold: 0.61,
  },
  saturn: {
    color: [246, 226, 183],
    opacity: 0.13,
    speed: 0.018,
    bandFrequency: 34,
    threshold: 0.62,
  },
  uranus: {
    color: [205, 245, 247],
    opacity: 0.28,
    speed: 0.011,
    bandFrequency: 19,
    threshold: 0.5,
  },
  neptune: {
    color: [190, 220, 255],
    opacity: 0.22,
    speed: 0.028,
    bandFrequency: 24,
    threshold: 0.57,
  },
};

function hexToRgb(hex: string): RGB {
  const normalized = hex.replace("#", "");
  const value = Number.parseInt(normalized, 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

function mixColor(
  from: RGB,
  to: RGB,
  amount: number,
): RGB {
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

function valueNoise(
  u: number,
  v: number,
  cellsX: number,
  cellsY: number,
  seed: number,
) {
  const x = u * cellsX;
  const y = v * cellsY;
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const x1 = (x0 + 1) % cellsX;
  const y1 = y0 + 1;
  const tx = smoothstep(x - x0);
  const ty = smoothstep(y - y0);
  const wrappedX0 = ((x0 % cellsX) + cellsX) % cellsX;

  const top = THREE.MathUtils.lerp(hash(wrappedX0, y0, seed), hash(x1, y0, seed), tx);
  const bottom = THREE.MathUtils.lerp(hash(wrappedX0, y1, seed), hash(x1, y1, seed), tx);
  return THREE.MathUtils.lerp(top, bottom, ty);
}

function tiledNoise(u: number, v: number, frequency: number, seed: number) {
  return valueNoise(u, v, frequency, frequency, seed);
}

function fractalNoise(
  u: number,
  v: number,
  seed: number,
  stretchX = 1,
  stretchY = 1,
) {
  const frequencies = [3, 7, 15, 31, 63];
  const amplitudes = [0.42, 0.26, 0.16, 0.1, 0.06];

  return frequencies.reduce(
    (total, frequency, index) =>
      total +
      valueNoise(
        u,
        v,
        Math.max(1, Math.round(frequency * stretchX)),
        Math.max(1, Math.round(frequency * stretchY)),
        seed + index * 17,
      ) *
        amplitudes[index],
    0,
  );
}

function wrappedDistance(a: number, b: number) {
  const distance = Math.abs(a - b);
  return Math.min(distance, 1 - distance);
}

function remap(value: number, min: number, max: number) {
  return THREE.MathUtils.clamp((value - min) / (max - min), 0, 1);
}

function createDataTexture(
  data: Uint8Array,
  width: number,
  height: number,
  colorSpace: THREE.ColorSpace,
) {
  const texture = new THREE.DataTexture(data, width, height, THREE.RGBAFormat);
  texture.colorSpace = colorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 8;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
}

function createProceduralMaps(planet: Planet): SurfaceMaps {
  const width = 1024;
  const height = 512;
  const colorData = new Uint8Array(width * height * 4);
  const bumpData = new Uint8Array(width * height * 4);
  const seed = planet.slug.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const base = hexToRgb(planet.color);
  const craterCount = planet.slug === "mercury" ? 52 : planet.slug === "mars" ? 18 : 0;
  const craters = Array.from({ length: craterCount }, (_, index) => ({
    x: hash(index, 1, seed),
    y: hash(index, 2, seed),
    radius: 0.008 + hash(index, 3, seed) * (planet.slug === "mercury" ? 0.052 : 0.038),
    depth: 0.35 + hash(index, 4, seed) * 0.65,
  }));

  for (let y = 0; y < height; y += 1) {
    const v = y / (height - 1);

    for (let x = 0; x < width; x += 1) {
      const u = x / (width - 1);
      const noise = fractalNoise(u, v, seed);
      const detail = tiledNoise(u, v, 127, seed + 101);
      let color: RGB = base;
      let surfaceHeight = noise;

      if (planet.slug === "mercury") {
        const stone = mixColor([48, 46, 44], [181, 174, 162], noise * 0.82 + detail * 0.18);
        let craterRelief = 0;

        for (const crater of craters) {
          const dx = wrappedDistance(u, crater.x);
          const dy = (v - crater.y) * 1.75;
          const distance = Math.sqrt(dx * dx + dy * dy) / crater.radius;

          if (distance < 1.15) {
            const rim = Math.exp(-Math.pow((distance - 0.88) / 0.11, 2)) * 0.34;
            const bowl = distance < 0.86 ? -(1 - distance / 0.86) * 0.3 : 0;
            craterRelief += (rim + bowl) * crater.depth;
          }
        }

        surfaceHeight = THREE.MathUtils.clamp(noise * 0.72 + craterRelief, 0, 1);
        color = mixColor(
          stone,
          craterRelief >= 0 ? [224, 216, 202] : [27, 27, 29],
          Math.min(Math.abs(craterRelief) * 1.8, 0.72),
        );
      } else if (planet.slug === "venus") {
        const stretchedClouds = fractalNoise(u, v, seed + 31, 2.8, 0.48);
        const warp = (stretchedClouds - 0.5) * 5 + Math.sin(u * Math.PI * 6) * 0.35;
        const cloudBand = 0.5 + 0.5 * Math.sin(v * Math.PI * 28 + warp);
        const cloudValue = THREE.MathUtils.clamp(cloudBand * 0.38 + stretchedClouds * 0.5 + detail * 0.12, 0, 1);
        color = mixColor([128, 72, 30], [235, 176, 84], cloudValue);
        color = mixColor(color, [255, 226, 151], remap(cloudValue, 0.7, 1) * 0.72);
        surfaceHeight = cloudValue * 0.72 + detail * 0.28;
      } else if (planet.slug === "mars") {
        const terrainNoise = fractalNoise(u, v, seed + 9, 1.35, 0.9);
        const largeRegions = valueNoise(u + 0.07, v, 5, 3, seed + 83);
        let craterRelief = 0;

        for (const crater of craters) {
          const dx = wrappedDistance(u, crater.x);
          const dy = (v - crater.y) * 1.8;
          const distance = Math.sqrt(dx * dx + dy * dy) / crater.radius;
          if (distance < 1.1) {
            const rim = Math.exp(-Math.pow((distance - 0.86) / 0.12, 2)) * 0.2;
            const bowl = distance < 0.82 ? -(1 - distance / 0.82) * 0.16 : 0;
            craterRelief += (rim + bowl) * crater.depth;
          }
        }

        const terrain = mixColor([76, 31, 23], [208, 86, 43], terrainNoise * 0.82 + detail * 0.18);
        color = mixColor(terrain, [49, 31, 30], remap(largeRegions, 0.58, 0.82) * 0.72);
        color = mixColor(color, [235, 139, 80], remap(terrainNoise, 0.72, 0.94) * 0.45);
        surfaceHeight = THREE.MathUtils.clamp(terrainNoise * 0.86 + craterRelief, 0, 1);

        const polarDistance = Math.min(v, 1 - v);
        if (polarDistance < 0.065) {
          const cap = 1 - polarDistance / 0.065;
          color = mixColor(color, [238, 219, 198], smoothstep(cap) * 0.92);
        }
      } else if (planet.slug === "jupiter") {
        const stretched = fractalNoise(u, v, seed + 17, 3.4, 0.42);
        const turbulence = (stretched - 0.5) * 2.8 + Math.sin(u * Math.PI * 10) * 0.08;
        const broadBand = 0.5 + 0.5 * Math.sin(v * Math.PI * 14 + turbulence);
        const fineBand = 0.5 + 0.5 * Math.sin(v * Math.PI * 54 + turbulence * 2.3);
        const bandValue = THREE.MathUtils.clamp(broadBand * 0.42 + fineBand * 0.18 + stretched * 0.4, 0, 1);
        color = mixColor([82, 49, 37], [210, 163, 117], bandValue);
        color = mixColor(color, [246, 225, 190], remap(bandValue, 0.58, 0.92) * 0.78);

        const spotX = wrappedDistance(u, 0.71) / 0.105;
        const spotY = (v - 0.64) / 0.052;
        const spotDistance = Math.sqrt(spotX * spotX + spotY * spotY);
        if (spotDistance < 1.12) {
          const spotAngle = Math.atan2(spotY, spotX);
          const swirl = 0.5 + 0.5 * Math.sin(spotAngle * 3 - spotDistance * 13 + stretched * 4);
          const spotStrength = smoothstep(THREE.MathUtils.clamp(1.12 - spotDistance, 0, 1));
          const spotColor = mixColor([145, 48, 34], [225, 125, 75], swirl);
          color = mixColor(color, spotColor, spotStrength * 0.9);
        }
        surfaceHeight = bandValue * 0.72 + stretched * 0.28;
      } else if (planet.slug === "saturn") {
        const stretched = fractalNoise(u, v, seed + 42, 3.2, 0.35);
        const warp = (stretched - 0.5) * 1.25;
        const broadBand = 0.5 + 0.5 * Math.sin(v * Math.PI * 20 + warp);
        const fineBand = 0.5 + 0.5 * Math.sin(v * Math.PI * 72 + warp * 2);
        const bandValue = broadBand * 0.25 + fineBand * 0.09 + stretched * 0.29 + 0.31;
        color = mixColor([143, 119, 84], [227, 200, 148], bandValue);
        color = mixColor(color, [250, 230, 187], remap(bandValue, 0.64, 0.9) * 0.65);
        surfaceHeight = bandValue * 0.76 + detail * 0.24;
      } else if (planet.slug === "uranus") {
        const stretched = fractalNoise(u, v, seed + 24, 2.4, 0.3);
        const band = 0.5 + 0.5 * Math.sin(v * Math.PI * 20 + (stretched - 0.5) * 0.8);
        const polarGlow = Math.pow(Math.abs(v - 0.5) * 2, 1.7);
        const cloudValue = 0.34 + band * 0.09 + stretched * 0.24 + polarGlow * 0.13;
        color = mixColor([64, 145, 162], [170, 221, 221], cloudValue);
        surfaceHeight = cloudValue * 0.74 + detail * 0.26;
      } else if (planet.slug === "neptune") {
        const stretched = fractalNoise(u, v, seed + 71, 3.7, 0.38);
        const turbulence = (stretched - 0.5) * 2.1;
        const broadBand = 0.5 + 0.5 * Math.sin(v * Math.PI * 18 + turbulence);
        const fineBand = 0.5 + 0.5 * Math.sin(v * Math.PI * 52 + turbulence * 2.2);
        const bandValue = broadBand * 0.26 + fineBand * 0.12 + stretched * 0.45;
        color = mixColor([12, 31, 91], [32, 84, 183], bandValue);
        color = mixColor(color, [82, 145, 232], remap(bandValue, 0.55, 0.9) * 0.72);

        const stormX = wrappedDistance(u, 0.34) / 0.075;
        const stormY = (v - 0.52) / 0.04;
        const stormDistance = Math.sqrt(stormX * stormX + stormY * stormY);
        if (stormDistance < 1) {
          color = mixColor(color, [7, 15, 57], smoothstep(1 - stormDistance) * 0.84);
        }

        const highClouds = remap(stretched + fineBand * 0.22, 0.84, 1.08);
        color = mixColor(color, [172, 205, 244], highClouds * 0.48);
        surfaceHeight = bandValue * 0.7 + stretched * 0.3;
      }

      const index = (y * width + x) * 4;
      colorData[index] = color[0];
      colorData[index + 1] = color[1];
      colorData[index + 2] = color[2];
      colorData[index + 3] = 255;

      const bump = Math.round(THREE.MathUtils.clamp(surfaceHeight, 0, 1) * 255);
      bumpData[index] = bump;
      bumpData[index + 1] = bump;
      bumpData[index + 2] = bump;
      bumpData[index + 3] = 255;
    }
  }

  return {
    colorMap: createDataTexture(colorData, width, height, THREE.SRGBColorSpace),
    bumpMap: createDataTexture(bumpData, width, height, THREE.NoColorSpace),
  };
}

function LocalTextureMaterial({ planet, isGasGiant }: SurfaceMaterialProps) {
  const loadedTexture = useTexture(planet.texture_url);
  const look = PLANET_LOOKS[planet.slug];
  const maxAnisotropy = useThree((state) => state.gl.capabilities.getMaxAnisotropy());
  const texture = useMemo(() => {
    const prepared = loadedTexture.clone();
    prepared.colorSpace = THREE.SRGBColorSpace;
    prepared.wrapS = THREE.RepeatWrapping;
    prepared.wrapT = THREE.ClampToEdgeWrapping;
    prepared.minFilter = THREE.LinearMipmapLinearFilter;
    prepared.magFilter = THREE.LinearFilter;
    prepared.anisotropy = Math.min(8, maxAnisotropy);
    prepared.generateMipmaps = true;
    prepared.needsUpdate = true;
    return prepared;
  }, [loadedTexture, maxAnisotropy]);

  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <meshPhysicalMaterial
      map={texture}
      roughness={look.roughness}
      metalness={0}
      clearcoat={look.clearcoat}
      clearcoatRoughness={look.clearcoatRoughness}
      specularIntensity={isGasGiant ? 0.3 : 0.48}
    />
  );
}

function ProceduralTextureMaterial({ planet, isGasGiant }: SurfaceMaterialProps) {
  const look = PLANET_LOOKS[planet.slug];
  const maps = useMemo(() => createProceduralMaps(planet), [planet]);

  useEffect(
    () => () => {
      maps.colorMap.dispose();
      maps.bumpMap.dispose();
    },
    [maps],
  );

  return (
    <meshPhysicalMaterial
      map={maps.colorMap}
      bumpMap={maps.bumpMap}
      bumpScale={look.bumpScale}
      roughness={look.roughness}
      metalness={0}
      clearcoat={look.clearcoat}
      clearcoatRoughness={look.clearcoatRoughness}
      specularIntensity={isGasGiant ? 0.28 : 0.42}
    />
  );
}

function createCloudTexture() {
  const width = 512;
  const height = 256;
  const data = new Uint8Array(width * height * 4);
  const seed = 421;

  for (let y = 0; y < height; y += 1) {
    const v = y / (height - 1);

    for (let x = 0; x < width; x += 1) {
      const u = x / (width - 1);
      const broadClouds = fractalNoise(u, v, seed, 2.5, 0.72);
      const wisps = fractalNoise(u + broadClouds * 0.035, v, seed + 53, 5.2, 0.6);
      const coverage = remap(broadClouds * 0.58 + wisps * 0.42, 0.52, 0.72);
      const alpha = Math.round(Math.pow(coverage, 1.4) * 205);
      const brightness = Math.round(220 + coverage * 35);
      const index = (y * width + x) * 4;

      data[index] = brightness;
      data[index + 1] = brightness;
      data[index + 2] = Math.min(255, brightness + 5);
      data[index + 3] = alpha;
    }
  }

  return createDataTexture(data, width, height, THREE.SRGBColorSpace);
}

function CloudLayer({ flattening }: { flattening: number }) {
  const cloudRef = useRef<THREE.Mesh>(null);
  const texture = useMemo(() => createCloudTexture(), []);

  useEffect(() => () => texture.dispose(), [texture]);
  useFrame((_, delta) => {
    if (cloudRef.current) {
      cloudRef.current.rotation.y += delta * 0.035;
    }
  });

  return (
    <mesh ref={cloudRef} scale={[1.014, flattening * 1.014, 1.014]} renderOrder={2}>
      <sphereGeometry args={[2.5, 64, 64]} />
      <meshPhysicalMaterial
        map={texture}
        transparent
        opacity={0.72}
        alphaTest={0.025}
        depthWrite={false}
        roughness={0.92}
        metalness={0}
        clearcoat={0.05}
      />
    </mesh>
  );
}

function createAtmosphericDetailTexture(planet: Planet, look: AtmosphericLayerLook) {
  const width = 512;
  const height = 256;
  const data = new Uint8Array(width * height * 4);
  const seed = planet.slug.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) + 761;

  for (let y = 0; y < height; y += 1) {
    const v = y / (height - 1);

    for (let x = 0; x < width; x += 1) {
      const u = x / (width - 1);
      const flow = fractalNoise(u, v, seed, 4.2, 0.34);
      const wisps = fractalNoise(u + (flow - 0.5) * 0.045, v, seed + 83, 6.6, 0.24);
      const bands = 0.5 + 0.5 * Math.sin(v * Math.PI * look.bandFrequency + (flow - 0.5) * 4.5);
      const cloudValue = flow * 0.48 + wisps * 0.34 + bands * 0.18;
      const coverage = remap(cloudValue, look.threshold, look.threshold + 0.19);
      const brightness = 0.84 + coverage * 0.16;
      const index = (y * width + x) * 4;

      data[index] = Math.round(look.color[0] * brightness);
      data[index + 1] = Math.round(look.color[1] * brightness);
      data[index + 2] = Math.round(look.color[2] * brightness);
      data[index + 3] = Math.round(Math.pow(coverage, 1.35) * 165);
    }
  }

  return createDataTexture(data, width, height, THREE.SRGBColorSpace);
}

function AtmosphericDetailLayer({
  planet,
  flattening,
}: {
  planet: Planet;
  flattening: number;
}) {
  const layerRef = useRef<THREE.Mesh>(null);
  const look = ATMOSPHERIC_LAYERS[planet.slug];
  const texture = useMemo(() => createAtmosphericDetailTexture(planet, look), [look, planet]);

  useEffect(() => () => texture.dispose(), [texture]);
  useFrame((_, delta) => {
    if (layerRef.current) {
      layerRef.current.rotation.y += delta * look.speed;
    }
  });

  return (
    <mesh ref={layerRef} scale={[1.009, flattening * 1.009, 1.009]} renderOrder={2}>
      <sphereGeometry args={[2.5, 72, 72]} />
      <meshPhysicalMaterial
        map={texture}
        transparent
        opacity={look.opacity}
        alphaTest={0.003}
        depthWrite={false}
        roughness={0.72}
        metalness={0}
        clearcoat={0.08}
      />
    </mesh>
  );
}

function SaturnRings() {
  const loadedTexture = useTexture("/textures/2k_saturn_ring_alpha.png");
  const maxAnisotropy = useThree((state) => state.gl.capabilities.getMaxAnisotropy());
  const texture = useMemo(() => {
    const preparedTexture = loadedTexture.clone();
    preparedTexture.colorSpace = THREE.SRGBColorSpace;
    preparedTexture.wrapS = THREE.ClampToEdgeWrapping;
    preparedTexture.wrapT = THREE.ClampToEdgeWrapping;
    preparedTexture.minFilter = THREE.LinearMipmapLinearFilter;
    preparedTexture.magFilter = THREE.LinearFilter;
    preparedTexture.anisotropy = Math.min(16, maxAnisotropy);
    preparedTexture.generateMipmaps = true;
    preparedTexture.needsUpdate = true;
    return preparedTexture;
  }, [loadedTexture, maxAnisotropy]);
  const geometry = useMemo(() => {
    const innerRadius = 3;
    const outerRadius = 5.6;
    const ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 512, 1);
    const positions = ringGeometry.attributes.position;
    const uvs = ringGeometry.attributes.uv;

    for (let index = 0; index < positions.count; index += 1) {
      const radius = Math.hypot(positions.getX(index), positions.getY(index));
      const radialUv = (radius - innerRadius) / (outerRadius - innerRadius);
      uvs.setXY(index, radialUv, 0.5);
    }

    uvs.needsUpdate = true;
    return ringGeometry;
  }, []);

  useEffect(
    () => () => {
      texture.dispose();
      geometry.dispose();
    },
    [geometry, texture],
  );

  return (
    <mesh rotation={[Math.PI / 2.65, 0, 0]} renderOrder={1}>
      <primitive attach="geometry" object={geometry} />
      <meshPhysicalMaterial
        map={texture}
        side={THREE.DoubleSide}
        transparent
        alphaTest={0.01}
        depthWrite={false}
        roughness={0.88}
        metalness={0}
        clearcoat={0.04}
      />
    </mesh>
  );
}

const atmosphereVertexShader = `
  varying vec3 vNormal;
  varying vec3 vViewDirection;

  void main() {
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vViewDirection = normalize(-viewPosition.xyz);
    gl_Position = projectionMatrix * viewPosition;
  }
`;

const atmosphereFragmentShader = `
  uniform vec3 glowColor;
  uniform float glowStrength;
  varying vec3 vNormal;
  varying vec3 vViewDirection;

  void main() {
    float rim = 1.0 - max(dot(vNormal, vViewDirection), 0.0);
    float glow = smoothstep(0.28, 1.0, rim);
    glow = pow(glow, 1.65) * glowStrength;
    gl_FragColor = vec4(glowColor, glow);
  }
`;

function Atmosphere({ look }: { look: PlanetLook }) {
  const uniforms = useMemo(
    () => ({
      glowColor: { value: new THREE.Color(look.atmosphereColor) },
      glowStrength: { value: look.atmosphereStrength },
    }),
    [look.atmosphereColor, look.atmosphereStrength],
  );

  return (
    <mesh scale={[1.065, look.flattening * 1.065, 1.065]} renderOrder={3}>
      <sphereGeometry args={[2.5, 64, 64]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={atmosphereVertexShader}
        fragmentShader={atmosphereFragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.FrontSide}
      />
    </mesh>
  );
}

function PlanetSphere({ planet }: { planet: Planet }) {
  const isGasGiant = GAS_GIANTS.includes(planet.slug);
  const surfaceRef = useRef<THREE.Mesh>(null);
  const look = PLANET_LOOKS[planet.slug];

  useFrame((_, delta) => {
    if (surfaceRef.current) {
      surfaceRef.current.rotation.y += delta * (isGasGiant ? 0.055 : 0.035);
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.14} floatIntensity={0.32}>
      <mesh ref={surfaceRef} scale={[1, look.flattening, 1]}>
        <sphereGeometry args={[2.5, 96, 96]} />
        {planet.texture_url ? (
          <LocalTextureMaterial planet={planet} isGasGiant={isGasGiant} />
        ) : (
          <ProceduralTextureMaterial planet={planet} isGasGiant={isGasGiant} />
        )}
      </mesh>

      {planet.slug === "earth" && <CloudLayer flattening={look.flattening} />}
      {ATMOSPHERIC_LAYERS[planet.slug] && (
        <AtmosphericDetailLayer planet={planet} flattening={look.flattening} />
      )}
      {planet.slug === "saturn" && <SaturnRings />}
      <Atmosphere look={look} />
    </Float>
  );
}

export default function VisualColumn({ planet }: { planet: Planet }) {
  const [view3D, setView3D] = useState(true);
  const hasWideRings = planet.slug === "saturn";
  const cameraDistance = hasWideRings ? 16 : 7.5;

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
                key={planet.slug}
                camera={{ position: [0, 0, cameraDistance], fov: 45, near: 0.1, far: 120 }}
                dpr={[1, 1.5]}
                gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
                onCreated={({ gl }) => {
                  gl.toneMapping = THREE.ACESFilmicToneMapping;
                  gl.toneMappingExposure = 1.12;
                  gl.outputColorSpace = THREE.SRGBColorSpace;
                }}
              >
                <ambientLight intensity={0.12} />
                <hemisphereLight args={["#dbe8ff", "#150b24", 0.72]} />
                <directionalLight position={[5, 3.5, 6]} intensity={3.1} color="#fff7e8" />
                <pointLight position={[-4.5, -2, 3]} intensity={13} color={planet.color} />
                
                <Suspense fallback={null}>
                  <PlanetSphere planet={planet} />
                  <Stars radius={40} depth={16} count={700} factor={2.4} saturation={0.18} fade speed={0.45} />
                </Suspense>
                
                <OrbitControls 
                  makeDefault
                  enableZoom
                  enablePan={false}
                  enableDamping
                  dampingFactor={0.06}
                  autoRotate
                  autoRotateSpeed={0.32}
                  minDistance={hasWideRings ? 15 : 4}
                  maxDistance={hasWideRings ? 22 : 10}
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
