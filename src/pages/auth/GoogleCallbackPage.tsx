import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { authApi } from '@/features/auth/authApi';
import { useAppDispatch } from '@/app/hooks';
import { useSyncCartMutation } from '@/features/cart/cartApi';
import Spinner from '@/components/ui/Spinner';
import { getDashboardRouteForRole } from '@/features/auth/roleRoutes';

/**
 * Frontend redirect target after Google OAuth completes.
 * Includes mobile browser cookie settlement retry logic and URL error parsing.
 */
export default function GoogleCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const [syncCart] = useSyncCartMutation();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const handleCallback = async () => {
      // 1. Check for URL error parameters from Google OAuth
      const errorParam = searchParams.get('error') || searchParams.get('message');
      if (errorParam) {
        toast.error(`Google Sign-In Error: ${errorParam}`, {
          style: { background: '#1a1a1a', color: '#fff', border: '1px solid rgba(239, 68, 68, 0.4)' }
        });
        navigate('/login', { replace: true });
        return;
      }

      // 2. Sync guest cart (if any)
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

      // 3. Retry loop for mobile browser cookie settlement
      let user = null;
      let attempts = 0;
      const maxAttempts = 3;

      while (attempts < maxAttempts && !user) {
        attempts++;
        try {
          const result = await dispatch(
            authApi.endpoints.getMe.initiate(undefined, { forceRefetch: true })
          );
          if ('data' in result && result.data) {
            user = result.data;
            break;
          }
        } catch (_err) {}

        if (!user && attempts < maxAttempts) {
          // Short delay to allow mobile browsers (iOS Safari / Chrome Mobile) to settle httpOnly cookies after cross-domain redirect
          await new Promise((res) => setTimeout(res, 400));
        }
      }

      if (user) {
        toast.success('Signed in with Google successfully!', {
          icon: '🎉',
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid rgba(245, 158, 11, 0.2)',
          },
        });

        navigate(getDashboardRouteForRole(user.role), { replace: true });
      } else {
        toast.error('Authentication failed. Please try signing in again.');
        navigate('/login', { replace: true });
      }
    };

    handleCallback();
  }, [dispatch, navigate, searchParams, syncCart]);

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
