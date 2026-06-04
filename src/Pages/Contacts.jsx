import React, { useState } from "react";
import SoftAurora from "../Components/SoftAurora";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const details = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      message: formData.message.trim(),
      submittedAt: new Date().toISOString(),
    };

    window.localStorage.setItem("startupParkContactForm", JSON.stringify(details));

    const subject = `Startup Park Contact Enquiry - ${details.name || "Website Visitor"}`;
    const body = [
      "Hello Startup Park team,",
      "",
      "I would like to get in touch.",
      "",
      `Name: ${details.name}`,
      `Email: ${details.email}`,
      "",
      "Message:",
      details.message,
    ].join("\n");

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      "contactus@thestartuppark.com",
    )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = gmailUrl;
  };

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

          
          
          {/* DESCRIPTION */}
          <p className="text-white/75 text-base sm:text-lg leading-relaxed mb-16 font-light">
  Connect with Startup Park Bengaluru to explore startup incubation,
  mentorship, innovation programs, partnerships, events, and founder
  opportunities. Our team is ready to help you build, scale, and grow.
</p>

          {/* CONTACT DETAILS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            
            {/* EMAIL */}
            
<div className="flex flex-col items-center justify-center p-6 sm:p-8 rounded-lg border border-white/20 hover:border-white/50 bg-white/5 hover:bg-white/10 transition-all duration-300">
  <h3 className="text-[0.75rem] sm:text-[0.85rem] font-bold tracking-[0.3em] uppercase text-white/60 mb-4">
    Mail us
  </h3>
  <a
    href="mailto:contactus@thestartuppark.com"
    className="text-base sm:text-lg font-light text-white hover:text-white/90 transition-colors"
  >
    contactus@thestartuppark.com
  </a>
</div>

            {/* PHONE */}
<div className="flex flex-col items-center justify-center p-6 sm:p-8 rounded-lg border border-white/20 hover:border-white/50 bg-white/5 hover:bg-white/10 transition-all duration-300">
  <h3 className="text-[0.75rem] sm:text-[0.85rem] font-bold tracking-[0.3em] uppercase text-white/60 mb-4">
    Call us
  </h3>
  <a
    href="tel:+919036354905"
    className="text-base sm:text-lg font-light text-white hover:text-white/90 transition-colors"
  >
    +91 9036 354 905
  </a>
</div>

          </div>

          <div className="mb-16 space-y-6 text-center">
  
  <div>
    <h3 className="text-[0.75rem] sm:text-[0.85rem] font-bold tracking-[0.3em] uppercase text-white/60 mb-3">
      Address
    </h3>
    <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
      Hosur Rd, opp. Madiwala Traffic Police Station,
      Koramangala 2nd Block, Koramangala,
      Bengaluru, Karnataka 560068
    </p>
  </div>
</div>

          {/* CONTACT FORM CTA */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 mb-8 text-left">
            <div className="relative border-b border-white/30 pb-4 focus-within:border-white transition-colors duration-300">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your Name"
                required
                className="w-full bg-transparent text-base sm:text-lg outline-none placeholder:text-white/40 font-light text-white"
              />
            </div>
            
            <div className="relative border-b border-white/30 pb-4 focus-within:border-white transition-colors duration-300">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter a valid email address"
                required
                className="w-full bg-transparent text-base sm:text-lg outline-none placeholder:text-white/40 font-light text-white"
              />
            </div>

            <div className="relative border-b border-white/30 pb-4 focus-within:border-white transition-colors duration-300">
              <textarea
                rows="3"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Enter your message"
                required
                className="w-full bg-transparent text-base sm:text-lg outline-none placeholder:text-white/40 font-light text-white resize-none"
              />
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
