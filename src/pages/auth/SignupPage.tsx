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
  Brain,
  Gift
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
  referralCode: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuthStore();
  const { language } = useAppStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signupError, setSignupError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const referralCode = watch('referralCode');

  const onSubmit = async (data: SignupFormData) => {
    try {
      setSignupError('');
      const { confirmPassword, ...signupData } = data;
      await signup(signupData);
      navigate('/dashboard');
    } catch (error) {
      setSignupError('Failed to create account. Please try again.');
    }
  };

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
            {/* <Link to="/" className="inline-flex items-center justify-center space-x-2 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600">
                <GraduationCap className="h-7 w-7 text-white" />
              </div>
              <span className="text-2xl font-bold bg-purple-600 bg-clip-text text-transparent">
                CampusPro
              </span>
            </Link> */}
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Create Your Account
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Join thousands of students and professionals building their careers
            </p>
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

              {/* Referral Code */}
              <Input
                label={getTranslation('referralCode', language)}
                type="text"
                placeholder="Enter referral code to get ₹20 discount"
                leftIcon={<Gift className="w-5 h-5" />}
                error={errors.referralCode?.message}
                {...register('referralCode')}
              />

              {referralCode && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <p className="text-sm text-green-600 dark:text-green-400 flex items-center">
                    <Gift className="w-4 h-4 mr-2" />
                    You'll get ₹20 discount on your first order!
                  </p>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={isLoading}
              >
                Create Account
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