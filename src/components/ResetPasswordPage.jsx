"use client"

import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, KeyRound, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FloatingLabel } from '@/components/FloatingLabel';
import { AuthCard } from '@/cards/AuthCard';
import { useResetPasswordMutation } from '@/app/api/authApiSlice';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [resetPassword, { isLoading, isSuccess, error }] = useResetPasswordMutation();

  const validate = () => {
    const newErrors = {};
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    try {
        console.log(token)
      await resetPassword({ token, password }).unwrap();
    } catch (err) {
      console.error('Failed to reset password:', err);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AuthCard title="Invalid Link" subtitle="This password reset link is invalid or has expired.">
            <Button onClick={() => navigate('/login')} className="w-full">Back to Login</Button>
        </AuthCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AuthCard title="Create New Password" subtitle="Your new password must be different from previous ones.">
          <form onSubmit={handleSubmit} className="space-y-6">
            {isSuccess ? (
              <div className="text-center">
                <p className="text-green-600 font-medium">Password has been reset successfully!</p>
                <Button onClick={() => navigate('/login')} className="w-full mt-4">Proceed to Login</Button>
              </div>
            ) : (
              <>
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center text-sm">
                        {error.data?.message || 'Failed to reset password. The link may be expired.'}
                    </div>
                )}
                <div className="relative">
                  <FloatingLabel label="New Password" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} icon={Lock} type={showPassword ? 'text' : 'password'} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><Eye className="w-5 h-5" /></button>
                </div>
                <FloatingLabel label="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} error={errors.confirmPassword} icon={KeyRound} type={showPassword ? 'text' : 'password'} />
                <Button type="submit" disabled={isLoading} className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium">
                  {isLoading ? 'Resetting Password...' : 'Reset Password'}
                </Button>
              </>
            )}
          </form>
           <div className="mt-8 text-center">
                <button onClick={() => navigate('/login')} className="flex items-center justify-center w-full text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200 group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                    Back to Sign In
                </button>
           </div>
        </AuthCard>
      </div>
    </div>
  );
};

export default ResetPasswordPage;