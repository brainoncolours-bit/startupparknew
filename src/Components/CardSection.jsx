import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export default function MolithraHero({ onPreBook }) {
  const segments = Array.from({ length: 12 });
  const benefits = [
    "1 seat for 1 month at Startup Park",
    "Startup research and market intelligence",
    "Legal and compliance guidance",
    "Branding and personal branding benefits",
    "Media and advertising support",
    "Incubation workshop access",
    "Founder community membership",
    "Startup tools and software offers",
    "Skill and career support",
    "HR training",
  ];

  return (
    <section className="relative w-full min-h-screen bg-[#050505] overflow-hidden flex flex-col items-center justify-center py-20 text-white">
      
      {/* Animated Background Glow (Blue Tone) */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.15)_0%,transparent_70%)]" 
      />

      {/* Segmented Background */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none opacity-20">
        {segments.map((_, i) => {
          const distanceFromCenter = Math.abs(i - 5.5);
          const height = 100 - (distanceFromCenter * 8);
          return (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              className="w-[8%] mx-[1px] bg-gradient-to-b from-black via-gray-900 to-black border-x border-white/[0.05]"
            />
          );
        })}
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
        
        {/* Left Side: Content */}
        <div className="flex-1 space-y-8">
          <motion.span 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-500"
          >
            Limited Edition
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tighter uppercase"
          >
            The Next Gen<br /> <span className="text-blue-500">Founder Card</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="max-w-[40ch] text-lg text-gray-400 font-medium"
          >
            It unlocks the Startup Park ecosystem. With this card, a founder gets:
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {benefits.map((benefit, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + (idx * 0.05) }}
                className="flex items-start gap-3"
              >
                <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                  <Check size={12} strokeWidth={3} />
                </div>
                <span className="text-sm font-medium text-gray-300">{benefit}</span>
              </motion.div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
            onClick={onPreBook}
            className="group relative flex items-center gap-4 rounded-full bg-white px-8 py-4 text-xs font-bold uppercase tracking-[0.3em] text-black hover:bg-blue-500 hover:text-white transition-colors duration-300"
          >
            Pre-book Now
          </motion.button>
        </div>

        {/* Right Side: Floating Card Visual */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1, y: [0, -20, 0] }} 
          transition={{ y: { duration: 4, repeat: Infinity, ease: "easeInOut" }, delay: 0.5, duration: 0.8 }}
          className="flex-1 w-full"
        >
          <div className="aspect-[4/3] w-full rounded-[2rem] bg-gradient-to-br from-gray-900 to-black border border-blue-500/30 shadow-[0_0_50px_-12px_rgba(37,99,235,0.3)] flex items-center justify-center p-8">
            <div className="text-gray-600 font-bold tracking-widest uppercase text-center border-2 border-gray-800 p-8 rounded-xl">
              Founder Card
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}