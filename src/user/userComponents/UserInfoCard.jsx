import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Helper function (optional if label is already provided)
const toTitleCase = (str) => {
  if (!str) return "";
  return str
    .replace(/_/g, " ")
    .replace(/([A-Z])/g, " $1")
    .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};

export function UserInfoCard({ services = [], activeServiceId, onVerify, isVerifying }) {
  const [formData, setFormData] = useState({});
  const [currentService, setCurrentService] = useState(null);

  useEffect(() => {
    if (activeServiceId && services.length > 0) {
      const service = services.find((s) => s.service_key === activeServiceId);
      setCurrentService(service);
      setFormData({});
    }
  }, [activeServiceId, services]);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleBuyNow = async (e) => {
    e.preventDefault();
    if (!activeServiceId || !onVerify) return;

    const isFileUpload = currentService.inputFields.some((input) => input.type === "file");
    let payload;

    if (isFileUpload) {
      payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        payload.append(key, value);
      });
    } else {
      payload = { ...formData };
    }

    onVerify(payload);
  };

  return (
    <Card className="shadow-sm border border-gray-200 hover:shadow-md transition-all">
      <CardHeader className="pb-4 px-6 pt-6">
        <CardTitle className="text-lg font-semibold text-gray-900">
          {currentService ? currentService.name : "Service Inputs"}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6 space-y-6">
        <div className="space-y-4">
          {!currentService ? (
            <p className="text-sm text-gray-500">Select a service from the left to begin.</p>
          ) : currentService.inputFields.length === 0 ? (
            <p className="text-sm text-gray-500">No input fields defined for this service.</p>
          ) : (
            currentService.inputFields.map(({ name, type, label, placeholder }) => {
              
              return (
              <div key={name} className="grid w-full items-center gap-1.5">
                <Label htmlFor={name} className="text-sm font-medium text-gray-700">
                  {label || toTitleCase(name)}
                </Label>
                <Input
                  id={name}
                  name={name}
                  type={type}
                  placeholder={placeholder || `Enter ${toTitleCase(name)}...`}
                  onChange={handleInputChange}
                  className="w-full text-sm"
                />
              </div>
              )
})
          )}
        </div>

        {currentService && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="text-blue-600 font-semibold">
              <span className="text-lg">₹ {currentService.price}</span>
            </div>
            <Button
              onClick={handleBuyNow}
              disabled={isVerifying}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 text-sm font-medium"
            >
              {isVerifying ? "Processing..." : "Verify & Pay"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}