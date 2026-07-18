"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, MessageCircleQuestion } from "lucide-react";

// Expanded, realistic FAQs tailored to the Ethiopian context and AI features
const FAQS = [
  {
    q: "How does the AI voice ordering work?",
    a: "Just tap the microphone icon floating on your screen and speak naturally. You can say, 'I'd like a large macchiato and a slice of chocolate cake,' and the AI will automatically build your cart and send it to the kitchen.",
  },
  {
    q: "Is the AI assistant available in local languages?",
    a: "Yes! The AI fully understands typed Amharic and Afaan Oromo. For voice input, English currently provides the fastest response, but we are actively training our models for local voice recognition.",
  },
  {
    q: "Do you have Tsom (fasting) and vegan options?",
    a: "Absolutely. We offer a dedicated plant-based menu every Wednesday and Friday, as well as during all major fasting seasons. This includes dairy-free macchiatos and vegan pastries.",
  },
  {
    q: "Can I pay with Telebirr or CBE Birr?",
    a: "Yes. Our checkout is integrated with Chapa, allowing you to pay seamlessly via Telebirr, CBE Birr, mobile banking, or international cards. We also accept cash on delivery or pickup.",
  },
  {
    q: "Where are you located and do you deliver?",
    a: "Our flagship Mr. Cafe is located in the heart of Nekemte. We offer fast, trackable delivery through the app for all neighborhoods within city limits, ensuring your coffee arrives hot.",
  },
  {
    q: "Can I reserve a quiet space for working?",
    a: "Yes, you can reserve a dedicated workspace or meeting table directly through the app. All dine-in guests have access to our complimentary high-speed WiFi and charging ports.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-32 px-6 bg-[#050301] relative overflow-hidden flex flex-col items-center min-h-screen">
      
      {/* ================= BACKGROUND EFFECTS ================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#2a1608]/30 blur-[150px]" />
        <div className="absolute bottom-10 right-0 w-[500px] h-[500px] bg-orange-950/20 rounded-full blur-[150px] mix-blend-screen" />
        <div className="absolute top-20 left-0 w-[400px] h-[400px] bg-amber-900/15 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10 w-full">
        
        {/* ================= HEADER ================= */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full border border-amber-500/30 bg-amber-500/5 backdrop-blur-md shadow-[0_0_15px_rgba(245,158,11,0.05)]"
          >
            <MessageCircleQuestion className="w-4 h-4 text-amber-500" />
            <span className="text-xs md:text-sm text-amber-200/80 uppercase tracking-[0.2em] font-semibold">
              Support
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-500 to-orange-500 mb-6"
          >
            Common questions
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            viewport={{ once: true }}
            className="text-base text-neutral-400 max-w-xl mx-auto"
          >
            Everything you need to know about our menu, AI ordering system, and local delivery services.
          </motion.p>
        </div>

        {/* ================= FAQ ACCORDION ================= */}
        <div className="space-y-4">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative rounded-2xl border backdrop-blur-xl transition-all duration-500 overflow-hidden ${
                  isOpen
                    ? "bg-white/10 border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.15)]"
                    : "bg-white/5 border-white/10 hover:border-amber-500/30 hover:bg-white/[0.07]"
                }`}
              >
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span className={`text-base md:text-lg font-semibold transition-colors duration-300 ${
                    isOpen ? "text-amber-100" : "text-white"
                  }`}>
                    {faq.q}
                  </span>
                  
                  {/* Animated Plus/Minus Icon */}
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className={`flex-shrink-0 ml-4 w-10 h-10 rounded-full flex items-center justify-center border transition-colors duration-300 ${
                      isOpen 
                        ? "bg-amber-500/20 border-amber-500/50 text-amber-400" 
                        : "bg-white/5 border-white/10 text-neutral-400 hover:text-white"
                    }`}
                  >
                    {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.2, 0.65, 0.3, 0.9] }}
                    >
                      <div className="px-6 pb-6 pt-2">
                        <div className="h-px w-full bg-gradient-to-r from-amber-500/20 to-transparent mb-4" />
                        <p className="text-sm md:text-base text-neutral-300 leading-relaxed pr-8">
                          {faq.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}