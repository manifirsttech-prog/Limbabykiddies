import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Baby, LayoutDashboard, Package, LogOut, DollarSign, ShoppingCart,
  PackageCheck, AlertTriangle, TrendingUp, Plus, Edit, Trash2, X,
  BarChart3
} from 'lucide-react';
import { products as initialProducts } from '../data/products';
import { Product, ProductCategory } from '../types/product';

const mockOrders = [
  { id: 'ORD-001', customer: 'Sarah Johnson', total: 89.97, status: 'pending', date: '2024-01-15' },
  { id: 'ORD-002', customer: 'Mike Peters', total: 149.99, status: 'processing', date: '2024-01-15' },
  { id: 'ORD-003', customer: 'Emily Davis', total: 64.98, status: 'shipped', date: '2024-01-14' },
  { id: 'ORD-004', customer: 'Tom Wilson', total: 199.99, status: 'delivered', date: '2024-01-14' },
  { id: 'ORD-005', customer: 'Lisa Brown', total: 44.99, status: 'pending', date: '2024-01-13' },
];

const categories: ProductCategory[] = ['Clothing', 'Shoes', 'School Bags', 'Bicycles', 'Car Seats', 'Baby Accessories', 'Toys'];

export default function AdminDashboardPage() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'overview' | 'products'>(
    location.pathname.includes('/products') ? 'products' : 'overview'
  );

  useEffect(() => {
    setActiveTab(location.pathname.includes('/products') ? 'products' : 'overview');
  }, [location.pathname]);

  const [productList, setProductList] = useState<Product[]>(initialProducts);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '', category: 'Clothing' as ProductCategory, price: '', description: '',
    stock: '', status: 'active' as 'active' | 'draft' | 'out-of-stock',
  });

  const handleLogout = () => navigate('/admin/login');

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({ name: '', category: 'Clothing', price: '', description: '', stock: '', status: 'active' });
    setShowModal(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name, category: product.category, price: product.price.toString(),
      description: product.description, stock: product.stock.toString(), status: product.status,
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingProduct) {
      setProductList((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? { ...p, name: formData.name, category: formData.category, price: parseFloat(formData.price), description: formData.description, stock: parseInt(formData.stock), status: formData.status }
            : p
        )
      );
    } else {
      const newProduct: Product = {
        id: Date.now().toString(), name: formData.name, slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
        category: formData.category, price: parseFloat(formData.price), description: formData.description,
        images: ['https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&h=600&fit=crop'],
        stock: parseInt(formData.stock), status: formData.status,
      };
      setProductList((prev) => [...prev, newProduct]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    setProductList((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden lg:flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2">
            <Baby className="h-7 w-7 text-pink-500" />
            <span className="text-lg font-bold text-gray-900">Little<span className="text-pink-500">Bloom</span></span>
          </Link>
          <p className="text-xs text-gray-500 mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link to="/admin/dashboard" className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all hover:scale-105 ${activeTab === 'overview' ? 'bg-pink-50 text-pink-700' : 'text-gray-600 hover:bg-gray-50'}`}>
            <LayoutDashboard className="h-4 w-4" /> Overview
          </Link>
          <Link to="/admin/dashboard/products" className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all hover:scale-105 ${activeTab === 'products' ? 'bg-pink-50 text-pink-700' : 'text-gray-600 hover:bg-gray-50'}`}>
            <Package className="h-4 w-4" /> Products
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all hover:scale-105">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="lg:hidden flex items-center gap-2">
            <Baby className="h-6 w-6 text-pink-500" />
            <span className="font-bold text-gray-900">Admin</span>
          </div>
          <h1 className="text-lg font-bold text-gray-900 hidden lg:block">
            {activeTab === 'overview' ? 'Dashboard Overview' : 'Product Management'}
          </h1>
          <div className="flex gap-2 lg:hidden">
            <Link to="/admin/dashboard" className={`px-3 py-1.5 rounded-lg text-xs font-medium ${activeTab === 'overview' ? 'bg-pink-100 text-pink-700' : 'bg-gray-100 text-gray-600'}`}>Overview</Link>
            <Link to="/admin/dashboard/products" className={`px-3 py-1.5 rounded-lg text-xs font-medium ${activeTab === 'products' ? 'bg-pink-100 text-pink-700' : 'bg-gray-100 text-gray-600'}`}>Products</Link>
          </div>
          <div className="text-sm text-gray-500">Welcome, Admin</div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {activeTab === 'overview' ? <OverviewSection /> : <ProductsSection products={productList} onAdd={openAddModal} onEdit={openEditModal} onDelete={handleDelete} />}
        </main>
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </motion.button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })} className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300">
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                    <input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                    <input type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'draft' | 'out-of-stock' })} className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300">
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="out-of-stock">Out of Stock</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 p-6 border-t border-gray-100">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all">Cancel</motion.button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-xl text-sm font-medium shadow-lg shadow-pink-200 transition-all">
                  {editingProduct ? 'Update' : 'Add Product'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function OverviewSection() {
  const stats = [
    { label: 'Total Revenue', value: '$12,458', icon: DollarSign, color: 'bg-green-100 text-green-600' },
    { label: 'Total Orders', value: '156', icon: ShoppingCart, color: 'bg-blue-100 text-blue-600' },
    { label: 'Total Products', value: '12', icon: PackageCheck, color: 'bg-purple-100 text-purple-600' },
    { label: 'Pending Orders', value: '8', icon: AlertTriangle, color: 'bg-yellow-100 text-yellow-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} whileHover={{ scale: 1.05, y: -5 }} className="bg-white rounded-2xl border-2 border-gray-100 p-5 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }} className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-2xl border-2 border-gray-100 p-6 hover:shadow-lg transition-all">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-pink-500" /> Sales Overview
        </h3>
        <div className="h-48 bg-gradient-to-t from-pink-50 to-white rounded-xl flex items-end justify-around px-4 pb-4">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
            <motion.div key={day} initial={{ height: 0 }} animate={{ height: `${[40, 65, 50, 80, 60, 90, 70][i]}%` }} transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }} className="flex flex-col items-center gap-1">
              <div className="w-8 bg-gradient-to-t from-pink-500 to-pink-400 rounded-t-lg" style={{ height: '100%' }}></div>
              <span className="text-xs text-gray-500">{day}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-2xl border-2 border-gray-100 p-6 hover:shadow-lg transition-all">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-pink-500" /> Recent Orders
          </h3>
          <div className="space-y-3">
            {mockOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{order.customer}</p>
                  <p className="text-xs text-gray-500">{order.id} • {order.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">${order.total.toFixed(2)}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                    'bg-green-100 text-green-700'
                  }`}>{order.status}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-white rounded-2xl border-2 border-gray-100 p-6 hover:shadow-lg transition-all">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-pink-500" /> Best Selling
            </h3>
            <div className="space-y-3">
              {initialProducts.filter(p => p.bestSeller).slice(0, 3).map((p) => (
                <div key={p.id} className="flex items-center gap-3">
                  <img src={p.images[0]} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                    <p className="text-xs text-gray-500">${p.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-white rounded-2xl border-2 border-gray-100 p-6 hover:shadow-lg transition-all">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" /> Low Stock
            </h3>
            <div className="space-y-3">
              {initialProducts.filter(p => p.stock < 15).map((p) => (
                <div key={p.id} className="flex items-center justify-between">
                  <p className="text-sm text-gray-900">{p.name}</p>
                  <span className="text-xs font-medium text-red-500">{p.stock} left</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function ProductsSection({ products, onAdd, onEdit, onDelete }: { products: Product[]; onAdd: () => void; onEdit: (p: Product) => void; onDelete: (id: string) => void; }) {
  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">{products.length} products total</p>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onAdd} className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all shadow-lg shadow-pink-200">
          <Plus className="h-4 w-4" /> Add Product
        </motion.button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden hover:shadow-lg transition-all">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Category</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Stock</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Status</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((product) => (
                <motion.tr key={product.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} whileHover={{ backgroundColor: '#fafafa' }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={product.images[0]} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                      <span className="text-sm font-medium text-gray-900 truncate max-w-[150px]">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden sm:table-cell">{product.category}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">${product.price.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">{product.stock}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${product.status === 'active' ? 'bg-green-100 text-green-700' : product.status === 'draft' ? 'bg-gray-100 text-gray-700' : 'bg-red-100 text-red-700'}`}>{product.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <motion.button whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} onClick={() => onEdit(product)} className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors" aria-label="Edit product">
                        <Edit className="h-4 w-4" />
                      </motion.button>
                      <motion.button whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} onClick={() => onDelete(product.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors" aria-label="Delete product">
                        <Trash2 className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
