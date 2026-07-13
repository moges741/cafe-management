import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import MenuPage from '@/pages/customer/MenuPage'
import ProductDetailPage from '@/pages/customer/ProductDetailPage'
import CartPage from '@/pages/customer/CartPage'
import CheckoutPage from '@/pages/customer/CheckoutPage'
import PaymentSuccessPage from '@/pages/customer/PaymentSuccessPage'
import OrderTrackingPage from '@/pages/customer/OrderTrackingPage'
import KitchenDisplayPage from '@/pages/kitchen/KitchenDisplayPage'
import CashierPosPage from '@/pages/cashier/CashierPosPage'
import WaiterPage from '@/pages/waiter/WaiterPage'
import BaristaPage from '@/pages/barista/BaristaPage'
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage'
import AnalyticsPage from '@/pages/admin/AnalyticsPage'
import InventoryPage from '@/pages/admin/InventoryPage'
import DashboardLayout from '@/components/layout/DashboardLayout'
import ProtectedRoute from './ProtectedRoute'

export default function AppRouter() {
  return (
   
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/" element={<MenuPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/menu/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/payment/success" element={<PaymentSuccessPage />} />
        <Route path="/order/:id/track" element={<OrderTrackingPage />} />

        {/* Single-page roles — no sidebar needed, full-screen operational views */}
        <Route path="/kitchen" element={
          <ProtectedRoute allowedRoles={['kitchen', 'admin']}><KitchenDisplayPage /></ProtectedRoute>
        } />
        <Route path="/cashier" element={
          <ProtectedRoute allowedRoles={['cashier', 'admin']}><CashierPosPage /></ProtectedRoute>
        } />
        <Route path="/waiter" element={
          <ProtectedRoute allowedRoles={['waiter', 'admin']}><WaiterPage /></ProtectedRoute>
        } />
        <Route path="/barista" element={
          <ProtectedRoute allowedRoles={['barista', 'admin']}><BaristaPage /></ProtectedRoute>
        } />

        {/* Admin/manager — sidebar shell with nested pages */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin', 'manager']}><DashboardLayout /></ProtectedRoute>
        }>
          <Route index element={<AdminDashboardPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="inventory" element={<InventoryPage />} />
        </Route>
      </Routes>
   
  )
}