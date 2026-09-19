import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLock, FiMail } from 'react-icons/fi';
import { GiBabyBottle } from 'react-icons/gi';
import AnimatedEmoji from '../components/AnimatedEmoji';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@littlebloom.com' && password === 'admin123') {
      navigate('/admin/dashboard');
    } else {
      setError('❌ Invalid credentials. Use admin@littlebloom.com / admin123');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Floating emojis background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute top-20 left-10 text-4xl opacity-10">🔐</motion.div>
        <motion.div animate={{ y: [0, 15, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute bottom-20 right-20 text-3xl opacity-10">🛡️</motion.div>
        <motion.div animate={{ y: [0, -10, 0], x: [0, 10, 0] }} transition={{ duration: 6, repeat: Infinity }} className="absolute top-1/3 right-1/4 text-3xl opacity-10">⚙️</motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative"
      >
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <GiBabyBottle className="h-8 w-8 text-pink-500" />
            <span className="text-xl font-bold text-gray-900">
              Little<span className="text-pink-500">Bloom</span>
            </span>
          </motion.div>
          <AnimatedEmoji emoji="🔐" size="lg" animation="bounce" className="mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
            Admin Login <AnimatedEmoji emoji="👨‍💼" size="md" animation="wiggle" />
          </h1>
          <p className="text-gray-600 mt-1">Sign in to manage your store 🏪</p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl border-2 border-pink-100 p-8"
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border-2 border-red-200 text-red-700 text-sm rounded-xl p-3 mb-4"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="admin-email" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <span>📧</span> Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-pink-400" />
                <input
                  id="admin-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-sm transition-all"
                  placeholder="admin@littlebloom.com"
                />
              </div>
            </div>
            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <span>🔑</span> Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-pink-400" />
                <input
                  id="admin-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-sm transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold py-2.5 rounded-xl transition-all shadow-lg shadow-pink-200"
            >
              Sign In 🚀
            </motion.button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-4 flex items-center justify-center gap-1">
            <span>💡</span> Demo: admin@littlebloom.com / admin123
          </p>
        </motion.div>
      </motion.div>
    </main>
  );
}
