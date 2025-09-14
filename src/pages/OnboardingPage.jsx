import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from 'react-redux';
import { Button } from "../components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../components/ui/form";
import { Input } from "../components/ui/input";
import { useToast } from "../hooks/use-toast";
import { useCompleteProfileMutation } from "../features/api/apiSlice";
import { updateUser } from "../features/auth/authSlice";
import logo from "../assets/favicon.svg"
const schema = z.object({
  username: z.string()
    .min(3, "Username must be at least 3 characters long")
    .max(30, "Username cannot exceed 30 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  role: z.enum(["buyer", "seller"], {
    required_error: "Please select your role",
  }),
  phoneNumber: z.string()
    .regex(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .optional()
    .or(z.literal("")),
  address: z.string().max(200, "Address cannot exceed 200 characters").optional(),
  businessName: z.string().optional(),
}).superRefine((data, ctx) => {
  // Business name is required for sellers
  if (data.role === "seller" && (!data.businessName || data.businessName.trim() === "")) {
    ctx.addIssue({
      code: "custom",
      message: "Business name is required for sellers",
      path: ["businessName"],
    });
  }
});

export default function OnboardingPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [completeProfile, { isLoading }] = useCompleteProfileMutation();
  const [selectedRole, setSelectedRole] = useState("");
  
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { 
      username: "", 
      role: "", 
      phoneNumber: "",
      address: "",
      businessName: ""
    },
    mode: "onChange",
    reValidateMode: "onChange"
  });

  async function onSubmit(values) {
    try {
      // Remove businessName if not a seller
      const profileData = { ...values };
      if (profileData.role !== 'seller') {
        delete profileData.businessName;
      }

      const result = await completeProfile(profileData).unwrap();
      
      // Update user in Redux store
      dispatch(updateUser(result.data.user));
      
      toast({
        title: "Profile Completed!",
        description: "Welcome to TradeFlow! Your profile has been set up successfully.",
      });
      
      navigate("/dashboard");
    } catch (err) {
      console.error('Profile completion error:', err);
      let errorMessage = "Failed to complete profile";
      
      if (err.data && err.data.message) {
        errorMessage = err.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      toast({
        title: "Profile Setup Failed",
        description: errorMessage,
        variant: "destructive"
      });
    }
  }

  const watchedRole = form.watch("role");
  const watchedUsername = form.watch("username");
  const watchedBusinessName = form.watch("businessName");
  
  // Check if form is valid for submission
  const isFormValid = () => {
    const { username, role, businessName } = form.getValues();
    
    // Check required fields
    if (!username || username.length < 3) return false;
    if (!role) return false;
    
    // Check business name for sellers
    if (role === "seller" && (!businessName || businessName.trim() === "")) {
      return false;
    }
    
    // Check for form errors
    return Object.keys(form.formState.errors).length === 0;
  };

  // Re-validate when role changes to update business name validation
  useEffect(() => {
    if (watchedRole) {
      form.trigger(); // Trigger validation for all fields
    }
  }, [watchedRole, form]);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse at 20% 80%, rgba(40, 40, 80, 0.15) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 20%, rgba(30, 60, 120, 0.1) 0%, transparent 50%),
          linear-gradient(135deg, #050505 0%, #0a0a15 25%, #101020 50%, #0a0a15 75%, #000 100%),
          radial-gradient(circle at 70% 30%, rgba(50, 80, 140, 0.08) 0%, transparent 60%),
          radial-gradient(circle at 30% 70%, rgba(80, 120, 200, 0.05) 0%, transparent 60%)
        `,
        backgroundSize: '100% 100%, 100% 100%, 100% 100%, 200% 200%, 200% 200%',
        animation: 'gradientShift 20s ease-in-out infinite'
      }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
            <div className="text-left flex flex-row mb-8 gap-3 items-center">
          <img src={logo}  alt="TradeFlow Logo" />
          <h1 className="text-white text-xl font-semibold font-sans">TradeFlow</h1>

        </div>

        {/* Onboarding Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent">
                Complete Your Profile
              </span>
            </h2>
            <p className="text-gray-400 text-sm">Let's get you set up to start trading</p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Username */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Username *</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter your username"
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              {/* Role Selection */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">I want to *</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            field.onChange("buyer");
                            setSelectedRole("buyer");
                          }}
                          className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                            field.value === "buyer"
                              ? "border-purple-500 bg-purple-500/20 text-purple-300"
                              : "border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600"
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-lg font-semibold">Buy</div>
                            <div className="text-sm opacity-75">Purchase tokens</div>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            field.onChange("seller");
                            setSelectedRole("seller");
                          }}
                          className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                            field.value === "seller"
                              ? "border-purple-500 bg-purple-500/20 text-purple-300"
                              : "border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600"
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-lg font-semibold">Sell</div>
                            <div className="text-sm opacity-75">Create listings</div>
                          </div>
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              {/* Business Name - Only for sellers */}
              {watchedRole === "seller" && (
                <FormField
                  control={form.control}
                  name="businessName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Business Name *</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter your business name"
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              )}

              {/* Phone Number */}
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Phone Number (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="Enter your phone number"
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              {/* Address */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Address (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter your address"
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading || !isFormValid()}
                className="w-full py-3 mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? "Setting up your profile..." : "Complete Profile"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
