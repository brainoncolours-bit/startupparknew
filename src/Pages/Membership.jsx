// Components/CardSection.jsx
import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Center, Float, Environment } from "@react-three/drei";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { CheckCircle2, Sparkles } from "lucide-react";
import MembershipSection from "../Pages/Membershipsection";
import CardSection from "../Components/CardSection.jsx";
// or wherever you place the file

// Then in your JSX, between sections:

// 3D Model Controller to handle smooth scroll-driven kinematics
function Scene({ scrollProgress }) {
  const { scene } = useGLTF("/card.glb");
  const modelRef = useRef();

  useFrame(() => {
    if (!modelRef.current) return;

    const currentScroll = scrollProgress.get();

    // Rotates smoothly on its Y-axis as the user scrolls
    modelRef.current.rotation.y = currentScroll * Math.PI * 1.5;

    // Controlled forward tilt that flattens out near the call to action
    modelRef.current.rotation.x =
      Math.sin(currentScroll * Math.PI) * 0.15 + 0.05;

    // Dynamic X-axis shift: keeps it centered early on, shifts slightly left later
    modelRef.current.position.x =
      currentScroll < 0.3 ? 0 : (currentScroll - 0.3) * -0.8;
  });

  return (
    <mesh ref={modelRef}>
      <Center>
        <primitive object={scene} scale={1.4} />
      </Center>
    </mesh>
  );
}

export default function CardSections({ onPreBook }) {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 25,
  });

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

  // Safely manage visibility toggles to avoid dead/invisible click blockers
  const displayStep1 = useTransform(smoothScroll, [0, 0.32], ["flex", "none"]);
  const displayStep2 = useTransform(
    smoothScroll,
    [0.33, 0.85],
    ["grid", "none"],
  );
  const displayStep3 = useTransform(smoothScroll, [0.86, 1], ["flex", "none"]);

  return (
    <>
    <div ref={containerRef} className="relative h-[300vh] bg-black text-white">
      {/* FULL SCREEN STICKY INTEGRATED VIEWPORT */}
      <div className="sticky top-0 h-screen w-full overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center px-6 md:px-16">
        {/* Premium subtle layout lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#141414_1px,transparent_1px)] bg-[size:6rem] opacity-30 pointer-events-none" />

        {/* 3D Render Column */}
        <div className="lg:col-span-5 h-[40vh] lg:h-[60vh] w-full relative z-10">
          <Canvas camera={{ position: [0, 0, 5], fov: 40 }} dpr={[1, 2]}>
            <ambientLight intensity={0.5} />
            <pointLight
              position={[10, 10, 10]}
              intensity={1.2}
              color="#3b82f6"
            />
            <directionalLight
              position={[-5, 5, -2]}
              intensity={0.6}
              color="#6366f1"
            />

            <Suspense fallback={null}>
              <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.3}>
                <Scene scrollProgress={smoothScroll} />
              </Float>
              <Environment preset="studio" />
            </Suspense>
          </Canvas>
        </div>

        {/* Text Content Scrolling Engine - Relative Wrapper */}
        <div className="lg:col-span-7 h-full relative z-20 flex items-center selection:bg-blue-500/30">
          {/* STEP 1: HERO COPY */}
          <motion.div
            style={{
              opacity: useTransform(smoothScroll, [0, 0.25, 0.32], [1, 1, 0]),
              y: useTransform(smoothScroll, [0, 0.25], [0, -30]),
              display: displayStep1,
            }}
            className="absolute max-w-xl flex-col space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 text-xs font-mono tracking-wider w-fit">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" /> xLimited
              Edition
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-100 leading-tight">
              The Next Gen <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-100 to-neutral-400">
                Founder Card
              </span>
            </h1>
            <p className="text-neutral-400 text-base leading-relaxed font-normal">
              It unlocks the Startup Park ecosystem. With this card, a founder
              gets access to premium utilities designed to scale ideas into
              empires.
            </p>
          </motion.div>

          {/* STEP 2: CORE BENEFITS GRID */}
          <motion.div
            style={{
              opacity: useTransform(
                smoothScroll,
                [0.35, 0.42, 0.78, 0.85],
                [0, 1, 1, 0],
              ),
              y: useTransform(smoothScroll, [0.35, 0.42, 0.78], [30, 0, -30]),
              display: displayStep2,
            }}
            className="absolute max-w-2xl w-full grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4"
          >
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
          </motion.div>

          {/* STEP 3: PRE-BOOK CALL TO ACTION */}
          <motion.div
            style={{
              opacity: useTransform(smoothScroll, [0.85, 0.92], [0, 1]),
              y: useTransform(smoothScroll, [0.85, 0.92], [30, 0]),
              display: displayStep3,
            }}
            className="absolute max-w-md flex-col space-y-5"
          >
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Secure Your Founder Allocation
              </h2>
              <p className="text-xs text-neutral-500 leading-relaxed font-mono">
                Deploy infrastructure adjustments, prioritize ecosystem node
                mapping, and unlock priority processing queues instantly.
              </p>
            </div>

            <button
              onClick={onPreBook}
              className="relative group w-full sm:w-auto px-8 py-3.5 bg-white text-black font-semibold tracking-wider text-xs uppercase rounded-md transition-all duration-300 hover:bg-blue-600 hover:text-white shadow-[0_0_30px_rgba(255,255,255,0.05)] overflow-hidden"
            >
              Pre-book Now
            </button>
          </motion.div>
        </div>
      </div>
    </div>
      <MembershipSection />
      <CardSection />
      </>
  );
}

useGLTF.preload("/card.glb");
