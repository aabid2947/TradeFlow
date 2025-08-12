// src/pages/ServicesPage.jsx

"use client";

import React from 'react';
import ServiceCard, { GovernmentIdVisual, CompanyCredentialVisual, BankVisual, EducationVisual } from './ServiceShowcaseCard';
import { Shield, Building2, Landmark, GraduationCap, FileSignature, Home } from "lucide-react";
import Aadhar from "@/assets/Digital Identity Verification.png"
import Buissness from "@/assets/Buissness.png"
import GOI from "@/assets/Digital eSign.png"
import Property from "@/assets/Property.png"
// This is the parent component that holds all the data.
export default function ServicesShowcase() {
const servicesData = [
  {
    id: 1,
    layout: 'image-right',
    theme: {
      primary: '#1987BF',
      secondary: '#8B5CF6',
      gradientFrom: 'from-[#1987BF]',
      gradientTo: 'to-blue-600',
      badgeBg: 'bg-[#1987BF]/10',
      badgeText: 'text-[#1987BF]',
    },
    image:Aadhar,
    badgeIcon: Shield,
    badgeText: 'GOVERNMENT ID VERIFICATION',
    titleLines: ['Digital Identity Verification'],
    typewriterTexts: [
      "We authenticate each document against its issuing authority to prevent identity fraud.",
      "Real-time verification with 99.9% accuracy rate.",
      "Secure  integration for seamless document validation.",
    ],
    features: [
      "Verify Aadhaar, PAN, Voter ID, Driving License, and other IDs",
      "Real-time  verification",
      "99.9% accuracy guarantee",
      "Secure data handling",
    ],
    ctaText: 'Explore ID Products',
    VisualComponent: GovernmentIdVisual,
  },
  {
    id: 2,
    layout: 'image-left',
    theme: {
      primary: '#8B5CF6',
      secondary: '#1987BF',
      gradientFrom: 'from-purple-600',
      gradientTo: 'to-[#1987BF]',
      badgeBg: 'bg-purple-100',
      badgeText: 'text-purple-700',
    },
    image:Buissness,
    badgeIcon: Building2,
    badgeText: 'COMPANY & CREDENTIALS',
    titleLines: ['Start and Verify Your Business with Confidence'],
    typewriterTexts: [
      "Verify the legitimacy of any claimed business or association.",
      "Comprehensive business credential validation.",
      "Ensure compliance with regulatory requirements.",
    ],
    features: [
      "GST Registration, FSSAI License, MSME Certificate, Company Registration",
      "Check if a business is legitimate",
      "Accuracy you can trust",
      "Instant fraud alerts",
    ],
    ctaText: 'Explore Products',
    VisualComponent: CompanyCredentialVisual,
  },
  {
    id: 5,
    layout: 'image-right',
    theme: {
      primary: '#3B82F6',
      secondary: '#6366F1',
      gradientFrom: 'from-blue-500',
      gradientTo: 'to-indigo-500',
      badgeBg: 'bg-blue-100',
      badgeText: 'text-blue-700',
    },
       image:GOI,
    badgeIcon: FileSignature,
    badgeText: 'DIGITAL SIGNATURE & eSIGN',
    titleLines: ['Go Paperless with Digital Signing'],
    typewriterTexts: [
      "Legally binding electronic signatures for all your documents.",
      "Streamline your paperwork and go fully digital.",
      "Secure, compliant, and easy to integrate.",
    ],
    features: [
      "Aadhaar-based eSign",
      "Smooth digital workflow",
      "Trusted accuracy",
      "Instant fraud checks",
    ],
    ctaText: 'Explore eSign Products ',
    VisualComponent: GovernmentIdVisual,
  },
  {
    id: 6,
    layout: 'image-left',
    theme: {
      primary: '#F97316',
      secondary: '#F59E0B',
      gradientFrom: 'from-orange-500',
      gradientTo: 'to-amber-500',
      badgeBg: 'bg-orange-100',
      badgeText: 'text-orange-700',
    },
    image:Property,
    badgeIcon: Home,
    badgeText: 'PROPERTY & LAND RECORDS',
    titleLines: ['Verify Property Ownership,', 'Check for Encumbrances', 'and Validate Titles'],
    typewriterTexts: [
      "Access digitized land records from state authorities.",
      "Mitigate risks in real estate transactions.",
      "Ensure clear and marketable property titles.",
    ],
    features: [
      "Check property details before you buy",
      "Check for legal issues (encumbrances)",
      "Validate land titles",
      "Reduce the risk of fraud",
    ],
    ctaText: 'Explore Realty Products',
    VisualComponent: CompanyCredentialVisual,
  }
];

  return (
    <section className="w-full bg-gradient-to-br from-gray-50 via-white to-blue-50 py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {servicesData.map((service) => (
          <ServiceCard key={service.id} data={service} />
        ))}
      </div>
    </section>
  );
}