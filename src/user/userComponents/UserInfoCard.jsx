import React, { useState, useEffect ,useMemo} from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, Shield, FileText, Award, Loader2 } from "lucide-react";

const toTitleCase = (str) => {
  if (!str) return "";
  return str.replace(/_/g, " ").replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};

export function UserInfoCard({ services = [], activeServiceId, onVerify, isVerifying, isSubscribed, onSubscribeClick }) {
  const [formData, setFormData] = useState({});
  
  const currentService = useMemo(() => {
    return services.find((s) => s.service_key === activeServiceId);
  }, [activeServiceId, services]);

  useEffect(() => {
    setFormData({});
  }, [activeServiceId]);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "file" ? files[0] : value }));
  };

  const handleVerify = (e) => {
    e.preventDefault();
    if (!currentService || !onVerify) return;

    let payload;
    if (currentService.apiType === 'form') {
      payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => payload.append(key, value));
    } else {
      payload = { ...formData };
    }
    onVerify(payload);
  };
  
  const isFormFilled = currentService ? currentService.inputFields.every(field => formData[field.name]) : false;

  return (
    <Card className="shadow-lg border-2 border-blue-200 hover:shadow-xl transition-all">
      <CardHeader className="pb-4 px-6 pt-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Shield className="w-5 h-5" />
          {currentService ? currentService.name : "Select a Service"}
        </CardTitle>
        <p className="text-blue-100 text-sm">
          {isSubscribed 
            ? "You have access. Please provide the required inputs to verify."
            : "Subscribe to this category to get access to this service."
          }
        </p>
      </CardHeader>
      <CardContent className="px-6 pb-6 space-y-6">
        <div className="space-y-4 pt-6">
          {!currentService ? (
             <p className="text-sm text-gray-500 text-center py-4">Select a service from the list to begin.</p>
          ) : (
            currentService.inputFields.map(({ name, type, label, placeholder }) => (
              <div key={name} className="grid w-full items-center gap-1.5">
                <Label htmlFor={name} className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                  <FileText className="w-3 h-3 text-gray-500"/>
                  {label || toTitleCase(name)}
                </Label>
                <Input 
                  id={name} 
                  name={name} 
                  type={type} 
                  placeholder={placeholder || `Enter ${toTitleCase(name)}...`} 
                  onChange={handleInputChange} 
                  className="border-2" 
                  disabled={!isSubscribed} // Input is disabled if not subscribed
                />
              </div>
            ))
          )}
        </div>

        {currentService && (
            <div className="bg-white border-2 border-blue-200 rounded-lg p-4 space-y-4">
              {isSubscribed ? (
                <>
                  <div className="flex items-center justify-center pt-4">
                      <Button onClick={handleVerify} disabled={isVerifying || !isFormFilled} className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 h-11 w-full">
                          {isVerifying ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Shield className="w-4 h-4 mr-2" />}
                          {isVerifying ? "Processing..." : "Verify Now"}
                      </Button>
                  </div>
                  <div className="flex items-center justify-center gap-4 pt-3 border-t">
                      <div className="flex items-center gap-1 text-xs text-gray-500"><Shield className="w-3 h-3 text-green-500" /><span>SSL Secured</span></div>
                      <div className="flex items-center gap-1 text-xs text-gray-500"><CheckCircle className="w-3 h-3 text-green-500" /><span>Verified Service</span></div>
                      <div className="flex items-center gap-1 text-xs text-gray-500"><Award className="w-3 h-3 text-green-500" /><span>Subscribed Access</span></div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-center pt-4">
                    <Button onClick={onSubscribeClick} className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 h-11 w-full">
                        <Award className="w-4 h-4 mr-2" />
                        Subscribe to Access
                    </Button>
                  </div>
                   <p className="text-center text-xs text-gray-500 pt-2">You need a plan that includes this service.</p>
                </>
              )}
            </div>
        )}
      </CardContent>
    </Card>
  );
}