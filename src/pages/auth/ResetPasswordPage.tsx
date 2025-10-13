import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, Eye, EyeOff, Mail, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useAppStore } from '../../store/useAppStore';
import { getTranslation } from '../../config/translations';
import Layout from '../../components/layout/Layout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

// Schema for forgot password
const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

// Schema for reset password
const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { resetPassword, updatePassword, isLoading } = useAuthStore();
  const { language } = useAppStore();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  
  const isResetMode = searchParams.get('code') !== null;

  // Forgot Password Form
  const {
    register: registerForgot,
    handleSubmit: handleForgotSubmit,
    formState: { errors: forgotErrors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  // Reset Password Form
  const {
    register: registerReset,
    handleSubmit: handleResetSubmit,
    formState: { errors: resetErrors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onForgotPasswordSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setError('');
      setSuccess('');
      await resetPassword(data.email);
      setEmailSent(true);
      setSuccess('Password reset instructions have been sent to your email.');
    } catch (error: any) {
      setError(error.message || 'Failed to send reset email. Please try again.');
    }
  };

  const onResetPasswordSubmit = async (data: ResetPasswordFormData) => {
    try {
      setError('');
      setSuccess('');
      await updatePassword(data.password);
      setSuccess('Password updated successfully! Redirecting to login...');
      
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 2000);
    } catch (error: any) {
      setError(error.message || 'Failed to update password. Please try again.');
    }
  };

  if (isResetMode) {
    // Reset Password Form
    return (
      <Layout>
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-md w-full space-y-8"
          >
            {/* Header */}
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Set New Password
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Enter your new password below
              </p>
            </div>

            {/* Reset Password Form */}
            <Card>
              <form onSubmit={handleResetSubmit(onResetPasswordSubmit)} className="space-y-6">
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <p className="text-sm text-green-600 dark:text-green-400 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {success}
                    </p>
                  </div>
                )}

                <Input
                  label="New Password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  leftIcon={<Lock className="w-5 h-5" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  }
                  error={resetErrors.password?.message}
                  {...registerReset('password')}
                />

                <Input
                  label="Confirm New Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  leftIcon={<Lock className="w-5 h-5" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  }
                  error={resetErrors.confirmPassword?.message}
                  {...registerReset('confirmPassword')}
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  isLoading={isLoading}
                >
                  Update Password
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Remember your password?{' '}
                  <Link
                    to="/login"
                    className="font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400"
                  >
                    Back to login
                  </Link>
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </Layout>
    );
  }

  // Forgot Password Form
  return (
    <Layout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full space-y-8"
        >
          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Forgot Password
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Enter your email address and we'll send you instructions to reset your password
            </p>
          </div>

          {/* Forgot Password Form */}
          <Card>
            <form onSubmit={handleForgotSubmit(onForgotPasswordSubmit)} className="space-y-6">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              {success && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <p className="text-sm text-green-600 dark:text-green-400 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {success}
                  </p>
                </div>
              )}

              {!emailSent ? (
                <>
                  <Input
                    label={getTranslation('emailAddress', language)}
                    type="email"
                    autoComplete="email"
                    leftIcon={<Mail className="w-5 h-5" />}
                    error={forgotErrors.email?.message}
                    {...registerForgot('email')}
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    isLoading={isLoading}
                  >
                    Send Reset Instructions
                  </Button>
                </>
              ) : (
                <div className="text-center space-y-4">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Check Your Email
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    We've sent password reset instructions to your email address.
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Didn't receive the email? Check your spam folder or{' '}
                    <button
                      type="button"
                      onClick={() => setEmailSent(false)}
                      className="text-purple-600 hover:text-purple-500 dark:text-purple-400 font-medium"
                    >
                      try again
                    </button>
                  </p>
                </div>
              )}
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Remember your password?{' '}
                <Link
                  to="/login"
                  className="font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400"
                >
                  Back to login
                </Link>
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default ResetPasswordPage;