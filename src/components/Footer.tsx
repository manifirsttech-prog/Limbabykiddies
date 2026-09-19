import { Link } from 'react-router-dom';
import { Baby, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Baby className="h-7 w-7 text-pink-400" />
              <span className="text-lg font-bold text-white">
                Little<span className="text-pink-400">Bloom</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Everything your little one needs, all in one place. Quality products for happy children and confident parents.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/products" className="text-sm hover:text-pink-400 transition-colors">Shop All</Link></li>
              <li><Link to="/about" className="text-sm hover:text-pink-400 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-sm hover:text-pink-400 transition-colors">Contact</Link></li>
              <li><Link to="/cart" className="text-sm hover:text-pink-400 transition-colors">My Cart</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><Link to="/products" className="text-sm hover:text-pink-400 transition-colors">Clothing</Link></li>
              <li><Link to="/products" className="text-sm hover:text-pink-400 transition-colors">Shoes</Link></li>
              <li><Link to="/products" className="text-sm hover:text-pink-400 transition-colors">Toys</Link></li>
              <li><Link to="/products" className="text-sm hover:text-pink-400 transition-colors">Baby Accessories</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-pink-400" />
                <span>hello@littlebloom.com</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-pink-400" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-pink-400" />
                <span>123 Kids Lane, Happy Town</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} LittleBloom. All rights reserved. Made with love for little ones.
          </p>
        </div>
      </div>
    </footer>
  );
}
