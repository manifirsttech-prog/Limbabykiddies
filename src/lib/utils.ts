export function formatPrice(price: number): string {
  return `₦${price.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

export function getStockStatus(stock: number): { label: string; className: string } {
  if (stock === 0) return { label: 'Out of Stock', className: 'text-red-500' };
  if (stock < 10) return { label: 'Low Stock', className: 'text-yellow-600' };
  return { label: 'In Stock', className: 'text-green-600' };
}
