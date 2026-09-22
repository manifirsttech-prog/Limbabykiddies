type ProductLine = {
  productName: string;
  quantity: number;
  price: number;
  image?: string;
  size?: string;
  color?: string;
};

export type OrderEmailPayload = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  notes?: string;
  paymentReference?: string;
  paymentMethod?: string;
  total: number;
  orderDate: string;
  items: ProductLine[];
};

type ContactEmailPayload = { name: string; email: string; whatsapp: string; subject: string; message: string };

async function send(type: 'order' | 'contact', data: OrderEmailPayload | ContactEmailPayload) {
  const response = await fetch('/api/email', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type, data }) });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || 'Unable to send email notification.');
}

export const sendOrderEmails = (order: OrderEmailPayload) => send('order', order);
export const sendContactEmail = (data: ContactEmailPayload) => send('contact', data);