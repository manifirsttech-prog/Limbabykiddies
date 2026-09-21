export interface OrderItem {
  productId?: string;
  productName: string;
  quantity: number;
  price: number;
  image: string;
  size?: string;
  color?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  city?: string;
  notes?: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'Paystack' | 'Cash on Delivery';
  paymentReference?: string;
  paymentStatus: 'paid' | 'pending' | 'failed';
  date: string;
  createdAt?: any;
}
