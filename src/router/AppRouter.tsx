import { Routes, Route, Navigate } from 'react-router-dom';
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
import AboutSection from '@/components/home/AboutSection';
import GallerySection from '@/components/home/GallerySection';
import NotFoundPage from '@/pages/error/NotFoundPage';
import PremiumBurgerStory from '@/components/home/PremiumBurgerStory';
import PremiumPizzaExperience from '@/components/home/PremiumPizzaExperience';
import CulinaryGateway from '@/components/home/CulinaryGateway';
import Navbar from '@/components/layout/Navbar';

// RootRedirect: send authenticated staff to their dashboard, guests to Login
const RootRedirect = () => {
  const { user, isAuthenticated, isInitializing } = useAppSelector((state) => state.auth);
  if (isInitializing) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  switch (user?.role) {
    case 'admin':
    case 'manager':
      return <Navigate to="/admin" replace />;
    case 'kitchen':
      return <Navigate to="/kitchen" replace />;
    case 'cashier':
      return <Navigate to="/cashier" replace />;
    case 'waiter':
      return <Navigate to="/waiter" replace />;
    case 'barista':
      return <Navigate to="/barista" replace />;
    default:
      return <Navigate to="/menu" replace />;
  }
};

export default function AppRouter() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/" element={<RootRedirect />} />
        <Route path="/about" element={<AboutSection />} />
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
        </Route>
        <Route path="/cashier" element={<ProtectedRoute allowedRoles={['cashier', 'admin']}><CashierPosPage /></ProtectedRoute>} />
        <Route path="/waiter" element={<ProtectedRoute allowedRoles={['waiter', 'admin']}><WaiterLayout /></ProtectedRoute>}>
          <Route index element={<WaiterIncomingOrdersPage />} />
          <Route path="history" element={<WaiterHistoryPage />} />
          <Route path="new" element={<WaiterNewOrderPage />} />
        </Route>
        <Route path="/barista" element={<ProtectedRoute allowedRoles={['barista', 'admin']}><BaristaPage /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin', 'manager']}><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="inventory" element={<InventoryPage />} />
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
    </>
  );
}