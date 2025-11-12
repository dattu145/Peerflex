import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  MapPin,
  GraduationCap,
  Github,
  CheckCircle,
  Loader
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useAppStore } from '../../store/useAppStore';
import { getTranslation } from '../../config/translations';
import Layout from '../../components/layout/Layout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  confirmPassword: z.string(),
  college: z.string().min(2, 'College name must be at least 2 characters long'),
  city: z.string().min(2, 'City name must be at least 2 characters long'),
  role: z.enum(['student', 'professional'], {
    required_error: 'Please select your role',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup, signInWithGoogle, signInWithGithub, isLoading, resendConfirmationEmail } = useAuthStore();
  const { language } = useAppStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signupError, setSignupError] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      setSignupError('');
      setUserEmail(data.email);
      const { confirmPassword, ...signupData } = data;
      await signup(signupData);
      
      // Show email confirmation message ONLY if no error was thrown
      setEmailSent(true);
    } catch (error: any) {
      console.error('Signup error:', error);
      // Check if this is the "email already exists" error
      if (error.message?.includes('email already exists try logging in')) {
        setSignupError('Email already exists. Please try logging in.');
      } else {
        setSignupError(error.message || 'Failed to create account. Please try again.');
      }
    }
  };

  const handleResendEmail = async () => {
    try {
      setSignupError('');
      await resendConfirmationEmail(userEmail);
      alert('Confirmation email resent! Please check your inbox.');
    } catch (error: any) {
      setSignupError(error.message || 'Failed to resend email.');
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setSignupError('');
      await signInWithGoogle();
    } catch (error: any) {
      setSignupError(error.message || 'Failed to sign up with Google.');
    }
  };

  const handleGithubSignup = async () => {
    try {
      setSignupError('');
      await signInWithGithub();
    } catch (error: any) {
      setSignupError(error.message || 'Failed to sign up with GitHub.');
    }
  };

  // Show email confirmation screen after successful signup
  if (emailSent) {
    return (
      <Layout>
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-md w-full"
          >
            <Card>
              <div className="text-center space-y-6 p-6">
                <div className="flex justify-center">
                  <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3">
                    <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Check Your Email
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    We've sent a confirmation email to
                  </p>
                  <p className="text-purple-600 dark:text-purple-400 font-semibold mt-1">
                    {userEmail}
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    Click the confirmation link in the email to activate your account and complete the signup process.
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Didn't receive the email?
                  </p>
                  <div className="flex flex-col gap-2 text-sm">
                    <button
                      onClick={handleResendEmail}
                      disabled={isLoading}
                      className="text-purple-600 hover:text-purple-500 dark:text-purple-400 font-medium"
                    >
                      {isLoading ? 'Sending...' : 'Resend confirmation email'}
                    </button>
                    <p className="text-gray-500 dark:text-gray-400">
                      or check your spam folder
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Link
                    to="/login"
                    className="text-sm text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400"
                  >
                    Back to login
                  </Link>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </Layout>
    );
  }

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
              Create Your Account
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Join thousands of students and professionals building their careers
            </p>
          </div>

          {/* Social Signup Buttons */}
          <div className="flex justify-center items-center gap-4">
            <Button
              type="button"
              variant="outline"
              className="w-auto transition duration-300 delay-100 text-black dark:text-white flex items-center justify-center gap-3"
              onClick={handleGoogleSignup}
              disabled={isLoading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-auto text-black dark:text-white flex items-center justify-center gap-3"
              onClick={handleGithubSignup}
              disabled={isLoading}
            >
              <Github className="w-5 h-5" />
              Github
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or continue with email</span>
            </div>
          </div>

          {/* Signup Form */}
          <Card>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {signupError && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-sm text-red-600 dark:text-red-400">{signupError}</p>
                </div>
              )}

              <Input
                label={getTranslation('fullName', language)}
                type="text"
                autoComplete="name"
                leftIcon={<User className="w-5 h-5" />}
                error={errors.name?.message}
                {...register('name')}
              />

              <Input
                label={getTranslation('emailAddress', language)}
                type="email"
                autoComplete="email"
                leftIcon={<Mail className="w-5 h-5" />}
                error={errors.email?.message}
                {...register('email')}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label={getTranslation('password', language)}
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
                  error={errors.password?.message}
                  {...register('password')}
                />

                <Input
                  label={getTranslation('confirmPassword', language)}
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
                  error={errors.confirmPassword?.message}
                  {...register('confirmPassword')}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label={getTranslation('collegeName', language)}
                  type="text"
                  leftIcon={<GraduationCap className="w-5 h-5" />}
                  error={errors.college?.message}
                  {...register('college')}
                />

                <Input
                  label={getTranslation('cityName', language)}
                  type="text"
                  leftIcon={<MapPin className="w-5 h-5" />}
                  error={errors.city?.message}
                  {...register('city')}
                />
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {getTranslation('selectRole', language)}
                </label>
                <div className="grid grid-cols-2 gap-4 text-gray-600 dark:text-gray-300">
                  <label className="relative">
                    <input
                      type="radio"
                      value="student"
                      {...register('role')}
                      className="peer sr-only"
                    />
                    <div className="flex items-center justify-center p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer peer-checked:border-purple-500 peer-checked:bg-purple-50 dark:peer-checked:bg-purple-900/20">
                      <GraduationCap className="w-5 h-5 mr-2 text-purple-600" />
                      <span className="font-medium">{getTranslation('student', language)}</span>
                    </div>
                  </label>
                  <label className="relative">
                    <input
                      type="radio"
                      value="professional"
                      {...register('role')}
                      className="peer sr-only"
                    />
                    <div className="flex items-center justify-center p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer peer-checked:border-purple-500 peer-checked:bg-purple-50 dark:peer-checked:bg-purple-900/20">
                      <User className="w-5 h-5 mr-2 text-purple-600" />
                      <span className="font-medium">{getTranslation('professional', language)}</span>
                    </div>
                  </label>
                </div>
                {errors.role && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.role.message}</p>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                    Creating Account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </Button>

              <div className="text-xs text-gray-500 dark:text-gray-400">
                By creating an account, you agree to our{' '}
                <Link to="/terms" className="text-purple-600 hover:text-purple-500">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-purple-600 hover:text-purple-500">
                  Privacy Policy
                </Link>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400"
                >
                  {getTranslation('login', language)}
                </Link>
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default SignupPage;