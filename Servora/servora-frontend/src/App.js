import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import TechnicianDashboard from './pages/technician/TechnicianDashboard';
import CustomerRequest from './pages/customer/CustomerRequest';
import CustomerTrack from './pages/customer/CustomerTrack';
import CustomerChat from './pages/customer/CustomerChat';

// Protected Route — role check karega
function ProtectedRoute({ children, allowedRole }) {
  const { token, role } = useAuth();
  if (!token) return <Navigate to="/login" />;
  if (allowedRole && role !== allowedRole) return <Navigate to="/login" />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/customer/request" element={<CustomerRequest />} />
          <Route path="/customer/track" element={<CustomerTrack />} />
          <Route path="/customer/chat" element={<CustomerChat />} />

          {/* Admin Routes */}
          <Route path="/admin/*" element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* Technician Routes */}
          <Route path="/technician/*" element={
            <ProtectedRoute allowedRole="TECHNICIAN">
              <TechnicianDashboard />
            </ProtectedRoute>
          } />

          {/* Default */}
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;