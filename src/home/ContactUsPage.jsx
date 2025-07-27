import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  MapPin,
  Mail,
  Phone,
  MessageCircle,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
} from "lucide-react"
import Header from "./homeComponents/Header" 
import Footer from "./homeComponents/Footer" 
import HeroSection from "./homeComponents/HeroSection"
import ContactUs from "./homeComponents/Contact"

//  SectionHeader Component (Helper for ContactUsPage) 
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

//  InfoCard Component 
const InfoCard = ({ icon: Icon, title, content, animationDelay }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{ duration: 0.6, delay: animationDelay }}
    className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center flex flex-col items-center"
  >
    <div className="bg-blue-100 p-3 rounded-full mb-4">
      <Icon className="w-8 h-8 text-blue-600" />
    </div>
    <h4 className="text-xl font-semibold text-gray-900 mb-2">{title}</h4>
    <p className="text-gray-600 leading-relaxed">{content}</p>
  </motion.div>
)

//  ContactForm Component 
const ContactForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // In a real application, you would send this data to a backend
    alert("Message sent! (Simulated)")
    setFormData({ fullName: "", email: "", subject: "", message: "" })
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100 space-y-6"
    >
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
          Full Name
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="e.g., John Doe"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          required
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="e.g., john.doe@example.com"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          required
        />
      </div>
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
          Subject
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="e.g., Question about PAN Verification"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          required
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
          Your Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Please type your message here..."
          rows={5}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          required
        ></textarea>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
      >
        Send Message
      </button>
    </motion.form>
  )
}

//  SocialMediaLinks Component 
const SocialMediaLinks = () => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{ duration: 0.6, delay: 0.2 }}
    className="flex justify-center gap-6 mt-8"
  >
    <a
      href="https://www.facebook.com/yourcompany"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Facebook"
      className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
    >
      <Facebook className="w-8 h-8" />
    </a>
    <a
      href="https://www.twitter.com/yourcompany"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Twitter"
      className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
    >
      <Twitter className="w-8 h-8" />
    </a>
    <a
      href="https://www.linkedin.com/company/yourcompany"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="LinkedIn"
      className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
    >
      <Linkedin className="w-8 h-8" />
    </a>
    <a
      href="https://www.instagram.com/yourcompany"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Instagram"
      className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
    >
      <Instagram className="w-8 h-8" />
    </a>
  </motion.div>
)

//  ContactUsPage Component 
export default function ContactUsPage() {

  useEffect(()=>{
       window.scrollTo({
      top: 0,
      behavior: "smooth", 
    });
    },[])
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {/* <HeroSection/> */}
      {/* <main className="flex-grow py-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
        <SectionHeader
          title="Get in Touch"
          subtitle="We're here to help and answer any question you might have. Whether you have a question about our services, pricing, or anything else, our team is ready to answer all your questions."
        />

        <section className="mb-20">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-8">Contact Information</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <InfoCard
              icon={MapPin}
              title="Our Office"
              content="123 Verification Lane, Tech Park, Ghaziabad, Uttar Pradesh, 201001, India"
              animationDelay={0}
            />
            <InfoCard
              icon={Mail}
              title="Email Us"
              content={
                <a href="mailto:support@yourverify.com" className="text-blue-600 hover:underline">
                  support@yourverify.com
                </a>
              }
              animationDelay={0.1}
            />
            <InfoCard
              icon={Phone}
              title="Call Us"
              content={
                <a href="tel:+911201234567" className="text-blue-600 hover:underline">
                  +91 120 123 4567
                </a>
              }
              animationDelay={0.2}
            />
            <InfoCard
              icon={MessageCircle} 
              title="Chat on WhatsApp"
              content={
                <a
                  href="https://wa.me/911201234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  +91 120 123 4567
                </a>
              }
              animationDelay={0.3}
            />
          </div>
        </section>

        <section className="mb-20">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-8">Send us a Message</h3>
          <ContactForm />
        </section>

        <section className="text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-8">Follow Us</h3>
          <SocialMediaLinks />
        </section>
      </main> */}
      <ContactUs/>
      <Footer />
    </div>
  )
}