import React from "react";
import SoftAurora from "../Components/SoftAurora";
import Footer from "../Components/Footer";

export default function Contact() {
  return (
    <main className="relative w-full min-h-screen bg-black text-white overflow-hidden flex flex-col selection:bg-white selection:text-black">
      
      {/* SOFT AURORA BACKGROUND */}
      <div className="fixed inset-0 z-0 w-full h-full pointer-events-none">
        <SoftAurora
          speed={0.6}
          scale={1.5}
          brightness={0.8}
          color1="#1a0033"
          color2="#e100ff"
          noiseFrequency={2.5}
          noiseAmplitude={1.0}
          bandHeight={0.5}
          bandSpread={1.0}
          octaveDecay={0.1}
          layerOffset={0}
          colorSpeed={1.0}
          enableMouseInteraction={true}
          mouseInfluence={0.25}
        />
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center px-6 pt-32 pb-20 sm:px-10">
        <div className="w-full max-w-2xl text-center">
          
          {/* HEADING */}
          <h1 className="font-serif text-[clamp(3.5rem,8vw,6rem)] font-bold leading-[1] tracking-[-0.02em] mb-6 text-white">
            GET IN TOUCH
          </h1>

          {/* SUBHEADING */}
          <h2 className="text-xl sm:text-2xl font-bold tracking-[0.15em] uppercase mb-6 text-white/90">
            DON'T BE SHY
          </h2>
          
          {/* DESCRIPTION */}
          <p className="text-white/75 text-base sm:text-lg leading-relaxed mb-16 font-light">
            Feel free to get in touch with me. I am always open to discussing new projects, creative ideas or opportunities to be part of your visions.
          </p>

          {/* CONTACT DETAILS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            
            {/* EMAIL */}
            <div className="flex flex-col items-center justify-center p-6 sm:p-8 rounded-lg border border-white/20 hover:border-white/50 bg-white/5 hover:bg-white/10 transition-all duration-300">
              <h3 className="text-[0.75rem] sm:text-[0.85rem] font-bold tracking-[0.3em] uppercase text-white/60 mb-4">Mail me</h3>
              <a href="mailto:info@mail.com" className="text-base sm:text-lg font-light text-white hover:text-white/90 transition-colors">
                info@mail.com
              </a>
            </div>

            {/* PHONE */}
            <div className="flex flex-col items-center justify-center p-6 sm:p-8 rounded-lg border border-white/20 hover:border-white/50 bg-white/5 hover:bg-white/10 transition-all duration-300">
              <h3 className="text-[0.75rem] sm:text-[0.85rem] font-bold tracking-[0.3em] uppercase text-white/60 mb-4">Call me</h3>
              <a href="tel:+13334545544" className="text-base sm:text-lg font-light text-white hover:text-white/90 transition-colors">
                +1 333 454 55 44
              </a>
            </div>

          </div>

          {/* CONTACT FORM CTA */}
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-6 mb-8 text-left">
            <div className="relative border-b border-white/30 pb-4 focus-within:border-white transition-colors duration-300">
              <input type="text" placeholder="Enter your Name" className="w-full bg-transparent text-base sm:text-lg outline-none placeholder:text-white/40 font-light text-white" />
            </div>
            
            <div className="relative border-b border-white/30 pb-4 focus-within:border-white transition-colors duration-300">
              <input type="email" placeholder="Enter a valid email address" className="w-full bg-transparent text-base sm:text-lg outline-none placeholder:text-white/40 font-light text-white" />
            </div>

            <div className="relative border-b border-white/30 pb-4 focus-within:border-white transition-colors duration-300">
              <textarea rows="3" placeholder="Enter your message" className="w-full bg-transparent text-base sm:text-lg outline-none placeholder:text-white/40 font-light text-white resize-none" />
            </div>

            <div className="flex items-center gap-3 mt-2">
              <input type="checkbox" id="terms" className="w-4 h-4 cursor-pointer accent-white" />
              <label htmlFor="terms" className="text-sm font-light text-white/70 cursor-pointer hover:text-white/90 transition-colors">
                I accept the <span className="text-white/90">Terms of Service</span>
              </label>
            </div>

            <button type="submit" className="self-center mt-6 px-10 py-3 border border-white/40 rounded-full hover:border-white hover:bg-white hover:text-black font-semibold text-[0.85rem] tracking-[0.2em] uppercase transition-all duration-400 text-white">
              SUBMIT
            </button>
          </form>

        </div>
      </div>

      
    </main>
  );
}