"use client"

import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { Mail, Lock, ArrowRight, Phone, Eye, EyeOff, KeyRound, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FloatingLabel } from "./FloatingLabel"
import { AuthCard } from "../cards/AuthCard"
import {
  useLoginMutation,
  useLoginWithGoogleMutation,
  useForgotPasswordMutation,
} from "@/app/api/authApiSlice"
import { setCredentials } from "@/features/auth/authSlice"
import { auth, googleProvider } from "@/firebase/firebaseConfig.js"
import { signInWithPopup } from "firebase/auth"

export function LoginForm() {
  // State to manage which UI flow is active: 'login', 'phone', or 'forgotPassword'
  const [currentFlow, setCurrentFlow] = useState('login');
  // State to manage steps within a flow (e.g., for phone verification)
  const [flowStep, setFlowStep] = useState(1);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phone: "",
    verificationCode: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // RTK Query Hooks for API mutations
  const [login, { isLoading: isLoginLoading, error: loginApiError }] = useLoginMutation();
  const [loginWithGoogle, { isLoading: isGoogleLoading, error: googleApiError }] = useLoginWithGoogleMutation();
  const [forgotPassword, { isLoading: isForgotPasswordLoading, error: forgotPasswordApiError, isSuccess: isForgotPasswordSuccess }] = useForgotPasswordMutation();

  // --- VALIDATION FUNCTIONS ---
  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        if (!value) return "Email is required";
        if (!/\S+@\S+\.\S+/.test(value)) return "Please enter a valid email";
        return "";
      case 'password':
        if (!value) return "Password is required";
        return "";
      case 'phone':
        if (!value) return "Phone number is required";
        if (!/^\+?[\d\s-()]{10,}$/.test(value)) return "Please enter a valid phone number";
        return "";
      case 'verificationCode':
        if (!value) return "Verification code is required";
        if (value.length !== 6) return "Please enter a 6-digit code";
        return "";
      default:
        return "";
    }
  };

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // --- FLOW MANAGEMENT ---
  const handleBackToLogin = () => {
    setCurrentFlow('login');
    setFlowStep(1);
    setErrors({});
  };

  // --- SUBMIT HANDLERS ---
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const emailError = validateField('email', formData.email);
    const passwordError = validateField('password', formData.password);
    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }

    try {
      const response = await login(formData).unwrap();
  
      dispatch(setCredentials(response));
      navigate("/user");
    } catch (err) {
      console.error("Failed to log in:", err);
    }
  };

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    if (flowStep === 1) {
      const phoneError = validateField('phone', formData.phone);
      if (phoneError) {
        setErrors({ phone: phoneError });
        return;
      }
      // Mock sending code and move to the next step
      console.log("Sending verification code to:", formData.phone);
      setFlowStep(2);
      setErrors({});
    } else {
      const codeError = validateField('verificationCode', formData.verificationCode);
      if (codeError) {
        setErrors({ verificationCode: codeError });
        return;
      }
      // Mock phone login success
      console.log("Verifying code:", formData.verificationCode);
      const mockResponse = { user: { id: 'phone_user', phone: formData.phone }, token: 'mock_phone_token' };
      dispatch(setCredentials(mockResponse));
      navigate("/user");
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    const emailError = validateField('email', formData.email);
    if (emailError) {
      setErrors({ email: emailError });
      return;
    }
    try {
      // This will just trigger the backend to send the email
      await forgotPassword({ email: formData.email }).unwrap();
    } catch (err) {
      console.error("Forgot password request failed:", err);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const response = await loginWithGoogle({ token: idToken }).unwrap();
      dispatch(setCredentials(response));
      navigate("/user");
    } catch (err) {
      console.error("Google sign-in failed:", err);
    }
  };

  // --- RENDER LOGIC ---
  const GoogleLogo = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" className="mr-3">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );

  const getCardTitle = () => {
    if (currentFlow === 'forgotPassword') return "Reset Password";
    if (currentFlow === 'phone') return "Phone Sign In";
    return "Welcome Back";
  };

  const getCardSubtitle = () => {
    if (currentFlow === 'forgotPassword') return "Enter your email to receive a reset link.";
    if (currentFlow === 'phone') return flowStep === 1 ? "Enter your phone number to continue" : "Enter the 6-digit code sent to your phone";
    return "Sign in to your account to continue";
  };

  const anyApiError = loginApiError || googleApiError || forgotPasswordApiError;

  const renderFormContent = () => {
    switch(currentFlow) {
      // --- FORGOT PASSWORD FLOW ---
      case 'forgotPassword':
        return (
          <form onSubmit={handleForgotPasswordSubmit} className="space-y-6">
            {isForgotPasswordSuccess ? (
               <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-center text-sm" role="alert">
                 If an account with that email exists, a password reset link has been sent.
               </div>
            ) : (
              <>
                {forgotPasswordApiError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center text-sm" role="alert">
                    {forgotPasswordApiError.data?.message || "An error occurred. Please try again."}
                  </div>
                )}
                <FloatingLabel label="Email Address" value={formData.email} onChange={handleInputChange("email")} error={errors.email} icon={Mail} type="email" />
                <Button type="submit" disabled={isForgotPasswordLoading} className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium">
                  {isForgotPasswordLoading ? "Sending Link..." : "Send Reset Link"}
                </Button>
              </>
            )}
          </form>
        );

      // --- PHONE LOGIN FLOW ---
      case 'phone':
        return (
          <form onSubmit={handlePhoneSubmit} className="space-y-6">
            {flowStep === 1 ? (
              <div className="space-y-5">
                <FloatingLabel label="Phone Number" value={formData.phone} onChange={handleInputChange("phone")} error={errors.phone} icon={Phone} type="tel" />
                <Button type="submit" className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium">
                  Send Verification Code
                </Button>
              </div>
            ) : (
              <div className="space-y-5">
                <FloatingLabel label="Verification Code" value={formData.verificationCode} onChange={handleInputChange("verificationCode")} error={errors.verificationCode} icon={KeyRound} type="text" maxLength={6}/>
                <Button type="submit" className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium">
                  Verify & Sign In
                </Button>
              </div>
            )}
          </form>
        );

      // --- DEFAULT LOGIN FLOW ---
      case 'login':
      default:
        return (
          <>
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              {loginApiError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center text-sm" role="alert">
                  {loginApiError.data?.message || "Invalid credentials. Please try again."}
                </div>
              )}
              <div className="space-y-5">
                <FloatingLabel label="Email Address" value={formData.email} onChange={handleInputChange("email")} error={errors.email} icon={Mail} type="email" />
                {/* 
                  FIX: The FloatingLabel component for passwords now handles the visibility toggle.
                  - Removed the extra <button> that was causing the duplicate icon.
                  - Added `showPassword` and `onTogglePassword` props to FloatingLabel.
                */}
                <FloatingLabel
                  label="Password"
                  value={formData.password}
                  onChange={handleInputChange("password")}
                  error={errors.password}
                  icon={Lock}
                  type="password"
                  showPassword={showPassword}
                  onTogglePassword={() => setShowPassword(!showPassword)}
                />
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <span className="text-gray-600 group-hover:text-gray-800">Remember me</span>
                  </label>
                  {/* <button type="button" onClick={() => setCurrentFlow('forgotPassword')} className="text-blue-600 hover:text-blue-800 font-medium hover:underline">Forgot password?</button> */}
                </div>
                <Button type="submit" disabled={isLoginLoading} className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium">
                  {isLoginLoading ? "Signing in..." : "Sign In"}
                </Button>
              </div>
            </form>

            {/* Alternative sign-in options */}
            <div className="relative my-8"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div><div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-gray-500 font-medium">or continue with</span></div></div>
            {/* <div className="space-y-4">
              <button onClick={() => setCurrentFlow('phone')} className="w-full h-12 flex items-center justify-center border-2 border-gray-200 hover:border-gray-300 rounded-xl bg-white"><Phone className="w-5 h-5 text-green-600 mr-3" /> <span className="text-gray-700 font-medium">Continue with Phone</span></button>
              <button onClick={handleGoogleSignIn} disabled={isGoogleLoading} className="w-full h-12 flex items-center justify-center border-2 border-gray-200 hover:border-gray-300 rounded-xl bg-white"><GoogleLogo /> <span className="text-gray-700 font-medium">Continue with Google</span></button>
            </div> */}
          </>
        );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <AuthCard title={getCardTitle()} subtitle={getCardSubtitle()}>
          {currentFlow !== 'login' && (
            <button onClick={handleBackToLogin} className="flex items-center text-sm text-gray-600 hover:text-gray-800 mb-6 transition-colors duration-200 group">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
              Back to Sign In
            </button>
          )}

          {renderFormContent()}

          {/* Sign up link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <button onClick={() => navigate("/signup")} className="text-blue-600 hover:text-blue-800 font-semibold">Sign up here</button>
            </p>
          </div>
        </AuthCard>
      </div>
    </div>
  )
}