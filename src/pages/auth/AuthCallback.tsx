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
  const [hasProcessed, setHasProcessed] = useState(false);

  const type = searchParams.get('type');
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  // Check for recovery in both query params and hash
  const isRecovery = type === 'recovery' || window.location.hash.includes('type=recovery');

  useEffect(() => {
    // Prevent double execution
    if (hasProcessed) return;

    const handleAuthCallback = async () => {
      try {
        setHasProcessed(true);
        // Check for OAuth errors first
        if (error) {
          throw new Error(errorDescription || `OAuth error: ${error}`);
        }

        // Check URL hash for OAuth tokens or recovery tokens
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const hashType = hashParams.get('type');
        const hashError = hashParams.get('error');
        const hashErrorDescription = hashParams.get('error_description');

        if (hashError) {
          throw new Error(hashErrorDescription || 'Authentication failed');
        }

        // ✅ Handle password reset flow (recovery tokens in hash)
        if (hashType === 'recovery' && accessToken && refreshToken) {
          setMessage('Setting up password reset session...');

          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) throw sessionError;

          // Verify we have a valid session
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          if (userError) throw userError;
          if (!user) throw new Error('No user found for password reset');

          setStatus('success');
          setMessage('Redirecting to password reset...');

          // Clear the URL hash and redirect to reset password page
          window.history.replaceState(null, '', window.location.pathname);
          setTimeout(() => {
            navigate('/reset-password', { replace: true });
          }, 1500);
          return;
        }

        // ✅ Handle OAuth callback with tokens in hash (Google/GitHub success)
        if (accessToken && refreshToken) {
          setMessage('Setting up your session...');

          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) throw sessionError;

          await handleSuccessfulAuth();
          return;
        }

        // ✅ Handle OAuth callback with code parameter (PKCE flow)
        if (code && !window.location.hash) {
          setMessage('Completing OAuth sign in...');

          // For OAuth with code, let Supabase handle the code exchange automatically
          // The supabase client should automatically handle this via getSession()
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();

          if (sessionError) {
            console.error('Session error after OAuth:', sessionError);
            throw sessionError;
          }

          if (!session) {
            throw new Error('Failed to establish session after OAuth');
          }

          await handleSuccessfulAuth();
          return;
        }

        // ✅ Handle email confirmation or recovery with code (non-OAuth email flows)
        if (code && type && ['signup', 'recovery', 'invite'].includes(type)) {
          setMessage('Verifying your email...');

          // Exchange code for session
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            console.error('Code exchange error:', exchangeError);
            throw exchangeError;
          }

          // Get the new session
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          if (sessionError) throw sessionError;
          if (!session) throw new Error('Failed to establish session');

          await handleSuccessfulAuth(isRecovery);
          return;
        }

        // If we get here, no valid authentication method was found
        throw new Error('No valid authentication data found in URL');

      } catch (error: any) {
        console.error('Auth callback error:', error);
        setStatus('error');

        let errorMessage = 'Authentication failed. Please try again.';
        if (error.message.includes('already been confirmed')) {
          errorMessage = 'This email has already been confirmed. Please login.';
        } else if (error.message.includes('expired')) {
          errorMessage = 'This link has expired. Please request a new one.';
        } else if (error.message.includes('invalid')) {
          errorMessage = 'Invalid authentication link. Please request a new one.';
        } else if (error.message.includes('code verifier')) {
          errorMessage = 'Authentication session expired. Please try signing in again.';
        } else if (error.message) {
          errorMessage = error.message;
        }

        setMessage(errorMessage);
        setTimeout(() => navigate('/login', { replace: true }), 3000);
      }
    };

    const handleSuccessfulAuth = async (isRecoveryFlow = false) => {
      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('No user found');

      // Check if profile exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('id, avatar_url')
        .eq('id', user.id)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking profile:', checkError);
      }

      // Create profile if missing
      if (!existingProfile) {
        const userMetadata = user.user_metadata;
        const { error: insertError } = await supabase.from('profiles').insert([
          {
            id: user.id,
            username: user.email?.split('@')[0] || `user_${Date.now()}`,
            full_name: userMetadata.full_name || userMetadata.name || userMetadata.full_name || 'User',
            avatar_url: userMetadata.avatar_url || userMetadata.picture || userMetadata.avatar_url || null,
            university: userMetadata.college || userMetadata.university || '',
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
          // Don't throw here - we can still proceed with auth
        }
      } else if (!existingProfile.avatar_url && (user.user_metadata.avatar_url || user.user_metadata.picture)) {
        // ✅ Sync Google Avatar if missing in existing profile
        console.log("🔄 Syncing Google Avatar on Callback...");
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            avatar_url: user.user_metadata.avatar_url || user.user_metadata.picture,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);

        if (updateError) {
          console.error('Error syncing avatar on callback:', updateError);
        }
      }

      await initializeAuth();
      setStatus('success');

      if (isRecoveryFlow) {
        setMessage('Email verified! Redirecting to reset password...');
        // Clear the URL
        window.history.replaceState(null, '', window.location.pathname);
        setTimeout(() => {
          navigate('/reset-password', { replace: true });
        }, 1500);
      } else {
        setMessage('Successfully signed in!');
        // Clear the URL
        window.history.replaceState(null, '', window.location.pathname);
        setTimeout(() => navigate('/dashboard', { replace: true }), 1500);
      }
    };

    handleAuthCallback();
  }, [navigate, initializeAuth, isRecovery, code, type, error, errorDescription, hasProcessed]);

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
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isRecovery
                    ? 'Preparing password reset...'
                    : 'Please wait while we verify your credentials...'}
                </p>
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
                    : 'You will be redirected shortly...'}
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