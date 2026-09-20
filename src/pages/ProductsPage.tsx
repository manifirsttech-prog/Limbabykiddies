import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';
import { FaTshirt, FaShoePrints, FaGraduationCap, FaBicycle, FaCar, FaBaby, FaGamepad, FaTh } from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import AnimatedSection from '../components/AnimatedSection';
import { products } from '../data/products';
import { ProductCategory } from '../types/product';

const categories: (ProductCategory | 'All')[] = [
  'All', 'Clothing', 'Shoes', 'School Bags', 'Bicycles', 'Car Seats', 'Baby Accessories', 'Toys',
];

const categoryIcons: Record<string, React.ElementType> = {
  All: FaTh,
  Clothing: FaTshirt,
  Shoes: FaShoePrints,
  'School Bags': FaGraduationCap,
  Bicycles: FaBicycle,
  'Car Seats': FaCar,
  'Baby Accessories': FaBaby,
  Toys: FaGamepad,
};

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    let result = products;
    if (selectedCategory !== 'All') result = result.filter((p) => p.category === selectedCategory);
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)
      );
    }
    return result;
  }, [selectedCategory, searchQuery]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <AnimatedSection className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Our Products</h1>
        <p className="mt-2 text-gray-600">Discover quality products for every stage of your child's journey</p>
      </AnimatedSection>

      <AnimatedSection className="mb-8" delay={0.1}>
        <div className="relative mb-6">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-pink-400" />
          <input
            type="search"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-sm transition-all"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat, i) => {
            const Icon = categoryIcons[cat];
            return (
              <motion.button
                key={cat}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-md shadow-pink-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {cat}
              </motion.button>
            );
          })}
        </div>
      </AnimatedSection>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-gray-500 mb-6">
        Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
        {selectedCategory !== 'All' && ` in ${selectedCategory}`}
      </motion.p>

      <AnimatePresence mode="wait">
        {filteredProducts.length > 0 ? (
          <motion.div
            key={selectedCategory + searchQuery}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16">
            <FiSearch className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No products found. Try a different search or category.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
