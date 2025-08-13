"use client"

import { motion } from "framer-motion"
import {
  MapPin,
  Shield,
  Users,
  Target,
  Lightbulb,
  Award,
  Clock,
  Globe,
  CheckCircle,
  Zap,
  AlertCircle,
  Lock,
  FileSignature,
  Home
} from "lucide-react"
import Header from "./homeComponents/Header" 
import Footer from "./homeComponents/Footer" 
import HeroSection from "./homeComponents/HeroSection"
import AboutUs from "./homeComponents/About"
import { useEffect } from "react"

const SectionHeader = ({ title, subtitle }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{ duration: 0.6 }}
    className="text-center mb-12 px-4"
  >
    <h2 className="text-4xl font-extrabold text-gray-900 mb-4">{title}</h2>
    <p className="text-lg text-gray-600 max-w-3xl mx-auto">{subtitle}</p>
  </motion.div>
)

//  AboutUsPage Component 
export default function AboutUsPage() {
  useEffect(()=>{
     window.scrollTo({
    top: 0,
    behavior: "smooth", 
  });
  },[])

  const textAnimationProps = {
    initial: { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.5 },
    transition: { duration: 0.6 },
  }

  const iconAnimationProps = {
    initial: { opacity: 0, scale: 0.8 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: true, amount: 0.5 },
    transition: { duration: 0.7, delay: 0.2 },
  }

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <Header />
      {/* <HeroSection/> */}
      <AboutUs/>
      <main className="flex-grow py-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
        {/* <SectionHeader
          title="Building a Safer World, One Verification at a Time."
          subtitle="In a world where trust is more important than ever, we are dedicated to providing the peace of mind you deserve. We empower you to make informed decisions about the people you bring into your homes and lives, whether it's a babysitter for your children, a driver for your family, or a domestic helper for your home."
        /> */}

      
        {/* <section className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <motion.div {...textAnimationProps}>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h3>
            <p className="text-gray-700 leading-relaxed">
              Our mission is simple: to foster a safer environment for everyone by making background verification fast,
              affordable, and accessible. We believe that you shouldn't have to guess when it comes to safety. Our
              platform demystifies the background check process, delivering clear, reliable results in just a few clicks,
              so you can hire with confidence.
            </p>
          </motion.div>
          <motion.div {...iconAnimationProps} className="flex justify-center items-center">
            <Target className="w-32 h-32 text-blue-600 opacity-80" />
          </motion.div>
        </section>*/}
<section className="mb-20">
  <SectionHeader
    title="What We Do"
    subtitle="We provide a comprehensive, Platform that offers a wide range of verification services. With our cutting-edge technology, you can quickly and easily verify:"
  />
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
    {[
      {
        icon: Users,
        title: "Digital Identity Verification",
        description: "Verify Aadhaar, PAN, Voter ID, Driving License, and other IDs — all in just a few clicks.",
      },
      {
        icon: Award,
        title: "Business Verification",
        description: "Instantly check GST registration, MSME certificates, company status, and more to ensure you're working with legitimate entities.",
      },
      {
        icon: FileSignature,
        title: "Paperless Document Signing",
        description: "Say goodbye to paperwork. Use Aadhaar-based eSign to sign legally valid documents online — safely and quickly.",
      },
      {
        icon: Home,
        title: "Property & Land Record Checks",
        description: "Reduce risks by checking property ownership, title clarity, and any legal issues before making real estate decisions.",
      },
    ].map((item, index) => (
      <motion.div
        key={item.title}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className={`bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center text-center 
          ${index === 3 ? "lg:col-span-3 md:col-span-2 justify-self-center max-w-md mx-auto" : ""}`}
      >
        <item.icon className="w-12 h-12 text-blue-600 mb-4" />
        <h4 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h4>
        <p className="text-gray-600">{item.description}</p>
      </motion.div>
    ))}
  </div>
</section>

   
        <section className="mb-20">
  <SectionHeader
    title="Why Choose Us?"
    subtitle="We are committed to providing you with the best verification experience."
  />
  <div className="grid md:grid-cols-2 gap-8">
    {[
      {
        icon: Zap,
        title: "Fast & Easy to Use",
        description:
          "Start verifying within minutes — no complicated setup or technical headaches.",
      },
      {
        icon: CheckCircle,
        title: "Highly Accurate Results",
        description:
          "We focus on delivering reliable verification results you can trust.",
      },
      {
        icon: AlertCircle,
        title: "Built-in Fraud Detection",
        description:
          "Stay protected with tools that flag suspicious or mismatched data instantly.",
      },
      {
        icon: Lock,
        title: "Data Privacy You Can Rely On",
        description:
          "We follow strong data protection practices to ensure your information stays private and secure.",
      },
    ].map((item, index) => (
      <motion.div
        key={item.title}
        initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex items-start gap-4"
      >
        <item.icon className="w-8 h-8 text-blue-600 shrink-0 mt-1" />
        <div>
          <h4 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h4>
          <p className="text-gray-600">{item.description}</p>
        </div>
      </motion.div>
    ))}
  </div>
</section>

{/* 
        <section className="text-center">
          <motion.div {...textAnimationProps} className="mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h3>
            <p className="text-gray-700 leading-relaxed max-w-3xl mx-auto">
              We envision a future where trust is the foundation of all interactions. By making verification simple and
              reliable, we aim to build a community where both individuals and service providers can feel secure and
              confident.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300">
              Verify with us today and take the first step towards a safer tomorrow.
            </button>
          </motion.div>
        </section> */}
      </main>
      <Footer />
    </div>
  )
}