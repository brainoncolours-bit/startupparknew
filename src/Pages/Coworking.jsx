import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { 
  Building2, 
  Wifi, 
  Coffee, 
  Users2, 
  Calendar, 
  ArrowRight, 
  Compass, 
  Maximize2,
  ShieldCheck,
  Zap,
  Boxes,
  Lock
} from "lucide-react";

export default function Coworking() {
  const containerRef = useRef(null);
  
  // Track global scroll progression over the entire 5-section stack
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Smooth out scroll data to eliminate jerky trackpad behaviors
  const smoothScroll = useSpring(scrollYProgress, { stiffness: 90, damping: 22 });

  // Custom Parallax offsets mapped per section layer
  const heroBgY = useTransform(smoothScroll, [0, 0.25], ["0%", "25%"]);
  const heroTextY = useTransform(smoothScroll, [0, 0.25], ["0px", "80px"]);
  const splitImageY = useTransform(smoothScroll, [0.2, 0.55], ["-8%", "8%"]);
  const ctaGlowScale = useTransform(smoothScroll, [0.75, 1], [0.8, 1.1]);

  return (
    <div ref={containerRef} className="bg-black text-white selection:bg-blue-500/30 overflow-hidden font-sans antialiased">
      
      {/* SECTION 1: HERO ARCHITECTURE (DEEP PARALLAX LAYER) */}
      <section className="relative h-screen w-full flex items-center justify-center px-6 md:px-16 border-b border-neutral-900 overflow-hidden">
        {/* Parallax Background Structural Image */}
        <motion.div 
          style={{ y: heroBgY }}
          className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-center opacity-35 filter grayscale contrast-125 scale-105"
        />
        
        {/* Architectural grid overlay mask */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#141414_1px,transparent_1px),linear-gradient(to_bottom,#141414_1px,transparent_1px)] bg-[size:5rem_5rem] opacity-50 pointer-events-none z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />

        <motion.div style={{ y: heroTextY }} className="relative z-20 max-w-5xl text-center space-y-6 px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 text-xs font-mono tracking-wider mx-auto">
            <Compass className="w-3.5 h-3.5 text-blue-500 animate-pulse" /> Premium Coworking Node // Operational Alpha
          </div>
          
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight leading-none uppercase">
            Architected For <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-100 via-neutral-400 to-blue-500">
              High-Velocity Output
            </span>
          </h1>

          <p className="text-neutral-400 text-sm md:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
            A physical manifestation of raw performance. We have completely stripped away typical shared-office friction points to deliver private, enterprise-grade spatial layers configured for rapid scaling.
          </p>
        </motion.div>
        
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-[10px] font-mono text-neutral-500 tracking-widest uppercase">
          <span>Scroll to explore</span>
          <div className="w-[1px] h-12 bg-neutral-800 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-4 bg-blue-500 animate-bounce" />
          </div>
        </div>
      </section>


      {/* SECTION 2: SPATIAL METRICS (TECHNICAL SPEC GRID) */}
      <section className="py-32 px-6 md:px-16 border-b border-neutral-900 bg-neutral-950/30 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          <div className="lg:col-span-4 sticky top-28 space-y-6">
            <div className="text-xs font-mono text-blue-500 uppercase tracking-widest flex items-center gap-2">
              <Boxes className="w-4 h-4" /> 01 // Structural Framework
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase leading-tight">The Ecosystem Spec Sheet.</h2>
            <p className="text-neutral-400 text-sm leading-relaxed font-normal">
              Every square meter is meticulously configured to reduce baseline cognitive strain while optimizing processing speeds and secure localized workloads.
            </p>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: Wifi, title: "Gigabit Mesh Array", desc: "Redundant underground fiber uplinks delivering fully unthrottled, isolated Wi-Fi 7 sub-networks with low localized jitter arrays." },
              { icon: Coffee, title: "Fuel Crypt infrastructure", desc: "Custom craft extraction setups alongside endless automated single-origin espresso matrices available on-demand throughout runtime." },
              { icon: Building2, title: "Acoustic Huddle Labs", desc: "Completely sound-isolated meeting rooms wrapped in double-layered acoustic glass shells optimized for ultra-clear video capture." },
              { icon: ShieldCheck, title: "Tier-1 Access Controls", desc: "Encrypted biometric authentication channels and decentralized smartcard systems tracking space validation protocols safely." }
            ].map((metric, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="group border border-neutral-900 bg-neutral-950/50 p-8 rounded-xl backdrop-blur-sm hover:border-blue-500/30 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-neutral-900 flex items-center justify-center border border-neutral-800 mb-6 group-hover:border-blue-500/40 transition-colors">
                  <metric.icon className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-xl font-bold text-neutral-100 mb-3">{metric.title}</h3>
                <p className="text-sm text-neutral-400 leading-relaxed font-normal">{metric.desc}</p>
              </motion.div>
            ))}
          </div>

        </div>
      </section>


      {/* SECTION 3: IMMERSIVE VISUAL FOCUS (DYNAMIC PARALLAX BREAK) */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden border-b border-neutral-900">
        <motion.div 
          style={{ y: splitImageY, scale: 1.12 }}
          className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-center opacity-25 contrast-125 filter grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-10" />
        
        <div className="relative z-20 max-w-3xl text-center px-6 space-y-4">
          <div className="w-10 h-10 rounded-full border border-neutral-800 flex items-center justify-center mx-auto bg-black/60 backdrop-blur">
            <Maximize2 className="w-4 h-4 text-blue-500" />
          </div>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">Radical Isolation Modules.</h2>
          <p className="text-xs md:text-sm text-neutral-400 font-mono tracking-wider max-w-lg mx-auto">
            [ PHYSICAL SECTOR LOCK // GRID_LOCATION_08 // ENTERPRISE SUITES ]
          </p>
        </div>
      </section>


      {/* SECTION 4: ACCESS MATRICES (STRUCTURAL SYSTEM PRICING) */}
      <section className="py-32 px-6 md:px-16 border-b border-neutral-900 bg-black">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="text-xs font-mono text-blue-500 uppercase tracking-widest">02 // Network Integration Tiers</div>
              <h2 className="text-3xl md:text-6xl font-black tracking-tight uppercase">Spatial Capacities.</h2>
            </div>
            <p className="text-neutral-400 text-sm max-w-xs font-normal leading-relaxed">
              Select an infrastructure footprint tailored to your team's runtime velocity dependencies.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              { name: "Flex Hub", price: "$299", desc: "Dynamic roaming network keys matching rapid independent scale operations.", perks: ["9am - 6pm Structural Access", "Shared Ecosystem Slack Matrix", "Standard Gigabit Hotdesk Routers", "2 Boardroom Tokens per month"] },
              { name: "Dedicated Station", price: "$549", desc: "A permanently assigned, hardware-isolated personal workstation setup.", perks: ["24/7/365 Unlocked Bio-Entry", "100 Unmetered Print Units", "8 Boardroom Tokens per month", "Secure Under-desk Storage Nodes"], premium: true },
              { name: "Custom Suite", price: "$1,899", desc: "Fully enclosed glass structural partitions with custom hardware profiles.", perks: ["Dedicated Layer-2 VLAN Routing", "Infinite Meeting Room Reservations", "Custom Frontage Portal Branding", "Private Server Rack Power Lines"] }
            ].map((tier, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`flex flex-col justify-between p-8 md:p-10 rounded-2xl border ${tier.premium ? "border-blue-500 bg-neutral-950/80 shadow-[0_0_50px_rgba(59,130,246,0.05)]" : "border-neutral-900 bg-neutral-950/30"} space-y-8 relative overflow-hidden`}
              >
                {tier.premium && (
                  <div className="absolute top-0 right-0 bg-blue-500 text-black text-[9px] font-mono font-extrabold tracking-widest px-4 py-1 rounded-bl uppercase">
                    PRO_OPTIMIZED
                  </div>
                )}
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight text-neutral-100">{tier.name}</h3>
                    <p className="text-xs text-neutral-400 mt-2 min-h-[32px] leading-relaxed font-normal">{tier.desc}</p>
                  </div>
                  
                  <div className="flex items-baseline gap-1.5 py-2">
                    <span className="text-4xl md:text-5xl font-black font-mono tracking-tighter">{tier.price}</span>
                    <span className="text-neutral-500 text-xs font-mono">/ Month</span>
                  </div>
                  
                  <hr className="border-neutral-900" />
                  
                  <ul className="space-y-3.5">
                    {tier.perks.map((perk, pIdx) => (
                      <li key={pIdx} className="text-xs text-neutral-300 flex items-start gap-3 leading-normal font-normal">
                        <Zap className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button className={`w-full py-4 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-300 ${tier.premium ? "bg-white text-black hover:bg-blue-600 hover:text-white" : "bg-neutral-900 text-neutral-300 hover:bg-neutral-800"}`}>
                  Initialize Subsystem
                </button>
              </motion.div>
            ))}
          </div>

        </div>
      </section>


      {/* SECTION 5: ECOSYSTEM UPLINK (DYNAMIC ACTION TERMINAL) */}
      <section className="py-36 px-6 md:px-16 bg-[linear-gradient(to_bottom,transparent,#050505)] relative flex items-center justify-center overflow-hidden">
        {/* Animated ambient system background blur glow */}
        <motion.div 
          style={{ scale: ctaGlowScale }}
          className="absolute w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none z-0" 
        />
        
        <div className="max-w-3xl text-center space-y-8 relative z-10 px-4">
          <div className="w-12 h-12 rounded-xl bg-neutral-950 border border-neutral-900 flex items-center justify-center mx-auto shadow-xl">
            <Lock className="w-5 h-5 text-blue-500" />
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black tracking-tight uppercase leading-none">
            Secure Spatial <br />Allocation.
          </h2>
          
          <p className="text-sm md:text-base text-neutral-400 max-w-lg mx-auto leading-relaxed font-normal">
            Every onboarding node goes through a direct network verification layout. Book a localized hardware walk-through to clear your footprint.
          </p>
          
          <div className="pt-4">
            <button className="relative group px-10 py-4 bg-white text-black font-bold tracking-wider text-xs uppercase rounded-lg transition-all duration-300 hover:bg-blue-600 hover:text-white shadow-[0_0_40px_rgba(255,255,255,0.08)] inline-flex items-center gap-3">
              Request Site Access <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}