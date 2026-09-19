import { Link } from 'react-router-dom';
import { Heart, Truck, Shield, Star, ArrowRight, Sparkles } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { getFeaturedProducts, getBestSellers } from '../data/products';

const categories = [
  { name: 'Clothing', emoji: '👶', color: 'bg-pink-50 text-pink-700' },
  { name: 'Shoes', emoji: '👟', color: 'bg-blue-50 text-blue-700' },
  { name: 'Toys', emoji: '🧸', color: 'bg-yellow-50 text-yellow-700' },
  { name: 'School Bags', emoji: '🎒', color: 'bg-green-50 text-green-700' },
  { name: 'Bicycles', emoji: '🚲', color: 'bg-purple-50 text-purple-700' },
  { name: 'Car Seats', emoji: '🚗', color: 'bg-red-50 text-red-700' },
  { name: 'Baby Accessories', emoji: '🍼', color: 'bg-orange-50 text-orange-700' },
];

export default function HomePage() {
  const featured = getFeaturedProducts();
  const bestSellers = getBestSellers();

  return (
    <main>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-pink-50 via-white to-purple-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                <Sparkles className="h-4 w-4" />
                New Arrivals for 2024
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Little Things.{' '}
                <span className="text-pink-500">Big Smiles.</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-lg">
                Everything your little one needs, all in one place. From first outfits to first bicycles — 
                we bring quality, safety, and joy to every stage of childhood.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold px-8 py-3.5 rounded-lg transition-colors shadow-lg shadow-pink-200"
                >
                  Shop Now
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 border-2 border-gray-200 hover:border-pink-300 text-gray-700 font-semibold px-8 py-3.5 rounded-lg transition-colors"
                >
                  Our Story
                </Link>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full blur-3xl opacity-30"></div>
              <img
                src="https://image.qwenlm.ai/generated-images/a6726451-73e6-4bf6-a673-34b1fa106b88/_result.png"
                alt="Happy baby with toys"
                className="relative rounded-2xl shadow-2xl w-full max-w-md mx-auto object-cover aspect-square"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Shop by Category</h2>
            <p className="mt-3 text-gray-600">Find exactly what your little one needs</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to="/products"
                className={`${cat.color} rounded-xl p-4 text-center hover:shadow-md transition-shadow`}
              >
                <span className="text-3xl block mb-2">{cat.emoji}</span>
                <span className="text-sm font-medium">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
              <p className="mt-2 text-gray-600">Handpicked favorites for your little ones</p>
            </div>
            <Link to="/products" className="hidden sm:flex items-center gap-1 text-pink-500 font-medium hover:text-pink-600">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=600&h=400&fit=crop"
                alt="Happy family"
                className="rounded-2xl shadow-lg w-full object-cover aspect-video"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Made with Love, for the Ones You Love Most
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                At LittleBloom, we believe every child deserves the best start in life. That's why we carefully 
                select every product in our collection — from the softest fabrics to the safest materials.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Whether it's their first pair of shoes, their favorite toy, or the car seat that keeps them safe, 
                we're here to make those important moments a little easier for parents.
              </p>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-pink-500 font-semibold hover:text-pink-600"
              >
                Read Our Story <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Parents Choose Us</h2>
            <p className="mt-3 text-gray-600">Trusted by thousands of families</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-pink-500" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Safety First</h3>
              <p className="text-sm text-gray-600">All products meet strict safety standards and certifications.</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Heart className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Premium Quality</h3>
              <p className="text-sm text-gray-600">We source only the finest materials for lasting comfort.</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Truck className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-sm text-gray-600">Quick and reliable shipping right to your doorstep.</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6 text-yellow-500" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">5-Star Reviews</h3>
              <p className="text-sm text-gray-600">Loved by parents with thousands of happy reviews.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Best Sellers</h2>
              <p className="mt-2 text-gray-600">Most loved by families like yours</p>
            </div>
            <Link to="/products" className="hidden sm:flex items-center gap-1 text-pink-500 font-medium hover:text-pink-600">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-pink-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Give Your Little One the Best Start
          </h2>
          <p className="text-pink-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of parents who trust LittleBloom for quality, safe, and delightful products for their children.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-white text-pink-500 font-semibold px-8 py-3.5 rounded-lg hover:bg-pink-50 transition-colors shadow-lg"
          >
            Start Shopping
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
