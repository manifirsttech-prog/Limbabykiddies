import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLock, FiMail } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email address.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address format.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again later.');
      } else if (err.code === 'auth/invalid-credential') {
        setError('Invalid credentials. Please check your email and password.');
      } else {
        setError('Failed to sign in. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <motion.div animate={{ rotate: [0, -5, 5, 0] }} transition={{ duration: 2, repeat: Infinity }} className="inline-flex items-center gap-2 mb-4">
            <img src="/logo.png" alt="Limbaby Kiddies Logo" className="h-10 w-10 object-contain rounded-full border-2 border-pink-300 shadow-sm" />
            <span className="text-xl font-bold text-gray-900">Limbaby <span className="text-pink-500">kiddies</span></span>
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
              <input 
                id="admin-email" 
                type="email" 
                required 
                value={email} 
                onChange={(e) => { setEmail(e.target.value); setError(''); }} 
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-sm transition-all" 
                placeholder="admin@example.com"
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <FiLock className="h-4 w-4 text-pink-500" /> Password
              </label>
              <input 
                id="admin-password" 
                type="password" 
                required 
                value={password} 
                onChange={(e) => { setPassword(e.target.value); setError(''); }} 
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-sm transition-all" 
                placeholder="••••••••"
                disabled={loading}
              />
            </div>
            <motion.button 
              type="submit" 
              whileHover={{ scale: loading ? 1 : 1.02 }} 
              whileTap={{ scale: loading ? 1 : 0.98 }} 
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold py-2.5 rounded-xl transition-all shadow-lg shadow-pink-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </motion.button>
          </form>
          <p className="text-xs text-gray-500 text-center mt-4">
            Protected by Firebase Authentication
          </p>
        </motion.div>
      </motion.div>
    </main>
  );
}
