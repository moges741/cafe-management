import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { authApi } from '@/features/auth/authApi';
import { useAppDispatch } from '@/app/hooks';
import { useSyncCartMutation } from '@/features/cart/cartApi';
import Spinner from '@/components/ui/Spinner';
import { getDashboardRouteForRole } from '@/features/auth/roleRoutes';
import { setUser as setAuthUser } from '@/features/auth/authSlice';

function parseJwt(token: string): { sub: string; email: string; role: any } | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

/**
 * Frontend redirect target after Google OAuth completes.
 * Fully compatible with privacy-focused browsers (Brave Shields, Safari ITP, iOS WebKit).
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

      // 2. Extract tokens from URL query OR hash fragment (handles Brave tracking protection)
      const hashParams = typeof window !== 'undefined'
        ? new URLSearchParams(window.location.hash.replace(/^#/, ''))
        : null;

      const tokenFromUrl = searchParams.get('token') || hashParams?.get('token');
      const refreshTokenFromUrl = searchParams.get('refreshToken') || hashParams?.get('refreshToken');

      if (tokenFromUrl) {
        localStorage.setItem('access_token', tokenFromUrl);
      }
      if (refreshTokenFromUrl) {
        localStorage.setItem('refresh_token', refreshTokenFromUrl);
      }

      // 3. Sync guest cart (if any)
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

      // 4. Resolve authenticated user:
      // If token is present from URL/hash (Brave Shields / Safari ITP / mobile), decode user immediately
      let user = null;

      if (tokenFromUrl) {
        const decoded = parseJwt(tokenFromUrl);
        if (decoded && decoded.sub) {
          user = {
            id: decoded.sub,
            email: decoded.email,
            role: decoded.role || 'customer',
          };
          dispatch(setAuthUser(user as any));
        }
      }

      // Fallback: If no token in URL/hash, try resolving user via HttpOnly cookies
      if (!user) {
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
              dispatch(setAuthUser(user as any));
              break;
            }
          } catch (_err) {}

          if (!user && attempts < maxAttempts) {
            await new Promise((res) => setTimeout(res, 350));
          }
        }
      }

      if (user) {
        dispatch(setAuthUser(user as any));

        toast.success('Signed in with Google successfully!', {
          icon: '🎉',
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid rgba(245, 158, 11, 0.2)',
          },
        });

        const targetRoute = getDashboardRouteForRole(user.role);
        navigate(targetRoute, { replace: true });
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
