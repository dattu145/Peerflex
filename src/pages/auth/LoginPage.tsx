import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Eye, EyeOff, Github } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useAppStore } from '../../store/useAppStore';
import { getTranslation } from '../../config/translations';
import Layout from '../../components/layout/Layout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, signInWithGoogle, signInWithGithub, isLoading } = useAuthStore();
  const { language } = useAppStore();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoginError('');
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (error: any) {
      setLoginError(error.message || 'Invalid email or password. Please try again.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoginError('');
      await signInWithGoogle();
    } catch (error: any) {
      setLoginError(error.message || 'Failed to sign in with Google.');
    }
  };

  const handleGithubLogin = async () => {
    try {
      setLoginError('');
      await signInWithGithub();
    } catch (error: any) {
      setLoginError(error.message || 'Failed to sign in with GitHub.');
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
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome Back
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Sign in to your account to continue building your professional future
            </p>
          </div>

          {/* Social Login Buttons */}
          <div className="flex justify-center items-center gap-4">
            <Button
              type="button"
              variant="outline"
              className="w-auto text-black dark:text-white flex items-center justify-center gap-3"
              onClick={handleGoogleLogin}
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
              onClick={handleGithubLogin}
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

          {/* Login Form */}
          <Card>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {loginError && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-sm text-red-600 dark:text-red-400">{loginError}</p>
                </div>
              )}

              <Input
                label={getTranslation('emailAddress', language)}
                type="email"
                autoComplete="email"
                leftIcon={<Mail className="w-5 h-5" />}
                error={errors.email?.message}
                {...register('email')}
              />

              <Input
                label={getTranslation('password', language)}
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
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

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 dark:border-gray-600 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={isLoading}
              >
                {getTranslation('login', language)}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400"
                >
                  {getTranslation('signup', language)}
                </Link>
              </p>
            </div>
          </Card>

          {/* Admin Login */}
          <div className="text-center">
            <Link
              to="/admin/login"
              className="inline-flex items-center text-sm text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400"
            >
              Admin Access
            </Link>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default LoginPage;