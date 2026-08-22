"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });

  // Upgraded variants with a subtle upward glide
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        ease: [0.2, 0.65, 0.3, 0.9] as const,
      },
    }),
  };

  // Structured the words to allow for precise, premium color mapping
  const words = [
    { text: "Where", color: "text-white" },
    { text: "every", color: "text-white" },
    { text: "cup", color: "text-white" },
    { text: "tells", color: "text-white" },
    { text: "a", color: "text-white" },
    { text: "story.", color: "text-white" },
    { text: "Mr.", color: "text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-500 to-orange-500" },
    { text: "Cafe", color: "text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-500 to-orange-500" },
    { text: "started", color: "text-amber-100/70" },
    { text: "with", color: "text-amber-100/70" },
    { text: "a", color: "text-amber-100/70" },
    { text: "simple", color: "text-amber-100/70" },
    { text: "idea", color: "text-amber-100/70" },
{ text: " {built by Moges btw} ", color: "text-amber-100/70 font-mono" },
    { text: "good", color: "text-amber-100/70" },
    { text: "coffee", color: "text-amber-100/70" },
    { text: "shouldn't", color: "text-amber-100/70" },
    { text: "be", color: "text-amber-100/70" },
    { text: "complicated.", color: "text-amber-100/70" },
  ];

  return (
    <section ref={ref} className="py-32 px-6 bg-[#050301] relative overflow-hidden flex items-center justify-center min-h-[70vh]">
      
      {/* ================= BACKGROUND EFFECTS ================= */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#2a1608]/40 blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-orange-950/30 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-900/20 rounded-full blur-[150px] mix-blend-screen" />
      </div>

      {/* ================= DECORATIVE RINGS ================= */}
      {/* Carries over the orbital circular theme from the Hero */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] -right-20 md:right-[-10%] w-[400px] h-[400px] md:w-[600px] md:h-[600px] border border-amber-500/10 rounded-full border-dashed pointer-events-none z-0"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-20 -left-20 md:left-[-5%] w-[350px] h-[350px] md:w-[500px] md:h-[500px] border border-white/5 rounded-full pointer-events-none z-0"
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        
        {/* ================= BADGE ================= */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ delay: 0.1, duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-amber-500/30 bg-amber-500/5 backdrop-blur-md shadow-[0_0_15px_rgba(245,158,11,0.05)]"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          <span className="text-xs md:text-sm text-amber-200/80 uppercase tracking-[0.2em] font-semibold">
            Our story
          </span>
        </motion.div>

        {/* ================= HEADLINE ANIMATION ================= */}
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-2 mb-12 max-w-3xl">
          {words.map((word, i) => (
            <motion.span
              key={`${word.text}-${i}`}
              custom={i}
              variants={textVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className={`text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight ${word.color}`}
            >
              {word.text}
            </motion.span>
          ))}
        </div>

        {/* ================= BODY PARAGRAPH ================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
          className="relative p-6 md:p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-[0_0_40px_rgba(245,158,11,0.05)] max-w-2xl"
        >
          {/* Subtle premium corner brackets */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-500/40 rounded-tl-md" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-500/40 rounded-br-md" />

          <p className="text-base md:text-lg leading-relaxed text-neutral-300 font-medium">
            From our roastery to your table, every bean, every plate, and every order is
            handled with care. We blend warmth with modern technology —{" "}
            <span className="text-amber-400 font-semibold drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">
              real-time tracking, AI-assisted ordering
            </span>
            , and a kitchen that never keeps you guessing.
          </p>
        </motion.div>

      </div>
    </section>
  );
}