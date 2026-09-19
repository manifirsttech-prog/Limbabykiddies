import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Baby, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { totalItems } = useCart();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Shop' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Baby className="h-8 w-8 text-pink-500" />
            <span className="text-xl font-bold text-gray-900">
              Little<span className="text-pink-500">Bloom</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-pink-500 ${
                  isActive(link.path) ? 'text-pink-500' : 'text-gray-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <Link to="/products" className="hidden sm:block text-gray-600 hover:text-pink-500 transition-colors">
              <Search className="h-5 w-5" />
            </Link>
            <Link to="/cart" className="relative text-gray-600 hover:text-pink-500 transition-colors">
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              className="md:hidden text-gray-600"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-100 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block py-2 text-sm font-medium transition-colors hover:text-pink-500 ${
                  isActive(link.path) ? 'text-pink-500' : 'text-gray-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
