import React, {
  useLayoutEffect,
  useRef,
  Suspense,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  PerspectiveCamera,
  Environment,
  PresentationControls,
} from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import heroVideo from "../assets/hero-video.mp4";
import PreBookModal from "../Components/Modals/PreBookModal";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });
useGLTF.preload("/card.glb");
useGLTF.preload("/card.glb");

function pseudoRandom(index, salt = 0) {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

// --- Scattered Cards Component ---
function ScatteredCards({ sectionRef }) {
  const { scene: cardScene } = useGLTF("/card.glb");
  const meshRef = useRef();
  const rotationStateRef = useRef([]);
  const cardCount = 24;
  const tempObject = useMemo(() => new THREE.Object3D(), []);

  const cardGeometry = useMemo(() => {
    let geo = null;
    cardScene.traverse((child) => {
      if (child.isMesh && !geo) geo = child.geometry;
    });
    return geo;
  }, [cardScene]);

  const cardMaterial = useMemo(() => {
    let mat = null;
    cardScene.traverse((child) => {
      if (child.isMesh && !mat) mat = child.material;
    });
    return mat;
  }, [cardScene]);

  const scatterData = useMemo(() => {
    return Array.from({ length: cardCount }).map((_, index) => ({
      x: 0,
      y: -2,
      z: -15,
      rotX: 0,
      rotY: 0,
      rotZ: 0,
      targetX: (pseudoRandom(index, 1) - 0.5) * 45,
      targetY: (pseudoRandom(index, 2) - 0.5) * 30,
      targetZ: (pseudoRandom(index, 3) - 0.5) * 20 - 5,
      targetRotX: pseudoRandom(index, 4) * Math.PI * 2,
      targetRotY: pseudoRandom(index, 5) * Math.PI * 2,
      targetRotZ: pseudoRandom(index, 6) * Math.PI * 2,
      driftSpeed: pseudoRandom(index, 7) * 0.4 + 0.1,
      rotSpeedX: (pseudoRandom(index, 8) - 0.5) * 0.015,
      rotSpeedY: (pseudoRandom(index, 9) - 0.5) * 0.015,
    }));
  }, [cardCount]);

  useLayoutEffect(() => {
    if (!meshRef.current) return;
    rotationStateRef.current = scatterData.map((data) => ({
      rotX: data.rotX,
      rotY: data.rotY,
      rotZ: data.rotZ,
    }));

    const ctx = gsap.context(() => {
      const entranceTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 90%",
          toggleActions: "play none none none",
          refreshPriority: 1,
        },
      });

      scatterData.forEach((data, index) => {
        entranceTl.to(
          data,
          {
            x: data.targetX,
            y: data.targetY,
            z: data.targetZ,
            rotX: data.targetRotX,
            rotY: data.targetRotY,
            rotZ: data.targetRotZ,
            duration: 1.5,
            ease: "expo.out",
          },
          index * 0.02,
        );
      });

      gsap.to(meshRef.current.position, {
        y: 4,
        z: 3,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.5,
          refreshPriority: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [scatterData, sectionRef]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    for (let i = 0; i < cardCount; i++) {
      const data = scatterData[i];
      const rotationState = rotationStateRef.current[i];
      rotationState.rotX += data.rotSpeedX;
      rotationState.rotY += data.rotSpeedY;
      tempObject.position.set(
        data.x,
        data.y + Math.sin(time * data.driftSpeed + i) * 1.2,
        data.z,
      );
      tempObject.rotation.set(
        rotationState.rotX,
        rotationState.rotY,
        rotationState.rotZ,
      );
      tempObject.scale.set(0.12, 0.12, 0.12);
      tempObject.updateMatrix();
      meshRef.current.setMatrixAt(i, tempObject.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <instancedMesh
        ref={meshRef}
        args={[cardGeometry, cardMaterial, cardCount]}
      />
    </group>
  );
}

// --- Interactive Card Ring ---
function InteractiveCard({ cardRef }) {
  const { scene } = useGLTF("/card.glb");
  const meshRef = useRef();
  const tempObject = useMemo(() => new THREE.Object3D(), []);
  const cardCount = 14;
  const ringRadius = 3.8;

  const cardGeometry = useMemo(() => {
    let geo = null;
    scene.traverse((child) => {
      if (child.isMesh && !geo) geo = child.geometry;
    });
    return geo;
  }, [scene]);

  const cardMaterial = useMemo(() => {
    let mat = null;
    scene.traverse((child) => {
      if (child.isMesh && !mat) mat = child.material;
    });
    return mat;
  }, [scene]);

  useLayoutEffect(() => {
    if (!meshRef.current || !cardGeometry) return;
    for (let i = 0; i < cardCount; i++) {
      const angle = (i / cardCount) * Math.PI * 2;
      tempObject.position.set(
        Math.cos(angle) * ringRadius,
        Math.sin(angle) * ringRadius,
        0,
      );
      tempObject.rotation.set(0, angle + Math.PI / 2, Math.PI / 2);
      tempObject.scale.set(0.32, 0.32, 0.32);
      tempObject.updateMatrix();
      meshRef.current.setMatrixAt(i, tempObject.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [cardGeometry, tempObject]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.z += delta * 0.1;
    }
  });

  if (!cardGeometry) return null;

  return (
    <group ref={cardRef} position={[5.5, 0, 0]} scale={[0, 0, 0]}>
      <PresentationControls
        global={false}
        cursor={true}
        snap={true}
        speed={1}
        zoom={1}
        polar={[-Math.PI / 10, Math.PI / 10]}
        azimuth={[-Math.PI / 10, Math.PI / 10]}
      >
        <instancedMesh
          ref={meshRef}
          args={[cardGeometry, cardMaterial, cardCount]}
        />
      </PresentationControls>
    </group>
  );
}

function PhoneCluster({ scrollTriggerRef, insideTextRef }) {
  const { scene } = useGLTF("/card.glb");
  const clusterRef = useRef();
  const phoneRefs = useRef([]);
  const cardRef = useRef();
  const createPhone = () => scene.clone();

  useLayoutEffect(() => {
    if (!clusterRef.current) return;
    const phones = phoneRefs.current.filter(Boolean);
    const radius = 4.8;
    const angles = phones.map(
      (_, index) => ((index - 2) / 5) * Math.PI * 2 + Math.PI / 2,
    );

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scrollTriggerRef.current,
        start: "top top",
        end: "+=4500",
        scrub: 0.5,
        pin: true,
        pinSpacing: true,
        invalidateOnRefresh: true,
        refreshPriority: 10,
      },
    });

    ScrollTrigger.refresh();

    // 1. Initial Scale (Main center card)
    gsap.set(phones[2].scale, { x: 4, y: 4, z: 4 });
    gsap.set(phones[2].position, { x: 0, y: 0, z: radius });

    phones.forEach((phone, index) => {
      if (index !== 2) {
        gsap.set(phone.scale, { x: 0, y: 0, z: 0 });
        gsap.set(phone.position, { x: 0, y: 0, z: radius - 0.5 });
      }
    });

    phones.forEach((phone, index) => {
      // 2. Cluster Scale (When they form the ring)
      tl.to(phone.scale, { x: 2, y: 2, z: 2, duration: 1 }, 0);
      tl.to(
        phone.position,
        {
          x: Math.cos(angles[index]) * radius,
          z: Math.sin(angles[index]) * radius,
          duration: 1.5,
        },
        0.2,
      );
    });

    tl.to(
      clusterRef.current.rotation,
      { y: Math.PI * 2, duration: 4, ease: "power1.inOut" },
      1.5,
    );

    tl.to(phones[2].position, { x: 0, z: radius, duration: 1.5 }, 5.5);
    phones.forEach((phone, index) => {
      if (index !== 2)
        tl.to(phone.position, { x: 0, z: radius - 1.5, duration: 1.5 }, 5.5);
    });

    tl.to(phones[2].position, { z: 25, duration: 2, ease: "expo.in" }, 7.0);
    // 3. Zoom Scale (When it zooms into the camera)
    tl.to(
      phones[2].scale,
      { x: 250, y: 250, z: 250, duration: 2, ease: "expo.in" },
      7.0,
    );
    phones.forEach((phone, index) => {
      if (index !== 2)
        tl.to(phone.scale, { x: 0, y: 0, z: 0, duration: 0.5 }, 7.0);
    });

    tl.to(
      cardRef.current.scale,
      { x: 1, y: 1, z: 1, duration: 1.5, ease: "back.out(1.2)" },
      8.5,
    );
    if (insideTextRef?.current) {
      tl.to(insideTextRef.current, { autoAlpha: 1, y: 0, duration: 1 }, 8.5);
    }

    tl.to(
      cardRef.current.position,
      { x: 0, z: 25, duration: 2.5, ease: "power2.in" },
      10.0,
    );
    tl.to(
      cardRef.current.scale,
      { x: 4, y: 4, z: 4, duration: 2.5, ease: "power2.in" },
      10.0,
    );
    if (insideTextRef?.current) {
      tl.to(
        insideTextRef.current,
        { autoAlpha: 0, y: -40, duration: 1.5 },
        10.0,
      );
    }

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
    };
  }, [scene, scrollTriggerRef, insideTextRef]);

  return (
    <group position={[0, -1, 0]}>
      <group ref={clusterRef}>
        {Array.from({ length: 5 }, (_, index) => (
          <group
            key={index}
            ref={(node) => {
              phoneRefs.current[index] = node;
            }}
          >
            <primitive object={createPhone()} />
          </group>
        ))}
      </group>
      <InteractiveCard cardRef={cardRef} />
    </group>
  );
}

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const storySectionRef = useRef(null);
  const textContainerRef = useRef(null);
  const phoneSectionRef = useRef(null);
  const scatterSectionRef = useRef(null);
  const scatterTextRef = useRef(null);
  const featureSectionRef = useRef(null);
  const featureHeaderRef = useRef(null);
  const featureRowsRef = useRef([]);
  const heroVideoRef = useRef(null);
  const insideTextRef = useRef(null);

  // Updated text to reflect Startup Park's "Who We Are" copy
  const storyText =
    "Startup Park is the world's first comprehensive ecosystem designed exclusively for entrepreneurs. we bridge the gap between ambitious ideas and market-ready solutions through integrated resources, strategic mentorship, and a thriving community of innovators. from ideation to IPO, we're your trusted partner in building the future.";

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const words = textContainerRef.current.querySelectorAll(".word");
      gsap.to(words, {
        color: "white",
        stagger: 0.1,
        scrollTrigger: {
          trigger: storySectionRef.current,
          start: "top 30%",
          end: "bottom 80%",
          scrub: 0.5,
          refreshPriority: 0,
        },
      });
    });
    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    if (!scatterTextRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        scatterTextRef.current,
        { autoAlpha: 0, y: 40, scale: 0.96 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: scatterSectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
            refreshPriority: 0,
          },
        },
      );
    }, scatterSectionRef);

    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    if (!featureSectionRef.current) return;

    const ctx = gsap.context(() => {
      const rows = featureRowsRef.current.filter(Boolean);
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: featureSectionRef.current,
          start: "top 78%",
          toggleActions: "play none none reverse",
          refreshPriority: 0,
        },
      });

      tl.fromTo(
        featureHeaderRef.current,
        { autoAlpha: 0, y: 18, letterSpacing: "0.55em" },
        {
          autoAlpha: 1,
          y: 0,
          letterSpacing: "0.42em",
          duration: 0.7,
          ease: "power3.out",
        },
      );

      rows.forEach((row, index) => {
        const content = row.querySelector(".row-content");
        const line = row.querySelector(".row-line");

        tl.fromTo(
          content,
          { y: 120, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 1.1, ease: "power4.out" },
          index === 0 ? ">-0.4" : "-=0.9",
        ).fromTo(
          line,
          { scaleX: 0 },
          { scaleX: 1, duration: 1.3, ease: "expo.out" },
          "<0.2",
        );
      });
    }, featureSectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (heroVideoRef.current) {
      heroVideoRef.current.playbackRate = 0.5;
      heroVideoRef.current.play().catch(() => {});
    }
    ScrollTrigger.refresh();
  }, []);

  return (
    <main className="w-full bg-black">
      {/* Header Navigation added into layout flow contextually */}

      <section className="relative min-h-screen w-full overflow-hidden text-white">
        <div className="absolute inset-0">
          <video
            ref={heroVideoRef}
            className="h-full w-full object-cover"
            src={heroVideo}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
        </div>
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-5 text-center">
          <span className="mb-4 text-xs font-bold tracking-[0.3em] uppercase text-white/60 bg-white/5 px-4 py-1.5 rounded-full backdrop-blur-sm">
            Startup Park is Now Open
          </span>
          <h1 className="mx-auto max-w-[14ch] text-[clamp(3.5rem,7.5vw,7.5rem)] font-semibold leading-[0.92] tracking-[-0.05em] font-serif uppercase">
            India’s Launchpad
            <br />
            for Founders
          </h1>
          <p className="mt-8 text-[clamp(1rem,1.8vw,1.4rem)] tracking-[0.2em] uppercase font-light text-white/70">
            Innovate <span className="text-white/40">→</span> Accelerate{" "}
            <span className="text-white/40">→</span> Succeed
          </p>
          <p className="mt-4 max-w-[50ch] text-sm text-gray-400">
            Explore, connect, and grow with the next generation of innovators.
            <br />
            The future of startup innovation has officially begun ✨
          </p>
        </div>
      </section>

      <section
        ref={storySectionRef}
        className="relative min-h-screen bg-black text-white flex items-center"
      >
        <div className="w-full px-6 sm:px-10 lg:px-24">
          <div ref={textContainerRef} className="mx-auto max-w-[1100px]">
            <p className="text-center font-serif text-[clamp(2.1rem,4.5vw,4.5rem)] leading-[1.4] text-[#4a5160]">

              {storyText.split(" ").map((word, index) => (
                <span key={index} className="word inline-block mr-[0.25em]">
                  {word}
                </span>
              ))}
            </p>
          </div>
        </div>
      </section>

      <section
        ref={phoneSectionRef}
        className="relative h-screen bg-black overflow-hidden"
      >
        <div className="h-full w-full">
          <Canvas
            dpr={[1, 1.25]}
            gl={{
              antialias: false,
              powerPreference: "high-performance",
              alpha: false,
            }}
          >
            <PerspectiveCamera makeDefault position={[0, 0, 18]} fov={35} />
            <ambientLight intensity={1.8} />
            <Environment preset="city" />
            <Suspense fallback={null}>
              <PhoneCluster
                scrollTriggerRef={phoneSectionRef}
                insideTextRef={insideTextRef}
              />
            </Suspense>
          </Canvas>
        </div>
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center">
          <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24">
            <div
              ref={insideTextRef}
              className="max-w-[550px]"
              style={{ opacity: 0, transform: "translateY(40px)" }}
            >
              <h2 className="font-serif text-[clamp(2.5rem,5vw,5rem)] font-semibold leading-[1.1] text-white mb-6 uppercase">
                A world-class
                <br />
                ecosystem
              </h2>
              <p className="text-gray-400 text-[1.05rem] leading-relaxed max-w-[480px]">
                Designed exclusively to help founders scale faster. We empower
                builders with premium infrastructure, cross-functional
                innovation frameworks, and immediate access to capital pathways
                from idea to IPO.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        ref={scatterSectionRef}
        className="relative h-screen w-full bg-black flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 z-0 h-full w-full">
          <Canvas
            dpr={[1, 1.25]}
            gl={{
              antialias: false,
              powerPreference: "high-performance",
              alpha: false,
            }}
          >
            <PerspectiveCamera makeDefault position={[0, 0, 20]} fov={40} />
            <ambientLight intensity={1.5} />
            <Environment preset="city" />
            <Suspense fallback={null}>
              <ScatteredCards sectionRef={scatterSectionRef} />
            </Suspense>
          </Canvas>
        </div>

        <div
          ref={scatterTextRef}
          className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl group cursor-default"
          style={{ opacity: 0 }}
        >
          <div className="mb-10 transition-opacity duration-700 ease-out opacity-20 group-hover:opacity-100">
            <svg
              width="60"
              height="70"
              viewBox="0 0 60 70"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M30 0L5 10V30C5 45.42 15.67 59.7 30 65C44.33 59.7 55 45.42 55 30V10L30 0Z"
                stroke="white"
                strokeWidth="2"
              />
              <rect
                x="22"
                y="32"
                width="16"
                height="12"
                rx="2"
                stroke="white"
                strokeWidth="2"
              />
              <path
                d="M26 32V28C26 25.7909 27.7909 24 30 24C32.2091 24 34 25.7909 34 28V32"
                stroke="white"
                strokeWidth="2"
              />
            </svg>
          </div>

          <h3 className="text-white text-[clamp(0.8rem,2vw,1.1rem)] tracking-[0.4em] font-bold uppercase mb-12 transition-opacity duration-700 ease-out opacity-20 group-hover:opacity-100">
            Our Foundation & Driven Impact
          </h3>

          <p className="text-[clamp(1.8rem,4vw,3.5rem)] leading-[1.3] text-white transition-opacity duration-1000 ease-in-out font-light opacity-20 group-hover:opacity-100">
            Powering bold choices with over{" "}
            <span className="font-semibold">200+ startups supported</span>,
            helping networks unlock{" "}
            <span className="font-semibold">₹600 Cr+ in accessed funding</span>,
            and enabling over{" "}
            <span className="font-semibold">10,000+ new jobs</span> across
            competitive tech markets.
          </p>
        </div>
      </section>

      {/* RETAINED ANIMATED FEATURE GRID (Why Startup Park Framework) */}
      <section
        ref={featureSectionRef}
        className="relative overflow-hidden bg-black text-white"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_50%)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-24 sm:px-10 sm:py-28 lg:px-16 lg:py-32">
          <div className="mb-20 flex items-center gap-6">
            <span className="h-[1px] flex-1 bg-white/10" />
            <span
              ref={featureHeaderRef}
              className="text-[0.7rem] font-bold tracking-[0.5em] uppercase text-white/40"
            >
              Why Startup Park
            </span>
            <span className="h-[1px] flex-1 bg-white/10" />
          </div>

          <div className="flex flex-col">
            {[
              {
                id: 0,
                title: "spaces",
                desc: "Premium tech-enabled co-working zones, innovation prototyping labs, and media-ready demo stages.",
                icon: (
                  <path
                    d="M22 70L62 30 M62 30H45 M62 30V47"
                    stroke="white"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                ),
              },
              {
                id: 1,
                title: "growth",
                desc: "Structured incubator roadmaps, milestone-driven acceleration tracks, and elite masterclasses.",
                icon: (
                  <path
                    d="M30 35H62V69H30V35Z M38 35V26C38 19.3726 43.3726 14 50 14C56.6274 14 62 19.3726 62 26V35"
                    stroke="white"
                    strokeWidth="5"
                  />
                ),
              },
              {
                id: 2,
                title: "support",
                desc: "Direct 1:1 access to veteran multi-exit mentors alongside full legal, governance, and cap-table help.",
                icon: (
                  <path
                    d="M20 24h18v44H20z M54 24h18v44H54z M46 18v56"
                    stroke="white"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray="4 4"
                  />
                ),
              },
            ].map((item, i) => (
              <div
                key={i}
                ref={(node) => {
                  featureRowsRef.current[i] = node;
                }}
                className="relative overflow-hidden group"
              >
                <div className="row-content grid gap-10 py-16 md:grid-cols-[1fr_auto] md:items-center">
                  <div className="max-w-xl">
                    <h3 className="font-sans text-[clamp(3.5rem,7vw,6rem)] font-bold italic leading-[0.85] tracking-[-0.07em] uppercase transition-colors duration-500 group-hover:text-white text-white/90">
                      {item.title}
                    </h3>
                    <p className="mt-8 max-w-[32ch] text-[clamp(1.1rem,1.5vw,1.35rem)] leading-[1.6] text-white/50 font-medium">
                      {item.desc}
                    </p>
                  </div>
                  <div className="flex justify-start md:justify-end opacity-40 group-hover:opacity-100 transition-opacity duration-500">
                    <svg
                      width="100"
                      height="100"
                      viewBox="0 0 92 92"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {item.icon}
                    </svg>
                  </div>
                </div>
                <div className="row-line absolute bottom-0 left-0 h-[1px] w-full bg-white/20 origin-left" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exclusive Card Section */}
      <section className="relative overflow-hidden bg-white py-24 text-black">
        <div className="absolute left-0 top-0 h-full w-1/2 bg-[#f8f8f8]" />
        <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-16 px-6 lg:flex-row lg:px-12">
          <div className="flex-1 space-y-8">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-black/40">
              Limited Edition
            </span>
            <h2 className="font-serif text-[clamp(2.5rem,5vw,5rem)] font-bold leading-[1.1] uppercase tracking-tighter">
              The Next Gen
              <br />
              Founder Card
            </h2>
            <p className="max-w-[40ch] text-lg leading-relaxed text-black/60 font-medium">
              Experience the future of entrepreneurial finance. One card for
              your entire ecosystem.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="group relative flex items-center gap-4 rounded-full bg-black px-8 py-4 text-xs font-bold uppercase tracking-[0.3em] text-white transition-all hover:pr-12"
            >
              Pre-book Now
              <span className="absolute right-6 opacity-0 transition-all group-hover:opacity-100 group-hover:right-8">
                →
              </span>
            </button>
          </div>
          <div className="relative flex-1">
            <div className="aspect-[4/3] w-full overflow-hidden rounded-[2rem] bg-black/5 shadow-2xl">
              <img
                src="/bg.jpg"
                alt="Premium Card"
                className="h-full w-full object-cover opacity-80"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Structured Lead Capture, Featured Events, and Global Footer Elements */}
      <section
        id="register"
        className="relative bg-black text-white py-20 px-6 sm:px-10 lg:px-24 border-t border-white/5"
      >
        <div className="max-w-6xl mx-auto grid gap-16 lg:grid-cols-2 items-start">
          <div>
            <span className="text-xs font-bold tracking-widest text-white/40 uppercase block mb-3">
              Featured Event
            </span>
            <h4 className="text-2xl sm:text-3xl font-serif font-medium mb-4">
              7-Day Startup Expo 2025 — Bangalore
            </h4>
            <p className="text-gray-400 mb-6 leading-relaxed max-w-md">
              Explore recent funding startups, meet top-tier institutional
              investors, and discover the absolute future of deep tech
              solutions.
            </p>
            <button className="px-6 py-3 border border-white text-sm uppercase tracking-wider font-semibold hover:bg-white hover:text-black transition-all">
              Reserve Your Spot
            </button>
          </div>

          <div className="bg-white/5 p-8 rounded-xl backdrop-blur-md border border-white/10">
            <h4 className="text-xl font-serif font-semibold mb-2">
              Ready to Transform Your Startup?
            </h4>
            <p className="text-xs text-gray-400 mb-6">
              Join the world's most comprehensive startup ecosystem and
              accelerate your journey from idea to IPO.
            </p>

            <form onSubmit={(e) => e.preventDefault()} className="grid gap-4">
              <input
                type="text"
                placeholder="Full Name *"
                required
                className="w-full bg-black/40 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white/40 transition-colors"
              />
              <input
                type="tel"
                placeholder="Phone Number *"
                required
                className="w-full bg-black/40 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white/40 transition-colors"
              />
              <input
                type="email"
                placeholder="Email Address *"
                required
                className="w-full bg-black/40 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white/40 transition-colors"
              />
              <input
                type="text"
                placeholder="Company Name *"
                required
                className="w-full bg-black/40 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white/40 transition-colors"
              />
              <textarea
                placeholder="Tell us about your startup"
                rows="3"
                className="w-full bg-black/40 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white/40 transition-colors resize-none"
              ></textarea>

              <button
                type="submit"
                className="w-full bg-white text-black py-3 text-sm font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors mt-2"
              >
                Schedule Strategy Session
              </button>
            </form>
            <span className="text-[10px] text-gray-500 block text-center mt-3">
              We'll respond within 24 hours to schedule your personalized
              consultation
            </span>
          </div>
        </div>
      </section>

      <footer className="bg-black text-gray-500 py-12 px-6 sm:px-10 lg:px-24 border-t border-white/5 text-xs tracking-wide">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="text-center sm:text-left space-y-1">
            <p className="text-white/80 font-medium">
              Bengaluru, Karnataka, India
            </p>
            <p className="hover:text-white transition-colors">
              <a href="mailto:contact@thestartuppark.com">
                contact@thestartuppark.com
              </a>
            </p>
          </div>
          <div className="text-center sm:text-right space-y-1">
            <p>© 2026 Startup Park. All rights reserved.</p>
            <p>
              Crafted with 🤍 by{" "}
              <span className="text-white/40 hover:text-white/80 transition-colors cursor-pointer">
                ique-ventures
              </span>
            </p>
          </div>
        </div>
      </footer>
      <PreBookModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}
