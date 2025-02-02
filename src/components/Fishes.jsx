import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useAtom } from "jotai";
import { useEffect, useMemo, useRef, useState } from "react";
import { Vector3, MeshBasicMaterial } from "three";
import { SkeletonUtils } from "three-stdlib";
import { themeAtom, THEMES } from "./UI";

export const Fishes = () => {
  const [theme] = useAtom(themeAtom);
  return (
    <>
      <Fish
        position={new Vector3(0, 0.7, 0)}
        model={THEMES[theme].models[0]}
        animation={"Fish_Armature|Swimming_Fast"}
        speed={0.02} // Adjust speed if needed
        duration={3100} // Fish moves for 2 seconds (2000ms)
      />
    </>
  );
};

const Fish = ({ position, model, animation, speed = 0.02, duration = 3100, ...props }) => {
  const { scene, animations } = useGLTF(`/models/${model}.glb`);
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const group = useRef();
  const { actions } = useAnimations(animations, group);
  const [isMoving, setIsMoving] = useState(true); // Track movement state

  useEffect(() => {
    const wireframeMaterial = new MeshBasicMaterial({ color: "yellow", wireframe: true });

    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.material = wireframeMaterial; // Apply red wireframe material
      }
    });
  }, []);

  useEffect(() => {
    actions[animation]?.play();
    return () => {
      actions[animation]?.stop();
    };
  }, [animation]);

  useEffect(() => {
    // Stop the movement after `duration` milliseconds
    const timer = setTimeout(() => {
      setIsMoving(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  useFrame(() => {
    if (group.current && isMoving) {
      group.current.position.z += speed; // Moves the fish forward while `isMoving` is true
    }
  });

  return (
    <group {...props} ref={group} position={position}>
      <primitive object={clone} rotation-y={Math.PI / 2} />
    </group>
  );
};
