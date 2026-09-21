import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useEffect } from 'react';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
            <Route path="/products" element={<PublicLayout><ProductsPage /></PublicLayout>} />
            <Route path="/products/:slug" element={<PublicLayout><ProductDetailPage /></PublicLayout>} />
            <Route path="/cart" element={<PublicLayout><CartPage /></PublicLayout>} />
            <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
            <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
            <Route path="/admin/dashboard/orders" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
            <Route path="/admin/dashboard/products" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
