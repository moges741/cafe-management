"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

type FoodItem = {
  id: number;
  name: string;
  src: string;
};

const FOOD_ITEMS: FoodItem[] = [
  { id: 1, name: "Coffee", src: "/images/coffee.jpg" },
  { id: 2, name: "Pizza", src: "/images/pizza.jpg" },
  { id: 3, name: "Burger", src: "/images/burger.jpg" },
  { id: 4, name: "Juice", src: "/images/juice.jpg" },
  { id: 5, name: "Dessert", src: "/images/dessert.jpg" },
];

const ORBIT_DURATION = 40; 

const getPseudoRandom = (i: number, seed: number) => {
  const x = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453123;
  return x - Math.floor(x);
};

export default function HeroSection() {
  const particles = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => {
      const randSize = getPseudoRandom(i, 1);
      const randTop = getPseudoRandom(i, 2);
      const randLeft = getPseudoRandom(i, 3);
      const randDelay = getPseudoRandom(i, 4);
      const randDuration = getPseudoRandom(i, 5);
      const randX = getPseudoRandom(i, 6);
      return {
        id: i,
        size: randSize * 4 + 1,
        top: `${randTop * 100}%`,
        left: `${randLeft * 100}%`,
        delay: randDelay * 5,
        duration: randDuration * 10 + 15,
        driftX: randX * 30 - 15,
      };
    });
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-[#050301] flex flex-col items-center justify-between py-20 md:py-20">
      
      {/* ================= BACKGROUND ================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-amber-900/20 rounded-full blur-[120px] mix-blend-screen opacity-60" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-orange-950/40 rounded-full blur-[150px] mix-blend-screen opacity-70" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#2a1608]/30 rounded-full blur-[100px]" />
        
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-amber-500/20 shadow-[0_0_8px_rgba(245,158,11,0.3)]"
            style={{ width: p.size, height: p.size, top: p.top, left: p.left }}
            animate={{
              y: [0, -60, 0],
              x: [0, p.driftX, 0],
              opacity: [0.1, 0.5, 0.1],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* ================= FOREGROUND TEXT (TOP) ================= */}
      <div className="relative z-30 text-center px-4 mt-8 flex flex-col items-center gap-4">
       
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="text-4xl md:text-6xl font-extrabold text-white tracking-tight"
        >
          Good Food, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-500 to-orange-500">Honest Cafe</span>
        </motion.h1>
      </div>

      {/* ================= ORBIT SYSTEM (CENTER) ================= */}
      <div 
        className="relative flex-1 w-full max-h-[800px] flex items-center justify-center z-20
        [--radius:100px] md:[--radius:150px] lg:[--radius:170px] 
        [--item-size:80px] md:[--item-size:110px] lg:[--item-size:140px]"
      >
        
        {/* Rotating Parent Container */}
        <motion.div
          className="absolute top-1/2 left-1/2 will-change-transform"
          animate={{ rotate: 360 }}
          transition={{ duration: ORBIT_DURATION, repeat: Infinity, ease: "linear" }}
        >
          {FOOD_ITEMS.map((item, index) => {
            const angle = (360 / FOOD_ITEMS.length) * index;
            
            return (
              <div
                key={item.id}
                className="absolute top-0 left-0 group"
                style={{
                  transform: `rotate(${angle}deg)`,
                }}
              >
                {/* 1. The Connector Line (Shorter now based on decreased --radius) */}
                <div
                  className="absolute top-0 left-0 h-[1.5px] -translate-y-1/2 bg-gradient-to-r from-amber-500/10 via-amber-400/30 to-amber-500/10 group-hover:via-amber-400/80 transition-colors duration-500"
                  style={{ width: "var(--radius)" }}
                >
                  {/* Glowing Traveling Dot */}
                  <motion.div
                    className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_12px_2px_rgba(252,211,77,0.9)]"
                    animate={{ 
                      left: ["0%", "100%"], 
                      opacity: [0, 1, 1, 0] 
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity, 
                      delay: index * 1.5, 
                      ease: "easeInOut" 
                    }}
                  />
                </div>

                {/* 2. The Orbiting Node */}
                <div
                  className="absolute top-0"
                  style={{ left: "var(--radius)", transform: "translate(-50%, -50%)" }}
                >
                  <motion.div
                    className="w-[var(--item-size)] h-[var(--item-size)] will-change-transform"
                    animate={{ rotate: [-angle, -360 - angle] }}
                    transition={{ duration: ORBIT_DURATION, repeat: Infinity, ease: "linear" }}
                  >
                    <div className="w-full h-full rounded-full p-1.5 bg-white/5 backdrop-blur-md border border-white/10 group-hover:border-amber-400/60 shadow-xl shadow-black/50 group-hover:shadow-[0_0_30px_rgba(251,191,36,0.3)] transition-all duration-500 cursor-pointer flex items-center justify-center">
                      <div className="w-full h-full rounded-full overflow-hidden bg-[#1a1a1a]">
                        <img
                          src={item.src}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-700 ease-out"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Fixed Center Logo Container (Perfectly Centered Wrapper) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
          {/* Inner floating animation decoupled from the centering translation */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="relative w-32 h-32 md:w-44 md:h-44 rounded-full bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl border border-white/20 shadow-[0_0_50px_rgba(245,158,11,0.15)] flex items-center justify-center pointer-events-auto cursor-pointer group">
              <div className="absolute inset-2 rounded-full border border-amber-500/30 group-hover:border-amber-500/60 transition-colors duration-500 shadow-inner" />
              <h2 className="text-2xl md:text-3xl font-black tracking-tight bg-gradient-to-br from-amber-100 via-amber-300 to-orange-500 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-500">
                Mr. Cafe
              </h2>
            </div>
          </motion.div>
        </div>

      </div>

      {/* ================= BOTTOM CTA ================= */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
        className="relative z-30 text-center px-6 mb-8 max-w-2xl mx-auto flex flex-col items-center gap-6"
      >
        <p className="text-sm md:text-base text-neutral-300 font-medium leading-relaxed">
          Order online, dine in, or let our AI assistant craft the perfect experience for you. 
          <span className="block mt-1 text-white/60">Real food. Real moments.</span>
        </p>
        
        <button className="relative group px-10 py-4 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold text-lg overflow-hidden transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_35px_rgba(245,158,11,0.5)] hover:scale-105 active:scale-95 duration-300">
          <span className="relative z-10">
            <Link to="/menu">            Order now
</Link>
            </span>
          <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:left-[100%] transition-all duration-700 ease-in-out" />
        </button>
      </motion.div>

    </section>
  );
}