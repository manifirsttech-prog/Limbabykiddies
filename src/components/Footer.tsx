import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GiBabyBottle } from 'react-icons/gi';
import { FiMail, FiPhone, FiMapPin, FiHeart } from 'react-icons/fi';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="flex items-center gap-2 mb-4">
              <GiBabyBottle className="h-7 w-7 text-pink-400" />
              <span className="text-lg font-bold text-white">
                Limbaby <span className="text-pink-400">kiddies</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Everything your little one needs, all in one place. Quality products for happy children and confident parents.
            </p>
            <div className="flex gap-3 mt-4">
              <motion.a
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                href="https://wa.me/2349048298906"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-green-400 hover:bg-green-900/30 transition-colors"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="h-4 w-4" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                href="#"
                className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-pink-400 hover:bg-pink-900/30 transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram className="h-4 w-4" />
              </motion.a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/products" className="text-sm hover:text-pink-400 transition-colors">Shop All</Link></li>
              <li><Link to="/about" className="text-sm hover:text-pink-400 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-sm hover:text-pink-400 transition-colors">Contact</Link></li>
              <li><Link to="/cart" className="text-sm hover:text-pink-400 transition-colors">My Cart</Link></li>
            </ul>
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><Link to="/products" className="text-sm hover:text-pink-400 transition-colors">Clothing</Link></li>
              <li><Link to="/products" className="text-sm hover:text-pink-400 transition-colors">Shoes</Link></li>
              <li><Link to="/products" className="text-sm hover:text-pink-400 transition-colors">Toys</Link></li>
              <li><Link to="/products" className="text-sm hover:text-pink-400 transition-colors">Baby Accessories</Link></li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm">
                <FiMail className="h-4 w-4 text-pink-400" />
                <span>adelekelollipop@gmail.com</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <FiPhone className="h-4 w-4 text-pink-400" />
                <span>+2349048298906</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <FiMapPin className="h-4 w-4 text-pink-400 mt-0.5" />
                <span>E-mail Opp., to Royal Pine Estate, Before Van Daniel's Street, Orchid Road, Lekki, Lagos State.</span>
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="border-t border-gray-800 mt-10 pt-6 text-center"
        >
          <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
            © {new Date().getFullYear()} Limbaby kiddies. All rights reserved. Made with
            <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <FiHeart className="inline text-pink-400 mx-1" />
            </motion.span>
            for little ones.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
