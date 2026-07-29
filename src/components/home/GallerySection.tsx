"use client";

import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useState } from "react";
import { X, Search } from "lucide-react";

// Using a varied layout for a modern bento-box gallery feel
const GALLERY_IMAGES = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  src: `/gallery/picture${i + 1}.png`,
  // Creates a beautiful asymmetrical grid
  span: i === 0 || i === 3 ? 2 : 1, 
}));

export default function GallerySection() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] },
    },
  };

  return (
    <section className="py-24 px-6 bg-[#050301] relative overflow-hidden min-h-screen flex flex-col items-center">
      
      {/* ================= BACKGROUND EFFECTS ================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#2a1608]/50 blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-900/10 rounded-full blur-[120px] mix-blend-screen" />
        
        {/* Animated decorative ring */}
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.05, 1] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 -left-20 w-[400px] h-[400px] border border-amber-500/10 rounded-full border-dashed"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 w-full flex flex-col items-center">
        
        {/* ================= HEADER ================= */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full border border-amber-500/30 bg-amber-500/5 backdrop-blur-md shadow-[0_0_15px_rgba(245,158,11,0.05)]"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-xs md:text-sm text-amber-200/80 uppercase tracking-[0.2em] font-semibold">
            Moments
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-center mb-16 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-500 to-orange-500"
        >
          Our Gallery
        </motion.h2>

        {/* ================= GRID ================= */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[250px] md:auto-rows-[300px] w-full"
        >
          {GALLERY_IMAGES.map((img) => (
            <motion.div
              key={img.id}
              variants={itemVariants}
              onClick={() => setSelectedImage(img.id)}
              className={`relative rounded-3xl overflow-hidden border border-white/10 cursor-pointer group transform-gpu transition-all duration-500 hover:border-amber-500/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.2)] ${
                img.span === 2 ? "md:col-span-2 md:row-span-2" : ""
              }`}
            >
              {/* Image with smooth scale on hover */}
              <img
                src={img.src}
                alt={`Gallery moment ${img.id + 1}`}
                className="w-full h-full object-cover transform-gpu transition-transform duration-700 ease-out group-hover:scale-110"
                loading="lazy"
              />

              {/* Advanced Glassmorphism Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#050301]/90 via-[#050301]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Hover Content (Slides up) */}
              <div className="absolute inset-0 p-6 flex flex-col items-center justify-center opacity-0 translate-y-8 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-400/30 flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(245,158,11,0.3)] group-hover:scale-110 transition-transform duration-500">
                  <Search className="text-amber-300 w-5 h-5" />
                </div>
                <span className="text-sm text-amber-100 font-semibold tracking-widest uppercase drop-shadow-md">
                  View Image
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ================= ADVANCED LIGHTBOX MODAL ================= */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.4 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 bg-[#050301]/90 flex items-center justify-center p-4 md:p-8"
          >
            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ delay: 0.2 }}
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 md:top-10 md:right-10 w-12 h-12 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-amber-500/20 hover:border-amber-500/50 hover:text-amber-400 transition-all duration-300 z-50"
            >
              <X className="w-6 h-6" />
            </motion.button>

            {/* Modal Image Wrapper */}
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl max-h-[85vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image
            >
              {/* Back glow for the modal image */}
              <div className="absolute inset-0 bg-amber-500/20 blur-[100px] rounded-full pointer-events-none" />
              
              <img
                src={GALLERY_IMAGES.find((img) => img.id === selectedImage)?.src}
                alt="Fullscreen view"
                className="relative z-10 max-w-full max-h-[85vh] object-contain rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(245,158,11,0.2)]"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}