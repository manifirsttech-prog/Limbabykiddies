import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';
import { FaTshirt, FaShoePrints, FaGraduationCap, FaBicycle, FaBaby, FaGamepad, FaTh } from 'react-icons/fa';
import { FaBottleWater } from 'react-icons/fa6';
import ProductCard from '../components/ProductCard';
import AnimatedSection from '../components/AnimatedSection';
import { getAllProducts } from '../lib/firestore';
import { Product, ProductCategory } from '../types/product';

const categories: (ProductCategory | 'All')[] = [
  'All', 'Clothing', 'Shoes', 'School Bags', 'Bicycles', 'Toys', 'Water Bottle', 'Others',
];

const categoryIcons: Record<string, React.ElementType> = {
  All: FaTh,
  Clothing: FaTshirt,
  Shoes: FaShoePrints,
  'School Bags': FaGraduationCap,
  Bicycles: FaBicycle,
  Toys: FaGamepad,
  'Water Bottle': FaBottleWater,
  Others: FaBaby,
};

import SEO from '../components/SEO/SEO';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Read category from URL on mount
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam && categories.includes(categoryParam as any)) {
      setSelectedCategory(categoryParam as ProductCategory | 'All');
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const allProducts = await getAllProducts();
        setProducts(allProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  // const filteredProducts = useMemo(() => {
  //   let result = products;
  //   if (selectedCategory !== 'All') result = result.filter((p) => p.category === selectedCategory);
  //   if (searchQuery.trim()) {
  //     const query = searchQuery.toLowerCase();
  //     result = result.filter(
  //       (p) => p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)
  //     );
  //   }
  //   return result;
  // }, [selectedCategory, searchQuery]);

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
}, [products, selectedCategory, searchQuery]);

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </main>
    );
  }

  const pageTitle = selectedCategory === 'All' 
    ? "Shop Baby & Kids Products | Limbaby Kiddies Nigeria" 
    : `Shop ${selectedCategory} for Babies & Kids | Limbaby Kiddies`;

  const pageDescription = selectedCategory === 'All'
    ? "Explore our complete collection of premium baby clothing, shoes, toys, school bags, bicycles, water bottles, and accessories at Limbaby Kiddies."
    : `Discover high-quality ${selectedCategory} for children and babies at Limbaby Kiddies. Safe, durable, and stylish products with fast delivery in Nigeria.`;

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://limbabykiddies.com' },
      { '@type': 'ListItem', 'position': 2, 'name': 'Products', 'item': 'https://limbabykiddies.com/products' }
    ]
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <SEO 
        title={pageTitle}
        description={pageDescription}
        keywords="baby products, kids clothing, baby shoes, children toys, school bags, kids bicycles, water bottles, Nigeria e-commerce"
        canonical="/products"
        jsonLd={breadcrumbJsonLd}
      />
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
                onClick={() => {
                  setSelectedCategory(cat);
                  setSearchParams(cat === 'All' ? {} : { category: cat });
                }}
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
