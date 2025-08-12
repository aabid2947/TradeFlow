import { Heart, Shield, Clock, Check, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useLocation } from "react-router-dom";

export default function ServiceListCard({ service, buttonType, onButtonClick }) {
  const isPurchased = buttonType === "verify";
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.pathname.includes('admin');

  
  const handleCardClick = () => {
    // Only navigate if the user is not an admin.
    if (!isAdmin) {
      // If the service has a subcategory, navigate to the page that lists all services in that subcategory.
      // This assumes the route's parameter will now be the subcategory.
      if (service.subcategory) {
        navigate(`/user/service/${encodeURIComponent(service.subcategory)}`);
      }
      // If there is no subcategory, clicking the card does nothing, as the detail page is for subcategories.
    }
  };
  const handleActionButtonClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (onButtonClick) {
      onButtonClick(service);
    }
  };

  const cardClassName = `w-full overflow-hidden border border-gray-300 rounded-xl shadow-sm transition-all duration-300 ease-in-out hover:shadow-md hover:-translate-y-1 ${
    !isAdmin && service.subcategory ? 'cursor-pointer' : 'cursor-default'
  }`;

  return (
    <Card onClick={handleCardClick} className={cardClassName}>
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="md:w-1/3 lg:w-1/4 flex-shrink-0">
          <img
            src={service.imageUrl || "/placeholder.svg"}
            alt={service.name}
            className="w-full h-48 md:h-full object-cover"
          />
        </div>

        {/* Content Section */}
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">{service.name}</h3>
            {/* <Badge className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-2 py-1 rounded-md">
              {service.category}
            </Badge> */}
          </div>
          
          <p className="hidden md:block text-sm text-gray-600 mt-1 flex-grow">
            {service.description}
          </p>

          <div className="flex items-center gap-6 text-sm text-gray-700 my-2">
            <div className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-blue-500" />
              <span>{service.globalUsageCount} Verifications</span>
            </div>
            {/* <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-gray-500" />
              <span>{service.durationDays || 'N/A'} days</span>
            </div> */}
          </div>
          
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="text-2xl font-bold text-orange-500">
              {isPurchased ? (
                  <Badge variant="outline" className="text-green-600 border-green-600 text-base">
                    Subscribed
                  </Badge>
              ) : (
                `₹ ${service.price}`
              )}
            </div>

            <Button
              size="sm"
              className={`${
                isPurchased
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white px-4 py-2 rounded-md font-semibold flex items-center gap-2`}
              onClick={handleActionButtonClick}
            >
              {isPurchased ? "Verify Now" : "Purchase"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}