import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Assuming you have a reusable Input component
import { Label } from "@/components/ui/label"; // Assuming you have a reusable Label component
import { useVerifyServiceMutation } from "@/app/api/verificationApiSlice"; // Placeholder for your actual API mutation hook

// Helper to format API keys into human-readable labels
const toTitleCase = (str) => {
  if (!str) return '';
  return str
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};

// Maps service_key to the required input fields and their types
const serviceInputMap = {
  "XI5XOc2Bglsz": { inputs: [{ key: "phone", type: "text" }, { key: "full_name", type: "text" }] },
  "fKLLHQZPzMj2": { inputs: [{ key: "pan_number", type: "text" }] },
  "74kpYG3tcfsa": { inputs: [{ key: "pan_number", type: "text" }] },
  "u8Q2Y4JwhnkG": { inputs: [{ key: "pan_number", type: "text" }] },
  "JL2oObmGlZbe": { inputs: [{ key: "pan_number", type: "text" }, { key: "aadhaar_number", type: "text" }] },
  "uYnJFMgxHazx": { inputs: [{ key: "file_front", type: "file" }] },
  "HKrHWvSGl1ec": { inputs: [{ key: "gstin", type: "text" }] },
  "5aoFZZAkoE8u": { inputs: [{ key: "gstin", type: "text" }] },
  "vSWVUK3FEPsD": { inputs: [{ key: "account_number", type: "text" }, { key: "ifsc", type: "text" }] },
  "VpmH1V8hPtA6": { inputs: [{ key: "file_front", type: "file" }] },
  "AIUZM0I0S0CJ": { inputs: [{ key: "driving_license_number", type: "text" }, { key: "date_of_birth", type: "date" }] },
  "pBJJWCEmQrR5": { inputs: [{ key: "file_front", type: "file" }, { key: "file_back", type: "file" }] },
  "47EcaG2O0rRp": { inputs: [{ key: "uan", type: "text" }] },
  "oiMhTVLP85by": { inputs: [{ key: "file_1", type: "file" }, { key: "file_2", type: "file" }] },
  "XsaezgdXU2CL": { inputs: [{ key: "redirect_uri", type: "url" }] },
  "zn5PFbc8iPcr": { inputs: [{ key: "panno", type: "text" }, { key: "PANFullName", type: "text" }] },
  "4Ph0xari6MYA": { inputs: [{ key: "company_id", type: "text" }] },
  "O6qmkqZfxTVJ": { inputs: [{ key: "rc_number", type: "text" }, { key: "chassis_number", type: "text" }, { key: "engine_number", type: "text" }] },
  "9THSRX2PwluS": { inputs: [{ key: "phone", type: "text" }, { key: "full_name", type: "text" }, { key: "pan", type: "text" }, { key: "address", type: "text" }, { key: "date_of_birth", type: "date" }] },
};

export function UserInfoCard({ activeServiceId, services }) {
  const [formData, setFormData] = useState({});
  const [currentService, setCurrentService] = useState(null);
  const [verifyService, { isLoading, data: result, error }] = useVerifyServiceMutation();
  
  
  // const [executeService, { isLoading }] = useExecuteServiceMutation();

  useEffect(() => {
    if (activeServiceId && services.length > 0) {
      const service = services.find(s => s.service_key === activeServiceId);
      setCurrentService(service);
      setFormData({}); // Reset form when service changes
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
    if (!activeServiceId) return;

    const requiredInputs = serviceInputMap[activeServiceId]?.inputs || [];
    const isFileUpload = requiredInputs.some(input => input.type === 'file');
    let payload;

    if (isFileUpload) {
      payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        payload.append(key, value);
      });
    } else {
      // Handle special case for DigiLocker Pull PAN
      payload = activeServiceId === "zn5PFbc8iPcr" ? { parameters: { ...formData } } : { ...formData };
    }
    console.log(payload)
    try {
      const response = await verifyService({
        "serviceKey":activeServiceId,
        "payload":payload
      }).unwrap();
      console.log("✅ Verification success:", response);
      // show success to user…
    } catch (err) {
      console.error("❌ Verification failed:", err);
      // show error to user…
    }
    // await executeService({ serviceId: activeServiceId, payload }).unwrap();
    alert("Submission logic is ready. Check the browser console for the request payload.");
  };

  const requiredInputs = activeServiceId ? serviceInputMap[activeServiceId]?.inputs : [];

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
          ) : (
            requiredInputs?.map(({ key, type }) => (
              <div key={key} className="grid w-full items-center gap-1.5">
                <Label htmlFor={key} className="text-sm font-medium text-gray-700">
                  {toTitleCase(key)}
                </Label>
                <Input
                  id={key}
                  name={key}
                  type={type}
                  placeholder={`Enter ${toTitleCase(key)}...`}
                  onChange={handleInputChange}
                  className="w-full text-sm"
                />
              </div>
            ))
          )}
        </div>

        {currentService && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="text-blue-600 font-semibold">
              <span className="text-lg">₹ {currentService.price}</span>
            </div>
            <Button
              onClick={handleBuyNow}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 text-sm font-medium"
              // disabled={isLoading}
            >
              {/* {isLoading ? "Processing..." : "Verify & Pay"} */}
              Verify & Pay
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}