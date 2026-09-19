import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLock, FiMail } from 'react-icons/fi';
import { GiBabyBottle } from 'react-icons/gi';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@limbabykiddies.com' && password === 'admin123') {
      navigate('/admin/dashboard');
    } else {
      setError('Invalid credentials. Use admin@limbabykiddies.com / admin123');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <motion.div animate={{ rotate: [0, -5, 5, 0] }} transition={{ duration: 2, repeat: Infinity }} className="inline-flex items-center gap-2 mb-4">
            <GiBabyBottle className="h-8 w-8 text-pink-500" />
            <span className="text-xl font-bold text-gray-900">Little<span className="text-pink-500">Bloom</span></span>
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
          <p className="text-gray-600 mt-1">Sign in to manage your store</p>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl shadow-xl border-2 border-pink-100 p-8">
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 border-2 border-red-200 text-red-700 text-sm rounded-xl p-3 mb-4">
              {error}
            </motion.div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="admin-email" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <FiMail className="h-4 w-4 text-pink-500" /> Email Address
              </label>
              <input id="admin-email" type="email" required value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }} className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-sm transition-all" placeholder="admin@limbabykiddies.com" />
            </div>
            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <FiLock className="h-4 w-4 text-pink-500" /> Password
              </label>
              <input id="admin-password" type="password" required value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }} className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-sm transition-all" placeholder="••••••••" />
            </div>
            <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold py-2.5 rounded-xl transition-all shadow-lg shadow-pink-200">
              Sign In
            </motion.button>
          </form>
          <p className="text-xs text-gray-500 text-center mt-4">Demo: admin@limbabykiddies.com / admin123</p>
        </motion.div>
      </motion.div>
    </main>
  );
}
