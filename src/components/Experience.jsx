import {
  Center,
  Environment,
  Float,
  MeshTransmissionMaterial,
  OrbitControls,
  SoftShadows,
  Text3D,
} from "@react-three/drei";

import {
  Bloom,
  DepthOfField,
  EffectComposer,
  GodRays,
} from "@react-three/postprocessing";
import { useAtom } from "jotai";
import { useControls } from "leva";
import { useEffect, useState } from "react";
import { DoubleSide } from "three";
import { degToRad } from "three/src/math/MathUtils.js";
import { Boids } from "./Boids";
import { themeAtom, THEMES } from "./UI";
import { Fishes } from "./Fishes";

export const Experience = () => {
  const [theme] = useAtom(themeAtom);

  const boundaries = useControls(
    "Boundaries",
    {
      debug: true,
      x: { value: 12, min: 0, max: 40 },
      y: { value: 8, min: 0, max: 40 },
      z: { value: 20, min: 0, max: 40 },
    },
    { collapsed: true }
  );

  const [size, setSize] = useState([window.innerWidth, window.innerHeight]);
  const scaleX = Math.max(0.5, size[0] / 1920);
  const scaleY = Math.max(0.5, size[1] / 1080);
  const responsiveBoundaries = {
    x: boundaries.x * scaleX,
    y: boundaries.y * scaleY,
    z: boundaries.z,
  };

  useEffect(() => {
    let timeout;
    function updateSize() {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setSize([window.innerWidth, window.innerHeight]);
      }, 50);
    }
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  const [sunRef, setSunRef] = useState();

  const { focusRange, focusDistance, focalLength, bokehScale } = useControls(
    "Depth of field",
    {
      focusRange: { value: 3.5, min: 0, max: 20, step: 0.01 },
      focusDistance: { value: 0.25, min: 0, max: 1, step: 0.01 },
      focalLength: { value: 0.22, min: 0, max: 1, step: 0.01 },
      bokehScale: { value: 5.5, min: 0, max: 10, step: 0.1 },
    },
    {
      collapsed: true,
    }
  );

  return (
    <>
      <OrbitControls />

      <Fishes />

      <Boids boundaries={responsiveBoundaries} />
      <mesh visible={boundaries.debug}>
        <boxGeometry
          args={[
            responsiveBoundaries.x,
            responsiveBoundaries.y,
            responsiveBoundaries.z,
          ]}
        />
        <meshStandardMaterial
          color="black"
          transparent
          opacity={0.5}
          side={DoubleSide}
        />
      </mesh>


      {/* LIGHTS */}
      <SoftShadows size={15} focus={1.5} samples={12} />
      <Environment preset="sunset"></Environment>
      <directionalLight
        position={[15, 15, 15]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
        shadow-camera-far={300}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-camera-near={0.1}
      />
      <hemisphereLight
        intensity={1.35}
        color={THEMES[theme].skyColor}
        groundColor={THEMES[theme].groundColor}
      />
    </>
  );
};
