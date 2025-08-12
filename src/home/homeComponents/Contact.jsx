import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { 
  Shield, 
  Clock, 
  CheckCircle, 
  Users, 
  Mail, 
  Phone, 
  MapPin, 
  Send,
  MessageCircle,
  Linkedin,
  Twitter,
  Facebook,
  Globe,
  Target,
  Eye,
  Award,
  Zap

} from 'lucide-react';
import officeBuilding from "@/assets/offceBuilding.JPG"

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

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We\'ll get back to you within 2 hours.');
    setFormData({
      name: '',
      email: '',
      company: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20">
                <div className="max-w-6xl mx-auto px-6">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center"
                  >
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                     Contact Us
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed">
                    We’re here to answer your questions and explore new opportunities together.
                    </p>
                
                  </motion.div>
                </div>
              </div>
      <section className="relative py-20">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
            >
              Let's Talk About Your 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Verification Needs</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto mb-8"
            >
              We’re here to help! Whether you have questions about our services, need support, or want to explore partnership opportunities, feel free to reach out. Our team at VerifyMyKyc is always ready to assist you.

            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg text-blue-600 font-semibold"
            >
              Our team responds within 2 hours - because your time matters as much as ours.
            </motion.p>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact Form and Info Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Main container for layout sections */}
          <div className="flex flex-col gap-8">

            {/* --- TOP ROW: FORM AND OFFICE INFO --- */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Contact Form */}
              <AnimatedSection className="lg:col-span-6">
                <div className="bg-white rounded-2xl shadow-xl p-8 h-full">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Name
                        </label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Your company"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="+91 12345 67890"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject *
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="">Select a subject</option>
                        <option value="api-integration">API Integration Support</option>
                        <option value="pricing">Pricing and Plans</option>
                        <option value="custom-solution">Custom Verification Solutions</option>
                        <option value="bulk-verification">Bulk Verification Needs</option>
                        <option value="technical-support">Technical Support</option>
                        <option value="partnership">Partnership Opportunities</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                        placeholder="Tell us about your verification needs..."
                      ></textarea>
                    </div>

                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <Send className="w-5 h-5" />
                      <span>Send Message</span>
                    </motion.button>
                  </form>
                </div>
              </AnimatedSection>
              
              {/* Office Info Card */}
              <AnimatedSection className="lg:col-span-6">
                <div className="bg-white rounded-2xl shadow-xl p-8 h-full">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Visit Our Office</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Our Headquarters</h4>
                        <p className="text-gray-600">
                          
                           A 24/5, Mohan Cooperative Industrial Area<br />
                          Badarpur, Second Floor,<br />
                           New Delhi 110044<br />
                          India
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Business Hours</h4>
                        <p className="text-gray-600">
                          Monday - Saturday: 10:00 AM - 7:00 PM<br />
                          
                          Sunday: Closed
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 h-48 bg-gray-200 rounded-lg overflow-hidden">
                    <img 
                      src={officeBuilding}
                      alt="Office building"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="mt-4 text-sm text-gray-600">
                    <p className="font-medium mb-1">Nearest Landmarks:</p>
                    <ul className="space-y-1">
                      <li>• 5 minutes from Saritavihar Metro Station</li>
                      <li>• Next to Tata Motor Service center</li>
                      <li>• Near to Air Liquid</li>
                    </ul>
                  </div>
                </div>
              </AnimatedSection>
            </div>

            <AnimatedSection>
              <div className="w-full bg-white rounded-2xl shadow-xl p-8 overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.0184801166723!2d77.36493931492027!3d28.627338382418994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce5081e611bfb%3A0x37f95780f9c6a61e!2sSector%2062%2C%20Noida%2C%20Uttar%20Pradesh%20201309!5e0!3m2!1sen!2sin!4v1627900126520!5m2!1sen!2sin"
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  className="rounded-lg"
                ></iframe>
              </div>
            </AnimatedSection>

            {/* --- MIDDLE ROW: QUICK AND DEPARTMENT CONTACTS --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Quick Contact */}
              <AnimatedSection>
                <div className="bg-white rounded-2xl shadow-xl p-8 h-full">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Contact</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Mail className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Email</p>
                        <p className="text-blue-600">verifymykyc@gmail.com</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Phone className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Phone</p>
                        <p className="text-green-600">+91 95606 52708
</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <MessageCircle className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">WhatsApp</p>
                        <p className="text-purple-600">+91 95606 52708
</p>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
              
              {/* Department Contacts */}
              <AnimatedSection>
                <div className="bg-white rounded-2xl shadow-xl p-8 h-full">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Department Contacts</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Sales</span>
                      <span className="text-blue-600 font-medium">verifymykyc@navigantinc.com
</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Support</span>
                      <span className="text-green-600 font-medium">Support@Verifymykyc.com
</span>
                    </div>
                    {/* <div className="flex justify-between items-center">
                      <span className="text-gray-700">Partnerships</span>
                      <span className="text-purple-600 font-medium">partners@verifykyc.com</span>
                    </div> */}
                  </div>
                </div>
              </AnimatedSection>
            </div>

            {/* --- BOTTOM ROW: SOCIAL MEDIA --- */}
            {/* <AnimatedSection>
              <div className="w-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6">Follow Us</h3>
                <div className="flex space-x-4">
                  <motion.a
                    href="#"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <Linkedin className="w-6 h-6" />
                  </motion.a>
                  <motion.a
                    href="#"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <Twitter className="w-6 h-6" />
                  </motion.a>
                  <motion.a
                    href="#"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <Facebook className="w-6 h-6" />
                  </motion.a>
                  <motion.a
                    href="#"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <Globe className="w-6 h-6" />
                  </motion.a>
                </div>
                <p className="mt-4 text-white/80">
                  Stay updated with our latest features and industry insights
                </p>
              </div>
            </AnimatedSection> */}

          </div>
        </div>
      </section>

      {/* Help Section */}
      {/* <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What We Can Help With</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Whether you're a developer stuck on integration or a business owner exploring KYC solutions, we'll get back to you fast.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🔧",
                title: "API Integration Support",
                description: "Get help implementing our APIs in your application"
              },
              {
                icon: "⚙️",
                title: "Custom Verification Solutions",
                description: "Tailored KYC solutions for specific business needs"
              },
              {
                icon: "💰",
                title: "Pricing and Plans",
                description: "Find the perfect plan for your verification volume"
              },
              {
                icon: "📚",
                title: "Technical Documentation",
                description: "Comprehensive guides and API references"
              },
              {
                icon: "📊",
                title: "Bulk Verification Needs",
                description: "Large-scale verification solutions for enterprises"
              },
              {
                icon: "🤝",
                title: "Partnership Opportunities",
                description: "Explore collaboration and integration partnerships"
              }
            ].map((item, index) => (
              <AnimatedSection key={index} className="bg-gray-50 p-6 rounded-xl text-center hover:shadow-lg transition-all duration-300">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      {/* <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <AnimatedSection>
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 text-white/90">
              Stop waiting. Start verifying. Making India's digital economy faster, one verification at a time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Try Our APIs
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
              >
                View Documentation
              </motion.button>
            </div>
          </AnimatedSection>
        </div>
      </section> */}
    </div>
  );
};

export default ContactUs;