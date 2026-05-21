import React, { useLayoutEffect, useRef, Suspense, useEffect, useMemo } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, Environment, PresentationControls, Center } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

// --- Interactive 3D Geometric Mesh Core ---
function ContactMeshCore({ scrollTriggerRef, meshGroupRef }) {
  const innerMeshRef = useRef();

  // Create a sleek technical geometry mapping the high-end CRED design system
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(3.5, 1), []);
  const material = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#ffffff",
    roughness: 0.15,
    metalness: 0.9,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    wireframe: true
  }), []);

  useLayoutEffect(() => {
    if (!meshGroupRef.current) return;

    // Orchestrate full scroll-driven state transformations
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scrollTriggerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
        invalidateOnRefresh: true,
      }
    });

    // Step 1: Shift and Scale towards the Partnership side layout
    tl.to(meshGroupRef.current.position, { x: -4, y: 0, z: 2, duration: 2, ease: "power2.inOut" }, 0)
      .to(meshGroupRef.current.scale, { x: 0.85, y: 0.85, z: 0.85, duration: 2 }, 0);

    // Step 2: Push deeper and shift layout context for Support/Press systems
    tl.to(meshGroupRef.current.position, { x: 4, y: -0.5, z: 0, duration: 2, ease: "power2.inOut" }, 2)
      .to(meshGroupRef.current.scale, { x: 1.1, y: 1.1, z: 1.1, duration: 2 }, 2);

    return () => { if (tl.scrollTrigger) tl.scrollTrigger.kill(); };
  }, [scrollTriggerRef, meshGroupRef]);

  // Handle continuous real-time drifting micro-animations
  useFrame((state, delta) => {
    if (innerMeshRef.current) {
      innerMeshRef.current.rotation.y += delta * 0.15;
      innerMeshRef.current.rotation.x += delta * 0.08;
      // Elegant floating micro-drift
      innerMeshRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.8) * 0.15;
    }
  });

  return (
    <group ref={meshGroupRef}>
      <PresentationControls 
        global={false} 
        cursor={true} 
        snap={true} 
        speed={1.5} 
        zoom={1} 
        polar={[-Math.PI / 4, Math.PI / 4]} 
        azimuth={[-Math.PI / 4, Math.PI / 4]}
      >
        <mesh ref={innerMeshRef} geometry={geometry} material={material} />
      </PresentationControls>
    </group>
  );
}

export default function Contact() {
  const globalContainerRef = useRef(null);
  const canvasStickyRef = useRef(null);
  const meshGroupRef = useRef(null);

  // Form handling & Row Animation references 
  const rowRefs = useRef([]);
  const formHeaderRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Clean typography entries for content layers
      const rows = rowRefs.current.filter(Boolean);
      
      rows.forEach((row) => {
        const titleText = row.querySelector(".row-title");
        const detailsText = row.querySelector(".row-details");
        const separationLine = row.querySelector(".row-line");

        const rowTl = gsap.timeline({
          scrollTrigger: {
            trigger: row,
            start: "top 85%",
            toggleActions: "play none none reverse",
          }
        });

        rowTl.fromTo([titleText, detailsText], 
          { y: 40, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" }
        )
        .fromTo(separationLine,
          { scaleX: 0 },
          { scaleX: 1, duration: 1.2, ease: "expo.out" },
          "<0.2"
        );
      });

      // Stagger General Enquiries Form Elements
      gsap.fromTo(".form-element", 
        { autoAlpha: 0, y: 30 },
        {
          autoAlpha: 1,
          y: 0,
          stagger: 0.15,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: "#general-form-section",
            start: "top 65%",
          }
        }
      );
    }, globalContainerRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={globalContainerRef} className="w-full bg-black text-white selection:bg-white selection:text-black">
      
      {/* PERSISTENT 3D CANVAS TRACKING SYSTEM CONTAINER */}
      <div ref={canvasStickyRef} className="pointer-events-none fixed inset-0 z-10 h-screen w-full">
        <Canvas dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
          <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={38} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          <directionalLight position={[-10, 8, 5]} intensity={1} />
          <Environment preset="studio" />
          <Suspense fallback={null}>
            <ContactMeshCore scrollTriggerRef={globalContainerRef} meshGroupRef={meshGroupRef} />
          </Suspense>
        </Canvas>
      </div>

      {/* SECTION 1: HERO & GENERAL ENQUIRIES */}
      <section id="general-form-section" className="relative z-20 grid min-h-screen w-full items-center px-6 pt-32 sm:px-10 lg:grid-cols-2 lg:px-24">
        <div className="flex flex-col justify-center max-w-xl">
          <h1 className="font-serif text-[clamp(3.5rem,7vw,6.5rem)] font-semibold leading-[0.9] tracking-[-0.05em] mb-8">
            reach the <br/>club.
          </h1>
          <p className="text-gray-400 text-[1.1rem] leading-relaxed mb-12 max-w-[420px]">
            have structural inquiries, experiences feedback, or membership placement questions? leave your signal below.
          </p>

          {/* Minimalist interactive Form Design */}
          <form onSubmit={(e) => e.preventDefault()} className="pointer-events-auto flex flex-col gap-8 w-full">
            <div className="form-element relative border-b border-white/20 pb-3 focus-within:border-white transition-colors duration-300">
              <label className="block text-[0.65rem] font-bold tracking-[0.3em] uppercase text-white/40 mb-2">identity</label>
              <input type="text" placeholder="your name" className="w-full bg-transparent text-[1.2rem] outline-none placeholder:text-white/20 font-light" />
            </div>
            
            <div className="form-element relative border-b border-white/20 pb-3 focus-within:border-white transition-colors duration-300">
              <label className="block text-[0.65rem] font-bold tracking-[0.3em] uppercase text-white/40 mb-2">comms channel</label>
              <input type="email" placeholder="your email address" className="w-full bg-transparent text-[1.2rem] outline-none placeholder:text-white/20 font-light" />
            </div>

            <div className="form-element relative border-b border-white/20 pb-3 focus-within:border-white transition-colors duration-300">
              <label className="block text-[0.65rem] font-bold tracking-[0.3em] uppercase text-white/40 mb-2">intent</label>
              <textarea rows="2" placeholder="describe the ascension or support requested" className="w-full bg-transparent text-[1.2rem] outline-none placeholder:text-white/20 font-light resize-none" />
            </div>

            <button type="submit" className="form-element self-start mt-4 px-8 py-4 border border-white/20 rounded-full hover:border-white hover:bg-white hover:text-black font-semibold text-[0.85rem] tracking-[0.2em] uppercase transition-all duration-400">
              transmit signal
            </button>
          </form>
        </div>
        <div className="hidden lg:block" /> {/* Holds spacing layout structure for the 3D canvas object position */}
      </section>

      {/* SECTION 2: STRATEGIC PARTNERSHIPS */}
      <section className="relative z-20 grid min-h-screen w-full items-center px-6 sm:px-10 lg:grid-cols-2 lg:px-24 bg-black/40 backdrop-blur-sm">
        <div className="hidden lg:block" /> {/* Holds spacing layout structure for the 3D canvas object position */}
        <div className="flex flex-col justify-center max-w-xl lg:pl-12">
          <span className="text-[0.65rem] font-bold tracking-[0.5em] uppercase text-white/40 mb-6">alliances</span>
          <h2 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-light italic leading-[1.05] tracking-[-0.03em] mb-8">
            accelerate <br/><span className="font-semibold not-italic text-white">your brand.</span>
          </h2>
          <p className="text-white/60 text-[1.15rem] leading-relaxed mb-10 font-light">
            integrate your high-tier institutional benefits or commercial retail ecosystems into the premium club distribution framework.
          </p>
          <a href="mailto:partnerships@club.io" className="pointer-events-auto self-start text-[1.1rem] font-medium underline underline-offset-8 decoration-white/20 hover:decoration-white transition-colors">
            partnerships@club.io &rarr;
          </a>
        </div>
      </section>

      {/* SECTION 3: EDITORIAL, SUPPORT & LOCATIONS ROW BREAKDOWN */}
      <section className="relative z-20 min-h-screen w-full bg-black py-32">
        <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">
          
          <div className="mb-24 flex items-center gap-6">
            <span className="h-[1px] flex-1 bg-white/10" />
            <span ref={formHeaderRef} className="text-[0.7rem] font-bold tracking-[0.5em] uppercase text-white/40">directories</span>
            <span className="h-[1px] flex-1 bg-white/10" />
          </div>

          <div className="flex flex-col w-full">
            {[
              { title: "press & media", details: "media@club.io — accessing creative global lookbooks, brand assets, and systemic performance data.", link: "mailto:media@club.io" },
              { title: "corporate desk", details: "level 4, architectural block alpha, tech enclave district, ind.", link: "#" },
              { title: "security response", details: "trust@club.io — reporting structural flaws or demanding zero trace data processing protocols.", link: "mailto:trust@club.io" }
            ].map((item, i) => (
              <div 
                key={i}
                ref={(node) => { rowRefs.current[i] = node; }}
                className="relative overflow-hidden group pointer-events-auto"
              >
                <a href={item.link} className="row-content grid gap-6 py-14 md:grid-cols-[1.5fr_2fr] md:items-center cursor-pointer block">
                  <h3 className="row-title font-sans text-[clamp(1.8rem,3vw,2.8rem)] font-bold tracking-[-0.05em] uppercase text-white/40 group-hover:text-white transition-colors duration-500">
                    {item.title}
                  </h3>
                  <p className="row-details text-white/50 group-hover:text-white/90 text-[1.1rem] leading-relaxed font-light transition-colors duration-500 md:max-w-xl">
                    {item.details}
                  </p>
                </a>
                <div className="row-line absolute bottom-0 left-0 h-[1px] w-full bg-white/10 origin-left" />
              </div>
            ))}
          </div>

        </div>
      </section>

      <div className="h-[20vh] bg-black" />
    </main>
  );
}