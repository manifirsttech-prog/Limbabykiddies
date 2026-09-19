import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';
import { FaFacebookF, FaInstagram, FaTwitter, FaWhatsapp, FaCheckCircle } from 'react-icons/fa';
import AnimatedSection from '../components/AnimatedSection';
import AnimatedEmoji from '../components/AnimatedEmoji';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main>
      {/* Header */}
      <section className="bg-gradient-to-br from-pink-50 to-purple-50 py-16 relative overflow-hidden">
        {/* Floating emojis */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-20 left-10 text-4xl opacity-20">📞</motion.div>
          <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute bottom-20 right-20 text-3xl opacity-20">💌</motion.div>
          <motion.div animate={{ y: [0, -10, 0], x: [0, 15, 0] }} transition={{ duration: 6, repeat: Infinity }} className="absolute top-1/3 right-1/4 text-3xl opacity-20">📧</motion.div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <AnimatedEmoji emoji="📬" size="xl" animation="float" className="mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Get in Touch <AnimatedEmoji emoji="💬" size="md" animation="wiggle" />
            </h1>
            <p className="text-lg text-gray-600">
              We'd love to hear from you 😊. Reach out with questions ❓, feedback 💭, or just to say hello 👋!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <AnimatedSection direction="left">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span>📱</span> Contact Information
                </h2>
                <div className="space-y-6">
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-pink-50 transition-colors"
                  >
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center shrink-0"
                    >
                      <FiMail className="h-5 w-5 text-pink-500" />
                    </motion.div>
                    <div>
                      <h3 className="font-medium text-gray-900 flex items-center gap-2">📧 Email</h3>
                      <p className="text-gray-600">hello@littlebloom.com</p>
                      <p className="text-gray-600">support@littlebloom.com</p>
                    </div>
                  </motion.div>
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-blue-50 transition-colors"
                  >
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0"
                    >
                      <FiPhone className="h-5 w-5 text-blue-500" />
                    </motion.div>
                    <div>
                      <h3 className="font-medium text-gray-900 flex items-center gap-2">📞 Phone</h3>
                      <p className="text-gray-600">+1 (555) 123-4567</p>
                      <p className="text-sm text-gray-500">Mon - Fri, 9am - 6pm 🕐</p>
                    </div>
                  </motion.div>
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-green-50 transition-colors"
                  >
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center shrink-0"
                    >
                      <FaWhatsapp className="h-5 w-5 text-green-500" />
                    </motion.div>
                    <div>
                      <h3 className="font-medium text-gray-900 flex items-center gap-2">💬 WhatsApp</h3>
                      <p className="text-gray-600">+1 (555) 123-4567</p>
                      <p className="text-sm text-gray-500">Quick responses during business hours ⚡</p>
                    </div>
                  </motion.div>
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-purple-50 transition-colors"
                  >
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center shrink-0"
                    >
                      <FiMapPin className="h-5 w-5 text-purple-500" />
                    </motion.div>
                    <div>
                      <h3 className="font-medium text-gray-900 flex items-center gap-2">📍 Address</h3>
                      <p className="text-gray-600">123 Kids Lane, Happy Town, HT 10001 🏡</p>
                    </div>
                  </motion.div>
                </div>

                {/* Social Links */}
                <div className="mt-8">
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <span>🌐</span> Follow Us
                  </h3>
                  <div className="flex gap-3">
                    <motion.a
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      whileTap={{ scale: 0.9 }}
                      href="#"
                      className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                      aria-label="Facebook"
                    >
                      <FaFacebookF className="h-5 w-5" />
                    </motion.a>
                    <motion.a
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      whileTap={{ scale: 0.9 }}
                      href="#"
                      className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 hover:bg-pink-100 hover:text-pink-600 transition-colors"
                      aria-label="Instagram"
                    >
                      <FaInstagram className="h-5 w-5" />
                    </motion.a>
                    <motion.a
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      whileTap={{ scale: 0.9 }}
                      href="#"
                      className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 hover:bg-blue-100 hover:text-blue-400 transition-colors"
                      aria-label="Twitter"
                    >
                      <FaTwitter className="h-5 w-5" />
                    </motion.a>
                  </div>
                </div>
              </AnimatedSection>
            </div>

            {/* Contact Form */}
            <div>
              <AnimatedSection direction="right">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span>✉️</span> Send Us a Message
                </h2>
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-green-50 border-2 border-green-200 rounded-2xl p-8 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.2 }}
                    >
                      <FaCheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    </motion.div>
                    <AnimatedEmoji emoji="🎉" size="lg" animation="bounce" className="mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Message Sent!</h3>
                    <p className="text-gray-600">Thank you for reaching out 🙏. We'll get back to you within 24 hours ⏰.</p>
                  </motion.div>
                ) : (
                  <motion.form
                    onSubmit={handleSubmit}
                    className="space-y-4 bg-gray-50 p-6 rounded-2xl border-2 border-gray-100"
                  >
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                        <span>👤</span> Full Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-sm transition-all"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                        <span>📧</span> Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-sm transition-all"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                        <span>📝</span> Subject
                      </label>
                      <input
                        id="subject"
                        type="text"
                        required
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-sm transition-all"
                        placeholder="How can we help?"
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                        <span>💬</span> Message
                      </label>
                      <textarea
                        id="message"
                        required
                        rows={5}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-sm resize-none transition-all"
                        placeholder="Tell us more..."
                      />
                    </div>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-pink-200"
                    >
                      <FiSend className="h-4 w-4" />
                      Send Message 🚀
                    </motion.button>
                  </motion.form>
                )}
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
