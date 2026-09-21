import { addDoc, collection } from 'firebase/firestore';
import { db } from './firebase';

// Sample products to seed the database
const sampleProducts = [
  {
    name: 'Kids Water Bottle - Insulated',
    slug: 'kids-water-bottle-insulated',
    category: 'Others',
    price: 8500,
    description: 'Stainless steel insulated water bottle perfect for school and sports. Keeps drinks cold for 24 hours or hot for 12 hours. BPA-free, leak-proof lid, and kid-friendly design with easy-grip handle. Available in fun colors.',
    images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=600&fit=crop'],
    colors: ['Blue', 'Pink', 'Green', 'Purple'],
    stock: 50,
    status: 'active',
    featured: true,
    bestSeller: false,
  },
  {
    name: 'Organic Cotton Baby Onesie',
    slug: 'organic-cotton-baby-onesie',
    category: 'Clothing',
    price: 12500,
    description: 'Ultra-soft organic cotton onesie perfect for your baby\'s delicate skin. Made with 100% GOTS-certified organic cotton, this onesie features snap closures for easy diaper changes and a comfortable fit that grows with your little one.',
    images: ['https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600&h=600&fit=crop'],
    sizes: ['0-3M', '3-6M', '6-12M', '12-18M'],
    colors: ['White', 'Pink', 'Blue', 'Mint'],
    stock: 45,
    status: 'active',
    featured: true,
    bestSeller: true,
  },
  {
    name: 'Kids Sneakers - Adventure Edition',
    slug: 'kids-sneakers',
    category: 'Shoes',
    price: 20000,
    description: 'Lightweight and comfortable sneakers designed for active kids. Features non-slip soles, breathable mesh upper, and fun color accents. Perfect for school, play, and everyday adventures.',
    images: ['https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&h=600&fit=crop'],
    sizes: ['US 9', 'US 10', 'US 11', 'US 12', 'US 13'],
    colors: ['Blue/White', 'Pink/White', 'Green/White'],
    stock: 32,
    status: 'active',
    featured: true,
    bestSeller: true,
  },
  {
    name: 'Rainbow School Backpack',
    slug: 'rainbow-school-backpack',
    category: 'School Bags',
    price: 17500,
    description: 'A colorful and spacious backpack designed for young learners. Features padded shoulder straps, multiple compartments, a water bottle holder, and a reflective safety strip for visibility.',
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop'],
    colors: ['Rainbow', 'Unicorn', 'Space', 'Dinosaur'],
    stock: 28,
    status: 'active',
    featured: true,
    bestSeller: false,
  },
  {
    name: '16-inch Kids Bicycle',
    slug: 'kids-bicycle-16-inch',
    category: 'Bicycles',
    price: 75000,
    description: 'The perfect first real bicycle for kids aged 4-7. Features training wheels, adjustable seat height, hand brakes, and a lightweight aluminum frame. Comes in fun colors with safety bell included.',
    images: ['https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=600&h=600&fit=crop'],
    colors: ['Red', 'Blue', 'Pink', 'Green'],
    stock: 12,
    status: 'active',
    featured: true,
    bestSeller: true,
  },
  {
    name: 'Wooden Building Blocks Set',
    slug: 'wooden-building-blocks',
    category: 'Toys',
    price: 22500,
    description: '100-piece wooden building blocks set in various shapes and colors. Made from sustainably sourced wood with non-toxic paint. Encourages creativity, motor skills, and spatial awareness.',
    images: ['https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&h=600&fit=crop'],
    stock: 38,
    status: 'active',
    featured: true,
    bestSeller: true,
  },
];

// Helper function to remove undefined values
const removeUndefined = (obj: any): any => {
  const cleaned: any = {};
  Object.keys(obj).forEach(key => {
    if (obj[key] !== undefined) {
      cleaned[key] = obj[key];
    }
  });
  return cleaned;
};

// Seed the database with sample products
export const seedProducts = async () => {
  try {
    console.log('🌱 Starting product seeding...');
    
    for (const product of sampleProducts) {
      const cleanProduct = removeUndefined(product);
      await addDoc(collection(db, 'products'), cleanProduct);
      console.log(`✅ Added: ${product.name}`);
    }
    
    console.log('🎉 Seeding complete! All products added successfully.');
    return true;
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    throw error;
  }
};
