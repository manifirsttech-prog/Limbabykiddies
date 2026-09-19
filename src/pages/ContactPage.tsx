import { useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle, Facebook, Instagram, Twitter, Send, CheckCircle } from 'lucide-react';

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
      <section className="bg-gradient-to-br from-pink-50 to-purple-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-lg text-gray-600">
            We'd love to hear from you. Reach out with questions, feedback, or just to say hello!
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5 text-pink-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Email</h3>
                    <p className="text-gray-600">hello@littlebloom.com</p>
                    <p className="text-gray-600">support@littlebloom.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center shrink-0">
                    <Phone className="h-5 w-5 text-pink-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Phone</h3>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                    <p className="text-sm text-gray-500">Mon - Fri, 9am - 6pm</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                    <MessageCircle className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">WhatsApp</h3>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                    <p className="text-sm text-gray-500">Quick responses during business hours</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Address</h3>
                    <p className="text-gray-600">123 Kids Lane, Happy Town, HT 10001</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-8">
                <h3 className="font-medium text-gray-900 mb-3">Follow Us</h3>
                <div className="flex gap-3">
                  <a href="#" className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-pink-100 hover:text-pink-500 transition-colors" aria-label="Facebook">
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-pink-100 hover:text-pink-500 transition-colors" aria-label="Instagram">
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-pink-100 hover:text-pink-500 transition-colors" aria-label="Twitter">
                    <Twitter className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
              {submitted ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-600">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-sm"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-sm"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input
                      id="subject"
                      type="text"
                      required
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-sm"
                      placeholder="How can we help?"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-sm resize-none"
                      placeholder="Tell us more..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    <Send className="h-4 w-4" />
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
