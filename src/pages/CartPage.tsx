import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiCreditCard, FiTruck, FiCheckCircle, FiUser, FiMail, FiPhone, FiHome, FiFileText } from 'react-icons/fi';
import { FaTshirt, FaShoePrints, FaGraduationCap, FaBicycle, FaCar, FaBaby, FaGamepad } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import AnimatedSection from '../components/AnimatedSection';
import { formatPrice } from '../lib/utils';

const categoryIcons: Record<string, React.ElementType> = {
  Clothing: FaTshirt, Shoes: FaShoePrints, 'School Bags': FaGraduationCap,
  Bicycles: FaBicycle, 'Car Seats': FaCar, 'Baby Accessories': FaBaby, Toys: FaGamepad,
};

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({ name: '', email: '', phone: '', address: '', city: '', notes: '' });

  const deliveryFee = totalPrice >= 25000 ? 0 : 2500;
  const orderTotal = totalPrice + deliveryFee;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderPlaced(true);
    clearCart();
  };

  if (orderPlaced) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-16 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', duration: 0.8 }} className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiCheckCircle className="h-10 w-10 text-green-500" />
        </motion.div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>
        <p className="text-gray-600 mb-8">Thank you for your order! We'll send you a confirmation email shortly with tracking details.</p>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link to="/products" className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg">
            Continue Shopping <FiShoppingBag className="h-4 w-4" />
          </Link>
        </motion.div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-16 text-center">
        <FiShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link to="/products" className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg">
            Browse Products <FiShoppingBag className="h-4 w-4" />
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <AnimatedSection>
        <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          <FiShoppingBag className="h-7 w-7 text-pink-500" />
          Shopping Cart
          <span className="text-lg font-normal text-gray-500">({items.length} items)</span>
        </h1>
      </AnimatedSection>

      <div className="grid lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2">
          <div className="space-y-4">
            <AnimatePresence>
              {items.map((item, i) => {
                const CatIcon = categoryIcons[item.product.category] || FaBaby;
                return (
                  <motion.article key={item.product.id}
                    initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50, height: 0 }} transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.01 }}
                    className="flex gap-4 bg-white rounded-2xl border-2 border-gray-100 p-4 shadow-sm hover:shadow-md transition-all"
                  >
                    <Link to={`/products/${item.product.slug}`} className="shrink-0">
                      <motion.img whileHover={{ scale: 1.05 }} src={item.product.images[0]} alt={item.product.name} className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-xl" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link to={`/products/${item.product.slug}`}>
                        <h3 className="font-semibold text-gray-900 hover:text-pink-500 transition-colors">{item.product.name}</h3>
                      </Link>
                      <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-2 flex-wrap">
                        <CatIcon className="h-3.5 w-3.5" />
                        {item.product.category}
                        {item.selectedSize && <span>• Size: {item.selectedSize}</span>}
                        {item.selectedColor && <span>• Color: {item.selectedColor}</span>}
                      </p>
                      <p className="font-bold text-pink-500 mt-1 text-lg">{formatPrice(item.product.price)}</p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center border-2 border-gray-200 rounded-lg hover:bg-gray-50"
                            aria-label="Decrease quantity"
                          ><FiMinus className="h-3 w-3" /></motion.button>
                          <motion.span key={item.quantity} initial={{ scale: 1.3 }} animate={{ scale: 1 }} className="w-8 text-center text-sm font-bold">
                            {item.quantity}
                          </motion.span>
                          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center border-2 border-gray-200 rounded-lg hover:bg-gray-50"
                            aria-label="Increase quantity"
                          ><FiPlus className="h-3 w-3" /></motion.button>
                        </div>
                        <motion.button whileHover={{ scale: 1.1, rotate: 10 }} whileTap={{ scale: 0.9 }}
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-red-400 hover:text-red-500 transition-colors" aria-label="Remove item"
                        ><FiTrash2 className="h-5 w-5" /></motion.button>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>
        </section>

        <aside className="lg:col-span-1">
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl border-2 border-pink-100 p-6 shadow-lg sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiFileText className="h-5 w-5 text-pink-500" /> Order Summary
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span className="font-medium">{formatPrice(totalPrice)}</span></div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery</span>
                <span className="font-medium">{deliveryFee === 0 ? <span className="text-green-600">Free</span> : formatPrice(deliveryFee)}</span>
              </div>
              <div className="border-t-2 border-pink-100 pt-3 flex justify-between">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-xl text-pink-500">{formatPrice(orderTotal)}</span>
              </div>
            </div>

            <form onSubmit={handlePlaceOrder} className="mt-6 space-y-3">
              <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2"><FiUser className="h-4 w-4 text-pink-500" /> Customer Information</h3>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="text" placeholder="Full Name" required value={customerInfo.name} onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })} className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all" />
              </div>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="email" placeholder="Email Address" required value={customerInfo.email} onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })} className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all" />
              </div>
              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="tel" placeholder="Phone Number" required value={customerInfo.phone} onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })} className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all" />
              </div>
              <div className="relative">
                <FiHome className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="text" placeholder="Delivery Address" required value={customerInfo.address} onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })} className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all" />
              </div>
              <input type="text" placeholder="City" required value={customerInfo.city} onChange={(e) => setCustomerInfo({ ...customerInfo, city: e.target.value })} className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all" />
              <textarea placeholder="Order notes (optional)" rows={2} value={customerInfo.notes} onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })} className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 resize-none transition-all" />

              <div className="border-t-2 border-gray-100 pt-4 mt-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3"><FiCreditCard className="h-4 w-4 text-pink-500" /> Payment: Cash on Delivery (Mock)</div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4"><FiTruck className="h-4 w-4 text-pink-500" /> Estimated delivery: 3-5 business days</div>
              </div>

              <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-pink-200 text-lg"
              >Place Order — {formatPrice(orderTotal)}</motion.button>
            </form>
          </motion.div>
        </aside>
      </div>
    </main>
  );
}
