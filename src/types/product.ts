export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  price: number;
  description: string;
  images: string[];
  video?: string;
  sizes?: string[];
  colors?: string[];
  stock: number;
  status: 'active' | 'draft' | 'out-of-stock';
  featured?: boolean;
  bestSeller?: boolean;
}

export type ProductCategory =
  | 'Clothing'
  | 'Shoes'
  | 'School Bags'
  | 'Bicycles'
  | 'Others'
  | 'Toys';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}
