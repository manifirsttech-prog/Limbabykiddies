import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Truck, Shield, RotateCcw, Minus, Plus, ChevronRight } from 'lucide-react';
import { getProductBySlug } from '../data/products';
import { useCart } from '../context/CartContext';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = getProductBySlug(slug || '');
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [addedToCart, setAddedToCart] = useState(false);

  if (!product) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
        <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
        <Link to="/products" className="text-pink-500 font-medium hover:text-pink-600">
          ← Back to Products
        </Link>
      </main>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize || undefined, selectedColor || undefined);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  // JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images,
    description: product.description,
    brand: { '@type': 'Brand', name: 'LittleBloom' },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'USD',
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-pink-500">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/products" className="hover:text-pink-500">Products</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Product Image */}
        <section>
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        {/* Product Info */}
        <section>
          <p className="text-sm font-medium text-pink-500 uppercase tracking-wide mb-2">
            {product.category}
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            {product.name}
          </h1>
          <p className="text-3xl font-bold text-gray-900 mb-4">
            ${product.price.toFixed(2)}
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">
            {product.description}
          </p>

          {/* Stock Status */}
          <div className="mb-6">
            {product.stock > 0 ? (
              <p className="text-sm text-green-600 font-medium">✓ In Stock ({product.stock} available)</p>
            ) : (
              <p className="text-sm text-red-500 font-medium">✗ Out of Stock</p>
            )}
          </div>

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      selectedSize === size
                        ? 'border-pink-500 bg-pink-50 text-pink-700'
                        : 'border-gray-200 text-gray-700 hover:border-pink-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      selectedColor === color
                        ? 'border-pink-500 bg-pink-50 text-pink-700'
                        : 'border-gray-200 text-gray-700 hover:border-pink-300'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center font-medium text-lg">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 disabled:bg-gray-300 text-white font-semibold py-3.5 rounded-lg transition-colors shadow-lg shadow-pink-200"
          >
            <ShoppingCart className="h-5 w-5" />
            {addedToCart ? '✓ Added to Cart!' : 'Add to Cart'}
          </button>

          {/* Product Info */}
          <div className="mt-8 space-y-4 border-t border-gray-100 pt-6">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Truck className="h-5 w-5 text-pink-500" />
              <span>Free delivery on orders over $50</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Shield className="h-5 w-5 text-pink-500" />
              <span>Safety certified and quality guaranteed</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <RotateCcw className="h-5 w-5 text-pink-500" />
              <span>30-day hassle-free returns</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
