import React, { useLayoutEffect, useRef, Suspense, useEffect, useMemo, useState, useCallback } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, PerspectiveCamera, Environment, PresentationControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import heroVideo from "/cover.mp4";
import PreBookModal from "../Components/Modals/PreBookModal";
import Gallery from "../Components/Gallery";
import { useNavigate } from "react-router-dom";
import ecosystemImg from "/gallery1.png";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });
useGLTF.preload("/card.glb");

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function refreshAfterLayout() {
  const ids = [];
  ids.push(window.requestAnimationFrame(() =>
    ids.push(window.requestAnimationFrame(() => { window.__lenis?.resize?.(); ScrollTrigger.refresh(); }))
  ));
  return () => ids.forEach((id) => window.cancelAnimationFrame(id));
}

function pseudoRandom(index, salt = 0) {
  const v = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return v - Math.floor(v);
}

// Shared traverse helper — avoids duplicating the pattern in every component
function useGLTFMesh(scene) {
  return useMemo(() => {
    let geo = null, mat = null;
    scene.traverse((child) => {
      if (child.isMesh) { if (!geo) geo = child.geometry; if (!mat) mat = child.material; }
    });
    return { geo, mat };
  }, [scene]);
}

// ─── DATA ─────────────────────────────────────────────────────────────────────
const FEATURE_ROWS = [
  {
    title: "spaces",
    desc: "Premium tech-enabled co-working zones, innovation prototyping labs, and media-ready demo stages.",
    route: "/coworking",
    icon: <path d="M22 70L62 30 M62 30H45 M62 30V47" stroke="white" strokeWidth="5" strokeLinecap="round" />,
  },
  {
    title: "growth",
    desc: "Structured incubator roadmaps, milestone-driven acceleration tracks, and elite masterclasses.",
    route: "services/",
    icon: <path d="M30 35H62V69H30V35Z M38 35V26C38 19.3726 43.3726 14 50 14C56.6274 14 62 19.3726 62 26V35" stroke="white" strokeWidth="5" />,
  },
  {
    title: "support",
    desc: "Direct 1:1 access to veteran multi-exit mentors alongside full legal, governance, and cap-table help.",
    route: "/contact",
    icon: <path d="M20 24h18v44H20z M54 24h18v44H54z M46 18v56" stroke="white" strokeWidth="5" strokeLinecap="round" strokeDasharray="4 4" />,
  },
];

const FORM_FIELDS = [
  { type: "text",  placeholder: "Full Name *",     required: true },
  { type: "tel",   placeholder: "Phone Number *",  required: true },
  { type: "email", placeholder: "Email Address *", required: true },
  { type: "text",  placeholder: "Company Name *",  required: true },
];

const inputCls = "w-full bg-black/40 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white/40 transition-colors";

const STORY_TEXT = "Startup Park is the world's first comprehensive ecosystem designed exclusively for entrepreneurs. we bridge the gap between ambitious ideas and market-ready solutions through integrated resources, strategic mentorship, and a thriving community of innovators. from ideation to IPO, we're your trusted partner in building the future.";

// ─── SCATTERED CARDS ──────────────────────────────────────────────────────────
function ScatteredCards({ sectionRef, onReady }) {
  const { scene } = useGLTF("/card.glb");
  const { geo: cardGeometry, mat: cardMaterial } = useGLTFMesh(scene);
  const meshRef = useRef();
  const rotationStateRef = useRef([]);
  const cardCount = 24;
  const tempObject = useMemo(() => new THREE.Object3D(), []);

  const scatterData = useMemo(() => Array.from({ length: cardCount }).map((_, i) => ({
    x: 0, y: -2, z: -15, rotX: 0, rotY: 0, rotZ: 0,
    targetX: (pseudoRandom(i, 1) - 0.5) * 45,
    targetY: (pseudoRandom(i, 2) - 0.5) * 30,
    targetZ: (pseudoRandom(i, 3) - 0.5) * 20 - 5,
    targetRotX: pseudoRandom(i, 4) * Math.PI * 2,
    targetRotY: pseudoRandom(i, 5) * Math.PI * 2,
    targetRotZ: pseudoRandom(i, 6) * Math.PI * 2,
    driftSpeed: pseudoRandom(i, 7) * 0.4 + 0.1,
    rotSpeedX: (pseudoRandom(i, 8) - 0.5) * 0.015,
    rotSpeedY: (pseudoRandom(i, 9) - 0.5) * 0.015,
  })), []);

  useLayoutEffect(() => {
    if (!meshRef.current) return;
    rotationStateRef.current = scatterData.map((d) => ({ rotX: d.rotX, rotY: d.rotY, rotZ: d.rotZ }));
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: sectionRef.current, start: "top 90%", toggleActions: "play none none none", refreshPriority: 1 } });
      scatterData.forEach((d, i) => tl.to(d, { x: d.targetX, y: d.targetY, z: d.targetZ, rotX: d.targetRotX, rotY: d.targetRotY, rotZ: d.targetRotZ, duration: 1.5, ease: "expo.out" }, i * 0.02));
      gsap.to(meshRef.current.position, { y: 4, z: 3, ease: "none", scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 0.5, refreshPriority: 1 } });
    }, sectionRef);
    onReady?.();
    return () => ctx.revert();
  }, [scatterData, sectionRef, onReady]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const time = clock.getElapsedTime();
    for (let i = 0; i < cardCount; i++) {
      const d = scatterData[i], rs = rotationStateRef.current[i];
      rs.rotX += d.rotSpeedX; rs.rotY += d.rotSpeedY;
      tempObject.position.set(d.x, d.y + Math.sin(time * d.driftSpeed + i) * 1.2, d.z);
      tempObject.rotation.set(rs.rotX, rs.rotY, rs.rotZ);
      tempObject.scale.setScalar(0.2);
      tempObject.updateMatrix();
      meshRef.current.setMatrixAt(i, tempObject.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return <group><instancedMesh ref={meshRef} args={[cardGeometry, cardMaterial, cardCount]} /></group>;
}

// ─── INTERACTIVE CARD RING ─────────────────────────────────────────────────────
function InteractiveCard({ cardRef }) {
  const { scene } = useGLTF("/card.glb");
  const { geo: cardGeometry, mat: cardMaterial } = useGLTFMesh(scene);
  const meshRef = useRef();
  const tempObject = useMemo(() => new THREE.Object3D(), []);
  const cardCount = 14, ringRadius = 3.8;

  useLayoutEffect(() => {
    if (!meshRef.current || !cardGeometry) return;
    for (let i = 0; i < cardCount; i++) {
      const angle = (i / cardCount) * Math.PI * 2;
      tempObject.position.set(Math.cos(angle) * ringRadius, Math.sin(angle) * ringRadius, 0);
      tempObject.rotation.set(0, angle + Math.PI / 2, Math.PI / 2);
      tempObject.scale.setScalar(0.32);
      tempObject.updateMatrix();
      meshRef.current.setMatrixAt(i, tempObject.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [cardGeometry, tempObject]);

  useFrame((_, delta) => { if (meshRef.current) meshRef.current.rotation.z += delta * 0.1; });

  if (!cardGeometry) return null;
  return (
    <group ref={cardRef} position={[5.5, 0, 0]}>
      <PresentationControls global={false} cursor snap speed={1} zoom={1} polar={[-Math.PI / 10, Math.PI / 10]} azimuth={[-Math.PI / 10, Math.PI / 10]}>
        <instancedMesh ref={meshRef} args={[cardGeometry, cardMaterial, cardCount]} />
      </PresentationControls>
    </group>
  );
}

// ─── RESPONSIVE CAMERA ────────────────────────────────────────────────────────
function ResponsiveCamera() {
  const { camera, size } = useThree();
  useEffect(() => { camera.fov = size.width < 768 ? 55 : 35; camera.updateProjectionMatrix(); }, [camera, size.width]);
  return null;
}

// ─── PHONE CLUSTER ────────────────────────────────────────────────────────────
function PhoneCluster({ scrollTriggerRef, insideTextRef, onReady }) {
  const { scene } = useGLTF("/card.glb");
  const clusterRef = useRef();
  const phoneRefs = useRef([]);
  const cardRef = useRef();
  const createPhone = () => scene.clone();

  useLayoutEffect(() => {
    let rafId, tl, isCancelled = false;
    const setup = () => {
      if (isCancelled) return;
      const phones = phoneRefs.current.filter(Boolean);
      if (!clusterRef.current || !scrollTriggerRef.current || !cardRef.current || phones.length < 5) {
        rafId = window.requestAnimationFrame(setup); return;
      }
      const radius = 4.8;
      const angles = phones.map((_, i) => ((i - 2) / 5) * Math.PI * 2 + Math.PI / 2);
      tl = gsap.timeline({ scrollTrigger: { trigger: scrollTriggerRef.current, start: "top top", end: "+=4500", scrub: 0.5, pin: true, pinSpacing: true, invalidateOnRefresh: true, refreshPriority: 10 } });
      gsap.set(clusterRef.current.rotation, { y: 0 });
      gsap.set(cardRef.current.position, { x: 5.5, y: 0, z: 0 });
      gsap.set(cardRef.current.scale, { x: 0, y: 0, z: 0 });
      if (insideTextRef?.current) gsap.set(insideTextRef.current, { autoAlpha: 0, y: 40 });
      gsap.set(phones[2].scale, { x: 4, y: 4, z: 4 });
      gsap.set(phones[2].position, { x: 0, y: 0, z: radius });
      phones.forEach((p, i) => { if (i !== 2) { gsap.set(p.scale, { x: 0, y: 0, z: 0 }); gsap.set(p.position, { x: 0, y: 0, z: radius - 0.5 }); } });
      phones.forEach((p, i) => {
        tl.to(p.scale, { x: 2, y: 2, z: 2, duration: 1 }, 0);
        tl.to(p.position, { x: Math.cos(angles[i]) * radius, z: Math.sin(angles[i]) * radius, duration: 1.5 }, 0.2);
      });
      tl.to(clusterRef.current.rotation, { y: Math.PI * 2, duration: 4, ease: "power1.inOut" }, 1.5);
      tl.to(phones[2].position, { x: 0, z: radius, duration: 1.5 }, 5.5);
      phones.forEach((p, i) => { if (i !== 2) tl.to(p.position, { x: 0, z: radius - 1.5, duration: 1.5 }, 5.5); });
      tl.to(phones[2].position, { z: 25, duration: 2, ease: "expo.in" }, 7.0);
      tl.to(phones[2].scale, { x: 250, y: 250, z: 250, duration: 2, ease: "expo.in" }, 7.0);
      phones.forEach((p, i) => { if (i !== 2) tl.to(p.scale, { x: 0, y: 0, z: 0, duration: 0.5 }, 7.0); });
      tl.to(cardRef.current.scale, { x: 1, y: 1, z: 1, duration: 1.5, ease: "back.out(1.2)" }, 8.5);
      if (insideTextRef?.current) tl.to(insideTextRef.current, { autoAlpha: 1, y: 0, duration: 1 }, 8.5);
      tl.to(cardRef.current.position, { x: 0, z: 25, duration: 2.5, ease: "power2.in" }, 10.0);
      tl.to(cardRef.current.scale, { x: 4, y: 4, z: 4, duration: 2.5, ease: "power2.in" }, 10.0);
      if (insideTextRef?.current) tl.to(insideTextRef.current, { autoAlpha: 0, y: -40, duration: 1.5 }, 10.0);
      onReady?.();
    };
    rafId = window.requestAnimationFrame(setup);
    return () => { isCancelled = true; if (rafId) window.cancelAnimationFrame(rafId); tl?.scrollTrigger?.kill(); tl?.kill(); };
  }, [scene, scrollTriggerRef, insideTextRef, onReady]);

  return (
    <group position={[0, -1, 0]}>
      <group ref={clusterRef}>
        {Array.from({ length: 5 }, (_, i) => (
          <group key={i} ref={(n) => { phoneRefs.current[i] = n; }}>
            <primitive object={createPhone()} />
          </group>
        ))}
      </group>
      <InteractiveCard cardRef={cardRef} />
    </group>
  );
}

// ─── HOME PAGE ─────────────────────────────────────────────────────────────────
export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [windowLoaded, setWindowLoaded] = useState(() => document.readyState === "complete");
  const [fontsReady, setFontsReady] = useState(() => !document.fonts || document.fonts.status === "loaded");
  const [heroVideoReady, setHeroVideoReady] = useState(false);
  const [phoneSceneReady, setPhoneSceneReady] = useState(false);
  const [scatterSceneReady, setScatterSceneReady] = useState(false);

  const storySectionRef = useRef(null), textContainerRef = useRef(null);
  const phoneSectionRef = useRef(null), scatterSectionRef = useRef(null);
  const scatterTextRef = useRef(null), featureSectionRef = useRef(null);
  const featureHeaderRef = useRef(null), featureRowsRef = useRef([]);
  const heroVideoRef = useRef(null), insideTextRef = useRef(null);
  const navigate = useNavigate();

  const refreshReady = windowLoaded && fontsReady && heroVideoReady && phoneSceneReady && scatterSceneReady;
  const markPhoneSceneReady = useCallback(() => setPhoneSceneReady(true), []);
  const markScatterSceneReady = useCallback(() => setScatterSceneReady(true), []);

  // Window load
  useEffect(() => {
    if (document.readyState === "complete") return;
    const fn = () => setWindowLoaded(true);
    window.addEventListener("load", fn, { once: true });
    return () => window.removeEventListener("load", fn);
  }, []);

  // Fonts ready
  useEffect(() => {
    if (!document.fonts || document.fonts.status === "loaded") return;
    let active = true;
    document.fonts.ready.then(() => { if (active) setFontsReady(true); });
    return () => { active = false; };
  }, []);

  // Trigger ScrollTrigger refresh once everything is ready
  useEffect(() => { if (!refreshReady) return; return refreshAfterLayout(); }, [refreshReady]);

  // Story word colour animation
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(textContainerRef.current.querySelectorAll(".word"), { color: "white", stagger: 0.1, scrollTrigger: { trigger: storySectionRef.current, start: "top 30%", end: "bottom 80%", scrub: 0.5, refreshPriority: 0 } });
    });
    return () => ctx.revert();
  }, []);

  // Scatter text fade-in
  useLayoutEffect(() => {
    if (!scatterTextRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(scatterTextRef.current, { autoAlpha: 0, y: 40, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.9, ease: "back.out(1.7)", scrollTrigger: { trigger: scatterSectionRef.current, start: "top 75%", toggleActions: "play none none reverse", refreshPriority: 0 } });
    }, scatterSectionRef);
    return () => ctx.revert();
  }, []);

  // Feature grid animation
  useLayoutEffect(() => {
    if (!featureSectionRef.current) return;
    const ctx = gsap.context(() => {
      const rows = featureRowsRef.current.filter(Boolean);
      const tl = gsap.timeline({ scrollTrigger: { trigger: featureSectionRef.current, start: "top 78%", toggleActions: "play none none reverse", refreshPriority: 0 } });
      tl.fromTo(featureHeaderRef.current, { autoAlpha: 0, y: 18, letterSpacing: "0.55em" }, { autoAlpha: 1, y: 0, letterSpacing: "0.42em", duration: 0.7, ease: "power3.out" });
      rows.forEach((row, i) => {
        tl.fromTo(row.querySelector(".row-content"), { y: 120, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.1, ease: "power4.out" }, i === 0 ? ">-0.4" : "-=0.9")
          .fromTo(row.querySelector(".row-line"), { scaleX: 0 }, { scaleX: 1, duration: 1.3, ease: "expo.out" }, "<0.2");
      });
    }, featureSectionRef);
    return () => ctx.revert();
  }, []);

  // Hero video autoplay
  useEffect(() => {
    const v = heroVideoRef.current;
    if (!v) return;
    v.play().catch(() => {});
    if (v.readyState >= 2) setHeroVideoReady(true);
  }, []);

  return (
    <main className="w-full bg-black">

      {/* ── HERO ── */}
      <section className="relative min-h-screen w-full overflow-hidden text-white">
        <div className="absolute inset-0">
          <video ref={heroVideoRef} className="h-full w-full object-cover" src={heroVideo} autoPlay muted loop playsInline onLoadedData={() => setHeroVideoReady(true)} preload="metadata" />
        </div>
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 sm:px-5 text-center w-full">
          <span className="mb-4 max-w-[95%] text-center text-[0.65rem] sm:text-xs font-bold tracking-[0.15em] sm:tracking-[0.3em] uppercase text-white/60 bg-white/5 px-3 sm:px-4 py-1.5 rounded-full backdrop-blur-sm">
            Startup Park is Now Open at Bengaluru
          </span>
          <h1 className="mx-auto w-full sm:max-w-[14ch] text-[clamp(2.5rem,10vw,7.5rem)] font-semibold leading-[0.92] tracking-[-0.05em] font-serif uppercase break-words">
            <span className="text-5xl sm:text-6xl md:text-7xl">A Complete</span>
            <br />Startup Ecosystem
          </h1>
          <p className="mt-8 text-[clamp(0.75rem,2.5vw,1.4rem)] tracking-[0.15em] sm:tracking-[0.2em] uppercase font-light text-white/70">
            Innovate <span className="text-white/40">→</span> Accelerate <span className="text-white/40">→</span> Succeed
          </p>
          <p className="mt-4 max-w-[50ch] text-xs sm:text-sm text-gray-400">
            Explore, connect, and grow with the next generation of innovators.<br className="hidden sm:block" />
            The future of startup innovation has officially begun ✨
          </p>
        </div>
      </section>

      {/* ── STORY ── */}
      <section ref={storySectionRef} className="relative min-h-screen bg-black text-white flex items-center">
        <div className="w-full px-6 sm:px-10 lg:px-24">
          <div ref={textContainerRef} className="mx-auto max-w-[1100px]">
            <p className="text-center font-serif text-[clamp(1.65rem,3.2vw,3.2rem)] leading-[1.4] text-[#4a5160]">
              {STORY_TEXT.split(" ").map((word, i) => (
                <span key={i} className="word inline-block mr-[0.25em]">{word}</span>
              ))}
            </p>
          </div>
        </div>
      </section>

      {/* ── CARD ROTATING SECTION ── */}
      <section ref={phoneSectionRef} className="relative h-screen bg-black overflow-hidden">
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center">
          <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 lg:grid lg:grid-cols-2 lg:gap-20 xl:gap-24 items-center">
            <div ref={insideTextRef} className="lg:col-start-1 mb-12 lg:mb-0">
              <h2 className="font-serif text-[clamp(2.5rem,5vw,5rem)] font-semibold leading-[1.1] text-white mb-6 uppercase">
                A world-class<br />ecosystem
              </h2>
              <p className="text-gray-400 text-[1.05rem] leading-relaxed max-w-[480px]">
                Designed exclusively to help founders scale faster. We empower builders with premium infrastructure, cross-functional innovation frameworks, and immediate access to capital pathways from idea to IPO.
              </p>
            </div>
            <div className="lg:col-start-2 flex items-center justify-center">
              <img src={ecosystemImg} alt="Ecosystem illustration" className="max-h-[70vh] w-auto object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* ── SCATTER SECTION ── */}
      <section ref={scatterSectionRef} className="relative h-screen w-full bg-black flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 h-full w-full">
          <Canvas dpr={[1, 1.25]} gl={{ antialias: false, powerPreference: "high-performance", alpha: false }}>
            <PerspectiveCamera makeDefault position={[0, 0, 20]} fov={40} />
            <ambientLight intensity={1.5} />
            <Environment preset="city" />
            <Suspense fallback={null}>
              <ScatteredCards sectionRef={scatterSectionRef} onReady={markScatterSceneReady} />
            </Suspense>
          </Canvas>
        </div>
        <div ref={scatterTextRef} className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl group cursor-default" style={{ opacity: 0 }}>
          <div className="mb-10 transition-opacity duration-700 ease-out opacity-100 md:opacity-20 md:group-hover:opacity-100">
            <svg width="60" height="70" viewBox="0 0 60 70" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M30 0L5 10V30C5 45.42 15.67 59.7 30 65C44.33 59.7 55 45.42 55 30V10L30 0Z" stroke="white" strokeWidth="2" />
              <rect x="22" y="32" width="16" height="12" rx="2" stroke="white" strokeWidth="2" />
              <path d="M26 32V28C26 25.7909 27.7909 24 30 24C32.2091 24 34 25.7909 34 28V32" stroke="white" strokeWidth="2" />
            </svg>
          </div>
          <h3 className="text-white text-[clamp(0.8rem,2vw,1.1rem)] tracking-[0.4em] font-bold uppercase mb-12 transition-opacity duration-700 ease-out opacity-100 md:opacity-20 md:group-hover:opacity-100">
            Our Foundation & Driven Impact
          </h3>
          <p className="text-[clamp(1.8rem,4vw,3.5rem)] leading-[1.3] text-white transition-opacity duration-1000 ease-in-out font-light opacity-100 md:opacity-20 md:group-hover:opacity-100">
            Powering bold choices with over <span className="font-semibold">200+ startups supported</span>, helping networks unlock <span className="font-semibold">₹600 Cr+ in accessed funding</span>, and enabling over <span className="font-semibold">10,000+ new jobs</span> across competitive tech markets.
          </p>
        </div>
      </section>

      {/* ── FEATURE GRID (Why Startup Park) ── */}
      <section ref={featureSectionRef} className="relative overflow-hidden bg-black text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_50%)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-24 sm:px-10 sm:py-28 lg:px-16 lg:py-32">
          <div className="mb-20 flex items-center gap-6">
            <span className="h-[1px] flex-1 bg-white/10" />
            <span ref={featureHeaderRef} className="text-[0.7rem] font-bold tracking-[0.5em] uppercase text-white/40">Why Startup Park</span>
            <span className="h-[1px] flex-1 bg-white/10" />
          </div>
          <div className="flex flex-col">
            {FEATURE_ROWS.map((item, i) => (
              <div key={i} ref={(n) => { featureRowsRef.current[i] = n; }} onClick={() => navigate(item.route)} className="relative overflow-hidden group cursor-pointer">
                <div className="row-content grid gap-10 py-16 md:grid-cols-[1fr_auto] md:items-center">
                  <div className="max-w-xl">
                    <h3 className="font-sans text-[clamp(3.5rem,7vw,6rem)] font-bold italic leading-[0.85] tracking-[-0.07em] uppercase transition-colors duration-500 group-hover:text-white text-white/90">{item.title}</h3>
                    <p className="mt-8 max-w-[32ch] text-[clamp(1.1rem,1.5vw,1.35rem)] leading-[1.6] text-white/50 font-medium">{item.desc}</p>
                  </div>
                  <div className="flex justify-start md:justify-end opacity-40 group-hover:opacity-100 transition-opacity duration-500">
                    <svg width="100" height="100" viewBox="0 0 92 92" fill="none" xmlns="http://www.w3.org/2000/svg">{item.icon}</svg>
                  </div>
                </div>
                <div className="row-line absolute bottom-0 left-0 h-[1px] w-full bg-white/20 origin-left" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALLERY ── */}
      <Gallery />

      {/* ── LEAD CAPTURE + FEATURED EVENT ── */}
      <section id="register" className="relative bg-black text-white py-20 px-6 sm:px-10 lg:px-24 border-t border-white/5">
        <div className="max-w-6xl mx-auto grid gap-16 lg:grid-cols-2 items-start">
          <div>
            <span className="text-xs font-bold tracking-widest text-white/40 uppercase block mb-3">Featured Event</span>
            <h4 className="text-2xl sm:text-3xl font-serif font-medium mb-4">7-Day Startup Expo 2025 — Bangalore</h4>
            <p className="text-gray-400 mb-6 leading-relaxed max-w-md">Explore recent funding startups, meet top-tier institutional investors, and discover the absolute future of deep tech solutions.</p>
            <button className="px-6 py-3 border border-white text-sm uppercase tracking-wider font-semibold hover:bg-white hover:text-black transition-all">Reserve Your Spot</button>
          </div>
          <div className="bg-white/5 p-8 rounded-xl backdrop-blur-md border border-white/10">
            <h4 className="text-xl font-serif font-semibold mb-2">Ready to Transform Your Startup?</h4>
            <p className="text-xs text-gray-400 mb-6">Join the world's most comprehensive startup ecosystem and accelerate your journey from idea to IPO.</p>
            <form onSubmit={(e) => e.preventDefault()} className="grid gap-4">
              {FORM_FIELDS.map(({ type, placeholder, required }) => (
                <input key={placeholder} type={type} placeholder={placeholder} required={required} className={inputCls} />
              ))}
              <textarea placeholder="Tell us about your startup" rows="3" className={`${inputCls} resize-none`} />
              <button type="submit" className="w-full bg-white text-black py-3 text-sm font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors mt-2">Schedule Strategy Session</button>
            </form>
            <span className="text-[10px] text-gray-500 block text-center mt-3">We'll respond within 24 hours to schedule your personalized consultation</span>
          </div>
        </div>
      </section>

      <PreBookModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  );
}