import React, { useState, useEffect } from "react";
import { ArrowRight, CheckCircle, Sparkles, Zap, Building2, Landmark, GraduationCap } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";

// Helper Animation Components
const AnimatedText = ({ text, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  return (
    <span className={`inline-block transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} ${className}`}>
      {text}
    </span>
  );
};

const TypewriterText = ({ texts, speed = 100, deleteSpeed = 50, pauseTime = 2000, className = "" }) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => {
      const fullText = texts[currentTextIndex];
      if (!isDeleting) {
        if (currentText !== fullText) {
          setCurrentText(fullText.substring(0, currentText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), pauseTime);
        }
      } else {
        if (currentText !== "") {
          setCurrentText(fullText.substring(0, currentText.length - 1));
        } else {
          setIsDeleting(false);
          setCurrentTextIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, isDeleting ? deleteSpeed : speed);
    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentTextIndex, texts, speed, deleteSpeed, pauseTime]);
  return (
    <span className={className}>
      {currentText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

const FloatingElement = ({ children, delay = 0, className = "" }) => (
  <div className={`animate-float ${className}`} style={{ animationDelay: `${delay}s` }}>
    {children}
  </div>
);

// Button Component with Light Blue Theme
const ModernButton = ({ children, variant = "primary", onClick, className = "" }) => {
  const baseClasses = "group relative overflow-hidden font-semibold px-8 py-4 text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl whitespace-nowrap";
  
  const variants = {
    primary: "bg-gradient-to-r from-sky-400 to-blue-500 text-white hover:from-sky-500 hover:to-blue-600 shadow-sky-200 hover:shadow-sky-300",
    secondary: "bg-gradient-to-r from-cyan-400 to-teal-500 text-white hover:from-cyan-500 hover:to-teal-600 shadow-cyan-200 hover:shadow-cyan-300"
  };

  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${className}`}
      onClick={onClick}
    >
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </button>
  );
};

// Image Visual Component
const ImageVisual = ({ image, alt = "Service illustration" }) => (
  <div className="relative h-[32rem] flex items-center justify-center p-8 lg:p-12">
    <div className="relative w-full h-full max-w-lg">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden rounded-xl">
        <FloatingElement delay={0} className="absolute top-8 left-8 w-16 h-16 bg-gradient-to-br from-sky-400/20 to-blue-500/20 rounded-lg backdrop-blur-sm" />
        <FloatingElement delay={1} className="absolute bottom-8 right-8 w-12 h-12 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full backdrop-blur-sm" />
        <FloatingElement delay={0.5} className="absolute top-1/2 right-12 w-8 h-8 bg-gradient-to-br from-emerald-400/20 to-teal-500/20 rounded-full backdrop-blur-sm" />
      </div>
      
      {/* Main image container */}
      <div className="relative h-full flex items-center justify-center">
        <div className="relative group">
          {/* Glow effect behind image */}
          <div className="absolute -inset-4 bg-gradient-to-r from-sky-400/30 via-blue-500/30 to-purple-500/30 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-500 animate-pulse-glow"></div>
          
          {/* Image */}
          <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border border-white/50">
            <img 
              src={image} 
              alt={alt}
              className="w-full h-auto max-h-80 object-contain rounded-xl transition-transform duration-500 hover:scale-105"
            />
          </div>
          
          {/* Floating verification badge */}
          <div className="absolute -top-3 -right-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-bounce">
            <div className="flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              VERIFIED
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Visual Components (keeping originals as fallbacks)
export const GovernmentIdVisual = () => (
  <div className="relative bg-gradient-to-br from-purple-500 via-sky-500 to-blue-600 p-8 lg:p-12 flex items-center justify-center rounded-xl h-[32rem]">
     <div className="absolute inset-0 overflow-hidden">
      <FloatingElement delay={0} className="absolute top-8 left-8 w-16 h-16 bg-white/20 rounded-lg" />
      <FloatingElement delay={1} className="absolute bottom-8 right-8 w-12 h-12 bg-white/30 rounded-full" />
    </div>
    <div className="relative z-10 max-w-md w-full">
      <div className="relative">
        <div className="absolute top-4 left-4 w-full h-64 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 transform rotate-3 animate-pulse" />
        <div className="absolute top-2 left-2 w-full h-64 bg-white/30 backdrop-blur-sm rounded-2xl border border-white/40 transform rotate-1" />
        <div className="relative w-full h-64 bg-white/90 backdrop-blur-lg rounded-2xl border border-white/50 shadow-2xl p-6 animate-pulse-glow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded"></div>
            <div className="text-xs font-bold text-gray-600">GOVERNMENT OF INDIA</div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-16 h-20 bg-gray-200 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                <div className="h-3 bg-gray-300 rounded w-2/3"></div>
              </div>
            </div>
            <div className="flex justify-between items-end">
              <div className="w-16 h-16 bg-gray-800 rounded grid grid-cols-4 gap-0.5 p-1">
                {Array.from({ length: 16 }).map((_, i) => ( <div key={i} className={`rounded-sm ${Math.random() > 0.5 ? "bg-white" : "bg-gray-800"}`} /> ))}
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-sky-600">VERIFIED</div>
                <CheckCircle className="w-6 h-6 text-green-500 ml-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-bounce">
        <div className="flex items-center gap-2"> <Sparkles className="w-4 h-4" /> VERIFIED </div>
      </div>
    </div>
  </div>
);

export const CompanyCredentialVisual = () => (
  <div className="relative bg-gradient-to-br from-gray-800 via-gray-700 to-sky-600 p-8 lg:p-12 flex items-center justify-center h-[32rem] rounded-xl">
    <div className="absolute inset-0 overflow-hidden">
      <FloatingElement delay={0} className="absolute top-8 right-8 w-20 h-20 bg-white/10 rounded-2xl" />
      <FloatingElement delay={1.5} className="absolute bottom-8 left-8 w-16 h-16 bg-sky-500/30 rounded-full" />
    </div>
    <div className="relative z-10 max-w-md w-full">
      <div className="relative">
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-6 animate-pulse-glow">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center"> <Building2 className="w-6 h-6 text-white" /> </div>
              <div>
                <div className="h-3 bg-gray-300 rounded w-24 mb-1"></div>
                <div className="h-2 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"> <CheckCircle className="w-5 h-5 text-white" /> </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => ( <div key={i} className="bg-gray-50 rounded-lg p-3"> <div className="h-2 bg-gray-200 rounded w-full mb-2"></div> <div className={`h-4 bg-sky-500 rounded w-3/4`}></div> </div> ))}
          </div>
          <div className="space-y-3">
            {["GST Registration", "FSSAI License", "Company Registration"].map((item, i) => ( <div key={i} className="flex items-center justify-between p-2 bg-green-50 rounded-lg"> <span className="text-sm font-medium text-gray-700">{item}</span> <CheckCircle className="w-4 h-4 text-green-500" /> </div> ))}
          </div>
        </div>
        <div className="absolute -top-4 -left-4 bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-bounce"> VERIFIED </div>
        <div className="absolute -bottom-4 -right-4 bg-sky-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"> <Zap className="w-3 h-3" /> INSTANT </div>
      </div>
    </div>
  </div>
);

export const BankVisual = () => (
    <div className="relative bg-gradient-to-br from-emerald-500 to-green-600 p-8 lg:p-12 flex items-center justify-center h-[32rem] rounded-xl">
        <div className="text-white text-3xl font-bold">Bank Verification Visual</div>
    </div>
);

export const EducationVisual = () => (
    <div className="relative bg-gradient-to-br from-red-500 to-amber-600 p-8 lg:p-12 flex items-center justify-center h-[32rem] rounded-xl">
        <div className="text-white text-3xl font-bold">Education Verification Visual</div>
    </div>
);

// Card Component
const Card = ({ children, className, onMouseEnter, onMouseLeave }) => (
  <div className={className} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
    {children}
  </div>
);

const CardContent = ({ children, className }) => (
  <div className={className}>
    {children}
  </div>
);

// The Main ServiceCard Component
export default function ServiceCard({ data }) {
  const navigate = useNavigate()
  const [isHovered, setIsHovered] = useState(false);
  const { layout, theme, badgeIcon: BadgeIcon, badgeText, titleLines, typewriterTexts, ctaText, VisualComponent, features, image } = data;
 
  const contentOrder = layout === 'image-left' ? 'lg:order-2' : 'lg:order-1';
  const visualOrder = layout === 'image-left' ? 'lg:order-1' : 'lg:order-2';

  return (
    <>
      {/* Styles */}
      <style jsx>{`
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-15px); } }
        @keyframes pulse-glow { 
          0%, 100% { box-shadow: 0 0 20px rgba(56, 189, 248, 0.3); } 
          50% { box-shadow: 0 0 40px rgba(56, 189, 248, 0.6); } 
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
      `}</style>
      
      <Card
        className={`overflow-hidden border-0 shadow-2xl transition-all duration-500 hover:shadow-3xl rounded-3xl ${isHovered ? "scale-[1.02]" : ""}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="p-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
            {/* Text Content */}
            <div className={`p-8 lg:p-12 flex flex-col justify-between relative ${contentOrder}`}>
              <div className="relative z-10 flex-1">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-100 to-blue-100 text-sky-700 px-4 py-2 rounded-full text-sm font-semibold mb-6 animate-pulse-glow border border-sky-200">
                  <BadgeIcon className="w-4 h-4" />
                  <AnimatedText text={badgeText} delay={200} />
                </div>
                
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                  {titleLines.map((line, index) => (
                    <React.Fragment key={index}>
                      <AnimatedText 
                        text={line} 
                        delay={400 + index * 400} 
                        className={index % 2 !== 0 ? 'text-sky-600' : ''} 
                      />
                      {index < titleLines.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </h2>
                
                <div className="text-gray-600 mb-6 text-lg leading-relaxed min-h-[60px]">
                  <TypewriterText texts={typewriterTexts} className="font-medium" />
                </div>
                
                <div className="space-y-3 mb-8">
                  {features.map((feature, index) =>{ 
                    return(
                    <div 
                      key={index} 
                      className="flex items-center gap-3  animate-in slide-in-from-left-4 duration-500" 
                      style={{ 
                        animationDelay: `${1400 + index * 200}ms`, 
                        animationFillMode: "forwards" 
                      }}
                    >
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700 font-medium">{feature}</span>
                    </div>
                 )})}
                </div>
              </div>

              {/* Buttons Section - Moved to bottom */}
              <div className="flex items-center flex-wrap gap-4">
                <ModernButton variant="primary"
                onClick={() => navigate('/blog')}
                >
                  {ctaText}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </ModernButton>
                
                {/* <ModernButton 
                  variant="secondary"
                  onClick={() => console.log('Learn more clicked')}
                >
                  Learn more
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </ModernButton> */}
              </div>
            </div>

            {/* Visual Content */}
            <div className={`relative flex items-center justify-center ${visualOrder}`}>
              {image ? (
                <ImageVisual image={image} alt={`${badgeText} illustration`} />
              ) : (
                <VisualComponent />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}