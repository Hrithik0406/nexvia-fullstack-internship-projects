export interface Vendor {
  id: string;
  storeName: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  commissionRate: number;
  balance?: number;
  totalSales?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  comparePrice?: number | null;
  stock: number;
  imageUrl: string;
  isFeatured: boolean;
  categoryId: string;
  vendorId: string;
  category?: Category;
  vendor?: Vendor;
  rating?: number;
  reviewCount?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'VENDOR' | 'ADMIN';
  vendorProfile?: Vendor;
}

export interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  vendorCut: number;
  status: string;
  product: Product;
  vendor?: {
    id: string;
    storeName: string;
    logoUrl?: string;
  };
}

export interface Order {
  id: string;
  orderNumber: string;
  totalAmount: number;
  platformFee: number;
  status: string;
  paymentStatus: string;
  shippingAddress: string;
  createdAt: string;
  items: OrderItem[];
}
