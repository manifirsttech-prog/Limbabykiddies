import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';
import { FaInstagram, FaWhatsapp, FaCheckCircle } from 'react-icons/fa';
import AnimatedSection from '../components/AnimatedSection';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main>
      <section className="bg-gradient-to-br from-pink-50 to-purple-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
            <p className="text-lg text-gray-600">We'd love to hear from you. Reach out with questions, feedback, or just to say hello!</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <AnimatedSection direction="left">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
                <div className="space-y-6">
                  <motion.div whileHover={{ x: 5 }} className="flex items-start gap-4 p-4 rounded-xl hover:bg-pink-50 transition-colors">
                    <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }} className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center shrink-0">
                      <FiMail className="h-5 w-5 text-pink-500" />
                    </motion.div>
                    <div>
                      <h3 className="font-medium text-gray-900">Email</h3>
                      <p className="text-gray-600">adelekelollipop@gmail.com</p>
                    </div>
                  </motion.div>
                  <motion.div whileHover={{ x: 5 }} className="flex items-start gap-4 p-4 rounded-xl hover:bg-blue-50 transition-colors">
                    <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }} className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                      <FiPhone className="h-5 w-5 text-blue-500" />
                    </motion.div>
                    <div>
                      <h3 className="font-medium text-gray-900">Phone</h3>
                      <p className="text-gray-600">+2349048298906</p>
                      <p className="text-sm text-gray-500">Always available</p>
                    </div>
                  </motion.div>
                  <motion.div whileHover={{ x: 5 }} className="flex items-start gap-4 p-4 rounded-xl hover:bg-green-50 transition-colors">
                    <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }} className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                      <FaWhatsapp className="h-5 w-5 text-green-500" />
                    </motion.div>
                    <div>
                      <h3 className="font-medium text-gray-900">WhatsApp</h3>
                      <p className="text-gray-600">+2349048298906</p>
                      <p className="text-sm text-gray-500">Quick responses</p>
                    </div>
                  </motion.div>
                  <motion.div whileHover={{ x: 5 }} className="flex items-start gap-4 p-4 rounded-xl hover:bg-purple-50 transition-colors">
                    <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }} className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
                      <FiMapPin className="h-5 w-5 text-purple-500" />
                    </motion.div>
                    <div>
                      <h3 className="font-medium text-gray-900">Address</h3>
                      <p className="text-gray-600">E-mail Opp., to Royal Pine Estate, Before Van Daniel's Street, Orchid Road, Lekki, Lagos State.</p>
                    </div>
                  </motion.div>
                </div>

                <div className="mt-8">
                  <h3 className="font-medium text-gray-900 mb-3">Follow Us</h3>
                  <div className="flex gap-3">
                    <motion.a whileHover={{ scale: 1.2, rotate: 10 }} whileTap={{ scale: 0.9 }} href="https://wa.me/2349048298906" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 hover:bg-green-100 hover:text-green-600 transition-colors" aria-label="WhatsApp">
                      <FaWhatsapp className="h-5 w-5" />
                    </motion.a>
                    <motion.a whileHover={{ scale: 1.2, rotate: 10 }} whileTap={{ scale: 0.9 }} href="https://www.instagram.com/Funmilolanahouli" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 hover:bg-pink-100 hover:text-pink-600 transition-colors" aria-label="Instagram">
                      <FaInstagram className="h-5 w-5" />
                    </motion.a>
                  </div>
                </div>
              </AnimatedSection>
            </div>

            <div>
              <AnimatedSection direction="right">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
                {submitted ? (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-green-50 border-2 border-green-200 rounded-2xl p-8 text-center">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}>
                      <FaCheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    </motion.div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Message Sent!</h3>
                    <p className="text-gray-600">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                  </motion.div>
                ) : (
                  <motion.form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-6 rounded-2xl border-2 border-gray-100">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input id="name" type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-sm transition-all" placeholder="Your name" />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-sm transition-all" placeholder="your@email.com" />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                      <input id="subject" type="text" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-sm transition-all" placeholder="How can we help?" />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                      <textarea id="message" required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-sm resize-none transition-all" placeholder="Tell us more..." />
                    </div>
                    <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-pink-200">
                      <FiSend className="h-4 w-4" /> Send Message
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
