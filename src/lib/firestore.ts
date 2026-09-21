import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy
} from 'firebase/firestore';
import { db } from './firebase';
import { Product, ProductCategory } from '../types/product';
import { Order } from '../types/order';

const PRODUCTS_COLLECTION = 'products';
const ORDERS_COLLECTION = 'orders';

// Helper function to remove undefined values from object
const removeUndefined = (obj: any): any => {
  const cleaned: any = {};
  Object.keys(obj).forEach(key => {
    if (obj[key] !== undefined) {
      cleaned[key] = obj[key];
    }
  });
  return cleaned;
};

// Fetch all products
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    const products: Product[] = [];
    
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data()
      } as Product);
    });
    
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Fetch product by slug
export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      where('slug', '==', slug)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    } as Product;
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    throw error;
  }
};

// Fetch featured products
export const getFeaturedProducts = async (): Promise<Product[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    const products: Product[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.featured === true) {
        products.push({
          id: doc.id,
          ...data
        } as Product);
      }
    });
    
    return products;
  } catch (error) {
    console.error('Error fetching featured products:', error);
    throw error;
  }
};

// Fetch latest product from each category
export const getLatestFromEachCategory = async (): Promise<Product[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    const allProducts: Product[] = [];
    
    querySnapshot.forEach((doc) => {
      allProducts.push({
        id: doc.id,
        ...doc.data()
      } as Product);
    });
    
    // Group products by category
    const categoryMap = new Map<string, Product[]>();
    allProducts.forEach(product => {
      if (!categoryMap.has(product.category)) {
        categoryMap.set(product.category, []);
      }
      categoryMap.get(product.category)!.push(product);
    });
    
    // Get the latest product from each category (first one in each group)
    const latestProducts: Product[] = [];
    categoryMap.forEach(products => {
      if (products.length > 0) {
        latestProducts.push(products[0]);
      }
    });
    
    return latestProducts;
  } catch (error) {
    console.error('Error fetching latest products from each category:', error);
    throw error;
  }
};

// Fetch best sellers
export const getBestSellers = async (): Promise<Product[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    const products: Product[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.bestSeller === true) {
        products.push({
          id: doc.id,
          ...data
        } as Product);
      }
    });
    
    return products;
  } catch (error) {
    console.error('Error fetching best sellers:', error);
    throw error;
  }
};

// Fetch products by category
export const getProductsByCategory = async (category: ProductCategory): Promise<Product[]> => {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      where('category', '==', category),
      orderBy('name')
    );
    
    const querySnapshot = await getDocs(q);
    const products: Product[] = [];
    
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data()
      } as Product);
    });
    
    return products;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
};

// Add new product
export const addProduct = async (product: Omit<Product, 'id'>): Promise<string> => {
  try {
    // Remove undefined values before saving to Firestore
    const cleanProduct = removeUndefined(product);
    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), cleanProduct);
    return docRef.id;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

// Update product
export const updateProduct = async (productId: string, productData: Partial<Product>): Promise<void> => {
  try {
    // Remove undefined values before updating in Firestore
    const cleanProductData = removeUndefined(productData);
    const productRef = doc(db, PRODUCTS_COLLECTION, productId);
    await updateDoc(productRef, cleanProductData);
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// Delete product
export const deleteProduct = async (productId: string): Promise<void> => {
  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, productId);
    await deleteDoc(productRef);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// --- ORDER FUNCTIONS ---

// Add new order
export const createOrder = async (orderData: Omit<Order, 'id'>): Promise<string> => {
  try {
    const cleanOrder = removeUndefined(orderData);
    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), {
      ...cleanOrder,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Fetch all orders
export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, ORDERS_COLLECTION));
    const orders: Order[] = [];
    
    querySnapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        ...doc.data()
      } as Order);
    });

    // Sort by newest date first
    orders.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
    
    return orders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

// Update order status
export const updateOrderStatus = async (orderId: string, status: Order['status']): Promise<void> => {
  try {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(orderRef, { status });
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

// Delete order
export const deleteOrder = async (orderId: string): Promise<void> => {
  try {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    await deleteDoc(orderRef);
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};

// Reduce product stock after successful order
export const reduceProductStock = async (productId: string, quantityOrdered: number): Promise<void> => {
  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, productId);
    const productSnap = await getDoc(productRef);
    
    if (!productSnap.exists()) {
      console.error(`Product ${productId} not found`);
      return;
    }
    
    const currentStock = productSnap.data().stock || 0;
    const newStock = Math.max(0, currentStock - quantityOrdered);
    
    // Update stock
    await updateDoc(productRef, { 
      stock: newStock,
      // If stock reaches 0, mark as out-of-stock
      status: newStock === 0 ? 'out-of-stock' : productSnap.data().status
    });
    
    console.log(`✅ Stock updated for product ${productId}: ${currentStock} → ${newStock}`);
  } catch (error) {
    console.error('Error reducing product stock:', error);
    throw error;
  }
};

// Reduce stock for multiple products (for orders with multiple items)
export const reduceMultipleProductsStock = async (items: Array<{ productId: string; quantity: number }>): Promise<void> => {
  try {
    const stockUpdatePromises = items.map(item => 
      reduceProductStock(item.productId, item.quantity)
    );
    
    await Promise.all(stockUpdatePromises);
    console.log('✅ All product stocks updated successfully');
  } catch (error) {
    console.error('Error reducing multiple products stock:', error);
    throw error;
  }
};


// --- CONTACT MESSAGE FUNCTIONS ---

import { ContactMessage } from '../types/contact';

const CONTACT_MESSAGES_COLLECTION = 'contactMessages';

// Create new contact message
export const createContactMessage = async (messageData: Omit<ContactMessage, 'id'>): Promise<string> => {
  try {
    const cleanMessage = removeUndefined(messageData);
    const docRef = await addDoc(collection(db, CONTACT_MESSAGES_COLLECTION), {
      ...cleanMessage,
      createdAt: new Date().toISOString(),
      status: 'unread'
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating contact message:', error);
    throw error;
  }
};

// Fetch all contact messages
export const getAllContactMessages = async (): Promise<ContactMessage[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, CONTACT_MESSAGES_COLLECTION));
    const messages: ContactMessage[] = [];
    
    querySnapshot.forEach((doc) => {
      messages.push({
        id: doc.id,
        ...doc.data()
      } as ContactMessage);
    });

    // Sort by newest date first
    messages.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
    
    return messages;
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    throw error;
  }
};

// Update message status (mark as read/replied)
export const updateMessageStatus = async (messageId: string, status: ContactMessage['status']): Promise<void> => {
  try {
    const messageRef = doc(db, CONTACT_MESSAGES_COLLECTION, messageId);
    await updateDoc(messageRef, { status });
  } catch (error) {
    console.error('Error updating message status:', error);
    throw error;
  }
};

// Delete contact message
export const deleteContactMessage = async (messageId: string): Promise<void> => {
  try {
    const messageRef = doc(db, CONTACT_MESSAGES_COLLECTION, messageId);
    await deleteDoc(messageRef);
  } catch (error) {
    console.error('Error deleting contact message:', error);
    throw error;
  }
};
