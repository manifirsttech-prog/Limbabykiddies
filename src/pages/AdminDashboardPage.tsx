import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Baby, LayoutDashboard, Package, LogOut, ShoppingCart,
  PackageCheck, AlertTriangle, TrendingUp, Plus, Edit, Trash2, X,
  BarChart3, ExternalLink, Eye, MapPin, Phone, Mail, Upload, Image as ImageIcon, Video, MessageSquare
} from 'lucide-react';
import { uploadImage, uploadVideo } from '../lib/cloudinary';
import { getAllProducts, addProduct, updateProduct, deleteProduct, getAllOrders, updateOrderStatus, getAllContactMessages, updateMessageStatus, deleteContactMessage } from '../lib/firestore';
import { Product, ProductCategory } from '../types/product';
import { Order } from '../types/order';
import { ContactMessage } from '../types/contact';
import { formatPrice } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

const categories: ProductCategory[] = ['Clothing', 'Shoes', 'School Bags', 'Bicycles', 'Toys', 'Water Bottle', 'Others'];

import SEO from '../components/SEO/SEO';

export default function AdminDashboardPage() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'messages'>(
    location.pathname.includes('/products') ? 'products' : location.pathname.includes('/orders') ? 'orders' : location.pathname.includes('/messages') ? 'messages' : 'overview'
  );

  useEffect(() => {
    if (location.pathname.includes('/products')) setActiveTab('products');
    else if (location.pathname.includes('/orders')) setActiveTab('orders');
    else if (location.pathname.includes('/messages')) setActiveTab('messages');
    else setActiveTab('overview');
  }, [location.pathname]);

  const [productList, setProductList] = useState<Product[]>([]);
  const [orderList, setOrderList] = useState<Order[]>([]);
  const [messageList, setMessageList] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const navigate = useNavigate();
  const { logout, currentUser } = useAuth();

  // Fetch products, orders, and messages from Firestore
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [products, orders, messages] = await Promise.all([
        getAllProducts(),
        getAllOrders().catch((err) => {
          console.error('Error fetching orders:', err);
          return [];
        }),
        getAllContactMessages().catch((err) => {
          console.error('Error fetching messages:', err);
          return [];
        }),
      ]);
      setProductList(products);
      setOrderList(orders);
      setMessageList(messages);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
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

      // Build product data - Firestore doesn't accept undefined values
      const productData: any = {
        name: formData.name,
        slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
        category: formData.category,
        price: parseFloat(formData.price),
        description: formData.description,
        stock: parseInt(formData.stock),
        status: formData.status,
        images: images.length > 0 ? images : (editingProduct?.images || ['https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&h=600&fit=crop']),
        featured: editingProduct?.featured || false,
        bestSeller: editingProduct?.bestSeller || false,
      };

      // Only add optional fields if they have values (Firestore rejects undefined)
      if (formData.sizes && formData.sizes.trim()) {
        productData.sizes = formData.sizes.split(',').map(s => s.trim()).filter(s => s);
      }
      
      if (formData.colors && formData.colors.trim()) {
        productData.colors = formData.colors.split(',').map(c => c.trim()).filter(c => c);
      }
      
      if (video) {
        productData.video = video;
      } else if (editingProduct?.video) {
        productData.video = editingProduct.video;
      }

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

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      <SEO title="Admin Dashboard | Limbaby Kiddies" noindex={true} />
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 w-64 bg-white border-r border-gray-200 
        flex flex-col h-screen z-50 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Limbaby Kiddies Logo" className="h-7 w-7 object-contain rounded-full border border-pink-200" />
            <span className="text-lg font-bold text-gray-900">Limbaby <span className="text-pink-500">kiddies</span></span>
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link 
            to="/admin/dashboard" 
            onClick={() => setSidebarOpen(false)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all hover:scale-105 ${activeTab === 'overview' ? 'bg-pink-50 text-pink-700' : 'text-gray-600 hover:bg-gray-50'}`}>
            <LayoutDashboard className="h-4 w-4" /> Overview
          </Link>
          <Link 
            to="/admin/dashboard/orders" 
            onClick={() => setSidebarOpen(false)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all hover:scale-105 ${activeTab === 'orders' ? 'bg-pink-50 text-pink-700' : 'text-gray-600 hover:bg-gray-50'}`}>
            <ShoppingCart className="h-4 w-4" /> Orders
          </Link>
          <Link 
            to="/admin/dashboard/products" 
            onClick={() => setSidebarOpen(false)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all hover:scale-105 ${activeTab === 'products' ? 'bg-pink-50 text-pink-700' : 'text-gray-600 hover:bg-gray-50'}`}>
            <Package className="h-4 w-4" /> Products
          </Link>
          <Link 
            to="/admin/dashboard/messages" 
            onClick={() => setSidebarOpen(false)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all hover:scale-105 ${activeTab === 'messages' ? 'bg-pink-50 text-pink-700' : 'text-gray-600 hover:bg-gray-50'}`}>
            <MessageSquare className="h-4 w-4" /> Messages
            {messageList.filter(m => m.status === 'unread').length > 0 && (
              <span className="ml-auto bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full">
                {messageList.filter(m => m.status === 'unread').length}
              </span>
            )}
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-100 space-y-1">
          <Link 
            to="/" 
            onClick={() => setSidebarOpen(false)}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-pink-50 hover:text-pink-700 transition-all hover:scale-105">
            <ExternalLink className="h-4 w-4" /> Back to Website
          </Link>
          <button 
            onClick={() => {
              setSidebarOpen(false);
              handleLogout();
            }} 
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all hover:scale-105">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-600 hover:text-pink-500 transition-colors"
            >
              <LayoutDashboard className="h-6 w-6" />
            </button>
            <h1 className="text-base sm:text-lg font-bold text-gray-900">
              {activeTab === 'overview' ? 'Dashboard' : activeTab === 'orders' ? 'Orders' : activeTab === 'messages' ? 'Messages' : 'Products'}
            </h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:block text-xs sm:text-sm text-gray-500 truncate max-w-[150px]">
              {currentUser?.email}
            </div>
            <button 
              onClick={handleLogout}
              className="text-gray-600 hover:text-pink-500 transition-colors"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {activeTab === 'overview' && <OverviewSection products={productList} orders={orderList} />}
          {activeTab === 'orders' && <OrdersSection orders={orderList} onRefresh={loadDashboardData} />}
          {activeTab === 'messages' && <MessagesSection messages={messageList} onRefresh={loadDashboardData} />}
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

function OverviewSection({ products, orders }: { products: Product[]; orders: Order[] }) {
  // Calculate real stats from products and orders
  const totalProducts = products.length;
  const inventoryValue = products.reduce((sum, p) => sum + (p.price * (p.stock || 0)), 0);
  const activeProducts = products.filter(p => p.status === 'active').length;
  const totalRevenueGenerated = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  const stats = [
    { label: 'Total Products', value: totalProducts.toString(), icon: PackageCheck, color: 'bg-purple-100 text-purple-600' },
    { label: 'Active Products', value: activeProducts.toString(), icon: Package, color: 'bg-green-100 text-green-600' },
    { label: 'Total Revenue Generated', value: formatPrice(totalRevenueGenerated), icon: TrendingUp, color: 'bg-emerald-100 text-emerald-600' },
    { label: 'Inventory Value', value: formatPrice(inventoryValue), icon: '₦', color: 'bg-blue-100 text-blue-600' },
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

      {/* Recent Orders Overview */}
      {orders.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl border-2 border-gray-100 p-6 hover:shadow-lg transition-all">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-pink-500" /> Recent Orders
          </h3>
          <div className="space-y-3">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{order.customerName}</p>
                  <p className="text-xs text-gray-500">{order.date} • {order.items?.length || 0} item(s)</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-pink-600 text-sm">{formatPrice(order.total)}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    order.paymentMethod === 'Paystack' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {order.paymentMethod || 'Paystack'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recent Products */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-2xl border-2 border-gray-100 p-6 hover:shadow-lg transition-all">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Package className="h-5 w-5 text-pink-500" /> Recent Products
        </h3>
        {products.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No products yet. Add your first product to get started!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {products.slice(0, 5).map((product) => (
              <div key={product.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                <img src={product.images[0]} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.category} • {formatPrice(product.price)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{product.stock || 0} in stock</p>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    product.status === 'active' ? 'bg-green-100 text-green-700' :
                    product.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {product.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

function OrdersSection({ orders, onRefresh }: { orders: Order[]; onRefresh: () => void }) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      alert(`Order status updated to ${newStatus}`);
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
      onRefresh();
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Failed to update order status');
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return;
    try {
      await deleteOrder(orderId);
      alert('Order deleted');
      setSelectedOrder(null);
      onRefresh();
    } catch (err) {
      console.error('Error deleting order:', err);
      alert('Failed to delete order');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }} whileHover={{ scale: 1.05, y: -5 }} className="bg-white rounded-2xl border-2 border-gray-100 p-5 hover:shadow-lg transition-all">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{orders.length}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} whileHover={{ scale: 1.05, y: -5 }} className="bg-white rounded-2xl border-2 border-gray-100 p-5 hover:shadow-lg transition-all">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{formatPrice(orders.reduce((sum: number, o: Order) => sum + (o.total || 0), 0))}</p>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden hover:shadow-lg transition-all">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-pink-500" /> All Orders ({orders.length})
          </h3>
          <button onClick={onRefresh} className="text-xs text-pink-600 hover:text-pink-700 font-medium border border-pink-200 px-3 py-1.5 rounded-lg hover:bg-pink-50 transition-all">
            Refresh Orders
          </button>
        </div>
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h4>
            <p className="text-gray-500">Orders will appear here when customers place orders through your store via Paystack or Cash on Delivery.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto bg-white">
              <table className="w-full min-w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Order Ref / ID</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Date</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Payment</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.map((order: Order) => (
                    <motion.tr key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} whileHover={{ backgroundColor: '#fafafa' }}>
                      <td className="px-4 py-3">
                        <span className="text-xs font-mono font-medium text-gray-900">{order.paymentReference || order.id.slice(0, 8)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{order.customerName}</p>
                          <p className="text-xs text-gray-500">{order.customerPhone || order.customerEmail}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600 hidden md:table-cell">{order.date}</td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${order.paymentMethod === 'Paystack' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                          {order.paymentMethod || 'Paystack'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">{formatPrice(order.total)}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium border ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
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

            {/* Mobile Card View */}
            <div className="block sm:hidden divide-y divide-gray-100 bg-white">
              {orders.map((order: Order, index: number) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 min-w-0 mr-2">
                      <p className="font-medium text-gray-900 text-sm truncate">{order.customerName}</p>
                      <p className="text-xs text-gray-500 font-mono truncate">{order.paymentReference || order.id.slice(0, 8)}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium border whitespace-nowrap ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="text-gray-600">{order.date}</span>
                    <span className={`px-2 py-0.5 rounded-full font-medium ${order.paymentMethod === 'Paystack' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {order.paymentMethod || 'Paystack'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <span className="text-xs text-gray-500 truncate mr-2">{order.customerPhone || order.customerEmail}</span>
                    <span className="text-base font-bold text-pink-600 whitespace-nowrap">{formatPrice(order.total)}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatPrice(order.total)}</td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status || 'pending'}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                        className={`text-xs px-2 py-1 rounded-lg font-medium border focus:outline-none cursor-pointer ${getStatusColor(order.status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
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
        )}
      </motion.div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedOrder(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 border-b border-gray-100">
                <div className="mb-3 sm:mb-0">
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">Order Details</h2>
                  <p className="text-xs sm:text-sm font-mono text-pink-600 break-all">Ref: {selectedOrder.paymentReference || selectedOrder.id}</p>
                  <p className="text-xs text-gray-500">Placed on {selectedOrder.date}</p>
                </div>
                <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600 absolute top-4 right-4 sm:static">
                  <X className="h-5 w-5" />
                </motion.button>
              </div>
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-pink-500" /> Customer Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-700"><span className="font-medium">Name:</span> {selectedOrder.customerName}</p>
                    <p className="text-gray-700 flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-gray-400" /> {selectedOrder.customerEmail}</p>
                    <p className="text-gray-700 flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-gray-400" /> {selectedOrder.customerPhone}</p>
                    <p className="text-gray-700 flex items-start gap-2"><MapPin className="h-3.5 w-3.5 text-gray-400 mt-0.5" /> {selectedOrder.customerAddress}</p>
                    {selectedOrder.notes && <p className="text-gray-700"><span className="font-medium">Notes:</span> {selectedOrder.notes}</p>}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Package className="h-4 w-4 text-pink-500" /> Products Ordered ({selectedOrder.items?.length || 0})
                  </h3>
                  <div className="space-y-3">
                    {selectedOrder.items?.map((item, index) => (
                      <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 bg-white border border-gray-100 rounded-xl">
                        {item.image && <img src={item.image} alt={item.productName} className="w-full sm:w-16 h-32 sm:h-16 rounded-lg object-cover" />}
                        <div className="flex-1 min-w-0 w-full">
                          <p className="font-medium text-gray-900 text-sm">{item.productName}</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {item.size && <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">Size: {item.size}</span>}
                            {item.color && <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">Color: {item.color}</span>}
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">Qty: {item.quantity}</span>
                          </div>
                        </div>
                        <p className="font-medium text-gray-900 text-sm self-end sm:self-auto">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Payment Method</span>
                    <span className="font-medium text-sm text-gray-700">{selectedOrder.paymentMethod || 'Paystack'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Payment Reference</span>
                    <span className="font-mono text-xs text-pink-600 font-bold">{selectedOrder.paymentReference || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-semibold text-gray-900 text-lg">Order Total</span>
                    <span className="text-xl font-bold text-pink-500">{formatPrice(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6 border-t border-gray-100 flex gap-3">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setSelectedOrder(null)} className="w-full px-4 py-2.5 sm:py-3 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-xl text-sm font-medium shadow-lg shadow-pink-200 transition-all">
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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">{products.length} products total</p>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onAdd} className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all shadow-lg shadow-pink-200">
          <Plus className="h-4 w-4" /> Add Product
        </motion.button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden hover:shadow-lg transition-all">
        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto bg-white">
          <table className="w-full min-w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Category</th>
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
                      <span className="text-sm font-medium text-gray-900 truncate max-w-[120px]">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">{product.category}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatPrice(product.price)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">{product.stock}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${product.status === 'active' ? 'bg-green-100 text-green-700' : product.status === 'draft' ? 'bg-gray-100 text-gray-700' : 'bg-red-100 text-red-700'}`}>{product.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setSelectedProduct(product)} className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-pink-600 hover:bg-pink-50 rounded-lg transition-colors">
                        <Eye className="h-3.5 w-3.5" />
                      </motion.button>
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

        {/* Mobile Card View */}
        <div className="block sm:hidden divide-y divide-gray-100 bg-white">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4"
            >
              <div className="flex gap-3 mb-3">
                <img src={product.images[0]} alt={product.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 text-sm mb-1 truncate">{product.name}</h4>
                  <p className="text-xs text-gray-500 mb-1 truncate">{product.category}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-pink-600 whitespace-nowrap">{formatPrice(product.price)}</span>
                    <span className="text-xs text-gray-500 whitespace-nowrap">Stock: {product.stock}</span>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium h-fit flex-shrink-0 ${product.status === 'active' ? 'bg-green-100 text-green-700' : product.status === 'draft' ? 'bg-gray-100 text-gray-700' : 'bg-red-100 text-red-700'}`}>
                  {product.status}
                </span>
              </div>
              <div className="flex gap-2">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setSelectedProduct(product)} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-pink-600 bg-pink-50 rounded-lg transition-colors">
                  <Eye className="h-3.5 w-3.5" /> View
                </motion.button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => onEdit(product)} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg transition-colors">
                  <Edit className="h-3.5 w-3.5" /> Edit
                </motion.button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => onDelete(product.id)} className="px-3 py-2 text-xs font-medium text-red-600 bg-red-50 rounded-lg transition-colors flex-shrink-0">
                  <Trash2 className="h-3.5 w-3.5" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedProduct(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 border-b border-gray-100">
                <div className="mb-3 sm:mb-0 pr-8 sm:pr-0">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">{selectedProduct.name}</h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1 break-all">Product ID: {selectedProduct.id}</p>
                </div>
                <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} onClick={() => setSelectedProduct(null)} className="text-gray-400 hover:text-gray-600 absolute top-4 right-4 sm:static">
                  <X className="h-5 w-5" />
                </motion.button>
              </div>
              
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Product Images */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-pink-500" /> Product Images
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedProduct.images.map((image, index) => (
                      <motion.div key={index} whileHover={{ scale: 1.05 }} className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-100">
                        <img src={image} alt={`${selectedProduct.name} - Image ${index + 1}`} className="w-full h-full object-cover" />
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Product Video */}
                {selectedProduct.video && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Video className="h-4 w-4 text-pink-500" /> Product Video
                    </h3>
                    <div className="rounded-xl overflow-hidden border-2 border-gray-100">
                      <video src={selectedProduct.video} controls className="w-full">
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>
                )}

                {/* Product Details */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Package className="h-4 w-4 text-pink-500" /> Product Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-700"><span className="font-medium">Category:</span> {selectedProduct.category}</p>
                      <p className="text-gray-700"><span className="font-medium">Price:</span> <span className="text-pink-500 font-bold">{formatPrice(selectedProduct.price)}</span></p>
                      <p className="text-gray-700"><span className="font-medium">Stock:</span> {selectedProduct.stock} units</p>
                      <p className="text-gray-700"><span className="font-medium">Status:</span> <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${selectedProduct.status === 'active' ? 'bg-green-100 text-green-700' : selectedProduct.status === 'draft' ? 'bg-gray-100 text-gray-700' : 'bg-red-100 text-red-700'}`}>{selectedProduct.status}</span></p>
                      <p className="text-gray-700"><span className="font-medium">Slug:</span> <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">{selectedProduct.slug}</code></p>
                      {selectedProduct.featured && <p className="text-gray-700"><span className="font-medium">Featured:</span> <span className="text-yellow-600">⭐ Yes</span></p>}
                      {selectedProduct.bestSeller && <p className="text-gray-700"><span className="font-medium">Best Seller:</span> <span className="text-yellow-600">🏆 Yes</span></p>}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Package className="h-4 w-4 text-pink-500" /> Options
                    </h3>
                    <div className="space-y-3 text-sm">
                      {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                        <div>
                          <p className="font-medium text-gray-700 mb-2">Sizes:</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedProduct.sizes.map((size, index) => (
                              <span key={index} className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-medium">{size}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {selectedProduct.colors && selectedProduct.colors.length > 0 && (
                        <div>
                          <p className="font-medium text-gray-700 mb-2">Colors:</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedProduct.colors.map((color, index) => (
                              <span key={index} className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-medium">{color}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {!selectedProduct.sizes?.length && !selectedProduct.colors?.length && (
                        <p className="text-gray-500 italic">No size or color options</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Product Description */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Package className="h-4 w-4 text-pink-500" /> Description
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{selectedProduct.description}</p>
                </div>
              </div>

              <div className="p-4 sm:p-6 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => { setSelectedProduct(null); onEdit(selectedProduct); }} className="flex-1 px-4 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl text-sm font-medium shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2">
                  <Edit className="h-4 w-4" /> Edit Product
                </motion.button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setSelectedProduct(null)} className="flex-1 px-4 py-2.5 sm:py-3 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-xl text-sm font-medium shadow-lg shadow-pink-200 transition-all">
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


function MessagesSection({ messages, onRefresh }: { messages: ContactMessage[]; onRefresh: () => void }) {
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read' | 'replied'>('all');

  const filteredMessages = filter === 'all' ? messages : messages.filter(m => m.status === filter);

  const handleMarkAsRead = async (messageId: string) => {
    try {
      await updateMessageStatus(messageId, 'read');
      onRefresh();
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const handleMarkAsReplied = async (messageId: string) => {
    try {
      await updateMessageStatus(messageId, 'replied');
      onRefresh();
    } catch (error) {
      console.error('Error marking message as replied:', error);
    }
  };

  const handleDelete = async (messageId: string) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await deleteContactMessage(messageId);
      setSelectedMessage(null);
      onRefresh();
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const unreadCount = messages.filter(m => m.status === 'unread').length;

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <p className="text-sm text-gray-500">
            {filteredMessages.length} message{filteredMessages.length !== 1 ? 's' : ''}
            {unreadCount > 0 && ` (${unreadCount} unread)`}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setFilter('all')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === 'all' ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>All</button>
          <button onClick={() => setFilter('unread')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === 'unread' ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Unread</button>
          <button onClick={() => setFilter('read')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === 'read' ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Read</button>
          <button onClick={() => setFilter('replied')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === 'replied' ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Replied</button>
        </div>
      </motion.div>

      {filteredMessages.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border-2 border-gray-100">
          <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No messages found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredMessages.map((message) => (
            <motion.div key={message.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ scale: 1.01 }} className={`bg-white rounded-xl border-2 p-4 cursor-pointer transition-all ${message.status === 'unread' ? 'border-pink-200 bg-pink-50/50' : 'border-gray-100'}`} onClick={() => {
              setSelectedMessage(message);
              if (message.status === 'unread') handleMarkAsRead(message.id);
            }}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">{message.name}</h3>
                    {message.status === 'unread' && (
                      <span className="bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full">New</span>
                    )}
                    {message.status === 'replied' && (
                      <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">Replied</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2 font-medium">{message.subject}</p>
                  <p className="text-sm text-gray-500 line-clamp-2">{message.message}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {message.email}</span>
                    <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {message.whatsapp}</span>
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(message.date).toLocaleDateString()}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Message Detail Modal */}
      <AnimatePresence>
        {selectedMessage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedMessage(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-pink-500" /> Message Details
                </h2>
                <button onClick={() => setSelectedMessage(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{selectedMessage.name}</h3>
                    <p className="text-sm text-gray-500">{new Date(selectedMessage.date).toLocaleString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${selectedMessage.status === 'unread' ? 'bg-pink-100 text-pink-700' : selectedMessage.status === 'replied' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {selectedMessage.status}
                  </span>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700">{selectedMessage.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700">{selectedMessage.whatsapp}</span>
                    <a href={`https://wa.me/${selectedMessage.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="ml-auto bg-green-500 text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-green-600 transition-colors flex items-center gap-1">
                      Chat on WhatsApp
                    </a>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Subject</h4>
                  <p className="text-gray-700">{selectedMessage.subject}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Message</h4>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>

                <div className="flex gap-3 pt-4">
                  {selectedMessage.status !== 'replied' && (
                    <button onClick={() => handleMarkAsReplied(selectedMessage.id)} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl text-sm font-medium transition-all">
                      Mark as Replied
                    </button>
                  )}
                  <button onClick={() => handleDelete(selectedMessage.id)} className="px-4 py-2.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl text-sm font-medium transition-all flex items-center gap-2">
                    <Trash2 className="h-4 w-4" /> Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
