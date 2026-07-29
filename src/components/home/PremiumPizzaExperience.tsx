import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

// --- INGREDIENT CSS COMPONENTS (Pure CSS/Tailwind, NO Images) ---

const LeopardSpot = ({ className = "" }) => (
  <div className={`absolute bg-[#1a0f08] rounded-full opacity-70 blur-[1px] ${className}`} />
);

const PizzaCrust = () => (
  <div className="relative w-[340px] h-[340px] bg-gradient-to-br from-[#eec590] via-[#c68a4c] to-[#7c4e1b] rounded-full shadow-[inset_0_0_30px_rgba(0,0,0,0.6),0_20px_40px_rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden border border-amber-900/20">
    {/* Inner Base Depression */}
    <div className="w-[280px] h-[280px] bg-gradient-to-br from-[#ddb076] to-[#b07435] rounded-full shadow-[inset_0_10px_20px_rgba(0,0,0,0.4)] relative">
      {/* Flour Dusting Texture */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] bg-[size:6px_6px]" />
    </div>

    {/* Authentic Neapolitan Wood-Fired Charring (Leopard Spots) */}
    <LeopardSpot className="w-4 h-6 top-6 left-24 rotate-12" />
    <LeopardSpot className="w-3 h-3 top-12 left-12" />
    <LeopardSpot className="w-6 h-4 top-4 right-32 -rotate-45" />
    <LeopardSpot className="w-5 h-8 top-20 right-10 rotate-45" />
    <LeopardSpot className="w-4 h-4 bottom-14 left-16" />
    <LeopardSpot className="w-7 h-5 bottom-8 right-24 rotate-12" />
    <LeopardSpot className="w-3 h-5 bottom-24 right-12 -rotate-12" />
    
    {/* Crust Highlights */}
    <div className="absolute top-4 left-16 w-32 h-8 bg-white/10 rounded-full blur-md transform -rotate-12" />
  </div>
);

const TomatoSauce = () => (
  <div className="relative w-[284px] h-[284px] bg-gradient-to-br from-[#e62a19] via-[#b71205] to-[#7a0500] rounded-full shadow-[inset_0_5px_15px_rgba(0,0,0,0.5),0_4px_10px_rgba(0,0,0,0.3)] border border-red-900/40 overflow-hidden">
    {/* Swirl Textures */}
    <div className="absolute top-4 left-6 w-48 h-48 border-t-4 border-red-500/20 rounded-full blur-[2px] transform rotate-45" />
    <div className="absolute bottom-8 right-6 w-40 h-40 border-b-4 border-orange-500/10 rounded-full blur-[3px] transform -rotate-12" />
    {/* Glossy patches */}
    <div className="absolute top-12 left-16 w-16 h-8 bg-white/10 rounded-full blur-sm transform -rotate-12" />
    <div className="absolute bottom-16 right-16 w-20 h-10 bg-white/5 rounded-full blur-md" />
  </div>
);

const MozzarellaBlobs = () => (
  <div className="relative w-[260px] h-[260px]">
    {/* Blob 1 */}
    <div className="absolute top-8 left-12 w-16 h-12 bg-gradient-to-br from-[#fffff0] via-[#f4ebd0] to-[#d5c396] rounded-[40%_60%_50%_50%_/_50%_40%_60%_50%] shadow-[0_4px_8px_rgba(0,0,0,0.3),inset_0_-3px_6px_rgba(0,0,0,0.2)] border-t border-white">
      <div className="absolute inset-2 bg-gradient-to-br from-white/40 to-transparent rounded-full blur-[1px]" />
    </div>
    {/* Blob 2 */}
    <div className="absolute top-14 right-10 w-20 h-14 bg-gradient-to-br from-[#fffff0] via-[#f4ebd0] to-[#cbb887] rounded-[60%_40%_40%_60%_/_40%_50%_50%_60%] shadow-[0_5px_10px_rgba(0,0,0,0.3)] border-t border-white animate-pulse" />
    {/* Blob 3 */}
    <div className="absolute bottom-12 left-10 w-[74px] h-[54px] bg-gradient-to-br from-[#fffff0] via-[#f4ebd0] to-[#cbb887] rounded-[50%_50%_30%_70%_/_60%_40%_60%_40%] shadow-[0_4px_8px_rgba(0,0,0,0.3)]" />
    {/* Blob 4 */}
    <div className="absolute bottom-8 right-14 w-14 h-12 bg-gradient-to-br from-[#fffff0] via-[#eaddbd] to-[#bda670] rounded-full shadow-[0_4px_8px_rgba(0,0,0,0.3)]" />
    {/* Blob 5 - Center Melt */}
    <div className="absolute top-24 left-24 w-12 h-10 bg-gradient-to-br from-[#fffff0] via-[#f4ebd0] to-[#cbb887] rounded-full opacity-90 blur-[1px]" />
  </div>
);

const PepperoniSlice = ({ className = "" }) => (
  <div className={`absolute w-11 h-11 bg-gradient-to-br from-[#d33a11] via-[#a61c00] to-[#590700] rounded-full shadow-[0_4px_8px_rgba(0,0,0,0.4),inset_0_2px_4px_rgba(255,255,255,0.2)] border border-red-950/40 flex items-center justify-center ${className}`}>
    {/* Curled Edge Effect */}
    <div className="absolute inset-[1px] rounded-full border-t border-orange-400/30 bg-gradient-to-tl from-black/20 to-transparent" />
    {/* Internal Fat Specks */}
    <div className="w-1 h-1 bg-orange-200/50 rounded-full absolute top-2 left-3 blur-[0.5px]" />
    <div className="w-1.5 h-1 bg-amber-100/40 rounded-full absolute bottom-3 right-2 blur-[0.5px]" />
    <div className="w-1 h-1 bg-orange-300/60 rounded-full absolute top-5 right-3" />
    {/* Glistening Grease Pool */}
    <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-transparent to-yellow-500/20 blur-[1px]" />
  </div>
);

const PepperoniLayers = () => (
  <div className="relative w-[260px] h-[260px]">
    <PepperoniSlice className="top-4 left-16 rotate-12" />
    <PepperoniSlice className="top-10 right-16 -rotate-45" />
    <PepperoniSlice className="top-24 left-4 rotate-[60deg]" />
    <PepperoniSlice className="top-28 right-6 rotate-[15deg]" />
    <PepperoniSlice className="bottom-6 left-12 -rotate-12" />
    <PepperoniSlice className="bottom-4 right-16 rotate-[80deg]" />
    <PepperoniSlice className="top-24 left-24 rotate-0" />
  </div>
);

const BasilLeaf = ({ className = "" }) => (
  <div className={`absolute w-10 h-14 bg-gradient-to-br from-[#4ade80] via-[#166534] to-[#052e16] rounded-[100%_0_100%_0] shadow-[0_4px_6px_rgba(0,0,0,0.3)] border-t border-green-300/30 ${className}`}>
    {/* Center Vein */}
    <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-green-300/20 blur-[0.5px] transform -rotate-[45deg]" />
    {/* Glossy Leaf Texture */}
    <div className="absolute inset-2 rounded-[100%_0_100%_0] bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
  </div>
);

const BasilLayers = () => (
  <div className="relative w-[240px] h-[240px]">
    <BasilLeaf className="top-6 left-24 rotate-[25deg] scale-110" />
    <BasilLeaf className="bottom-10 left-8 -rotate-[65deg]" />
    <BasilLeaf className="bottom-12 right-12 rotate-[115deg] scale-95" />
    <BasilLeaf className="top-24 right-4 rotate-[5deg]" />
  </div>
);

const OliveOilDrizzle = () => (
  <div className="relative w-[250px] h-[250px] opacity-70 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
    {/* Custom liquid curves generated via pure CSS borders */}
    <div className="absolute top-10 left-12 w-32 h-20 border-r-[3px] border-b-[2px] border-amber-400/60 rounded-[40%] blur-[0.5px]" />
    <div className="absolute bottom-12 right-10 w-24 h-24 border-l-[3px] border-t-[3px] border-yellow-500/50 rounded-[50%] blur-[0.5px]" />
    {/* Glistening droplets */}
    <div className="absolute top-24 left-24 w-2 h-3 bg-gradient-to-b from-yellow-300 to-amber-500 rounded-full transform rotate-12" />
    <div className="absolute bottom-16 left-16 w-1.5 h-2 bg-gradient-to-b from-yellow-200 to-amber-600 rounded-full" />
    <div className="absolute top-14 right-20 w-2 h-2 bg-gradient-to-b from-yellow-300 to-amber-500 rounded-full" />
  </div>
);


// --- MAIN EXPERIENCE COMPONENT ---

export default function PremiumPizzaExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress across the container height
  const { scrollYProgress } = useScroll({ 
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Dynamic spring values for cursor-following parallax context
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 30, stiffness: 90 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [25, -25]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-25, 25]), springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth - 0.5);
      mouseY.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // --- SCROLL ANIMATION CHOREOGRAPHY ---

  // Intro Typography Controls
  const introOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0]);
  const introY = useTransform(scrollYProgress, [0, 0.06], [0, -60]);

  // Global Context Scale
  const globalScale = useTransform(scrollYProgress, 
    [0.1, 0.3, 0.5, 0.62, 0.82, 0.92], 
    [0.4, 0.95, 1.05, 0.75, 0.75, 1.15]
  );

  // Global Context Rotation to simulate beautiful pseudo-3D presentation
  const globalRotation = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0, 45, 360]);

  // Exploded / Structural Assembly View Coordinates (Z-index simulation over Y offsets)
  const crustY = useTransform(scrollYProgress, [0, 0.2, 0.3, 0.45, 0.6, 0.7, 0.85], [800, 300, 0, 0, 180, 180, 0]);
  const sauceY = useTransform(scrollYProgress, [0, 0.2, 0.3, 0.45, 0.6, 0.7, 0.85], [-600, -150, 0, 0, 80, 80, 0]);
  const cheeseY = useTransform(scrollYProgress, [0, 0.2, 0.3, 0.45, 0.6, 0.7, 0.85], [-900, -300, 0, 0, -10, -10, 0]);
  const pepperoniY = useTransform(scrollYProgress, [0, 0.2, 0.3, 0.45, 0.6, 0.7, 0.85], [-1200, -450, 0, 0, -90, -90, 0]);
  const basilY = useTransform(scrollYProgress, [0, 0.2, 0.3, 0.45, 0.6, 0.7, 0.85], [-1500, -600, 0, 0, -170, -170, 0]);
  const oilY = useTransform(scrollYProgress, [0, 0.2, 0.3, 0.45, 0.6, 0.7, 0.85], [-1800, -750, 0, 0, -250, -250, 0]);

  // Rotational variances for separate items entering the assembly frame
  const crustRotate = useTransform(scrollYProgress, [0, 0.3], [-60, 0]);
  const pepperoniRotate = useTransform(scrollYProgress, [0, 0.3], [90, 0]);

  // Labels presentation controls (Only active in Exploded Frame view 0.5 - 0.65)
  const labelsOpacity = useTransform(scrollYProgress, [0.48, 0.55, 0.62, 0.72], [0, 1, 1, 0]);

  // Interactive UI Transitions
  const finalGlowOpacity = useTransform(scrollYProgress, [0.8, 0.9], [0, 1]);
  const ctaOpacity = useTransform(scrollYProgress, [0.85, 0.95], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [0.85, 0.95], [60, 0]);

  // Heat distortion haze or baking steam simulation
  const bakingSteamOpacity = useTransform(scrollYProgress, [0.22, 0.32, 0.42, 0.5], [0, 0.9, 0.9, 0]);

  // --- INTERACTION STATE ---
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);

  const layerSchema = [
    { id: 'oil', label: 'Extra Virgin Olive Oil', desc: 'Cold-pressed Sicilian olives, drizzled in structural spirals for raw brightness.', y: oilY, Component: OliveOilDrizzle, rotate: 0, z: 60 },
    { id: 'basil', label: 'Fresh Napoletano Basil', desc: 'Organic sweet basil, sweet, pungent, and structural. Plucked right before composition.', y: basilY, Component: BasilLayers, rotate: 0, z: 50 },
    { id: 'pepperoni', label: 'Artisanal Pepperoni', desc: 'Slow-cured heritage pork seasoned with smoked paprika and dynamically crisped edges.', y: pepperoniY, Component: PepperoniLayers, rotate: pepperoniRotate, z: 40 },
    { id: 'cheese', label: 'Fior di Latte Mozzarella', desc: 'Fresh Agrade whole milk curd, pulled gently to ensure delicate water content and perfect stretch.', y: cheeseY, Component: MozzarellaBlobs, rotate: 0, z: 30 },
    { id: 'sauce', label: 'San Marzano Tomato Coulis', desc: 'Crushed volcanic soil tomatoes, combined strictly with sea salt. Pure crimson brilliance.', y: sauceY, Component: TomatoSauce, rotate: 0, z: 20 },
    { id: 'crust', label: 'Slow-Fermented Cornicione', desc: '72-hour cold hydration sourdough base. Blistered at 900°F for pillowy wood-fired texture.', y: crustY, Component: PizzaCrust, rotate: crustRotate, z: 10 },
  ];

  return (
    <div ref={containerRef} className="relative bg-[#020202] text-white select-none" style={{ height: '500vh' }}>
      
      {/* --- STICKY VIEWPORT CONTAINER --- */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center perspective-[1400px]">
        
        {/* Animated Background Canvas Layer */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-rose-950/20 rounded-full blur-[140px] mix-blend-screen"
            animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute bottom-[-15%] left-[-5%] w-[55vw] h-[55vw] bg-amber-950/15 rounded-full blur-[160px] mix-blend-screen"
            animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyIvPjwvc3ZnPg==')] opacity-25 pointer-events-none mix-blend-overlay" />
        </div>

        {/* Cinematic Reassembly Golden Halo */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
          style={{ opacity: finalGlowOpacity }}
        >
          <div className="w-[85vw] h-[85vw] md:w-[45vw] md:h-[45vw] bg-gradient-to-tr from-amber-500/20 to-red-500/10 rounded-full blur-[160px]" />
        </motion.div>

        {/* Premium Intro Typography */}
        <motion.div 
          className="absolute z-50 text-center pointer-events-none px-6"
          style={{ opacity: introOpacity, y: introY }}
        >
          <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-4 uppercase">
            The Gastronomic <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-500 to-orange-400">Pizza</span>
          </h1>
          <p className="text-neutral-500 tracking-[0.3em] uppercase text-xs md:text-sm font-bold">
            Scroll to Initiate Deconstruction
          </p>
          <motion.div 
            className="w-[1px] h-20 bg-gradient-to-b from-red-500 to-transparent mx-auto mt-8"
            animate={{ scaleY: [0, 1, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 2.2, repeat: Infinity }}
          />
        </motion.div>

        {/* 3D Matrix Wrapper for structural elements */}
        <motion.div 
          className="relative z-20 flex flex-col items-center justify-center"
          style={{ 
            scale: globalScale,
            rotateX, 
            rotateY,
            rotateZ: globalRotation,
            transformStyle: "preserve-3d"
          }}
        >
          {/* Baking Thermal Currents Simulation */}
          <motion.div 
            className="absolute inset-0 w-[400px] h-[400px] pointer-events-none z-70 flex items-center justify-center"
            style={{ opacity: bakingSteamOpacity }}
          >
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute bg-white/[0.04] rounded-full blur-[25px]"
                style={{ 
                  width: 80 + i * 20, 
                  height: 80 + i * 20,
                  border: '1px solid rgba(255,255,255,0.03)' 
                }}
                animate={{ 
                  scale: [0.9, 1.2, 0.9],
                  rotate: [0, 360],
                  opacity: [0.2, 0.6, 0.2]
                }}
                transition={{ 
                  duration: 4 + i, 
                  repeat: Infinity, 
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>

          {/* Interactive Stacked Material Layers */}
          {layerSchema.map((layer) => (
            <motion.div
              key={layer.id}
              className="absolute flex items-center justify-center cursor-pointer group"
              style={{ 
                y: layer.y, 
                rotateZ: layer.rotate,
                zIndex: layer.z 
              }}
              onClick={() => setSelectedLayer(layer.id)}
              whileHover={{ scale: 1.04 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              {/* Architectural Vector Canvas Geometry */}
              <motion.div
                className="relative flex items-center justify-center"
                animate={selectedLayer === layer.id ? { scale: 1.08, filter: "brightness(1.25) contrast(1.05)" } : { scale: 1, filter: "brightness(1) contrast(1)" }}
              >
                <layer.Component />
              </motion.div>

              {/* Dynamic Information Guidelines */}
              <motion.div 
                className="absolute left-[115%] w-[240px] hidden lg:block pointer-events-none"
                style={{ opacity: labelsOpacity }}
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-[1px] bg-gradient-to-r from-white/40 to-transparent group-hover:from-amber-400 transition-all duration-300" />
                  <div className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 px-5 py-3 rounded-2xl shadow-xl">
                    <p className="text-xs uppercase font-semibold tracking-widest text-neutral-400 mb-0.5">Component Layer</p>
                    <p className="text-sm font-black text-white whitespace-nowrap">{layer.label}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Detail Inspection Modal overlay */}
        <AnimatePresence>
          {selectedLayer && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
              onClick={() => setSelectedLayer(null)}
            >
              <motion.div 
                initial={{ scale: 0.92, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.92, y: 30 }}
                className="bg-[#0b0b0b] border border-white/10 p-8 rounded-[32px] max-w-md w-full shadow-2xl relative overflow-hidden"
                onClick={e => e.stopPropagation()}
              >
                {/* Visual back-glow gradient asset built with CSS */}
                <div className="absolute -top-12 -right-12 w-40 h-40 bg-gradient-to-br from-red-500/20 to-transparent rounded-full blur-[40px] pointer-events-none" />
                
                <span className="text-xs font-bold text-red-500 tracking-[0.2em] uppercase block mb-2">Provenance Archive</span>
                <h3 className="text-3xl font-black text-white tracking-tight mb-3">
                  {layerSchema.find(l => l.id === selectedLayer)?.label}
                </h3>
                <p className="text-neutral-400 leading-relaxed text-base mb-8">
                  {layerSchema.find(l => l.id === selectedLayer)?.desc}
                </p>
                <button 
                  onClick={() => setSelectedLayer(null)}
                  className="w-full py-4 bg-white text-black hover:bg-neutral-200 rounded-2xl font-bold tracking-wide transition-all shadow-lg active:scale-[0.98]"
                >
                  Return to Breakdown
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global CTA Finale Layer */}
        <motion.div 
          className="absolute bottom-16 left-0 right-0 flex flex-col items-center justify-center z-40 px-6"
          style={{ opacity: ctaOpacity, y: ctaY }}
        >
          <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tight text-center max-w-2xl leading-none">
            Culinary Precision. <br />Composed entirely in <span className="text-red-500">Code</span>.
          </h2>
          <button className="group relative px-10 py-5 bg-white text-black rounded-full font-black text-sm tracking-widest uppercase overflow-hidden shadow-[0_10px_30px_rgba(255,255,255,0.2)] transition-all hover:scale-105 active:scale-95">
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative z-10 group-hover:text-white transition-colors duration-500">
              Acquire Taste Experience
            </span>
          </button>
        </motion.div>

      </div>
    </div>
  );
}