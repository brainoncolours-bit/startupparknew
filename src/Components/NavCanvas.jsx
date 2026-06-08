import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

const navItems = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Gallary", to: "/blogs" },
  { label: "Membership", to: "/membership" },
  { label: "Coworking", to: "/coworking" },
  { label: "Contact", to: "/contact" },
];

function ActiveLight({ activeIndex }) {
  const meshRef = useRef();
  const xPos = (activeIndex - (navItems.length - 1) / 2) * 1.6;

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.x = THREE.MathUtils.lerp(
        meshRef.current.position.x,
        xPos,
        0.1
      );
    }
  });

  return (
    <Float speed={4} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <sphereGeometry args={[0.5, 24, 24]} />
        <MeshDistortMaterial
          color="#ffffff"
          speed={2}
          distort={0.25}
          radius={1}
          emissive="#ffffff"
          emissiveIntensity={0.35}
          transparent
          opacity={0.12}
        />
      </mesh>
    </Float>
  );
}

export default function NavCanvas({ activeIndex }) {
  return (
    <Canvas dpr={0.75} camera={{ position: [0, 0, 5], fov: 26 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <Suspense fallback={null}>
        <ActiveLight activeIndex={activeIndex} />
      </Suspense>
    </Canvas>
  );
}
