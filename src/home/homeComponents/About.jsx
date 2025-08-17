
import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { 
  Target,
  Eye
} from 'lucide-react';
import CompanyIntro from './Intro';
import FounderProfile from './FounderProfile';
import founder from "@/assets/founder.jpg";
import employer from "@/assets/Employer.jpg"

const AnimatedSection = ({ children, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const TeamMember = ({ name, role, quote, experience, image, delay = 0 }) => {
  return (
    <AnimatedSection className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: delay }}
        className="text-center"
      >
        <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200">
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-1">{name}</h3>
        <p className="text-blue-600 font-medium mb-3">{role}</p>
        <p className="text-gray-600 italic mb-3">"{quote}"</p>
        <p className="text-sm text-gray-500">{experience}</p>
      </motion.div>
    </AnimatedSection>
  );
};

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
  
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
               About Us
              </h1>
              <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed">
                Empowering trust through innovation in identity verification and digital security.
              </p>
          
            </motion.div>
          </div>
        </div>
      <CompanyIntro />
      <FounderProfile />

      {/* Problem Solution Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-blue-900 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <h2 className="text-4xl font-bold mb-6">The Problem We Solved</h2>
              <p className="text-lg text-gray-300 mb-6">
                Document verification used to take 3-5 days. Businesses lost customers. People got frustrated.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-300">Manual verification processes took forever</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-300">Customers left due to long waiting times</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-300">Fraud detection was unreliable</p>
                </div>
              </div>
            </AnimatedSection>
            
            <AnimatedSection>
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                  alt="Business problems"
                  className="rounded-lg shadow-xl"
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Mission Vision Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <AnimatedSection className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
              </div>
              <p className="text-xl text-blue-600 font-semibold mb-4">Make trust instant.</p>
              <p className="text-gray-600 leading-relaxed">
                VerifyMyKyc was built to make trust easy in a digital world. We help companies stay compliant, avoid fraud, and build strong, trustworthy relationships with customers and partners  all through simple, effective verification tools.
              </p>
            </AnimatedSection>

            <AnimatedSection className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <Eye className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Our Vision</h2>
              </div>
              <p className="text-xl text-purple-600 font-semibold mb-4">By 2030:</p>
              <p className="text-gray-600 leading-relaxed">
                Identity verification will be so fast and easy, people won't even notice it happening. Just like sending a WhatsApp message - instant, reliable, and simple.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The people behind India's fastest KYC verification platform
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TeamMember
              name="Ankur Bhatia"
              role="CEO"
              quote="Good people shouldn't wait days to prove they're good people."
              experience="12+ years in fintech • Ex-Paytm, Razorpay"
              image={founder}
              delay={0}
            />
            <TeamMember
              name="Arun Sharma"
              role="CTO"
              quote="If it breaks, customers lose trust. We don't let it break."
              experience="10+ years building secure APIs • Ex-PhonePe, Flipkart"
              image={employer}
              delay={0.2}
            />
            <TeamMember
              name="Amit Verma"
              role="Head of Partnerships"
              quote="Our success = your success."
              experience="8+ years helping businesses grow • Ex-Cashfree, Instamojo"
              image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
              delay={0.4}
            />
          </div>
        </div>
      </section>

    

    </div>
  );
};
export default AboutUs