import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, Coffee, Users, ShoppingBag, PieChart, ChefHat, UserCircle, 
  Fingerprint, MailCheck, AlertCircle, ArrowRight, Sparkles 
} from 'lucide-react';
import Footer from '@/components/layout/Footer';

const roles = [
  {
    icon: <Shield className="w-10 h-10 text-amber-500" />,
    title: 'Admin',
    description: 'The master orchestrator. Has full access to everything in the system.',
    features: [
      'Manage multiple branches and view cross-branch analytics.',
      'Control the Raw Materials Catalog and oversee Main Store Inventory.',
      'Build recipes for products and set category hierarchies.',
      'Manage staff accounts: update details, assign roles, change branch assignments, or delete users.',
      'Track real-time sales, order histories, and generate comprehensive reports.'
    ]
  },
  {
    icon: <PieChart className="w-10 h-10 text-orange-400" />,
    title: 'Manager',
    description: 'Oversees daily operations for specific branches.',
    features: [
      'Monitor branch-specific analytics and daily sales.',
      'Manage the product menu (availability, pricing).',
      'Oversee the Main Store inventory for their branch.',
      'View detailed order histories and resolve customer issues.'
    ]
  },
  {
    icon: <ShoppingBag className="w-10 h-10 text-green-400" />,
    title: 'Cashier',
    description: 'Handles point-of-sale transactions and walk-in orders.',
    features: [
      'Use a streamlined POS system to take orders for walk-in customers.',
      'Process payments and automatically route orders to the appropriate station (Kitchen or Barista).',
      'Manage order status for takeaways and dine-ins.'
    ]
  },
  {
    icon: <Users className="w-10 h-10 text-blue-400" />,
    title: 'Waiter',
    description: 'The bridge between customers and the preparation stations.',
    features: [
      'Take orders at the table using the Waiter app interface.',
      'Send orders directly to the Kitchen (for food) or Barista (for drinks).',
      'Receive real-time updates when orders are "Ready" to be served.',
      'Manage their assigned tables and track their specific order history.'
    ]
  },
  {
    icon: <Coffee className="w-10 h-10 text-amber-300" />,
    title: 'Barista',
    description: 'Specialists in crafting beverages.',
    features: [
      'Receive real-time beverage orders on a dedicated display.',
      'Manage Barista station inventory and request ingredients from the Main Store.',
      'Mark orders as "In Progress" and "Ready" so waiters know when to serve.',
      'Inventory automatically deducts based on the recipes of the drinks prepared.'
    ]
  },
  {
    icon: <ChefHat className="w-10 h-10 text-red-400" />,
    title: 'Kitchen',
    description: 'The culinary heart of the cafe.',
    features: [
      'View food-only orders on the Kitchen Display System (KDS).',
      'Request raw food materials from the Main Store to the Kitchen Inventory.',
      'Update order statuses as dishes are prepared and finished.',
      'Automatic ingredient deduction based on food recipes when orders are completed.'
    ]
  },
  {
    icon: <UserCircle className="w-10 h-10 text-purple-400" />,
    title: 'Customer',
    description: 'The guests enjoying the cafe experience.',
    features: [
      'Browse the live menu and view detailed product descriptions.',
      'Place orders online for pickup or delivery.',
      'Track order status in real-time (Pending, Preparing, Ready).',
      'View order history and manage their profile.'
    ]
  }
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#050301] text-neutral-300 font-sans selection:bg-amber-500/30 selection:text-amber-200 overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 md:px-12">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0f05] to-[#050301] pointer-events-none" />
        
        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-semibold uppercase tracking-widest mb-6">
              <Sparkles size={16} />
              <span>The Cafe Engine</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight">
              How <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Mr. Cafe</span> Works
            </h1>
            <p className="text-lg md:text-xl text-neutral-400 max-w-3xl mx-auto leading-relaxed">
              Our system is designed to seamlessly connect every part of the cafe experience. From the moment an order is placed to the precise deduction of raw ingredients, everything works in perfect harmony.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Authentication Flow Section */}
      <section className="relative py-20 px-6 md:px-12 max-w-6xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white"
          >
            Secure & Seamless Access
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-neutral-400 max-w-2xl mx-auto"
          >
            Getting into the system is fast and secure. Whether you are a customer placing a quick order or an admin managing the ecosystem, here is how you log in.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* Google Login Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative bg-gradient-to-br from-[#120804] to-[#0a0402] border border-white/5 rounded-3xl p-8 hover:border-amber-500/40 transition-all duration-500 group overflow-hidden"
          >
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] group-hover:bg-amber-500/20 transition-all duration-500" />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform duration-500">
                <Fingerprint size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">1-Click Google Login</h3>
              <p className="text-neutral-400 leading-relaxed mb-6">
                The fastest way to access your account. Connect your existing Google account for instant, secure authentication without needing to remember another password.
              </p>
              <div className="flex items-center gap-2 text-sm text-amber-500 font-semibold group-hover:translate-x-2 transition-transform">
                Experience Instant Access <ArrowRight size={16} />
              </div>
            </div>
          </motion.div>

          {/* Email Registration Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative bg-gradient-to-br from-[#120804] to-[#0a0402] border border-white/5 rounded-3xl p-8 hover:border-orange-500/40 transition-all duration-500 group overflow-hidden"
          >
            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-orange-600/10 rounded-full blur-[80px] group-hover:bg-orange-600/20 transition-all duration-500" />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-orange-400 mb-6 group-hover:scale-110 transition-transform duration-500">
                <MailCheck size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Email Registration & Verification</h3>
              <p className="text-neutral-400 leading-relaxed mb-6">
                Prefer traditional email? Fill out your information on our secure input page. We automatically send a verification link to ensure your security.
              </p>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={18} />
                <p className="text-xs text-amber-200/80 leading-relaxed">
                  <strong>Pro Tip:</strong> After registering for the first time, check your inbox for the verification link. If you don't see it immediately, <strong>please check your spam folder</strong>.
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Roles Section */}
      <section className="relative py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/5">
        <div className="space-y-16">
          
          <div className="text-center space-y-4">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-bold text-white"
            >
              Role-Based Ecosystem
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-neutral-400 max-w-2xl mx-auto text-lg"
            >
              Every staff member and customer has a dedicated interface tailored strictly to their responsibilities. Here is exactly how each role interacts with the platform.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {roles.map((role, idx) => (
              <motion.div
                key={role.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-[#120804]/80 backdrop-blur-sm border border-white/5 rounded-3xl p-8 hover:border-amber-500/30 transition-all duration-300 group hover:-translate-y-2 shadow-xl shadow-black/50"
              >
                <div className="mb-6 p-4 rounded-2xl bg-white/5 inline-block border border-white/10 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  {role.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{role.title}</h3>
                <p className="text-neutral-400 mb-6 text-sm leading-relaxed border-b border-white/5 pb-6">
                  {role.description}
                </p>
                <ul className="space-y-4">
                  {role.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-neutral-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0 group-hover:shadow-[0_0_8px_rgba(245,158,11,0.8)] transition-shadow" />
                      <span className="leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* Advanced Features (Inventory Flow) */}
      <section className="relative py-32 px-6 md:px-12 max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-br from-[#1a0f05] to-[#0a0502] border border-amber-500/20 rounded-[40px] p-8 md:p-16 relative overflow-hidden shadow-2xl shadow-amber-900/10"
        >
          
          {/* Animated Background Gradients inside the card */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative z-10 space-y-12">
            <div className="text-center">
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
                The Engine: <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Branch Isolation & Inventory</span>
              </h2>
              <p className="text-neutral-300 max-w-3xl mx-auto text-lg leading-relaxed">
                To ensure data integrity and prevent confusion between different store locations, Mr. Cafe uses a strict <strong className="text-amber-400">Branch Isolation Protocol</strong>.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <motion.div whileHover={{ y: -5 }} className="bg-black/40 backdrop-blur-md p-8 rounded-3xl border border-white/5 hover:border-amber-500/30 transition-colors">
                <div className="text-amber-500 font-black text-4xl mb-4 opacity-50">01</div>
                <h3 className="text-xl font-bold text-white mb-4">Raw Materials & Main Store</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  When an Admin defines a new raw material, it is assigned exclusively to a specific branch. The <strong>Main Store Inventory</strong> tracks large bulk quantities for that specific branch. A manager in one branch will never accidentally modify another branch's stock.
                </p>
              </motion.div>

              <motion.div whileHover={{ y: -5 }} className="bg-black/40 backdrop-blur-md p-8 rounded-3xl border border-white/5 hover:border-orange-500/30 transition-colors">
                <div className="text-orange-500 font-black text-4xl mb-4 opacity-50">02</div>
                <h3 className="text-xl font-bold text-white mb-4">Station Stock Requests</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  The Kitchen and Barista stations do not pull directly from the Main Store for every single order. Instead, they "request" bulk ingredients (e.g., 5kg of Coffee) to their local station stock, allowing workers to focus purely on preparation.
                </p>
              </motion.div>

              <motion.div whileHover={{ y: -5 }} className="bg-black/40 backdrop-blur-md p-8 rounded-3xl border border-white/5 hover:border-amber-500/30 transition-colors">
                <div className="text-amber-500 font-black text-4xl mb-4 opacity-50">03</div>
                <h3 className="text-xl font-bold text-white mb-4">Automated Deductions</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  The magic happens during checkout. When an order is finalized and completed by the Kitchen or Barista, the system automatically analyzes the recipe and subtracts exact microscopic amounts (e.g., 18g of coffee) from that station's local stock.
                </p>
              </motion.div>

            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}