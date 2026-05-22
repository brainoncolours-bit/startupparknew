import React from 'react';
import { Check } from 'lucide-react';

export default function CardSection({ onPreBook }) {
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
    <section className="relative overflow-hidden bg-white py-24 text-black">
      <div className="absolute left-0 top-0 h-full w-1/2 bg-[#f8f8f8]" />
      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-16 px-6 lg:flex-row lg:px-12">
        <div className="flex-1 space-y-8">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-black/40">
            Limited Edition
          </span>
          <h2 className="font-serif text-[clamp(2.5rem,5vw,5rem)] font-bold leading-[1.1] uppercase tracking-tighter">
            The Next Gen
            <br />
            Founder Card
          </h2>
          <p className="max-w-[40ch] text-lg leading-relaxed text-black/60 font-medium">
            It unlocks the Startup Park ecosystem. With this card, a founder
            gets:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-black text-white">
                  <Check size={12} strokeWidth={3} />
                </div>
                <span className="text-sm font-medium text-black/80">
                  {benefit}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={onPreBook}
            className="group relative flex items-center gap-4 rounded-full bg-black px-8 py-4 text-xs font-bold uppercase tracking-[0.3em] text-white transition-all hover:pr-12"
          >
            Pre-book Now
            <span className="absolute right-6 opacity-0 transition-all group-hover:opacity-100 group-hover:right-8">
              →
            </span>
          </button>
        </div>
        <div className="relative flex-1">
          <div className="aspect-[4/3] w-full overflow-hidden rounded-[2rem] bg-black/5 shadow-2xl">
            <img
              src="/card.png"
              alt="Premium Card"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
