import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Product } from '../types/product';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <article className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <Link to={`/products/${product.slug}`} className="block">
        <div className="aspect-square overflow-hidden bg-gray-50">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/products/${product.slug}`}>
          <p className="text-xs font-medium text-pink-500 uppercase tracking-wide mb-1">
            {product.category}
          </p>
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-pink-500 transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
          {product.stock > 0 ? (
            <span className="text-xs text-green-600 font-medium">In Stock</span>
          ) : (
            <span className="text-xs text-red-500 font-medium">Out of Stock</span>
          )}
        </div>
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="mt-3 w-full flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 disabled:bg-gray-300 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
        >
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </button>
      </div>
    </article>
  );
}
