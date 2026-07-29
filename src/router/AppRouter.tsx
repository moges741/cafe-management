import { Routes, Route, useLocation } from 'react-router-dom';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import MenuPage from '@/pages/customer/MenuPage';
import ProductDetailPage from '@/pages/customer/ProductDetailPage';
import CartPage from '@/pages/customer/CartPage';
import CheckoutPage from '@/pages/customer/CheckoutPage';
import PaymentSuccessPage from '@/pages/customer/PaymentSuccessPage';
import OrderTrackingPage from '@/pages/customer/OrderTrackingPage';
import KitchenDisplayPage from '@/pages/kitchen/KitchenDisplayPage';
import KitchenLayout from '@/pages/kitchen/KitchenLayout';
import KitchenHistoryPage from '@/pages/kitchen/KitchenHistoryPage';
import CashierPosPage from '@/pages/cashier/CashierPosPage';
import WaiterLayout from '@/pages/waiter/WaiterLayout';
import WaiterIncomingOrdersPage from '@/pages/waiter/WaiterIncomingOrdersPage';
import WaiterHistoryPage from '@/pages/waiter/WaiterHistoryPage';
import WaiterNewOrderPage from '@/pages/waiter/WaiterNewOrderPage';
import BaristaPage from '@/pages/barista/BaristaPage';
import BaristaLayout from '@/pages/barista/BaristaLayout';
import BaristaMenuStatusPage from '@/pages/barista/BaristaMenuStatusPage';
import BaristaHistoryPage from '@/pages/barista/BaristaHistoryPage';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import AnalyticsPage from '@/pages/admin/AnalyticsPage';
import InventoryPage from '@/pages/admin/InventoryPage';
import CategoriesPage from '../pages/admin/CategoriesPage';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';
import { useAppSelector } from '@/app/hooks';
import ProductsPage from '@/pages/admin/ProductsPage';
import StaffPage from '@/pages/admin/StaffPage';
import ProductCreatePage from '@/pages/admin/ProductCreatePage';
import OrdersPage from '@/pages/admin/OrdersPage';
import BranchesPage from '@/pages/admin/BranchesPage';
import ProductEditPage from '@/pages/admin/ProductEditPage';
import VerifyEmailPage from '@/pages/auth/VerifyEmailPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage';
import GoogleCallbackPage from '@/pages/auth/GoogleCallbackPage';
import AboutSection from '@/components/home/AboutSection';
import GallerySection from '@/components/home/GallerySection';
import NotFoundPage from '@/pages/error/NotFoundPage';
import PremiumBurgerStory from '@/components/home/PremiumBurgerStory';
import PremiumPizzaExperience from '@/components/home/PremiumPizzaExperience';
import CulinaryGateway from '@/components/home/CulinaryGateway';
import Navbar from '@/components/layout/Navbar';
import HomePage from '@/components/home/HomePage';
import ContactPage from '@/components/home/ContactPage';
import HowItWorksPage from '@/components/home/HowItWorksPage';

import RawMaterialsPage from '@/pages/admin/RawMaterialsPage';
import MainStorePage from '@/pages/admin/MainStorePage';
import RecipeBuilderPage from '@/pages/admin/RecipeBuilderPage';
import KitchenInventoryPage from '@/pages/kitchen/KitchenInventoryPage';
import KitchenMenuStatusPage from '@/pages/kitchen/KitchenMenuStatusPage';
import WaiterMenuStatusPage from '@/pages/waiter/WaiterMenuStatusPage';

// RootRedirect: Now lets everyone access HomePage (/) freely. 
// Use specific dashboard links (e.g. /admin, /cashier) when they need their operational view.
const RootRedirect = () => {
  const { isInitializing } = useAppSelector((state) => state.auth);
  if (isInitializing) return null;
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
      </main>
    </>
  );
}