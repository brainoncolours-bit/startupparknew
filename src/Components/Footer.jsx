
import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../assets/logo.png';

// Custom SVG Social Icons (Lucide 1.8.0+ removed brand icons)
const XIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
  </svg>
);

const LinkedinIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const InstagramIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FacebookIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

export default function HyperAnimatedFooter() {
  const currentYear = new Date().getFullYear();
  const footerRef = useRef(null);
  const glowRef = useRef(null);

  // Real-time local cursor coordinate tracking for the ambient back-glow aura
  useEffect(() => {
    const footerElement = footerRef.current;
    if (!footerElement) return;

    const handleMouseMove = (e) => {
      if (!glowRef.current) return;
      const rect = footerElement.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Smooth dynamic positioning updates via CSS Variables
      glowRef.current.style.setProperty('--mouse-x', `${x}px`);
      glowRef.current.style.setProperty('--mouse-y', `${y}px`);
    };

    footerElement.addEventListener('mousemove', handleMouseMove);
    return () => {
      footerElement.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <footer 
      ref={footerRef}
      style={{
        background: '#040405',
        padding: '5rem 0 2.5rem',
        fontFamily: "'Syne', 'DM Sans', sans-serif",
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* 1. INFINITE CHROMATIC TOP SCANNER BAR (Animated top border substitute) */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: 'linear-gradient(90deg, transparent, #64c8ff, #ffffff, #3a8ecb, transparent)',
        backgroundSize: '200% 100%',
        animation: 'topScanMove 4s linear infinite',
        zIndex: 5
      }} />

      {/* 2. REAL-TIME INTERACTIVE CURSOR GLOW FIELD (Illuminates structural elements dynamically) */}
      <div 
        ref={glowRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(400px circle at var(--mouse-x, -999px) var(--mouse-y, -999px), rgba(100,200,255,0.06), transparent 80%)',
          pointerEvents: 'none',
          zIndex: 1,
          transition: 'background 0.1s ease'
        }}
      />

      {/* 3. CORE GEOMETRIC MATRIX OVERLAY */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.005) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.005) 1px, transparent 1px)',
        backgroundSize: '30px 30px',
        pointerEvents: 'none',
        opacity: 0.8,
        zIndex: 0
      }} />

      {/* Main Content Content Grid Layout Frame */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem',
        position: 'relative',
        zIndex: 2,
        display: 'grid',
        gridTemplateColumns: '1.4fr 1fr 1fr',
        gap: '4rem',
        alignItems: 'start'
      }} className="hyper-footer-grid">

        {/* Corporate Brand System Identity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img src={logo} alt="Startup Park Logo" style={{ height: '60px', width: 'auto' }} />
          </div>
          <p style={{
            fontSize: '0.85rem',
            lineHeight: 1.6,
            color: 'rgba(255,255,255,0.35)',
            maxWidth: '320px',
            margin: 0
          }}>
            India’s premium hyper-growth pipeline. We transform complex engineering concepts into inevitable market leaders.
          </p>
        </div>

        {/* Navigation Mapping Node Block */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '6px', height: '6px', background: '#64c8ff' }} />
            <span style={{ fontSize: '0.65rem', fontWeight: 900, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#64c8ff' }}>Core Systems //</span>
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { label: 'Launchpad Matrix', to: '/' },
              { label: 'Ecosystem Foundation', to: '/about' },
              { label: 'Accelerator Frameworks', to: '/services' },
              { label: 'Initialization Sprints', to: '/contact' }
            ].map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                style={({ isActive }) => ({
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
                  textDecoration: 'none',
                  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                  display: 'inline-block',
                  position: 'relative'
                })}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#64c8ff';
                  e.currentTarget.style.transform = 'translateX(6px)';
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.classList.contains('active')) {
                    e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
                  } else {
                    e.currentTarget.style.color = '#fff';
                  }
                  e.currentTarget.style.transform = 'none';
                }}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Global Syndicates & Communication Networks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '6px', height: '6px', background: '#64c8ff' }} />
            <span style={{ fontSize: '0.65rem', fontWeight: 900, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#64c8ff' }}>External Feeds //</span>
          </div>
          <div style={{ display: 'flex', gap: '0.85rem' }}>
            {[
              { icon: <XIcon size={18} />, label: 'X', href: '#' },
              { icon: <LinkedinIcon size={18} />, label: 'LinkedIn', href: '#' },
              { icon: <InstagramIcon size={18} />, label: 'Instagram', href: '#' },
              { icon: <FacebookIcon size={18} />, label: 'Facebook', href: '#' }
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                style={{
                  width: 44,
                  height: 44,
                  background: 'rgba(255,255,255,0.01)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'rgba(255,255,255,0.4)',
                  textDecoration: 'none',
                  transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  const target = e.currentTarget;
                  target.style.color = '#fff';
                  target.style.borderColor = '#64c8ff';
                  target.style.boxShadow = '0 0 15px rgba(100,200,255,0.3)';
                  target.style.transform = 'translateY(-5px) scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  const target = e.currentTarget;
                  target.style.color = 'rgba(255,255,255,0.4)';
                  target.style.borderColor = 'rgba(255,255,255,0.06)';
                  target.style.boxShadow = 'none';
                  target.style.transform = 'none';
                }}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Infrastructure Band */}
      <div style={{
        maxWidth: '1200px',
        margin: '4rem auto 0',
        padding: '2rem 2rem 0',
        borderTop: '1px solid rgba(255,255,255,0.03)',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        zIndex: 2,
        flexWrap: 'wrap',
        gap: '1.5rem',
        justifyContent: 'space-between'
      }} className="hyper-footer-bottom">
        <p style={{
          fontSize: '0.75rem',
          color: 'rgba(255,255,255,0.25)',
          margin: 0,
          letterSpacing: '0.05em'
        }}>
          © {currentYear} STARTUP PARK // INTERNAL INFRASTRUCTURE COMPILING COMPLETE. BY <span style={{ color: 'rgba(100,200,255,0.6)', cursor: 'pointer' }}>IQUE-VENTURES</span>
        </p>

        {/* Chromatic Status Indicator Loop Capsule */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          background: 'linear-gradient(135deg, rgba(100,200,255,0.02) 0%, rgba(255,255,255,0.01) 100%)',
          border: '1px solid rgba(100,200,255,0.12)',
          padding: '0.5rem 1.2rem',
          borderRadius: '4px',
          boxShadow: 'inset 0 0 12px rgba(100,200,255,0.02)'
        }}>
          <div style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#fff',
            boxShadow: '0 0 10px #fff, 0 0 20px #64c8ff',
            animation: 'chromaPulse 2.5s ease-in-out infinite'
          }} />
          <span style={{
            fontSize: '0.6rem',
            color: 'rgba(255,255,255,0.8)',
            fontWeight: 800,
            letterSpacing: '0.2em',
            textTransform: 'uppercase'
          }}>
            LAUNCHPAD ENGINE :: ONLINE
          </span>
        </div>
      </div>

      {/* Global CSS Inject Keys */}
      <style>{`
        @keyframes topScanMove {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }

        @keyframes chromaPulse {
          0%, 100% { transform: scale(1); opacity: 0.8; background: #64c8ff; }
          50% { transform: scale(1.3); opacity: 1; background: #ffffff; filter: drop-shadow(0 0 4px #64c8ff); }
        }

        @keyframes textGlitchPulse {
          0%, 94%, 100% { transform: skew(0deg); text-shadow: none; }
          95% { transform: skew(3deg, -1deg); text-shadow: 2px 0 #64c8ff, -1px 0 #fff; }
          97% { transform: skew(-2deg, 1deg); text-shadow: -2px 0 #64c8ff, 1px 0 #3a8ecb; }
        }

        @media (max-width: 968px) {
          .hyper-footer-grid {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
        }

        @media (max-width: 580px) {
          .hyper-footer-bottom {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 1.2rem !important;
          }
        }
      `}</style>
    </footer>
  );
}
