import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiTruck, FiShield, FiRotateCw, FiMinus, FiPlus, FiChevronRight, FiCheck } from 'react-icons/fi';
import { FaTshirt, FaShoePrints, FaGraduationCap, FaBicycle, FaBaby, FaGamepad } from 'react-icons/fa';
import { getProductBySlug } from '../lib/firestore';
import { useCart } from '../context/CartContext';
import AnimatedSection from '../components/AnimatedSection';
import { formatPrice } from '../lib/utils';
import { Product } from '../types/product';

const categoryIcons: Record<string, React.ElementType> = {
  Clothing: FaTshirt, Shoes: FaShoePrints, 'School Bags': FaGraduationCap,
  Bicycles: FaBicycle, 'Others': FaBaby, Toys: FaGamepad,
};

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      
      try {
        const productData = await getProductBySlug(slug);
        setProduct(productData);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
        <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
        <Link to="/products" className="text-pink-500 font-medium hover:text-pink-600">← Back to Products</Link>
      </main>
    );
  }

  const CategoryIcon = categoryIcons[product.category] || FaBaby;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize || undefined, selectedColor || undefined);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images,
    description: product.description,
    brand: { '@type': 'Brand', name: 'Limbaby kiddies' },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'NGN',
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <motion.nav initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-pink-500">Home</Link>
        <FiChevronRight className="h-3 w-3" />
        <Link to="/products" className="hover:text-pink-500">Products</Link>
        <FiChevronRight className="h-3 w-3" />
        <span className="text-gray-900">{product.name}</span>
      </motion.nav>

      <div className="grid lg:grid-cols-2 gap-10">
        <motion.section initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }} className="aspect-square rounded-3xl overflow-hidden bg-gray-50 border-2 border-gray-100 shadow-lg">
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
          </motion.div>
        </motion.section>

        <motion.section initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <p className="text-sm font-medium text-pink-500 uppercase tracking-wide mb-2 flex items-center gap-2">
            <CategoryIcon className="h-4 w-4" />
            {product.category}
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-3xl font-bold text-pink-500 mb-4">
            {formatPrice(product.price)}
          </motion.p>
          <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mb-6">
            {product.stock > 0 ? (
              <p className="text-sm text-green-600 font-medium flex items-center gap-2">
                <FiCheck className="text-green-500" /> In Stock ({product.stock} available)
              </p>
            ) : (
              <p className="text-sm text-red-500 font-medium">Out of Stock</p>
            )}
          </motion.div>

          {product.sizes && product.sizes.length > 0 && (
            <AnimatedSection className="mb-6" delay={0.3}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <motion.button key={size} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                      selectedSize === size ? 'border-pink-500 bg-pink-50 text-pink-700 shadow-md' : 'border-gray-200 text-gray-700 hover:border-pink-300'
                    }`}
                  >{size}</motion.button>
                ))}
              </div>
            </AnimatedSection>
          )}

          {product.colors && product.colors.length > 0 && (
            <AnimatedSection className="mb-6" delay={0.4}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <motion.button key={color} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                      selectedColor === color ? 'border-pink-500 bg-pink-50 text-pink-700 shadow-md' : 'border-gray-200 text-gray-700 hover:border-pink-300'
                    }`}
                  >{color}</motion.button>
                ))}
              </div>
            </AnimatedSection>
          )}

          <AnimatedSection className="mb-6" delay={0.5}>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
            <div className="flex items-center gap-3">
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center border-2 border-gray-200 rounded-xl hover:bg-gray-50"
                aria-label="Decrease quantity"
              ><FiMinus className="h-4 w-4" /></motion.button>
              <motion.span key={quantity} initial={{ scale: 1.3 }} animate={{ scale: 1 }} className="w-12 text-center font-bold text-xl text-gray-900">
                {quantity}
              </motion.span>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="w-10 h-10 flex items-center justify-center border-2 border-gray-200 rounded-xl hover:bg-gray-50"
                aria-label="Increase quantity"
              ><FiPlus className="h-4 w-4" /></motion.button>
            </div>
          </AnimatedSection>

          <motion.button onClick={handleAddToCart} disabled={product.stock === 0}
            whileHover={{ scale: product.stock > 0 ? 1.02 : 1 }} whileTap={{ scale: product.stock > 0 ? 0.98 : 1 }}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 disabled:from-gray-300 disabled:to-gray-300 text-white font-semibold py-4 rounded-xl transition-all shadow-lg shadow-pink-200 disabled:shadow-none text-lg"
          >
            <FiShoppingCart className="h-5 w-5" />
            <AnimatePresence mode="wait">
              {addedToCart ? (
                <motion.span key="added" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  Added to Cart!
                </motion.span>
              ) : (
                <motion.span key="add" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  Add to Cart
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          <div className="mt-8 space-y-4 border-t-2 border-gray-100 pt-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="flex items-center gap-3 text-sm text-gray-600">
              <FiTruck className="h-5 w-5 text-pink-500" />
              <span>Free delivery on orders over ₦25,000</span>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }} className="flex items-center gap-3 text-sm text-gray-600">
              <FiShield className="h-5 w-5 text-pink-500" />
              <span>Safety certified and quality guaranteed</span>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }} className="flex items-center gap-3 text-sm text-gray-600">
              <FiRotateCw className="h-5 w-5 text-pink-500" />
              <span>30-day hassle-free returns</span>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
