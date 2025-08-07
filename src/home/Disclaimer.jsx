"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ChevronDown, ChevronRight, FileText, Link as LinkIcon, AlertTriangle, Scale, Users, Shield, Mail, Globe } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import LandingPageFooter from "./homeComponents/Footer"
import HomePageHeader from "./homeComponents/Header"
import { useNavigate } from "react-router-dom"

export default function DisclaimerPage() {
  const [expandedSection, setExpandedSection] = useState("definitions")
  const navigate = useNavigate()

  const toggleSection = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? "" : sectionId)
  }

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }, [])

  const sections = [
    {
      id: "definitions",
      title: "Interpretation and Definitions",
      icon: <FileText className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Interpretation</h4>
            <p className="text-gray-700 leading-relaxed">
              The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Definitions</h4>
            <p className="text-gray-700 mb-4">For the purposes of this Disclaimer:</p>
            <div className="space-y-3">
              {[
                {
                  term: "Company",
                  definition:
                    '(referred to as either "the Company", "We", "Us" or "Our" in this Disclaimer) refers to Navigant Digital Private Limited, A 24/5, Mohan Cooperative Industrial Area Badarpur, Second Floor, New Delhi 110044 India.',
                },
                {
                  term: "Service",
                  definition: "refers to the Website.",
                },
                {
                  term: "You",
                  definition:
                    "means the individual accessing the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.",
                },
                {
                  term: "Website",
                  definition: "refers to Verify My KYC, accessible from https://verifymykyc.com/",
                },
              ].map((item, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <span className="font-semibold text-gray-900">{item.term}:</span>{" "}
                  <span className="text-gray-700">{item.definition}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "disclaimer",
      title: "General Disclaimer",
      icon: <AlertTriangle className="w-5 h-5" />,
      content: (
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>The information contained on the Service is for general information purposes only.</p>
          <p>The Company assumes no responsibility for errors or omissions in the contents of the Service.</p>
          <p>In no event shall the Company be liable for any special, direct, indirect, consequential, or incidental damages or any damages whatsoever, whether in an action of contract, negligence or other tort, arising out of or in connection with the use of the Service or the contents of the Service. The Company reserves the right to make additions, deletions, or modifications to the contents on the Service at any time without prior notice. The Company does not warrant that the Service is free of viruses or other harmful components.</p>
        </div>
      ),
    },
    {
      id: "external-links",
      title: "External Links Disclaimer",
      icon: <LinkIcon className="w-5 h-5" />,
      content: (
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>The Service may contain links to external websites that are not provided or maintained by or in any way affiliated with the Company.</p>
          <p>Please note that the Company does not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites.</p>
        </div>
      ),
    },
    {
      id: "errors-omissions",
      title: "Errors and Omissions Disclaimer",
      icon: <FileText className="w-5 h-5" />,
      content: (
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>The information given by the Service is for general guidance on matters of interest only. Even if the Company takes every precaution to ensure that the content of the Service is both current and accurate, errors can occur. Plus, given the changing nature of laws, rules and regulations, there may be delays, omissions or inaccuracies in the information contained on the Service.</p>
          <p>The Company is not responsible for any errors or omissions, or for the results obtained from the use of this information.</p>
        </div>
      ),
    },
    {
      id: "fair-use",
      title: "Fair Use Disclaimer",
      icon: <Scale className="w-5 h-5" />,
      content: (
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>The Company may use copyrighted material which has not always been specifically authorized by the copyright owner. The Company is making such material available for criticism, comment, news reporting, teaching, scholarship, or research.</p>
          <p>If You wish to use copyrighted material from the Service for your own purposes that go beyond fair use, You must obtain permission from the copyright owner.</p>
        </div>
      ),
    },
    {
      id: "views-expressed",
      title: "Views Expressed Disclaimer",
      icon: <Users className="w-5 h-5" />,
      content: (
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>The Service may contain views and opinions which are those of the authors and do not necessarily reflect the official policy or position of any other author, agency, organization, employer or company, including the Company.</p>
          <p>Comments published by users are their sole responsibility and the users will take full responsibility, liability and blame for any libel or litigation that results from something written in or as a direct result of something written in a comment. The Company is not liable for any comment published by users and reserves the right to delete any comment for any reason whatsoever.</p>
        </div>
      ),
    },
    {
      id: "no-responsibility",
      title: "No Responsibility Disclaimer",
      icon: <Shield className="w-5 h-5" />,
      content: (
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>The information on the Service is provided with the understanding that the Company is not herein engaged in rendering legal, accounting, tax, or other professional advice and services. As such, it should not be used as a substitute for consultation with professional accounting, tax, legal or other competent advisers.</p>
          <p>In no event shall the Company or its suppliers be liable for any special, incidental, indirect, or consequential damages whatsoever arising out of or in connection with your access or use or inability to access or use the Service.</p>
        </div>
      ),
    },
    {
      id: "own-risk",
      title: '"Use at Your Own Risk" Disclaimer',
      icon: <AlertTriangle className="w-5 h-5" />,
      content: (
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>All information in the Service is provided "as is", with no guarantee of completeness, accuracy, timeliness or of the results obtained from the use of this information, and without warranty of any kind, express or implied, including, but not limited to warranties of performance, merchantability and fitness for a particular purpose.</p>
          <p>The Company will not be liable to You or anyone else for any decision made or action taken in reliance on the information given by the Service or for any consequential, special or similar damages, even if advised of the possibility of such damages.</p>
        </div>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <HomePageHeader />
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <AlertTriangle className="w-16 h-16 mx-auto mb-6 text-white" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Disclaimer</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Please read this disclaimer carefully before using Our Service.
            </p>
            <div className="mt-6 text-sm text-gray-400">
              Last updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-6">
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="shadow-lg border border-gray-200 overflow-hidden">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full p-6 text-left hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
                        {section.icon}
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
                    </div>
                    <div className="flex-shrink-0">
                      {expandedSection === section.id ? (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                  </div>
                </button>

                <motion.div
                  initial={false}
                  animate={{
                    height: expandedSection === section.id ? "auto" : 0,
                    opacity: expandedSection === section.id ? 1 : 0,
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <CardContent className="px-6 pb-6 pt-0">
                    <div className="border-t border-gray-200 pt-6">{section.content}</div>
                  </CardContent>
                </motion.div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12"
        >
          <Card className="shadow-lg border border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
            <CardContent className="p-8">
              <div className="text-center">
                <Mail className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h3>
                <p className="text-gray-700 mb-6">
                  If you have any questions about this Disclaimer, You can contact us:
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <a
                        href="mailto:Support@Verifymykyc.com"
                        className="inline-flex items-center px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 transition-colors duration-200 shadow-md hover:shadow-lg"
                    >
                        <Mail className="w-5 h-5 mr-2" />
                        Support@Verifymykyc.com
                    </a>
                    <div
                        onClick={() => navigate("/contact-us")}
                        className="inline-flex items-center px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 transition-colors duration-200 shadow-md hover:shadow-lg cursor-pointer"
                    >
                        <Globe className="w-5 h-5 mr-2" />
                        Visit Contact Page
                    </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <LandingPageFooter />
    </div>
  )
}