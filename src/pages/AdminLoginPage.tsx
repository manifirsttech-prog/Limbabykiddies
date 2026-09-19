import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Baby, Lock, Mail } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock authentication
    if (email === 'admin@littlebloom.com' && password === 'admin123') {
      navigate('/admin/dashboard');
    } else {
      setError('Invalid credentials. Use admin@littlebloom.com / admin123');
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Baby className="h-8 w-8 text-pink-500" />
            <span className="text-xl font-bold text-gray-900">
              Little<span className="text-pink-500">Bloom</span>
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
          <p className="text-gray-600 mt-1">Sign in to manage your store</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="admin-email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="admin-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm"
                  placeholder="admin@littlebloom.com"
                />
              </div>
            </div>
            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="admin-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2.5 rounded-lg transition-colors"
            >
              Sign In
            </button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-4">
            Demo: admin@littlebloom.com / admin123
          </p>
        </div>
      </div>
    </main>
  );
}
