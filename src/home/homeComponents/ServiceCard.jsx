import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Star, Tag } from 'lucide-react';

const ServiceCard = ({
  imageSrc,
  demandLevel,
  serviceName,
  verificationCount,
  durationDays,
  price,
  originalPrice = null,
  buttonState = "subscribe",
  discount = null,
  onClick
}) => {
  const getDemandLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case 'most demanding':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high demanding':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'average demanding':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low demanding':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getButtonConfig = (state) => {
    switch (state) {
      case 'purchased':
        return {
          text: 'Purchased',
          className: 'bg-green-600 hover:bg-green-700 text-white',
          disabled: false
        };
      case 'subscribe':
        return {
          text: 'Subscribe',
          className: 'bg-blue-600 hover:bg-blue-700 text-white',
          disabled: false
        };
      case 'disabled':
        return {
          text: 'Unavailable',
          className: 'bg-gray-400 cursor-not-allowed text-white',
          disabled: true
        };
      default:
        return {
          text: 'Subscribe',
          className: 'bg-blue-600 hover:bg-blue-700 text-white',
          disabled: false
        };
    }
  };

  const buttonConfig = getButtonConfig(buttonState);
  const hasDiscount = originalPrice && originalPrice !== price;

  return (
    <div 
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden cursor-pointer border border-gray-100"
      onClick={onClick}
    >
      {/* Image Section */}
      <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
        <img
          src={imageSrc}
          alt={serviceName}
          className="w-full h-32 object-contain mx-auto"
        />
        
        {/* Discount Badge */}
        {hasDiscount && discount && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-red-500 text-white px-2 py-1 text-xs font-bold">
              {discount.type === 'percentage' 
                ? `${discount.value}% OFF` 
                : `₹${discount.value} OFF`
              }
            </Badge>
          </div>
        )}
        
        {/* Demand Level Badge */}
        <div className="absolute top-3 left-3">
          <Badge className={`text-xs font-semibold px-3 py-1 border ${getDemandLevelColor(demandLevel)}`}>
            {demandLevel}
          </Badge>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-4">
        {/* Service Name */}
        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 min-h-[3.5rem]">
          {serviceName}
        </h3>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{verificationCount.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{durationDays} days</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>4.8</span>
          </div>
        </div>

        {/* Pricing */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-blue-600">
                ₹{typeof price === 'number' ? price.toFixed(0) : price}
              </span>
              {hasDiscount && (
                <span className="text-lg text-gray-500 line-through">
                  {originalPrice}
                </span>
              )}
            </div>
            {hasDiscount && (
              <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                <Tag className="w-4 h-4" />
                <span>Save ₹{(parseFloat(originalPrice.replace('₹', '')) - parseFloat(price)).toFixed(0)}</span>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500">per verification</p>
        </div>

        {/* Action Button */}
        <Button
          className={`w-full h-11 rounded-xl font-semibold transition-all duration-200 ${buttonConfig.className}`}
          disabled={buttonConfig.disabled}
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click when button is clicked
            if (onClick && !buttonConfig.disabled) {
              onClick();
            }
          }}
        >
          {buttonConfig.text}
        </Button>

        {/* Additional Info */}
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>✓ Instant processing</span>
            <span>✓ Secure & reliable</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;