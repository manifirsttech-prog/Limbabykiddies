import { Resend } from 'resend';

const clean = (value, max = 2000) => typeof value === 'string' ? value.trim().slice(0, max) : '';
const escapeHtml = (value = '') => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const money = (value) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(value);

function orderEmail(order, admin) {
  const itemRows = order.items.map((item) => {
    const image = /^https:\/\//i.test(item.image) ? `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.productName)}" width="76" height="76" style="width:76px;height:76px;object-fit:cover;border-radius:10px;display:block">` : '';
    const size = item.size ? item.size.toUpperCase() : 'Not selected';
    const color = item.color || 'Not selected';
    return `<tr><td style="padding:16px 0;border-bottom:1px solid #e5e7eb;width:88px">${image}</td><td style="padding:16px 12px;border-bottom:1px solid #e5e7eb;color:#1f2937"><div style="font-size:16px;font-weight:700;margin-bottom:7px">${escapeHtml(item.productName)}</div><div style="font-size:13px;line-height:1.7;color:#6b7280">Color: ${escapeHtml(color)}<br>Size: ${escapeHtml(size)}<br>Quantity: ${item.quantity}</div></td><td style="padding:16px 0;border-bottom:1px solid #e5e7eb;text-align:right;white-space:nowrap;color:#1f2937;font-weight:700">${money(item.price * item.quantity)}</td></tr>`;
  }).join('');
  const details = `<div style="background:#f9fafb;border-radius:12px;padding:16px;font-size:14px;line-height:1.7;color:#374151"><strong style="color:#111827">${escapeHtml(order.customerName)}</strong><br>${escapeHtml(order.customerEmail)}<br>${escapeHtml(order.customerPhone)}<br>${escapeHtml(order.customerAddress)}${order.notes ? `<br><br><strong style="color:#111827">Order note</strong><br>${escapeHtml(order.notes)}` : ''}</div>`;
  const title = admin ? 'New paid order' : 'Order confirmed';
  const message = admin ? 'A customer has completed checkout on Limbaby Kiddies.' : `Hi ${escapeHtml(order.customerName)}, thank you for shopping with Limbaby Kiddies. We have received your order and will contact you about delivery.`;
  return `<div style="margin:0;padding:32px 12px;background:#f6f7fb;font-family:Arial,Helvetica,sans-serif;color:#1f2937"><div style="max-width:680px;margin:0 auto;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 4px 18px rgba(17,24,39,0.08)"><div style="padding:28px 32px;background:#ec4899;color:#ffffff"><div style="font-size:14px;font-weight:700;letter-spacing:0.4px;text-transform:uppercase">Limbaby Kiddies</div><h1 style="margin:8px 0 0;font-size:28px;line-height:1.2;color:#ffffff">${title}</h1></div><div style="padding:30px 32px"><p style="margin:0 0 22px;font-size:15px;line-height:1.7;color:#4b5563">${message}</p><div style="padding:15px 16px;margin-bottom:26px;background:#fdf2f8;border:1px solid #fbcfe8;border-radius:12px;font-size:14px;line-height:1.7"><strong style="color:#111827">Order reference:</strong> ${escapeHtml(order.paymentReference || 'N/A')}<br><strong style="color:#111827">Order date:</strong> ${escapeHtml(order.orderDate)}</div><h2 style="margin:0 0 12px;font-size:18px;color:#111827">Customer and delivery details</h2>${details}<h2 style="margin:28px 0 4px;font-size:18px;color:#111827">Order items</h2><table role="presentation" style="width:100%;border-collapse:collapse"><tbody>${itemRows}</tbody></table><div style="margin-top:22px;padding-top:18px;border-top:2px solid #f3f4f6;text-align:right;font-size:20px;font-weight:700;color:#111827">Total: <span style="color:#ec4899">${money(order.total)}</span></div></div></div></div>`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL;
  const from = process.env.RESEND_FROM_EMAIL || 'Limbaby Kiddies <onboarding@resend.dev>';
  if (!apiKey || !adminEmail) return res.status(503).json({ error: 'Email service is not configured on the server.' });

  try {
    const { type, data = {} } = req.body || {};
    const resend = new Resend(apiKey);
    if (type === 'contact') {
      const contact = { name: clean(data.name, 120), email: clean(data.email, 254).toLowerCase(), whatsapp: clean(data.whatsapp, 60), subject: clean(data.subject, 200), message: clean(data.message, 4000) };
      if (!contact.name || !isEmail(contact.email) || !contact.whatsapp || !contact.subject || !contact.message) return res.status(400).json({ error: 'Please provide all contact form fields.' });
      const result = await resend.emails.send({ from, to: adminEmail, replyTo: contact.email, subject: `Contact form: ${contact.subject}`, html: `<div style="font-family:Arial,sans-serif"><h1>New contact message</h1><p><b>Name:</b> ${escapeHtml(contact.name)}<br><b>Email:</b> ${escapeHtml(contact.email)}<br><b>WhatsApp:</b> ${escapeHtml(contact.whatsapp)}<br><b>Subject:</b> ${escapeHtml(contact.subject)}</p><p style="white-space:pre-wrap">${escapeHtml(contact.message)}</p></div>` });
      if (result.error) throw new Error(result.error.message);
    } else if (type === 'order') {
      const order = { customerName: clean(data.customerName, 120), customerEmail: clean(data.customerEmail, 254).toLowerCase(), customerPhone: clean(data.customerPhone, 60), customerAddress: clean(data.customerAddress, 500), notes: clean(data.notes, 1000), paymentReference: clean(data.paymentReference, 160), orderDate: clean(data.orderDate, 120), total: Number(data.total), items: Array.isArray(data.items) ? data.items.slice(0, 40).map((item) => ({ productName: clean(item.productName, 200), quantity: Number(item.quantity), price: Number(item.price), image: clean(item.image, 2000), size: clean(item.size, 100), color: clean(item.color, 100) })) : [] };
      if (!order.customerName || !isEmail(order.customerEmail) || !order.customerPhone || !order.customerAddress || !order.orderDate || !Number.isFinite(order.total) || order.total < 0 || !order.items.length || order.items.some((item) => !item.productName || !Number.isInteger(item.quantity) || item.quantity < 1 || !Number.isFinite(item.price) || item.price < 0)) return res.status(400).json({ error: 'Invalid order email data.' });
      const ref = order.paymentReference || 'Order';
      const [customer, admin] = await Promise.all([resend.emails.send({ from, to: order.customerEmail, subject: `Your Limbaby Kiddies order confirmation - ${ref}`, html: orderEmail(order, false) }), resend.emails.send({ from, to: adminEmail, replyTo: order.customerEmail, subject: `New order from ${order.customerName} - ${ref}`, html: orderEmail(order, true) })]);
      if (customer.error || admin.error) throw new Error(customer.error?.message || admin.error?.message || 'Resend rejected the email.');
    } else return res.status(400).json({ error: 'Unknown email notification type.' });
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Email delivery failed:', error instanceof Error ? error.message : error);
    return res.status(502).json({ error: 'Email delivery failed. Please try again.' });
  }
}