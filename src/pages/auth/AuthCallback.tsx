import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../../config/supabase';
import { useAuthStore } from '../../store/useAuthStore';
import Layout from '../../components/layout/Layout';
import { CheckCircle, XCircle, Loader, Key } from 'lucide-react';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { initializeAuth } = useAuthStore();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Completing authentication...');

  const type = searchParams.get('type');
  const code = searchParams.get('code');
  const isRecovery = type === 'recovery' || code === 'reset';

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check URL hash for OAuth tokens (Google/GitHub)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const error = hashParams.get('error');
        const errorDescription = hashParams.get('error_description');

        // Check for errors in the URL
        if (error) {
          throw new Error(errorDescription || 'Authentication failed');
        }

        // Handle OAuth callback with hash parameters
        if (accessToken && refreshToken) {
          setMessage('Setting up your session...');
          
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) {
            throw sessionError;
          }

          // Get user data
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          
          if (userError) throw userError;
          if (!user) throw new Error('No user found');

          // Check if profile exists
          const { data: existingProfile, error: checkError } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', user.id)
            .maybeSingle();

          if (checkError && checkError.code !== 'PGRST116') {
            console.error('Error checking profile:', checkError);
          }

          // Create profile if it doesn't exist
          if (!existingProfile) {
            const userMetadata = user.user_metadata;
            const { error: insertError } = await supabase.from('profiles').insert([
              {
                id: user.id,
                username: user.email?.split('@')[0] || `user_${Date.now()}`,
                full_name: userMetadata.full_name || userMetadata.name || 'User',
                avatar_url: userMetadata.avatar_url || userMetadata.picture || null,
                university: userMetadata.college || '',
                major: '',
                skills: [],
                interests: [],
                year_of_study: null,
                bio: null,
                current_location: null,
                privacy_settings: {
                  show_notes: true,
                  show_location: true,
                  show_online_status: true
                }
              }
            ]);

            if (insertError) {
              console.error('Profile creation error:', insertError);
              // Don't throw - continue even if profile creation fails
            } else {
              console.log('Profile created successfully for OAuth user');
            }
          }

          await initializeAuth();

          setStatus('success');
          setMessage('Successfully signed in!');

          setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, 1500);
        } 
        // Handle email confirmation or password recovery
        else {
          setMessage('Verifying your email...');

          // Get the current session
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            throw sessionError;
          }

          if (!session) {
            // Try to exchange the code for a session
            const code = searchParams.get('code');
            if (code) {
              const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
              if (exchangeError) throw exchangeError;
            } else {
              throw new Error('No active session found. Please try logging in again.');
            }
          }

          // Re-check session after exchange
          const { data: { session: newSession }, error: newSessionError } = await supabase.auth.getSession();
          
          if (newSessionError) throw newSessionError;
          if (!newSession) {
            throw new Error('Failed to establish session');
          }

          // Check if profile exists
          const { data: existingProfile, error: checkError } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', newSession.user.id)
            .maybeSingle();

          if (checkError && checkError.code !== 'PGRST116') {
            console.error('Error checking profile:', checkError);
          }

          // Create profile for email-confirmed users if it doesn't exist
          if (!existingProfile) {
            const userMetadata = newSession.user.user_metadata;
            
            const profileData = {
              id: newSession.user.id,
              username: newSession.user.email?.split('@')[0] || `user_${Date.now()}`,
              full_name: userMetadata.full_name || userMetadata.name || 'User',
              avatar_url: null,
              university: userMetadata.college || '',
              major: '',
              skills: [],
              interests: [],
              year_of_study: null,
              bio: null,
              current_location: null,
              privacy_settings: {
                show_notes: true,
                show_location: true,
                show_online_status: true
              }
            };

            console.log('Creating profile with data:', profileData);

            const { error: insertError } = await supabase
              .from('profiles')
              .insert([profileData]);

            if (insertError) {
              console.error('Profile creation error:', insertError);
              // Don't throw - continue even if profile creation fails
            } else {
              console.log('Profile created successfully for email user');
            }
          }

          await initializeAuth();

          if (isRecovery) {
            // Password reset flow
            setStatus('success');
            setMessage('Email verified! Set your new password...');
            
            setTimeout(() => {
              navigate('/reset-password?code=reset', { replace: true });
            }, 1500);
          } else {
            // Email confirmation flow
            setStatus('success');
            setMessage('Email confirmed! Redirecting to dashboard...');

            setTimeout(() => {
              navigate('/dashboard', { replace: true });
            }, 2000);
          }
        }
      } catch (error: any) {
        console.error('Auth callback error:', error);
        setStatus('error');
        
        let errorMessage = 'Authentication failed. Please try again.';
        
        if (error.message.includes('already been confirmed')) {
          errorMessage = 'This email has already been confirmed. Please login.';
        } else if (error.message.includes('expired')) {
          errorMessage = 'This link has expired. Please request a new one.';
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        setMessage(errorMessage);
        
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [navigate, initializeAuth, isRecovery, searchParams]);

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            {status === 'loading' && (
              <div className="flex flex-col items-center space-y-4">
                {isRecovery ? (
                  <Key className="h-12 w-12 text-purple-600 animate-pulse" />
                ) : (
                  <Loader className="h-12 w-12 text-purple-600 animate-spin" />
                )}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {message}
                </h3>
                {isRecovery ? (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Preparing password reset...
                  </p>
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Please wait while we verify your credentials...
                  </p>
                )}
              </div>
            )}

            {status === 'success' && (
              <div className="flex flex-col items-center space-y-4">
                <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3">
                  <CheckCircle className="h-12 w-12 text-green-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {message}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isRecovery 
                    ? 'Redirecting to password reset...' 
                    : 'You will be redirected shortly...'
                  }
                </p>
              </div>
            )}

            {status === 'error' && (
              <div className="flex flex-col items-center space-y-4">
                <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-3">
                  <XCircle className="h-12 w-12 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Authentication Failed
                </h3>
                <p className="text-sm text-red-600 dark:text-red-400">
                  {message}
                </p>
                <button
                  onClick={() => navigate('/login')}
                  className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Go to Login
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default AuthCallback;