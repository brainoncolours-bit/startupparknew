import React from "react";
import { CheckCircle2 } from "lucide-react";

const benefits = [
  "1 seat for 1 month at Startup Park",
  "Startup research and market intelligence",
  "Legal and compliance guidance",
  "Branding and personal branding benefits",
  "Media and advertising support",
  "Incubation workshop access",
  "Inverstors community membership",
  "Startup tools and software offers",
  "Skill and career support",
  "HR training",
];

export default function CardSections({ onPreBook }) {
  return (
    <>
      <section className="relative min-h-screen bg-black text-white flex items-center px-6 md:px-16 py-20">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#141414_1px,transparent_1px)] bg-[size:6rem] opacity-30 pointer-events-none" />

        <div className="relative w-full max-w-6xl mx-auto space-y-20">

          {/* ── TOP SECTION: Cards side-by-side ── */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">

            {/* ── Card 1: Investors Card (image) ── */}
            <div className="flex flex-col items-center gap-4 w-full lg:w-auto">
              {/* Live badge */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-500/40 bg-blue-500/10 text-blue-400 text-[10px] font-semibold uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                Available Now
              </span>

              {/* Card image with float animation */}
              <div className="relative h-[380px] lg:h-[52vh] w-full max-w-xs lg:max-w-sm flex items-center justify-center">
                <div className="relative w-[80%] max-w-[260px] animate-float-card">
                  <img
                    src="/goldcard.png"
                    alt="Investors Card"
                    className="w-full h-auto object-contain drop-shadow-[0_8px_40px_rgba(59,130,246,0.25)] rounded-2xl"
                    style={{ filter: "drop-shadow(0 0 24px rgba(59,130,246,0.18))" }}
                  />
                </div>
              </div>

              <p className="text-neutral-400 text-xs tracking-wide font-medium">Founder Card Gold</p>
            </div>

            {/* ── Divider (vertical on desktop, horizontal on mobile) ── */}
            <div className="hidden lg:flex flex-col items-center gap-3 self-stretch justify-center">
              <div className="w-px flex-1 bg-gradient-to-b from-transparent via-neutral-700 to-transparent" />
              <span className="text-[10px] font-semibold text-neutral-600 uppercase tracking-widest rotate-0">+</span>
              <div className="w-px flex-1 bg-gradient-to-b from-transparent via-neutral-700 to-transparent" />
            </div>
            <div className="flex lg:hidden w-full items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-neutral-700 to-transparent" />
              <span className="text-[10px] font-semibold text-neutral-600 uppercase tracking-widest">+</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-neutral-700 to-transparent" />
            </div>

            {/* ── Card 2: Premium Investor Card (coming soon) ── */}
            <div className="flex flex-col items-center gap-4 w-full lg:w-auto">
              {/* Coming soon badge */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-400 text-[10px] font-semibold uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                Coming Soon
              </span>

              {/* Card image with glow + shimmer overlay */}
              <div className="relative h-[380px] lg:h-[52vh] w-full max-w-xs lg:max-w-sm flex items-center justify-center">

                {/* Ambient glow behind card */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500/10 via-transparent to-yellow-600/10 blur-2xl pointer-events-none" />

                {/* Floating animation wrapper */}
                <div className="relative w-[80%] max-w-[260px] animate-float-card">
                  {/* Frosted lock overlay */}
                  <div className="absolute inset-0 rounded-2xl z-10 bg-black/20 backdrop-blur-[1px] flex flex-col items-center justify-center gap-2 opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="text-amber-400 text-[10px] font-semibold tracking-widest uppercase">Coming Soon</span>
                  </div>

                  {/* Shimmer strip */}
                  <div
                    className="absolute inset-0 rounded-2xl z-10 pointer-events-none overflow-hidden"
                    style={{ animation: "shimmer 3s ease-in-out infinite" }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent -translate-x-full" style={{ animation: "shimmerSlide 3s ease-in-out infinite" }} />
                  </div>

                  {/* Actual card image */}
                  <img
                    src="/founderscard.png"
                    alt="Premium Investor Card – Coming Soon"
                    className="w-full h-auto object-contain drop-shadow-[0_8px_40px_rgba(251,191,36,0.25)] rounded-2xl"
                    style={{ filter: "drop-shadow(0 0 24px rgba(251,191,36,0.18))" }}
                  />
                </div>
              </div>

              <p className="text-neutral-400 text-xs tracking-wide font-medium">Founder Card Platinum</p>
            </div>
          </div>

          {/* ── BOTTOM SECTION: Text + Benefits + CTA ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

            {/* Heading + description */}
            <div className="lg:col-span-5 space-y-4">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-100 leading-tight">
                The Next Gen <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-100 to-neutral-400">
                  Founder Card
                </span>
              </h1>
              <p className="text-neutral-400 text-base leading-relaxed font-normal max-w-xl">
                It unlocks the Startup Park ecosystem. With this card, a founder
                gets access to premium utilities designed to scale ideas into
                empires.
              </p>

              <button
                onClick={onPreBook}
                className="mt-4 px-8 py-3.5 bg-white text-black font-semibold tracking-wider text-xs uppercase rounded-md transition-all duration-300 hover:bg-blue-600 hover:text-white shadow-[0_0_30px_rgba(255,255,255,0.05)]"
              >
                Pre-book Now
              </button>
            </div>

            {/* Benefits grid */}
            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {benefits.map((benefit, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 border border-neutral-900 bg-neutral-950/40 p-3 rounded-lg backdrop-blur-sm"
                >
                  <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <span className="text-xs md:text-sm text-neutral-300 font-medium leading-normal">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Keyframe animations injected via style tag */}
      <style>{`
        @keyframes floatY {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes shimmerSlide {
          0% { transform: translateX(-100%); }
          60%, 100% { transform: translateX(200%); }
        }
        .animate-float-card {
          animation: floatY 3.5s ease-in-out infinite;
        }
        @media (max-width: 1023px) {
          .animate-float-card {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </>
  );
}