import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { QueryProvider } from './contexts/QueryProvider';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ClientsPage from './pages/admin/ClientsPage';
import ProductsPage from './pages/admin/ProductsPage';
import OrdersPage from './pages/admin/OrdersPage';
import LivreursPage from './pages/admin/LivreursPage';
import LivreurLayout from './components/livreur/LivreurLayout';
import LivreurDashboard from './pages/livreur/LivreurDashboard';
import './App.css';

function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Route publique */}
              <Route path="/login" element={<LoginPage />} />
              
              {/* Redirection de la racine */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              
              {/* Routes Admin */}
              <Route path="/admin" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<AdminDashboard />} />
                <Route path="clients" element={<ClientsPage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="orders" element={<OrdersPage />} />
                <Route path="livreurs" element={<LivreursPage />} />
              </Route>
              
              {/* Routes Livreur */}
              <Route path="/livreur" element={
                <ProtectedRoute requiredRole="livreur">
                  <LivreurLayout />
                </ProtectedRoute>
              }>
                <Route index element={<LivreurDashboard />} />
                <Route path="deliveries" element={<LivreurDashboard />} />
              </Route>
              
              {/* Route 404 */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </QueryProvider>
  );
}

export default App;

