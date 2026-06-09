import React, { Suspense, lazy, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.png";

const NavCanvas = lazy(() => import("./NavCanvas"));

const navItems = [
  { label: "Home",         to: "/"          },
  { label: "About",        to: "/about"     },
  { label: "Services",     to: "/services"  },
  { label: "Gallery",      to: "/blogs"     },
  { label: "Founder Card", to: "/membership"},
  { label: "Investor Card",to: "/investor"  },
  { label: "Coworking",    to: "/coworking" },
  { label: "Contact",      to: "/contact"   },
];

const MotionSpan = motion.span;
const MotionDiv  = motion.div;

export default function Navbar() {
  const [hoveredPath, setHoveredPath] = useState(null);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const location = useLocation();

  const activeIndex = navItems.findIndex((item) => item.to === location.pathname);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">

      {/* ══════════════════════════════════════════
          MOBILE / TABLET  header  (below lg)
          Shows: logo left · hamburger right
      ══════════════════════════════════════════ */}
      <div className="lg:hidden flex items-center justify-between px-5 pt-4 pb-3">
        <NavLink to="/" onClick={() => setMenuOpen(false)} className="z-[60] transition-opacity hover:opacity-75">
          <img src={logo} alt="Startup Park" className="h-9 w-auto" />
        </NavLink>

        <button
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((v) => !v)}
          className="z-[60] relative flex flex-col justify-center items-center w-10 h-10 gap-[5px] shrink-0"
        >
          <MotionSpan
            animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.22 }}
            className="block w-6 h-[2px] bg-white origin-center"
          />
          <MotionSpan
            animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.18 }}
            className="block w-6 h-[2px] bg-white"
          />
          <MotionSpan
            animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.22 }}
            className="block w-6 h-[2px] bg-white origin-center"
          />
        </button>
      </div>

      {/* ══════════════════════════════════════════
          DESKTOP  header  (lg and above)
          Shows: logo absolute-left · pill nav centred
      ══════════════════════════════════════════ */}
      <div className="hidden lg:flex items-center justify-center px-6 pt-6 pb-0">

        {/* Logo */}
        <NavLink
          to="/"
          className="absolute left-10 top-[1.8rem] z-[60] transition-opacity hover:opacity-75"
        >
          <img src={logo} alt="Startup Park" className="h-10 w-auto" />
        </NavLink>

        {/* Pill */}
        <div className="relative flex w-full max-w-[900px] items-center justify-between rounded-full border border-white/[0.11] bg-black/50 px-4 py-1.5 shadow-2xl backdrop-blur-2xl">

          {/* Three.js ambient canvas */}
          <div className="absolute inset-0 z-0 overflow-hidden rounded-full pointer-events-none">
            <Suspense fallback={null}>
              <NavCanvas activeIndex={activeIndex} />
            </Suspense>
          </div>

          <nav className="relative z-10 flex w-full items-center justify-between gap-0.5">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onMouseEnter={() => setHoveredPath(item.to)}
                  onMouseLeave={() => setHoveredPath(null)}
                  className={
                    `relative flex-1 whitespace-nowrap rounded-full px-2 xl:px-3 py-2.5
                     text-center text-[0.68rem] xl:text-[0.75rem] font-bold uppercase
                     tracking-[0.05em] xl:tracking-[0.08em]
                     transition-colors duration-300
                     ${isActive ? "text-white" : "text-white/38 hover:text-white/75"}`
                  }
                >
                  {/* Active glow pill */}
                  {isActive && (
                    <MotionDiv
                      layoutId="active-glow"
                      className="absolute inset-0 z-[-1] rounded-full bg-white/[0.13] blur-[3px]"
                      transition={{ type: "spring", bounce: 0.18, duration: 0.7 }}
                    />
                  )}

                  {/* Hover pill */}
                  <AnimatePresence>
                    {hoveredPath === item.to && !isActive && (
                      <MotionDiv
                        layoutId="hover-pill"
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.85 }}
                        className="absolute inset-0 z-[-1] rounded-full bg-white/[0.06]"
                        transition={{ type: "spring", bounce: 0, duration: 0.35 }}
                      />
                    )}
                  </AnimatePresence>

                  <span className="relative leading-none">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          MOBILE DROPDOWN  (below lg, when open)
      ══════════════════════════════════════════ */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <MotionDiv
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
              className="lg:hidden fixed inset-0 z-[54] bg-black/40 backdrop-blur-sm"
            />

            {/* Drawer panel */}
            <MotionDiv
              key="drawer"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: [0.32, 0, 0.18, 1] }}
              className="lg:hidden fixed top-0 left-0 right-0 z-[55] bg-black/96 backdrop-blur-2xl border-b border-white/[0.08] pt-[4.5rem] pb-6 px-5"
            >
              {/* Divider under logo row */}
              <div className="h-px bg-white/[0.07] mb-2" />

              <nav className="flex flex-col">
                {navItems.map((item, i) => {
                  const isActive = location.pathname === item.to;
                  return (
                    <MotionDiv
                      key={item.to}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.22, ease: "easeOut" }}
                    >
                      <NavLink
                        to={item.to}
                        onClick={() => setMenuOpen(false)}
                        className={`
                          flex items-center gap-3 py-4 text-[0.8rem] font-bold
                          uppercase tracking-[0.28em]
                          border-b border-white/[0.06] last:border-b-0
                          transition-colors duration-200
                          ${isActive ? "text-white" : "text-white/38 hover:text-white/70"}
                        `}
                      >
                        {/* Active left-bar indicator */}
                        <span
                          className="shrink-0 h-3.5 w-[2px] rounded-full transition-all duration-300"
                          style={{ background: isActive ? "white" : "transparent" }}
                        />
                        {item.label}
                      </NavLink>
                    </MotionDiv>
                  );
                })}
              </nav>
            </MotionDiv>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}