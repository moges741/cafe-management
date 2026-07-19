import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CulinaryGateway() {
  const [hoveredZone, setHoveredZone] = useState<'burger' | 'pizza' | null>(null);
  const [selectedZone, setSelectedZone] = useState<'burger' | 'pizza' | null>(null);

  // Handle premium click interaction before navigating
  const handleNavigation = (destination: 'burger' | 'pizza') => {
    setSelectedZone(destination);
    setTimeout(() => {
      window.location.href = `/preparing-${destination}`;
    }, 800); // Syncs with the splash explosion animation
  };

  return (
    <div className="relative w-full h-screen bg-[#050505] text-white overflow-hidden font-sans antialiased select-none">
      
      {/* Dynamic Cinematic Ambient Background Glow */}
      <div className="absolute inset-0 transition-all duration-1000 ease-out pointer-events-none z-0 opacity-40">
        <div 
          className={`absolute top-1/2 left-1/4 -translate-y-1/2 w-[50vw] h-[50vw] rounded-full blur-[140px] transition-all duration-700 bg-emerald-600/20 ${
            hoveredZone === 'burger' ? 'scale-125 opacity-100' : 'scale-100 opacity-40'
          }`} 
        />
        <div 
          className={`absolute top-1/2 right-1/4 -translate-y-1/2 w-[50vw] h-[50vw] rounded-full blur-[140px] transition-all duration-700 bg-red-600/20 ${
            hoveredZone === 'pizza' ? 'scale-125 opacity-100' : 'scale-100 opacity-40'
          }`} 
        />
      </div>

      {/* Subtle background noise texture */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiIvPjwvc3ZnPg==')] opacity-40 pointer-events-none mix-blend-overlay z-10" />

      {/* Main Container Layout */}
      <div className="relative h-full w-full flex flex-col md:flex-row z-20">
        
        {/* --- BURGER LABORATORY SIDE --- */}
        <motion.div 
          className="relative flex-1 h-1/2 md:h-full flex flex-col justify-between p-8 md:p-16 overflow-hidden border-b md:border-b-0 md:border-r border-white/5 cursor-pointer"
          onMouseEnter={() => setHoveredZone('burger')}
          onMouseLeave={() => setHoveredZone(null)}
          onClick={() => handleNavigation('burger')}
          animate={{
            flex: hoveredZone === 'burger' ? 1.3 : hoveredZone === 'pizza' ? 0.7 : 1
          }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        >
          {/* Abstract Layered Burger Silhouette using pure CSS/Glows */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 md:opacity-30">
            <motion.div 
              className="w-64 h-64 flex flex-col gap-3 items-center justify-center"
              animate={{ 
                y: hoveredZone === 'burger' ? [0, -10, 0] : 0,
                rotate: hoveredZone === 'burger' ? -2 : 0
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Bun Top */}
              <div className="w-48 h-14 bg-gradient-to-b from-amber-500 to-amber-700 rounded-t-full shadow-[0_4px_20px_rgba(245,158,11,0.2)]" />
              {/* Greens */}
              <div className="w-52 h-4 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full blur-[1px]" />
              {/* Patty */}
              <div className="w-46 h-12 bg-gradient-to-b from-stone-800 to-neutral-950 rounded-xl border border-amber-900/40 shadow-inner" />
              {/* Bun Bottom */}
              <div className="w-44 h-8 bg-gradient-to-t from-amber-600 to-amber-700 rounded-b-xl" />
            </motion.div>
          </div>

          {/* Card Label Header */}
          <div className="relative z-30">
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-emerald-400">Laboratory 01</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mt-2 uppercase">
              The Architectural <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Burger</span>
            </h2>
          </div>

          {/* Action Trigger Footer */}
          <div className="relative z-30 flex items-center justify-between mt-auto">
            <p className="text-neutral-400 text-sm max-w-xs hidden sm:block">
              Deconstruct the vertical engineering of premium composition.
            </p>
            <motion.div 
              className="px-6 py-3 border border-white/10 rounded-full bg-white/5 backdrop-blur-md text-xs font-bold tracking-widest uppercase flex items-center gap-2 group-hover:border-emerald-500/50 transition-colors"
              animate={{ x: hoveredZone === 'burger' ? 10 : 0 }}
            >
              <span>Build Layered</span>
              <span className="text-emerald-400">→</span>
            </motion.div>
          </div>
        </motion.div>


        {/* --- PIZZA DECONSTRUCTION SIDE --- */}
        <motion.div 
          className="relative flex-1 h-1/2 md:h-full flex flex-col justify-between p-8 md:p-16 overflow-hidden cursor-pointer"
          onMouseEnter={() => setHoveredZone('pizza')}
          onMouseLeave={() => setHoveredZone(null)}
          onClick={() => handleNavigation('pizza')}
          animate={{
            flex: hoveredZone === 'pizza' ? 1.3 : hoveredZone === 'burger' ? 0.7 : 1
          }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        >
          {/* Abstract Golden Pizza Silhouette */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 md:opacity-30">
            <motion.div 
              className="w-64 h-64 relative flex items-center justify-center"
              animate={{ 
                rotate: hoveredZone === 'pizza' ? 360 : 0,
                scale: hoveredZone === 'pizza' ? 1.1 : 1
              }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            >
              {/* Outer Crust representation */}
              <div className="w-56 h-56 rounded-full border-4 border-dashed border-orange-500/40 flex items-center justify-center animate-[spin_60s_linear_infinite]">
                {/* Crimson Sauce Base Core */}
                <div className="w-44 h-44 rounded-full bg-gradient-to-br from-red-600/20 to-orange-600/5 blur-sm border border-red-500/20 flex items-center justify-center">
                  {/* Floating Ingredients node markers */}
                  <div className="w-3 h-3 rounded-full bg-amber-400 absolute top-12 left-16 blur-[0.5px]" />
                  <div className="w-4 h-4 rounded-full bg-red-500 absolute bottom-14 right-16 blur-[0.5px]" />
                  <div className="w-2.5 h-4 bg-emerald-400 rounded-full absolute top-24 right-12 transform rotate-45" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Card Label Header */}
          <div className="relative z-30">
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-orange-400">Laboratory 02</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mt-2 uppercase">
              The Exploded <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-rose-500">Pizza</span>
            </h2>
          </div>

          {/* Action Trigger Footer */}
          <div className="relative z-30 flex items-center justify-between mt-auto">
            <p className="text-neutral-400 text-sm max-w-xs hidden sm:block">
              Simulate dynamic thermodynamic assembly frame-by-frame.
            </p>
            <motion.div 
              className="px-6 py-3 border border-white/10 rounded-full bg-white/5 backdrop-blur-md text-xs font-bold tracking-widest uppercase flex items-center gap-2 group-hover:border-orange-500/50 transition-colors"
              animate={{ x: hoveredZone === 'pizza' ? 10 : 0 }}
            >
              <span>Expose Canvas</span>
              <span className="text-orange-400">→</span>
            </motion.div>
          </div>
        </motion.div>

      </div>

      {/* --- RECONSTRUCTIVE CINEMATIC TRANSITION SPLASH OVERLAY --- */}
      <AnimatePresence>
        {selectedZone && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-50 flex items-center justify-center ${
              selectedZone === 'burger' ? 'bg-emerald-950' : 'bg-rose-950'
            }`}
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ ease: "easeOut", duration: 0.5 }}
              className="text-center"
            >
              <h3 className="text-2xl font-black uppercase tracking-[0.4em] mb-2 text-white/90">
                Initializing Environment
              </h3>
              <p className="text-xs tracking-widest text-white/40 uppercase">
                Calibrating component matrix for {selectedZone}...
              </p>
              
              {/* Linear Expanding Progress Tracker */}
              <div className="w-48 h-[2px] bg-white/10 mx-auto mt-6 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                  className={`h-full ${
                    selectedZone === 'burger' ? 'bg-emerald-400' : 'bg-orange-400'
                  }`}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}