"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import {
  Coffee,
  Salad,
  Truck,
  Wifi,
  Armchair,
  CreditCard,
} from "lucide-react";

const FEATURES = [
  { icon: Coffee, title: "Premium coffee beans", desc: "Ethically sourced, freshly roasted" },
  { icon: Salad, title: "Fresh ingredients", desc: "Locally sourced, no shortcuts" },
  { icon: Truck, title: "Fast delivery", desc: "Hot food, fast — every time" },
  { icon: Wifi, title: "Free WiFi", desc: "Work, study, or relax" },
  { icon: Armchair, title: "Comfortable workspace", desc: "Designed for long afternoons" },
  { icon: CreditCard, title: "Cashless payment", desc: "Chapa, card, or cash" },
];

export default function WhyChooseUsSection() {
  const sectionRef = useRef(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section
      ref={sectionRef}
      className="py-24 px-6 bg-[#050301] relative overflow-hidden"
    >
      {/* ================= BACKGROUND EFFECTS ================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#2a1608]/40 blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-950/20 rounded-full blur-[150px] mix-blend-screen" />
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-amber-900/10 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      <motion.div className="max-w-6xl mx-auto relative z-10 flex flex-col items-center">
        
        {/* ================= BADGE ================= */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full border border-amber-500/30 bg-amber-500/5 backdrop-blur-md shadow-[0_0_15px_rgba(245,158,11,0.05)]"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          <span className="text-xs md:text-sm text-amber-200/80 uppercase tracking-[0.2em] font-semibold">
            Features
          </span>
        </motion.div>

        {/* ================= HEADLINE ================= */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-center mb-16 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-500 to-orange-500"
        >
          Why choose us
        </motion.h2>

        {/* ================= FEATURE CARDS ================= */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, threshold: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
        >
          {FEATURES.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative bg-white/5 border border-white/10 rounded-2xl p-8 overflow-hidden backdrop-blur-xl transition-all duration-300 hover:border-amber-500/40 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]"
            >
              {/* Inner ambient glow on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />

              {/* Icon Container */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-14 h-14 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6 relative z-10 group-hover:bg-amber-500/20 group-hover:border-amber-500/40 transition-colors duration-300 shadow-inner"
              >
                <feature.icon size={24} className="text-amber-400 group-hover:text-amber-300 transition-colors duration-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
              </motion.div>

              <h3 className="text-lg font-bold text-white mb-2 relative z-10 group-hover:text-amber-100 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-sm font-medium leading-relaxed relative z-10 text-neutral-400 group-hover:text-neutral-300 transition-colors duration-300">
                {feature.desc}
              </p>

              {/* Top corner decorative accent */}
              <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-amber-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-2xl" />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}