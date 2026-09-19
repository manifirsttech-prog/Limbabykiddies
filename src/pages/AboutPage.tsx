import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiShield, FiHeart } from 'react-icons/fi';
import { GiHeartBeats } from 'react-icons/gi';
import { FaChild, FaHandsHelping } from 'react-icons/fa';
import { BsEmojiSmile } from 'react-icons/bs';
import AnimatedSection from '../components/AnimatedSection';
import StaggerContainer, { StaggerItem } from '../components/StaggerContainer';

export default function AboutPage() {
  return (
    <main>
      <section className="bg-gradient-to-br from-pink-50 to-purple-50 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Story</h1>
            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Limbaby kiddies was born from a simple belief: every child deserves products that are safe,
              beautiful, and made with love. We're here to support parents on their most important journey.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection direction="left">
              <motion.img whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}
                src="https://images.unsplash.com/photo-1472162072942-cd5147eb3902?w=600&h=400&fit=crop"
                alt="Happy family playing together" className="rounded-3xl shadow-xl w-full object-cover aspect-video" />
            </AnimatedSection>
            <AnimatedSection direction="right">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                From Parents, For Parents <FiHeart className="text-pink-500" />
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Limbaby kiddies started in 2020 when our founders — both parents of young children —
                struggled to find a single trusted place for quality baby and kids products. They
                wanted safety-certified car seats, organic clothing, educational toys, and everything
                in between, without compromising on quality or style.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                So they built Limbaby kiddies. A place where parents can shop with confidence, knowing
                every product has been carefully vetted for safety, quality, and joy.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Today, we serve thousands of families who trust us with the most important purchases
                for their little ones. And we take that trust seriously — every single day.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission & Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">We're driven by a deep commitment to children's wellbeing and parents' peace of mind.</p>
          </AnimatedSection>
          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.15}>
            <StaggerItem>
              <motion.div whileHover={{ y: -8, scale: 1.02 }} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all border border-pink-100">
                <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }} className="w-14 h-14 bg-pink-100 rounded-2xl flex items-center justify-center mb-4">
                  <FiShield className="h-7 w-7 text-pink-500" />
                </motion.div>
                <h3 className="font-semibold text-gray-900 mb-2">Safety Always</h3>
                <p className="text-sm text-gray-600">Every product meets or exceeds international safety standards. Your child's safety is non-negotiable.</p>
              </motion.div>
            </StaggerItem>
            <StaggerItem>
              <motion.div whileHover={{ y: -8, scale: 1.02 }} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all border border-blue-100">
                <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }} className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
                  <GiHeartBeats className="h-7 w-7 text-blue-500" />
                </motion.div>
                <h3 className="font-semibold text-gray-900 mb-2">Made with Love</h3>
                <p className="text-sm text-gray-600">We partner with brands that share our passion for quality and care in every detail.</p>
              </motion.div>
            </StaggerItem>
            <StaggerItem>
              <motion.div whileHover={{ y: -8, scale: 1.02 }} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all border border-green-100">
                <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }} className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
                  <BsEmojiSmile className="h-7 w-7 text-green-500" />
                </motion.div>
                <h3 className="font-semibold text-gray-900 mb-2">Joy in Childhood</h3>
                <p className="text-sm text-gray-600">We believe childhood should be filled with wonder, play, and beautiful moments.</p>
              </motion.div>
            </StaggerItem>
            <StaggerItem>
              <motion.div whileHover={{ y: -8, scale: 1.02 }} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all border border-purple-100">
                <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }} className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-4">
                  <FaHandsHelping className="h-7 w-7 text-purple-500" />
                </motion.div>
                <h3 className="font-semibold text-gray-900 mb-2">Community First</h3>
                <p className="text-sm text-gray-600">We're building a community of parents who support each other through every milestone.</p>
              </motion.div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Because Every Moment Matters</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Childhood is fleeting. The first steps, the first words, the first day of school —
              these moments shape who our children become. At Limbaby kiddies, we're honored to be part
              of these journeys, providing the tools, comfort, and joy that make each day a little
              more magical.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              To every parent reading this: you're doing an incredible job. And we're here to make
              your journey just a little bit easier, one carefully chosen product at a time.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/products" className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-pink-200">
                Explore Our Collection <FiArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
