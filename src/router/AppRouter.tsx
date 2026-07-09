import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import MenuPage from '@/pages/customer/MenuPage'
import KitchenDisplayPage from '@/pages/kitchen/KitchenDisplayPage'
import CashierPosPage from '@/pages/cashier/CashierPosPage'
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage'
import ProtectedRoute from './ProtectedRoute'
import ProductDetailPage from '@/pages/customer/ProductDetailPage'
import CartPage from '@/pages/customer/CartPage'
import CheckoutPage from '@/pages/customer/CheckoutPage'
import PaymentSuccessPage from '@/pages/customer/PaymentSuccessPage'
import OrderTrackingPage from '@/pages/customer/OrderTrackingPage'
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Customer — any logged-in or guest user can browse the menu */}
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/" element={<MenuPage />} />

        <Route path="/kitchen" element={
          <ProtectedRoute allowedRoles={['kitchen', 'admin']}>
            <KitchenDisplayPage />
          </ProtectedRoute>
        } />

        <Route path="/cashier" element={
          <ProtectedRoute allowedRoles={['cashier', 'admin']}>
            <CashierPosPage />
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin', 'manager']}>
            <AdminDashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/menu/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/payment/success" element={<PaymentSuccessPage />} />
        <Route path="/order/:id/track" element={<OrderTrackingPage />} />
        
      </Routes>
    </BrowserRouter>
  )
}