"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ChevronDown, ChevronRight, FileText, Link as LinkIcon, Shield, AlertTriangle, Scale, Flag, Smile, FileWarning, RefreshCw, Mail, Globe, MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import LandingPageFooter from "./homeComponents/Footer"
import HomePageHeader from "./homeComponents/Header"
import { useNavigate } from "react-router-dom"

export default function TermsAndConditionsPage() {
  const [expandedSection, setExpandedSection] = useState("acknowledgment")
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
      id: "acknowledgment",
      title: "Acknowledgment",
      icon: <FileText className="w-5 h-5" />,
      content: (
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            These are the Terms and Conditions governing the use of this Service and the agreement that operates between You and the Company. These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service.
          </p>
          <p>
            Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms and Conditions. These Terms and Conditions apply to all visitors, users and others who access or use the Service.
          </p>
          <p>
            By accessing or using the Service You agree to be bound by these Terms and Conditions. If You disagree with any part of these Terms and Conditions then You may not access the Service.
          </p>
          <p>
            You represent that you are over the age of 18. The Company does not permit those under 18 to use the Service.
          </p>
          <p>
            Your access to and use of the Service is also conditioned on Your acceptance of and compliance with the Privacy Policy of the Company. Our Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your personal information when You use the Application or the Website and tells You about Your privacy rights and how the law protects You. Please read Our Privacy Policy carefully before using Our Service.
          </p>
        </div>
      ),
    },
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
            <p className="text-gray-700 mb-4">For the purposes of these Terms and Conditions:</p>
            <div className="space-y-3">
              {[
                {
                  term: "Affiliate",
                  definition:
                    'means an entity that controls, is controlled by or is under common control with a party, where "control" means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.',
                },
                {
                  term: "Country",
                  definition: "refers to: Delhi, India",
                },
                {
                  term: "Company",
                  definition:
                    '(referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to Navigant Digital Private Limited, A 24/5, Mohan Cooperative Industrial Area Badarpur, Second Floor, New Delhi 110044 India.',
                },
                {
                  term: "Device",
                  definition:
                    "means any device that can access the Service such as a computer, a cellphone or a digital tablet.",
                },
                {
                  term: "Service",
                  definition: "refers to the Website.",
                },
                {
                  term: "Terms and Conditions",
                  definition:
                    '(also referred as "Terms") mean these Terms and Conditions that form the entire agreement between You and the Company regarding the use of the Service.',
                },
                {
                  term: "Third-party Social Media Service",
                  definition:
                    "means any services or content (including data, information, products or services) provided by a third-party that may be displayed, included or made available by the Service.",
                },
                {
                  term: "Website",
                  definition: "refers to Verify My KYC, accessible from https://verifymykyc.com/",
                },
                {
                  term: "You",
                  definition:
                    "means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.",
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
      id: "links",
      title: "Links to Other Websites",
      icon: <LinkIcon className="w-5 h-5" />,
      content: (
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            Our Service may contain links to third-party web sites or services that are not owned or controlled by the Company.
          </p>
          <p>
            The Company has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party web sites or services. You further acknowledge and agree that the Company shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods or services available on or through any such web sites or services.
          </p>
          <p>
            We strongly advise You to read the terms and conditions and privacy policies of any third-party web sites or services that You visit.
          </p>
        </div>
      ),
    },
    {
      id: "termination",
      title: "Termination",
      icon: <AlertTriangle className="w-5 h-5" />,
      content: (
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            We may terminate or suspend Your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if You breach these Terms and Conditions.
          </p>
          <p>Upon termination, Your right to use the Service will cease immediately.</p>
        </div>
      ),
    },
    {
      id: "liability",
      title: "Limitation of Liability",
      icon: <Scale className="w-5 h-5" />,
      content: (
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            Notwithstanding any damages that You might incur, the entire liability of the Company and any of its suppliers under any provision of this Terms and Your exclusive remedy for all of the foregoing shall be limited to the amount actually paid by You through the Service, if You haven't purchased anything through the Service.
          </p>
          <p>
            To the maximum extent permitted by applicable law, in no event shall the Company or its suppliers be liable for any special, incidental, indirect, or consequential damages whatsoever (including, but not limited to, damages for loss of profits, loss of data or other information, for business interruption, for personal injury, loss of privacy arising out of or in any way related to the use of or inability to use the Service, third-party software and/or third-party hardware used with the Service, or otherwise in connection with any provision of this Terms), even if the Company or any supplier has been advised of the possibility of such damages and even if the remedy fails of its essential purpose.
          </p>
          <p>
            Some states do not allow the exclusion of implied warranties or limitation of liability for incidental or consequential damages, which means that some of the above limitations may not apply. In these states, each party's liability will be limited to the greatest extent permitted by law.
          </p>
        </div>
      ),
    },
    {
      id: "disclaimer",
      title: '"AS IS" and "AS AVAILABLE" Disclaimer',
      icon: <FileWarning className="w-5 h-5" />,
      content: (
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            The Service is provided to You "AS IS" and "AS AVAILABLE" and with all faults and defects without warranty of any kind. To the maximum extent permitted under applicable law, the Company, on its own behalf and on behalf of its Affiliates and its and their respective licensors and service providers, expressly disclaims all warranties, whether express, implied, statutory or otherwise, with respect to the Service, including all implied warranties of merchantability, fitness for a particular purpose, title and non-infringement, and warranties that may arise out of course of dealing, course of performance, usage or trade practice. Without limitation to the foregoing, the Company provides no warranty or undertaking, and makes no representation of any kind that the Service will meet Your requirements, achieve any intended results, be compatible or work with any other software, applications, systems or services, operate without interruption, meet any performance or reliability standards or be error free or that any errors or defects can or will be corrected.
          </p>
          <p>
            Without limiting the foregoing, neither the Company nor any of the company's provider makes any representation or warranty of any kind, express or implied: (i) as to the operation or availability of the Service, or the information, content, and materials or products included thereon; (ii) that the Service will be uninterrupted or error-free; (iii) as to the accuracy, reliability, or currency of any information or content provided through the Service; or (iv) that the Service, its servers, the content, or e-mails sent from or on behalf of the Company are free of viruses, scripts, trojan horses, worms, malware, timebombs or other harmful components.
          </p>
          <p>
            Some jurisdictions do not allow the exclusion of certain types of warranties or limitations on applicable statutory rights of a consumer, so some or all of the above exclusions and limitations may not apply to You. But in such a case the exclusions and limitations set forth in this section shall be applied to the greatest extent enforceable under applicable law.
          </p>
        </div>
      ),
    },
    {
        id: "governing-law",
        title: "Governing Law",
        icon: <Flag className="w-5 h-5" />,
        content: (
            <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                    The laws of the Country, excluding its conflicts of law rules, shall govern this Terms and Your use of the Service. Your use of the Application may also be subject to other local, state, national, or international laws.
                </p>
            </div>
        ),
    },
    {
        id: "disputes-resolution",
        title: "Disputes Resolution",
        icon: <Smile className="w-5 h-5" />,
        content: (
            <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                    If You have any concern or dispute about the Service, You agree to first try to resolve the dispute informally by contacting the Company.
                </p>
            </div>
        ),
    },
    {
        id: "eu-users",
        title: "For European Union (EU) Users",
        icon: <Globe className="w-5 h-5" />,
        content: (
            <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                    If You are a European Union consumer, you will benefit from any mandatory provisions of the law of the country in which You are resident.
                </p>
            </div>
        ),
    },
    {
        id: "severability-waiver",
        title: "Severability and Waiver",
        icon: <FileText className="w-5 h-5" />,
        content: (
            <div className="space-y-6">
                <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Severability</h4>
                    <p className="text-gray-700 leading-relaxed">
                        If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law and the remaining provisions will continue in full force and effect.
                    </p>
                </div>
                <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Waiver</h4>
                    <p className="text-gray-700 leading-relaxed">
                        Except as provided herein, the failure to exercise a right or to require performance of an obligation under these Terms shall not affect a party's ability to exercise such right or require such performance at any time thereafter nor shall the waiver of a breach constitute a waiver of any subsequent breach.
                    </p>
                </div>
            </div>
        ),
    },
    {
        id: "translation-interpretation",
        title: "Translation Interpretation",
        icon: <Globe className="w-5 h-5" />,
        content: (
            <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                    These Terms and Conditions may have been translated if We have made them available to You on our Service. You agree that the original English text shall prevail in the case of a dispute.
                </p>
            </div>
        ),
    },
    {
      id: "changes",
      title: "Changes to These Terms and Conditions",
      icon: <RefreshCw className="w-5 h-5" />,
      content: (
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            We reserve the right, at Our sole discretion, to modify or replace these Terms at any time. If a revision is material We will make reasonable efforts to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at Our sole discretion.
          </p>
          <p>
            By continuing to access or use Our Service after those revisions become effective, You agree to be bound by the revised terms. If You do not agree to the new terms, in whole or in part, please stop using the website and the Service.
          </p>
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
            <Shield className="w-16 h-16 mx-auto mb-6 text-white" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms and Conditions</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Please read these terms and conditions carefully before using Our Service.
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
                  If you have any questions about these Terms and Conditions, You can contact us:
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