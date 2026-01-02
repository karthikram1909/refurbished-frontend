import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from '@/context/AppContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Toaster } from '@/components/ui/toaster';

import { LoginSelection } from '@/pages/auth/LoginSelection';
import { AdminLogin } from '@/pages/auth/AdminLogin';
import { ClientLogin } from '@/pages/auth/ClientLogin';

import { ClientLayout } from '@/layouts/ClientLayout';
import { ClientDashboard } from '@/pages/client/ClientDashboard';
import { PhoneListing } from '@/pages/client/PhoneListing';
import { PhoneDetails } from '@/pages/client/PhoneDetails';
import { Cart } from '@/pages/client/Cart';
import { OrderConfirmation } from '@/pages/client/OrderConfirmation';
import { MyOrders } from '@/pages/client/MyOrders';

import { AdminLayout } from '@/layouts/AdminLayout';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { ManagePhones } from '@/pages/admin/ManagePhones';
import { OrdersManagement } from '@/pages/admin/OrdersManagement';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginSelection />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/client/login" element={<ClientLogin />} />

          <Route
            path="/client"
            element={
              <ProtectedRoute requireAuth="client">
                <ClientLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/client/dashboard" replace />} />
            <Route path="dashboard" element={<ClientDashboard />} />
            <Route path="phones" element={<PhoneListing />} />
            <Route path="phone/:id" element={<PhoneDetails />} />
            <Route path="cart" element={<Cart />} />
            <Route path="order-confirmation/:orderId" element={<OrderConfirmation />} />
            <Route path="orders" element={<MyOrders />} />
          </Route>

          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAuth="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="phones" element={<ManagePhones />} />
            <Route path="orders" element={<OrdersManagement />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
