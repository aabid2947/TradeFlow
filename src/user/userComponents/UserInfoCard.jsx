// UserInfoCard.jsx
import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Shield, FileText, Award } from "lucide-react";

const toTitleCase = (str) => {
  if (!str) return "";
  return str.replace(/_/g, " ").replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};

export function UserInfoCard({ services = [], activeServiceId, isSubscribed, onSubscribeClick }) {
  const navigate = useNavigate();

  const currentService = useMemo(() => {
    return services.find((s) => s.service_key === activeServiceId);
  }, [services, activeServiceId]);

  const handleTryOut = () => {
    if (!currentService) return;
    if (!isSubscribed) {
      // open subscription purchase flow
      onSubscribeClick && onSubscribeClick();
      return;
    }
    // navigate to execution page and pass the full service data via state for convenience
    navigate(`/user/try/${currentService.service_key}`, { state: { service: currentService } });
  };

  return (
    <Card className="shadow-lg border-2 border-blue-200 hover:shadow-xl transition-all">
      <CardHeader className="pb-4 px-6 pt-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Shield className="w-5 h-5" />
          {currentService ? currentService.name : "Select a Service"}
        </CardTitle>
        <p className="text-blue-100 text-sm">
          {isSubscribed
            ? "You have access. Click Try Out to execute this service."
            : "Subscribe to this category to get access to Try Out."}
        </p>
      </CardHeader>

      <CardContent className="px-6 pb-6 space-y-4">
        {!currentService ? (
          <p className="text-sm text-gray-500 text-center py-6">Select a service from the list to begin.</p>
        ) : (
          <>
            <div className="flex items-start gap-4">
              {/* {currentService.mainImage?.url ? (
                <img src={currentService.mainImage.url} alt={currentService.name} className="w-20 h-20 rounded-md object-cover border" />
              ) : (
                <div className="w-20 h-20 rounded-md bg-gray-100 border" />
              )} */}
              <div>
                <h3 className="font-semibold text-gray-900">{currentService.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{currentService.description || currentService.excerpt}</p>
                <p className="text-xs text-gray-500 mt-2">{toTitleCase(currentService.category)}</p>
              </div>
            </div>

            <div className="pt-4">
              {isSubscribed ? (
                <Button onClick={handleTryOut} className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 h-11 w-full">
                  <Shield className="w-4 h-4 mr-2" />
                  Try Out
                </Button>
              ) : (
                <Button onClick={handleTryOut} className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 h-11 w-full">
                  <Award className="w-4 h-4 mr-2" />
                  Subscribe to Access / Try Out
                </Button>
              )}
              {/* <p className="text-xs text-center text-gray-500 mt-2">Try Out runs the service sandbox without requiring user inputs on this panel.</p> */}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
