"use client"

import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { CheckCircle, PlayCircle } from "lucide-react"
import Man from "@/assets/Man.webp"
export default function TrustFeatures() {
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <motion.h2
          className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-center mb-12 text-gray-900"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          How returning customer trust can unlock the power of the digital economy
        </motion.h2>
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Section - Image/Video Placeholder and Speed Card */}
          <div className="flex flex-col gap-8">
            <motion.div
              className="relative w-full aspect-video rounded-lg overflow-hidden shadow-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <img
                src={Man}
                alt="Woman taking a selfie with a smartphone"
                layout="fill"
                objectFit="cover"
                width={800}
                className="rounded-lg"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <PlayCircle className="h-16 w-16 text-white/80 hover:text-white transition-colors cursor-pointer" />
              </div>
            </motion.div>

            <motion.div
              className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
              variants={cardVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-[#00A389]" /> {/* Custom color for the icon */}
                <span className="text-sm font-semibold text-gray-600">veriffiable</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">SPEED</h3>
              <p className="text-gray-600 mb-4">
                Don't lose customers to slow verification. Veriff's 6-second identity checks ensure seamless onboarding
                while minimizing abandonment and maximizing trust – because every second counts in today's digital
                world.
              </p>
              <Button className="bg-[#00A389] hover:bg-[#008C77] text-white px-6 py-2 rounded-md transition-colors">
                Try it out <span className="ml-1">&gt;</span>
              </Button>
            </motion.div>
          </div>

          {/* Right Section - Accuracy and Compliance Cards */}
          <div className="flex flex-col gap-8">
            <motion.div
              className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
              variants={cardVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-[#00A389]" />
                <span className="text-sm font-semibold text-gray-600">veriffiable</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">ACCURACY</h3>
              <p className="text-gray-600 mb-4">
                With industry-leading technology and 95% of genuine users successfully verified on their first try,
                Veriff delivers precise identity verification powered by AI. Trusted by over 2,000 global businesses,
                we've earned top industry awards for our proven reliability and fraud prevention capabilities.
              </p>
              <Button className="bg-[#00A389] hover:bg-[#008C77] text-white px-6 py-2 rounded-md transition-colors">
                Why Veriff? <span className="ml-1">&gt;</span>
              </Button>
            </motion.div>

            <motion.div
              className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
              variants={cardVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-[#00A389]" />
                <span className="text-sm font-semibold text-gray-600">veriffiable</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">COMPLIANCE</h3>
              <p className="text-gray-600 mb-4">
                Stay ahead of global regulations with Veriff. Our compliance-driven platform meets the strictest KYC,
                AML, and data security standards, keeping your business safe and regulators satisfied across multiple
                authorities.
              </p>
              <Button className="bg-[#00A389] hover:bg-[#008C77] text-white px-6 py-2 rounded-md transition-colors">
                Trust Center <span className="ml-1">&gt;</span>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
