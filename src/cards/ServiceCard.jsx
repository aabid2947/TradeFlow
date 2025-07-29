import { Heart, Shield, Clock, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate,useLocation } from "react-router-dom";

export default function ServiceCard({
  imageSrc,
  alt = "",
  demandLevel,
  serviceName,
  verificationCount,
  durationDays,
  price,
  buttonType, // "purchase" | "verify"
  service,
  onButtonClick,
}) {

  const isPurchased = buttonType === "verify";
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.pathname.includes('admin');

  const handleCardClick = () => {
    // Only navigate if the user is not an admin.
    console.log(isAdmin)
    if (!isAdmin) {
      navigate(`/user/service/${encodeURIComponent(service.category)}`);
    }
    // If the user is an admin, clicking the card does nothing.
  };

  const handleActionButtonClick = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (onButtonClick) {
      onButtonClick(service);
    }
  };

  // Conditionally set the className for the cursor style
  const cardClassName = `overflow-hidden border border-[#1A89C1] p-1 rounded-xl shadow-sm group-hover:shadow-md transition-all duration-300 ease-in-out group-hover:-translate-y-2 ${
    !isAdmin ? 'cursor-pointer' : 'cursor-default'
  }`;

  return (
    <Card onClick={handleCardClick} className={cardClassName}>
      <div className="relative">
        <div className="aspect-[4/2.8] overflow-hidden">
          <img
            src={imageSrc}
            alt={alt || serviceName}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </div>

      <CardContent className="p-3 space-y-3">
        <div className="flex items-center justify-between gap-4 ">
          <Badge className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-md">
            {demandLevel}
          </Badge>
          <button className="p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors">
            <Heart className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors" />
          </button>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 truncate">
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
          <div>
            {isPurchased ? (
              <Badge variant="outline" className="text-green-600 border-green-600">Subscribed</Badge>
            ) : (
              <div className="text-xl font-bold text-orange-500">₹ {price}</div>
            )}
          </div>
          <Button
            size="sm"
            className={`${
              isPurchased
                ? "bg-green-500 hover:bg-green-600"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-1.5`}
            onClick={handleActionButtonClick}
          >
            {isPurchased && <Check className="w-4 h-4" />}
            {isPurchased ? "Verify" : "Purchase"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}