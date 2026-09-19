import { Link } from 'react-router-dom';
import { Heart, Shield, Smile, Users, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-br from-pink-50 to-purple-50 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our Story
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            LittleBloom was born from a simple belief: every child deserves products that are safe, 
            beautiful, and made with love. We're here to support parents on their most important journey.
          </p>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1472162072942-cd5147eb3902?w=600&h=400&fit=crop"
                alt="Happy family playing together"
                className="rounded-2xl shadow-lg w-full object-cover aspect-video"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                From Parents, For Parents
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                LittleBloom started in 2020 when our founders — both parents of young children — 
                struggled to find a single trusted place for quality baby and kids products. They 
                wanted safety-certified car seats, organic clothing, educational toys, and everything 
                in between, without compromising on quality or style.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                So they built LittleBloom. A place where parents can shop with confidence, knowing 
                every product has been carefully vetted for safety, quality, and joy.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Today, we serve thousands of families who trust us with the most important purchases 
                for their little ones. And we take that trust seriously — every single day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission & Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're driven by a deep commitment to children's wellbeing and parents' peace of mind.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-pink-500" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Safety Always</h3>
              <p className="text-sm text-gray-600">
                Every product meets or exceeds international safety standards. Your child's safety is non-negotiable.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Made with Love</h3>
              <p className="text-sm text-gray-600">
                We partner with brands that share our passion for quality and care in every detail.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Smile className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Joy in Childhood</h3>
              <p className="text-sm text-gray-600">
                We believe childhood should be filled with wonder, play, and beautiful moments.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Community First</h3>
              <p className="text-sm text-gray-600">
                We're building a community of parents who support each other through every milestone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Motivational Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Because Every Moment Matters
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            Childhood is fleeting. The first steps, the first words, the first day of school — 
            these moments shape who our children become. At LittleBloom, we're honored to be part 
            of these journeys, providing the tools, comfort, and joy that make each day a little 
            more magical.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            To every parent reading this: you're doing an incredible job. And we're here to make 
            your journey just a little bit easier, one carefully chosen product at a time.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold px-8 py-3.5 rounded-lg transition-colors shadow-lg shadow-pink-200"
          >
            Explore Our Collection
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
