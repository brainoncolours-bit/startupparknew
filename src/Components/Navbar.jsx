import React, { Suspense, lazy, useState, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.png";

const NavCanvas = lazy(() => import("./NavCanvas"));

const navItems = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Gallary", to: "/blogs" },
  { label: "Membership", to: "/membership" },
  { label: "Coworking", to: "/coworking" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const [hoveredPath, setHoveredPath] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const MotionDiv = motion.div;

  const activeIndex = navItems.findIndex((item) => item.to === location.pathname);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">

      {/* ── MOBILE HEADER: logo + hamburger only, no pill bar ── */}
      <div className="md:hidden flex items-center justify-between px-4 pt-4 pb-2">
        <NavLink to="/" className="z-[60] transition-opacity hover:opacity-80">
          <img src={logo} alt="Startup Park" className="h-9 w-auto" />
        </NavLink>

        <button
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((v) => !v)}
          className="z-[60] relative flex flex-col justify-center items-center w-10 h-10 gap-[5px]"
        >
          <motion.span
            animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
            className="block w-6 h-[2px] bg-white origin-center"
          />
          <motion.span
            animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
            className="block w-6 h-[2px] bg-white"
          />
          <motion.span
            animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
            className="block w-6 h-[2px] bg-white origin-center"
          />
        </button>
      </div>

      {/* ── DESKTOP HEADER: logo + pill nav ── */}
      <div className="hidden md:flex items-center justify-center px-6 pt-8">
        {/* Logo — absolute left */}
        <NavLink
          to="/"
          className="absolute left-12 top-1/2 -translate-y-1/2 z-[60] transition-opacity hover:opacity-80"
        >
          <img src={logo} alt="Startup Park" className="h-11 w-auto" />
        </NavLink>

        {/* Pill nav */}
        <div className="relative flex w-[min(96vw,920px)] items-center justify-between rounded-full border border-white/12 bg-black/45 px-6 py-2 shadow-2xl backdrop-blur-2xl max-w-5xl">

          {/* Three.js Canvas Layer (lazy loaded) */}
          <div className="absolute inset-0 z-0 overflow-hidden rounded-full pointer-events-none">
            <Suspense fallback={null}>
              <NavCanvas activeIndex={activeIndex} />
            </Suspense>
          </div>

          <nav className="flex z-10 w-full items-center justify-between gap-3">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onMouseEnter={() => setHoveredPath(item.to)}
                onMouseLeave={() => setHoveredPath(null)}
                className={() =>
                  `relative z-10 flex-1 rounded-full px-1.5 sm:px-2 py-2.5 text-center text-[0.75rem] lg:text-[0.85rem] font-bold uppercase tracking-[0.12em] transition-all duration-700 ${
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
          </nav>
        </div>
      </div>

      {/* ── MOBILE DROPDOWN MENU ── */}
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