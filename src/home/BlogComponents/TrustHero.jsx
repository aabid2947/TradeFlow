"use client"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import HeroMan from "@/assets/Hero-Man.png" // Assuming you have a similar image asset
import IdCard from "@/assets/Hero-Man.png" // Asset for the ID card

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

export default function TrustHero() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Content Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="space-y-6"
        >
          <motion.p variants={itemVariants} className="text-sm font-bold text-gray-800 uppercase tracking-wider">
            IDENTITY VERIFICATION SOLUTIONS
          </motion.p>
          <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Powerful document and identity verification for streamlined onboarding
          </motion.h1>
          <motion.p variants={itemVariants} className="text-lg text-gray-600 leading-relaxed">
            Onboard more genuine customers with Veriff's Identity and Document Verification solution. It is proven to deliver speed, convenience, and low friction for your users resulting in high conversion rates, fraud mitigation, and operational efficiency for your business.
          </motion.p>
          
          {/* Restored Button Section */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 pt-6">
            <button className="group relative overflow-hidden bg-blue-500 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <span className="relative z-10 flex items-center gap-2">
                Learn more
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>
            <button className="group relative overflow-hidden bg-green-400 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <span className="relative z-10 flex items-center gap-2">
                Use service
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>
          </motion.div>
        </motion.div>

        {/* Right Image Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative h-96 lg:h-full flex items-center justify-center"
        >
          {/* Main Person Image */}
          <motion.img
            src={HeroMan}
            alt="A person smiling, representing a verified user"
            className="absolute z-20 w-80 h-80 object-cover rounded-full shadow-2xl bottom-0 right-0"
            initial={{ scale: 0.5, opacity: 0, y: 100 }}
            whileInView={{ scale: 1, opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
          />

          {/* ID Card Image */}
          <motion.img
            src={IdCard}
            alt="An example of a Spanish ID card for verification"
            className="absolute z-10 w-72 rounded-xl shadow-xl top-8 left-0 transform -rotate-6"
            initial={{ scale: 0.5, opacity: 0, y: -50 }}
            whileInView={{ scale: 1, opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          />
          
          {/* Verifying Identity Badge */}
           <motion.div
            className="absolute z-30 bottom-1/3 left-1/4 flex flex-col items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.5 }}
           >
              <p className="text-sm font-semibold text-gray-700 mb-2">Verifying identity</p>
              <div className="w-12 h-12 bg-teal-900 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              </div>
           </motion.div>

          {/* Decorative Arc */}
          <motion.div
            className="absolute z-0 w-[450px] h-[450px] border-2 border-gray-300 rounded-full"
            initial={{ scale: 1.2, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "circOut" }}
          />
        </motion.div>
      </div>
    </section>
  )
}