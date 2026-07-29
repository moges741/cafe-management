import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

// --- INGREDIENT CSS COMPONENTS (Pure CSS/Tailwind, NO Images) ---

const SesameSeed = ({ className = "" }) => (
  <div className={`absolute w-1.5 h-2.5 bg-amber-100/80 rounded-full shadow-sm ${className}`} />
);

const TopBun = () => (
  <div className="relative w-[280px] h-[120px] bg-gradient-to-br from-[#f2be7e] via-[#c47225] to-[#803a08] rounded-[50%_50%_15%_15%_/_100%_100%_20%_20%] shadow-[inset_0_-10px_20px_rgba(0,0,0,0.5),0_15px_25px_rgba(0,0,0,0.4)] border-b border-orange-900/30 overflow-hidden">
    {/* Highlights */}
    <div className="absolute top-2 left-10 w-32 h-10 bg-white/20 rounded-full blur-md transform -rotate-12" />
    <div className="absolute top-4 right-12 w-20 h-6 bg-white/10 rounded-full blur-sm transform rotate-12" />
    
    {/* Sesame Seeds */}
    <SesameSeed className="top-8 left-16 rotate-[20deg]" />
    <SesameSeed className="top-12 left-24 rotate-[45deg]" />
    <SesameSeed className="top-6 left-32 rotate-[-15deg]" />
    <SesameSeed className="top-10 left-44 rotate-[80deg]" />
    <SesameSeed className="top-14 left-10 rotate-[-40deg]" />
    <SesameSeed className="top-16 left-32 rotate-[10deg]" />
    <SesameSeed className="top-8 right-24 rotate-[-30deg]" />
    <SesameSeed className="top-14 right-16 rotate-[50deg]" />
    <SesameSeed className="top-12 right-32 rotate-[-10deg]" />
    <SesameSeed className="top-6 right-12 rotate-[70deg]" />
    <SesameSeed className="top-18 left-52 rotate-[35deg]" />
  </div>
);

const Lettuce = () => (
  <div className="relative w-[310px] h-[35px] flex items-center justify-center">
    <div className="absolute w-[290px] h-[25px] bg-gradient-to-b from-[#6ee744] to-[#2b8a0f] rounded-[40%_60%_70%_30%_/_40%_50%_60%_50%] shadow-[0_5px_15px_rgba(0,0,0,0.3)] border-t border-green-300/40" />
    <div className="absolute w-[310px] h-[30px] bg-gradient-to-br from-[#53d127] to-[#1a6605] rounded-[60%_40%_30%_70%_/_50%_60%_40%_50%] shadow-[0_5px_15px_rgba(0,0,0,0.3)] opacity-90 transform -rotate-2" />
    <div className="absolute w-[280px] h-[20px] bg-gradient-to-r from-[#7af550] to-[#34a315] rounded-[50%] blur-[1px] opacity-80" />
  </div>
);

const Tomato = () => (
  <div className="relative w-[270px] h-[30px] flex gap-2 justify-center">
    <div className="w-[130px] h-[25px] bg-gradient-to-b from-[#ff4d4d] via-[#cc0000] to-[#800000] rounded-full shadow-[inset_0_2px_5px_rgba(255,255,255,0.4),0_8px_10px_rgba(0,0,0,0.4)] border border-red-500/50" />
    <div className="w-[130px] h-[25px] bg-gradient-to-b from-[#ff4d4d] via-[#cc0000] to-[#800000] rounded-full shadow-[inset_0_2px_5px_rgba(255,255,255,0.4),0_8px_10px_rgba(0,0,0,0.4)] border border-red-500/50" />
  </div>
);

const Cheese = () => (
  <div className="relative w-[260px] h-[15px] flex justify-center">
    {/* Main slice rotated flatly */}
    <div className="absolute w-[240px] h-[220px] bg-gradient-to-br from-[#ffe100] via-[#ffaa00] to-[#d67600] transform rotateX-[75deg] rotateZ-[45deg] rounded-md shadow-[0_10px_10px_rgba(0,0,0,0.4)] border-t border-yellow-200/50">
      <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent rounded-md" />
    </div>
    {/* Dripping bits */}
    <div className="absolute top-[5px] left-[30px] w-[25px] h-[40px] bg-gradient-to-b from-[#ffaa00] to-[#d67600] rounded-b-full shadow-[2px_5px_10px_rgba(0,0,0,0.3)]" />
    <div className="absolute top-[5px] right-[40px] w-[15px] h-[25px] bg-gradient-to-b from-[#ffaa00] to-[#d67600] rounded-b-full shadow-[2px_5px_10px_rgba(0,0,0,0.3)]" />
    <div className="absolute top-[5px] left-[120px] w-[20px] h-[30px] bg-gradient-to-b from-[#ffbb00] to-[#ffaa00] rounded-b-full shadow-[2px_5px_10px_rgba(0,0,0,0.3)]" />
  </div>
);

const Patty = () => (
  <div className="relative w-[280px] h-[45px] bg-[#2a1303] rounded-[30px] shadow-[inset_0_-5px_15px_rgba(0,0,0,0.8),0_15px_20px_rgba(0,0,0,0.6)] overflow-hidden flex items-center justify-center border-t border-[#4a260a]">
    {/* Texture Layers */}
    <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_50%_50%,#000_2px,transparent_2px)] bg-[size:8px_8px]" />
    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_70%,#4a260a_1px,transparent_1px)] bg-[size:5px_5px]" />
    {/* Highlights for grease */}
    <div className="absolute top-1 left-10 w-[200px] h-[5px] bg-white/10 rounded-full blur-[2px]" />
    <div className="absolute bottom-2 right-10 w-[100px] h-[5px] bg-[#5c2a04] rounded-full blur-[2px]" />
  </div>
);

const BottomBun = () => (
  <div className="relative w-[260px] h-[55px] bg-gradient-to-t from-[#6e3006] via-[#c47225] to-[#ebb167] rounded-[15%_15%_40%_40%_/_20%_20%_100%_100%] shadow-[inset_0_8px_15px_rgba(255,255,255,0.15),0_25px_40px_rgba(0,0,0,0.7)] border-t border-orange-200/20">
    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-[180px] h-[10px] bg-black/30 rounded-full blur-md" />
  </div>
);


// --- MAIN EXPERIENCE COMPONENT ---

export default function PremiumBurgerExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress
  const { scrollYProgress } = useScroll({ 
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Track mouse for interactive parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 30, stiffness: 100 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth - 0.5);
      mouseY.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // --- SCROLL ANIMATION CHOREOGRAPHY ---

  // Intro Text Opacity
  const introOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);
  const introY = useTransform(scrollYProgress, [0, 0.05], [0, -50]);

  // Global Scale (responsive and dramatic zooming)
  const globalScale = useTransform(scrollYProgress, 
    [0.1, 0.3, 0.5, 0.6, 0.8, 0.9], 
    [0.5, 1, 1.1, 0.8, 0.8, 1.2]
  );

  // Y-Transforms for each ingredient (Intro -> Assembled -> Exploded -> Assembled)
  // Stage 0.1 - 0.3: Fly in
  // Stage 0.3 - 0.45: Assembled
  // Stage 0.45 - 0.65: Explode
  // Stage 0.65 - 0.85: Reassemble
  const bunTopY = useTransform(scrollYProgress, [0, 0.2, 0.3, 0.45, 0.6, 0.7, 0.85], [-1000, -400, -80, -80, -350, -350, -80]);
  const lettuceY = useTransform(scrollYProgress, [0, 0.2, 0.3, 0.45, 0.6, 0.7, 0.85], [-800, -200, -35, -35, -200, -200, -35]);
  const tomatoY = useTransform(scrollYProgress, [0, 0.2, 0.3, 0.45, 0.6, 0.7, 0.85], [-1200, -100, -15, -15, -80, -80, -15]);
  const cheeseY = useTransform(scrollYProgress, [0, 0.2, 0.3, 0.45, 0.6, 0.7, 0.85], [-600, 0, 5, 5, 40, 40, 5]);
  const pattyY = useTransform(scrollYProgress, [0, 0.2, 0.3, 0.45, 0.6, 0.7, 0.85], [1000, 200, 30, 30, 160, 160, 30]);
  const bunBottomY = useTransform(scrollYProgress, [0, 0.2, 0.3, 0.45, 0.6, 0.7, 0.85], [1200, 400, 75, 75, 300, 300, 75]);

  // Opacities & Rotations
  const bunTopRotate = useTransform(scrollYProgress, [0, 0.3], [-45, 0]);
  const pattyRotate = useTransform(scrollYProgress, [0, 0.3], [45, 0]);
  
  // Labels Opacity (Only visible in Exploded stage 0.5 - 0.65)
  const labelsOpacity = useTransform(scrollYProgress, [0.45, 0.55, 0.65, 0.75], [0, 1, 1, 0]);

  // Final Glow & CTA
  const finalGlowOpacity = useTransform(scrollYProgress, [0.8, 0.9], [0, 1]);
  const ctaOpacity = useTransform(scrollYProgress, [0.85, 0.95], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [0.85, 0.95], [50, 0]);

  // Smoke effect (visible during assembly)
  const smokeOpacity = useTransform(scrollYProgress, [0.25, 0.3, 0.4, 0.45], [0, 1, 1, 0]);

  // --- STATE FOR INTERACTION ---
  const [selectedIngredient, setSelectedIngredient] = useState<string | null>(null);

  const ingredientsData = [
    { id: 'bunTop', label: 'Artisan Brioche', desc: 'Hand-kneaded daily. Glazed with organic butter and toasted sesame.', y: bunTopY, Component: TopBun, rotate: bunTopRotate, z: 60 },
    { id: 'lettuce', label: 'Hydroponic Greens', desc: 'Crisp, refreshing, and harvested exactly 2 hours before serving.', y: lettuceY, Component: Lettuce, rotate: 0, z: 50 },
    { id: 'tomato', label: 'Heirloom Tomato', desc: 'Sun-ripened on the vine for maximum umami and natural sweetness.', y: tomatoY, Component: Tomato, rotate: 0, z: 40 },
    { id: 'cheese', label: 'Aged Cheddar', desc: 'Melted sharp cheddar aged for 24 months in oak barrels.', y: cheeseY, Component: Cheese, rotate: 0, z: 30 },
    { id: 'patty', label: 'Wagyu Blend Patty', desc: 'Premium A5 Wagyu mixed with dry-aged short rib. Smashed & seared.', y: pattyY, Component: Patty, rotate: pattyRotate, z: 20 },
    { id: 'bunBottom', label: 'Toasted Base', desc: 'Caramelized bottom to hold the juices perfectly intact.', y: bunBottomY, Component: BottomBun, rotate: 0, z: 10 },
  ];

  return (
    <div ref={containerRef} className="relative bg-[#030303] text-white" style={{ height: '500vh' }}>
      
      {/* --- STICKY VIEWPORT --- */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center perspective-[1200px]">
        
        {/* Living Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-amber-600/10 rounded-full blur-[120px] mix-blend-screen"
            animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-orange-800/10 rounded-full blur-[150px] mix-blend-screen"
            animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-20 pointer-events-none mix-blend-overlay" />
        </div>

        {/* Final Golden Glow */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
          style={{ opacity: finalGlowOpacity }}
        >
          <div className="w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] bg-amber-500/20 rounded-full blur-[150px]" />
        </motion.div>

        {/* Intro Text */}
        <motion.div 
          className="absolute z-50 text-center pointer-events-none"
          style={{ opacity: introOpacity, y: introY }}
        >
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">
            The Perfect <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Burger</span>
          </h1>
          <p className="text-neutral-400 tracking-widest uppercase text-sm md:text-base font-semibold">
            Scroll to Craft
          </p>
          <motion.div 
            className="w-[1px] h-16 bg-gradient-to-b from-amber-500 to-transparent mx-auto mt-8"
            animate={{ scaleY: [0, 1, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>

        {/* 3D Container for Burger */}
        <motion.div 
          className="relative z-20 flex flex-col items-center justify-center"
          style={{ 
            scale: globalScale,
            rotateX, 
            rotateY,
            transformStyle: "preserve-3d"
          }}
        >
          {/* Steam / Smoke particles */}
          <motion.div 
            className="absolute top-[-100px] left-0 right-0 h-[200px] pointer-events-none z-70"
            style={{ opacity: smokeOpacity }}
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-12 h-12 bg-white/10 rounded-full blur-[15px]"
                style={{ left: `${30 + i * 15}%` }}
                animate={{ 
                  y: [0, -150], 
                  opacity: [0, 0.8, 0],
                  scale: [1, 2] 
                }}
                transition={{ 
                  duration: 2 + Math.random(), 
                  repeat: Infinity, 
                  delay: i * 0.4,
                  ease: "easeOut"
                }}
              />
            ))}
          </motion.div>

          {/* Ingredients */}
          {ingredientsData.map((item) => (
            <motion.div
              key={item.id}
              className="absolute flex items-center justify-center cursor-pointer group"
              style={{ 
                y: item.y, 
                rotateZ: item.rotate,
                zIndex: item.z 
              }}
              onClick={() => setSelectedIngredient(item.id)}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {/* The Actual CSS Shape */}
              <motion.div
                animate={selectedIngredient === item.id ? { scale: 1.1, filter: "brightness(1.2)" } : { scale: 1, filter: "brightness(1)" }}
              >
                <item.Component />
              </motion.div>

              {/* Exploded View Labels */}
              <motion.div 
                className="absolute left-[110%] w-[200px] hidden md:block"
                style={{ opacity: labelsOpacity }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-[1px] bg-white/20 group-hover:bg-amber-500 transition-colors" />
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl">
                    <p className="text-sm font-bold text-white whitespace-nowrap">{item.label}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Info Modal for Interaction */}
        <AnimatePresence>
          {selectedIngredient && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
              onClick={() => setSelectedIngredient(null)}
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-[#0a0a0a] border border-white/10 p-8 rounded-3xl max-w-sm w-full shadow-2xl relative overflow-hidden"
                onClick={e => e.stopPropagation()}
              >
                {/* Glow inside modal */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-[40px] pointer-events-none" />
                
                <h3 className="text-2xl font-black text-white mb-2">
                  {ingredientsData.find(i => i.id === selectedIngredient)?.label}
                </h3>
                <p className="text-neutral-400 leading-relaxed mb-6">
                  {ingredientsData.find(i => i.id === selectedIngredient)?.desc}
                </p>
                <button 
                  onClick={() => setSelectedIngredient(null)}
                  className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors"
                >
                  Close Detail
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Final Call to Action */}
        <motion.div 
          className="absolute bottom-16 left-0 right-0 flex flex-col items-center justify-center z-40 pointer-events-auto"
          style={{ opacity: ctaOpacity, y: ctaY }}
        >
          <h2 className="text-3xl md:text-5xl font-black mb-8 drop-shadow-2xl text-center">
            Taste the <span className="text-amber-500">Masterpiece</span>.
          </h2>
          <button className="group relative px-8 py-4 bg-white text-black rounded-full font-bold text-lg overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-transform hover:scale-105 active:scale-95">
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative z-10 group-hover:text-white transition-colors duration-500">
              Order Experience Now
            </span>
          </button>
        </motion.div>

      </div>
    </div>
  );
}