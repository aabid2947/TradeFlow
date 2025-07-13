// src/pages/ServicesPage.jsx

"use client";

import React from 'react';
import ServiceCard, { GovernmentIdVisual, CompanyCredentialVisual, BankVisual, EducationVisual } from './ServiceShowcaseCard';
import { Shield, Building2, Landmark, GraduationCap, FileSignature, Home } from "lucide-react";

// This is the parent component that holds all the data.
export default function ServicesShowcase() {
  const servicesData = [
    {
      id: 1,
      layout: 'image-right', // Determines the position of the visual element
      theme: {
        primary: '#1987BF',
        secondary: '#8B5CF6',
        gradientFrom: 'from-[#1987BF]',
        gradientTo: 'to-blue-600',
        badgeBg: 'bg-[#1987BF]/10',
        badgeText: 'text-[#1987BF]',
      },
      badgeIcon: Shield,
      badgeText: 'GOVERNMENT ID VERIFICATION',
      titleLines: ['PAN Card, Aadhaar Card,', 'Voter ID, Driving Licence,', 'and Passport'],
      typewriterTexts: [
        "We authenticate each document against its issuing authority to prevent identity fraud.",
        "Real-time verification with 99.9% accuracy rate.",
        "Secure API integration for seamless document validation.",
      ],
      features: [
        "Real-time API verification",
        "99.9% accuracy guarantee",
        "Instant fraud detection",
        "Secure data handling",
      ],
      ctaText: 'Explore ID Products',
      VisualComponent: GovernmentIdVisual, // The visual component to render
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
      badgeIcon: Building2,
      badgeText: 'COMPANY & CREDENTIALS',
      titleLines: ['GST Registration, FSSAI', 'License, MSME Certificate,', 'and Company Registration'],
      typewriterTexts: [
        "Verify the legitimacy of any claimed business or association.",
        "Comprehensive business credential validation.",
        "Ensure compliance with regulatory requirements.",
      ],
      features: [
        "Business license verification",
        "Regulatory compliance check",
        "Company registration validation",
        "Certificate authenticity",
      ],
      ctaText: 'Explore Business Products',
      VisualComponent: CompanyCredentialVisual,
    },
    // {
    //   id: 3,
    //   layout: 'image-right',
    //   theme: {
    //     primary: '#10B981',
    //     secondary: '#059669',
    //     gradientFrom: 'from-emerald-500',
    //     gradientTo: 'to-green-600',
    //     badgeBg: 'bg-emerald-100',
    //     badgeText: 'text-emerald-700',
    //   },
    //   badgeIcon: Landmark,
    //   badgeText: 'BANK ACCOUNT VERIFICATION',
    //   titleLines: ['Verify Bank Account', 'Holder Name & Details', 'Instantly via UPI or Penny Drop'],
    //   typewriterTexts: [
    //     "Confirm account ownership before processing transactions.",
    //     "Reduce payment failures and fraudulent activities.",
    //     "Light-speed verification using robust banking APIs.",
    //   ],
    //   features: [
    //     "UPI & Penny Drop methods",
    //     "Real-time name match",
    //     "Prevents transaction fraud",
    //     "Supports all major banks",
    //   ],
    //   ctaText: 'Explore Financial Products',
    //   VisualComponent: BankVisual, // New visual for this card
    // },
    // {
    //   id: 4,
    //   layout: 'image-left',
    //   theme: {
    //     primary: '#EF4444',
    //     secondary: '#D97706',
    //     gradientFrom: 'from-red-500',
    //     gradientTo: 'to-amber-600',
    //     badgeBg: 'bg-red-100',
    //     badgeText: 'text-red-700',
    //   },
    //   badgeIcon: GraduationCap,
    //   badgeText: 'EDUCATION VERIFICATION',
    //   titleLines: ['Verify Degrees, Diplomas,', 'and Academic Records from', 'Universities and Boards'],
    //    typewriterTexts: [
    //     "Authenticate academic credentials for hiring.",
    //     "Connect directly with educational institutions.",
    //     "Eliminate risks of forged certificates.",
    //   ],
    //   features: [
    //     "Direct university integration",
    //     "Covers 1000+ institutions",
    //     "Prevents hiring fraud",
    //     "Digital & secure reports",
    //   ],
    //   ctaText: 'Explore HR Products',
    //   VisualComponent: EducationVisual, // New visual for this card
    // },
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
        badgeIcon: FileSignature,
        badgeText: 'DIGITAL SIGNATURE & eSIGN',
        titleLines: ['Aadhaar-based eSign,', 'Digital Document Workflow', 'and Secure Signing'],
        typewriterTexts: [
            "Legally binding electronic signatures for all your documents.",
            "Streamline your paperwork and go fully digital.",
            "Secure, compliant, and easy to integrate.",
        ],
        features: [
            "Legally valid under IT Act",
            "Aadhaar OTP-based signing",
            "Full audit trail",
            "Seamless API integration",
        ],
        ctaText: 'Explore eSign APIs',
        VisualComponent: GovernmentIdVisual, // Re-using a visual
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
        badgeIcon: Home,
        badgeText: 'PROPERTY & LAND RECORDS',
        titleLines: ['Verify Property Ownership,', 'Check for Encumbrances', 'and Validate Titles'],
        typewriterTexts: [
            "Access digitized land records from state authorities.",
            "Mitigate risks in real estate transactions.",
            "Ensure clear and marketable property titles.",
        ],
        features: [
            "State-wise record access",
            "Title and ownership search",
            "Encumbrance certificate check",
            "Reduces property fraud",
        ],
        ctaText: 'Explore Realty Products',
        VisualComponent: CompanyCredentialVisual, // Re-using a visual
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