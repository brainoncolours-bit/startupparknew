import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../lib/supabase";
import { X, Sparkles, Terminal, ShieldCheck, Cpu, Database, Activity, Network, ChevronRight } from "lucide-react";

export default function PreBookModal({ isOpen, onClose }) {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [pingTime, setPingTime] = useState(24);

  // Decorative live telemetry simulator
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setPingTime(Math.floor(Math.random() * (32 - 18) + 18));
    }, 2000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: submitError } = await supabase
        .from("pre_bookings")
        .insert([{ full_name: fullName, phone_number: phoneNumber }]);

      if (submitError) throw submitError;

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setFullName("");
        setPhoneNumber("");
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center px-4 py-6 overflow-y-auto bg-black/95 backdrop-blur-xl">
          
          {/* BACKGROUND ENERGY FIELD: Cosmic Ambient Glowing Atmosphere */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#0070f3]/10 blur-[160px] rounded-full animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#00d2ff]/10 blur-[140px] rounded-full" />
            
            {/* Ambient Floating Digital Nodes */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full opacity-20"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -40, 0],
                  opacity: [0.1, 0.6, 0.1],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: Math.random() * 5 + 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* MAIN PANORAMIC SCREEN COMPONENT CONTAINER */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 30 }}
            transition={{ type: "spring", damping: 20, stiffness: 120 }}
            className="relative w-full max-w-4xl overflow-hidden rounded-[2.5rem] p-[1px] bg-gradient-to-b from-white/20 via-[#0070f3]/40 to-[#00d2ff]/60 shadow-[0_0_80px_rgba(0,210,255,0.25)]"
          >
            {/* Glassmorphic Inner Core Deck */}
            <div className="relative w-full bg-[#02050d]/98 grid grid-cols-1 md:grid-cols-12 rounded-[2.4rem] overflow-hidden">
              
              {/* Retro Tech Cyber Dotted Overlay */}
              <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

              {/* CLOSE INTERFACE VECTOR */}
              <button
                onClick={onClose}
                className="absolute right-6 top-6 text-zinc-500 hover:text-white transition-all hover:rotate-90 hover:scale-110 p-2.5 z-50 rounded-full bg-white/5 border border-white/10 hover:border-[#00d2ff]/50"
              >
                <X size={18} strokeWidth={2.5} />
              </button>

              {/* ================= COLUMN 1: KINETIC TELEMETRY DATA BAY ================= */}
              <div className="md:col-span-5 bg-gradient-to-b from-white/[0.02] to-transparent p-6 md:p-10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/5 relative overflow-hidden">
                {/* Pipeline Flow Grid Track Accent */}
                <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-[#00d2ff]/40 via-transparent to-transparent" />
                
                <div className="space-y-6 relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0070f3]/10 border border-[#0070f3]/30 rounded-full text-[#00d2ff] font-mono text-[10px] uppercase tracking-widest font-bold">
                    <Activity size={12} className="animate-pulse" /> Core Link: Stable
                  </div>

                  <div className="space-y-2">
                    <span className="font-mono text-[10px] uppercase text-[#00d2ff]/70 tracking-widest block">// SYSTEM_GATEWAY</span>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight leading-none">
                      Cosmic Ecosystem <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">Node Pipeline</span>
                    </h3>
                  </div>

                  {/* Flow Graphic / Simulated Token Conveyor */}
                  <div className="h-28 w-full rounded-2xl bg-black/40 border border-white/5 p-4 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,112,243,0.05)_1px,transparent_1px)] bg-[size:8px_100%] animate-[shimmer_20s_linear_infinite]" />
                    <div className="flex items-center justify-between font-mono text-[9px] text-zinc-500">
                      <span>DATAPACK_STREAM //</span>
                      <span className="text-[#00d2ff] animate-pulse">● LIVE BUFFER</span>
                    </div>
                    
                    {/* Animated Geometric Data Cubes */}
                    <div className="flex gap-3 py-2 items-center justify-start overflow-hidden">
                      {[...Array(4)].map((_, i) => (
                        <motion.div 
                          key={i}
                          animate={{ x: [-20, 10, 0], opacity: [0.3, 1, 0.8] }}
                          transition={{ repeat: Infinity, duration: 3, delay: i * 0.7 }}
                          className="h-10 w-10 shrink-0 rounded-lg border border-white/10 bg-gradient-to-tr from-[#0070f3]/20 to-[#00d2ff]/10 flex items-center justify-center text-white/40 text-[10px] font-mono"
                        >
                          0{i+1}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Live Real-time Terminal Readout Feed */}
                <div className="mt-8 pt-6 border-t border-white/5 space-y-2 font-mono text-[10px] text-zinc-400">
                  <div className="flex justify-between">
                    <span className="text-zinc-600">NETWORK NODE:</span>
                    <span className="text-white">MAINNET_ALPHA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600">PING LATENCY:</span>
                    <span className="text-[#00d2ff]">{pingTime}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600">MATRIX STATUS:</span>
                    <span className="text-emerald-400 text-[9px] tracking-wider bg-emerald-500/10 px-1.5 py-0.5 rounded uppercase font-bold">READY</span>
                  </div>
                </div>
              </div>


              {/* ================= COLUMN 2: PRIMARY INTERACTIVE CONTROL FORM ================= */}
              <div className="md:col-span-7 p-6 md:p-10 flex flex-col justify-center relative">
                
                <AnimatePresence mode="wait">
                  {success ? (
                    /* SUCCESS SCREEN LAYER */
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-8 space-y-6"
                    >
                      <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-tr from-[#00d2ff] to-[#0070f3] text-black shadow-[0_0_50px_rgba(0,210,255,0.35)]">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
                          className="absolute inset-[-4px] border border-dashed border-[#00d2ff]/60 rounded-[1.8rem]"
                        />
                        <ShieldCheck size={44} strokeWidth={1.2} className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]" />
                      </div>
                      
                      <div className="space-y-2">
                        <h2 className="font-sans font-black text-3xl uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00d2ff]">
                          Signal Synchronized
                        </h2>
                        <p className="text-sm font-medium text-zinc-400 max-w-[32ch] mx-auto">
                          Your address parameter was secured inside the global token registration queue successfully.
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    /* TRANSACTIONAL STANDARD INPUT FORM LAYER */
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6"
                    >
                      <div>
                        <h2 className="font-sans font-black text-3xl uppercase tracking-tight text-white leading-none">
                          Pre-Book Token <br />
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#00d2ff] to-[#0070f3]">Allocation Access</span>
                        </h2>
                        <p className="text-xs font-medium text-zinc-500 mt-2">
                          Commit your signature parameters down below to finalize entry parameters.
                        </p>
                      </div>

                      {error && (
                        <motion.div 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="rounded-xl bg-blue-500/5 p-4 text-xs font-bold font-mono text-[#00d2ff] border border-blue-500/20 shadow-[0_0_15px_rgba(0,210,255,0.05)]"
                        >
                          ⚡ TERMINAL_HALT // {error}
                        </motion.div>
                      )}

                      <form onSubmit={handleSubmit} className="space-y-5">
                        
                        {/* Reference Input Row 1 */}
                        <div className="group relative">
                          <div className="flex justify-between items-center mb-2">
                            <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 group-focus-within:text-[#00d2ff] transition-colors font-mono">
                              // Identity Ref String
                            </label>
                            <span className="text-[8px] text-zinc-700 font-mono hidden group-focus-within:inline animate-pulse">[INPUT_ACTIVE]</span>
                          </div>
                          <div className="relative">
                            <input
                              type="text"
                              required
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              className="w-full rounded-2xl border border-white/5 bg-white/[0.01] px-5 py-4 text-sm text-white placeholder:text-zinc-700 focus:border-[#00d2ff]/40 focus:bg-white/[0.03] focus:outline-none focus:shadow-[0_0_30px_rgba(0,210,255,0.06)] transition-all"
                              placeholder="e.g. Captain Alex Rivera"
                            />
                            <Sparkles size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-[#00d2ff] transition-colors" />
                          </div>
                        </div>
                        
                        {/* Reference Input Row 2 */}
                        <div className="group relative">
                          <div className="flex justify-between items-center mb-2">
                            <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 group-focus-within:text-[#0070f3] transition-colors font-mono">
                              // Digital Telephony Node Line
                            </label>
                            <span className="text-[8px] text-zinc-700 font-mono hidden group-focus-within:inline animate-pulse">[COMMS_ROUTING]</span>
                          </div>
                          <div className="relative">
                            <input
                              type="tel"
                              required
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              className="w-full rounded-2xl border border-white/5 bg-white/[0.01] px-5 py-4 text-sm text-white placeholder:text-zinc-700 focus:border-[#0070f3]/50 focus:bg-white/[0.03] focus:outline-none focus:shadow-[0_0_30px_rgba(0,112,243,0.06)] transition-all"
                              placeholder="+91 00000 00000"
                            />
                            <Cpu size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-[#0070f3] transition-colors" />
                          </div>
                        </div>

                        {/* Submit Action Block */}
                        <button
                          type="submit"
                          disabled={loading}
                          className="group/btn relative mt-4 w-full rounded-2xl bg-white p-[1px] font-black uppercase tracking-[0.25em] text-black overflow-hidden shadow-[0_4px_30px_rgba(0,210,255,0.2)] active:scale-[0.99] transition-transform disabled:opacity-40"
                        >
                          <div className="w-full h-full bg-white rounded-[15px] py-4.5 flex items-center justify-center gap-2 transition-all group-hover/btn:bg-black group-hover/btn:text-white">
                            {loading ? (
                              <div className="flex items-center gap-2">
                                <Network size={14} className="animate-spin text-black group-hover/btn:text-[#00d2ff]" />
                                <span className="animate-pulse tracking-widest font-mono text-black group-hover/btn:text-white">UPLOADING_CORE_</span>
                              </div>
                            ) : (
                              <>
                                Broadcast Signal Access
                                <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                              </>
                            )}
                          </div>
                          
                          {/* Inner Shimmer backing line animation overlay */}
                          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0070f3] via-white to-[#00d2ff] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                        </button>
                      </form>

                      <p className="pt-4 text-center font-mono text-[8px] uppercase tracking-[0.4em] text-zinc-700">
                        Secure Encryption Link // Protocol System v2.6.0
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}