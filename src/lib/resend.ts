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

const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY;
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'adelekelollipop@gmail.com';
const FROM_EMAIL = import.meta.env.VITE_RESEND_FROM_EMAIL || 'onboarding@resend.dev';

const formatPrice = (value: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(value);
};

const renderOrderItems = (items: ProductLine[]) => {
  return items
    .map((item) => {
      const itemName = `${item.productName}${item.size ? ` (${item.size.toUpperCase()})` : ''}${item.color ? ` - ${item.color}` : ''}`;
      const imageHtml = item.image
        ? `<img src="${item.image}" alt="${item.productName}" style="width: 72px; height: 72px; border-radius: 12px; object-fit: cover; margin-right: 12px;" />`
        : '';

      return `
        <tr>
          <td style="padding: 12px 0;">
            <div style="display: flex; align-items: center; gap: 12px;">
              ${imageHtml}
              <div>
                <div style="font-weight: 700; color: #111827;">${itemName}</div>
                <div style="font-size: 12px; color: #6b7280;">Qty: ${item.quantity}</div>
              </div>
            </div>
          </td>
          <td style="padding: 12px 0; text-align: right; color: #111827; font-weight: 600;">${formatPrice(item.price * item.quantity)}</td>
        </tr>
      `;
    })
    .join('');
};

export async function sendOrderEmails(order: OrderEmailPayload) {
  if (!RESEND_API_KEY) {
    console.warn('Resend API key is not configured. Skipping order email notifications.');
    return;
  }

  const customerHtml = `
    <div style="font-family: Arial, sans-serif; background: #f9fafb; padding: 24px; color: #111827;">
      <div style="max-width: 700px; margin: 0 auto; background: white; border-radius: 18px; padding: 32px; border: 1px solid #f3f4f6;">
        <h1 style="margin: 0 0 12px; color: #ec4899; font-size: 28px;">Thank you for your order!</h1>
        <p style="margin: 0 0 20px; font-size: 16px; color: #374151;">Hi ${order.customerName}, your order has been received and is now being prepared for delivery.</p>

        <div style="background: #fdf2f8; border: 1px solid #fbcfe8; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
          <div style="font-size: 13px; color: #6b7280; margin-bottom: 6px;">Order reference</div>
          <div style="font-weight: 700; font-size: 18px; color: #111827;">${order.paymentReference || 'N/A'}</div>
        </div>

        <div style="margin: 20px 0;">
          <h2 style="font-size: 18px; margin-bottom: 8px;">Delivery details</h2>
          <p style="margin: 4px 0; color: #374151;">Name: ${order.customerName}</p>
          <p style="margin: 4px 0; color: #374151;">Email: ${order.customerEmail}</p>
          <p style="margin: 4px 0; color: #374151;">Phone: ${order.customerPhone}</p>
          <p style="margin: 4px 0; color: #374151;">Address: ${order.customerAddress}</p>
          ${order.notes ? `<p style="margin: 8px 0 0; color: #374151;">Notes: ${order.notes}</p>` : ''}
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr>
              <th style="text-align: left; font-size: 12px; letter-spacing: 0.04em; color: #6b7280; padding-bottom: 12px;">Item</th>
              <th style="text-align: right; font-size: 12px; letter-spacing: 0.04em; color: #6b7280; padding-bottom: 12px;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${renderOrderItems(order.items)}
          </tbody>
        </table>

        <div style="border-top: 1px solid #e5e7eb; margin-top: 24px; padding-top: 16px; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 16px; font-weight: 700; color: #111827;">Total</span>
          <span style="font-size: 22px; font-weight: 800; color: #ec4899;">${formatPrice(order.total)}</span>
        </div>

        <p style="margin-top: 28px; color: #374151; font-size: 15px; line-height: 1.7;">
          Your order will be delivered soon. We will contact you on your phone number for delivery updates.
        </p>
      </div>
    </div>
  `;

  const adminHtml = `
    <div style="font-family: Arial, sans-serif; background: #f9fafb; padding: 24px; color: #111827;">
      <div style="max-width: 760px; margin: 0 auto; background: white; border-radius: 18px; padding: 32px; border: 1px solid #f3f4f6;">
        <h1 style="margin: 0 0 12px; color: #111827; font-size: 28px;">New order received</h1>
        <p style="margin: 0 0 18px; font-size: 16px; color: #374151;">A customer placed a new order on Limbaby Kiddies.</p>

        <div style="background: #f3f4f6; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
          <div style="font-size: 13px; color: #6b7280; margin-bottom: 6px;">Order reference</div>
          <div style="font-weight: 700; font-size: 18px; color: #111827;">${order.paymentReference || 'N/A'}</div>
        </div>

        <div style="margin: 20px 0;">
          <h2 style="font-size: 18px; margin-bottom: 8px;">Customer details</h2>
          <p style="margin: 4px 0; color: #374151;">Name: ${order.customerName}</p>
          <p style="margin: 4px 0; color: #374151;">Email: ${order.customerEmail}</p>
          <p style="margin: 4px 0; color: #374151;">Phone: ${order.customerPhone}</p>
          <p style="margin: 4px 0; color: #374151;">Address: ${order.customerAddress}</p>
          ${order.notes ? `<p style="margin: 8px 0 0; color: #374151;">Notes: ${order.notes}</p>` : ''}
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr>
              <th style="text-align: left; font-size: 12px; letter-spacing: 0.04em; color: #6b7280; padding-bottom: 12px;">Item</th>
              <th style="text-align: right; font-size: 12px; letter-spacing: 0.04em; color: #6b7280; padding-bottom: 12px;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${renderOrderItems(order.items)}
          </tbody>
        </table>

        <div style="border-top: 1px solid #e5e7eb; margin-top: 24px; padding-top: 16px; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 16px; font-weight: 700; color: #111827;">Grand total</span>
          <span style="font-size: 22px; font-weight: 800; color: #ec4899;">${formatPrice(order.total)}</span>
        </div>

        <p style="margin-top: 28px; color: #374151; font-size: 15px; line-height: 1.7;">
          Please log in to the admin dashboard to review the full order and update its status.
        </p>
      </div>
    </div>
  `;

  const payloads = [
    {
      from: FROM_EMAIL,
      to: [order.customerEmail],
      subject: `Your Limbaby Kiddies order confirmation - ${order.paymentReference || 'Order'}`,
      html: customerHtml,
    },
    {
      from: FROM_EMAIL,
      to: [ADMIN_EMAIL],
      subject: `New order received from ${order.customerName} - ${order.paymentReference || 'Order'}`,
      html: adminHtml,
    },
  ];

  const results = await Promise.allSettled(
    payloads.map((payload) =>
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify(payload),
      }).then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(data?.message || `Email request failed with status ${response.status}`);
        }
        return data;
      })
    )
  );

  const rejected = results.filter((result) => result.status === 'rejected');
  if (rejected.length > 0) {
    console.error('Some email notifications failed to send:', rejected);
  }
}

export async function sendContactEmail(data: {
  name: string;
  email: string;
  whatsapp: string;
  subject: string;
  message: string;
}) {
  if (!RESEND_API_KEY) {
    console.warn('Resend API key is not configured. Skipping contact email.');
    return;
  }

  const html = `
    <div style="font-family: Arial, sans-serif; background: #f9fafb; padding: 24px; color: #111827;">
      <div style="max-width: 700px; margin: 0 auto; background: white; border-radius: 18px; padding: 32px; border: 1px solid #f3f4f6;">
        <h1 style="margin: 0 0 12px; color: #ec4899; font-size: 28px;">New contact message</h1>
        <p style="margin: 0 0 18px; color: #374151;">A customer sent a message through the contact form.</p>

        <div style="background: #f3f4f6; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
          <p style="margin: 4px 0; color: #374151;"><strong>Name:</strong> ${data.name}</p>
          <p style="margin: 4px 0; color: #374151;"><strong>Email:</strong> ${data.email}</p>
          <p style="margin: 4px 0; color: #374151;"><strong>WhatsApp:</strong> ${data.whatsapp}</p>
          <p style="margin: 4px 0; color: #374151;"><strong>Subject:</strong> ${data.subject}</p>
        </div>

        <div style="padding: 16px; background: #fff7fb; border-radius: 12px; border: 1px solid #fbcfe8;">
          <p style="margin: 0; color: #374151; white-space: pre-wrap; line-height: 1.7;">${data.message}</p>
        </div>
      </div>
    </div>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [ADMIN_EMAIL],
        subject: `New contact message from ${data.name}: ${data.subject}`,
        html,
      }),
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(result?.message || `Contact email failed with status ${response.status}`);
    }
  } catch (error) {
    console.error('Contact email send failed:', error);
  }
}
