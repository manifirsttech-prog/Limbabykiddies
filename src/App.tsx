import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
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
import { useEffect } from 'react';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Layout for public pages
function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

// Update document title based on route
function DocumentTitle() {
  const { pathname } = useLocation();
  useEffect(() => {
    const titles: Record<string, string> = {
      '/': 'LittleBloom — Baby & Kids Products | Little Things, Big Smiles',
      '/products': 'Shop Baby & Kids Products | LittleBloom',
      '/cart': 'Shopping Cart | LittleBloom',
      '/about': 'About Us | LittleBloom — Our Story & Mission',
      '/contact': 'Contact Us | LittleBloom — Get in Touch',
      '/admin/login': 'Admin Login | LittleBloom',
      '/admin/dashboard': 'Admin Dashboard | LittleBloom',
      '/admin/dashboard/orders': 'Order Management | LittleBloom Admin',
      '/admin/dashboard/products': 'Product Management | LittleBloom Admin',
    };
    document.title = titles[pathname] || 'LittleBloom — Baby & Kids Products';
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <ScrollToTop />
        <DocumentTitle />
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
          <Route path="/products" element={<PublicLayout><ProductsPage /></PublicLayout>} />
          <Route path="/products/:slug" element={<PublicLayout><ProductDetailPage /></PublicLayout>} />
          <Route path="/cart" element={<PublicLayout><CartPage /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />

          {/* Admin Pages (no navbar/footer) */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/dashboard/orders" element={<AdminDashboardPage />} />
          <Route path="/admin/dashboard/products" element={<AdminDashboardPage />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}
