import { motion } from 'framer-motion'
import { useState } from 'react'

const GALLERY_IMAGES = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  src: `/gallery/picture${i + 1}.png`,
  span: i % 3 === 0 ? 2 : 1, // Varied sizes
}))

export default function GallerySection() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
  }

  return (
    <section className="py-24 px-6 bg-background relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-amber-950/10 blur-[150px] pointer-events-none" />

      {/* Decorative element */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute top-10 left-10 w-32 h-32 border border-primary/10 rounded-full"
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-bold text-center mb-14 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-500 to-orange-500"
        >
          Gallery
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, threshold: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]"
        >
          {GALLERY_IMAGES.map((img) => (
            <motion.div
              key={img.id}
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              onClick={() => setSelectedImage(img.id)}
              className={`relative rounded-2xl overflow-hidden border border-white/10 cursor-pointer group transition-all duration-300 hover:border-amber-500/30 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] ${
                img.span === 2 ? 'md:col-span-2 md:row-span-2' : ''
              }`}
            >
              <img
                src={img.src}
                alt={`Gallery ${img.id + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />

              {/* Overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />

              {/* Floating text */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100"
                whileHover={{ scale: 1.1 }}
              >
                <span className="text-sm text-primary font-semibold tracking-wider">View</span>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Modal lightbox */}
      {selectedImage !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={GALLERY_IMAGES[selectedImage].src}
              alt="Fullscreen"
              className="w-full rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(245,158,11,0.25)]"
            />
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}