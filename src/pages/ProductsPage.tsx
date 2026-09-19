import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';
import { ProductCategory } from '../types/product';

const categories: (ProductCategory | 'All')[] = [
  'All',
  'Clothing',
  'Shoes',
  'School Bags',
  'Bicycles',
  'Car Seats',
  'Baby Accessories',
  'Toys',
];

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    let result = products;

    if (selectedCategory !== 'All') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    return result;
  }, [selectedCategory, searchQuery]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <section className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Our Products</h1>
        <p className="mt-2 text-gray-600">
          Discover quality products for every stage of your child's journey
        </p>
      </section>

      {/* Search & Filters */}
      <section className="mb-8">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="search"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-sm"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Results Count */}
      <p className="text-sm text-gray-500 mb-6">
        Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
        {selectedCategory !== 'All' && ` in ${selectedCategory}`}
      </p>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No products found. Try a different search or category.</p>
        </div>
      )}
    </main>
  );
}
