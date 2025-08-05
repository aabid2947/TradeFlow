"use client"

import { motion } from "framer-motion"
import { Monitor, Gauge, ShieldCheck, FileText, Check } from "lucide-react"

// Icons mapping for dynamic rendering
const iconMap = {
  Monitor,
  Gauge,
  ShieldCheck,
  FileText,
};

export default function VerificationFeatures({ data }) {
  const {
    verificationTitle = 'Verify individuals in seconds, anywhere in the world',
    verificationDescription = 'Our solution combines AI-powered automation with human feedback.',
    verificationFeatures = []
  } = data || {};

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } } };

  return (
    <section className="w-full mx-auto py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7, ease: "easeOut" }}>
          {verificationTitle}
        </motion.h2>
        <motion.p className="text-lg text-gray-600 max-w-3xl mx-auto mb-16 leading-relaxed" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}>
          {verificationDescription}
        </motion.p>
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
          {verificationFeatures.map((feature, index) => {
            const Icon = iconMap[feature.icon] || FileText; // Fallback icon
            return (
              <motion.div key={index} className="flex flex-col items-center text-center p-6 rounded-lg bg-white shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2" variants={itemVariants}>
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-full bg-[#E0F7F5] flex items-center justify-center shadow-md">
                    <Icon className="w-12 h-12 text-[#00A389]" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#00A389] rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}