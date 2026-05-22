import React from 'react';
import { motion } from 'framer-motion';

const images = [
  '/bg.jpg',
  '/sample.jpg',
  '/img.jpeg',
  '/card.jpeg',
  '/bookCover.jpg',
  // Duplicate for seamless loop
  '/bg.jpg',
  '/sample.jpg',
  '/img.jpeg',
  '/card.jpeg',
  '/bookCover.jpg',
];

export default function Gallery() {
  return (
    <section className="py-20 bg-black overflow-hidden select-none">
      <div className="mb-12 px-6 sm:px-10 lg:px-24">
        <span className="text-xs font-bold tracking-[0.4em] text-white/40 uppercase block mb-3">
          Our Ecosystem
        </span>
        <h2 className="font-serif text-[clamp(2rem,4vw,4rem)] font-bold text-white leading-none uppercase tracking-tighter">
          Visualizing Success
        </h2>
      </div>

      <div className="flex w-full overflow-hidden relative">
        <motion.div 
          className="flex gap-4 flex-nowrap"
          animate={{
            x: [0, "-50%"],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
          style={{ width: "fit-content" }}
        >
          {images.map((src, idx) => (
            <div 
              key={idx} 
              className="relative w-[300px] sm:w-[500px] aspect-[16/10] flex-shrink-0 overflow-hidden rounded-2xl border border-white/5 group"
            >
              <img 
                src={src} 
                alt={`Gallery image ${idx}`} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-white text-[10px] font-bold uppercase tracking-[0.4em] mb-2 opacity-60">Startup Park ecosystem</p>
                  <h3 className="text-white text-lg font-serif italic tracking-wide">Moment of Growth 0{ (idx % (images.length / 2)) + 1 }</h3>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
