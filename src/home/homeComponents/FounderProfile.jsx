"use client"

import { motion } from "framer-motion"
import founder from "@/assets/founder.jpg"; // Adjust the path as necessary

export default function FounderProfile() {
  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Decorative wavy lines - top right */}
        <div className="absolute top-8 right-8 w-64 h-32">
          <svg viewBox="0 0 200 100" className="w-full h-full">
            <path d="M0,50 Q50,20 100,50 T200,50" stroke="#fbb6ce" strokeWidth="2" fill="none" opacity="0.6" />
            <path d="M0,30 Q50,0 100,30 T200,30" stroke="#fbb6ce" strokeWidth="2" fill="none" opacity="0.4" />
          </svg>
        </div>

        {/* Decorative wavy lines - bottom */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-96 h-24">
          <svg viewBox="0 0 300 80" className="w-full h-full">
            <path d="M0,40 Q75,10 150,40 T300,40" stroke="#fbb6ce" strokeWidth="2" fill="none" opacity="0.5" />
            <path d="M0,60 Q75,30 150,60 T300,60" stroke="#fbb6ce" strokeWidth="2" fill="none" opacity="0.3" />
          </svg>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          {/* Profile Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
            className="flex justify-center lg:justify-start"
          >
            <div className="relative">
              <div className="w-80 h-96 rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={founder}
                  alt="Founder Profile"
                  width={320}
                  height={384}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true, amount: 0.3 }}
            className="lg:col-span-2"
          >
            {/* ⭐️ MODIFIED: Name and Title are now at the top of the description */}
            <div className="space-y-6">
              <div className="text-left">
                <h3 className="text-3xl font-bold text-gray-900 mb-2">Ankur Bhatia</h3>
                <p className="text-xl text-gray-600 mb-6">Founder and CEO</p>
              </div>
              <p className="text-lg leading-relaxed text-gray-700">
                As Founder and Chief Executive Officer of Navigant, Ankur Bhatia is responsible for the vision and the global planning with business strategies in place at Navigant. An expert at raising and mentoring teams and making them successful, Ankur being an effective leader has continually diversified its solution offerings and promised to take Navigant Technologies to the forefront of the global outsourcing industry.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}