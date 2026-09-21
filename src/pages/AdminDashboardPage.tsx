import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Baby, LayoutDashboard, Package, LogOut, ShoppingCart,
  PackageCheck, AlertTriangle, TrendingUp, Plus, Edit, Trash2, X,
  BarChart3, ExternalLink, Eye, MapPin, Phone, Mail, Upload, Image as ImageIcon, Video
} from 'lucide-react';
import { uploadImage, uploadVideo } from '../lib/cloudinary';
import { getAllProducts, addProduct, updateProduct, deleteProduct } from '../lib/firestore';
import { Product, ProductCategory } from '../types/product';
import { formatPrice } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

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
    customerPhone: '+234 801 234 5678',
    customerAddress: '456 Admiralty Way, Lekki Phase 1, Lagos',
    items: [
      { productName: 'Organic Cotton Baby Onesie', quantity: 2, price: 12500, image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=100&h=100&fit=crop', size: '3-6M', color: 'Pink' },
      { productName: 'Silicone Baby Feeding Set', quantity: 1, price: 15000, image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=100&h=100&fit=crop', color: 'Sage Green' },
    ],
    total: 40000,
    status: 'pending',
    date: '2024-01-15',
  },
  {
    id: 'ORD-002',
    customerName: 'Mike Peters',
    customerEmail: 'mike.p@email.com',
    customerPhone: '+234 802 345 6789',
    customerAddress: '789 Allen Avenue, Ikeja, Lagos',
    items: [
      { productName: '16-inch Kids Bicycle', quantity: 1, price: 75000, image: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=100&h=100&fit=crop', color: 'Red' },
    ],
    total: 75000,
    status: 'processing',
    date: '2024-01-15',
  },
  {
    id: 'ORD-003',
    customerName: 'Emily Davis',
    customerEmail: 'emily.d@email.com',
    customerPhone: '+234 803 456 7890',
    customerAddress: '321 Ozumba Mbadiwe, Victoria Island, Lagos',
    items: [
      { productName: 'Kids Sneakers - Adventure Edition', quantity: 1, price: 20000, image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=100&h=100&fit=crop', size: 'US 10', color: 'Blue/White' },
      { productName: 'Rainbow School Backpack', quantity: 1, price: 17500, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop', color: 'Rainbow' },
    ],
    total: 37500,
    status: 'shipped',
    date: '2024-01-14',
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

  const [productList, setProductList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const navigate = useNavigate();
  const { logout, currentUser } = useAuth();

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const products = await getAllProducts();
        setProductList(products);
      } catch (error) {
        console.error('Error fetching products:', error);
        alert('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  const [formData, setFormData] = useState({
    name: '', category: 'Clothing' as ProductCategory, price: '', description: '',
    stock: '', status: 'active' as 'active' | 'draft' | 'out-of-stock',
    sizes: '', colors: '',
  });
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const uploadFiles = async (): Promise<{ images: string[]; video?: string }> => {
    const uploadedImages: string[] = [];
    let uploadedVideo: string | undefined;

    try {
      // Upload images to Cloudinary
      if (imageFiles && imageFiles.length > 0) {
        console.log(`📸 Starting upload of ${imageFiles.length} image(s)...`);
        for (let i = 0; i < imageFiles.length; i++) {
          const file = imageFiles[i];
          console.log(`📷 Uploading image ${i + 1}/${imageFiles.length}: ${file.name}`);
          const url = await uploadImage(file);
          console.log(`✅ Image ${i + 1} uploaded successfully:`, url);
          uploadedImages.push(url);
        }
      }

      // Upload video to Cloudinary
      if (videoFile) {
        console.log('🎥 Starting video upload:', videoFile.name);
        uploadedVideo = await uploadVideo(videoFile);
        console.log('✅ Video uploaded successfully:', uploadedVideo);
      }

      console.log('✅ All files uploaded successfully');
      return { images: uploadedImages, video: uploadedVideo };
    } catch (error: any) {
      console.error('❌ Error in uploadFiles:', error);
      
      // If we have some images uploaded, return those instead of failing completely
      if (uploadedImages.length > 0) {
        console.log('⚠️ Some images uploaded successfully, continuing with partial upload');
        return { images: uploadedImages, video: uploadedVideo };
      }
      
      throw new Error(`File upload failed: ${error.message || 'Unknown error'}`);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({ name: '', category: 'Clothing', price: '', description: '', stock: '', status: 'active', sizes: '', colors: '' });
    setImageFiles(null);
    setVideoFile(null);
    setShowModal(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name, category: product.category, price: product.price.toString(),
      description: product.description, stock: product.stock.toString(), status: product.status,
      sizes: product.sizes?.join(', ') || '', colors: product.colors?.join(', ') || '',
    });
    setImageFiles(null);
    setVideoFile(null);
    setShowModal(true);
  };

  const handleSave = async () => {
    setUploading(true);
    try {
      console.log('🚀 Starting product save process...');
      
      // Upload files to Cloudinary
      console.log('📤 Uploading files to Cloudinary...');
      const { images, video } = await uploadFiles();
      console.log('✅ Files uploaded successfully:', { images, video });

      const productData = {
        name: formData.name,
        slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
        category: formData.category,
        price: parseFloat(formData.price),
        description: formData.description,
        stock: parseInt(formData.stock),
        status: formData.status,
        sizes: formData.sizes ? formData.sizes.split(',').map(s => s.trim()) : undefined,
        colors: formData.colors ? formData.colors.split(',').map(c => c.trim()) : undefined,
        images: images.length > 0 ? images : (editingProduct?.images || ['https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&h=600&fit=crop']),
        video: video || editingProduct?.video,
        featured: editingProduct?.featured || false,
        bestSeller: editingProduct?.bestSeller || false,
      };

      console.log('💾 Saving product to Firestore...');
      
      if (editingProduct) {
        // Update existing product in Firestore
        await updateProduct(editingProduct.id, productData);
        
        // Update local state
        setProductList((prev) =>
          prev.map((p) => p.id === editingProduct.id ? { ...p, ...productData } : p)
        );
      } else {
        // Add new product to Firestore
        const newProductId = await addProduct(productData);
        
        // Update local state
        const newProduct: Product = {
          id: newProductId,
          ...productData,
        };
        setProductList((prev) => [...prev, newProduct]);
      }
      
      console.log('✅ Product saved successfully!');
      setShowModal(false);
      alert(editingProduct ? '✅ Product updated successfully!' : '✅ Product added successfully!');
    } catch (error: any) {
      console.error('❌ Error saving product:', error);
      console.error('🔍 Error details:', error);
      
      const errorMessage = error?.message || 'Unknown error occurred';
      
      // Provide helpful error messages based on common issues
      let helpMessage = '';
      if (errorMessage.includes('Upload preset') || errorMessage.includes('preset')) {
        helpMessage = '\n\n💡 TIP: Check your Cloudinary upload preset settings:\n1. Go to Cloudinary Dashboard → Settings → Upload\n2. Find your upload preset "Lim baby"\n3. Make sure "Signing Mode" is set to "Unsigned"\n4. Save the settings';
      } else if (errorMessage.includes('File size') || errorMessage.includes('size')) {
        helpMessage = '\n\n💡 TIP: Your file might be too large. Try:\n- Compressing the image\n- Using a smaller image (under 5MB)\n- Converting to JPG format';
      } else if (errorMessage.includes('format') || errorMessage.includes('type')) {
        helpMessage = '\n\n💡 TIP: Check your file format:\n- Images: Use JPG, PNG, GIF, or WebP\n- Videos: Use MP4, MOV, or WebM';
      }
      
      alert(`❌ Error saving product:\n\n${errorMessage}${helpMessage}\n\n📋 Check browser console (F12) for detailed logs.`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }
    
    try {
      await deleteProduct(id);
      setProductList((prev) => prev.filter((p) => p.id !== id));
      alert('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden lg:flex flex-col h-screen sticky top-0">
        <div className="p-6 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2">
            <Baby className="h-7 w-7 text-pink-500" />
            <span className="text-lg font-bold text-gray-900">Limbaby <span className="text-pink-500">kiddies</span></span>
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
            <div className="text-sm text-gray-500">Welcome, {currentUser?.email}</div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {activeTab === 'overview' && <OverviewSection />}
          {activeTab === 'orders' && <OrdersSection />}
          {activeTab === 'products' && (
            loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading products...</p>
                </div>
              </div>
            ) : (
              <ProductsSection products={productList} onAdd={openAddModal} onEdit={openEditModal} onDelete={handleDelete} />
            )
          )}
        </main>
      </div>

      {/* Product Modal with Image/Video Upload */}
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₦)</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sizes (comma separated)</label>
                  <input type="text" value={formData.sizes} onChange={(e) => setFormData({ ...formData, sizes: e.target.value })} placeholder="S, M, L, XL" className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Colors (comma separated)</label>
                  <input type="text" value={formData.colors} onChange={(e) => setFormData({ ...formData, colors: e.target.value })} placeholder="Red, Blue, Green" className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'draft' | 'out-of-stock' })} className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300">
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="out-of-stock">Out of Stock</option>
                  </select>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-pink-500" /> Product Images
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-pink-300 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => setImageFiles(e.target.files)}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100 cursor-pointer"
                    />
                    {imageFiles && (
                      <p className="text-xs text-gray-500 mt-2">{imageFiles.length} image(s) selected</p>
                    )}
                    {editingProduct && editingProduct.images.length > 0 && !imageFiles && (
                      <p className="text-xs text-gray-500 mt-2">Current: {editingProduct.images.length} image(s)</p>
                    )}
                  </div>
                </div>

                {/* Video Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <Video className="h-4 w-4 text-pink-500" /> Product Video (optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-pink-300 transition-colors">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100 cursor-pointer"
                    />
                    {videoFile && (
                      <p className="text-xs text-gray-500 mt-2">Video: {videoFile.name}</p>
                    )}
                    {editingProduct?.video && !videoFile && (
                      <p className="text-xs text-gray-500 mt-2">Current video available</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 p-6 border-t border-gray-100">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all" disabled={uploading}>Cancel</motion.button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave} disabled={uploading} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-xl text-sm font-medium shadow-lg shadow-pink-200 transition-all disabled:opacity-50">
                  {uploading ? 'Uploading...' : (editingProduct ? 'Update' : 'Add Product')}
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
    { label: 'Total Revenue', value: '320,000', icon: '₦', color: 'bg-green-100 text-green-600' },
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
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.label === 'Total Revenue' && <span className="text-green-600">₦</span>}
                  {stat.value}
                </p>
              </div>
              <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }} className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                {typeof stat.icon === 'string' ? (
                  <span className="text-2xl font-bold">{stat.icon}</span>
                ) : (
                  <stat.icon className="h-6 w-6" />
                )}
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
          <p className="text-2xl font-bold text-green-600 mt-1">{formatPrice(mockOrders.reduce((sum, o) => sum + o.total, 0))}</p>
        </motion.div>
      </div>

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
                  <td className="px-4 py-3"><span className="text-sm font-medium text-gray-900">{order.id}</span></td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{order.customerName}</p>
                      <p className="text-xs text-gray-500">{order.customerEmail}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">{order.date}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden sm:table-cell">{order.items.length} item{order.items.length > 1 ? 's' : ''}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatPrice(order.total)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium border ${getStatusColor(order.status)}`}>{order.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end">
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setSelectedOrder(order)} className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-pink-600 hover:bg-pink-50 rounded-lg transition-colors">
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedOrder(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Order {selectedOrder.id}</h2>
                  <p className="text-sm text-gray-500">Placed on {selectedOrder.date}</p>
                </div>
                <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </motion.button>
              </div>
              <div className="p-6 space-y-6">
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
                        <p className="font-medium text-gray-900 text-sm">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Order Total</span>
                    <span className="text-xl font-bold text-pink-500">{formatPrice(selectedOrder.total)}</span>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-sm text-gray-500">Status:</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium border ${getStatusColor(selectedOrder.status)}`}>{selectedOrder.status}</span>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-100">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setSelectedOrder(null)} className="w-full px-4 py-2.5 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-xl text-sm font-medium shadow-lg shadow-pink-200 transition-all">
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
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatPrice(product.price)}</td>
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
