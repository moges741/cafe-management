import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useGetProductsQuery } from '@/features/products/productsApi'
import { useCurrentBranch } from '@/hooks/useCurrentBranch'

export default function FeaturedMenuSection() {
  const { branchId } = useCurrentBranch()
  const { data: products = [], isLoading } = useGetProductsQuery({
    branchId: branchId || undefined,
    isAvailable: true,
  }, { skip: !branchId })
  const featured = products.slice(0, 4)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <section className="py-24 px-6 bg-background relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-amber-950/10 blur-[150px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-12"
        >
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-500 to-orange-500">
            Featured menu
          </h2>
          <Link to="/menu" className="flex items-center gap-2 text-primary group font-medium hover:text-amber-400 transition-colors">
            View all
            <motion.span whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
              <ArrowRight size={16} />
            </motion.span>
          </Link>
        </motion.div>

        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl bg-card animate-pulse border border-border" />
            ))}
          </div>
        )}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {featured.map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
              <Link to={`/menu/${product.id}`} className="group block">
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm aspect-square mb-3 transition-all duration-300 group-hover:border-amber-500/30 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]">
                  <motion.div
                    className="w-full h-full"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.5 }}
                  >
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-primary/20">
                        MC
                      </div>
                    )}
                  </motion.div>

                  {/* Overlay on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4"
                    whileHover={{ opacity: 1 }}
                  >
                    <span className="text-xs text-primary font-semibold tracking-wider">View details</span>
                  </motion.div>
                </div>

                <p className="text-sm font-medium text-foreground truncate group-hover:text-amber-400 transition-colors">
                  {product.name}
                </p>
                <p className="text-xs text-primary mt-1 font-semibold">{Number(product.price).toFixed(0)} ETB</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}