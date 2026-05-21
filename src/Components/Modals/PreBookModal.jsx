import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../lib/supabase";
import { X } from "lucide-react";

export default function PreBookModal({ isOpen, onClose }) {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

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
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0a] p-8 shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute right-6 top-6 text-white/40 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            {success ? (
              <div className="py-12 text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 text-green-500">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h2 className="font-serif text-2xl font-bold uppercase tracking-wider text-white">Reserved!</h2>
                <p className="mt-2 text-sm text-gray-400">We'll contact you soon about your new card.</p>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <span className="text-[0.65rem] font-bold uppercase tracking-[0.4em] text-white/40">Exclusive Access</span>
                  <h2 className="mt-2 font-serif text-3xl font-bold uppercase tracking-tight text-white">Pre-Book Your Card</h2>
                  <p className="mt-3 text-sm leading-relaxed text-gray-400">Enter your details to join the waitlist for the new Startup Park card.</p>
                </div>

                {error && (
                  <div className="mb-6 rounded-xl bg-red-500/10 p-4 text-xs text-red-400 border border-red-500/20">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Full Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full rounded-xl border border-white/5 bg-white/5 px-5 py-3.5 text-sm text-white placeholder:text-white/20 focus:border-white/20 focus:outline-none transition-all"
                      placeholder="e.g. Alex Rivera"
                    />
                  </div>
                  
                  <div>
                    <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full rounded-xl border border-white/5 bg-white/5 px-5 py-3.5 text-sm text-white placeholder:text-white/20 focus:border-white/20 focus:outline-none transition-all"
                      placeholder="+91 00000 00000"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-4 w-full rounded-xl bg-white py-4 text-xs font-bold uppercase tracking-[0.3em] text-black transition-all hover:bg-gray-200 disabled:opacity-50"
                  >
                    {loading ? "Processing..." : "Confirm Pre-Booking"}
                  </button>
                </form>

                <p className="mt-8 text-center text-[10px] uppercase tracking-widest text-white/20">
                  Startup Park Ecosystem © 2026
                </p>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
