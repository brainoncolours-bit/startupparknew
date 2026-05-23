import React, { Suspense, useState, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import logo from "../assets/logo.png";

const navItems = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Blogs", to: "/blogs" },
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

export default function Navbar() {
  const [hoveredPath, setHoveredPath] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const MotionDiv = motion.div;

  const activeIndex = navItems.findIndex((item) => item.to === location.pathname);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 pt-4 sm:pt-8 md:justify-center">
      {/* Logo — visible on mobile left, desktop absolute left */}
      <NavLink
        to="/"
        className="z-[60] transition-opacity hover:opacity-80 md:absolute md:left-12 md:top-1/2 md:-translate-y-1/2"
      >
        <img src={logo} alt="Startup Park" className="h-9 sm:h-11 w-auto" />
      </NavLink>

      {/* Desktop pill nav */}
      <div className="hidden md:flex relative w-[min(92vw,640px)] items-center justify-between rounded-full border border-white/12 bg-black/45 px-4 py-2 shadow-2xl backdrop-blur-2xl">
        {/* Three.js Canvas Layer */}
        <div className="absolute inset-0 z-0 overflow-hidden rounded-full pointer-events-none">
          <Canvas dpr={0.75} camera={{ position: [0, 0, 5], fov: 26 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <Suspense fallback={null}>
              <ActiveLight activeIndex={activeIndex} />
            </Suspense>
          </Canvas>
        </div>

        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onMouseEnter={() => setHoveredPath(item.to)}
            onMouseLeave={() => setHoveredPath(null)}
            className={() =>
              `relative z-10 flex-1 rounded-full px-3 py-2.5 text-center text-[0.8rem] font-bold uppercase tracking-[0.35em] transition-all duration-700 ${
                location.pathname === item.to
                  ? "text-white scale-105"
                  : "text-white/40 hover:text-white/80"
              }`
            }
          >
            {location.pathname === item.to && (
              <MotionDiv
                layoutId="active-glow"
                className="absolute inset-0 z-[-1] rounded-full bg-white/14 blur-[4px]"
                transition={{ type: "spring", bounce: 0.2, duration: 0.8 }}
              />
            )}
            <AnimatePresence>
              {hoveredPath === item.to && location.pathname !== item.to && (
                <MotionDiv
                  layoutId="hover-pill"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute inset-0 z-[-1] rounded-full bg-white/6"
                  transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                />
              )}
            </AnimatePresence>
            <span className="relative">{item.label}</span>
          </NavLink>
        ))}
      </div>

      {/* Hamburger button — mobile only */}
      <button
        className="md:hidden z-[60] flex flex-col justify-center items-center w-10 h-10 gap-[5px]"
        onClick={() => setMenuOpen((v) => !v)}
        aria-label="Toggle menu"
      >
        <motion.span
          animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
          className="block w-6 h-[2px] bg-white origin-center transition-all"
        />
        <motion.span
          animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
          className="block w-6 h-[2px] bg-white"
        />
        <motion.span
          animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
          className="block w-6 h-[2px] bg-white origin-center transition-all"
        />
      </button>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="md:hidden fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-2xl border-b border-white/10 pt-20 pb-8 px-6 flex flex-col gap-2"
          >
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className={() =>
                  `py-3 text-sm font-bold uppercase tracking-[0.3em] border-b border-white/5 transition-colors ${
                    location.pathname === item.to
                      ? "text-white"
                      : "text-white/40"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
