
export type ViewType = 'home' | 'stylist' | 'Women' | 'Men' | 'Accessories' | 'cart' | 'profile' | 'search' | 'product' | 'collection' | 'signin';

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  isNew?: boolean;
  sizes: string[];
  colors: string[];
  description?: string;
  material?: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface Category {
  id: number;
  name: string;
  image: string;
  link: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: CartItem[];
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  defaultAddress: string;
}
