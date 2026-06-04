
import { useEffect, useRef, Suspense, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, PresentationControls } from "@react-three/drei";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import structuredAccelerationImg from "../assets/aboutimgs/Structured Acceleration.png";
import fundingEcosystemsImg from "../assets/aboutimgs/Funding Ecosystems.png";
import ventureRegistrationImg from "../assets/aboutimgs/Venture Registration.jpeg";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

// ─── SHARED CSS ──────────────────────────────────────────────────────────────
const aboutStyles = `
  :root {
    --black: #080808;
    --off-black: #0d0d0d;
    --green: #1f4aa8;
    --green-dim: #17306f;
    --green-glow: rgba(31,74,168,0.12);
    --white: #f0f0f0;
    --muted: #444;
    --glass: rgba(255,255,255,0.04);
    --glass-border: rgba(255,255,255,0.07);
  }

  .about-page { background: var(--black); color: var(--white); font-family: 'DM Sans', sans-serif; overflow-x: hidden; }
  .about-page *, .about-page *::before, .about-page *::after { box-sizing: border-box; }

  @keyframes about-glow-pulse {
    0%, 100% { opacity: 0.5; transform: scale(1); }
    50% { opacity: 0.9; transform: scale(1.08); }
  }
  @keyframes about-float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-14px); }
  }
  @keyframes about-ticker {
    0% { transform: translateX(0); }
    100% { transform: translateX(-33.33%); }
  }
  @keyframes about-ticker-r {
    0% { transform: translateX(-33.33%); }
    100% { transform: translateX(0); }
  }
  @keyframes about-breathe {
    0%, 100% { transform: scale(1); opacity: 0.4; }
    50% { transform: scale(1.1); opacity: 0.8; }
  }
  @keyframes glow-text {
    0% { text-shadow: 0 0 30px rgba(31,74,168,0.35); }
    100% { text-shadow: 0 0 50px rgba(31,74,168,0.75), 0 0 80px rgba(31,74,168,0.35); }
  }
  .about-ticker-wrap {
    width: 100%; overflow: hidden;
    border-top: 1px solid rgba(255,255,255,0.05);
    border-bottom: 1px solid rgba(255,255,255,0.05);
    padding: 0.9rem 0;
    background: rgba(0,0,0,0.85);
    backdrop-filter: blur(12px);
  }
  .about-ticker-inner {
    display: flex;
    white-space: nowrap;
    animation: about-ticker 20s linear infinite;
  }
  .about-ticker-inner.rev { animation: about-ticker-r 22s linear infinite; }
  .about-ticker-item {
    display: inline-flex; align-items: center; gap: 1.4rem;
    padding: 0 1.4rem;
    font-size: 0.6rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.42em;
    color: rgba(255,255,255,0.2);
  }
  .about-ticker-dot {
    width: 4px; height: 4px; border-radius: 50%;
    background: var(--green); opacity: 0.65; flex-shrink: 0;
  }

  /* Hero */
  .about-badge {
    display: inline-flex; align-items: center; gap: 0.75rem;
    background: var(--glass); border: 1px solid var(--glass-border);
    backdrop-filter: blur(12px); border-radius: 100px;
    padding: 0.5rem 1.2rem;
    font-size: 0.58rem; letter-spacing: 0.55em; text-transform: uppercase;
    color: var(--green); font-weight: 700;
  }
  .about-badge-dot {
    width: 6px; height: 6px; border-radius: 50%; background: var(--green);
    animation: about-glow-pulse 1.5s ease-in-out infinite;
  }
  .about-hero-stat {
    border-left: 1px solid rgba(255,255,255,0.1);
    padding-left: 1.5rem;
    display: flex; flex-direction: column; gap: 0.25rem;
  }
  .about-hero-stat-num {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(2.4rem, 4vw, 3.2rem);
    line-height: 1; color: var(--white);
  }
  .about-hero-stat-label {
    font-size: 0.58rem; text-transform: uppercase;
    letter-spacing: 0.38em; color: rgba(255,255,255,0.28);
    font-weight: 600;
  }

  /* Manifesto / Word-reveal */
  .about-manifesto-word {
    font-family: 'Bebas Neue', sans-serif;
    line-height: 0.95; opacity: 0.06;
    display: inline-block; transition: color 0.3s;
  }

  /* Team cards */
  .about-team-card {
    flex-shrink: 0;
    width: 280px; height: 380px;
    border-radius: 20px;
    border: 1px solid rgba(255,255,255,0.06);
    position: relative; overflow: hidden; cursor: pointer;
  }
  .about-team-card-inner {
    position: absolute; inset: 0;
    transition: transform 0.7s;
  }
  .about-team-card:hover .about-team-card-inner { transform: scale(1.04); }

  /* Values */
  .about-value-row {
    display: grid;
    grid-template-columns: 3rem minmax(0, 1fr) 1fr;
    gap: 2rem;
    padding: 3.5rem 0;
    align-items: start;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    position: relative;
    cursor: default;
  }
  .about-value-row::before {
    content: ''; position: absolute; bottom: 0; left: 0;
    height: 1px; width: 0; background: var(--green);
    transition: width 1s ease;
  }
  .about-value-row:hover::before { width: 100%; }
  .about-value-row::after {
    content: ''; position: absolute; top: 0; left: 0;
    height: 1px; width: 0;
    background: linear-gradient(to right, rgba(31,74,168,0.3), transparent);
    transition: width 0.7s ease;
  }
  .about-value-row:hover::after { width: 100%; }

  @media (max-width: 900px) {
    .about-value-row {
      grid-template-columns: 3rem minmax(0, 1fr);
      gap: 1rem;
    }
    .about-value-row h3 {
      grid-column: 2 / -1;
    }
    .about-value-row p {
      grid-column: 1 / -1;
      padding-top: 0.5rem;
    }
  }

  /* Closing cards */
  .about-closing-card {
    flex-shrink: 0;
    min-width: 420px; height: 540px;
    border-radius: 24px;
    border: 1px solid rgba(255,255,255,0.06);
    background: linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0) 100%);
    backdrop-filter: blur(16px);
    padding: 2.5rem; margin: 0 1.2rem;
    display: flex; flex-direction: column; justify-content: space-between;
    position: relative; overflow: hidden; cursor: pointer;
  }
  .about-closing-card-image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.46;
    filter: saturate(0.82) contrast(1.08);
    transform: scale(1.02);
    transition: transform 0.85s ease, opacity 0.85s ease, filter 0.85s ease;
  }
  .about-closing-card::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 1;
    background:
      linear-gradient(180deg, rgba(0,0,0,0.44) 0%, rgba(0,0,0,0.18) 38%, rgba(0,0,0,0.88) 100%),
      radial-gradient(ellipse at top left, rgba(31,74,168,0.24), transparent 58%),
      linear-gradient(90deg, rgba(0,0,0,0.7), rgba(0,0,0,0.2));
    pointer-events: none;
  }
  .about-closing-card::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 2;
    background: linear-gradient(145deg, rgba(255,255,255,0.06), rgba(0,0,0,0) 48%);
    pointer-events: none;
  }
  .about-closing-card:hover .about-closing-card-image {
    opacity: 0.62;
    filter: saturate(1) contrast(1.14);
    transform: scale(1.08);
  }
  .about-closing-card-glow {
    position: absolute; inset: 0; z-index: 3;
    opacity: 0; pointer-events: none;
    transition: opacity 0.6s;
  }
  .about-closing-card:hover .about-closing-card-glow { opacity: 1; }

  /* Noise overlay */
  .about-noise {
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
    opacity: 0.04; pointer-events: none;
  }

  @media (max-width: 768px) {
    .about-team-card { width: 240px; height: 340px; }
    .about-closing-card { min-width: 320px; height: 460px; }
  }
`;

// ─── FLOATING PARTICLES ──────────────────────────────────────────────────────
function AboutParticles({ count = 180 }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 22;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 4;
    }
    return pos;
  }, [count]);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.008;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#1f4aa8" transparent opacity={0.3} sizeAttenuation />
    </points>
  );
}

// ─── ICOSAHEDRON ─────────────────────────────────────────────────────────────
function AboutIco() {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.x = t * 0.14;
    ref.current.rotation.y = t * 0.19;
  });
  return (
    <group ref={ref}>
      <mesh>
        <icosahedronGeometry args={[2, 1]} />
        <meshBasicMaterial color="#1f4aa8" wireframe transparent opacity={0.18} />
      </mesh>
      <mesh>
        <torusGeometry args={[3, 0.012, 8, 180]} />
        <meshStandardMaterial color="#1f4aa8" emissive="#1f4aa8" emissiveIntensity={1.5} transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

// ─── TICKER ──────────────────────────────────────────────────────────────────
function AboutTicker({ items, reverse = false, speed = 20 }) {
  const all = [...items, ...items, ...items];
  return (
    <div className="about-ticker-wrap">
      <div className={`about-ticker-inner${reverse ? " rev" : ""}`} style={{ animationDuration: `${speed}s` }}>
        {all.map((item, i) => (
          <span key={i} className="about-ticker-item">
            {item}
            <span className="about-ticker-dot" />
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── METAL CARD ──────────────────────────────────────────────────────────────
function MetalCardOrb() {
  const { scene } = useGLTF("/metal_credit_card.glb");
  const ref = useRef();
  const geo = useMemo(() => { let g = null; scene.traverse((c) => { if (c.isMesh && !g) g = c.geometry; }); return g; }, [scene]);
  const mat = useMemo(() => { let m = null; scene.traverse((c) => { if (c.isMesh && !m) m = c.material; }); return m; }, [scene]);
  const tempObj = useMemo(() => new THREE.Object3D(), []);
  const count = 10;
  const radius = 3.2;

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.z += delta * 0.12;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      tempObj.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
      tempObj.rotation.set(0, angle + Math.PI / 2, Math.PI / 2);
      tempObj.scale.setScalar(0.1);
      tempObj.updateMatrix();
      ref.current.setMatrixAt(i, tempObj.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });

  if (!geo) return null;
  return (
    <PresentationControls global={false} cursor snap speed={0.8} polar={[-0.2, 0.2]} azimuth={[-0.2, 0.2]}>
      <instancedMesh ref={ref} args={[geo, mat, count]} />
    </PresentationControls>
  );
}

// ─── MAIN ABOUT PAGE ─────────────────────────────────────────────────────────
export default function About() {
  const pageRef = useRef();
  const heroRef = useRef();
  const storyRef = useRef();
  const manifestoRef = useRef();
  const valuesRef = useRef();
  const teamRef = useRef();
  const cardSectionRef = useRef();
  const closingRef = useRef();
  const hTrackRef = useRef();

  // Updated Team Data to mirror Startup Park's internal network / operators
  const team = [
    { name: "Shafi Shoukath", role: "Founder, Startup Park", color: "#1f4aa8" },
    { name: "Mazin Arbaz", role: "Creative Lead", color: "#1f4aa8" },
    { name: "Kiran", role: "Head of Technology", color: "#1f4aa8" },
    { name: "Sourav", role: "Product Strategy", color: "#1f4aa8" },
    { name: "Hashir", role: "Startup Activation", color: "#1f4aa8" },
    { name: "Nawaf", role: "Venture Growth", color: "#1f4aa8" },
  ];

  // Updated Mission/Vision text tokens for on-scroll reveal
  const manifestoText = "We power bold ideas into reality through a builder-centric ecosystem that transforms raw concepts into scalable, world-class ventures.".split(" ");

  // Updated Startup Park verified core metrics
  const stats = [
    { num: "10,000+", label: "Startups Built" },
    { num: "100,000+", label: "Jobs Created" },
    { num: "₹50,000 Cr+", label: "Funding Facilitated" },
    { num: "2025", label: "Launch Year" },
    { num: "1st", label: "Startup Park in Bengaluru" },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Hero entrance
      gsap.set([".about-hero-badge", ".about-hero-word", ".about-hero-sub", ".about-hero-stat"], {
        y: 40, opacity: 0,
      });
      const heroTl = gsap.timeline({ delay: 0.15 });
      heroTl
        .to(".about-hero-badge", { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" })
        .to(".about-hero-word", { y: 0, opacity: 1, duration: 1.1, stagger: 0.07, ease: "expo.out" }, "-=0.4")
        .to(".about-hero-sub", { y: 0, opacity: 1, duration: 0.9, ease: "expo.out" }, "-=0.5")
        .to(".about-hero-stat", { y: 0, opacity: 1, duration: 0.8, stagger: 0.06, ease: "expo.out" }, "-=0.6");

      // ── Hero parallax
      if (heroRef.current) {
        gsap.to(".about-hero-headline", {
          y: -220, opacity: 0.15,
          scrollTrigger: { trigger: heroRef.current, start: "top top", end: "80% top", scrub: 0.6 },
        });
        gsap.to(".about-hero-stats-row", {
          y: -140, opacity: 0,
          scrollTrigger: { trigger: heroRef.current, start: "10% top", end: "65% top", scrub: 0.5 },
        });
        gsap.to(".about-scroll-hint", {
          opacity: 0, y: -12,
          scrollTrigger: { trigger: heroRef.current, start: "5% top", end: "18% top", scrub: true },
        });
      }

      // ── Story section: pinned slide-in panels
      if (storyRef.current) {
        const panels = storyRef.current.querySelectorAll(".about-story-panel");
        const counters = storyRef.current.querySelector(".about-story-counters");

        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        panels.forEach((panel, i) => {
          tl.to(panel, { x: 0, opacity: 1, duration: 0.9 }, i * 0.22);
        });
        if (counters) {
          tl.to(counters, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.3");
        }

        ScrollTrigger.create({
          trigger: storyRef.current,
          start: "top top",
          end: `+=${panels.length * 60}vh`,
          pin: true, pinSpacing: true,
          scrub: 0.6, anticipatePin: 1,
          animation: tl, invalidateOnRefresh: true,
        });
      }

      // ── Manifesto pin
      if (manifestoRef.current) {
        const mWords = manifestoRef.current.querySelectorAll(".about-manifesto-word");
        gsap.set(mWords, { opacity: 0.06 });
        ScrollTrigger.create({
          trigger: manifestoRef.current,
          start: "top top",
          end: `+=${mWords.length * 80}`,
          pin: true, pinSpacing: true,
          scrub: 0.35,
          animation: gsap.to(mWords, { opacity: 1, stagger: { each: 0.28 }, ease: "none" }),
        });
      }

      // ── Values stagger
      if (valuesRef.current) {
        const rows = valuesRef.current.querySelectorAll(".about-value-row");
        rows.forEach((row, i) => {
          gsap.fromTo(row,
            { y: 60, opacity: 0 },
            {
              y: 0, opacity: 1, duration: 0.9, ease: "power3.out",
              scrollTrigger: { trigger: row, start: "top 88%", toggleActions: "play none none reverse" },
              delay: i * 0.06,
            }
          );
        });
        gsap.fromTo(".about-values-header > *",
          { x: -60, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 1.1, stagger: 0.1, ease: "expo.out",
            scrollTrigger: { trigger: valuesRef.current, start: "top 80%", toggleActions: "play none none reverse" },
          }
        );
      }

      // ── Team cards
      if (teamRef.current) {
        gsap.fromTo(".about-team-card",
          { y: 90, opacity: 0, rotateX: 15 },
          {
            y: 0, opacity: 1, rotateX: 0, duration: 1.1, stagger: 0.09, ease: "expo.out",
            scrollTrigger: { trigger: teamRef.current, start: "top 75%", toggleActions: "play none none reverse" },
          }
        );
        gsap.fromTo(".about-team-headline > *",
          { x: -70, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 1.2, stagger: 0.1, ease: "expo.out",
            scrollTrigger: { trigger: teamRef.current, start: "top 80%", toggleActions: "play none none reverse" },
          }
        );
      }

      // ── Card section
      if (cardSectionRef.current) {
        gsap.fromTo(".about-card-text",
          { opacity: 0, y: 35, scale: 0.97 },
          {
            opacity: 1, y: 0, scale: 1, duration: 0.9, ease: "back.out(1.7)",
            scrollTrigger: { trigger: cardSectionRef.current, start: "top 75%", toggleActions: "play none none reverse" },
          }
        );
      }

      // ── Closing horizontal scroll
      if (closingRef.current && hTrackRef.current) {
        gsap.fromTo(".about-closing-big",
          { opacity: 0, y: 55 },
          {
            opacity: 1, y: 0, duration: 1.2, ease: "expo.out",
            scrollTrigger: { trigger: closingRef.current, start: "top 80%", toggleActions: "play none none reverse" },
          }
        );
        const getDist = () => hTrackRef.current.scrollWidth - closingRef.current.offsetWidth;
        ScrollTrigger.create({
          trigger: closingRef.current,
          start: "top top",
          end: () => `+=${getDist()}`,
          pin: true, anticipatePin: 1, scrub: 0.9, invalidateOnRefresh: true,
          animation: gsap.to(hTrackRef.current, { x: () => -getDist(), ease: "none" }),
        });
      }

      ScrollTrigger.refresh();
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="about-page">
      <style>{aboutStyles}</style>

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        style={{ position: "relative", minHeight: "130vh", overflow: "hidden", background: "#070708" }}
      >
        {/* Particle canvas bg */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0, opacity: 0.65 }}>
          <Canvas dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }} camera={{ position: [0, 0, 7], fov: 50 }}>
            <ambientLight intensity={0.3} />
            <pointLight position={[4, 4, 4]} color="#1f4aa8" intensity={2} />
            <Suspense fallback={null}>
              <AboutParticles count={200} />
              <Environment preset="city" />
            </Suspense>
          </Canvas>
        </div>

        {/* Noise */}
        <div className="about-noise" style={{ position: "absolute", inset: 0, zIndex: 1 }} />

        {/* Glows */}
        <div style={{
          position: "absolute", top: "30%", left: "20%",
          width: 560, height: 560, borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(31,74,168,0.08), transparent 70%)",
          filter: "blur(60px)", animation: "about-breathe 7s ease-in-out infinite",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", top: "20%", right: "15%",
          width: 380, height: 380, borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(31,74,168,0.06), transparent 70%)",
          filter: "blur(40px)", animation: "about-breathe 9s ease-in-out infinite 2s",
          pointerEvents: "none",
        }} />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 10, paddingTop: "11rem", paddingBottom: "10rem", paddingLeft: "clamp(1.5rem,8vw,8rem)", paddingRight: "clamp(1.5rem,4vw,4rem)" }}>
          <div className="about-hero-badge" style={{ marginBottom: "3.5rem" }}>
            <span className="about-badge-dot" />
            <span>About Startup Park</span>
            <div style={{ width: 60, height: 1, background: "linear-gradient(to right, var(--green), transparent)", marginLeft: "0.5rem" }} />
          </div>

          <div className="about-hero-headline" style={{ maxWidth: "72rem" }}>
            <div style={{ overflow: "hidden" }}>
              <h1 className="about-hero-word" style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(4.5rem,13vw,13rem)",
                lineHeight: 0.88, letterSpacing: "0.02em",
                color: "var(--white)", display: "inline-block",
              }}>We build</h1>
            </div>
            <div style={{ overflow: "hidden" }}>
              <h1 className="about-hero-word" style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(4.5rem,13vw,13rem)",
                lineHeight: 0.88, letterSpacing: "0.02em",
                color: "transparent",
                WebkitTextStroke: "1.6px rgba(255,255,255,0.22)",
                display: "inline-block",
              }}>for the</h1>
            </div>
            <div style={{ overflow: "hidden", display: "flex", alignItems: "flex-end", gap: "2rem", flexWrap: "wrap" }}>
              <h1 className="about-hero-word" style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(4.5rem,13vw,13rem)",
                lineHeight: 0.88, letterSpacing: "0.02em",
                color: "var(--green)",
                textShadow: "0 0 60px rgba(31,74,168,0.55), 0 0 120px rgba(31,74,168,0.25)",
                display: "inline-block", animation: "glow-text 3s ease-in-out infinite alternate",
              }}>innovators.</h1>
              <p className="about-hero-sub" style={{
                color: "rgba(255,255,255,0.3)", fontSize: "0.95rem",
                fontWeight: 300, maxWidth: "22rem", marginBottom: "1.2rem", lineHeight: 1.9,
              }}>
                The world’s first comprehensive ecosystem built exclusively for entrepreneurs to transform ambitious ideas into market-ready solutions.
              </p>
            </div>
          </div>

          <div style={{ height: 1, background: "linear-gradient(to right, transparent, rgba(31,74,168,0.38), transparent)", margin: "3.5rem 0 1rem" }} className="about-hero-sub" />

          <div className="about-hero-stats-row" style={{ display: "flex", flexWrap: "wrap", gap: "2.5rem", marginTop: "1rem" }}>
            {stats.map((s, i) => (
              <div key={i} className="about-hero-stat">
                <span className="about-hero-stat-num">{s.num}</span>
                <span className="about-hero-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* ── ORIGIN SECTION ────────────────────────────────────────────── */}
      <section
  ref={storyRef}
  style={{
    position: "relative",
    minHeight: "100vh",
    height: "auto",
    overflow: "hidden",
    background: "#060608",
    boxSizing: "border-box",
  }}
>
  {/* Left fixed label col */}
  <div
    style={{
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      width: "clamp(1.5rem,8vw,8rem)",
      borderRight: "1px solid rgba(255,255,255,0.05)",
      display: window.innerWidth < 768 ? "none" : "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 10,
    }}
  ></div>

  {/* Right fixed year col */}
  <div
    style={{
      position: "absolute",
      right: 0,
      top: 0,
      bottom: 0,
      width: "clamp(1.5rem,6vw,6rem)",
      borderLeft: "1px solid rgba(255,255,255,0.05)",
      display: window.innerWidth < 768 ? "none" : "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 10,
    }}
  ></div>

  {/* Panels container */}
  <div
    className="about-story-panels"
    style={{
      position: "relative",
      inset: 0,
      display: "flex",
      flexDirection: "column",
      paddingTop: "clamp(5rem, 8vw, 7rem)",
      paddingLeft:
        window.innerWidth < 768
          ? "1.5rem"
          : "clamp(3rem,10vw,10rem)",
      paddingRight:
        window.innerWidth < 768
          ? "1.5rem"
          : "clamp(3rem,8vw,8rem)",
      justifyContent: "center",
      gap: 0,
      boxSizing: "border-box",
    }}
  >
    {[
      {
        line: "Our Vision.",
        sub: "To make Bengaluru the world’s most founder-friendly city by 2030, creating an ecosystem where 10,000+ startups are built, 100,000 jobs are generated, and Karnataka becomes a global hub for innovation.",
        accent: false,
      },
      {
        line: "Empower Founders.",
        sub: "Provide structured incubation, mentorship, and resources to transform raw ideas into scalable ventures.",
        accent: false,
      },
      {
        line: "Build Global Impact.",
        sub: "Attract investments, drive job creation, and position Karnataka startups on the world stage through international collaborations, events, and partnerships.",
        accent: true,
      },
    ].map((item, i) => (
      <div
        key={i}
        className={`about-story-panel about-story-panel-${i}`}
        style={{
          padding: window.innerWidth < 768 ? "1.6rem 0" : "2.8rem 0",
          borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.05)" : "none",
          display: "grid",
          gridTemplateColumns:
            window.innerWidth < 768 ? "1fr" : "1fr 1fr",
          gap: window.innerWidth < 768 ? "1.25rem" : "4rem",
          alignItems: "center",
          transform: `translateX(${i % 2 === 0 ? "-100%" : "100%"})`,
          opacity: 0,
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <h2
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "clamp(2.2rem,4.5vw,5rem)",
              lineHeight: 1.05,
              color: item.accent ? "var(--green)" : "var(--white)",
              textShadow: item.accent
                ? "0 0 40px rgba(31,74,168,0.38)"
                : "none",
              fontWeight: 400,
              margin: 0,
            }}
          >
            {item.line}
          </h2>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <div
            style={{
              width: 2,
              height: "100%",
              minHeight: 60,
              background: item.accent
                ? "var(--green)"
                : "rgba(255,255,255,0.08)",
              flexShrink: 0,
            }}
          />
          <p
            style={{
              fontSize: "clamp(0.85rem,1.2vw,1.1rem)",
              color: "rgba(255,255,255,0.35)",
              lineHeight: 1.8,
              fontWeight: 300,
              margin: 0,
            }}
          >
            {item.sub}
          </p>
        </div>
      </div>
    ))}

    {/* Counter row */}
    <div
      className="about-story-counters"
      style={{
        display: "flex",
        flexDirection: window.innerWidth < 768 ? "column" : "row",
        gap: window.innerWidth < 768 ? "1.5rem" : "3rem",
        marginTop: "3.5rem",
        paddingTop: "2.5rem",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        opacity: 0,
        transform: "translateY(30px)",
      }}
    >
      {[
        { val: "10,000+", label: "startups built" },
        { val: "₹50,000 Cr+", label: "funding facilitated" },
        { val: "100,000+", label: "jobs created" },
      ].map((c, i) => (
        <div
          key={i}
          style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}
        >
          <span
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(2rem,4vw,4rem)",
              lineHeight: 1,
              color: "var(--green)",
              textShadow: "0 0 30px rgba(31,74,168,0.45)",
            }}
          >
            {c.val}
          </span>
          <span
            style={{
              fontSize: "0.58rem",
              textTransform: "uppercase",
              letterSpacing: "0.4em",
              color: "rgba(255,255,255,0.22)",
              fontWeight: 600,
            }}
          >
            {c.label}
          </span>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* ── MANIFESTO PIN (Mission & Vision) ─────────────────────────── */}
      <section
        ref={manifestoRef}
        style={{
          position: "relative", minHeight: "100vh",
          background: "rgba(4,4,8,0.97)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center",
          padding: "0 clamp(1.5rem,8vw,8rem)", overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(31,74,168,0.04), transparent)", pointerEvents: "none" }} />

        {/* Big BG word */}
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", pointerEvents: "none" }}>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "22vw", color: "rgba(31,74,168,0.02)", letterSpacing: "0.1em", userSelect: "none" }}>FOUNDATION</span>
        </div>

        <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "72rem" }}>
          <div style={{ marginBottom: "4rem" }} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem 1.5rem", alignItems: "baseline" }}>
            {manifestoText.map((word, i) => {
              const cleanWord = word.replace(/[.,]/g, "").toLowerCase();
              const highlight = { "power": "#1f4aa8", "builder-centric": "#1f4aa8", "ventures": "#1f4aa8", "world-class": "#1f4aa8" };
              const big = ["power", "builder-centric", "transforms", "scalable", "world-class"].includes(cleanWord);
              return (
                <span key={i} className="about-manifesto-word"
                  style={{
                    fontSize: big ? "clamp(3rem,7vw,7rem)" : "clamp(2rem,4vw,4.2rem)",
                    color: word === "." ? "var(--green)" : (highlight[cleanWord] || "white"),
                  }}>
                  {word}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── VALUES SECTION ────────────────────────────────────────────── */}
      <section
        ref={valuesRef}
        style={{ background: "rgba(5,5,9,0.96)", padding: "10vh clamp(1.5rem,8vw,8rem) 12vh" }}
      >
        <div className="about-values-header" style={{ maxWidth: "72rem", marginBottom: "6vh" }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(3rem,7vw,7.5rem)", lineHeight: 0.95, color: "var(--white)" }}>
            Ecosystem,
          </h2>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(3rem,7vw,7.5rem)", lineHeight: 0.95, color: "transparent", WebkitTextStroke: "1.5px rgba(255,255,255,0.22)" }}>
            not just workspace.
          </h2>
        </div>

        <div style={{ maxWidth: "72rem" }}>
          {[
            { num: "01", title: "Premium infrastructure.", desc: "From high-productivity workspaces and private cabins to prototyping labs and demo stages, everything is designed to support serious startup growth.", accent: "#1f4aa8" },
            { num: "02", title: "Structured acceleration.", desc: "Milestone-driven incubation tracks and expert-led mentorship help founders move from idea to execution with speed and clarity.", accent: "#1f4aa8" },
            { num: "03", title: "Strategic capital pathways.", desc: "We connect startups with investors, seed networks, and funding opportunities to strengthen their growth journey.", accent: "#1f4aa8" },
            { num: "04", title: "Corporate governance help.", desc: "Founders get support with legal structure, IP protection, compliance, and fundraising readiness.", accent: "#1f4aa8" },
          ].map((v, i) => (
            <div key={i} className="about-value-row">
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "3.5rem", lineHeight: 1, color: `${v.accent}18`, transition: "color 0.5s" }}>{v.num}</span>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem,3.5vw,3.5rem)", lineHeight: 1, color: "var(--white)", transition: "color 0.4s" }}>{v.title}</h3>
              <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.85, fontWeight: 300, paddingTop: "0.5rem", transition: "color 0.4s" }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TEAM SECTION (Founder & Core Operators) ───────────────────── */}
      <section
        ref={teamRef}
        style={{ position: "relative", background: "rgba(7,7,14,0.97)", padding: "10vh 0 12vh", overflow: "hidden" }}
      >
        {/* Ambient blobs */}
        {["#1f4aa8", "#1f4aa8", "#1f4aa8"].map((c, i) => (
          <div key={i} style={{
            position: "absolute", width: 200, height: 200, borderRadius: "50%",
            background: `radial-gradient(circle, ${c}25, transparent 70%)`,
            filter: "blur(40px)", pointerEvents: "none",
            left: `${15 + i * 33}%`, top: "55%", transform: "translateY(-50%)",
            animation: `about-float ${3.5 + i * 0.7}s ease-in-out infinite ${i * 0.6}s`,
          }} />
        ))}

        <div className="about-team-headline" style={{ padding: "0 clamp(1.5rem,8vw,8rem)", marginBottom: "6vh" }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(3rem,7.5vw,7.5rem)", lineHeight: 0.95, color: "var(--white)" }}>Builders,</h2>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(3rem,7.5vw,7.5rem)", lineHeight: 0.95, color: "transparent", WebkitTextStroke: "1.5px rgba(255,255,255,0.22)" }}>not managers.</h2>
          <p style={{ maxWidth: "36rem", marginTop: "1.5rem", color: "rgba(255,255,255,0.34)", lineHeight: 1.8, fontWeight: 300 }}>
            A network of creators, operators, and catalysts driving Karnataka's startup future.
          </p>
        </div>

        <div style={{ display: "flex", gap: "1.2rem", paddingLeft: "clamp(1.5rem,8vw,8rem)", paddingRight: "2rem", overflowX: "auto", scrollbarWidth: "none" }}>
          {team.map((member, i) => (
            <div key={i} className="about-team-card">
              {/* Card gradient bg */}
              <div className="about-team-card-inner" style={{
                background: `linear-gradient(145deg, ${member.color}14 0%, #000 70%)`,
              }} />
              {/* Hover glow */}
              <div style={{
                position: "absolute", inset: 0,
                background: `radial-gradient(ellipse at top, ${member.color}08, transparent 55%)`,
                opacity: 0, transition: "opacity 0.5s",
              }} className="about-team-hover-glow" />
              {/* Bottom accent line */}
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0, height: 1,
                background: `linear-gradient(to right, transparent, ${member.color}50, transparent)`,
              }} />
              {/* Number badge */}
              <div style={{
                position: "absolute", top: "1.5rem", right: "1.5rem",
                width: 52, height: 52, borderRadius: "50%",
                border: `1px solid ${member.color}30`,
                background: `${member.color}08`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", color: member.color }}>
                  {`0${i + 1}`}
                </span>
              </div>
              {/* Name & role */}
              <div style={{ position: "absolute", bottom: "2rem", left: "2rem", right: "2rem" }}>
                <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.2rem", color: "var(--white)", lineHeight: 1 }}>{member.name}</p>
                <p style={{ fontSize: "0.58rem", textTransform: "uppercase", letterSpacing: "0.4em", marginTop: "0.5rem", fontWeight: 700, color: member.color }}>{member.role}</p>
                <div style={{ height: 1, width: 28, marginTop: "0.75rem", background: member.color, transition: "width 0.5s" }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CARD / TRUST SECTION ────────────────────────────────────────── */}
      <section
        ref={cardSectionRef}
        style={{ position: "relative", height: "100vh", overflow: "hidden", background: "rgba(0,0,0,0.98)", display: "flex", alignItems: "center", justifyValue: "center" }}
      >
        {/* 3D canvas */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <Canvas dpr={[1, 1.25]} gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }} camera={{ position: [0, 0, 10], fov: 40 }}>
            <ambientLight intensity={1.5} />
            <Environment preset="city" />
            <Suspense fallback={null}>
              <MetalCardOrb />
            </Suspense>
          </Canvas>
        </div>

        {/* Radial vignette */}
        <div style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none", background: "radial-gradient(ellipse 65% 65% at 50% 50%, transparent 20%, rgba(0,0,0,0.85) 100%)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 200, zIndex: 2, background: "linear-gradient(to top, #080808, transparent)", pointerEvents: "none" }} />

        {/* Text */}
        <div className="about-card-text" style={{ position: "relative", zIndex: 3, textAlign: "center", padding: "0 1.5rem", maxWidth: "52rem", opacity: 0, margin: "0 auto" }}>
          <div style={{ marginBottom: "2.5rem" }}>
            <svg width="54" height="62" viewBox="0 0 60 70" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.35 }}>
              <path d="M30 0L5 10V30C5 45.42 15.67 59.7 30 65C44.33 59.7 55 45.42 55 30V10L30 0Z" stroke="#1f4aa8" strokeWidth="2" />
              <rect x="22" y="32" width="16" height="12" rx="2" stroke="#1f4aa8" strokeWidth="2" />
              <path d="M26 32V28C26 25.7909 27.7909 24 30 24C32.2091 24 34 25.7909 34 28V32" stroke="#1f4aa8" strokeWidth="2" />
            </svg>
          </div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem,5vw,5rem)", lineHeight: 0.95, color: "var(--white)", marginBottom: "1.8rem" }}>
            This isn't just a space. It's your launchpad.
          </h2>
          <p style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "clamp(1.2rem,2.4vw,2.15rem)", lineHeight: 1.45, color: "rgba(255,255,255,0.85)", fontWeight: 400, fontStyle: "italic" }}>
            "Startup Park was created with a clear vision — to give founders, innovators, and dreamers everything they need to turn ideas into thriving businesses. We are not just a workspace; we are an ecosystem. Every corner is designed to help you build, scale, and succeed. At Startup Park, you will never walk alone."
          </p>
        </div>
      </section>

      {/* ── PHILOSOPHY SECTION ─────────────────────────────────────────── */}
      <section
  style={{
    position: "relative",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
    background: "rgba(0,0,0,0.97)",
    padding: "10vh clamp(1.5rem,8vw,8rem)",
  }}
>
  {/* 3D Right canvas */}
  <div
    style={{
      position: "absolute",
      right: window.innerWidth <= 768 ? "-35vw" : "-5vw",
      top: 0,
      bottom: 0,
      width: window.innerWidth <= 768 ? "100vw" : "55vw",
      opacity: window.innerWidth <= 768 ? 0.15 : 0.65,
      pointerEvents: "none",
    }}
  >
    <Canvas
      dpr={[1, 1]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 7], fov: 55 }}
    >
      <ambientLight intensity={0.1} />
      <pointLight position={[2, 2, 2]} color="#1f4aa8" intensity={2} />
      <pointLight position={[-2, -2, 2]} color="#1f4aa8" intensity={1.5} />

      <Suspense fallback={null}>
        <Float speed={1.1} rotationIntensity={0.35} floatIntensity={0.5}>
          <AboutIco />
        </Float>
        <Environment preset="night" />
      </Suspense>
    </Canvas>
  </div>

  {/* Left text */}
  <div
    style={{
      maxWidth: "40rem",
      width: "100%",
      position: "relative",
      zIndex: 2,
    }}
  >
    <h2
      style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: "clamp(2.8rem,7.5vw,7.5rem)",
        lineHeight: 0.95,
        color: "var(--white)",
        marginBottom: "0.3rem",
      }}
    >
      We think in
    </h2>

    <h2
      style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: "clamp(2.8rem,7.5vw,7.5rem)",
        lineHeight: 0.95,
        color: "var(--green)",
        textShadow: "0 0 60px rgba(31,74,168,0.45)",
        marginBottom: window.innerWidth <= 768 ? "2rem" : "3rem",
      }}
    >
      ventures.
    </h2>

    <p
      style={{
        fontSize: window.innerWidth <= 768 ? "1rem" : "0.9rem",
        color:
          window.innerWidth <= 768
            ? "rgba(255,255,255,0.65)"
            : "rgba(255,255,255,0.32)",
        lineHeight: 1.9,
        fontWeight: 300,
        marginBottom: "1.2rem",
        maxWidth: "36rem",
      }}
    >
      Not standalone desks, not short-term support patches — complete scalable systems. When infrastructure, incubation, mentorship, and legal backing work in harmony, your venture grows at maximum velocity.
    </p>

    <p
      style={{
        fontSize: window.innerWidth <= 768 ? "0.95rem" : "0.78rem",
        color:
          window.innerWidth <= 768
            ? "rgba(255,255,255,0.45)"
            : "rgba(255,255,255,0.14)",
        lineHeight: 1.9,
        fontWeight: 300,
        maxWidth: "36rem",
      }}
    >
      We built this environment for founders who dream big, execute fast, and want to turn raw value into generational businesses.
    </p>

    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        marginTop: "3.5rem",
      }}
    >
      <div
        style={{
          width: 52,
          height: 1,
          background: "rgba(31,74,168,0.38)",
        }}
      />
    </div>
  </div>
</section>
      {/* ── CLOSING HORIZONTAL SCROLL ─────────────────────────────────── */}
      <section
        ref={closingRef}
        style={{ position: "relative", height: "100vh", overflow: "hidden", background: "rgba(0,0,0,0.98)" }}
      >
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(31,74,168,0.04), transparent)" }} />

        <div className="about-closing-big" style={{ textAlign: "center", padding: "5rem 1.5rem 3rem", flexShrink: 0, opacity: 0 }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem,6vw,6.5rem)", lineHeight: 0.95, color: "rgba(255,255,255,0.4)" }}>This isn't just a space.</h2>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(3.5rem,10vw,10rem)", lineHeight: 0.95, color: "var(--green)", textShadow: "0 0 60px rgba(31,74,168,0.55)" }}>It's your launchpad.</h2>
        </div>

        <div style={{ overflow: "hidden" }}>
          <div ref={hTrackRef} style={{ display: "flex", flexWrap: "nowrap", paddingLeft: "clamp(1.5rem,8vw,8rem)", willChange: "transform" }}>
            {[
              { index: 0, title: "Co-working Frameworks", desc: "Premium zones, private desks, and tech-ready meeting spaces designed to support startup productivity and scale.", accent: "#1f4aa8", image: "/gallery1.png", imagePosition: "center" },
              { index: 1, title: "Structured Acceleration", desc: "Focused learning paths, execution sprints, and mentorship loops that help founders build with clarity and speed.", accent: "#1f4aa8", image: structuredAccelerationImg, imagePosition: "center" },
              { index: 2, title: "Funding Ecosystems", desc: "Access to venture capital networks, investor presentations, and funding support systems to unlock growth.", accent: "#1f4aa8", image: fundingEcosystemsImg, imagePosition: "center" },
              { index: 3, title: "Venture Registration", desc: "Support for legal compliance, governance, and startup structure to make scaling smoother and safer.", accent: "#1f4aa8", image: ventureRegistrationImg, imagePosition: "center" },
            ].map((card) => (
              <div key={card.index} className="about-closing-card">
                <img className="about-closing-card-image" src={card.image} alt="" style={{ objectPosition: card.imagePosition }} />
                <div className="about-closing-card-glow" style={{ background: `radial-gradient(ellipse at top right, ${card.accent}10, transparent 55%)` }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 4, height: 1, background: `linear-gradient(to right, transparent, ${card.accent}40, transparent)` }} />
                {/* Corner marks */}
                <div style={{ position: "absolute", top: 16, left: 16, zIndex: 4, width: 18, height: 18, borderTop: `1px solid ${card.accent}40`, borderLeft: `1px solid ${card.accent}40` }} />
                <div style={{ position: "absolute", bottom: 16, right: 16, zIndex: 4, width: 18, height: 18, borderBottom: `1px solid ${card.accent}40`, borderRight: `1px solid ${card.accent}40` }} />
                <div style={{ position: "relative", zIndex: 5 }}>
                  <span style={{ fontSize: "0.58rem", textTransform: "uppercase", letterSpacing: "0.55em", fontWeight: 700, color: card.accent }}>0{card.index + 1}</span>
                  <div style={{ height: 1, width: 36, margin: "0.75rem 0 2rem", background: card.accent, transition: "width 0.5s" }} />
                  <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem,3.5vw,3.5rem)", lineHeight: 1, color: "var(--white)" }}>{card.title}</h3>
                </div>
                <p style={{ position: "relative", zIndex: 5, color: "rgba(255,255,255,0.58)", fontWeight: 300, lineHeight: 1.75, fontSize: "0.92rem", transition: "color 0.5s" }}>{card.desc}</p>
              </div>
            ))}

            {/* FIN marker */}
            <div style={{ minWidth: "320px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.2rem", margin: "0 3rem" }}>
              <div style={{ width: 80, height: 1, background: "linear-gradient(to right, transparent, var(--green), transparent)" }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER LINE ───────────────────────────────────────────────── */}
      <div style={{ background: "rgba(0,0,0,0.98)", padding: "4rem 1.5rem", textAlign: "center" }}>
        <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem,5vw,5rem)", lineHeight: 1.05, color: "rgba(255,255,255,0.65)", margin: 0 }}>
          Built for founders. Built for Bengaluru. Built for the future.
        </p>
      </div>
      <div style={{ height: 1, background: "linear-gradient(to right, transparent, rgba(31,74,168,0.35), transparent)" }} />
    </div>
  );
}
