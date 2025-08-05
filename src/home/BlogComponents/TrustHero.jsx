"use client"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

export default function TrustHero({ data }) {
  // Destructure the needed fields, now only using heroImage1 as the main hero image.
  const {
    heroSubtitle = "IDENTITY VERIFICATION SOLUTIONS",
    heroTitle = "Powerful Document and Identity Verification",
    heroDescription = "Onboard more genuine customers with our proven identity verification solution.",
    heroImage1, // This will be the single hero image object { url: '...' }
  } = data || {};

  return (
    <section className="bg-white py-4 md:py-8 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Content Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="space-y-6 text-center lg:text-left"
        >
          <motion.p variants={itemVariants} className="text-sm font-bold text-[#1987BF] uppercase tracking-wider">
            {heroSubtitle}
          </motion.p>
          <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            {heroTitle}
          </motion.h1>
          <motion.p variants={itemVariants} className="text-lg text-gray-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
            {heroDescription}
          </motion.p>
{/*           
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 pt-6 justify-center lg:justify-start">
            <button className="group relative overflow-hidden bg-[#1987BF] hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <span className="relative z-10 flex items-center justify-center gap-2">
                Learn more
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>
            <button className="group relative overflow-hidden bg-gray-800 hover:bg-gray-900 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <span className="relative z-10 flex items-center justify-center gap-2">
                Use Service
              </span>
            </button>
          </motion.div> */}
        </motion.div>

        {/* Right Image Section */}
        <motion.div
          className="relative flex items-center justify-center h-[500px]"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Background Shape */}
          {/* <div className="absolute w-full h-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl transform -rotate-6 scale-105"></div> */}
          
          {/* Main Hero Image */}
          <motion.div 
            className="relative w-full h-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
            initial={{ y: 20 }}
            whileInView={{ y: 0 }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          >
            <img
              src={heroImage1?.url || 'https://placehold.co/600x800/E2E8F0/475569?text=Hero+Image'}
              alt={heroTitle || "Hero Image"}
              className="w-full h-full object-cover"
            />
             <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
