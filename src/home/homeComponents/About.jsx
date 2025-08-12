
import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { 

  Target,
  Eye,
  Award,
  Zap
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

const StatsCard = ({ icon: Icon, number, label, delay = 0 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        const target = parseInt(number.replace(/[^0-9]/g, ''));
        let current = 0;
        const increment = target / 50;
        const counter = setInterval(() => {
          current += increment;
          if (current >= target) {
            setCount(target);
            clearInterval(counter);
          } else {
            setCount(Math.floor(current));
          }
        }, 30);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [isInView, number, delay]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5, delay: delay / 1000 }}
      className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">
        {number.includes('+') ? `${count.toLocaleString()}+` : 
         number.includes('%') ? `${count}%` : 
         `${count.toLocaleString()}`}
      </div>
      <div className="text-gray-600 text-sm">{label}</div>
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
      {/* Hero Section */}
      {/* <section className="relative overflow-hidden py-20">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
            >
              We Make Identity 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Verification Simple</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto mb-8"
            >
              Tired of waiting days to verify documents? So were we. That's why we built India's fastest KYC platform.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl"
            >
              <img 
                src="https://images.unsplash.com/photo-1560472355-536de3962603?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2126&q=80" 
                alt="Team working on identity verification"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
            </motion.div>
          </AnimatedSection>
        </div>
      </section> */}

      {/* Stats Section */}
      {/* <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Thousands</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Real numbers that matter to real people</p>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard icon={Users} number="500+" label="Companies Trust Us" delay={0} />
            <StatsCard icon={CheckCircle} number="1M+" label="Verifications Monthly" delay={200} />
            <StatsCard icon={Clock} number="2" label="Seconds Response Time" delay={400} />
            <StatsCard icon={Shield} number="99.9%" label="Accuracy Rate" delay={600} />
          </div>
        </div>
      </section> */}
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

      {/* Services Preview */}
      {/* <section className="py-20 bg-white">
  <div className="max-w-6xl mx-auto px-6">
    <AnimatedSection className="text-center mb-16">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">What We Verify</h2>
      <p className="text-gray-600 max-w-2xl mx-auto">
        Comprehensive identity verification for all your business needs
      </p>
    </AnimatedSection>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[
        {
          name: "Digital Identity Verification",
          desc: "Verify Aadhaar, PAN, Voter ID, Driving License, and other IDs — all in just a few clicks.",
          icon: "🆔",
        },
        {
          name: "Business Verification",
          desc: "Instantly check GST registration, MSME certificates, company status, and more to ensure you're working with legitimate entities.",
          icon: "🏢",
        },
        {
          name: "Paperless Document Signing",
          desc: "Say goodbye to paperwork. Use Aadhaar-based eSign to sign legally valid documents online — safely and quickly.",
          icon: "✍️",
        },
        {
          name: "Property & Land Record Checks",
          desc: "Reduce risks by checking property ownership, title clarity, and any legal issues before making real estate decisions.",
          icon: "🏠",
        },
      ].map((service, index) => (
        <AnimatedSection
          key={index}
          className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-all duration-300"
        >
          <div className="text-4xl mb-4">{service.icon}</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.name}</h3>
          <p className="text-gray-600">{service.desc}</p>
        </AnimatedSection>
      ))}
    </div>
  </div>
</section> */}

    </div>
  );
};
export default AboutUs