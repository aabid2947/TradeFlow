import { Heart, Shield, Clock, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

export default function ServiceCard({
  imageSrc,
  alt = "",
  demandLevel,
  serviceName,
  verificationCount,
  durationDays,
  price,
  buttonState, // "purchased" | "subscribe"
  serviceId,
  onSubscribeClick, // Accept the handler prop
  serviceImage
}) {
  const isPurchased = buttonState === "purchased";
  const navigate = useNavigate();

  const handleCardClick = () => {
    if(serviceId){

      navigate(`/product/${serviceId}`);
    }
  };

  const handleSubscribeButton = (e) => {
    e.stopPropagation();
    e.preventDefault();

    navigate(`/login`);
  };

  return (
    <Card onClick={handleCardClick} className="overflow-hidden border border-[#1A89C1] p-1 rounded-xl shadow-sm group-hover:shadow-md transition-all duration-300 ease-in-out group-hover:-translate-y-2 cursor-pointer">
      <div className="relative">
        <div className="aspect-[4/2.5] overflow-hidden">
          <img
            src={serviceImage || imageSrc}
            alt={alt || serviceName}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </div>

      <CardContent className="p-3 space-y-3">
       

        <h3 className="text-lg text-start font-semibold text-gray-900 truncate">
          {serviceName}
        </h3>
        <div className="flex items-center gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-600">
                {verificationCount} Verification
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {durationDays} days
              </span>
            </div>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="text-xl font-bold text-orange-500">₹ {price}</div>
          <Button
            size="sm"
            className={`${
              isPurchased
                ? "bg-green-500 hover:bg-green-600"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-1.5`}
            //  Attach the new handler 
            onClick={handleSubscribeButton}
          >
            {isPurchased && <Check className="w-4 h-4" />}
            Buy Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}