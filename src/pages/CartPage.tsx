import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, CreditCard, Truck, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    notes: '',
  });

  const deliveryFee = totalPrice >= 50 ? 0 : 5.99;
  const orderTotal = totalPrice + deliveryFee;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderPlaced(true);
    clearCart();
  };

  if (orderPlaced) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-8 w-8 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for your order! We'll send you a confirmation email shortly with tracking details.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          Continue Shopping
        </Link>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-16 text-center">
        <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          Browse Products
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <section className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => (
              <article
                key={item.product.id}
                className="flex gap-4 bg-white rounded-xl border border-gray-100 p-4 shadow-sm"
              >
                <Link to={`/products/${item.product.slug}`} className="shrink-0">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/products/${item.product.slug}`}>
                    <h3 className="font-semibold text-gray-900 hover:text-pink-500 transition-colors">
                      {item.product.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {item.product.category}
                    {item.selectedSize && ` • Size: ${item.selectedSize}`}
                    {item.selectedColor && ` • Color: ${item.selectedColor}`}
                  </p>
                  <p className="font-bold text-gray-900 mt-1">${item.product.price.toFixed(2)}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-md hover:bg-gray-50"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-md hover:bg-gray-50"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-red-400 hover:text-red-500 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Order Summary & Checkout */}
        <aside className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery</span>
                <span className="font-medium">
                  {deliveryFee === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    `$${deliveryFee.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-lg text-gray-900">${orderTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Customer Info Form */}
            <form onSubmit={handlePlaceOrder} className="mt-6 space-y-3">
              <h3 className="font-semibold text-gray-900 text-sm">Customer Information</h3>
              <input
                type="text"
                placeholder="Full Name"
                required
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
              <input
                type="email"
                placeholder="Email Address"
                required
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                required
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
              <input
                type="text"
                placeholder="Delivery Address"
                required
                value={customerInfo.address}
                onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
              <input
                type="text"
                placeholder="City"
                required
                value={customerInfo.city}
                onChange={(e) => setCustomerInfo({ ...customerInfo, city: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
              <textarea
                placeholder="Order notes (optional)"
                rows={2}
                value={customerInfo.notes}
                onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none"
              />

              {/* Payment Section */}
              <div className="border-t border-gray-100 pt-4 mt-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <CreditCard className="h-4 w-4 text-pink-500" />
                  <span>Payment: Cash on Delivery (Mock)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <Truck className="h-4 w-4 text-pink-500" />
                  <span>Estimated delivery: 3-5 business days</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-lg transition-colors shadow-lg shadow-pink-200"
              >
                Place Order — ${orderTotal.toFixed(2)}
              </button>
            </form>
          </div>
        </aside>
      </div>
    </main>
  );
}
