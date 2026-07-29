"use client";

import { motion } from "framer-motion";
import { Mic, Sparkles, Zap } from "lucide-react";

const AI_FEATURES = [
  { icon: Mic, title: "Order by voice", desc: "Just speak — no typing, no menus" },
  { icon: Sparkles, title: "Understands you", desc: "English, Amharic, Afaan Oromo" },
  { icon: Zap, title: "Instant to kitchen", desc: "Confirmed → in your kitchen in seconds" },
];

export default function AiFeaturesSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] },
    },
  };

  return (
    <section className="py-32 px-6 bg-[#050301] relative overflow-hidden flex flex-col items-center">
      
      {/* ================= BACKGROUND EFFECTS ================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#2a1608]/40 blur-[150px]" />
        
        {/* Animated background flare */}
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-amber-900/30 rounded-full blur-[120px] mix-blend-screen"
        />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-950/20 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10 w-full flex flex-col items-center">
        
        {/* ================= BADGE ================= */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full border border-amber-500/30 bg-amber-500/5 backdrop-blur-md shadow-[0_0_15px_rgba(245,158,11,0.05)]"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-xs md:text-sm text-amber-200/80 uppercase tracking-[0.2em] font-semibold">
            Powered by AI
          </span>
        </motion.div>

        {/* ================= HEADLINE ================= */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-500 to-orange-500"
        >
          Ordering, reimagined
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          viewport={{ once: true }}
          className="text-base md:text-lg max-w-lg mx-auto mb-16 text-neutral-300 leading-relaxed"
        >
          Look for the assistant button floating in the corner — talk to it like you would a barista.
        </motion.p>

        {/* ================= AI FEATURE CARDS ================= */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full"
        >
          {AI_FEATURES.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants as any}
              whileHover={{ y: -12 }}
              className="group relative h-full"
            >
              {/* Outer Glow on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Card Container */}
              <div className="relative h-full bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl transition-all duration-500 group-hover:border-amber-500/40 group-hover:bg-white/10 overflow-hidden flex flex-col items-center text-center">
                
                {/* Icon Container */}
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 10 }}
                  className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6 shadow-inner group-hover:bg-amber-500/20 group-hover:border-amber-500/40 transition-all duration-500"
                >
                  <feature.icon size={28} className="text-amber-400 group-hover:text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)] transition-colors" />
                </motion.div>

                {/* Text Content */}
                <p className="text-xl font-bold text-white mb-3 group-hover:text-amber-100 transition-colors">
                  {feature.title}
                </p>
                <p className="text-sm font-medium leading-relaxed text-neutral-400 group-hover:text-neutral-300 transition-colors">
                  {feature.desc}
                </p>

                {/* Bottom Animated Bar */}
                <motion.div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent"
                  initial={{ width: "0%", opacity: 0 }}
                  whileHover={{ width: "80%", opacity: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}