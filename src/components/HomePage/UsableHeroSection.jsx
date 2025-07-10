import React, { useState, useEffect } from 'react';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const services = [
    {
      id: 1,
      title: "Maid Verification",
      description: "Thorough background checks for your household help to ensure safety and reliability.",
      image: "maid-verification.svg",
      price: "₹499"
    },
    {
      id: 2,
      title: "Driver Verification",
      description: "Comprehensive driving history and background verification for your personal drivers.",
      image: "driver-verification.svg",
      price: "₹599"
    },
    {
      id: 3,
      title: "Nanny Verification",
      description: "Detailed background checks for childcare providers to give you peace of mind.",
      image: "nanny-verification.svg",
      price: "₹699"
    },
    {
      id: 4,
      title: "Personal Staff Screening",
      description: "Complete verification for all household staff with detailed reports.",
      image: "staff-screening.svg",
      price: "₹799"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % services.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [services.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? services.length - 1 : prev - 1));
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % services.length);
  };

  return (
    <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center">
          {/* Left content */}
          <div className="lg:w-1/2 lg:pr-12 mb-10 lg:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Trusted Identity & Background Verification for Your Home
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Hiring domestic help or personal staff (maids, drivers, nannies, etc.) is a convenient necessity for many families – but ensuring their trustworthiness is crucial. verifyMyKyc is a digital identity verification platform tailored for individuals and households.
            </p>
            
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mb-8">
              <h3 className="text-xl font-semibold text-[#1987BF] mb-2">
                {services[currentSlide].title}
              </h3>
              <p className="text-gray-700 mb-4">
                {services[currentSlide].description}
              </p>
              <button className="bg-[#1987BF] hover:bg-[#1470a3] text-white font-bold py-3 px-6 rounded-lg transition duration-300 shadow-lg transform hover:scale-105">
                Get Verified for {services[currentSlide].price}
              </button>
            </div>
            
            <div className="flex space-x-4">
              <button className="bg-white border-2 border-[#1987BF] text-[#1987BF] hover:bg-[#1987BF] hover:text-white font-semibold py-2 px-4 rounded-lg transition duration-300">
                View All Services
              </button>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg transition duration-300">
                How It Works
              </button>
            </div>
          </div>
          
          {/* Right content with carousel */}
          <div className="lg:w-1/2 relative">
            <div className="relative overflow-hidden rounded-2xl shadow-xl border-4 border-[#1987BF] h-96">
              {services.map((service, index) => (
                <div 
                  key={service.id}
                  className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <div className="bg-gradient-to-br from-[#1987BF] to-blue-300 h-full flex items-center justify-center p-8">
                    <div className="bg-white rounded-2xl p-6 shadow-lg max-w-xs mx-auto">
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center text-[#1987BF]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-center text-gray-900 mb-2">{service.title}</h3>
                      <p className="text-center text-gray-600 text-sm">{service.description}</p>
                      <div className="mt-4 flex justify-center">
                        <span className="bg-[#1987BF] text-white py-1 px-4 rounded-full font-bold">
                          {service.price}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Carousel controls */}
            <div className="flex justify-center mt-6 space-x-2">
              {services.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full ${
                    index === currentSlide ? 'bg-[#1987BF]' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            
            <div className="absolute top-1/2 transform -translate-y-1/2 w-full flex justify-between px-4">
              <button 
                onClick={goToPrevSlide}
                className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#1987BF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={goToNextSlide}
                className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#1987BF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Services grid below */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Verification Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition duration-300">
                <div className="bg-[#1987BF] h-2 w-full"></div>
                <div className="p-6">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mb-4 flex items-center justify-center text-[#1987BF]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-[#1987BF]">{service.price}</span>
                    <button className="bg-[#1987BF] hover:bg-[#1470a3] text-white font-medium py-2 px-4 rounded-lg transition duration-300">
                      Get Verified
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;