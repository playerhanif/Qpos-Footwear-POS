import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { BillingScreen } from './screens/BillingScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { PaymentScreen } from './screens/PaymentScreen';
import { InventoryScreen } from './screens/InventoryScreen';
import { ReportsScreen } from './screens/ReportsScreen';
import { SettingsScreen } from './screens/SettingsScreen';

import { AuthProvider } from './contexts/AuthContext';
import { LoginScreen } from './screens/LoginScreen';
import { ProtectedRoute } from './components/ProtectedRoute';
import { UserManagementScreen } from './screens/UserManagementScreen';
import { CustomerListScreen } from './screens/CustomerListScreen';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginScreen />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>

              {/* Intelligent Redirect based on Role */}
              <Route path="/" element={<RoleBasedRedirect />} />

              <Route path="/dashboard" element={<DashboardScreen />} />
              <Route path="/billing" element={<BillingScreen />} />

              {/* Admin Only Routes */}
              <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                <Route path="/inventory" element={<InventoryScreen />} />
                <Route path="/reports" element={<ReportsScreen />} />
                <Route path="/users" element={<UserManagementScreen />} />
                <Route path="/customers" element={<CustomerListScreen />} />
                <Route path="/settings" element={<SettingsScreen />} />
              </Route>
            </Route>

            {/* Fullscreen screens */}
            <Route path="/payment" element={<PaymentScreen />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

const RoleBasedRedirect = () => {
  const userString = localStorage.getItem('qpos-user');
  const user = userString ? JSON.parse(userString) : null;

  if (user && user.role === 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/billing" replace />;
};

export default App;
