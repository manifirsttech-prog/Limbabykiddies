import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Baby, LayoutDashboard, Package, LogOut, DollarSign, ShoppingCart,
  PackageCheck, AlertTriangle, TrendingUp, Plus, Edit, Trash2, X,
  BarChart3, ExternalLink, Eye, MapPin, Phone, Mail
} from 'lucide-react';
import { products as initialProducts } from '../data/products';
import { Product, ProductCategory } from '../types/product';

interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
  image: string;
  size?: string;
  color?: string;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  date: string;
}

const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah.j@email.com',
    customerPhone: '+1 (555) 234-5678',
    customerAddress: '456 Oak Street, Springfield, IL 62701',
    items: [
      { productName: 'Organic Cotton Baby Onesie', quantity: 2, price: 24.99, image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=100&h=100&fit=crop', size: '3-6M', color: 'Pink' },
      { productName: 'Silicone Baby Feeding Set', quantity: 1, price: 29.99, image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=100&h=100&fit=crop', color: 'Sage Green' },
    ],
    total: 79.97,
    status: 'pending',
    date: '2024-01-15',
  },
  {
    id: 'ORD-002',
    customerName: 'Mike Peters',
    customerEmail: 'mike.p@email.com',
    customerPhone: '+1 (555) 345-6789',
    customerAddress: '789 Pine Avenue, Portland, OR 97201',
    items: [
      { productName: '16-inch Kids Bicycle', quantity: 1, price: 149.99, image: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=100&h=100&fit=crop', color: 'Red' },
    ],
    total: 149.99,
    status: 'processing',
    date: '2024-01-15',
  },
  {
    id: 'ORD-003',
    customerName: 'Emily Davis',
    customerEmail: 'emily.d@email.com',
    customerPhone: '+1 (555) 456-7890',
    customerAddress: '321 Maple Road, Austin, TX 73301',
    items: [
      { productName: 'Kids Sneakers - Adventure Edition', quantity: 1, price: 39.99, image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=100&h=100&fit=crop', size: 'US 10', color: 'Blue/White' },
      { productName: 'Rainbow School Backpack', quantity: 1, price: 34.99, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop', color: 'Rainbow' },
    ],
    total: 74.98,
    status: 'shipped',
    date: '2024-01-14',
  },
  {
    id: 'ORD-004',
    customerName: 'Tom Wilson',
    customerEmail: 'tom.w@email.com',
    customerPhone: '+1 (555) 567-8901',
    customerAddress: '654 Cedar Lane, Denver, CO 80201',
    items: [
      { productName: 'Premium Baby Car Seat', quantity: 1, price: 199.99, image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=100&h=100&fit=crop', color: 'Charcoal' },
    ],
    total: 199.99,
    status: 'delivered',
    date: '2024-01-14',
  },
  {
    id: 'ORD-005',
    customerName: 'Lisa Brown',
    customerEmail: 'lisa.b@email.com',
    customerPhone: '+1 (555) 678-9012',
    customerAddress: '987 Birch Court, Seattle, WA 98101',
    items: [
      { productName: 'Wooden Building Blocks Set', quantity: 1, price: 44.99, image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=100&h=100&fit=crop' },
    ],
    total: 44.99,
    status: 'pending',
    date: '2024-01-13',
  },
  {
    id: 'ORD-006',
    customerName: 'Jennifer Martinez',
    customerEmail: 'jennifer.m@email.com',
    customerPhone: '+1 (555) 789-0123',
    customerAddress: '147 Elm Street, Miami, FL 33101',
    items: [
      { productName: 'Baby Winter Jacket', quantity: 1, price: 49.99, image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=100&h=100&fit=crop', size: '12-18M', color: 'Navy' },
      { productName: 'Plush Teddy Bear', quantity: 2, price: 19.99, image: 'https://images.unsplash.com/photo-1563396983906-b3795482a59a?w=100&h=100&fit=crop', color: 'Brown' },
    ],
    total: 89.97,
    status: 'processing',
    date: '2024-01-12',
  },
];

const categories: ProductCategory[] = ['Clothing', 'Shoes', 'School Bags', 'Bicycles', 'Car Seats', 'Baby Accessories', 'Toys'];

export default function AdminDashboardPage() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>(
    location.pathname.includes('/products') ? 'products' : location.pathname.includes('/orders') ? 'orders' : 'overview'
  );

  useEffect(() => {
    if (location.pathname.includes('/products')) setActiveTab('products');
    else if (location.pathname.includes('/orders')) setActiveTab('orders');
    else setActiveTab('overview');
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
          <Link to="/admin/dashboard/orders" className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all hover:scale-105 ${activeTab === 'orders' ? 'bg-pink-50 text-pink-700' : 'text-gray-600 hover:bg-gray-50'}`}>
            <ShoppingCart className="h-4 w-4" /> Orders
          </Link>
          <Link to="/admin/dashboard/products" className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all hover:scale-105 ${activeTab === 'products' ? 'bg-pink-50 text-pink-700' : 'text-gray-600 hover:bg-gray-50'}`}>
            <Package className="h-4 w-4" /> Products
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-100 space-y-1">
          <Link to="/" className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-pink-50 hover:text-pink-700 transition-all hover:scale-105">
            <ExternalLink className="h-4 w-4" /> Back to Website
          </Link>
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
            {activeTab === 'overview' ? 'Dashboard Overview' : activeTab === 'orders' ? 'Order Management' : 'Product Management'}
          </h1>
          <div className="flex gap-2 lg:hidden">
            <Link to="/admin/dashboard" className={`px-3 py-1.5 rounded-lg text-xs font-medium ${activeTab === 'overview' ? 'bg-pink-100 text-pink-700' : 'bg-gray-100 text-gray-600'}`}>Overview</Link>
            <Link to="/admin/dashboard/orders" className={`px-3 py-1.5 rounded-lg text-xs font-medium ${activeTab === 'orders' ? 'bg-pink-100 text-pink-700' : 'bg-gray-100 text-gray-600'}`}>Orders</Link>
            <Link to="/admin/dashboard/products" className={`px-3 py-1.5 rounded-lg text-xs font-medium ${activeTab === 'products' ? 'bg-pink-100 text-pink-700' : 'bg-gray-100 text-gray-600'}`}>Products</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="hidden md:flex items-center gap-1.5 text-sm text-gray-600 hover:text-pink-500 transition-colors">
              <ExternalLink className="h-4 w-4" /> Back to Website
            </Link>
            <div className="text-sm text-gray-500">Welcome, Admin</div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {activeTab === 'overview' && <OverviewSection />}
          {activeTab === 'orders' && <OrdersSection />}
          {activeTab === 'products' && <ProductsSection products={productList} onAdd={openAddModal} onEdit={openEditModal} onDelete={handleDelete} />}
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
                  <p className="text-sm font-medium text-gray-900">{order.customerName}</p>
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

function OrdersSection() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Orders Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }} whileHover={{ scale: 1.05, y: -5 }} className="bg-white rounded-2xl border-2 border-gray-100 p-5 hover:shadow-lg transition-all">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{mockOrders.length}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} whileHover={{ scale: 1.05, y: -5 }} className="bg-white rounded-2xl border-2 border-gray-100 p-5 hover:shadow-lg transition-all">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">{mockOrders.filter(o => o.status === 'pending').length}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} whileHover={{ scale: 1.05, y: -5 }} className="bg-white rounded-2xl border-2 border-gray-100 p-5 hover:shadow-lg transition-all">
          <p className="text-sm text-gray-500">Processing</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{mockOrders.filter(o => o.status === 'processing').length}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} whileHover={{ scale: 1.05, y: -5 }} className="bg-white rounded-2xl border-2 border-gray-100 p-5 hover:shadow-lg transition-all">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="text-2xl font-bold text-green-600 mt-1">${mockOrders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}</p>
        </motion.div>
      </div>

      {/* Orders List */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden hover:shadow-lg transition-all">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-pink-500" /> All Orders
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Date</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Items</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {mockOrders.map((order) => (
                <motion.tr key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} whileHover={{ backgroundColor: '#fafafa' }}>
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-gray-900">{order.id}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{order.customerName}</p>
                      <p className="text-xs text-gray-500">{order.customerEmail}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">{order.date}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden sm:table-cell">{order.items.length} item{order.items.length > 1 ? 's' : ''}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">${order.total.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedOrder(order)}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5" /> View
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Order {selectedOrder.id}</h2>
                  <p className="text-sm text-gray-500">Placed on {selectedOrder.date}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </div>

              <div className="p-6 space-y-6">
                {/* Customer Info */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-pink-500" /> Customer Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-700"><span className="font-medium">Name:</span> {selectedOrder.customerName}</p>
                    <p className="text-gray-700 flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-gray-400" /> {selectedOrder.customerEmail}</p>
                    <p className="text-gray-700 flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-gray-400" /> {selectedOrder.customerPhone}</p>
                    <p className="text-gray-700 flex items-start gap-2"><MapPin className="h-3.5 w-3.5 text-gray-400 mt-0.5" /> {selectedOrder.customerAddress}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Package className="h-4 w-4 text-pink-500" /> Products Ordered
                  </h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 bg-white border border-gray-100 rounded-xl">
                        <img src={item.image} alt={item.productName} className="w-16 h-16 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm">{item.productName}</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {item.size && <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">Size: {item.size}</span>}
                            {item.color && <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">Color: {item.color}</span>}
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">Qty: {item.quantity}</span>
                          </div>
                        </div>
                        <p className="font-medium text-gray-900 text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Total */}
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Order Total</span>
                    <span className="text-xl font-bold text-pink-500">${selectedOrder.total.toFixed(2)}</span>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-sm text-gray-500">Status:</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium border ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedOrder(null)}
                  className="w-full px-4 py-2.5 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-xl text-sm font-medium shadow-lg shadow-pink-200 transition-all"
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
