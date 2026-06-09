import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Center, Float, Environment } from "@react-three/drei";
import { CheckCircle2, Sparkles } from "lucide-react";
import CardSection from "../Components/CardSection.jsx";

function RotatingCard() {
  const { scene } = useGLTF("/card.glb");
  const meshRef = useRef();

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <mesh ref={meshRef}>
      <Center>
        <primitive object={scene} scale={1.4} />
      </Center>
    </mesh>
  );
}

const benefits = [
  "1 seat for 1 month at Startup Park",
  "Startup research and market intelligence",
  "Legal and compliance guidance",
  "Branding and personal branding benefits",
  "Media and advertising support",
  "Incubation workshop access",
  "Founder community membership",
  "Startup tools and software offers",
  "Skill and career support",
  "HR training",
];

export default function CardSections({ onPreBook }) {
  return (
    <>
      <section className="relative min-h-screen bg-black text-white flex items-center px-6 md:px-16 py-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#141414_1px,transparent_1px)] bg-[size:6rem] opacity-30 pointer-events-none" />

        <div className="relative w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 h-[40vh] lg:h-[60vh] w-full">
            <Canvas
              camera={{ position: [0, 0, 5], fov: 40 }}
              dpr={[1, 1.25]}
              gl={{
                antialias: false,
                powerPreference: "high-performance",
              }}
            >
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={1.2} color="#3b82f6" />
              <directionalLight position={[-5, 5, -2]} intensity={0.6} color="#6366f1" />
              <Suspense fallback={null}>
                <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.3}>
                  <RotatingCard />
                </Float>
                <Environment preset="studio" />
              </Suspense>
            </Canvas>
          </div>

          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-100 leading-tight">
                The Next Gen <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-100 to-neutral-400">
                  Founder Card
                </span>
              </h1>
              <p className="text-neutral-400 text-base leading-relaxed font-normal max-w-xl">
                It unlocks the Startup Park ecosystem. With this card, a founder
                gets access to premium utilities designed to scale ideas into
                empires.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {benefits.map((benefit, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 border border-neutral-900 bg-neutral-950/40 p-3 rounded-lg backdrop-blur-sm"
                >
                  <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <span className="text-xs md:text-sm text-neutral-300 font-medium leading-normal">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={onPreBook}
              className="px-8 py-3.5 bg-white text-black font-semibold tracking-wider text-xs uppercase rounded-md transition-all duration-300 hover:bg-blue-600 hover:text-white shadow-[0_0_30px_rgba(255,255,255,0.05)]"
            >
              Pre-book Now
            </button>
          </div>
        </div>
      </section>

      {/* <CardSection /> */}
    </>
  );
}

useGLTF.preload("/card.glb");
