/**
 * Format a number as currency
 */
export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

/**
 * Generate a URL-friendly slug from a string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Truncate text to a specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Get a status color class based on stock level
 */
export function getStockStatus(stock: number): { label: string; className: string } {
  if (stock === 0) return { label: 'Out of Stock', className: 'text-red-500' };
  if (stock < 10) return { label: 'Low Stock', className: 'text-yellow-600' };
  return { label: 'In Stock', className: 'text-green-600' };
}
