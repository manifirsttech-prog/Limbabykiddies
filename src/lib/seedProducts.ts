import { addDoc, collection } from 'firebase/firestore';
import { db } from './firebase';

// Sample products array - now empty, add your own products through the admin dashboard
const sampleProducts: any[] = [];

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
