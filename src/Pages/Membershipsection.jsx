import React, {
  useLayoutEffect,
  useRef,
  Suspense,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  PerspectiveCamera,
  Environment,
} from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });
useGLTF.preload("/card.glb");

function pseudoRandom(index, salt = 0) {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function refreshAfterLayout() {
  const frameIds = [];
  frameIds.push(
    window.requestAnimationFrame(() => {
      frameIds.push(
        window.requestAnimationFrame(() => {
          window.__lenis?.resize?.();
          ScrollTrigger.refresh();
        })
      );
    })
  );
  return () => frameIds.forEach((id) => window.cancelAnimationFrame(id));
}

function ScatteredCards({ sectionRef, onReady }) {
  const { scene: cardScene } = useGLTF("/card.glb");
  const meshRef = useRef();
  const rotationStateRef = useRef([]);
  const isVisibleRef = useRef(false);
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
          index * 0.02
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

    onReady?.();

    return () => ctx.revert();
  }, [scatterData, sectionRef, onReady]);

  useEffect(() => {
    if (!sectionRef.current) return;
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      onEnter: () => { isVisibleRef.current = true; },
      onLeave: () => { isVisibleRef.current = false; },
      onEnterBack: () => { isVisibleRef.current = true; },
      onLeaveBack: () => { isVisibleRef.current = false; },
    });
    return () => trigger.kill();
  }, [sectionRef]);

  useFrame((state) => {
    if (!meshRef.current || !isVisibleRef.current) return;
    const time = state.clock.getElapsedTime();
    for (let i = 0; i < cardCount; i++) {
      const data = scatterData[i];
      const rotationState = rotationStateRef.current[i];
      rotationState.rotX += data.rotSpeedX;
      rotationState.rotY += data.rotSpeedY;
      tempObject.position.set(
        data.x,
        data.y + Math.sin(time * data.driftSpeed + i) * 1.2,
        data.z
      );
      tempObject.rotation.set(
        rotationState.rotX,
        rotationState.rotY,
        rotationState.rotZ
      );
      tempObject.scale.set(0.2, 0.2, 0.2);
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

const TIERS = [
  {
    id: "founder",
    label: "Founder",
    tagline: "Begin your journey",
    price: "₹4,999",
    period: "/ year",
    badge: null,
    borderColor: "rgba(255,255,255,0.12)",
    glowColor: "rgba(255,255,255,0.06)",
    perks: [
      "Hot-desk access (10 days/month)",
      "Community Slack & events",
      "Monthly masterclass access",
      "Startup directory listing",
      "Pitch deck review (1x/quarter)",
    ],
    cta: "Get Started",
    featured: false,
  },
  {
    id: "accelerator",
    label: "Accelerator",
    tagline: "Scale with velocity",
    price: "₹14,999",
    period: "/ year",
    badge: "Most Popular",
    borderColor: "rgba(255,255,255,0.38)",
    glowColor: "rgba(255,255,255,0.10)",
    perks: [
      "Dedicated desk (unlimited access)",
      "Priority investor intros",
      "Weekly 1:1 mentor sessions",
      "Legal & cap-table support",
      "Demo Day participation",
      "Full event suite access",
      "Funding milestone tracking",
    ],
    cta: "Join Now",
    featured: true,
  },
  {
    id: "visionary",
    label: "Visionary",
    tagline: "Lead the ecosystem",
    price: "₹39,999",
    period: "/ year",
    badge: null,
    borderColor: "rgba(255,255,255,0.12)",
    glowColor: "rgba(255,255,255,0.06)",
    perks: [
      "Private office suite",
      "Board-room access (unlimited)",
      "Dedicated relationship manager",
      "Exclusive LP & VC network",
      "Co-branding opportunities",
      "Priority media placement",
      "IPO readiness consultancy",
      "Annual summit VIP pass",
    ],
    cta: "Apply Now",
    featured: false,
  },
];

function StatCounter({ target, suffix = "", prefix = "" }) {
  const elRef = useRef(null);
  const hasRun = useRef(false);

  useLayoutEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 88%",
      onEnter: () => {
        if (hasRun.current) return;
        hasRun.current = true;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1.8,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent =
              prefix +
              Math.round(obj.val).toLocaleString("en-IN") +
              suffix;
          },
        });
      },
    });

    return () => trigger.kill();
  }, [target, suffix, prefix]);

  return (
    <span ref={elRef}>
      {prefix}0{suffix}
    </span>
  );
}

function MembershipCard({ tier, index, containerRef }) {
  const cardRef = useRef(null);
  const glowRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e) => {
      if (!cardRef.current || !glowRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      glowRef.current.style.background = `radial-gradient(320px circle at ${x}px ${y}px, ${tier.glowColor}, transparent 70%)`;
    },
    [tier.glowColor]
  );

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    if (glowRef.current) glowRef.current.style.background = "transparent";
  }, []);

  useLayoutEffect(() => {
    const card = cardRef.current;
    if (!card || !containerRef?.current) return;

    gsap.fromTo(
      card,
      { y: 60, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 1.0,
        ease: "power3.out",
        delay: index * 0.15,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 72%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, [index, containerRef]);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative flex flex-col"
      style={{
        opacity: 0,
        border: `1px solid ${tier.borderColor}`,
        background: tier.featured
          ? "linear-gradient(160deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)"
          : "rgba(255,255,255,0.02)",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        transition: "border-color 0.4s ease, transform 0.4s ease",
      }}
    >
      <div
        ref={glowRef}
        className="pointer-events-none absolute inset-0 z-0"
        style={{ transition: "background 0.15s ease" }}
      />

      {tier.badge && (
        <div className="absolute -top-[13px] left-1/2 -translate-x-1/2 z-20">
          <span className="bg-white text-black text-[0.6rem] font-black tracking-[0.25em] uppercase px-4 py-1">
            {tier.badge}
          </span>
        </div>
      )}

      <div className="relative z-10 flex flex-col h-full p-8 lg:p-10">
        <div className="mb-8">
          <p className="text-[0.65rem] tracking-[0.4em] uppercase text-white/35 font-bold mb-2">
            {tier.tagline}
          </p>
          <h3 className="font-serif text-[2.2rem] font-medium leading-none tracking-[-0.03em] text-white mb-6 uppercase">
            {tier.label}
          </h3>
          <div className="flex items-baseline gap-1">
            <span className="font-serif text-[2.6rem] font-semibold leading-none text-white">
              {tier.price}
            </span>
            <span className="text-white/35 text-sm font-light">
              {tier.period}
            </span>
          </div>
        </div>

        <div className="h-[1px] bg-white/10 mb-8" />

        <ul className="flex flex-col gap-3.5 flex-1 mb-10">
          {tier.perks.map((perk, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                className="mt-[3px] shrink-0 w-[18px] h-[18px] flex items-center justify-center"
                style={{ border: "1px solid rgba(255,255,255,0.25)" }}
              >
                <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                  <path
                    d="M1 3L3 5L7 1"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="text-[0.9rem] leading-snug text-white/60 font-light">
                {perk}
              </span>
            </li>
          ))}
        </ul>

        <button
          className="w-full py-3.5 text-[0.75rem] font-black tracking-[0.25em] uppercase transition-all duration-300"
          style={
            tier.featured
              ? { background: "white", color: "black" }
              : {
                  background: "transparent",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.25)",
                }
          }
          onMouseEnter={(e) => {
            if (!tier.featured) {
              e.currentTarget.style.background = "white";
              e.currentTarget.style.color = "black";
              e.currentTarget.style.borderColor = "white";
            }
          }}
          onMouseLeave={(e) => {
            if (!tier.featured) {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "white";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
            }
          }}
        >
          {tier.cta}
        </button>
      </div>
    </div>
  );
}

export default function Membershipsection() {
  const [windowLoaded, setWindowLoaded] = useState(
    () => document.readyState === "complete"
  );
  const [fontsReady, setFontsReady] = useState(
    () => !document.fonts || document.fonts.status === "loaded"
  );
  const [scatterSceneReady, setScatterSceneReady] = useState(false);

  const markScatterSceneReady = useCallback(
    () => setScatterSceneReady(true),
    []
  );

  const refreshReady =
    windowLoaded && fontsReady && scatterSceneReady;

  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const subheadRef = useRef(null);
  const statsRef = useRef(null);
  const cardsContainerRef = useRef(null);
  const compareRef = useRef(null);

  const scatterSectionRef = useRef(null);
  const scatterTextRef = useRef(null);

  const featureSectionRef = useRef(null);
  const featureHeaderRef = useRef(null);
  const featureRowsRef = useRef([]);

  useEffect(() => {
    if (document.readyState === "complete") {
      setWindowLoaded(true);
      return undefined;
    }
    const handleLoad = () => setWindowLoaded(true);
    window.addEventListener("load", handleLoad, { once: true });
    return () => window.removeEventListener("load", handleLoad);
  }, []);

  useEffect(() => {
    if (!document.fonts || document.fonts.status === "loaded") {
      setFontsReady(true);
      return undefined;
    }
    let isActive = true;
    document.fonts.ready.then(() => {
      if (isActive) setFontsReady(true);
    });
    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (!refreshReady) return undefined;
    return refreshAfterLayout();
  }, [refreshReady]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      tl.fromTo(
        headerRef.current,
        { y: 30, autoAlpha: 0, letterSpacing: "0.55em" },
        {
          y: 0,
          autoAlpha: 1,
          letterSpacing: "0.42em",
          duration: 0.7,
          ease: "power3.out",
        }
      )
        .fromTo(
          subheadRef.current,
          { y: 24, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.9, ease: "power3.out" },
          "-=0.4"
        )
        .fromTo(
          statsRef.current,
          { y: 20, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.8, ease: "power3.out" },
          "-=0.5"
        );
    }, sectionRef);

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
        }
      );
    }, scatterSectionRef);

    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    if (!compareRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        compareRef.current,
        { y: 30, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: compareRef.current,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });
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
        }
      );

      rows.forEach((row, index) => {
        const content = row.querySelector(".row-content");
        const line = row.querySelector(".row-line");

        tl.fromTo(
          content,
          { y: 120, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 1.1, ease: "power4.out" },
          index === 0 ? ">-0.4" : "-=0.9"
        ).fromTo(
          line,
          { scaleX: 0 },
          { scaleX: 1, duration: 1.3, ease: "expo.out" },
          "<0.2"
        );
      });
    }, featureSectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <main className="w-full bg-black">

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
            frameloop="demand"
          >
            <PerspectiveCamera makeDefault position={[0, 0, 20]} fov={40} />
            <ambientLight intensity={1.5} />
            <Environment preset="city" />
            <Suspense fallback={null}>
              <ScatteredCards
                sectionRef={scatterSectionRef}
                onReady={markScatterSceneReady}
              />
            </Suspense>
          </Canvas>
        </div>

        <div
          ref={scatterTextRef}
          className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl group cursor-default"
          style={{ opacity: 0 }}
        >
          <div className="mb-10 transition-opacity duration-700 ease-out opacity-100 md:opacity-20 md:group-hover:opacity-100">
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

          <h3 className="text-white text-[clamp(0.8rem,2vw,1.1rem)] tracking-[0.4em] font-bold uppercase mb-12 transition-opacity duration-700 ease-out opacity-100 md:opacity-20 md:group-hover:opacity-100">
            Our Foundation &amp; Driven Impact
          </h3>

          <p className="text-[clamp(1.8rem,4vw,3.5rem)] leading-[1.3] text-white transition-opacity duration-1000 ease-in-out font-light opacity-100 md:opacity-20 md:group-hover:opacity-100">
            Powering bold choices with over{" "}
            <span className="font-semibold">200+ startups supported</span>,
            helping networks unlock{" "}
            <span className="font-semibold">₹600 Cr+ in accessed funding</span>
            , and enabling over{" "}
            <span className="font-semibold">10,000+ new jobs</span> across
            competitive tech markets.
          </p>
        </div>
      </section>

      <section
        ref={sectionRef}
        className="relative overflow-hidden bg-black text-white"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.04),transparent_55%)]" />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-white/5" />

        <div className="relative mx-auto max-w-6xl px-6 py-24 sm:px-10 sm:py-28 lg:px-16 lg:py-32">

          <div className="mb-20 flex items-center gap-6">
            <span className="h-[1px] flex-1 bg-white/10" />
            <span
              ref={headerRef}
              className="text-[0.7rem] font-bold tracking-[0.5em] uppercase text-white/40"
              style={{ opacity: 0 }}
            >
              Membership Tiers
            </span>
            <span className="h-[1px] flex-1 bg-white/10" />
          </div>

          <div
            ref={subheadRef}
            className="text-center mb-6"
            style={{ opacity: 0 }}
          >
            <h2 className="font-serif text-[clamp(2.8rem,6vw,5.5rem)] font-semibold leading-[1.0] tracking-[-0.04em] uppercase text-white mx-auto">
              Choose Your
              <br />
              <span className="italic font-light text-white/60">
                Growth Path
              </span>
            </h2>
            <p className="mt-6 mx-auto max-w-[52ch] text-[1rem] leading-relaxed text-white/45 font-light">
              Every membership is a partnership. We grow when you grow — pick
              the tier that matches your stage, and we'll close the gap to the
              next.
            </p>
          </div>

          <div
            ref={statsRef}
            className="mx-auto max-w-3xl mt-12 mb-20 grid grid-cols-3 divide-x divide-white/10 border border-white/10"
            style={{ opacity: 0 }}
          >
            {[
              { value: 200, suffix: "+", prefix: "", label: "Startups supported" },
              { value: 600, suffix: " Cr+", prefix: "₹", label: "Funding unlocked" },
              { value: 10000, suffix: "+", prefix: "", label: "Jobs created" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center py-6 px-4">
                <p className="font-serif text-[clamp(1.6rem,3.5vw,2.4rem)] font-semibold text-white leading-none">
                  <StatCounter
                    target={stat.value}
                    suffix={stat.suffix}
                    prefix={stat.prefix}
                  />
                </p>
                <p className="text-[0.65rem] tracking-[0.2em] uppercase text-white/35 mt-2 font-bold">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div ref={cardsContainerRef} className="grid gap-5 md:grid-cols-3">
            {TIERS.map((tier, index) => (
              <MembershipCard
                key={tier.id}
                tier={tier}
                index={index}
                containerRef={cardsContainerRef}
              />
            ))}
          </div>

          <div
            ref={compareRef}
            className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4 text-center"
            style={{ opacity: 0 }}
          >
            <p className="text-white/30 text-sm font-light">
              All memberships include GST. Need a custom enterprise plan?
            </p>
            <button className="text-white/60 text-sm font-semibold underline underline-offset-4 decoration-white/20 hover:text-white hover:decoration-white transition-all duration-200">
              Talk to us →
            </button>
          </div>

          <div className="mt-20 h-[1px] bg-white/10" />
        </div>
      </section>

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
    </main>
  );
}
