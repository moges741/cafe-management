import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { authApi } from '@/features/auth/authApi';
import { useAppDispatch } from '@/app/hooks';
import { useSyncCartMutation } from '@/features/cart/cartApi';
import Spinner from '@/components/ui/Spinner';
import { getDashboardRouteForRole } from '@/features/auth/roleRoutes';

/**
 * This page is the frontend redirect target after Google OAuth completes.
 * The backend has already set the httpOnly cookies (access_token, refresh_token)
 * before redirecting here. We just need to fetch the current user and navigate.
 */
export default function GoogleCallbackPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [syncCart] = useSyncCartMutation();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const handleCallback = async () => {
      try {
        // Sync guest cart (if any)
        const localCartStr = localStorage.getItem('mr_cafe_cart');
        if (localCartStr) {
          try {
            const localCart = JSON.parse(localCartStr);
            if (localCart.items?.length > 0) {
              await syncCart(localCart.items).unwrap();
            }
          } catch (_e) {
            // Ignore cart sync errors
          }
        }

        // Fetch current user — cookies are already set by the backend
        const result = await dispatch(
          authApi.endpoints.getMe.initiate(undefined, { forceRefetch: true })
        );

        if ('data' in result && result.data) {
          const role = result.data.role;

          toast.success('Signed in with Google successfully!', {
            icon: '🎉',
            style: {
              background: '#1a1a1a',
              color: '#fff',
              border: '1px solid rgba(245, 158, 11, 0.2)',
            },
          });

          navigate(getDashboardRouteForRole(role), { replace: true });
        } else {
          toast.error('Authentication failed. Please try again.');
          navigate('/login', { replace: true });
        }
      } catch {
        toast.error('Google sign-in failed. Please try again.');
        navigate('/login', { replace: true });
      }
    };

    handleCallback();
  }, [dispatch, navigate, syncCart]);

  return (
    <div className="min-h-screen bg-[#050301] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-6"
      >
        {/* Google-colored spinner ring */}
        <div className="relative w-16 h-16">
          <Spinner size="lg" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-white">Signing you in...</h2>
          <p className="text-sm text-neutral-400">
            Completing Google authentication. Please wait a moment.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
