import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiTruck, FiShield, FiStar } from 'react-icons/fi';
import { GiHeartBeats } from 'react-icons/gi';
import { FaTshirt, FaShoePrints, FaGraduationCap, FaBicycle, FaCar, FaBaby, FaGamepad } from 'react-icons/fa';
import AnimatedSection from '../components/AnimatedSection';
import StaggerContainer, { StaggerItem } from '../components/StaggerContainer';
import ProductCard from '../components/ProductCard';
import { getFeaturedProducts, getBestSellers } from '../lib/firestore';
import { Product } from '../types/product';

const categories = [
  { name: 'Clothing', icon: FaTshirt, color: 'bg-pink-50 text-pink-700 border-pink-200' },
  { name: 'Shoes', icon: FaShoePrints, color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { name: 'Toys', icon: FaGamepad, color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  { name: 'School Bags', icon: FaGraduationCap, color: 'bg-green-50 text-green-700 border-green-200' },
  { name: 'Bicycles', icon: FaBicycle, color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { name: 'Car Seats', icon: FaCar, color: 'bg-red-50 text-red-700 border-red-200' },
  { name: 'Baby Accessories', icon: FaBaby, color: 'bg-orange-50 text-orange-700 border-orange-200' },
];

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [featuredProducts, bestSellerProducts] = await Promise.all([
          getFeaturedProducts(),
          getBestSellers()
        ]);
        setFeatured(featuredProducts);
        setBestSellers(bestSellerProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

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

  return (
    <main>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-pink-50 via-white to-purple-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
              >
                Little Things.{' '}
                <span className="text-pink-500 relative">
                  Big Smiles.
                  <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="absolute -bottom-2 left-0 h-1 bg-pink-300 rounded-full"
                  />
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-6 text-lg text-gray-600 leading-relaxed max-w-lg"
              >
                Everything your little one needs, all in one place. From first outfits to first bicycles —
                we bring quality, safety, and joy to every stage of childhood.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-8 flex flex-wrap gap-4"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-pink-200"
                  >
                    Shop Now
                    <FiArrowRight className="h-4 w-4" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/about"
                    className="inline-flex items-center gap-2 border-2 border-gray-200 hover:border-pink-300 text-gray-700 font-semibold px-8 py-3.5 rounded-xl transition-all"
                  >
                    Our Story
                  </Link>
                </motion.div>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-10 flex items-center gap-6 text-sm text-gray-500"
              >
                <span className="flex items-center gap-1"><FiShield className="text-pink-500" /> Safe & Secure</span>
                <span className="flex items-center gap-1"><FiStar className="text-pink-500" /> 5-Star Rated</span>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative hidden lg:block"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full blur-3xl opacity-30"></div>
              <motion.img
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                src="https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&h=600&fit=crop"
                alt="Happy baby with toys"
                className="relative rounded-3xl shadow-2xl w-full max-w-md mx-auto object-cover aspect-square border-4 border-white"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Shop by Category</h2>
            <p className="mt-3 text-gray-600">Find exactly what your little one needs</p>
          </AnimatedSection>
          <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4" staggerDelay={0.08}>
            {categories.map((cat) => (
              <StaggerItem key={cat.name}>
                <motion.div whileHover={{ scale: 1.08, y: -5 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/products"
                    className={`${cat.color} border rounded-2xl p-4 text-center hover:shadow-lg transition-all block`}
                  >
                    <cat.icon className="text-3xl mx-auto mb-2" />
                    <span className="text-sm font-medium">{cat.name}</span>
                  </Link>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
              <p className="mt-2 text-gray-600">Handpicked favorites for your little ones</p>
            </div>
            <motion.div whileHover={{ x: 5 }}>
              <Link to="/products" className="hidden sm:flex items-center gap-1 text-pink-500 font-medium hover:text-pink-600">
                View All <FiArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.slice(0, 4).map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection direction="left">
              <motion.img
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                src="https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=600&h=400&fit=crop"
                alt="Happy family"
                className="rounded-3xl shadow-xl w-full object-cover aspect-video"
              />
            </AnimatedSection>
            <AnimatedSection direction="right">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                Made with <GiHeartBeats className="text-pink-500" /> Love, for the Ones You Love Most
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                At Limbaby kiddies, we believe every child deserves the best start in life. That's why we carefully
                select every product in our collection — from the softest fabrics to the safest materials.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Whether it's their first pair of shoes, their favorite toy, or the car seat that keeps them safe,
                we're here to make those important moments a little easier for parents.
              </p>
              <motion.div whileHover={{ x: 5 }}>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-pink-500 font-semibold hover:text-pink-600"
                >
                  Read Our Story <FiArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Parents Choose Us</h2>
            <p className="mt-3 text-gray-600">Trusted by thousands of families</p>
          </AnimatedSection>
          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.15}>
            <StaggerItem>
              <motion.div whileHover={{ y: -8, scale: 1.02 }} className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-xl transition-all border border-pink-100">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-14 h-14 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4"
                >
                  <FiShield className="h-7 w-7 text-pink-500" />
                </motion.div>
                <h3 className="font-semibold text-gray-900 mb-2">Safety First</h3>
                <p className="text-sm text-gray-600">All products meet strict safety standards and certifications.</p>
              </motion.div>
            </StaggerItem>
            <StaggerItem>
              <motion.div whileHover={{ y: -8, scale: 1.02 }} className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-xl transition-all border border-blue-100">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4"
                >
                  <GiHeartBeats className="h-7 w-7 text-blue-500" />
                </motion.div>
                <h3 className="font-semibold text-gray-900 mb-2">Premium Quality</h3>
                <p className="text-sm text-gray-600">We source only the finest materials for lasting comfort.</p>
              </motion.div>
            </StaggerItem>
            <StaggerItem>
              <motion.div whileHover={{ y: -8, scale: 1.02 }} className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-xl transition-all border border-green-100">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4"
                >
                  <FiTruck className="h-7 w-7 text-green-500" />
                </motion.div>
                <h3 className="font-semibold text-gray-900 mb-2">Fast Delivery</h3>
                <p className="text-sm text-gray-600">Quick and reliable shipping right to your doorstep.</p>
              </motion.div>
            </StaggerItem>
            <StaggerItem>
              <motion.div whileHover={{ y: -8, scale: 1.02 }} className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-xl transition-all border border-yellow-100">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-14 h-14 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4"
                >
                  <FiStar className="h-7 w-7 text-yellow-500" />
                </motion.div>
                <h3 className="font-semibold text-gray-900 mb-2">5-Star Reviews</h3>
                <p className="text-sm text-gray-600">Loved by parents with thousands of happy reviews.</p>
              </motion.div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Best Sellers</h2>
              <p className="mt-2 text-gray-600">Most loved by families like yours</p>
            </div>
            <motion.div whileHover={{ x: 5 }}>
              <Link to="/products" className="hidden sm:flex items-center gap-1 text-pink-500 font-medium hover:text-pink-600">
                View All <FiArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.slice(0, 4).map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-pink-500 via-pink-600 to-purple-500 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Give Your Little One the Best Start
            </h2>
            <p className="text-pink-100 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of parents who trust Limbaby kiddies for quality, safe, and delightful products for their children.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-white text-pink-500 font-semibold px-8 py-3.5 rounded-xl hover:bg-pink-50 transition-colors shadow-xl"
              >
                Start Shopping
                <FiArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
