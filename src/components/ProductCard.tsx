import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiEye, FiStar } from 'react-icons/fi';
import { FaTshirt, FaShoePrints, FaGraduationCap, FaBicycle, FaBaby, FaGamepad } from 'react-icons/fa';
import { Product } from '../types/product';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/utils';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const categoryIcons: Record<string, React.ElementType> = {
  Clothing: FaTshirt,
  Shoes: FaShoePrints,
  'School Bags': FaGraduationCap,
  Bicycles: FaBicycle,
  'Others': FaBaby,
  Toys: FaGamepad,
};

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart } = useCart();
  const CategoryIcon = categoryIcons[product.category] || FaBaby;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <Link to={`/products/${product.slug}`} className="block relative">
        <div className="aspect-square overflow-hidden bg-gray-50 relative">
          <motion.img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.4 }}
            loading="lazy"
          />
          {product.bestSeller && (
            <motion.span
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md"
            >
              <FiStar className="text-xs" /> Bestseller
            </motion.span>
          )}
          {product.stock < 10 && product.stock > 0 && (
            <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
              Only {product.stock} left
            </span>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-white text-gray-900 font-bold px-4 py-2 rounded-lg text-sm">
                Sold Out
              </span>
            </div>
          )}
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <span className="bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-lg">
              <FiEye className="h-4 w-4" /> Quick View
            </span>
          </motion.div>
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/products/${product.slug}`}>
          <p className="text-xs font-medium text-pink-500 uppercase tracking-wide mb-1 flex items-center gap-1.5">
            <CategoryIcon className="h-3.5 w-3.5" />
            {product.category}
          </p>
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-pink-500 transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
          {product.stock > 0 ? (
            <span className="text-xs text-green-600 font-medium">In Stock</span>
          ) : (
            <span className="text-xs text-red-500 font-medium">Out of Stock</span>
          )}
        </div>
        <motion.button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          whileHover={{ scale: product.stock > 0 ? 1.02 : 1 }}
          whileTap={{ scale: product.stock > 0 ? 0.98 : 1 }}
          className="mt-3 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 disabled:from-gray-300 disabled:to-gray-300 text-white text-sm font-medium py-2.5 rounded-xl transition-all shadow-md shadow-pink-200 disabled:shadow-none"
        >
          <FiShoppingCart className="h-4 w-4" />
          {product.stock > 0 ? 'Add to Cart' : 'Sold Out'}
        </motion.button>
      </div>
    </motion.article>
  );
}
