import React from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../components/ui/form";
import { Input } from "../components/ui/input";
import { usePasswordReset } from "../hooks/usePasswordReset";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export function ForgotPasswordForm() {
  const { 
    isLoading, 
    isEmailSent, 
    userEmail, 
    sendPasswordReset, 
    resendPasswordReset, 
    resetForm 
  } = usePasswordReset();
  
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
    mode: "onChange",
  });

  const isValid = form.formState.isValid;

  async function onSubmit(values) {
    await sendPasswordReset(values.email);
  }

  // Resend password reset email
  const handleResendEmail = async () => {
    await resendPasswordReset();
  };

  // Show confirmation screen if email was sent
  if (isEmailSent) {
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
          <div className="text-left mb-8">
            <h1 className="text-white text-xl font-normal">TradeFlow</h1>
          </div>

          {/* Email Sent Card */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
            {/* Success Icon */}
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            {/* Header */}
            <h2 className="text-2xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent">
                Check Your Email
              </span>
            </h2>

            <p className="text-gray-400 mb-6">
              We've sent password reset instructions to:
              <br />
              <span className="text-white font-medium">{userEmail}</span>
            </p>

            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
              <p className="text-green-300 text-sm">
                Click the link in your email to reset your password. The link will expire in 1 hour.
                You may need to check your spam folder.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleResendEmail}
                disabled={isLoading}
                className="w-full bg-gray-800 border border-gray-700 text-white font-medium py-3 px-4 rounded-lg hover:bg-gray-750 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Sending..." : "Resend Reset Email"}
              </button>

              <Link
                to="/login"
                className="block w-full bg-white text-black font-semibold py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors text-center"
              >
                Back to Login
              </Link>

              <button
                onClick={() => {
                  resetForm();
                  form.reset();
                }}
                className="w-full text-gray-400 hover:text-white transition-colors py-2"
              >
                Try Different Email
              </button>
            </div>

            {/* Additional Info */}
            <div className="mt-6 pt-6 border-t border-gray-700">
              <p className="text-xs text-gray-500">
                Didn't receive the email? Check your spam folder or try resending.
                <br />
                If you continue having issues, contact our support team.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
        <div className="text-left mb-8">
          <h1 className="text-white text-xl font-normal">TradeFlow</h1>
        </div>

        {/* Forgot Password Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent">
                Reset Password
              </span>
            </h2>
            <p className="text-gray-400 text-sm">Enter your email to receive reset instructions</p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              {/* Reset Button */}
              <Button
                type="submit"
                disabled={!isValid || isLoading}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? "Sending Reset Email..." : "Send Reset Email"}
              </Button>

              {/* Back to Login */}
              <div className="text-center mt-6">
                <Link 
                  to="/login" 
                  className="text-blue-400 text-sm hover:text-blue-300 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Login
                </Link>
              </div>

              {/* Help Text */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mt-6">
                <p className="text-blue-300 text-sm">
                  <strong>Remember your password?</strong> You can{" "}
                  <Link to="/login" className="text-blue-400 hover:text-blue-300 underline">
                    sign in here
                  </Link>
                </p>
                <p className="text-blue-300 text-sm mt-2">
                  <strong>Don't have an account?</strong>{" "}
                  <Link to="/signup" className="text-blue-400 hover:text-blue-300 underline">
                    Create one here
                  </Link>
                </p>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}