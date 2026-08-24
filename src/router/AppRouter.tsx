import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Navbar from '@/components/layout/Navbar';

// Core synchronous customer/public pages for fast first load
import HomePage from '@/components/home/HomePage';
import MenuPage from '@/pages/customer/MenuPage';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';

// Lazy-loaded routes for code-splitting heavy operational & admin features
const ProductDetailPage = lazy(() => import('@/pages/customer/ProductDetailPage'));
const CartPage = lazy(() => import('@/pages/customer/CartPage'));
const CheckoutPage = lazy(() => import('@/pages/customer/CheckoutPage'));
const PaymentSuccessPage = lazy(() => import('@/pages/customer/PaymentSuccessPage'));
const OrderTrackingPage = lazy(() => import('@/pages/customer/OrderTrackingPage'));
const CustomerDashboardPage = lazy(() => import('@/pages/customer/CustomerDashboardPage'));

const VerifyEmailPage = lazy(() => import('@/pages/auth/VerifyEmailPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'));
const GoogleCallbackPage = lazy(() => import('@/pages/auth/GoogleCallbackPage'));

const AboutSection = lazy(() => import('@/components/home/AboutSection'));
const GallerySection = lazy(() => import('@/components/home/GallerySection'));
const ContactPage = lazy(() => import('@/components/home/ContactPage'));
const HowItWorksPage = lazy(() => import('@/components/home/HowItWorksPage'));
const PremiumBurgerStory = lazy(() => import('@/components/home/PremiumBurgerStory'));
const PremiumPizzaExperience = lazy(() => import('@/components/home/PremiumPizzaExperience'));
const CulinaryGateway = lazy(() => import('@/components/home/CulinaryGateway'));
const NotFoundPage = lazy(() => import('@/pages/error/NotFoundPage'));

// Kitchen & Barista operational pages
const KitchenLayout = lazy(() => import('@/pages/kitchen/KitchenLayout'));
const KitchenDisplayPage = lazy(() => import('@/pages/kitchen/KitchenDisplayPage'));
const KitchenHistoryPage = lazy(() => import('@/pages/kitchen/KitchenHistoryPage'));
const KitchenInventoryPage = lazy(() => import('@/pages/kitchen/KitchenInventoryPage'));
const KitchenMenuStatusPage = lazy(() => import('@/pages/kitchen/KitchenMenuStatusPage'));

const CashierPosPage = lazy(() => import('@/pages/cashier/CashierPosPage'));

const WaiterLayout = lazy(() => import('@/pages/waiter/WaiterLayout'));
const WaiterIncomingOrdersPage = lazy(() => import('@/pages/waiter/WaiterIncomingOrdersPage'));
const WaiterHistoryPage = lazy(() => import('@/pages/waiter/WaiterHistoryPage'));
const WaiterNewOrderPage = lazy(() => import('@/pages/waiter/WaiterNewOrderPage'));
const WaiterMenuStatusPage = lazy(() => import('@/pages/waiter/WaiterMenuStatusPage'));

const BaristaLayout = lazy(() => import('@/pages/barista/BaristaLayout'));
const BaristaPage = lazy(() => import('@/pages/barista/BaristaPage'));
const BaristaHistoryPage = lazy(() => import('@/pages/barista/BaristaHistoryPage'));
const BaristaMenuStatusPage = lazy(() => import('@/pages/barista/BaristaMenuStatusPage'));

// Admin & Manager portal pages
const DashboardLayout = lazy(() => import('@/components/layout/DashboardLayout'));
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'));
const AnalyticsPage = lazy(() => import('@/pages/admin/AnalyticsPage'));
const InventoryPage = lazy(() => import('@/pages/admin/InventoryPage'));
const CategoriesPage = lazy(() => import('../pages/admin/CategoriesPage'));
const ProductsPage = lazy(() => import('@/pages/admin/ProductsPage'));
const StaffPage = lazy(() => import('@/pages/admin/StaffPage'));
const ProductCreatePage = lazy(() => import('@/pages/admin/ProductCreatePage'));
const OrdersPage = lazy(() => import('@/pages/admin/OrdersPage'));
const BranchesPage = lazy(() => import('@/pages/admin/BranchesPage'));
const ProductEditPage = lazy(() => import('@/pages/admin/ProductEditPage'));
const RawMaterialsPage = lazy(() => import('@/pages/admin/RawMaterialsPage'));
const MainStorePage = lazy(() => import('@/pages/admin/MainStorePage'));
const RecipeBuilderPage = lazy(() => import('@/pages/admin/RecipeBuilderPage'));

function RouteLoadingFallback() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-amber-500">
      <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mb-3" />
      <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 animate-pulse">
        Loading...
      </p>
    </div>
  );
}

const RootRedirect = () => {
  return <HomePage />;
};

export default function AppRouter() {
  const location = useLocation();
  const hideNavbarRoutes = ['/login', '/register'];
  const shouldHideNavbar = hideNavbarRoutes.some(route => location.pathname.startsWith(route));

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <main className={!shouldHideNavbar ? "pt-20 min-h-screen flex flex-col w-full" : "min-h-screen flex flex-col w-full"}>
        <Suspense fallback={<RouteLoadingFallback />}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
            <Route path="/" element={<RootRedirect />} />
            <Route path="/about" element={<AboutSection />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/gallery" element={<GallerySection />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/menu/:id" element={<ProductDetailPage />} />
            <Route path="/customer/dashboard" element={<ProtectedRoute allowedRoles={['customer']}><CustomerDashboardPage /></ProtectedRoute>} />
            <Route path="/customer" element={<ProtectedRoute allowedRoles={['customer']}><CustomerDashboardPage /></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
            <Route path="/payment/success" element={<ProtectedRoute><PaymentSuccessPage /></ProtectedRoute>} />
            <Route path="/order/:id/track" element={<ProtectedRoute><OrderTrackingPage /></ProtectedRoute>} />
            <Route path="preparing-burger" element={<PremiumBurgerStory />} />
            <Route path="preparing-pizza" element={<PremiumPizzaExperience />} />
            <Route path="experience-me" element={<CulinaryGateway />} />
            
            {/* Operational role routes */}
            <Route path="/kitchen" element={<ProtectedRoute allowedRoles={['kitchen', 'admin']}><KitchenLayout /></ProtectedRoute>}>
              <Route index element={<KitchenDisplayPage />} />
              <Route path="history" element={<KitchenHistoryPage />} />
              <Route path="inventory" element={<KitchenInventoryPage />} />
              <Route path="menu-status" element={<KitchenMenuStatusPage />} />
            </Route>
            <Route path="/cashier" element={<ProtectedRoute allowedRoles={['cashier', 'admin']}><CashierPosPage /></ProtectedRoute>} />
            <Route path="/waiter" element={<ProtectedRoute allowedRoles={['waiter', 'admin']}><WaiterLayout /></ProtectedRoute>}>
              <Route index element={<WaiterIncomingOrdersPage />} />
              <Route path="history" element={<WaiterHistoryPage />} />
              <Route path="new" element={<WaiterNewOrderPage />} />
              <Route path="menu-status" element={<WaiterMenuStatusPage />} />
            </Route>
            <Route path="/barista" element={<ProtectedRoute allowedRoles={['barista', 'admin']}><BaristaLayout /></ProtectedRoute>}>
              <Route index element={<BaristaPage />} />
              <Route path="history" element={<BaristaHistoryPage />} />
              <Route path="inventory" element={<KitchenInventoryPage />} />
              <Route path="menu-status" element={<BaristaMenuStatusPage />} />
            </Route>
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin', 'manager']}><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="inventory" element={<InventoryPage />} />
              <Route path="raw-materials" element={<RawMaterialsPage />} />
              <Route path="main-store" element={<MainStorePage />} />
              <Route path="recipes" element={<RecipeBuilderPage />} />
              <Route path="categories" element={<CategoriesPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="branches" element={<BranchesPage />} />
              <Route path="staff" element={<StaffPage />} />
              <Route path="products/new" element={<ProductCreatePage />} />
              <Route path="products/:id/edit" element={<ProductEditPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
    </>
  );
}